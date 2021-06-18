// Insomnia file format details:
// https://support.insomnia.rest/article/172-importing-and-exporting-data

const {promises: {readdir, stat, writeFile}} = require('fs');
const path = require('path');

const {createNewResource, insomniaExportTemplate, directoryContainsQuery} = require('./build-helpers');

const kitFilePath = './storefront-api-learning-kit-insomnia.json';

const createResources = async (directory = './examples', depth = 0, parentId = 'wrk_1') => {
  let resources = [];
  const files = await readdir(directory);

  for (const [index, fileName] of files.entries()) {
    const filePath = path.join(directory, fileName);
    let resource;

    // We only care about directories
    const stats = await stat(filePath);
    if (!stats.isDirectory()) { continue; }

    // Create an _id for each resource
    const _id = `${parentId}_fld_${depth}_${index}`;
    const resourceDetails = {fileName, filePath, _id, parentId, metaSortKey: index, stats};

    // If directory contains .graphql file, create a request
    if (await directoryContainsQuery(filePath)) {
      resource = await createNewResource({_type: 'request', ...resourceDetails});
      resources.push(resource);
      continue;
    }

    // Otherwise, create a request group and look inside the folder
    resource = await createNewResource({_type: 'request_group', ...resourceDetails});
    resources.push(resource);
    resources = resources.concat(await createResources(filePath, depth + 1, _id));
  }

  return resources;
};

(async () => {
  const resources = await createResources();
  insomniaExportTemplate.resources = insomniaExportTemplate.resources.concat(resources);
  await writeFile(kitFilePath, JSON.stringify(insomniaExportTemplate));
  console.log('Insomnia collection has been exported to', kitFilePath);
})();

