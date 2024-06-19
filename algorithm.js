import chalk from "chalk";

function color(str) {
    let parts = [];
    let lastIndex = 0;

    // Adjusted regex to handle multi-line code blocks correctly
    for (let match of str.matchAll(/```([\s\S]*?)```/g)) {
        let before = str.slice(lastIndex, match.index);
        let colored = chalk.green(match[1]);
        lastIndex = match.index + match[0].length;

        parts.push(chalk.cyan(before));
        parts.push(colored);
    }

    // Handle any remaining part of the string after the last match
    parts.push(chalk.cyan(str.slice(lastIndex)));

    return parts.join("");
}

export default color;
