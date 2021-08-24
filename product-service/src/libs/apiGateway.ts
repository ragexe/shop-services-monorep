import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';
type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & {
  body: FromSchema<S>;
};
export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<
  ValidatedAPIGatewayProxyEvent<S>,
  APIGatewayProxyResult
>;

type TSupportedStatusCodes = 200 | 400 | 404;
type TFormResponse = (
  response: Record<string, unknown>,
  event: any,
  {
    debug,
  }: {
    debug?: boolean | undefined;
  },
) => {
  statusCode: TSupportedStatusCodes;
  body: string;
};

export const formResponse200: TFormResponse = (
  response: Record<string, unknown>,
  event,
  { debug = false },
) => formResponse(200, response, event, { debug });
export const formResponse400: TFormResponse = (
  response: Record<string, unknown>,
  event,
  { debug = false },
) => formResponse(400, response, event, { debug });
export const formResponse404: TFormResponse = (
  response: Record<string, unknown>,
  event,
  { debug = false },
) => formResponse(404, response, event, { debug });

const formResponse: (
  statusCode: TSupportedStatusCodes,
  response: Record<string, unknown>,
  proxyEvent: APIGatewayProxyEvent,
  { debug: boolean },
) => {
  statusCode: TSupportedStatusCodes;
  body: string;
} = (statusCode, response, event, { debug = false }) => {
  const resultResponseBody = {
    ...(debug ? { event } : {}),
    ...response,
  };

  return {
    statusCode,
    body: JSON.stringify(resultResponseBody),
  };
};
