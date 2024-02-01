// // import * as dotenv from 'dotenv'
// import express from 'express'
// import cors from 'cors'
// import morgan from 'morgan'
// import { OpenAI } from "openai"
// import multer from 'multer'
// import fs from 'fs'
// // import pdfParse from 'pdf-parse'
// import bodyParser from 'body-parser'

// let fileIds = []; // Store file IDs
// let uploadedFileIds = []; // Store uploaded file IDs

// dotenv.config()
// const app = express();
// const PORT = process.env.PORT

// // Enable CORS for your front-end
// const corsOptions = {
//     origin: "http://127.0.0.1:5500",
// }

// app.use(cors(corsOptions))
// app.use(express.json())
// app.use(morgan("dev"))
// app.use(bodyParser.urlencoded({ extended: true }))
// const upload = multer({dest: 'uploads/'})

// const openai = new OpenAI({
//     // apiKey: process.env.OPENAI_API_KEY,
// })


// const threadByUser = {}; // Store thread IDs by user

// // Retrieve assistant
// const assistant  = await openai.beta.assistants.retrieve(
  
// )


// app.get('/', (req, res) => {
//   res.send("Welcome to Contract Wizard!")
// })


// app.post('/chat',upload.single('file'), async (req, res) => {

//   const userId = req.body.userId; // You should include the user ID in the request

//   // Create a new thread if it's the user's first message
//   if (!threadByUser[userId]) {
//     try {
//       const myThread = await openai.beta.threads.create();
//       console.log("New thread created with ID: ", myThread.id, "\n");
//       threadByUser[userId] = myThread.id; // Store the thread ID for this user
//     } catch (error) {
//       console.error("Error creating thread:", error);
//       res.status(500).json({ error: "Internal server error" });
//       return;
//     }
//   }

//   const userMessage = req.body.message;

//   // Add a Message to the Thread
//   try {
//     const myThreadMessage = await openai.beta.threads.messages.create(
//       threadByUser[userId], // Use the stored thread ID for this user
//       {
//         role: "user",
//         content: "review this file",
//       }
//     );
//     console.log("This is the message object: ", myThreadMessage, "\n");

//         // Run the Assistant
//         // Run assistant 
//     const run = await openai.beta.threads.runs.create(
//       threadByUser[userId], {// Use the stored thread ID for this user
//       assistant_id: assistant.id,
//       instructions: "Adress the user as DUDE",
//     })
//     console.log("This is the run object: ", run, "\n");

//     // Periodically retrieve the Run to check on its status
//     const retrieveRun = async () => {
//       let keepRetrievingRun;

//       while (run.status !== "completed") {
//         keepRetrievingRun = await openai.beta.threads.runs.retrieve(
//           threadByUser[userId], // Use the stored thread ID for this user
//           run.id
//         );

//         console.log(`Run status: ${keepRetrievingRun.status}`);

//         if (keepRetrievingRun.status === "completed") {
//           console.log("\n");
//           break;
//         }
//       }
//     };
//     retrieveRun();

//     // Retrieve the Messages added by the Assistant to the Thread
//     const waitForAssistantMessage = async () => {
//       await retrieveRun();

//       const allMessages = await openai.beta.threads.messages.list(
//         threadByUser[userId] // Use the stored thread ID for this user
//       );

//       // Send the response back to the front end
//       res.status(200).json({
//         response: allMessages.data[0].content[0].text.value,
//       });
//       console.log(
//         "------------------------------------------------------------ \n"
//       );

//       console.log("User: ", myThreadMessage.content[0].text.value);
//       console.log("Assistant: ", allMessages.data[0].content[0].text.value);
//     };
//     waitForAssistantMessage();
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }

// })



// // ----------------------------------------------------------------


// app.post('/upload', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.')
//   }

//   try {
//       // Read the file buffer
//       const dataBuffer = fs.readFileSync(req.file.path)

//       // Extract text from the PDF
//       // let data = await pdfParse(dataBuffer)

//       // res.send(data.text);

//       // Threads
//       const thread  = await openai.beta.threads.create()
//       console.log("This is the thread object: ", thread, "\n")


//       // Create Message 
//       const message = await openai.beta.threads.messages.create(thread.id, {
//           role: "user",
//           content: "Review this contract",

//       })
//         console.log("This is the message object: ", message, "\n");


//       // Run assistant 
//       const run = await openai.beta.threads.runs.create(thread.id, {
//           assistant_id: assistant.id,
//           instructions: "Adress the user as DUDE",
//       })
//       console.log("This is the run object: ", run, "\n");


//       // Periodically retrieve the Run to check on its status to see if it has moved to completed
//       const retrieveRun = async () => {
//           let keepRetrievingRun;

//           while (run.status === "queued" || run.status === "in_progress") {
//             keepRetrievingRun = await openai.beta.threads.runs.retrieve(
//               thread.id,
//               run.id,
//             );
//             console.log(`Run status: ${keepRetrievingRun.status}`);

//             if (keepRetrievingRun.status === "completed") {
//               console.log("\n");

//               // Step 6: Retrieve the Messages added by the Assistant to the Thread
//               const allMessages = await openai.beta.threads.messages.list(
//                 thread.id,
//               );

//               console.log(
//                 "------------------------------------------------------------ \n"
//               );

//               console.log("User: ", message.content[0].text.value);
//               console.log("Assistant: ", allMessages.data[0].content[0].text.value);

//               break;
//             } else if (
//               keepRetrievingRun.status === "queued" ||
//               keepRetrievingRun.status === "in_progress"
//             ) {
//               // pass
//             } else {
//               console.log(`Run status: ${keepRetrievingRun.status}`);
//               break;
//             }
//           }
//         };
//         retrieveRun();

  

//     // res.json({ message: 'File uploaded successfully' });
//     // console.log(fileIds)
//     // console.log("test" + uploadedFileIds)
//   } catch (error) {
//     console.error('Error uploading file to OpenAI:', error);
//     res.status(500).send('Error processing file.');
//   } finally {
//     fs.unlinkSync(req.file.path); // Clean up the local file
//   }
// });



// // ----------------------------------------------------------------

































// async function main(){
// const assistant  = await openai.beta.assistants.retrieve(
    
// )

// // console.log(assistant)

// // Threads
// const thread  = await openai.beta.threads.create()
// console.log("This is the thread object: ", thread, "\n");


// // Create Message 
// const message = await openai.beta.threads.messages.create(thread.id, {
//     role: "user",
//     content: "What is the industry standart for agent's commission?",

// })
// console.log("This is the message object: ", message, "\n");


// // Run assistant 
// const run = await openai.beta.threads.runs.create(thread.id, {
//     assistant_id: assistant.id,
//     instructions: "Adress the user as DUDE",
// })
// console.log("This is the run object: ", run, "\n");


// // Periodically retrieve the Run to check on its status to see if it has moved to completed
// const retrieveRun = async () => {
//     let keepRetrievingRun;

//     while (run.status === "queued" || run.status === "in_progress") {
//       keepRetrievingRun = await openai.beta.threads.runs.retrieve(
//         thread.id,
//         run.id,
//       );
//       console.log(`Run status: ${keepRetrievingRun.status}`);

//       if (keepRetrievingRun.status === "completed") {
//         console.log("\n");

//         // Step 6: Retrieve the Messages added by the Assistant to the Thread
//         const allMessages = await openai.beta.threads.messages.list(
//           thread.id,
//         );

//         console.log(
//           "------------------------------------------------------------ \n"
//         );

//         console.log("User: ", message.content[0].text.value);
//         console.log("Assistant: ", allMessages.data[0].content[0].text.value);

//         break;
//       } else if (
//         keepRetrievingRun.status === "queued" ||
//         keepRetrievingRun.status === "in_progress"
//       ) {
//         // pass
//       } else {
//         console.log(`Run status: ${keepRetrievingRun.status}`);
//         break;
//       }
//     }
//   };
//   retrieveRun();
// }

// // main() 

// // run assistent with thread and run ids
// // const run = await openai.beta.threads.runs.retrieve(
// //     'thread_ft4hn5dwKAs8oczmrWQCQj9C', // should be fetched from the database
// //     'run_qWWjYtZFxKfjSHO1HQySL42v', // // should be fetched from the database
// // )


// // this is goin to retrieve the latest list of messages assigned to this thread
// // const messages = await openai.beta.threads.messages.list(
// //     'thread_ft4hn5dwKAs8oczmrWQCQj9C', // should be fetched from the database
// // )
// app.listen(PORT, () => {
//     console.log(`listening on port ${PORT}`)
// })