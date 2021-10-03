import { handlerPath } from '@libs/handlerResolver';
import { AWS } from '@serverless/typescript';

import { serverlessConfig } from '../../../serverless.config';

type TEvents = NonNullable<AWS['functions']>[string]['events'];
type TLambdaDescription = {
  handler: string;
  events: TEvents;
};

const val: TLambdaDescription = {
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

export default val;
