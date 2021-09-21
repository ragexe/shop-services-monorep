import { S3Event } from 'aws-lambda';
import { mock as AWSMock, restore as AWSRestore } from 'aws-sdk-mock';
import { importFileParser } from '../functions/import-file-parser/import-file-parser';
import { ILogger } from '../libs/logger';
import { ErrorMessages } from '../model';

const MOCK_EVENT: S3Event = {
  Records: [
    {
      eventVersion: '2.1',
      eventSource: 'aws:s3',
      awsRegion: 'eu-west-1',
      eventTime: '2021-09-21T16:38:31.637Z',
      eventName: 'ObjectCreated:Put',
      userIdentity: {
        principalId:
          'AWS:AROAR4Y5DPC4J2AIWPBIP:import-service-dev-importProductsFile',
      },
      requestParameters: {
        sourceIPAddress: '178.122.229.189',
      },
      responseElements: {
        'x-amz-request-id': 'VV73H2EXCCDXJBRE',
        'x-amz-id-2':
          'k5DLdAjezWZmePHlY+Bovim4MtrIKS1VpwOETalSWuatj331/253eOLd4jUwkA/4JglF0STsx8q2orXe7h+DXEUe9z1ItZGC',
      },
      s3: {
        s3SchemaVersion: '1.0',
        configurationId:
          'import-service-dev-importFileParser-9eceafef0fe575eb52543c9070542d86',
        bucket: {
          name: 'import-service-storage',
          ownerIdentity: {
            principalId: 'ARZHEPPV0UXLP',
          },
          arn: 'arn:aws:s3:::import-service-storage',
        },
        object: {
          key: 'uploaded/products1.c2956b3a-f8ea-401c-8def-7f5c3c6cd0ac.csv',
          size: 1511,
          eTag: '0f0982b3ab5cff1200d58e7cd1ef2028',
          sequencer: '00614A0A887C607C17',
        },
      },
    },
  ],
};

describe('Lambda core importFileParser function', () => {
  test('it should be created', async () => {
    AWSMock(
      'S3',
      'getObject',
      (_: unknown, callback: (_: unknown, value: string) => unknown) => {
        callback(null, 'getObjectMock');
      },
    );
    AWSMock(
      'S3',
      'copyObject',
      (_: unknown, callback: (_: unknown, value: string) => unknown) => {
        callback(null, 'copyObjectMock');
      },
    );
    AWSMock(
      'S3',
      'deleteObject',
      (_: unknown, callback: (_: unknown, value: string) => unknown) => {
        callback(null, 'deleteObjectMock');
      },
    );

    const mockParser = {
      fromStream: () => Promise.resolve([]),
    };

    const mockLogger: ILogger = {
      trace: () => {},
      error: () => {},
      log: () => {},
      debug: () => {},
    };

    const { isSuccessful } = await importFileParser(
      MOCK_EVENT,
      mockParser,
      mockLogger,
    );

    expect(isSuccessful).toEqual(true);
  });

  test('it should throw empty record error', async () => {
    AWSMock(
      'S3',
      'getObject',
      (_: unknown, callback: (_: unknown, value: string) => unknown) => {
        callback(null, 'getObjectMock');
      },
    );
    AWSMock(
      'S3',
      'copyObject',
      (_: unknown, callback: (_: unknown, value: string) => unknown) => {
        callback(null, 'copyObjectMock');
      },
    );
    AWSMock(
      'S3',
      'deleteObject',
      (_: unknown, callback: (_: unknown, value: string) => unknown) => {
        callback(null, 'deleteObjectMock');
      },
    );

    const mockParser = {
      fromStream: () => Promise.resolve([]),
    };

    const mockLogger: ILogger = {
      trace: () => {},
      error: () => {},
      log: () => {},
      debug: () => {},
    };

    try {
      await importFileParser(
        { Records: [] },
        mockParser,
        mockLogger,
      );
    } catch (error) {
      expect(error.message).toEqual(ErrorMessages.EmptyRecordList);
    }
  });

  afterEach(() => {
    AWSRestore('S3');
  });
});
