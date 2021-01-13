import '@aws-cdk/assert/jest';
import { Stack } from '@aws-cdk/core';
import * as AWS from 'aws-sdk';
import * as AWSMock from 'aws-sdk-mock';
import { handler } from '../lambda/src';
import { PersonalizeDatasetGroup } from '../src';

const groupName = 'personalize-dev';
const datasetGroupArn = `arn:aws:personalize:us-east-2:111111111111:dataset-group/${groupName}`;
const schemaArn = `arn:aws:personalize:us-east-2:111111111111:schema/${groupName}-interactions-schema`;
const datasetArn = `arn:aws:personalize:us-east-2:111111111111:schema/${groupName}-interactions-dataset`;
const eventTrackerArn = 'arn:aws:personalize:us-east-2:111111111111:event-tracker/fza51a7c';
const trackingId = '1111c1e1-11f1-11ea-11ae-1a11111e1c1c';

beforeAll(() => {
  AWSMock.setSDKInstance(AWS);

  // Describes
  AWSMock.mock('Personalize', 'describeDatasetGroup', {
    datasetGroup: {
      status: 'ACTIVE',
    },
  });

  // Creates
  AWSMock.mock('Personalize', 'createDatasetGroup', { datasetGroupArn });
  AWSMock.mock('Personalize', 'createSchema', { schemaArn });
  AWSMock.mock('Personalize', 'createDataset', { datasetArn });
  AWSMock.mock('Personalize', 'createEventTracker', { eventTrackerArn, trackingId });

  // Lists
  AWSMock.mock('Personalize', 'listDatasetGroups', {
    datasetGroups: [{ name: groupName, datasetGroupArn }],
  });

  AWSMock.mock('Personalize', 'listEventTrackers', {
    eventTrackers: [{ name: `${groupName}-tracker`, eventTrackerArn }],
  });

  AWSMock.mock('Personalize', 'listDatasets', {
    datasets: [{ name: `${groupName}-interactions-dataset`, datasetArn }],
  });

  AWSMock.mock('Personalize', 'listSchemas', {
    schemas: [{ name: `${groupName}-interactions-schema`, schemaArn }],
  });

  // Deletes
  AWSMock.mock('Personalize', 'deleteDatasetGroup', { datasetGroupArn });
  AWSMock.mock('Personalize', 'deleteSchema', { schemaArn });
  AWSMock.mock('Personalize', 'deleteDataset', { datasetArn });
  AWSMock.mock('Personalize', 'deleteEventTracker', { eventTrackerArn, trackingId });
});

afterAll(() => {
  // Creates
  AWSMock.restore('Personalize', 'createDatasetGroup');
  AWSMock.restore('Personalize', 'createSchema');
  AWSMock.restore('Personalize', 'createDataset');
  AWSMock.restore('Personalize', 'createEventTracker');

  // Lists
  AWSMock.restore('Personalize', 'listDatasetGroups');
  AWSMock.restore('Personalize', 'listEventTrackers');
  AWSMock.restore('Personalize', 'listDatasets');
  AWSMock.restore('Personalize', 'listSchemas');

  // Deletes
  AWSMock.restore('Personalize', 'deleteDatasetGroup');
  AWSMock.restore('Personalize', 'deleteSchema');
  AWSMock.restore('Personalize', 'deleteDataset');
  AWSMock.restore('Personalize', 'deleteEventTracker');
});

test('Stack Resources', () => {
  const stack = new Stack();
  new PersonalizeDatasetGroup(stack, 'test-personalize', {
    datasetGroupName: 'test-group-name',
  });

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

  const response: any = await handler(event, context);
  expect(response.Data).toBeTruthy();
  expect(response.Data.datasetGroupArn).toEqual(datasetGroupArn);
  expect(response.Data.trackingArn).toEqual(eventTrackerArn);
  expect(response.Data.trackingID).toEqual(trackingId);
});

test('Delete Personalize Function Mock', async () => {
  const event = {
    RequestType: 'Delete',
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
