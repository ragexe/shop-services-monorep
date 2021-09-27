import { getSignedUrl } from './../functions/import-products-file/get-signed-url';
import { mock as AWSMock, restore as AWSRestore } from 'aws-sdk-mock';
import { ErrorMessages } from '../model';

const FILE_NAME = 'product';
const FILE_POSTFIX = 'test';
const FILE_EXTENSION = 'csv';

describe('Lambda core getSignedUrl function', () => {
  test('it should return saved file path', async () => {
    const inputFileName = `${FILE_NAME}.${FILE_EXTENSION}`;
    const expected = `${FILE_NAME}.${FILE_POSTFIX}.${FILE_EXTENSION}`;

    AWSMock(
      'S3',
      'getSignedUrl',
      (
        _: unknown,
        _params: unknown,
        callback: (_: unknown, value: string) => unknown,
      ) => {
        callback(null, expected);
      },
    );

    const result: string = await getSignedUrl(inputFileName, FILE_POSTFIX);

    expect(result).toEqual(expected);
  });

  test('it should return saved file path: case insensitive', async () => {
    const inputFileName = `${FILE_NAME}.CSV`;
    const expected = `${FILE_NAME}.${FILE_POSTFIX}.csv`;

    AWSMock(
      'S3',
      'getSignedUrl',
      (
        _: unknown,
        _params: unknown,
        callback: (_: unknown, value: string) => unknown,
      ) => {
        callback(null, expected);
      },
    );

    const result: string = await getSignedUrl(inputFileName, FILE_POSTFIX);

    expect(result).toEqual(expected);
  });

  test('it should throw invalid file extension error', async () => {
    const inputFileName = `${FILE_NAME}.csw`;
    const expected = `${FILE_NAME}.${FILE_POSTFIX}.csw`;

    AWSMock(
      'S3',
      'getSignedUrl',
      (
        _: unknown,
        _params: unknown,
        callback: (_: unknown, value: string) => unknown,
      ) => {
        callback(null, expected);
      },
    );

    try {
      await getSignedUrl(inputFileName, FILE_POSTFIX);
    } catch (error) {
      expect(error.message).toEqual(ErrorMessages.WrongFileExtension);
    }
  });

  test('it should throw invalid file extension error: (no-dot-separator)', async () => {
    const inputFileName = `${FILE_NAME}${FILE_EXTENSION}`;
    const expected = `${FILE_NAME}.${FILE_POSTFIX}.csw`;

    AWSMock(
      'S3',
      'getSignedUrl',
      (
        _: unknown,
        _params: unknown,
        callback: (_: unknown, value: string) => unknown,
      ) => {
        callback(null, expected);
      },
    );

    try {
      await getSignedUrl(inputFileName, FILE_POSTFIX);
    } catch (error) {
      expect(error.message).toEqual(ErrorMessages.WrongFileExtension);
    }
  });

  test('it should throw invalid file name error', async () => {
    const inputFileName = ``;
    const expected = `${FILE_NAME}${FILE_POSTFIX}csw`;

    AWSMock(
      'S3',
      'getSignedUrl',
      (
        _: unknown,
        _params: unknown,
        callback: (_: unknown, value: string) => unknown,
      ) => {
        callback(null, expected);
      },
    );

    try {
      await getSignedUrl(inputFileName, FILE_POSTFIX);
    } catch (error) {
      expect(error.message).toEqual(ErrorMessages.InvalidFileName);
    }
  });

  afterEach(() => {
    AWSRestore('S3');
  });
});
