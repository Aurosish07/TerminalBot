import axios from "axios";
import inquirer from "inquirer";
import cliSpinners from 'cli-spinners';
import ora from "ora";
import { spinners } from "ora";
import chalk from "chalk";
import dotenv from "dotenv";
import color from "./algorithm.js";

dotenv.config();

let history = [

    {
        role: "system",
        content: `You are an helpful assistant specifically designed to answer programming-related questions. However, you can answer other questions too. If you have to provide any code response, provide it without any comments in a diffirent header.`
    }

];

async function startChat() {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "message",
            default: "Type your message ( /? for help ",
            message: chalk.green("\n::-> ")
        }
    ]);

    const req = answers.message.trim();

    if (req.toLowerCase() === "/bye") {
        console.log(chalk.yellow("\tGoodbye !"));
        process.exit(1);
    }

    let objUser = {
        role: "user",
        content: req
    }

    history.push(objUser);

    console.log(history)

    const data = {
        model: "gpt-3.5-turbo-1106",
        messages: history
    };



    const loading = ora({
        spinner: cliSpinners.clock,
    }).start();

    try {
        const response = await axios.post("https://api.openai.com/v1/chat/completions", data, {
            headers: {
                'Authorization': `Bearer ${process.env.key}`,
                'Content-Type': 'application/json'
            }
        });
        loading.stop();


        let finalResp = response.data.choices[0].message.content;




        let objSystem = {
            role: "assistant",
            content: finalResp
        }


        history.push(objSystem);
        // data.messages.push(objSystem);
        console.log(history)


        console.log(`${chalk.cyan("\n🤖 ->")}`, color(finalResp));
    } catch (error) {
        loading.fail();
        console.error("Error:", error);
    }

    startChat();
}

startChat();
