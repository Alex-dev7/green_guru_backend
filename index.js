import * as dotenv from 'dotenv'
import { OpenAI } from "openai"


dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

const assistant  = await openai.beta.assistants.retrieve(
    "asst_u6WHvnopqDA4y3IFvhpiGzTh"
)

// console.log(assistant)

// Threads
// const thread  = await openai.beta.threads.create()


// Create Message 
// const message = await openai.beta.threads.messages.create(thread.id, {
//     role: "user",
//     content: "What is the industry standart for agent's commission?"
// })



// Run assistant 
// const run = await openai.beta.threads.runs.create(thread.id, {
//     assistant_id: assistant.id,
//     instructions: "Adress the user as [userName]",
// })


// run assistent with thread and run ids
// const run = await openai.beta.threads.runs.retrieve(
//     'thread_ft4hn5dwKAs8oczmrWQCQj9C', // should be fetched from the database
//     'run_qWWjYtZFxKfjSHO1HQySL42v', // // should be fetched from the database
// )


// this is goin to retrieve the latest list of messages assigned to this thread
const messages = await openai.beta.threads.messages.list(
    'thread_ft4hn5dwKAs8oczmrWQCQj9C', // should be fetched from the database
)


console.log(messages)