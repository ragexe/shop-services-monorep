# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS

## Test your service

This template contains a single lambda function triggered by an HTTP request made on the provisioned API Gateway REST API `/hello` route with `POST` method. The request body must be provided as `application/json`. The body structure is tested by API Gateway against `src/functions/hello/schema.ts` JSON-Schema definition: it must contain the `name` property.

- requesting any other path than `/hello` with any other method than `POST` will result in API Gateway returning a `403` HTTP error code
- sending a `POST` request to `/hello` with a payload **not** containing a string property named `name` will result in API Gateway returning a `400` HTTP error code
- sending a `POST` request to `/hello` with a payload containing a string property named `name` will result in API Gateway returning a `200` HTTP status code with a message saluting the provided name and the detailed event processed by the lambda

> :warning: As is, this template, once deployed, opens a **public** endpoint within your AWS account resources. Anybody with the URL can actively execute the API Gateway endpoint and the corresponding lambda. You should protect this endpoint with the authentication method of your choice.

### Locally

In order to test the hello function locally, run the following command:

- `npx sls invoke local -f hello --path src/functions/hello/mock.json` if you're using NPM
- `yarn sls invoke local -f hello --path src/functions/hello/mock.json` if you're using Yarn

Check the [sls invoke local command documentation](https://www.serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/) for more information.

### Remotely

Copy and replace your `url` - found in Serverless `deploy` command output - and `name` parameter in the following `curl` command in your terminal or in Postman to test your newly deployed application.

```
curl --location --request POST 'https://myApiEndpoint/dev/hello' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Frederic"
}'
```

## Template features

### Project structure

The project code base is mainly located within the `src` folder. This folder is divided in:

- `functions` - containing code base and configuration for your lambda functions
- `libs` - containing shared code base between your lambdas

```
.
├── src
│   ├── functions               # Lambda configuration and source code folder
│   │   ├── hello
│   │   │   ├── handler.ts      # `Hello` lambda source code
│   │   │   ├── index.ts        # `Hello` lambda Serverless configuration
│   │   │   ├── mock.json       # `Hello` lambda input parameter, if any, for local invocation
│   │   │   └── schema.ts       # `Hello` lambda input event JSON-Schema
│   │   │
│   │   └── index.ts            # Import/export of all lambda configurations
│   │
│   └── libs                    # Lambda shared code
│       └── apiGateway.ts       # API Gateway specific helpers
│       └── handlerResolver.ts  # Sharable library for resolving lambda handlers
│       └── lambda.ts           # Lambda middleware
│
├── package.json
├── serverless.ts               # Serverless service file
├── tsconfig.json               # Typescript compiler configuration
├── tsconfig.paths.json         # Typescript paths
└── webpack.config.js           # Webpack configuration
```

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file

### Advanced usage

Any tsconfig.json can be used, but if you do, set the environment variable `TS_NODE_CONFIG` for building the application, eg `TS_NODE_CONFIG=./tsconfig.app.json npx serverless webpack`


# How to

## Deploy
- Use `npm run-script deploy` to deploy micro service

## Get swagger config
- After deployment use `npm run-script swagger` to download swagger config JSON-file
- Put `swagger-api.json` file content to https://editor.swagger.io/

#### API doc example
  ```javascript
{
  "swagger" : "2.0",
  "info" : {
    "description" : "This is API based microservice to get mocked products",
    "version" : "2021-08-24T14:03:25Z",
    "title" : "product-service-dev",
    "contact" : {
      "name" : "ragexe",
      "url" : "https://discordapp.com/users/ragexe#2978",
      "email" : "ragexe@mail.ru"
    },
    "license" : {
      "name" : "The license",
      "url" : "https://www.github.com"
    }
  },
  "host" : "f5erv8t263.execute-api.eu-west-1.amazonaws.com",
  "basePath" : "/dev",
  "tags" : [ {
    "name" : "product-service",
    "description" : "Everything about providing products",
    "externalDocs" : {
      "description" : "Find out more",
      "url" : "https://cutt.ly/VWq0pGZ"
    }
  } ],
  "schemes" : [ "https" ],
  "paths" : {
    "/getProductsById" : {
      "get" : {
        "tags" : [ "product-service" ],
        "summary" : "Finds products with provided {id} and returns list of them",
        "produces" : [ "application/json" ],
        "parameters" : [ {
          "name" : "debug",
          "in" : "query",
          "description" : "If true the API response contains event object",
          "required" : false,
          "type" : "string"
        }, {
          "name" : "id",
          "in" : "query",
          "description" : "The value of the identifier for the search",
          "required" : true,
          "type" : "string"
        } ],
        "responses" : {
          "200" : {
            "description" : "200 response",
            "schema" : {
              "$ref" : "#/definitions/Products"
            }
          },
          "400" : {
            "description" : "400 response",
            "schema" : {
              "$ref" : "#/definitions/400JsonResponse"
            }
          }
        }
      }
    },
    "/getProductsList" : {
      "get" : {
        "tags" : [ "product-service" ],
        "summary" : "Returns products",
        "description" : "Returns list of all available products",
        "produces" : [ "application/json" ],
        "parameters" : [ {
          "name" : "debug",
          "in" : "query",
          "description" : "If true the API response contains event object",
          "required" : false,
          "type" : "string"
        } ],
        "responses" : {
          "200" : {
            "description" : "200 response",
            "schema" : {
              "$ref" : "#/definitions/Products"
            }
          },
          "400" : {
            "description" : "400 response",
            "schema" : {
              "$ref" : "#/definitions/400JsonResponse"
            }
          }
        }
      }
    }
  },
  "definitions" : {
    "400JsonResponse" : {
      "type" : "object",
      "properties" : {
        "message" : {
          "type" : "string"
        },
        "statusCode" : {
          "type" : "number"
        }
      }
    },
    "Products" : {
      "type" : "array",
      "items" : {
        "$ref" : "#/definitions/Product"
      }
    },
    "AvailabilityText" : {
      "type" : "string",
      "enum" : [ "Available now", "Backorders accepted, will ship by September 2, 2021", "Backorders accepted, will ship in 60 days", "Coming Soon", "Coming Soon on October 1, 2021", "Coming Soon on September 1, 2021", "Sold out", "Temporarily out of stock" ]
    },
    "Attributes" : {
      "type" : "object",
      "required" : [ "__typename", "availabilityStatus", "availabilityText", "canAddToBag", "canAddToWishlist", "featuredFlags", "maxOrderQuantity", "onSale" ],
      "properties" : {
        "__typename" : {
          "$ref" : "#/definitions/AttributesTypename"
        },
        "canAddToWishlist" : {
          "type" : "boolean"
        },
        "availabilityText" : {
          "$ref" : "#/definitions/AvailabilityText"
        },
        "featuredFlags" : {
          "type" : "array",
          "items" : {
            "$ref" : "#/definitions/FeaturedFlag"
          }
        },
        "onSale" : {
          "type" : "boolean"
        },
        "availabilityStatus" : {
          "$ref" : "#/definitions/AvailabilityStatus"
        },
        "canAddToBag" : {
          "type" : "boolean"
        },
        "maxOrderQuantity" : {
          "type" : "number"
        }
      }
    },
    "Label" : {
      "type" : "string",
      "enum" : [ "Hard to find", "New" ]
    },
    "Product" : {
      "type" : "object",
      "required" : [ "__typename", "baseImgUrl", "id", "name", "primaryImage", "productCode", "slug", "variant" ],
      "properties" : {
        "productCode" : {
          "type" : "string"
        },
        "primaryImage" : {
          "type" : "string"
        },
        "baseImgUrl" : {
          "type" : "string"
        },
        "__typename" : {
          "$ref" : "#/definitions/ProductTypename"
        },
        "name" : {
          "type" : "string"
        },
        "variant" : {
          "$ref" : "#/definitions/Variant"
        },
        "id" : {
          "type" : "string"
        },
        "slug" : {
          "type" : "string"
        }
      }
    },
    "VariantTypename" : {
      "type" : "string",
      "enum" : [ "ProductVariant" ]
    },
    "AttributesTypename" : {
      "type" : "string",
      "enum" : [ "ProductAttributes" ]
    },
    "ListPrice" : {
      "type" : "object",
      "required" : [ "__typename", "centAmount", "formattedAmount" ],
      "properties" : {
        "__typename" : {
          "$ref" : "#/definitions/ListPriceTypename"
        },
        "centAmount" : {
          "type" : "number"
        },
        "formattedAmount" : {
          "type" : "string"
        }
      }
    },
    "Variant" : {
      "type" : "object",
      "required" : [ "__typename", "attributes", "id", "listPrice", "price", "salePercentage", "sku" ],
      "properties" : {
        "salePercentage" : {
          "type" : "number"
        },
        "price" : {
          "$ref" : "#/definitions/Price"
        },
        "__typename" : {
          "$ref" : "#/definitions/VariantTypename"
        },
        "attributes" : {
          "$ref" : "#/definitions/Attributes"
        },
        "id" : {
          "type" : "string"
        },
        "sku" : {
          "type" : "string"
        },
        "listPrice" : {
          "$ref" : "#/definitions/ListPrice"
        }
      }
    },
    "CurrencyCode" : {
      "type" : "string",
      "enum" : [ "USD" ]
    },
    "AvailabilityStatus" : {
      "type" : "string",
      "enum" : [ "B_COMING_SOON_AT_DATE", "D_COMING_SOON", "E_AVAILABLE", "F_BACKORDER_FOR_DATE", "G_BACKORDER", "H_OUT_OF_STOCK", "K_SOLD_OUT" ]
    },
    "FeaturedFlag" : {
      "type" : "object",
      "required" : [ "__typename", "key", "label" ],
      "properties" : {
        "__typename" : {
          "$ref" : "#/definitions/FeaturedFlagTypename"
        },
        "label" : {
          "$ref" : "#/definitions/Label"
        },
        "key" : {
          "$ref" : "#/definitions/Key"
        }
      }
    },
    "Price" : {
      "type" : "object",
      "required" : [ "__typename", "centAmount", "currencyCode", "formattedAmount", "formattedValue" ],
      "properties" : {
        "__typename" : {
          "$ref" : "#/definitions/ListPriceTypename"
        },
        "centAmount" : {
          "type" : "number"
        },
        "formattedValue" : {
          "type" : "number"
        },
        "formattedAmount" : {
          "type" : "string"
        },
        "currencyCode" : {
          "$ref" : "#/definitions/CurrencyCode"
        }
      }
    },
    "FeaturedFlagTypename" : {
      "type" : "string",
      "enum" : [ "FeaturedFlags" ]
    },
    "ListPriceTypename" : {
      "type" : "string",
      "enum" : [ "Price" ]
    },
    "ProductTypename" : {
      "type" : "string",
      "enum" : [ "SingleVariantProduct" ]
    },
    "Key" : {
      "type" : "string",
      "enum" : [ "hardToFind", "new" ]
    }
  }
}
```
