const fs = require('fs')
const folderName = process.argv[2] || 'Project' // If there is an argument passed, use it -- otherwise default to 'Project'

try {
    // Create a folder
    fs.mkdirSync(folderName)

    // Create the files
    fs.writeFileSync(`${folderName}/index.html`)
    fs.writeFileSync(`${folderName}/app.js`)
    fs.writeFileSync(`${folderName}/styles.css`)
} catch (e) {
    console.log("Error: ", e)
}

