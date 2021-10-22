import { handlerPath } from '@libs/handlerResolver';

import { serverlessConfig } from '../../../serverless.config';
import { TLambdaDescription } from '../functions-helper';

const lambdaDescription: TLambdaDescription = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: {
          'Fn::ImportValue': serverlessConfig.parserQueue.importName,
        },
        batchSize: serverlessConfig.parserQueue.batchSize,
      },
    },
  ],
};

export default lambdaDescription;
