import axios from 'axios';
import cliSpinners from 'cli-spinners';
import ora from 'ora';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import os from 'os';

const homeDir = os.homedir();
const homeEnvPath = path.join(homeDir, '.TerminalBot', '.env');

// Load environment variables from the homeEnvPath
dotenv.config({ path: homeEnvPath });

async function getGptResponse(data) {
    const loading = ora({
        spinner: cliSpinners.clock,
    }).start();

    try {
        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", data, {
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`,
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

export default getGptResponse;