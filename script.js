#! /usr/bin/env node
const {version} = require('./package.json');

(async () => {
    try {
        const argv = require('yargs')
            .demandCommand(1)
            .usage('git-packages <command> [options]')
            .version(version)
            .commandDir('cmds')
            .argv
    } catch (error) {
        console.log("And the error is ", error);
        process.exit(1)
    }
})()
