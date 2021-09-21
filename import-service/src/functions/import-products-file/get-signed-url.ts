import { S3 } from 'aws-sdk';
import { serverlessConfig } from '../../../serverless.config';
import { v4 } from 'uuid';

import { ErrorMessages } from '../../model';

export const getSignedUrl = async (
  fileName: string | null | undefined,
  postfix: string = v4(),
) => {
  if (!fileName) {
    throw new Error(ErrorMessages.InvalidFileName);
  }

  const { name, extension } = getNameExtension(fileName);

  if (extension !== serverlessConfig.storage.fileExtension) {
    throw new Error(ErrorMessages.WrongFileExtension);
  }

  const s3 = new S3({ region: serverlessConfig.region });
  const key = `${serverlessConfig.storage.uploadFolderName}/${[
    name,
    postfix,
    extension,
  ].join('.')}`;

  const params = {
    Bucket: serverlessConfig.storage.bucketName,
    Key: key,
    ContentType: `text/${serverlessConfig.storage.fileExtension}`,
    Expires: 60,
  };

  const result = await s3.getSignedUrlPromise('putObject', params);
  return result;
};

const getNameExtension = (fileName: string) => {
  const extension = fileName.toLowerCase().match(/.[a-z]{3,4}$/)?.[0] ?? '';
  const name = fileName.replace(extension, '');

  return { name, extension: extension.replace('.', '') };
};
