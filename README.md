# Storefront API Learning Kit
[About this repo](#about-this-repo) | [How to use this repo](#how-to-use-this-repo) | [Contribute to this repo](https://github.com/Shopify/storefront-api-learning-kit/blob/main/contributing.md) | [Getting started](#getting-started) | [Example queries](#example-queries)

## About this repo
This repo provides example queries demonstrating how to use Shopify's GraphQL [Storefront API](https://shopify.dev/docs/storefront-api/getting-started). Downloading the [Storefront API insomnia collection package](builds/storefront-api-learning-kit-insomnia.json), gives you access to a complete set of sample queries for use in the [Insomnia](https://insomnia.rest/) http client. The Insomnia desktop app comes with rich GraphQL features, including automatic schema fetching and autocomplete, which are extremely valuable in learning a new API.
## How to use this repo
To import the Insomnia package, first [download the latest collection](builds/storefront-api-learning-kit-insomnia.json) (you'll need to save the raw JSON file).
From the Insomnia Dashboard screen, click `Create`, followed by clicking `File`. Select the file you downloaded.
If you don't want to download the Insomnia package, the query examples are listed out below.
## Getting started
<details><summary><strong>Introduction</strong></summary>
<p>

This learning kit provides a set of common GraphQL queries and mutations used with the Shopify Storefront API.

If not already familiar with GraphQL, or Shopify APIs, please consult the Shopify GraphQL learning kit  https://shopifypartnerblog.myshopify.com/blogs/blog/shopify-graphql-learning-kit

The Shopify Storefront API gives you full creative control to customize your customers' buying experience.

With the Storefront API you can access several Shopify resource types with the following access scopes:
- Read products, variants, and collections.
- Read and modify customer details.
- Read and modify checkouts.
- Read store content like articles, blogs and comments.
- Read subscription selling plans.
- Read and modify cart objects.

Unlike the Admin API, the Storefront API is an unauthenticated API.
Any data exposed by the Storefront API can be seen by any visitor to the store.
Only use the Storefront API when you're comfortable with that risk and the data that is being exposed.
Risk can be mitigated by only providing access scopes required.
For a complete list of access scopes consult Shopify documentation at https://shopify.dev/api/usage/access-scopes#unauthenticated-access-scopes

Access to the Storefront API can be granted by a merchant via a public sales channel, or by creating a Headless channel in your Shopify Admin.
For simplicity of this tutorial, we'll create a Headless channel in the Shopify Admin.
The process to add the Headless channel is documented in the next section titled "Installing the Headless Channel ".

Documentation for accessing the Storefront API using the Headless channel can be found [here](https://shopify.dev//custom-storefronts/building-with-the-storefront-api/getting-started#step-1-enable-storefront-api-access)

The home of Storefront API-related developer documents and tutorials can be found at https://shopify.dev/api/storefront</p>
</details>
<details><summary><strong>Installing the headless channel</strong></summary>
<p>

To start using the Storefront API you'll need to enable access by installing the __Headless__ channel on your store.
To install, you can follow the directions outlined here or get it from the [Shopify App Store](https://apps.shopify.com/headless).

Installing the Headless Channel from Shopify Admin
1. From your Shopify admin, click __Sales channels__.
2. Click __Recommended sales channels__.
3. In the __Picked for you modal__, scroll to the Build custom storefronts section.
4. Within the __Headless: Build your own commerce stack__ card, click __Add__.
5. Click __Add sales channel__.
6. Click __Create storefront__.</p>
</details>
<details><summary><strong>Configure your environment variables</strong></summary>
<p>

Environment variables are JSON key-value pairs that allow you to refer to values without having to write them out every time.

For the tutorial, three environment variables will be utilized.

1. `base_url` will be the Shopify store being connected to.
- If your store is mydevstore.myshopify.com, enter “mydevstore.myshopify.com” here.
2. `api_version` is the Storefront API version used for the API requests.
- This can be changed to an earlier version or unstable depending on your use case.
3. `storefront_access_token` is used to populate the X-Shopify-Storefront-Access-Token request header.
- This is the Public access token associated with the Storefront you created in the "Installing the Headless Channel" section.</p>
</details>
<details><summary><strong>Making your first request</strong></summary>
<p>

You should see at the top of the frame that we're using the "base_url" and "api_version" to build out the address for the endpoint.
You can also click the "Headers" tab at the top to see the "storefront_access_token" being used.
Hovering over environment variables should show you the value that will be substituted into the request.
If you don’t see your values, ensure you have the right environment selected.

Once you've confirmed these three fields are set in your environment, try running the shop query below.
If the Storefront API access token has been configured correctly, you should get your shop’s info returned.

```gql
query getShopDetails{
  shop {
    name
    primaryDomain{
      host
      url
    }
    paymentSettings{
      currencyCode
      acceptedCardBrands
      enabledPresentmentCurrencies
    }
  }
}
```
</p>
</details>

## Example queries
### Metafields metaobjects
<details><summary><strong>Expose metafield to SFAPI</strong></summary>
<p>

Metafields allow merchants to store additional information for Shopify resources including:
- Products
- Collections
- Customers
- Blogs
- Pages
- Shop
- Discounts
- Draft Orders
- Locations
- Orders
- Product Images
- Product Variants

For a complete list please consult https://shopify.dev/api/admin-graphql/2022-10/enums/MetafieldOwnerType

Unlike the Admin API, metafields must first be made visible to the Storefront API.
To make metafields visible to the Storefront API use the Shopify Admin API mutation metafieldStorefrontVisibilityCreate.

Ensure you are calling the Admin API https://shopify.dev/api/admin-graphql#endpoints with valid Admin API credentials https://shopify.dev/api/admin-graphql#authentication when exposing metafields to the Storefront API.

For more information on the metafieldStorefrontVisibilityCreate mutation consult the Shopify Admin API doc https://shopify.dev/docs/admin-api/graphql/reference/metafields/metafieldstorefrontvisibilitycreate

For a complete Storefront API metafield reference please consult the metafield tutorial at
https://shopify.dev/tutorials/retrieve-metafields-with-storefront-api#expose-metafields-to-the-storefront-api

```gql
mutation createMetafieldStorefrontVisibility(
  $input: MetafieldStorefrontVisibilityInput!
) {
  metafieldStorefrontVisibilityCreate(input: $input) {
    metafieldStorefrontVisibility {
      id # MetafieldStorefrontVisibility record id
      key # Key must be unique within this namespace on this resource
      ownerType
      namespace
      updatedAt
    }
    userErrors {
      field
      message
    }
  }
}

variables
{
  "input": {
    "key": "drying_instructions",
    "namespace": "garment_care",
    "ownerType": "COLLECTION"
  }
}
```
</p>
</details>
<details><summary><strong>Retrieve metafields</strong></summary>
<p>

Once a metafield has been exposed it can be retrieved using the Storefront API. In order to retrieve a single metafield, specify the namespace and key arguments.
To query for a list of metafields pass the identifiers argument again specifying namespace and key
For more information please consult https://shopify.dev/custom-storefronts/products-collections/metafields#step-2-retrieve-metafields

The following example retrieves a specific metafield and a list of metafields that match the supplied namespace and key and collection id.
Ensure that you've added a value to any metafields you wish to query back by updating it using Admin API https://shopify.dev/apps/metafields/manage-metafields#step-3-update-a-metafield

```gql
query getCollectionMetaField(
  $id: ID!
  $namespace: String!
  $key: String!
  $another_namespace: String!
  $another_key: String!
) {
  collection(id: $id) {
    metafield(namespace: $namespace, key: $key) {
      key
      namespace
      value
      id # metafield id
    }
  }
  
  collection(id: $id) {
    metafields(
      identifiers: [
        { namespace: $namespace, key: $key },
        { namespace: $another_namespace, key: $another_key }
      ]
    ) {
      key
      namespace
      value
      id # metafield id
    }
  }
}

variables
{
  "id": "gid://shopify/Collection/288378781858",
  "namespace": "garment_care",
  "key": "wash_temperature",
  "another_namespace": "bakery",
  "another_key": "ingredients-new"
}
```
</p>
</details>
<details><summary><strong>Retrieve storefront visibilities</strong></summary>
<p>

To retrieve a list of MetafieldStorefrontVisibility records use the metafieldStorefrontVisibilities query available on the Admin API and return a list of exposed metafield records.

Ensure you are calling the Admin API https://shopify.dev/api/admin-graphql#endpoints with valid Admin API credentials https://shopify.dev/api/admin-graphql#authentication when retrieving a list of MetafieldStorefrontVisibility records.
For a complete reference please consult https://shopify.dev/api/admin-graphql/2022-10/queries/metafieldStorefrontVisibilities#top

```gql
query getMetafieldStorefrontVisibilities($first: Int!, $namespace: String!) {
  metafieldStorefrontVisibilities(first: $first, namespace: $namespace) {
    edges {
      node {
        id # Metafield visibility record id
        namespace
        key
        createdAt
      }
    }
  }
}

variables
{
  "first": 5,
  "namespace": "garment_care"
}
```
</p>
</details>
<details><summary><strong>Delete storefront visibilities</strong></summary>
<p>

If you no longer need to access a metafield with the Storefront API, you can hide it again by using the GraphQL Admin API to delete the MetafieldStorefrontVisibility record that you created.
The  metafieldStorefrontVisibilityDelete mutation requires the visibility record of the metafield you wish to hide from the Storefront API.
The metafield will no longer be accessible through the Storefront API.

Ensure you are calling the Admin API https://shopify.dev/api/admin-graphql#endpoints with valid Admin API credentials https://shopify.dev/api/admin-graphql#authentication when deleting a MetafieldStorefrontVisibility record.
For a complete reference please consult https://shopify.dev/api/admin-graphql/2022-10/mutations/metafieldStorefrontVisibilityDelete

```gql
mutation deleteMetafieldStorefrontVisibilities($id: ID!) {
  metafieldStorefrontVisibilityDelete(id: $id) {
    deletedMetafieldStorefrontVisibilityId # The visibility record of the metafield hidden from Storefront API
    
    userErrors {
      field
      message
    }
  }
}

variables
{
  "id": "gid://shopify/MetafieldStorefrontVisibility/1684242594"
}
```
</p>
</details>
<details><summary><strong>Retrieve metaobjects</strong></summary>
<p>

Metaobjects are custom data structures introduced with version 2023-01 that your app can define and create to store your app's information.
Similar to metafields, they can be associated with a Shopify resource such as a product or a collection.
However, they can also exist on their own. Metaobjects provide you with a way to create resources that Shopify doesn't offer out of the box.

In order to query metaobjects with the Storefront API you must first create a metaobject definition using the Admin API with the metaobjectDefinitionCreate mutation
and create a corresponding metaobject using the Admin API mutation metaobjectCreate.
For more information consult Shopify Admin API docs at https://shopify.dev/api/admin-graphql/2023-01/mutations/metaobjectDefinitionCreate
and https://shopify.dev/api/admin-graphql/2023-01/mutations/metaobjectCreate

When creating a new metaobject definition to create new associated metaobjects that you want to access using Storefront API, be sure to set "access" for the "storefront" property to "PUBLIC_READ".
For more information about the MetaObjectDefinitionCreateInput please see https://shopify.dev/api/admin-graphql/2023-01/mutations/metaobjectDefinitionCreate#field-metaobjectdefinitioncreateinput-access
Ensure you are calling the Admin API https://shopify.dev/api/admin-graphql#endpoints with valid Admin API credentials https://shopify.dev/api/admin-graphql#authentication

The following example returns a list of the first ten metaobjects for a given type from the Storefront API. As well as type, which is a required argument, either first or last must be passed.
Other optional arguments include reverse and sortKey which determines whether to sort the returned list by "id", "type", "updated_at", or "display_name".
For more information consult Storefront API documentation at https://shopify.dev/api/storefront/2023-01/queries/metaobjects

```gql
query getMetaObjects(
  $type: String!,
  $sortKey: String,
  $first: Int,
  $reverse: Boolean
){
  metaobjects(
    type: $type,
    sortKey: $sortKey,
    first: $first,
    reverse: $reverse
  ) {
    edges {
      node {
        id
        fields {
          key
          value
        }
        handle
        updatedAt
        type
      }
    }
  }
}

variables
{
  "type": "Product_Highlights",
  "sortKey": "id",
  "first": 10,
  "reverse": true
}
```
</p>
</details>
<details><summary><strong>Retrieve metaobject</strong></summary>
<p>

The following example retreives a single metaobject by a given metaobject id.
For more information consult Storefront API documentation at https://shopify.dev/api/storefront/2023-01/queries/metaobject


```gql
query getMetaObject($id: ID!) { # A metaobject can be retrieved by handle or id
  metaobject(id: $id) {
    id
    type
    updatedAt
    handle
    
    fields {
      key
      value
      type
    }
    
    fields {
      key
      value
      type
    }
  }
}

variables
{
  "id": "gid://shopify/Metaobject/819214"
}
```
</p>
</details>

---
### International pricing
<details><summary><strong>Get available countries and currencies</strong></summary>
<p>

To present pricing in local currency enable the market of the passed in country context within Markets.
If the country is not enabled in Markets the currency of the active localized experience will be the store's default currency.

To present a localized language experience enable it from Markets.
If an alternate language is not enabled for the passed in country context, the active language will be the store's default.

```gql
query getCountriesAndCurrencies($country: CountryCode) @inContext(country: $country) {
  localization {
    language{ #The language of the active localized experience.
      isoCode
      name
    }
    availableCountries {
      currency {
        isoCode
        name
        symbol
      }
      isoCode
      name
      unitSystem
    }
    country { #The currency of the active localized experience.
      currency {
        isoCode
        name
        symbol
      }
      isoCode
      name
      unitSystem
    }
  }
}

variables
{
  "country": "FR"
}
```
</p>
</details>
<details><summary><strong>Get product prices</strong></summary>
<p>

```gql
query allProducts($country: CountryCode) @inContext(country: $country) {
  products(first: 1) {
    edges {
      node {
        title
        variants(first:1) {
          edges {
            node {
              title
              price {
                amount
                currencyCode #active local currency
              }
            }
          }
        }
      }
    }
  }
}

variables
{
  "country": "CA"
}
```
</p>
</details>
<details><summary><strong>Get price ranges for products</strong></summary>
<p>

```gql
query getProductPriceRanges($country: CountryCode) @inContext(country: $country) {
  products(first: 1) {
    edges {
      node {
        title
        priceRange {
          minVariantPrice {
            amount
            currencyCode  #active local currency
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode  #active local currency
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
}

variables
{
  "country": "CA"
}
```
</p>
</details>
<details><summary><strong>Get customer orders</strong></summary>
<p>

```gql
query getcustomerOrders($customerAccessToken: String!, $country: CountryCode)@inContext(country: $country) {
  customer(customerAccessToken: $customerAccessToken) {
    orders(first:10) {
      edges {
        node {
          totalPrice {
            amount
            currencyCode # store's currency
          }
          lineItems(first:10) {
            edges {
              node {
                originalTotalPrice {
                  amount
                  currencyCode # store's currency
                }
                variant {
                  price {
                    amount
                    currencyCode # active local currency
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

variables
{
  "customerAccessToken": "customerAccessToken",
  "country": "FR"
}
```
</p>
</details>
<details><summary><strong>Create cart in local context</strong></summary>
<p>

Generates a cart in the currency and language of the context passed in.
Requires that the country passed be enabled in Markets and that the language passed in is enabled for that market.

```gql
mutation cartCreate($cartInput: CartInput!, $country: CountryCode, $language: LanguageCode)@inContext(country: $country, language: $language){
  cartCreate(input: $cartInput) {
    userErrors {
      code
      message
    }
    cart {
      id
      checkoutUrl #URL for cart in local currency and language passed in
      lines(first: 50) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                title
                product {
                  title
                }
                id
                quantityAvailable
              }
            }
          }
        }
      }
      cost {
        subtotalAmount {
          amount #active local currency
          currencyCode
        }
        totalAmount {
          amount #active local currency
          currencyCode
        }
      }
    }
  }
}

variables
{
  "cartInput": {
    "lines": [
      {
        "quantity": 3,
        "merchandiseId": "gid://shopify/ProductVariant/42485059584162"
      },
      {
        "quantity": 1,
        "merchandiseId": "gid://shopify/ProductVariant/42790980223138"
      }
    ]
    
  },
  "country": "US",
  "language": "ES"
}
```
</p>
</details>

---
### Local pickup
<details><summary><strong>Get pickup availability for variants</strong></summary>
<p>

Before sending this request, please make sure your app has unauthenticated_read_product_pickup_locations scope, and store pick up has been enabled. For all the requirements please check this dev doc: https://shopify.dev/custom-storefronts/products-collections/local-pickup#requirements

You can also use "id" to replace "handle" as argument to query product.

```gql
query getStoreAvailability($handle: String! $name: String! $value:String!) {
  product(handle:$handle) {
    variantBySelectedOptions(selectedOptions: {name: $name, value: $value}) {
    storeAvailability(first: 1) {
      edges {
        node {
          available
          pickUpTime
          location {
            name
          }
        }
      }
    }
  }
}
}

variables
{
"handle": "Orange",
"name": "Weight",
"value": "2 lb"
}
```
</p>
</details>
<details><summary><strong>Get nearest pickup locations</strong></summary>
<p>

This query will return the first 5 shop locations that support in-store pickup. The `near` parameter is used to sort results based on proximity to the provided location. Results could also be sorted by city, location id, or location name by using CITY, ID, or NAME respectively as the sortKey.

```gql
query getNearestPickupLocations($location: GeoCoordinateInput!) {
  locations(near:$location, first: 5, sortKey: DISTANCE) {
    edges {
      node {
        id
        name
        address {
          formatted
        }
      }
    }
  }
}

variables
{
  "location": {
    "latitude": 45.4553,
    "longitude": -75.6973
  }
}
```
</p>
</details>
<details><summary><strong>Get preferred pickup location availability</strong></summary>
<p>

Before sending this request, please make sure your app has unauthenticated_read_product_pickup_locations scope.

This query will return in-store pickup locations that have the product stocked, sorted by proximity to a buyers preferred store pickup location. The buyer's preferred pickup location is passed as the `preferredLocationId` argument.

```gql
query getPreferredStoreAvailability ($preferredLocationId: ID, $handle: String!,$selectedOptions: [SelectedOptionInput!]!)@inContext(preferredLocationId: $preferredLocationId) {
  product(handle: $handle) {
    variantBySelectedOptions(selectedOptions: $selectedOptions) {
      storeAvailability(first: 1) {
        edges {
          node {
            available
            pickUpTime
            location {
              name
            }
          }
        }
      }
    }
  }
}

variables
{
  "preferredLocationId": "gid://shopify/Location/65607794710",
  "handle": "Orange",
  "selectedOptions": {
    "name": "Weight",
    "value": "1 lb"
  }
}
```
</p>
</details>

---
### Collections
<details><summary><strong>Get collections</strong></summary>
<p>

Simple query to return the first 10 collections in the shop.

Since a shop can contain multiple collections, pagination is required.

```gql
query getCollections {
  collections(first: 10) {
    edges {
      cursor
      node {
        id
        handle
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
  }
}
```
</p>
</details>
<details><summary><strong>Get collection by handle</strong></summary>
<p>

Simple query to return details from a collection object by passing the collection.handle as an argument.

```gql
query getCollectionByHandle($handle: String!) {
  collection(handle: $handle) {
    id
    title
    description
  }
}

variables
{
  "handle": "all"
}
```
</p>
</details>
<details><summary><strong>Get collection by id</strong></summary>
<p>

Query that returns details from a collection object by passing the collection.id as an argument.

```gql
query getCollectionById($id: ID!) {
  collection(id: $id) {
    title
    description
    handle
  }
}

variables
{
  "id": "gid://shopify/Collection/1"
}
```
</p>
</details>
<details><summary><strong>Get products in collection</strong></summary>
<p>

This query returns data from a single collection, specified by the handle.

The data returned in the product connection can be used to display a page of products.

The `products` connection requires pagination in this query, since collections can contain a large number of products.
This query includes the `sortKey` argument on the products connection, this returns products in the order specified by the sortKey

Products can contain multiple images, so the `images` connection requires pagination.

Since products can contain multiple variants, we've asked the products connection to return price ranges.

In this example we only want to display 1 image per product, so we're only asking for first:1

```gql
query getProductsInCollection($handle: String!) {
  collection(handle: $handle) {
    id
    title
    products(first: 50, sortKey: BEST_SELLING) {
      edges {
        node {
          id
          title
          vendor
          availableForSale
          images(first: 1) {
            edges {
              node {
                id
                url
                width
                height
                altText
              }
            }
          }
          priceRange { # Returns range of prices for a product in the shop's currency.
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
}

variables
{
  "handle": "all"
}
```
</p>
</details>
<details><summary><strong>Get all metafields for namespace in collection</strong></summary>
<p>

Uses the `collectionByHandle` query to specify a collection by passing the handle.

Identifiers are used to identify the metafields associated with the resource matching the supplied list of namespaces and keys.

The `metafields` connection is using the `namespace` argument to return only metafields in a specific namespace.

Since collections can have a large number of metafields in a given namespace, pagination is required on the `metafields` connection.

By default, the Storefront API can't read metafields. To make specific metafields visible in the Storefront API, you need to create a MetafieldStorefrontVisibility record.

For more information please consult #https://shopify.dev/custom-storefronts/products-collections/metafields

```gql
query getCollectionMetafieldsByNamespace($handle: String! $namespace: String!) {
  collection(handle: $handle) {
    id
    metafields(identifiers: [{ namespace: $namespace, key: $key }]) {
    key
    namespace
    value
    id
  }
}
}

variables
{
"handle": "all",
"namespace": "global"
}
```
</p>
</details>
<details><summary><strong>Filter products in collection</strong></summary>
<p>

You can use the Storefront API to filter products in a collection using product filters.

This functionality lets you build a desired customer experience on a storefront, such as the ability to narrow down the search results that you display to customers.

Products in collections can be filtered by type, vendor, variant options, price, stock and metafield value.

Please note there are requirements to using product filters in collections here - https://shopify.dev/custom-storefronts/products-collections/filter-products#requirements

In the following example, products in the collection that have the "shoes" product type are returned.

Further examples of product filters can be found in the above documentation.

```gql
query getProductsOfProductTypeInCollection($handle: String!, $value: String!) {
  collection(handle: $handle) {
    handle
    products(first: 10, filters: { productType: $value }) {
    edges {
      node {
        handle
        productType
      }
    }
  }
}
}

variables
{
"handle": "filterable-collection",
"value": "shoes"
}
```
</p>
</details>

---
### Products
<details><summary><strong>Get 3 products and 3 variants</strong></summary>
<p>

This query gets the products connection, which is available from the QueryRoot, and asks for the first 3 products.
It selects edges, the node, and fields from each of the returned product objects.
Since products also have a variants connection, we repeat a similar process to get information on the first 3 variants on each of those products.


```gql
query getProductsAndVariants {
  products(first: 3) {
    edges {
      cursor
      node {
        id
        title
        description
        handle
        variants(first: 3) {
          edges {
            cursor
            node {
              id
              title
              quantityAvailable
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
```
</p>
</details>
<details><summary><strong>Get product by handle</strong></summary>
<p>

This query gets a single product connection, available from the QueryRoot, that matches the handle "my-test-product".
As only one product connection will be returned, we don't need to specify edges, node, or cursor. This query can also be used to get a product by id by replacing (handle: $handle) with (id: $id)

```gql
query getProductByHandle {
  product(handle: "my-test-product") {
    id
    title
    description
    variants(first: 3) {
      edges {
        cursor
        node {
          id
          title
          quantityAvailable
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```
</p>
</details>
<details><summary><strong>Get product recommendations</strong></summary>
<p>

This query gets a single product connection, available from the QueryRoot, that matches the base64-encoded id of the product.
As only one product connection will be returned, we don't need to specify edges, node, or cursor.

```gql
query getProductRecommendations {
  productRecommendations(productId: "gid://shopify/Product/123456789") {
    id
    title
    description
    variants(first: 3) {
      edges {
        cursor
        node {
          id
          title
          quantityAvailable
          price {
            amount
            currencyCode
          }
        }
      }
    }
  }
}
```
</p>
</details>
<details><summary><strong>Get product selling plans</strong></summary>
<p>

This query gets the first 30 products, the first 5 selling plan groups associated with them, and the first 5 selling plans within the groups.
We use fragments to return the price adjustments for each selling plan.

```gql
query getProductSellingPlans {
  products(first: 30) {
    pageInfo {
      hasNextPage
      hasPreviousPage
    }
    edges {
      cursor
      node {
        id
        title
        sellingPlanGroups(first: 5) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              appName
              name
              options {
                name
                values
              }
              sellingPlans(first: 5) {
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                }
                edges {
                  cursor
                  node {
                    id
                    description
                    recurringDeliveries
                    priceAdjustments {
                      adjustmentValue {
                        ... on SellingPlanPercentagePriceAdjustment {
                          adjustmentPercentage
                        }
                        ... on SellingPlanFixedAmountPriceAdjustment {
                          adjustmentAmount {
                            amount
                            currencyCode
                          }
                        }
                        ... on SellingPlanFixedPriceAdjustment {
                          price {
                            amount
                            currencyCode
                          }
                        }
                      }
                      orderCount
                    }
                    options {
                      name
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
```
</p>
</details>
<details><summary><strong>Get product media</strong></summary>
<p>

This query gets 3 products and their media; we use a fragment here to specify the fields that we want to return for each possible media type.
You cannot retrieve media for product variants with the Storefront API, only products. You cannot upload media, add media to a product, or delete media with the Storefront API, use the Admin API for these tasks.
https://shopify.dev/tutorials/manage-product-media-with-admin-api#retrieve-product-media-by-using-the-storefront-api

```gql
query getProductMedia {
  products(first: 3) {
    edges {
      cursor
      node {
        id
        title
        description
        media(first: 10) {
          edges {
            node {
              mediaContentType
              alt
              ...mediaFieldsByType
            }
          }
        }
      }
    }
  }
}

fragment mediaFieldsByType on Media {
  ...on ExternalVideo {
    id
    host
    originUrl
  }
  ...on MediaImage {
    image {
      url
    }
  }
  ...on Model3d {
    sources {
      url
      mimeType
      format
      filesize
    }
  }
  ...on Video {
    sources {
      url
      mimeType
      format
      height
      width
    }
  }
}
```
</p>
</details>
<details><summary><strong>Get product tags</strong></summary>
<p>

Returns product tags. This query requires the unauthenticated_read_product_tags scope, more info can be found here: https://shopify.dev/api/usage/access-scopes

```gql
query getProductTags {
  productTags(first:10) {
    edges{
      node
    }
  }
}
```
</p>
</details>
<details><summary><strong>Get product types</strong></summary>
<p>

Returns product types. This query requires the unauthenticated_read_product_listings scope, more info can be found here: https://shopify.dev/api/usage/access-scopes
```gql
query getProductTypes {
  productTypes(first: 10) {
    edges{
      node
    }
  }
}
```
</p>
</details>

---
### Customers
<details><summary><strong>Create an access token</strong></summary>
<p>

The Storefront API allows access to a customer’s addresses, orders and metafields. To access customers, an app must have unauthenticated_read_customers access scope.

To query a customer, a customerAccessToken is required. This is obtained via the customerAccessTokenCreate mutation which exchanges a user’s email address and password for an access token.

```gql
mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
  customerAccessTokenCreate(input: $input) {
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}

variables
{
  "input": {
    "email": "user@example.com",
    "password": "HiZqFuDvDdQ7"
  }
}
```
</p>
</details>
<details><summary><strong>Get customer orders</strong></summary>
<p>

To query a customer, a customerAccessToken is required. This is obtained via the customerAccessTokenCreate mutation which exchanges a user’s email address and password for an access token.

```gql
query getCustomerOrders($customerAccessToken: String!){
  customer(customerAccessToken: $customerAccessToken) {
    id
    orders(first:3) {
      edges {
        node {
          orderNumber
        }
      }
    }
  }
}

variables
{
  "customerAccessToken": "d794063da4e26c9b1a8d7b77bdfd6862"
}
```
</p>
</details>
<details><summary><strong>Get customer metafields</strong></summary>
<p>

To query a customer, a customerAccessToken is required. This is obtained via the customerAccessTokenCreate mutation which exchanges a user’s email address and password for an access token.

By default, the Storefront API can't read metafields. To make specific metafields visible in the Storefront API, you need to create a MetafieldStorefrontVisibility record. See metafields/expose_metafield_to_SFAPI query for more details: # https://github.com/Shopify/storefront-api-learning-kit/tree/main/examples/05_collections/05_get_all_metafields_for_namespace_in_collection

If you would like to know more regarding metafields, check out this dev doc #https://shopify.dev/tutorials/retrieve-metafields-with-storefront-api#expose-metafields-to-the-storefront-api

Identifiers are used to identify the metafields associated with the resource matching the supplied list of namespaces and keys.

To know more about metafields, please navigate to metafields directory of this repo to get more information.

```gql
query CustomerMetafields($customerAccessToken: String!, $identifiers: [HasMetafieldsIdentifier!]!){
  customer(customerAccessToken: $customerAccessToken) {
    id
    email
    metafields (identifiers:$identifiers) {
      id
      key
      value
      namespace
      type
    }
  }
}

variables
{
  "customerAccessToken": "7cd6d36137f41d57bb8e85ae0d178d60",
  "identifiers": [
    {
      "namespace": "Membership",
      "key": "VIP level"
    },
    {
      "namespace": "Membership",
      "key": "startDate"
    },
    {
      "namespace": "note",
      "key": "preference"
    }
  ]
}
```
</p>
</details>
<details><summary><strong>Update customer</strong></summary>
<p>

To query a customer, a customerAccessToken is required. This is obtained via the customerAccessTokenCreate mutation which exchanges a user’s email address and password for an access token.

```gql
mutation customerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
  customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
    customer {
      id
    }
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}

variables
{
  "customerAccessToken": "d794063da4e26c9b1a8d7b77bdfd6862",
  "customer": {
    "phone": "+61401425227"
  }
}
```
</p>
</details>
<details><summary><strong>Create customer</strong></summary>
<p>

This mutation will create a customer account with password for the customer to login.

```gql
mutation createCustomerAccount($input: CustomerCreateInput!) {
  customerCreate(input: $input) {
    customer {
      id
      email
      firstName
      lastName
      phone
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}

variables
{
  "input": {
    "acceptsMarketing": true,
    "email": "example@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "password": "qwerty12345",
    "phone": "+64213444048"
  }
}
```
</p>
</details>
<details><summary><strong>Activate customer</strong></summary>
<p>

Once a customer account is created, an email will be sent to the customer with the account activation url. This mutation will use the activationToken from the activation url to active the customer account.
You can also use the activation url directly to activate the customer account. See customerActivateByUrl mutation https://shopify.dev/api/storefront/2023-01/mutations/customerActivateByUrl

```gql
mutation activateCustomerAccount($id: ID!, $input: CustomerActivateInput!) {
  customerActivate(id: $id, input: $input) {
    customer {
      id
      email
      firstName
      lastName
      phone
    }
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}

variables
{
  "id": "gid://shopify/Customer/5820694691862",
  "input": {
    "activationToken": "da48cbd301e7c31a9d5dca03fcf5cdb6-1671054502",
    "password": "qwerty12345"
  }
}
```
</p>
</details>
<details><summary><strong>Recover customer</strong></summary>
<p>

This mutation will send a email to customer to reset password of the customer account.

Note that this mutation is throttled by IP. if you are using authenticated access, you can pass a Shopify-Storefront-Buyer-IP header to enable the IP based throttling that will protect your app from any single user, such as a bot, consuming too much capacity.

```gql
mutation recoverCustomerAccount($email: String!) {
  customerRecover(email: $email) {
    customerUserErrors {
      code
      field
      message
    }
  }
}

variables
{
  "email":"example@example.com"
}
```
</p>
</details>
<details><summary><strong>Reset customer</strong></summary>
<p>

This mutation is used to reset the customer account password. After sending recoverCustomerAccount request, the customer will receive an email with an account recovery url for resetting customer account. This url will include the customer id and resetToken.
You can also use the url directly to reset the customer account. See customerResetByUrl mutation https://shopify.dev/api/storefront/2022-10/mutations/customerResetByUrl

```gql
mutation resetCustomerAccount($id: ID!, $input: CustomerResetInput!) {
  customerReset(id: $id, input: $input) {
    customer {
      id
      email
      firstName
      lastName
      phone
    }
    customerAccessToken {
      accessToken
      expiresAt
    }
    customerUserErrors {
      code
      field
      message
    }
  }
}

variables
{
  "id": "gid://shopify/Customer/5820694691862",
  "input": {
    "password": "12345qwerty",
    "resetToken": "2279f05aebbb8319553e46f2b71c88c7-1671131136"
  }
}
```
</p>
</details>
<details><summary><strong>Create customer address</strong></summary>
<p>

To query a customer, a customerAccessToken is required. This is obtained via the customerAccessTokenCreate mutation which exchanges a user’s email address and password for an access token.

This request will create a new address that appends to the current address array of the customer record.

```gql
mutation customerAddressCreate($customerAccessToken: String!, $address: MailingAddressInput!) {
  customerAddressCreate(customerAccessToken: $customerAccessToken, address: $address) {
    customerUserErrors {
      code
      field
      message
    }
    customerAddress {
      id
    }
  }
}

variables
{
  "customerAccessToken": "7cd6d36137f41d57bb8e85ae0d178d60",
  "address": {
    "lastName": "Smith",
    "firstName": "Mary",
    "address1": "123 Test Street",
    "province": "ON",
    "country": "Canada",
    "zip": "M5T1G4",
    "city": "Toronto"
  }
}
```
</p>
</details>

---
### Manage a cart
<details><summary><strong>Create a cart with one line item</strong></summary>
<p>

This mutation creates a cart and returns information about the cart to ensure it's correct (id, lines, product variant id, etc) as well as some information about the cart you may want (e.g. cost, subtotalAmount, totalTaxAmount, totalDutyAmount). The checkoutUrl object contains the url of the checkout for the created cart
```gql
mutation createCart($cartInput: CartInput) {
  cartCreate(input: $cartInput) {
    cart {
      id
      createdAt
      updatedAt
      checkoutUrl
      lines(first: 10) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
              }
            }
          }
        }
      }
      attributes {
        key
        value
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalDutyAmount {
          amount
          currencyCode
        }
      }
    }
  }
}

variables
{
  "cartInput": {
    "lines": [
      {
        "quantity": 1,
        "merchandiseId": "gid://shopify/ProductVariant/123"
      }
    ],
    "attributes": {
      "key": "cart_attribute_key",
      "value": "This is a cart attribute value"
    }
  }
}
```
</p>
</details>
<details><summary><strong>Query a cart</strong></summary>
<p>

Query a cart by id and return some of the cart's objects. See documentation here for comprehensive list: https://shopify.dev/api/storefront/latest/queries/cart
```gql
query cartQuery($cartId: ID!) {
  cart(id: $cartId) {
    id
    createdAt
    updatedAt
    checkoutUrl
    lines(first: 10) {
      edges {
        node {
          id
          quantity
          merchandise {
            ... on ProductVariant {
              id
            }
          }
          attributes {
            key
            value
          }
        }
      }
    }
    attributes {
      key
      value
    }
    cost {
      totalAmount {
        amount
        currencyCode
      }
      subtotalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
      totalDutyAmount {
        amount
        currencyCode
      }
    }
    buyerIdentity {
      email
      phone
      customer {
        id
      }
      countryCode
    }
  }
}

variables
{
  "cartId": "gid://shopify/Cart/50b74bf9dc2bc7a410053b5ffb31ba51"
}
```
</p>
</details>
<details><summary><strong>Update line items</strong></summary>
<p>

This mutation is used to add a product variant of the same type to the cart. In the below example, the quantity of the variant (in variables.json) is increased and the id and quantity are returned to confirm they are correct.
```gql
mutation updateCartLines($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
  cartLinesUpdate(cartId: $cartId, lines: $lines) {
    cart {
      id
      lines(first: 10) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalDutyAmount {
          amount
          currencyCode
        }
      }
    }
  }
}

variables
{
  "cartId": "gid://shopify/Cart/50b74bf9dc2bc7a410053b5ffb31ba51",
  "lines": {
    "id": "gid://shopify/CartLine/7b9ed49f-830e-4142-9c81-e7f8249863ad?cart=50b74bf9dc2bc7a410053b5ffb31ba51",
    "quantity": 3
  }
}
```
</p>
</details>
<details><summary><strong>Update buyer identity</strong></summary>
<p>

cartBuyerIdentityUpdate is used to associate customer info with a cart and is used to determine international pricing. The below example is updating the buyerIdentity and returning the info (email, phone, delivery address preferences) to ensure that it updated correctly
```gql
mutation updateCartBuyerIdentity($buyerIdentity: CartBuyerIdentityInput!, $cartId: ID!) {
  cartBuyerIdentityUpdate(buyerIdentity: $buyerIdentity, cartId: $cartId) {
    cart {
      id
      buyerIdentity {
        email
        phone
        deliveryAddressPreferences {
          ... on MailingAddress {
            address1
            city
            country
            firstName
            lastName
          }
        }
      }
    }
    userErrors {
      field
      message
    }
  }
}

variables
{
  "buyerIdentity": {
    "countryCode": "CA",
    "deliveryAddressPreferences": [
      {
        "deliveryAddress": {
          "address1": "123 Fake St.",
          "city": "Toronto",
          "company": "Shopify",
          "country": "Canada",
          "firstName": "Alice",
          "lastName": "Bob",
          "province": "ON"
        }
      }
    ],
    "email": "example-email@shopify.com"
  },
  "cartId": "gid://shopify/Cart/684d5f8c6e463f6057e77c15e34082f0"
}
```
</p>
</details>
<details><summary><strong>Retrieve checkout url</strong></summary>
<p>

Query gets cart by id and returns the cart's checkoutURL. That url directs you to the web checkout flow. More info here: https://shopify.dev/custom-storefronts/checkout/create#shopify-web-checkout
```gql
query checkoutURL($cartId: ID!) {
  cart(id: $cartId) {
    checkoutUrl
  }
}

variables
{
  "cartId": "gid://shopify/Cart/50b74bf9dc2bc7a410053b5ffb31ba51"
}
```
</p>
</details>
<details><summary><strong>Update cart discount codes</strong></summary>
<p>

This mutation updates the discount codes applied to a given cart and returns the cart id and discountCodes' 'code' and 'applicable' fields
```gql
mutation updateCartDiscountCodes($cartId: ID!, $discountCodes: [String!] ) {
  cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
    cart {
      id
      discountCodes{
        code
        applicable
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalDutyAmount {
          amount
          currencyCode
        }
      }
    }
    
    userErrors {
      field
      message
    }
  }
}

variables
{
  "cartId": "gid://shopify/Cart/50b74bf9dc2bc7a410053b5ffb31ba51",
  "discountCodes": [
    "10_OFF"
  ]
}
```
</p>
</details>
<details><summary><strong>Update cart attributes</strong></summary>
<p>

Updates the attributes of a given cart. Cart attributes are used to store info that isn't included in the existing cart fields. The variables for this mutation provide an example of such a use case i.e.  "attributes": {
"key": "gift_wrap",
"value": "true"
}
The key/value can be passed as an object or objects in an array, but in either case the update overwrites the existing attributes.
```gql
mutation updateCartAttributes($attributes: [AttributeInput!]!, $cartId: ID!) {
  cartAttributesUpdate(attributes: $attributes, cartId: $cartId) {
    cart {
      id
      attributes{
        key
        value
      }
    }
    userErrors {
      field
      message
    }
  }
}

variables
{
  "attributes": {
    "key": "gift_wrap",
    "value": "true"
  },
  "cartId": "gid://shopify/Cart/50b74bf9dc2bc7a410053b5ffb31ba51"
}
```
</p>
</details>
<details><summary><strong>Update cart note</strong></summary>
<p>

Updates cart note, returns cart id and note. Notes are similiar to cart attributes in that they contain additional info about an order. However, notes can be a string whereas attributes require key/value pairs.
```gql
mutation updateCartNote($cartId: ID!) {
  cartNoteUpdate(cartId: $cartId) {
    cart {
      id
      note
      
    }
    userErrors {
      field
      message
    }
  }
}

variables
{
  "cartId": "gid://shopify/Cart/50b74bf9dc2bc7a410053b5ffb31ba51",
  "note": "This is a test note"
}
```
</p>
</details>
<details><summary><strong>Remove cart lines</strong></summary>
<p>

Remove lines from existing cart. Use the cost, subtotal, etc or userError message to confirm that the correct line has been removed. The userError message will let you know if the line in the request does not exist.
```gql
mutation removeCartLines($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    cart {
      id
      lines(first: 10){
        edges
        {
          node{
            quantity
            merchandise{
              ... on ProductVariant {
                id
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalDutyAmount {
          amount
          currencyCode
        }
      }
    }
    
    userErrors {
      field
      message
    }
  }
}

variables
{
  "cartId": "gid://shopify/Cart/50b74bf9dc2bc7a410053b5ffb31ba51",
  "lineIds": [
    "gid://shopify/CartLine/7b9ed49f-830e-4142-9c81-e7f8249863ad?cart=50b74bf9dc2bc7a410053b5ffb31ba51"
  ]
}
```
</p>
</details>
<details><summary><strong>Add cart lines</strong></summary>
<p>

This mutation adds lines to existing cart, returns the quantity and product id. This mutation also accepts sellingPlanId
```gql
mutation addCartLines($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      lines(first: 10){
        edges
        {
          node{
            quantity
            merchandise{
              ... on ProductVariant {
                id
              }
            }
          }
        }
      }
      cost {
        totalAmount {
          amount
          currencyCode
        }
        subtotalAmount {
          amount
          currencyCode
        }
        totalTaxAmount {
          amount
          currencyCode
        }
        totalDutyAmount {
          amount
          currencyCode
        }
      }
    }
    
    
    userErrors {
      field
      message
    }
  }
}

variables
{
  "cartId": "gid://shopify/Cart/e623277ec9e65c98f583268f06900ce7",
  "lines": {
    "merchandiseId": "gid://shopify/ProductVariant/40993523892280",
    "quantity": 3
  }
}
```
</p>
</details>

---
### Shop content
<details><summary><strong>Get shop policies</strong></summary>
<p>

The ShopPolicy object represents a policy that a merchant has configured for their store, such as their refund or privacy policy.

This query displays the different shop policies that can be returned using the Storefront API.

```gql
query getShopPolicies {
  shop {
    privacyPolicy {
      id
      body # Policy text, maximum size of 64kb.
      title
    }
    refundPolicy {
      id
      body
      title
    }
    shippingPolicy {
      id
      body
      title
    }
    termsOfService {
      id
      body
      title
    }
    subscriptionPolicy {
      id
      body
      title
    }
  }
}
```
</p>
</details>
<details><summary><strong>Get blog by handle</strong></summary>
<p>

The blog object is an blog published to the online store channel.

Each store can have multiple blogs, and each blog can have many articles (blog posts).

This query fetches a specific blog by it's handle and returns the blog along with it's associated articles.

Blogs are meant to be used as a type of magazine or newsletter for the shop, with content that changes over time.

If your shop needs a static page (such as an "About Us" page), we recommend that you use a Page instead.

```gql
query getBlogByHandle($handle: String!) {
  blog(handle: $handle) {
    id
    title
    articles(first: 5) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
}

variables
{
  "handle": "my-blog"
}
```
</p>
</details>
<details><summary><strong>Get page by handle</strong></summary>
<p>

The page object represents a custom page on the online store.

Shopify merchants can create pages to hold static HTML content such as an 'About Us' page.

This simple query fetches a page by it's handle and returns the title and description of the page, complete with HTML formatting.

```gql
query getPageByHandle($handle: String!) {
  page(handle: $handle) {
    id
    title
    body # The description of the page, complete with HTML formatting.
  }
}

variables
{
  "handle": "my-page"
}
```
</p>
</details>

---
