# Contributing to the repo

[Folder structure](#folder-structure) | [Making changes](#making-changes) | [Adding new queries](#adding-new-queries) 

## Folder Structure

Each folder is prefixed with a sort key. 

Folder names are all lowercase, separated with underscores.

Each query is contained in a folder. Queries are named `query.graphql`. If a query requires variables, those are added with a file named `variables.json` which is placed in the query folder.

## Build process

When changes are pushed to the `examples` directory on any branch, a new Insomnia package will be built automatically and commited to the repo in the `builds` dir. The filename is `storefront-api-learning-kit-insomnia.json`

## Making changes

1. Clone the repo
2. Make changes on a new branch
3. Push changes to the repo
4. Check your changes by importing the `examples/storefront-api-learning-kit-insomnia.json` file from your branch into the Insomnia app.
5. Create PR and tag @Shopify/developer-support for review

## Adding new queries

When adding new queries to the collection, create folders according to the structure mentioned above. New queries should be added to the bottom of the existing sort order, unless the function is something that should logically happen first (obtaining token, a get before an update, etc)

