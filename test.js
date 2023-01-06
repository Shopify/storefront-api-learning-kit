const {promises: {readFile, readdir, writeFile, stat}, existsSync} = require('fs');
const path = require('path');

const capitalize = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

const convertForMarkdown = (text) => {
    const toArray = text.split('\n')
    let transformedText = []
    let brackets = []
    let foundCode = false
    let spaces = 0 
    
    for(line of toArray){
        if(line.startsWith('#')){
            transformedText.push(line.slice(1).trim())
            continue
        }
        // Beginning of code block if line starts with mutation or query
        // format as markdown graphql code block
        if(line.startsWith('mutation') || line.startsWith('query')){
            transformedText.push('```gql')
            foundCode = true
        }

        // Hnadle code indentations
        if(foundCode && ((line.includes('}') && !line.includes('{')) || (line.includes(']') && !line.includes('[')))){
            brackets.pop()
            spaces -= 2
        }
        transformedText.push(`${spaces > 0 ?' '.repeat(spaces): ''}${line.trim()}`)
        if(foundCode && ((line.includes('{') && !line.includes('}'))|| (line.includes('[') && !line.includes(']')))){
            brackets.push(1)
            spaces += 2
            
        }
    }
    // Assumption is once a code block is found, that block finishes at the end of the file
    // close markdown code block if code was encountered in file
    if(foundCode && brackets.length === 0)
        transformedText.push('```\n')
    return transformedText
}

const generateReadme = async () =>{
    const title = '# Storefront API Learning Kit'
    let readmeText = ''
    let navigation = []
    const directory = './examples'
    const files = await readdir(directory);
    for (const [index, fileName] of files.entries()) {
        const splitFileName = fileName.split('_')
        const sortKey = Number(splitFileName[0])
        const sectionTitle = capitalize(splitFileName.slice(1).join(' '))
        let sectionHeader = ``

        if(sortKey === 1)
        {
            navigation.push('[Contribute to this repo](https://github.com/Shopify/storefront-api-learning-kit/blob/main/contributing.md)')
            navigation.push(`[${sectionTitle}](#${splitFileName.slice(1).join('-')})`)
            navigation.push('[Example queries](#example-queries)')
            sectionHeader = `## ${sectionTitle}`
        }
        if(sortKey > 1){
            sectionHeader = `### ${sectionTitle}`
        }
        readmeText += `${sectionHeader}\n`
        const filePath = path.join(directory, fileName);
        const stats = await stat(filePath);
        if (stats.isDirectory()) {
            const subfolder = await readdir(filePath);
            for (const [index, fileName] of subfolder.entries()) {
                const subsectionHeader = capitalize(fileName.split('_').slice(1).join(' '))
                const summaryMd = sortKey === 0 ? `\n## ${subsectionHeader}`:`<details><summary><strong>${subsectionHeader}</strong></summary>`
                if(sortKey === 0){
                    navigation.push(`[${subsectionHeader}](#${fileName.split('_').slice(1).join('-')})`)
                }
                readmeText += `${summaryMd}\n`
                
                const innerfilePath = path.join(filePath, fileName);
                
                // const statsFile = await stat(fileP);
                // if(!statsFile.isDirectory()){
                    try {
                        const query = await readFile(path.join(innerfilePath, 'query.graphql'));
                        let fullQuery = query.toString().trim();
                        if(existsSync(path.join(innerfilePath, 'variables.json'))){
                        const variables = await readFile(path.join(innerfilePath, 'variables.json'));
                            fullQuery += '\n\nvariables\n' + variables.toString().trim();
                        }

                        const convertedToMd = convertForMarkdown(fullQuery).join('\n')
                        readmeText += sortKey === 0 ?`${convertedToMd}`:`<p>\n\n${convertedToMd}</p>\n`
                      } catch (error) {
                        console.log(error)
                      }
                // }
                readmeText += sortKey === 0 ?``:`</details>\n`
            }
            readmeText += `\n`
            if(sortKey === 1){
                readmeText += '## Example queries\n'
            }
        }

        
    }

    readmeText = `${title}\n${navigation.join(' | ')}` + readmeText

    const done = files.map(file => `## ${capitalize(file.split('_').slice(1).join(' '))}`
    )
    await writeFile('README.md', readmeText);
}

generateReadme()