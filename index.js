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
const thread  = await openai.beta.threads.create()


// Create Message 
const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "What is the industry standart for agent's commission?"
})

// Run assistant 
