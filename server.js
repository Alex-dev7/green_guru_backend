import * as dotenv from 'dotenv'
import { OpenAI } from "openai"
import express from 'express'
import path from 'path'
import morgan from 'morgan'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
dotenv.config()
// const { OPENAI_API_KEY, PORT } = process.env


// Setup Express
const app = express();
app.use(express.json())
app.use(cors());
app.use(morgan("dev"));
// app.use(express.urlencoded({ extended: true }));
const upload = multer({dest: 'uploads/'})
// app.use(multer({dest: 'uploads/'}).any());



// // Set up storage for uploaded files
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + '-' + file.originalname);
//     }
//   });
  
//   // Create the multer instance
//   const upload = multer({ storage: storage });



// Set up OpenAI Client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})




// Retrieve assistant
const assistant  = await openai.beta.assistants.retrieve(
    process.env.ASSISTANT_ID
  )

const assistantId = assistant.id
let pollingInterval;


// Set up a Thread
async function createThread() {
    console.log('Creating a new thread...');
    const thread = await openai.beta.threads.create();
    return thread;
}


// Adding message
async function addMessage(threadId, message, upload_file) {
    console.log('Adding a new message to thread: ' + threadId);
    
    const file = await openai.files.create({
        file: fs.createReadStream(upload_file),
        purpose: "assistants",
      });

    const response = await openai.beta.threads.messages.create(
        threadId,
        {
            role: "user",
            content: message || "review this contract",
            file_ids: [file.id]
        }
    );
    console.log(response)
    return response;
}



// Running the assistant
async function runAssistant(threadId) {
    console.log('Running assistant for thread: ' + threadId)
    const response = await openai.beta.threads.runs.create(
        threadId,
        { 
          assistant_id: assistantId
          // Make sure to not overwrite the original instruction, unless you want to
        }
      );

    console.log(response)

    return response;
}




// Have to check the status of our run

async function checkingStatus(res, threadId, runId) {
    const runObject = await openai.beta.threads.runs.retrieve(
        threadId,
        runId
    );

    const status = runObject.status
    console.log(runObject)
    console.log('Current status: ' + status);

    // We can add a conditional logic for all possible values like expired, failed, and so on. 
    
    if(status == 'completed') {
        clearInterval(pollingInterval);

        const messagesList = await openai.beta.threads.messages.list(threadId);
        let messages = []
        
        messagesList.body.data.forEach(message => {
            messages.push(message.content);
        });

        res.json({ messages });
    }
}







// --------------------- ROUTES --------------------- //


// route for creating a new thread
// Make sure to only call this method once per user
// You can save the threadId or session in the frontend part of your code as well, so you can always pass your thread id for the next request
app.get('/thread', (req, res) => {
    createThread().then(thread => {
        res.json({ threadId: thread.id });
    });
})



// Route for adding a message
app.post('/message', upload.single('file'),  (req, res) => {
    const { message, threadId } = req.body;
    console.log(req.body, "   REQUEST BODY ______")
    const reqFile = req.file ? req.file.path : null;
    // console.log(reqFile)
    addMessage(threadId, message, reqFile).then(message => {
        // Run the assistant
        runAssistant(threadId).then(run => {
            const runId = run.id;           
            
            // Check the status
            pollingInterval = setInterval(() => {
                checkingStatus(res, threadId, runId);
            }, 5000)
        });
    });
  });





// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});