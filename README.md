# Storefront API Learning Kit

[About this repo](#about-this-repo) | [How to use this repo](#how-to-use-this-repo) | [Contribute to this repo](https://github.com/Shopify/storefront-api-learning-kit/blob/main/contributing.md) | [Getting Started](#getting-started) | [Example queries](#example-queries)

## About this repo

This repo provides example queries demonstrating how to use Shopify's GraphQL [Storefront API](https://shopify.dev/docs/storefront-api/getting-started). Downloading the package from the releases section, gives you access to a complete set of sample queries for use in the [Insomnia](https://insomnia.rest/) http client. The Insomnia desktop app comes with rich GraphQL features, including automatic schema fetching and autocomplete, which are extremely valuable in learning a new API.

## How to use this repo

To import the Insomnia package, first [download the latest collection](https://github.com/Shopify/storefront-api-learning-kit/blob/main/builds/storefront-api-learning-kit-insomnia.json) (you'll need to save the raw JSON file).

From the Insomnia Dashboard screen, click `Create`, followed by clicking `File`. Select the file you downloaded.

If you don't want to download the Insomnia package, the query examples are listed out below.

## Getting Started

<details><summary>Introduction</summary>
<p>

 This learning kit provides a set of common GraphQL queries and mutations used with the Shopify Storefront API.

If not already familiar with GraphQL, or Shopify APIs, please consult the Shopify GraphQL learning kit https://www.shopify.com/partners/blog/shopify-graphql-learning-kit (NOTE: As of January 2022, private apps have been deprecated and custom apps are to be used instead: https://help.shopify.com/en/manual/apps/app-types#custom-apps)

The Shopify Storefront API gives you full creative control to customize your customers' buying experience.

With the Storefront API you can access several Shopify resource types with the following access scopes:

-   Read products, variants, and collections.
-   Read and modify customer details.
-   Read and modify checkouts.
-   Read store content like articles, blogs and comments.
-   Read subscription selling plans
-   Read and modify cart objects.

Unlike the Admin API, the Storefront API is an unauthenticated API.
Any data exposed by the Storefront API can be seen by any visitor to the store.
Only use the Storefront API when you're comfortable with that risk and the data that is being exposed.
Risk can be mitigated by only providing access scopes required.
For a complete list of access scopes consult Shopify documentation at https://shopify.dev/docs/storefront-api/access-scopes

Access to the Storefront API can be granted by a merchant via a public sales channel, or custom app.
For simplicity of this tutorial, we'll use a custom app to grant access to the Storefront API.
The process to create a custom app is documented in the next section titled "Creating a custom app".

Documentation for accessing the Storefront API via a public sales channel and custom app can be found at https://shopify.dev/api/examples/storefront-api#requirements

The home of Storefront API-related developer documents and tutorials can be found at https://shopify.dev/docs/storefront-api

</p>
</details>

<details><summary>Creating a custom app</summary>
<p>

To start using the Storefront API we'll be need to create a custom app.

1.  From your Shopify Admin, select Apps.
2.  Click "Develop apps" on the top right.
3.  Click "Create an app" on  the top right.
4.  Fill out the details in the "Create an app" modal.
5.  Click "Configure Storefront API scopes" within your App Overview.
6.  Under Configurations, add the Storefront API access scopes you require. https://screenshot.click/17-25-me6zp-j5iav.png
7.  Click Save.
8.  Under "API credentials", click Install app to get your credentials. https://screenshot.click/17-26-vjpmi-6y2u1.png

</p>
</details>

<details><summary>Configure your environment variables</summary>
<p>

Environment variables are JSON key-value pairs that allow you to refer to values without having to write them out every time.

For the tutorial, three environment variables will be utilized.

1.  “base_url” will be the Shopify store being connected to.

-   If your store is mydevstore.myshopify.com, enter “mydevstore.myshopify.com” here.

2.  “api_version” is the Storefront API version used for the API requests.

-   This can be changed to an earlier version or unstable depending on your use case.

3.  "storefront_access_token" used to populate the X-Shopify-Storefront-Access-Token request header

-   This storefront access token generated from creating a custom app.

</p>
</details>

<details><summary>Making your first request</summary>
<p>

You should see at the top of the frame that we're using the "base_url" and "api_version" to build out the address for the endpoint.
You can also click "Header" at the top to see the use of the "storefront_access_token".
Hovering over either of these should show you the value that will be substituted into the request.
If you don’t see your values, ensure you have the right environment selected.

Once you've confirmed these three fields are set in your environment, try running the shop query below.
If the Storefront API access token has been configured correctly, you should get your shop’s info back.

```graphql
query getShopDetails {
    shop {
        name
        primaryDomain {
            host
            url
        }
        paymentSettings {
            currencyCode
            acceptedCardBrands
            enabledPresentmentCurrencies
        }
    }
}
```

</p>
</details>

<details><summary>Base64 encoded</summary>
<p>
Unlike the Admin API, all resource ID's in the Storefront API are base64 encoded.

Storefront API GraphQL queries, or mutations requiring an ID, need that ID to be base-64 encoded.

When using GraphQL to query a specific collection with the Admin API, your query would not use a base-64 encoded ID

With the Storefront API, to retrieve the same collection as illustrated with the Admin API, the ID needs to be base-64 encoded.
Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzE= as seen below is gid://shopify/Collection/1 base-64 encoded.

Modern program languages all support base-64 encoding and decoding of string.

```graphql
query getCollection {
    node(id: "Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzE=") {
        ... on Collection {
            id
            handle
        }
    }
}
```

</p>
</details>

## Example Queries

### Metafields

<details><summary><strong> Requesting metafields</strong></summary>
<p>

Metafields allow merchants to store additional information for Shopify resources including:

-   Products
-   Collections
-   Customers
-   Blogs
-   Pages
-   Shop

Unlike the Admin API, metafields must first be made visible to the Storefront API.
To make metafields visible to the Storefront API use the Shopify Admin API mutation metafieldStorefrontVisibilityCreate.
For more information on the metafieldStorefrontVisibilityCreate mutation consult the Shopify Admin API doc https://shopify.dev/docs/admin-api/graphql/reference/metafields/metafieldstorefrontvisibilitycreate

For a complete Storefront API metafield reference please consult the metafield tutorial at
https://shopify.dev/tutorials/retrieve-metafields-with-storefront-apiexpose-metafields-to-the-storefront-api

Once the metafield for the given resource has been made visible to the Storefront API, it can be queried from that resource.

For the resource types listed above, both a single metafield, and paginated list can be queried.

The following example queries the Shop resource for the first ten available metafields using the shop's MetafieldConnection.

```graphql
query getShopMetafields {
    shop {
        name
        metafields(first: 10) {
            pageInfo {
                hasNextPage
                hasPreviousPage
            }
            edges {
                cursor
                node {
                    id
                    namespace
                    key
                    valueType
                    value
                }
            }
        }
    }
}
```

</p>
</details>
<hr>

### International Pricing

<details><summary><strong>Get available countries and currencies</strong></summary>
<p>

```graphql
query getCountriesAndCurrencies @inContext(country: FR) {
    localization {
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
        country {
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
```

</p>
</details>

<details><summary><strong>Get product prices</strong></summary>
<p>

```graphql
query allProducts @inContext(country: CA) {
    products(first: 1) {
        edges {
            node {
                variants(first: 1) {
                    edges {
                        node {
                            priceV2 {
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

<details><summary><strong>Get price ranges for products</strong></summary>
<p>

```graphql
query getProductPriceRanges @inContext(country: CA) {
    products(first: 1) {
        edges {
            node {
                title
                priceRange {
                    minVariantPrice {
                        amount
                        currencyCode
                    }
                    maxVariantPrice {
                        amount
                        currencyCode
                    }
                }
                compareAtPriceRange {
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
```

</p>
</details>

<details><summary><strong>Get customer orders</strong></summary>
<p>

```graphql
query getcustomerOrders @inContext(country: FR) {
    customer(customerAccessToken: "token") {
        orders(first: 10) {
            edges {
                node {
                    totalPriceV2 {
                        amount
                        currencyCode # order's currency - USD (point in time)
                    }
                    lineItems(first: 10) {
                        edges {
                            node {
                                originalTotalPrice {
                                    amount
                                    currencyCode # order's currency - USD (point in time)
                                }
                                variant {
                                    priceV2 {
                                        amount
                                        currencyCode # EUR variant's currency (past context)
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
<hr>

### Local Pickup

<details><summary><strong>Get pickup availability for variants</strong></summary>
<p>

```graphql
query GetPickUpAvailability {
  product(first: 1) {
    edges {
      node {
        variants(first: 1) {
          edges {
            node {
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
      }
    }
  }
}
```

</p>
</details>

<details><summary><strong>Get in-store pickup locations</strong></summary>
<p>

```graphql
query LocationsByDistance($location: GeoCoordinateInput!) {
    locations(near: $location, first: 5, sortKey: DISTANCE) {
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
```

_Variables_

```
{
	"location": {
		"latitude": 45.4553,
		"longitude": -75.6973
	}
}
```

</p>
</details>

<details><summary><strong>Get closest pickup location</strong></summary>
<p>

```graphql
query NearestPickupAvailability
@inContext(preferredLocationId: "Z2lkOi8vc2hvcGlmeS9Mb2NhdGlvbi8x") {
    node(id: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8z") {
        ... on ProductVariant {
            storeAvailability(first: 3) {
                edges {
                    node {
                        location {
                            name
                            address {
                                formatted
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
<hr>

### Collections

<details><summary><strong>Get collections</strong></summary>
<p>

Simple query to return the first 10 collections in the shop

Since a shop can contain multiple collections, pagination is required

```graphql
{
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

Simple query to return details from a collection object by passing the collection.handle as an argument

```graphql
{
    collectionByHandle(handle: "all") {
        id
        handle
    }
}
```

</p>
</details>

<details><summary><strong>Get collection by id</strong></summary>
<p>

Query that returns details from a collection object by passing the collection.id as an argument
Since the `node` connection can apply to a range of different objects, a fragment is required to specify the type being returned
In this example, the "... on Collection" fragment allows us to return fields from a collection object

```graphql
{
    node(id: "Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIxMjIzNzgxMTczNA==") {
        ... on Collection {
            id
            handle
        }
    }
}
```

</p>
</details>

<details><summary><strong>Display products in collection</strong></summary>
<p>

This query returns data from a single collection, specified by the handle.

The data returned in the product connection can be used to display a page of products.

The `products` connection requires pagination in this query, since collections can contain a large number of products. This query includes the `sortKey` argument on the products connection, this returns products in the order specified by the sortKey

Products can contain multiple images, so the `images` connection requires pagination. In this example we only want to display 1 image per product, so we're only asking for first:1

Since products can contain multiple variants, we've asked the products connection to return price ranges.

The 'priceRange' object returns prices in the shop's currency. Multicurrency will be demonstrated in the next example

```graphql
{
    collectionByHandle(handle: "all") {
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
                                transformedSrc
                                width
                                height
                                altText
                            }
                        }
                    }
                    priceRange {
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
```

</p>
</details>

<details><summary><strong>Display multicurrency products in collection</strong></summary>
<p>

This query is returning data from a single collection, specified by the handle.

The data being returned in the product connection can be used to display a page of products with multicurrency pricing.

Since products can contain multiple variants, we've asked the products connection to return price ranges.

The 'presentmentPriceRanges' object returns prices in all currencies offered by the shop. Since shops can offer multiple different currencies, the `presentmentPriceRanges` object requires pagination

```graphql
{
    collectionByHandle(handle: "all") {
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
                                transformedSrc
                                width
                                height
                                altText
                            }
                        }
                    }
                    presentmentPriceRanges(first: 10) {
                        edges {
                            node {
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
    }
}
```

</p>
</details>

<details><summary><strong>Get all metafields in namespace from collection</strong></summary>
<p>

Uses the `collectionByHandle` query to specify a collection by passing the handle. The `metafields` connection is using the `namespace` argument to return only metafields in a specific namespace.

Since collections can have a large number of metafields in a given namespace, pagination is required on the `metafields` connection.

```graphql
{
    collectionByHandle(handle: "all") {
        id
        metafields(first: 10, namespace: "global") {
            edges {
                node {
                    namespace
                    key
                    value
                }
            }
        }
    }
}
```

</p>
</details>

<details><summary><strong>Get specific metafield from collection</strong></summary>
<p>

Uses the `collectionByHandle` query to specify a collection by passing the handle.

The `metafield` connection is using the `namespace` and 'key' arguments to return a specific metafield.

Since only 1 metafield can exist in a given namespace with a given key, pagination is not required on the `metafield` connection.

```graphql
{
    collectionByHandle(handle: "all") {
        id
        metafield(namespace: "global", key: "instructions") {
            namespace
            key
            value
        }
    }
}
```

</p>
</details>

<details><summary><strong>Get all metafields from collection</strong></summary>
<p>

Uses the `collectionByHandle` query to specify a collection by passing the handle, and returns a list of all metafields attached to that collection.

Since collections can have a large number of metafields, pagination is required on the `metafields` connection.

```graphql
{
    collectionByHandle(handle: "all") {
        id
        metafields(first: 10) {
            edges {
                node {
                    namespace
                    key
                    value
                }
            }
        }
    }
}
```

</p>
</details>
<hr>

### Products

<details><summary><strong>Get 3 products and 3 variants</strong></summary>
<p>

This query gets the products connection, which is available from the QueryRoot, and asks for the first 3 products.
It selects edges, the node, and fields from each of the returned product objects.
Since products also have a variants connection, we repeat a similar process to get information on the first 3 variants on each of those products.

```graphql
{
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
                            priceV2 {
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

As only one product connection will be returned, we don't need to specify edges, node, or cursor.

```graphql
{
    productByHandle(handle: "my-test-product") {
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
                    priceV2 {
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

```graphql
{
    productRecommendations(
        productId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzEyMzQ1Njc4OQ=="
    ) {
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
                    priceV2 {
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

```graphql
{
    products(first: 30) {
        edges {
            node {
                id
                title
                sellingPlanGroups(first: 5) {
                    edges {
                        node {
                            appName
                            name
                            options {
                                name
                                values
                            }
                            sellingPlans(first: 5) {
                                edges {
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

```graphql
{
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
    ... on ExternalVideo {
        id
        host
        embeddedUrl
    }
    ... on MediaImage {
        image {
            originalSrc
        }
    }
    ... on Model3d {
        sources {
            url
            mimeType
            format
            filesize
        }
    }
    ... on Video {
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
<hr>

### Customers

<details><summary><strong>Create an access token</strong></summary>
<p>

The Storefront API allows access to a customer’s addresses, orders and metafields. To access customers, an app must have unauthenticated_read_customers access scope.

To query a customer, a customerAccessToken is required. This is obtained via the customerAccessTokenCreate mutation which exchanges a user’s email address and password for an access token.

```graphql
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
```

_Variables_

```json
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

```graphql
query getCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
        id
        orders(first: 3) {
            edges {
                node {
                    orderNumber
                }
            }
        }
    }
}
```

_Variables_

```json
{
    "customerAccessToken": "d794063da4e26c9b1a8d7b77bdfd6862"
}
```

</p>
</details>

<details><summary><strong>Get customer metafields</strong></summary>
<p>

To query a customer, a customerAccessToken is required. This is obtained via the customerAccessTokenCreate mutation which exchanges a user’s email address and password for an access token.

By default, the Storefront API can't read metafields. To expose specific metafields to the Storefront API, you need to use the GraphQL Admin API to allow them. For each metafield that you want to allow, you need to create a MetafieldStorefrontVisibility record.

https://shopify.dev/tutorials/retrieve-metafields-with-storefront-api#expose-metafields-to-the-storefront-api

```graphql
query CustomerMetafields($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
        id
        email
        metafields(first: 3) {
            edges {
                node {
                    id
                    key
                    namespace
                    value
                }
            }
        }
    }
}
```

_Variables_

```json
{
    "customerAccessToken": "d794063da4e26c9b1a8d7b77bdfd6862"
}
```

</p>
</details>

<details><summary><strong>Update customer</strong></summary>
<p>

To query a customer, a customerAccessToken is required. This is obtained via the customerAccessTokenCreate mutation which exchanges a user’s email address and password for an access token.

```graphql
mutation customerUpdate(
    $customerAccessToken: String!
    $customer: CustomerUpdateInput!
) {
    customerUpdate(
        customerAccessToken: $customerAccessToken
        customer: $customer
    ) {
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
```

_Variables_

```json
{
    "customerAccessToken": "d794063da4e26c9b1a8d7b77bdfd6862",
    "customer": {
        "phone": "+61401425227"
    }
}
```

</p>
</details>
<hr>

### Managing a cart

<details><summary><strong>Create a cart with one line item</strong></summary>
<p>

```graphql
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
```

_Variables_

```json
{
	"cartInput": {
		"lines": [
			{
				"quantity": 1,
				"merchandiseId": "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0VmFyaWFudC8zOTg1Mzk2NzM0MzY3Mg=="
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

```graphql
query cartQuery($cartId: ID!) {
  cart(id: $cartId) {
    id
    createdAt
    updatedAt

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
    estimatedCost {
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

```

_Variables_

```json
{
	"cartId": "{% response 'body', 'req_28d5c4dc622e42e5b14b58dbc19e9a8a', 'b64::JC5kYXRhLmNhcnRDcmVhdGUuY2FydC5pZA==::46b', 'never', 60 %}"
}
```

</p>
</details>

<details><summary><strong>Update line items</strong></summary>
<p>


```graphql
mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
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
      estimatedCost {
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
```

_Variables_

```json
{
	"cartId": "{% response 'body', 'req_28d5c4dc622e42e5b14b58dbc19e9a8a', 'b64::JC5kYXRhLmNhcnRDcmVhdGUuY2FydC5pZA==::46b', 'never', 60 %}",
	"lines": {
		"id": "Z2lkOi8vc2hvcGlmeS9DYXJ0TGluZS9mZjJjZjBmYjM1YjIxZTkzN2IxMGE3ZGE4YjQyMDI0ND9jYXJ0PWU0YzhkYzQ2MTRlYWEyNjgyMTE0NDIxMmY0NzNkMmYy",
		"quantity": 3
	}
}
```

</p>
</details>

<details><summary><strong>Update buyer identity</strong></summary>
<p>


```graphql
mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentityInput: CartBuyerIdentityInput!) {
  cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentityInput) {
    cart {
      id
      buyerIdentity {
        email
        phone
        countryCode
      }
    }
  }
}
```

_Variables_

```json
{
	"cartId": "{% response 'body', 'req_28d5c4dc622e42e5b14b58dbc19e9a8a', 'b64::JC5kYXRhLmNhcnRDcmVhdGUuY2FydC5pZA==::46b', 'never', 60 %}",
	"buyerIdentityInput": {
		"email": "test@shopify.com",
		"phone": "555-555-5555",
		"countryCode": "CA"
	}
}
```

</p>
</details>

<details><summary><strong>Retrieve a checkout</strong></summary>
<p>


```graphql
query checkoutURL($cartId: ID!) {
  cart(id: $cartId) {
    checkoutUrl
  }
}
```

_Variables_

```json
{
	"cartId": "{% response 'body', 'req_28d5c4dc622e42e5b14b58dbc19e9a8a', 'b64::JC5kYXRhLmNhcnRDcmVhdGUuY2FydC5pZA==::46b', 'never', 60 %}"
}
```
