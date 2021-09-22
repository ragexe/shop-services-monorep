import { handlerPath } from '@libs/handlerResolver';
import { serverlessConfig } from '../../../serverless.config';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: serverlessConfig.storage.bucketName,
        event: 's3:ObjectCreated:*',
        existing: true,
        rules: [{ prefix: `${serverlessConfig.storage.uploadFolderName}/` }],
      },
    },
  ],
};