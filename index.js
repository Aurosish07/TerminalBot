#!/usr/bin/env node

import inquirer from 'inquirer';
import chalk from 'chalk';
import dotenv from 'dotenv';
import color from './algorithm.js';
import chalkAnimation from 'chalk-animation';
import ChildExe from './Childprocess.js';
import getGptResponse from './openai_Grok_resp.js';
import { PromptReady } from "./readFile.js";
import path from 'path';
import os from 'os';

const homeDir = os.homedir();
const homeEnvPath = path.join(homeDir, '.TerminalBot', '.env');

dotenv.config({ path: homeEnvPath });  // Reload environment variables

const MAX_CONVERSATIONS = 10;
let history = [
    {
        role: 'system',
        content: `You are a helpful assistant specifically designed to answer programming-related questions. However, you can answer other questions too. If you have to provide any code response, provide it without any comments.`
    }
];

async function displayWithDelay(output, x) {
    const lines = output.split('\n');
    for (const line of lines) {
        console.log(line);
        await new Promise(resolve => setTimeout(resolve, x)); // Adjust the delay as needed
    }
}

async function startChat() {
    while (true) {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'message',
                default: 'Yes! sir , please type your message (/bye to exit, /help for help)',
                message: chalk.green('\n::-> ')
            }
        ]);

        const req = answers.message.trim();

        if (req.toLowerCase() === '/bye') {
            let animation = chalkAnimation.karaoke('\nGoodbye!');
            animation.start();
            setTimeout(() => {
                animation.stop();
                process.exit(0);  // Exit the process
            }, 1000);
            break;
        }
        if (req.toLowerCase() === '/key') {


            const answers = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'message',
                    default: 'Go to https://groq.com/ and signup to get your api key',
                    message: chalk.bold('Enter your new API key here : ')
                }
            ]);

            if (answers) {
                if (!fs.existsSync(path.dirname(homeEnvPath))) {
                    fs.mkdirSync(path.dirname(homeEnvPath), { recursive: true });
                }

                fs.writeFileSync(homeEnvPath, `API_KEY=${answers}\n`);

                console.log(chalk.green('API key updated successfully.'));

            } else {
                console.log(chalk.red('Please provide a new API key.'));
            }


        }
        else if (req.toLowerCase() === '/help' || req.toLowerCase() === '/?') {

            let help = `
                 /trace : Start tracing your commands and get info. on wrong command.\n
                
                 /debug filename.extention : to debug your code file along compilation, ex: /debug index.js\n
                
                 /bye : to exit the bot
                `;
            await displayWithDelay(color(help), 300);


        }
        else if (req.toLowerCase() === '/trace') {
            history.push({
                role: 'system',
                content: `You are now an assistant to help users with command-line operations your will recive user commands also the output so you have to do :- 
                - For incorrect commands, provide the correct format and a short explanation.
                - For code file errors, give the line number, error type, and a possible short solution.`
            });

            while (true) {
                let prompt = await ChildExe();

                if (prompt === '/exit') {
                    break; // Exit the trace mode loop
                }

                let userMessage = {
                    role: 'user',
                    content: prompt
                };

                history.push(userMessage);

                const data = {
                    model: 'mixtral-8x7b-32768',
                    messages: history,
                    max_tokens: 200,
                    temperature: 0.7
                };

                const botResponse = await getGptResponse(data);

                if (botResponse) {
                    let assistantMessage = {
                        role: 'assistant',
                        content: botResponse
                    };

                    history.push(assistantMessage);

                    // Ensure only the last MAX_CONVERSATIONS are kept (each conversation is 2 messages)
                    if (history.length > MAX_CONVERSATIONS * 2 + 1) {
                        history = [history[0], ...history.slice(-MAX_CONVERSATIONS * 2)];
                    }

                    console.log(chalk.cyan('\n🤖 ->'));
                    await displayWithDelay(color(botResponse), 500);
                } else {
                    console.log(chalk.red('\nError: Failed to get a response from the assistant. Please try again.'));
                }
            }

        } else if (req.toLowerCase().includes('/debug')) {

            let filename = req.split(" ")[1];

            try {
                let result = await PromptReady(filename);

                history.push({
                    role: 'system',
                    content: `
                        You are an AI assistant designed to help users with coding and debugging tasks. You will be provided with the content of a code file and the output from compiling or running that file. Your task is to:
                        1. Identify any errors or issues in the code.
                        2. Provide only the parts where correction needed and a brief explanation for any incorrect commands.
                        3. Suggest possible solutions for any compilation or runtime errors, including line numbers and error types.
                        4. If the code is correct, provide a confirmation and brief explanation of what the code does.
                        Please ensure your responses are clear, concise, and helpful.
                    `
                });

                let userMessage = {
                    role: 'user',
                    content: result
                };

                history.push(userMessage);

                const data = {
                    model: 'mixtral-8x7b-32768',
                    messages: history,
                    max_tokens: 1000,
                    temperature: 0.7
                };

                const botResponse = await getGptResponse(data);

                if (botResponse) {
                    let assistantMessage = {
                        role: 'assistant',
                        content: botResponse
                    };

                    history.push(assistantMessage);

                    // Ensure only the last MAX_CONVERSATIONS are kept (each conversation is 2 messages)
                    if (history.length > MAX_CONVERSATIONS * 2 + 1) {
                        history = [history[0], ...history.slice(-MAX_CONVERSATIONS * 2)];
                    }

                    console.log(chalk.cyan('\n🤖 ->'));
                    await displayWithDelay(color(botResponse), 500);
                } else {
                    console.log(chalk.red('\nError: Failed to get a response from the assistant. Please try again.'));
                }
            } catch (err) {
                console.log(err.message);
            }

        } else {
            let inprompt = req;

            let userMessage = {
                role: 'user',
                content: inprompt
            };

            history.push(userMessage);

            const data = {
                model: 'mixtral-8x7b-32768',
                messages: history,
                max_tokens: 200,
                temperature: 0.7
            };

            const botResponse = await getGptResponse(data);

            if (botResponse) {
                let assistantMessage = {
                    role: 'assistant',
                    content: botResponse
                };

                history.push(assistantMessage);

                // Ensure only the last MAX_CONVERSATIONS are kept (each conversation is 2 messages)
                if (history.length > MAX_CONVERSATIONS * 2 + 1) {
                    history = [history[0], ...history.slice(-MAX_CONVERSATIONS * 2)];
                }

                console.log(chalk.cyan('\n🤖 ->'));
                await displayWithDelay(color(botResponse), 500);
            } else {
                console.log(chalk.red('\nError: Failed to get a response from the assistant. Please try again.'));
            }
        }
    }
}

startChat();
