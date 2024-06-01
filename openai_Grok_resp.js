import axios from 'axios';
import cliSpinners from 'cli-spinners';
import ora from 'ora';

async function getGptResponse(data) {
    const loading = ora({
        spinner: cliSpinners.clock,
    }).start();

    try {
        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", data, {
            headers: {
                'Authorization': `Bearer ${process.env.grok_key}`,
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