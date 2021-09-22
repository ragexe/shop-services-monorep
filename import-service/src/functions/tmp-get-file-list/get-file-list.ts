import { S3 } from 'aws-sdk';

import { serverlessConfig } from '../../../serverless.config';

export const getFileList: () => Promise<S3.Object[]> = async () => {
  const s3 = new S3({ region: serverlessConfig.region });

  const params = {
    Bucket: serverlessConfig.storage.bucketName,
  };

  const result = await s3.listObjectsV2(params).promise();

  return result.Contents?.filter((content) => content.Size) ?? [];
};
