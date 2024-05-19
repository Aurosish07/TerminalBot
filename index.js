import axios from "axios";
import inquirer from "inquirer";
import cliSpinners from 'cli-spinners';
import ora from "ora";
import chalk from "chalk";
import dotenv from "dotenv";
import color from "./algorithm.js";

dotenv.config();

const MAX_CONVERSATIONS = 5;
let history = [
    {
        role: "system",
        content: `You are an helpful assistant specifically designed to answer programming-related questions. However, you can answer other questions too. If you have to provide any code response, provide it without any comments .`
    }
];

async function getResponse(data) {
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
        return response.data.choices[0].message.content;
    } catch (error) {
        loading.fail();
        console.error("Error:", error);
        return null;
    }
}

async function startChat() {
    while (true) {
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "message",
                default: "Type your message (/bye to exit, /? for help)",
                message: chalk.green("\n::-> ")
            }
        ]);

        const req = answers.message.trim();

        if (req.toLowerCase() === "/bye") {
            console.log(chalk.yellow("\nGoodbye!"));
            break;
        }

        let userMessage = {
            role: "user",
            content: req
        };

        history.push(userMessage);

        const data = {
            model: "gpt-3.5-turbo-1106",
            messages: history
        };

        const botResponse = await getResponse(data);

        if (botResponse) {
            let assistantMessage = {
                role: "assistant",
                content: botResponse
            };

            history.push(assistantMessage);

            // Ensure only the last MAX_CONVERSATIONS are kept (each conversation is 2 messages)
            if (history.length > MAX_CONVERSATIONS * 2 + 1) {
                history = [history[0], ...history.slice(-MAX_CONVERSATIONS * 2)];
            }

            console.log(`${chalk.cyan("\n🤖 ->")}`, color(botResponse));
        } else {
            console.log(chalk.red("\nError: Failed to get a response from the assistant. Please try again."));
        }
    }
}

startChat();
