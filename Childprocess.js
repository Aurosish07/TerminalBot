import inquirer from 'inquirer';
import { exec } from 'child_process';

const { prompt } = inquirer;

async function ChildExe() {
    const answers = await prompt([
        {
            type: 'input',
            name: 'command',
            message: 'Enter your command (type /exit to quit):',
        }
    ]);

    const { command } = answers;

    if (command.toLowerCase() === '/exit') {
        return '/exit';
    }

    console.log(`Executing: ${command}`);

    try {
        const { stdout, stderr } = await executeCommand(command);
        if (stdout) console.log(`Stdout: ${stdout}`);
        if (stderr) console.log(`Stderr: ${stderr}`);

        return `Command: ${command}\nOutput: ${stdout || stderr}`;
    } catch (error) {
        console.log(`Error: ${error.message}`);
        return `Command: ${command}\nOutput: ${error.message}`;
    }
}

function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) return reject(error);
            return resolve({ stdout, stderr });
        });
    });
}

export default ChildExe;
