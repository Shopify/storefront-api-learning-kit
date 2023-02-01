const {promises: {readFile, readdir}} = require('fs');
const path = require('path');

const capitalize = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

const directoryContainsQuery = async (directory) => {
  const files = await readdir(directory);
  return files.includes('query.graphql');
};

const createNewResource = async ({_type, fileName, parentId, filePath, _id, metaSortKey, stats}) => {
  // Clean up the folder name e.g. 01_some_folder -> Some folder
  const name = capitalize(fileName.split('_').slice(1).join(' '));
  let resource = {
    _id,
    parentId,
    modified: Math.floor(stats.mtime / 1000),
    created: Math.floor(stats.ctime / 1000),
    name,
    description: "",
    _type,
    metaSortKey,
  };

  const text = {};

  // type-specific properties
  switch (_type) {
    case 'request_group':
      resource = {
        ...resource,
        resourceenvironment: {},
        environmentPropertyOrder: null,
      };
      break;
    case 'request':
      // Check for query and variables
      try {
        const query = await readFile(path.join(filePath, 'query.graphql'));
        text.query = query.toString();

        const variables = await readFile(path.join(filePath, 'variables.json'));
        text.variables = variables.toString();
      } catch (error) {
        // No query or variable exists
      }

      resource = {
        ...resource,
        url: "https://{{ _.base_url }}/api/{{ _.api_version }}/graphql.json",
        method: "POST",
        body: {
          mimeType: "application/graphql",
          text: JSON.stringify(text),
        },
        parameters: [],
        headers: [
          {
            name: "Content-Type",
            value: "application/json",
            id: "pair_1",
          },
          {
            name: "X-Shopify-Storefront-Access-Token",
            value: "{{ _.storefront_access_token }}",
            description: "",
            id: "pair_2",
          },
        ],
        authentication: {},
        isPrivate: false,
        settingStoreCookies: false,
        settingSendCookies: false,
        settingDisableRenderRequestBody: false,
        settingEncodeUrl: true,
        settingRebuildPath: true,
        settingFollowRedirects: "global",
      };
      break;
  }

  return resource;
};

// Initial export
const insomniaExportTemplate = {
  _type: 'export',
  __export_format: 4,
  __export_date: new Date().toISOString(),
  resources: [
    {
      _id: "wrk_1",
      parentId: null,
      modified: 1622496642376,
      created: 1622496642376,
      name: "Storefront API Learning Kit",
      description: "",
      scope: "collection",
      _type: "workspace",
    },
    {
      _id: "env_1",
      parentId: "wrk_1",
      modified: 1622728350592,
      created: 1622496642560,
      name: "Base Environment",
      data: {
        base_url: "shop.myshopify.com",
        api_version: "2023-01",
        storefront_access_token: "12a35b67c890defg123h456i7f89j01k",
      },
      dataPropertyOrder: {
        '&': [
          "base_url",
          "api_version",
          "storefront_access_token",
        ],
      },
      color: null,
      isPrivate: false,
      metaSortKey: 1622496642560,
      _type: "environment",
    },
  ],
};

module.exports = {createNewResource, insomniaExportTemplate, directoryContainsQuery};
