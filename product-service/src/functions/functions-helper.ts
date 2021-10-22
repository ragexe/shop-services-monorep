import { DefaultLogger } from './../libs/logger';
import { AWS } from '@serverless/typescript';
import { Client } from 'pg';

import { ProxyEvent } from '../libs/apiGateway';
import {
  DataProvider,
  getProductFromDTO,
  Product,
  TProductDTO,
} from '../model';

export const DEFAULT_PRODUCT_PROVIDER: DataProvider<Product[]> = {
  retrieve: async (
    query = 'select * from products inner join stocks on stocks.product_id = products.id;',
  ) => {
    const databaseClient = getDataBaseClient();
    await databaseClient.connect();

    try {
      const { rows: productDTOs } = await databaseClient.query<TProductDTO>(
        query,
      );

      const products: Product[] = productDTOs.map<Product>((productDTO) =>
        getProductFromDTO(productDTO),
      );

      return products;
    } catch (error) {
      DefaultLogger.error(error);
      throw error;
    } finally {
      databaseClient.end();
    }
  },
};

export const getDataBaseClient = () => {
  const {
    PG_HOST,
    PG_PORT = 0,
    PG_DATABASE,
    PG_USERNAME,
    PG_PASSWORD,
  } = process.env;
  return new Client({
    host: PG_HOST,
    port: +PG_PORT,
    database: PG_DATABASE,
    user: PG_USERNAME,
    password: PG_PASSWORD,
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 5000,
  });
};

export interface Models {
  'application/json':
    | string
    | {
        schema: {
          type: string;
          items: string;
        };
      };
}

export interface MethodResponseClass {
  statusCode: string;
  responseBody?: { description: string };
  responseModels: Models;
}

export interface Documentation {
  summary: string;
  tags: string[];
  description?: string;
  requestModels?: Models;
  queryParams?: {
    name: string;
    description: string;
    required?: boolean;
  }[];
  methodResponses?: Array<MethodResponseClass | string>;
}

type TAWSFunctionEvent = NonNullable<
  NonNullable<AWS['functions']>[string]['events']
>[number];

type TAWSFunctionHTTPEventWithDocumentation =
  | Extract<
      TAWSFunctionEvent,
      {
        http: any;
      }
    > & {
      http: {
        documentation?: Documentation;
      };
    };

export type TAWSFunctionCustomEvent = (
  | TAWSFunctionEvent
  | TAWSFunctionHTTPEventWithDocumentation
)[];

export const isDebug: (event: ProxyEvent) => boolean = (event: ProxyEvent) =>
  event.queryStringParameters?.debug === 'true';

export type TLambdaDescription = {
  handler: string;
  events: TAWSFunctionCustomEvent;
};
