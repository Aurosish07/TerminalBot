import inquirer from 'inquirer';
import { exec } from 'child_process';

const { prompt } = inquirer;

function ChildExe() {
    prompt([
        {
            type: 'input',
            name: 'command',
            message: 'Enter a command:',
        }
    ]).then(answers => {
        const { command } = answers;
        console.log(`Executing: ${command}`);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`Error: ${error.message}`);
            }
            if (stderr) {
                console.log(`Stderr: ${stderr}`);
            }
            if (stdout) {
                console.log(`Stdout: ${stdout}`);
            }

            // Ask for the next command
            ChildExe();
        });
    });
}

// Start the interactive session
// askForCommand();

export default ChildExe;