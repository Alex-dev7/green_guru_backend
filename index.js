import * as dotenv from 'dotenv'
import { OpenAI } from "openai"
import express from 'express'
import morgan from 'morgan'
import multer from 'multer'
import cors from 'cors'
import fs from 'fs'
dotenv.config()

const corsOptions = {
    origin: 'https://chat-bot-red-phi.vercel.app',
    optionsSuccessStatus: 200 
  }
  
// Setup Express
const app = express();
app.use(express.json())
app.use(cors(corsOptions));
app.use(morgan("dev"));

// uncoment this if you want to store the files
// const upload = multer({dest: 'uploads/'})



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
async function addMessage(threadId, message) {
    console.log('Adding a new message to thread: ' + threadId);

    // If there is a file, we have to upload it first
    // const file = await openai.files.create({
    //     file: fs.createReadStream(upload_file),
    //     purpose: "assistants",
    //   });

    const response = await openai.beta.threads.messages.create(
        threadId,
        {
            role: "user",
            content: message,
        }
    );
    console.log(response)

    // Delete the file after it has been sent
    // fs.unlink(upload_file, (err) => {
    //     if (err) {
    //         console.error('There was an error deleting the file:', err);
    //     } else {
    //         console.log('File deleted successfully');
    //     }
    // });

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
        // deleteThread(threadId);
    }

}

// Delete the thread after it has been used beceause at the moment we are not storing the threadId in a database
async function deleteThread(threadId) {
    const deletedThread = await openai.beta.threads.del(threadId);
    console.log("Deleted thread object " + deletedThread)
}


// Get all messages
async function getMessages(threadId, res) {
    const messagesList = await openai.beta.threads.messages.list(threadId);
    let messages = []
    console.log("Retrieving messages from thread: " + threadId)
    messagesList.body.data.forEach(message => {
        messages.push(message.content);
    });

    res.json({ messages });
}


// --------------------- ROUTES --------------------- //

// home route
app.get('/', (req, res) => {
  res.json('Green Guru is here!');
})


// route for creating a new thread
// Make sure to only call this method once per user
// You can save the threadId or session in the frontend part of your code as well, so you can always pass your thread id for the next request
app.get('/thread', (req, res) => {
    createThread().then(thread => {
        res.json({ threadId: thread.id });
    });
})


// Route for getting all messages
app.get('/list/:localStorageId', (req, res) => {
    const { localStorageId } = req.params;
    getMessages(localStorageId, res);
})



// Route for adding a message
app.post('/message',  (req, res) => {
    const { message, threadId } = req.body;
    console.log('Message: ' + message);
    addMessage(threadId, message).then(message => {
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});