# file-diffy

## The need
We were using a mono-repo on our clientside app (using `lerna.js`).    
While we had an affective way of running only packages that have been changed, each package had in it some files that were mobile only, and some files that were web only, that were in the relevant directories i.e `package-a/web/file.js` and `package-a/mobile/file.js`.

Our CI (`Teamcity`) was triggering all the mobile and web tests on every change in a package. We thought this is wasteful since if I only touched files that were affecting web/mobile.

## The solution
Initially we created a bash script, that got a bit dirty and complicated with `grep`'s and `sed`'s. 
So I decided to create a simple node CLI tool that will accept a bunch of file names from the incoming Pull Request (these file names should be available either in your CI or using a [simple git command](./example.sh)), and output only the "types" that were changed, based on whatever types you have.      
For example `['web', 'mobile]` or `['common', 'docs']` etc.

## How we use it
In Teamcity, we added a step before running the mobile/web tests, which runs the CLI tool, and then skips the next steps depending on the output. Check out the example in [example.sh](./example.sh).


## Quick Usage
input:
```bash
npm i -g file-diffy

file-diffy run --tokens web mobile docs --files="packages/package/web/index.js packages/src/mobile.index.ts packages/common/stuff.js"
```


output:
```bash
web mobile other # Notice that 'other' is also there, because a file not belonging to any token was found
```

## How it works
`file-diffy` is based around the Regex command `[^ ]*[\/|\.| ]<token>[\/|\.][^ ]*`   
Meaning it will generally search for directory paths and file names containing your token.
Its also designed not to catch paths like `package/shweb/file.js` when searching for `web` for example.   
It will also create a category called `other` incase you're interested to know that some files didn't belong to any token.


## Options
`--tokens` space separated tokens which you want to run `file-diffy` on    
`--files` space separated list of file names    
`--outputType` will let you choose between json, txt, log, if json/text is chosen, a `output.txt` or `output.json` will be created

