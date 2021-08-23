import { AWS } from '@serverless/typescript';
import { APIGatewayProxyEvent } from 'aws-lambda';

export type TAWSFunctionEvent = AWS['functions'][string]['events'];

export const isDebug: (event: APIGatewayProxyEvent) => boolean = (event: APIGatewayProxyEvent) =>
  event.queryStringParameters?.debug === 'true';
