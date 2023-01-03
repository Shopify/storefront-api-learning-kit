# Storefront API Learning Kit

[About this repo](#about-this-repo) | [How to use this repo](#how-to-use-this-repo) | [Contribute to this repo](https://github.com/Shopify/storefront-api-learning-kit/blob/main/contributing.md) | [Getting started](#getting-started) | [Example queries](#example-queries)
## About this repo
## How to use this repo

## Getting started
<details><summary>Introduction</summary>
</details>
<details><summary>Creating a custom app</summary>
</details>
<details><summary>Configure your environment variables</summary>
</details>
<details><summary>Making your first request</summary>
</details>

## Example queries
### Metafields
<details><summary>Requesting metafields</summary>
</details>

### International pricing
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

### Local pickup
<details><summary>Get pickup availability for variants</summary>
</details>
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
</details>

### Collections
<details><summary>Get collections</summary>
</details>
<details><summary>Get collection by handle</summary>
</details>
<details><summary>Get collection by id</summary>
</details>
<details><summary>Display products in collection</summary>
</details>
<details><summary>Display multicurrency products in collection</summary>
</details>
<details><summary>Get all metafields in namespace from collection</summary>
</details>
<details><summary>Get specific metafield from collection</summary>
</details>
<details><summary>Get all metafields from collection</summary>
</details>

### Products
<details><summary>Get 3 products and 3 variants</summary>
</details>
<details><summary>Get product by handle</summary>
</details>
<details><summary>Get product recommendations</summary>
</details>
<details><summary>Get product selling plans</summary>
</details>
<details><summary>Get product media</summary>
</details>

### Customers
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

### Manage a cart
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

