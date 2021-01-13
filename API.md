# API Reference

**Classes**

Name|Description
----|-----------
[PersonalizeDatasetGroup](#cdk-personalize-datasetgroup-personalizedatasetgroup)|*No description*


**Structs**

Name|Description
----|-----------
[PersonalizeDatasetGroupProps](#cdk-personalize-datasetgroup-personalizedatasetgroupprops)|*No description*



## class PersonalizeDatasetGroup  <a id="cdk-personalize-datasetgroup-personalizedatasetgroup"></a>



__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new PersonalizeDatasetGroup(scope: Construct, id: string, props: PersonalizeDatasetGroupProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[PersonalizeDatasetGroupProps](#cdk-personalize-datasetgroup-personalizedatasetgroupprops)</code>)  *No description*
  * **datasetGroupName** (<code>string</code>)  The name for the Dataset Group. __*Default*__: `${id}-${STAGE}`
  * **interactionsSchema** (<code>string</code>)  The schema to use for interactions. __*Default*__: json string representing default interaction schema



### Properties


Name | Type | Description 
-----|------|-------------
**datasetGroupArn** | <code>string</code> | <span></span>
**trackingArn** | <code>string</code> | <span></span>
**trackingID** | <code>string</code> | <span></span>



## struct PersonalizeDatasetGroupProps  <a id="cdk-personalize-datasetgroup-personalizedatasetgroupprops"></a>






Name | Type | Description 
-----|------|-------------
**datasetGroupName**? | <code>string</code> | The name for the Dataset Group.<br/>__*Default*__: `${id}-${STAGE}`
**interactionsSchema**? | <code>string</code> | The schema to use for interactions.<br/>__*Default*__: json string representing default interaction schema



