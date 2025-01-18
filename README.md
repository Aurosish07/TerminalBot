# TerminalBot (Jarvis)

TerminalBot, also known as Jarvis, is a command-line tool that interacts with the Groq A.I model to provide programming-related assistance and more. This tool is designed to help you with various programming queries directly from your terminal. However it can also assist you with other queries. 

## Features
- Provides programming-related assistance
- has varios built in commands to trace your wrong commands on terminal and debug file

![Features Demo](.github/assets/demo.gif)

## Installation

### Prerequisites
- Node.js and npm installed on your machine

### Steps
1. **Install the package globally**:
    ```sh
    npm install -g terminalbot
    ```

2. **Set up API Key**:
    - Go to [Groq Playground](https://console.groq.com/playground) and sign up to get your API key.
    - Run the following command in your terminal:
    ```sh
    jarvis
    ```
    - When prompted, type `/key` and enter your new API key. This will store the API key securely in a local `.env` file.
    - Exit the application and restart it:
    ```sh
    jarvis
    ```

3. **Adjust PowerShell Execution Policy (Windows only)**:
    If you encounter a PowerShell execution policy error, you can change the policy to `RemoteSigned`:
    ```sh
    Set-ExecutionPolicy -Scope LocalMachine -ExecutionPolicy RemoteSigned -Force
    ```

## Usage

After installation and setup, you can start using TerminalBot by running the following command:
```sh
jarvis
```

## Commands

/bye: Exit the application.

/key: Update your API key.

/trace: Trace the execution of the provided file.

/debug file.extname: Debug the specified file.
