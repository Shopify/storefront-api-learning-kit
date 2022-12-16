## Getting started

<details><summary>Introduction</summary>
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

Access to the Storefront API can be granted by a merchant via a public sales channel, or admin custom app.
For simplicity of this tutorial, we'll use an admin custom app to grant access to the Storefront API.
The process to create an admin custom app is documented in the next section titled "Creating a Custom App".

Documentation for accessing the Storefront API via a custom app can be found at https://shopify.dev/api/examples/storefront-api#requirements

The home of Storefront API-related developer documents and tutorials can be found at https://shopify.dev/api/storefront
</p></details>
<details><summary>Creating a custom app</summary>
<p>

To start using the Storefront API we'll need to create a custom app. Before we can create the app,
we'll need to ensure we've enabled custom app development within the Shopify admin.

Enable custom app development
1. From your Shopify admin, click "Settings" > "Apps and sales channels".
2. Click "Develop apps".
3. Click "Allow custom app development".
4. Read the warning and information provided, and then click "Allow custom app development".

Create and install a custom app
1. From your Shopify admin, click "Settings" > "Apps and sales channels".
2. Click "Develop apps".
3. Click "Create an app".
4. Fill out the details in the "Create an app" modal and click "Create app".
5. Click "Configure Storefront API scopes".
6. Under Configurations, add the Storefront API access scopes you require.
7. Click "Save".
8. Under "API credentials", click "Install app".
9. In the modal window, click "Install app" to get your access token.
</p></details>
<details><summary>Configure your environment variables</summary>
<p>

Environment variables are JSON key-value pairs that allow you to refer to values without having to write them out every time.

For the tutorial, three environment variables will be utilized.

1. “base_url” will be the Shopify store being connected to.
- If your store is mydevstore.myshopify.com, enter “mydevstore.myshopify.com” here.
2. “api_version” is the Storefront API version used for the API requests.
- This can be changed to an earlier version or unstable depending on your use case.
3. "storefront_access_token" used to populate the X-Shopify-Storefront-Access-Token request header
- This is the storefront access token generated from the "Creating a Custom App" section.
</p></details>
<details><summary>Making your first request</summary>
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

</p></details>

## Metafields

<details><summary>Requesting metafields</summary>
<p>

Metafields allow merchants to store additional information for Shopify resources including:
- Products
- Collections
- Customers
- Blogs
- Pages
- Shop

Unlike the Admin API, metafields must first be made visible to the Storefront API.
To make metafields visible to the Storefront API use the Shopify Admin API mutation metafieldStorefrontVisibilityCreate.
For more information on the metafieldStorefrontVisibilityCreate mutation consult the Shopify Admin API doc https://shopify.dev/docs/admin-api/graphql/reference/metafields/metafieldstorefrontvisibilitycreate

For a complete Storefront API metafield reference please consult the metafield tutorial at
https://shopify.dev/tutorials/retrieve-metafields-with-storefront-api#expose-metafields-to-the-storefront-api

Once the metafield for the given resource has been made visible to the Storefront API, it can be queried from that resource.

For the resource types listed above, both a single metafield, and paginated list can be queried.

The following example queries the Shop resource for the first ten available metafields using the shop's MetafieldConnection
```gql
query getShopMetafields{
  shop {
    name
    metafields(first:10){
      pageInfo{
        hasNextPage
        hasPreviousPage
      }
      edges{
        cursor
        node{
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

</p></details>

## International pricing

<details><summary>Get available countries and currencies</summary>
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
```

</p></details>
<details><summary>Get product prices</summary>
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
```

</p></details>
<details><summary>Get price ranges for products</summary>
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
```

</p></details>
<details><summary>Get customer orders</summary>
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
```

</p></details>
<details><summary>Create cart in local context</summary>
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
```

</p></details>

## Local pickup

<details><summary>Get pickup availability for variants</summary>
<p>

```gql
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

</p></details>
<details><summary>Get in-store pickup locations</summary>
<p>

```gql
query LocationsByDistance($location: GeoCoordinateInput!) {
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
```

</p></details>
<details><summary>Get closest pickup location</summary>
<p>

```gql
query NearestPickupAvailability @inContext(preferredLocationId: "Z2lkOi8vc2hvcGlmeS9Mb2NhdGlvbi8x") {
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
</p></details>

## Collections

<details><summary>Get collections</summary>
<p>

Simple query to return the first 10 collections in the shop.

Since a shop can contain multiple collections, pagination is required.

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
</p></details>
<details><summary>Get collection by handle</summary>
<p>

Simple query to return details from a collection object by passing the collection.handle as an argument.

{
collectionByHandle (handle:"all") {
id
handle
}
}
</p></details>
<details><summary>Get collection by id</summary>
<p>

Query that returns details from a collection object by passing the collection.id as an argument
Since the `node` connection can apply to a range of different objects, a fragment is required to specify the type being returned
In this example, the "... on Collection" fragment allows us to return fields from a collection object

{
node (id:"Z2lkOi8vc2hvcGlmeS9Db2xsZWN0aW9uLzIxMjIzNzgxMTczNA==") {
... on Collection {
id
handle
}
}
}
</p></details>
<details><summary>Display products in collection</summary>
<p>



This query returns data from a single collection, specified by the handle.

The data returned in the product connection can be used to display a page of products.

The `products` connection requires pagination in this query, since collections can contain a large number of products.
This query includes the `sortKey` argument on the products connection, this returns products in the order specified by the sortKey

Products can contain multiple images, so the `images` connection requires pagination.
In this example we only want to display 1 image per product, so we're only asking for first:1

Since products can contain multiple variants, we've asked the products connection to return price ranges.

The 'priceRange' object returns prices in the shop's currency. Multicurrency will be demonstrated in the next example



{
collectionByHandle (handle:"all") {
id
title
products (first:50 sortKey:BEST_SELLING) {
edges {
node {
id
title
vendor
availableForSale
images (first:1) {
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
</p></details>
<details><summary>Display multicurrency products in collection</summary>
<p>

This query is returning data from a single collection, specified by the handle.

The data being returned in the product connection can be used to display a page of products with multicurrency pricing.

Since products can contain multiple variants, we've asked the products connection to return price ranges.

The 'presentmentPriceRanges' object returns prices in all currencies offered by the shop.
Since shops can offer multiple different currencies, the `presentmentPriceRanges` object requires pagination


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
</p></details>
<details><summary>Get all metafields in namespace from collection</summary>
<p>



Uses the `collectionByHandle` query to specify a collection by passing the handle.
The `metafields` connection is using the `namespace` argument to return only metafields in a specific namespace.

Since collections can have a large number of metafields in a given namespace, pagination is required on the `metafields` connection.



{
collectionByHandle (handle:"all") {
id
metafields (first:10 namespace:"global") {
edges {
node {
namespace
key
value
}
}
}
}
}</p></details>
<details><summary>Get specific metafield from collection</summary>
<p>



Uses the `collectionByHandle` query to specify a collection by passing the handle.

The `metafield` connection is using the `namespace` and 'key' arguments to return a specific metafield.

Since only 1 metafield can exist in a given namespace with a given key, pagination is not required on the `metafield` connection.

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
</p></details>
<details><summary>Get all metafields from collection</summary>
<p>



Uses the `collectionByHandle` query to specify a collection by passing the handle, and returns a list of all metafields attached to that collection.
Since collections can have a large number of metafields, pagination is required on the `metafields` connection.


{
collectionByHandle (handle:"all") {
id
metafields (first:10) {
edges {
node {
namespace
key
value
}
}
}
}
}</p></details>

## Products

<details><summary>Get 3 products and 3 variants</summary>
<p>


This query gets the products connection, which is available from the QueryRoot, and asks for the first 3 products.
It selects edges, the node, and fields from each of the returned product objects.
Since products also have a variants connection, we repeat a similar process to get information on the first 3 variants on each of those products.


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
</p></details>
<details><summary>Get product by handle</summary>
<p>


This query gets a single product connection, available from the QueryRoot, that matches the handle "my-test-product".
As only one product connection will be returned, we don't need to specify edges, node, or cursor.

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
</p></details>
<details><summary>Get product recommendations</summary>
<p>


This query gets a single product connection, available from the QueryRoot, that matches the base64-encoded id of the product.
As only one product connection will be returned, we don't need to specify edges, node, or cursor.

{
productRecommendations(productId: "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzEyMzQ1Njc4OQ==") {
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
</p></details>
<details><summary>Get product selling plans</summary>
<p>

This query gets the first 30 products, the first 5 selling plan groups associated with them, and the first 5 selling plans within the groups.
We use fragments to return the price adjustments for each selling plan.

{
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
</p></details>
<details><summary>Get product media</summary>
<p>


This query gets 3 products and their media; we use a fragment here to specify the fields that we want to return for each possible media type.
You cannot retrieve media for product variants with the Storefront API, only products. You cannot upload media, add media to a product, or delete media with the Storefront API, use the Admin API for these tasks.
https://shopify.dev/tutorials/manage-product-media-with-admin-api#retrieve-product-media-by-using-the-storefront-api

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
...on ExternalVideo {
id
host
embeddedUrl
}
...on MediaImage {
image {
originalSrc
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
</p></details>

## Customers

<details><summary>Create an access token</summary>
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
```

</p></details>
<details><summary>Get customer orders</summary>
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
```


</p></details>
<details><summary>Get customer metafields</summary>
<p>

To query a customer, a customerAccessToken is required. This is obtained via the customerAccessTokenCreate mutation which exchanges a user’s email address and password for an access token.

By default, the Storefront API can't read metafields. To expose specific metafields to the Storefront API, you need to use the GraphQL Admin API to allow them. For each metafield that you want to allow, you need to create a MetafieldStorefrontVisibility record.

https://shopify.dev/tutorials/retrieve-metafields-with-storefront-api#expose-metafields-to-the-storefront-api

```gql
query CustomerMetafields($customerAccessToken: String!){
  customer(customerAccessToken: $customerAccessToken) {
    id
    email
    metafields (first:3) {
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


</p></details>
<details><summary>Update customer</summary>
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
```


</p></details>

## Manage a cart

<details><summary>Create a cart with one line item</summary>
<p>

```gql
mutation createCart($cartInput: CartInput) {
  cartCreate(input: $cartInput) {
    cart {
      id
      createdAt
      updatedAt
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

</p></details>
<details><summary>Query a cart</summary>
<p>

```gql
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

</p></details>
<details><summary>Update line items</summary>
<p>

```gql
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

</p></details>
<details><summary>Update buyer identity</summary>
<p>

```gql
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

</p></details>
<details><summary>Retrieve a checkout</summary>
<p>

```gql
query checkoutURL($cartId: ID!) {
  cart(id: $cartId) {
    checkoutUrl
  }
}
```

</p></details>

