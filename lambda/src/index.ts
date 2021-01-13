import * as AWS from 'aws-sdk';

export async function handler(event: any, _: any) {
  console.info(event);

  // cloudformation request type (create/update/delete)
  const requestType = event.RequestType;

  // extract resource properties
  const props = event.ResourceProperties;
  // const physicalId = event.PhysicalResourceId ?? undefined;

  const datasetGroupname = props.DatasetGroupName;
  const interactionsSchema = props.InteractionsSchema; // JSON string

  switch (requestType) {
    case 'Create':
      return await createDataset(datasetGroupname, interactionsSchema);
    case 'Update':
      return await updateDataset();
    case 'Delete':
      return await deleteDataset(datasetGroupname);
    default:
      throw new Error(`Unknown/Unhandled requestType: ${requestType}`);
  }
}

/**
 * 
 * @param name - name of the dataset
 * @param interactionsSchema - the json string of the interactions schema
 */
async function createDataset(name: string, interactionsSchema: string) {
  const personalize = new AWS.Personalize(); // Needs to be initialized here to use aws-sdk-mock

  const createDatasetGroupParams = { name };
  const datasetGroupResult = await personalize.createDatasetGroup(createDatasetGroupParams).promise();

  const datasetGroupArn = datasetGroupResult.datasetGroupArn;
  if (!datasetGroupArn) throw new Error('Failed to create dataset group');

  let status: string | undefined = 'CREATE PENDING';
  while (status !== 'ACTIVE') {
    // sleep 500 ms
    await new Promise(r => setTimeout(r, 500));

    // Describe the dataset group to get the status
    const describeResult = await personalize.describeDatasetGroup({ datasetGroupArn }).promise();
    status = describeResult.datasetGroup?.status
    console.info('Status:', status);
    if (status === 'CREATE FAILED') {
      throw new Error('Failed to create dataset group')
    }
  }

  // Create the interactions schema for the interactions dataset
  const createInteractionsSchemaResult = await personalize.createSchema({
    name: `${name}-interactions-schema`,
    schema: interactionsSchema
  }).promise();

  if (!createInteractionsSchemaResult.schemaArn) throw new Error('Failed to create interactions schema');

  // Create the interactions dataset
  await personalize.createDataset({
    datasetGroupArn: datasetGroupArn,
    name: `${name}-interactions-dataset`,
    datasetType: 'User-item interaction',
    schemaArn: createInteractionsSchemaResult.schemaArn
  }).promise();

  // Finally create the event tracker since interactions are created
  const trackerResult = await personalize.createEventTracker({
    datasetGroupArn: datasetGroupArn,
    name: `${name}-tracker`
  }).promise();

  return {
    Data: {
      datasetGroupArn,
      trackingArn: trackerResult.eventTrackerArn,
      trackingID: trackerResult.trackingId,
    }
  }
}

async function updateDataset() {

}

async function deleteDataset(name: string) {
  const personalize = new AWS.Personalize(); // Needs to be initialized here to use aws-sdk-mock

  console.log(name);
  console.log(personalize);

  // TODO: Delete Tracker

  // TODO: Delete Dataset

  // TODO: Delete Schema

  // TODO: Delete Dataset Group

}