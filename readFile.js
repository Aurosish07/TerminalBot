import { readFileSync } from 'node:fs';
import os from 'os';
import path from 'path';
import { exec } from 'node:child_process';

let context_window = 12000;

async function readContent(file) {
    try {
        let data = readFileSync(file, 'utf-8');
        data = data.replace(/ +/g, ' ');

        // Replace multiple newlines with a single newline
        data = data.replace(/\n+/g, '\n');

        // Trim the content to remove leading and trailing spaces
        data = data.trim();

        const estimatedTokens = data.length;


        if (estimatedTokens > context_window) {
            // Truncate content to fit within the context window
            const truncatedContent = data.substring(0, context_window);
            return truncatedContent;
        }

        return data;
    } catch (err) {
        console.error(err);
        return null;
    }
}

const compilers = {
    '.js': 'node',      // JavaScript
    '.py': 'python',    // Python
    '.java': 'javac',   // Java (for compilation)
    '.c': 'gcc',        // C
    '.cpp': 'g++',      // C++
    '.c++': 'g++',      // C++
    '.go': 'go run',    // Go
    '.rb': 'ruby',      // Ruby
    '.php': 'php',      // PHP
};

async function compile(file) {
    const ext = path.extname(file);
    let compiler = compilers[ext];

    if (!compiler) {
        return `No need compiling for this file type: ${ext}`;
    }

    const isWindows = os.platform() === 'win32';
    let command;

    if (compiler === "node" || compiler === "python" || compiler === "php" || compiler === "ruby" || compiler === "go run") {
        command = `${compiler} ${file}`;
    } else if (compiler === "javac") {
        const className = path.basename(file, '.java');
        command = `javac ${file} && java ${className}`;
    } else if (compiler === "gcc") {
        const exeName = path.basename(file, '.c');
        command = `gcc ${file} -o ${exeName}${isWindows ? '.exe' : ''} && ${isWindows ? `${exeName}.exe` : `./${exeName}`}`;
    } else if (compiler === "g++") {
        const exeName = path.basename(file, '.cpp');
        command = `g++ ${file} -o ${exeName}${isWindows ? '.exe' : ''} && ${isWindows ? `${exeName}.exe` : `./${exeName}`}`;
    }

    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                resolve(`Error: ${err.message}`);
            } else if (stderr) {
                resolve(`Stderr: ${stderr}`);
            } else {
                resolve(`Stdout: ${stdout}`);
            }
        });
    });
}

async function PromptReady(fileName) {
    try {
        let compileOutput = await compile(fileName);
        let fileContent = await readContent(fileName);

        let res = `Code:\n${fileContent}\n\nCompilation Output:\n${compileOutput}`;
        return res;
    } catch (error) {
        console.error(`Error in PromptReady: ${error.message}`);
    }
}

export { PromptReady };
