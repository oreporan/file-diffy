#! /usr/bin/env node
const fs = require('fs')

module.exports.command = "run";
module.exports.describe = "diffys='diffy1' 'diffy2' files='file1.js file2.ts file3.css'";
module.exports.builder = {
    'files':{
        description: 'space separated file names, for example "some/file.js some-other/file.ts"',
        required: true,
        alias:'f'
    },
    'diffys':{
        type: 'array',
        description: 'The array of options you want to differentiate on, for example ["web", "mobile"]',
        required: true,
        alias:'d'
    },
    'outputType':{
        description: 'json/txt/list, list being a txt file without =true',
        required: false,
        default: 'list',
        alias:'ot'
    },
    'output':{
        description: 'file name to write to',
        default: 'output.txt',
        required: false,
        alias:'o'
    }
};

module.exports.handler = async ({diffys, files, outputType, output}) => {
    try {
        const occurences = findOccurences(diffys, files)
        outputOccurences({occurences, outputType, output})
    } catch (error) {
        console.log("And the error is ", error);
        process.exit(1)
    } finally {
    }
}

const outputOccurences = ({occurences, outputType, output}) => {
    const fileName = `${__dirname}/${output}`
    switch(outputType)
    {
        case 'json':
            fs.writeFileSync(fileName, JSON.stringify(occurences, null, 4))
            break;
        case 'txt':
            fs.writeFileSync(fileName, Object.keys(occurences).map((x => `${x}=${occurences[x]}`)).join('\n'))
            break;
        case 'list':
            fs.writeFileSync(fileName, Object.keys(occurences).join('\n'))
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
    }, {})
    if (filesInProgress.trim().length > 0) occs['other'] = true
    return occs
}