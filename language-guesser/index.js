// This allows you to 'require' older modules when you cant 'import' them
import { createRequire } from "module"
const require = createRequire(import.meta.url)

import { franc } from 'franc'
const langs = require('langs') // Require using our own require function

try {
    const guessCode = franc(process.argv[2])
    const guessLang = langs.where("3", guessCode)
    console.log("\n------------------------------------------------")
    console.log(`I think you are speaking: ${guessLang.name}`)
    console.log("------------------------------------------------")
} catch (e) {
    console.log("Error: ", e)
}

