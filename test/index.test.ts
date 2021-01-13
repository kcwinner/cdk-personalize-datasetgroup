import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import { handler } from '../lambda/src';
import { PersonalizeDatasetGroup } from '../src';


beforeAll(() => {
  AWSMock.setSDKInstance(AWS);
  AWSMock.mock('Personalize', 'createDatasetGroup', {
    datasetGroupArn: 'arn:aws:personalize:us-east-2:111111111111:dataset-group/personalize-dev',
  });

  AWSMock.mock('Personalize', 'describeDatasetGroup', {
    datasetGroup: {
      status: 'ACTIVE',
    },
  });

  AWSMock.mock('Personalize', 'createSchema', {
    schemaArn: 'arn:aws:personalize:us-east-2:111111111111:schema/interactions-schema',
  });

  AWSMock.mock('Personalize', 'createDataset', {
    datasetArn: 'arn:aws:personalize:us-east-2:111111111111:schema/personalize-dev-dataset',
  });

  AWSMock.mock('Personalize', 'createEventTracker', {
    eventTrackerArn: 'arn:aws:personalize:us-east-2:111111111111:schema/interactions-schema',
    trackingId: '1111c1e1-11f1-11ea-11ae-1a11111e1c1c',
  });
});

afterAll(() => {
  AWSMock.restore('Personalize', 'createDatasetGroup');
});

test('Stack Resources', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new PersonalizeDatasetGroup(stack, 'test-personalize', {
    datasetGroupName: 'test-group-name',
  });

  // THEN
  expect(stack).toHaveResource('Custom::PersonalizeDatasetGroup', {
    ServiceToken: {
      'Fn::GetAtt': [
        'testpersonalizetestpersonalizeproviderframeworkonEvent996C7416',
        'Arn',
      ],
    },
    DatasetGroupName: 'test-group-name',
    InteractionsSchema: '{"type":"record","name":"Interactions","namespace":"com.amazonaws.personalize.schema","fields":[{"name":"USER_ID","type":"string"},{"name":"ITEM_ID","type":"string"},{"name":"TIMESTAMP","type":"long"}],"version":"1.0"}',
  });
});

test('Create Personalize Function Mock', async () => {
  const event = {
    RequestType: 'Create',
    StackId: 'arn:aws:cloudformation:us-east-2:111111111111:stack/test/1111c1e1-11f1-11ea-11ae-1a11111e1c1c',
    RequestId: '1111c1e1-11f1-11ea-11ae-1a11111e1c1c',
    LogicalResourceId: 'personalizecustomresourceC2618567',
    ResourceType: 'Custom::PersonalizeDatasetGroup',
    ResourceProperties: {
      ServiceToken: 'arn:aws:lambda:us-east-2:111111111111:function:test-CDKPersonalizeDatasetGroup-1234321',
      DatasetGroupName: 'personalize-dev',
      InteractionsSchema: '{"type":"record","name":"Interactions","namespace":"com.amazonaws.personalize.schema","fields":[{"name":"USER_ID","type":"string"},{"name":"ITEM_ID","type":"string"},{"name":"TIMESTAMP","type":"long"}],"version":"1.0"}',
    },
  };

  const context = {};

  await handler(event, context);
});
