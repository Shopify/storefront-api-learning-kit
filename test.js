const {promises: {readFile, readdir, writeFile, stat}} = require('fs');
const path = require('path');

const capitalize = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

const directoryContainsQuery = async (directory) => {
  const files = await readdir(directory);
  return files.includes('query.graphql');
};

const convertForMarkdown = (text, file) => {
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
        if(line.startsWith('mutation') || line.startsWith('query')){
            transformedText.push('```gql')
            foundCode = true
        }
        if(foundCode && line.includes('}')){
            brackets.pop()
            spaces -= 2
            // line = `${' '.repeat(spaces)}${line.trim()}`
        }
        // console.log(spaces, line.trim())
        transformedText.push(`${spaces > 0 ?' '.repeat(spaces): ''}${line.trim()}`)
        if(foundCode && line.includes('{')){
            brackets.push(1)
            spaces += 2
            
        }
        // if(foundCode && line.includes('}')){
        //     brackets.pop()
        //     spaces -= 2
        //     // line = `${' '.repeat(spaces)}${line.trim()}`
        // }
        // console.log(spaces, line.trim())
        // transformedText.push(`${spaces >= 0 ?' '.repeat(spaces): ''}${line.trim()}`)
        if(foundCode && brackets.length === 0){
            transformedText.push('```\n')
            foundCode = false
        }

    }
    // await writeFile(`${file}.txt`, transformedText);
    // if(file === '04_making_your_first_request')
    //     console.log(transformedText)
    // if(file === '04_get_customer_orders')
    //     console.log(transformedText)
    return transformedText
}

const myFun = async () =>{
    const head = '# Storefront API Learning Kit\n\n'
    let fullTest = ''
    let links = []
    const directory = './examples'
    const files = await readdir(directory);
    for (const [index, fileName] of files.entries()) {
        const splitText = fileName.split('_')
        const sortKey = Number(splitText[0])
        let header = ``
        
        // header = Number(sortKey) > 1 ?`### ${capitalize(splitText.slice(1).join(' '))}`:`## ${capitalize(splitText.slice(1).join(' '))}`
        console.log(header)
        if(sortKey === 1)
        {
            links.push('[Contribute to this repo](https://github.com/Shopify/storefront-api-learning-kit/blob/main/contributing.md)')
            links.push(`[${capitalize(splitText.slice(1).join(' '))}](#${splitText.slice(1).join('-')})`)
            links.push('[Example queries](#example-queries)')
            header = `## ${capitalize(splitText.slice(1).join(' '))}`
        }
        if(sortKey > 1){
            header = `### ${capitalize(splitText.slice(1).join(' '))}`
        }
        // console.log(header)
        fullTest += `${header}\n`
        const filePath = path.join(directory, fileName);
        const stats = await stat(filePath);
        if (stats.isDirectory()) {
            const subfolder = await readdir(filePath);
            for (const [index, fileName] of subfolder.entries()) {
                
                const summary = sortKey === 0 ? `## ${capitalize(fileName.split('_').slice(1).join(' '))}`:`<details><summary>${capitalize(fileName.split('_').slice(1).join(' '))}</summary>`
                if(sortKey === 0){
                    links.push(`[${capitalize(fileName.split('_').slice(1).join(' '))}](#${fileName.split('_').slice(1).join('-')})`)
                }
                fullTest += `${summary}\n`
                const fileP = path.join(filePath, fileName);
                
                // const statsFile = await stat(fileP);
                // if(!statsFile.isDirectory()){
                    try {
                        const query = await readFile(path.join(fileP, 'query.graphql'));
                        
                        const queryT = query.toString();
                        // convertForMarkdown(queryT)
                        // const variables = await readFile(path.join(fileP, 'variables.json'));
                        // const variablesT = variables.toString();

                        // if(fileName === '04_get_customer_orders')
                        // console.log(convertForMarkdown(queryT, fileName).join('\n'))
                        fullTest += sortKey === 0 ?`${convertForMarkdown(queryT, fileName).join('\n')}`:`<p>\n\n${convertForMarkdown(queryT, fileName).join('\n')}</p>`
                      } catch (error) {
                        // No query or variable exists
                        console.log(error)
                      }
                // }
                fullTest += sortKey === 0 ?``:`</details>\n`
            }
            fullTest += `\n`
            if(sortKey === 1)
                fullTest += '## Example queries\n'
        }

        
    }

    fullTest = `${head}${links.join(' | ')}` + fullTest

    const done = files.map(file => `## ${capitalize(file.split('_').slice(1).join(' '))}`
    )

    // const name = capitalize(fileName.split('_').slice(1).join(' '));


    // console.log(done)
    await writeFile('Test.md', fullTest);
}

const sample = [
    '# The Storefront API allows access to a customer’s addresses, orders and metafields. To access customers, an app must have unauthenticated_read_customers access scope.',
    '',
    '# To query a customer, a customerAccessToken is required. This is obtained via the customerAccessTokenCreate mutation which exchanges a user’s email address and password for an access token.',
    '',
    'mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {',
    '  customerAccessTokenCreate(input: $input) {',
    '    customerAccessToken {',
    '      accessToken',
    '      expiresAt',
    '    }',
    '    customerUserErrors {',
    '      code',
    '      field',
    '      message',
    '    }',
    '  }',
    '}',
    ''
  ]

//   convertForMarkdown(sample)
myFun()