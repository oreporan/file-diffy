#! /usr/bin/env node
const fs = require('fs')

module.exports.command = "run";
module.exports.describe = "tokens='diffy1' 'diffy2' files='file1.js file2.ts file3.css'";
module.exports.builder = {
    'files':{
        description: 'space separated file names, for example "some/file.js some-other/file.ts"',
        required: true,
        alias:'f'
    },
    'tokens':{
        type: 'array',
        description: 'The array of options you want to differentiate on, for example ["web", "mobile"]',
        required: true,
        alias:'d'
    },
    'outputType':{
        description: 'json/txt/log',
        required: false,
        default: 'log',
        alias:'ot'
    }
};

module.exports.handler = async ({tokens, files, outputType}) => {
    try {
        const occurences = findOccurences(tokens, files)
        outputOccurences({occurences, outputType})
    } catch (error) {
        console.log("And the error is ", error);
        process.exit(1)
    } finally {
    }
}

const outputOccurences = ({occurences, outputType}) => {
    switch(outputType)
    {
        case 'json':
            fs.writeFileSync(`${__dirname}/output.json`, JSON.stringify(occurences, null, 4))
            break;
        case 'txt':
            fs.writeFileSync(`${__dirname}/output.txt`, Object.keys(occurences).join('\n'))
            break;
        case 'log':
            console.log(Object.keys(occurences).join(' '))
            break;
        default:
        throw new Error(`unknown type, only json/txt/list is allowed, receieved: ${outputType}`)
    }
   
}

const findOccurences = (diffys, files) => {
    let filesInProgress = files.repeat(1);
    let occs =  diffys.reduce((acc, curr) => {
        const patt = new RegExp(`[^ ]*[\/|\.| ]${curr}[\/|\.][^ ]*`, 'g')
        filesInProgress = filesInProgress.replace(patt, "")
        if (patt.test(files)) acc[curr] = true
        return acc
    }, [])
    if (filesInProgress.trim().length > 0) occs['other'] = true
    return occs
}