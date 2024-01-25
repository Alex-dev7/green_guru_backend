import * as dotenv from 'dotenv'
import { OpenAI } from "openai"


dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})


async function main(){
const assistant  = await openai.beta.assistants.retrieve(
    "asst_u6WHvnopqDA4y3IFvhpiGzTh"
)

// console.log(assistant)

// Threads
const thread  = await openai.beta.threads.create()
console.log("This is the thread object: ", thread, "\n");


// Create Message 
const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: "What is the industry standart for agent's commission?",
})
console.log("This is the message object: ", message, "\n");


// Run assistant 
const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: assistant.id,
    instructions: "Adress the user as DUDE",
})
console.log("This is the run object: ", run, "\n");


// Periodically retrieve the Run to check on its status to see if it has moved to completed
const retrieveRun = async () => {
    let keepRetrievingRun;

    while (run.status === "queued" || run.status === "in_progress") {
      keepRetrievingRun = await openai.beta.threads.runs.retrieve(
        thread.id,
        run.id,
      );
      console.log(`Run status: ${keepRetrievingRun.status}`);

      if (keepRetrievingRun.status === "completed") {
        console.log("\n");

        // Step 6: Retrieve the Messages added by the Assistant to the Thread
        const allMessages = await openai.beta.threads.messages.list(
          thread.id,
        );

        console.log(
          "------------------------------------------------------------ \n"
        );

        console.log("User: ", message.content[0].text.value);
        console.log("Assistant: ", allMessages.data[0].content[0].text.value);

        break;
      } else if (
        keepRetrievingRun.status === "queued" ||
        keepRetrievingRun.status === "in_progress"
      ) {
        // pass
      } else {
        console.log(`Run status: ${keepRetrievingRun.status}`);
        break;
      }
    }
  };
  retrieveRun();
}

main()

// run assistent with thread and run ids
// const run = await openai.beta.threads.runs.retrieve(
//     'thread_ft4hn5dwKAs8oczmrWQCQj9C', // should be fetched from the database
//     'run_qWWjYtZFxKfjSHO1HQySL42v', // // should be fetched from the database
// )


// this is goin to retrieve the latest list of messages assigned to this thread
// const messages = await openai.beta.threads.messages.list(
//     'thread_ft4hn5dwKAs8oczmrWQCQj9C', // should be fetched from the database
// )
