import chalk from "chalk";

function color(str) {
    let parts = [];
    let lastIndex = 0;

    for (let match of str.matchAll(/```(.*?)```/gs)) {
        let before = str.slice(lastIndex, match.index);
        let colored = chalk.green(match[1]);
        lastIndex = match.index + match[0].length;

        parts.push(chalk.cyan(before));
        parts.push(colored);
    }

    parts.push(chalk.cyan(str.slice(lastIndex)));

    return parts.join("");
}

export default color;