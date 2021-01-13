# CDK Personalize DatasetGroup

## Resources Created

* Custom Resource Lambda Function
* Personalize Dataset Group
* Personalize Interactions Schema
* Personalize User-item interaction Dataset
* Personalize Event Tracker

## Returned Data

* Dataset Group Arn: `datasetGroupArn`
* Event Tracker Arn: `trackingArn`
* Event Tracker ID: `trackingID`

## Usage
```ts
import * as cdk from '@aws-cdk/core';

...
...

const personalizeDatasetGroup = new PersonalizeDatasetGroup(this, 'voxi-personalize', {
  datasetGroupName: 'my-group-name', // Optional
  interactionsSchema: '{...}' // Optional: json string of your interactions schema - defaults to a schema
});

...
...

new cdk.CfnOutput(this, 'personalizeTrackingIDOutput', {
  value: personalizeDatasetGroup.trackingID
  description: 'Tracking ID Output for Amplify or something else'
});
```

## References

* [AWS Personalize](https://docs.aws.amazon.com/personalize/latest/dg/what-is-personalize.html)
* [Personalize SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Personalize.html)
* [Amplify Personalize](https://docs.amplify.aws/lib/analytics/personalize/q/platform/js)