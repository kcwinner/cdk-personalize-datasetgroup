import * as path from 'path';
import { Role, ServicePrincipal, PolicyDocument, PolicyStatement, Effect } from '@aws-cdk/aws-iam';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Construct, CustomResource, Duration } from '@aws-cdk/core';
import { Provider } from '@aws-cdk/custom-resources';

const handlerCodeBundle = path.join(__dirname, '..', '.build');

export interface PersonalizeDatasetGroupProps {
  /**
   * The name for the Dataset Group
   * @default - `${id}-${STAGE}`
   */
  readonly datasetGroupName?: string;

  /**
   * The schema to use for interactions
   * @default - json string representing default interaction schema
   */
  readonly interactionsSchema?: string;
}

const defaultInteractionsSchema = JSON.stringify({
  type: 'record',
  name: 'Interactions',
  namespace: 'com.amazonaws.personalize.schema',
  fields: [
    {
      name: 'USER_ID',
      type: 'string',
    },
    {
      name: 'ITEM_ID',
      type: 'string',
    },
    {
      name: 'TIMESTAMP',
      type: 'long',
    },
  ],
  version: '1.0',
});

export class PersonalizeDatasetGroup extends Construct {
  public readonly datasetGroupArn: string
  public readonly trackingID: string
  public readonly trackingArn: string

  constructor(scope: Construct, id: string, props: PersonalizeDatasetGroupProps) {
    super(scope, id);

    const STAGE = this.node.tryGetContext('STAGE');

    const customPersonalizeFunctionRole = new Role(this, `${id}-custom-resource-role`, {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        { managedPolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole' },
      ],
      inlinePolicies: {
        'inline-lambda-policy': new PolicyDocument({
          statements: [
            new PolicyStatement({
              effect: Effect.ALLOW,
              actions: [
                'personalize:*',
              ],
              resources: ['*'],
            }),
          ],
        }),
      },
    });

    const personalizeCustomFunction = new Function(this, `${id}-custom-function`, {
      runtime: Runtime.NODEJS_12_X,
      handler: 'index.handler',
      code: Code.fromAsset(handlerCodeBundle),
      role: customPersonalizeFunctionRole,
      timeout: Duration.seconds(300),
    });

    const personalizeProvider = new Provider(this, `${id}-provider`, {
      onEventHandler: personalizeCustomFunction,
    });

    const personalizeCustomResource = new CustomResource(this, `${id}-custom-resource`, {
      resourceType: 'Custom::PersonalizeDatasetGroup',
      serviceToken: personalizeProvider.serviceToken,
      properties: {
        DatasetGroupName: props.datasetGroupName ?? `${id}-${STAGE}`,
        InteractionsSchema: props.interactionsSchema ?? defaultInteractionsSchema,
      },
    });

    this.datasetGroupArn = personalizeCustomResource.getAtt('datasetGroupArn').toString();
    this.trackingArn = personalizeCustomResource.getAtt('trackingArn').toString();
    this.trackingID = personalizeCustomResource.getAtt('trackingID').toString();
  }
}