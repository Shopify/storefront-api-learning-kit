// This script is used for generating the README when any changes are made within the ./examples directory

// For readme generation to be successful, the following structure has to be adhered to when
// creating new queries in the examples directory /outer_folder/inner_folder/files
// Below is what the mapping looks like when adding a new SFAPI example
// outer_folder -> heading
// inner_folder -> summary header
// files -> content

const {
    promises: { readFile, readdir, writeFile, stat },
    existsSync,
  } = require("fs");
  const path = require("path");
  
  const README_FILE = 'README.md'
  const TITLE = "# Storefront API Learning Kit";

  const capitalize = (word) => {
    if(!word)
      throw new Error('Undefined word parameter')
      
    return word[0].toUpperCase() + word.slice(1);
  };
  
  const convertForMarkdown = (text) => {
    const toArray = text.split("\n");
    let transformedText = [];
    let brackets = [];
    let foundCode = false;
    let spaces = 0; // track indentations
  
    for (line of toArray) {
      if (line.startsWith("#")) {
        transformedText.push(line.slice(1).trim());
        continue;
      }
      // Beginning of code block. If line starts with mutation or query
      // format as markdown graphql code block
      if (line.startsWith("mutation") || line.startsWith("query")) {
        transformedText.push("```gql");
        foundCode = true;
      }
  
      // Handle code indentations
      // check for only closing brackets on a line
      // if opening brackets exist, do nothing
      if (
        foundCode &&
        ((line.includes(")") && !line.includes("(")) ||
          (line.includes("}") && !line.includes("{")) ||
          (line.includes("]") && !line.includes("[")))
      ) {
        brackets.pop();
        spaces -= 2;
      }
      transformedText.push(
        `${spaces > 0 ? " ".repeat(spaces) : ""}${line.trim()}`
      );
      // check for only opening brackets on a line
      // if closing brackets exist, do nothing
      if (
        foundCode &&
        ((line.includes("(") && !line.includes(")")) ||
          (line.includes("{") && !line.includes("}")) ||
          (line.includes("[") && !line.includes("]")))
      ) {
        brackets.push(1);
        spaces += 2;
      }
    }
    // Assumption is once a code block is found, that block finishes at the end of the file
    // Close markdown code block if code was encountered in file
    if (foundCode && brackets.length === 0) transformedText.push("```\n");
    return transformedText;
  };
  
  const generateReadme = async () => {
    let readmeText = "";
    let navigation = [];
    let divider = "";
    const directory = "./examples";
    const folders = await readdir(directory);
    for (const folder of folders) {
      const splitFolderName = folder.split("_");
      const sortKey = Number(splitFolderName[0]);
      const sectionTitle = capitalize(splitFolderName.slice(1).join(" "));
      let sectionHeader = ``;
  
      if (sortKey === 1) {
        navigation.push(
          "[Contribute to this repo](https://github.com/Shopify/storefront-api-learning-kit/blob/main/contributing.md)"
        );
        navigation.push(
          `[${sectionTitle}](#${splitFolderName.slice(1).join("-")})`
        );
        navigation.push("[Example queries](#example-queries)");
        sectionHeader = `## ${sectionTitle}`;
      }
      if (sortKey > 1) {
        sectionHeader = `### ${sectionTitle}`;
        divider = "---\n";
      }
      readmeText += `${sectionHeader}\n`;
      const folderPath = path.join(directory, folder);
      const stats = await stat(folderPath);
      if (stats.isDirectory()) {
        const subfolders = await readdir(folderPath);
        for (const subfolder of subfolders) {
          const subsectionHeader = capitalize(
            subfolder.split("_").slice(1).join(" ")
          );
          const summaryMd =
            sortKey === 0
              ? `\n## ${subsectionHeader}`
              : `<details><summary><strong>${subsectionHeader}</strong></summary>`;
          if (sortKey === 0) {
            navigation.push(
              `[${subsectionHeader}](#${subfolder.split("_").slice(1).join("-")})`
            );
          }
          readmeText += `${summaryMd}\n`;
  
          const subfolderPath = path.join(folderPath, subfolder);
          try {
            const query = await readFile(
              path.join(subfolderPath, "query.graphql")
            );
            let fullQuery = query.toString().trim();
            if (existsSync(path.join(subfolderPath, "variables.json"))) {
              const variables = await readFile(
                path.join(subfolderPath, "variables.json")
              );
              fullQuery += "\n\nvariables\n" + variables.toString().trim();
            }
  
            const convertedToMd = convertForMarkdown(fullQuery).join("\n");
            readmeText +=
              sortKey === 0
                ? `${convertedToMd}`
                : `<p>\n\n${convertedToMd}</p>\n`;
          } catch (error) {
            console.log(error);
          }
          readmeText += sortKey === 0 ? `` : `</details>\n`;
        }
        readmeText += `\n` + divider;
        if (sortKey === 1) {
          readmeText += "## Example queries\n";
        }
      }
    }
  
    readmeText = `${TITLE}\n${navigation.join(" | ")}` + readmeText;
    await writeFile(README_FILE, readmeText);
  };
  
  generateReadme();