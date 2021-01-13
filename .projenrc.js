const { AwsCdkConstructLibrary } = require('projen');

const project = new AwsCdkConstructLibrary({
  author: 'Ken Winner',
  authorAddress: 'kcswinner@gmail.com',
  description: 'Create an AWS Personalize Dataset Group, Interaction Schema, and more using the AWS CDK',
  name: 'cdk-personalize-datasetgroup',
  repositoryUrl: 'https://github.com/kcwinner/cdk-personalize-datasetgroup.git',
  catalog: {
    twitter: 'KenWin0x539'
  },
  defaultReleaseBranch: 'main',
  codeCov: true,

  // Turn off dependabot for cdk dependencies
  dependabotOptions: {
    ignore: [
      { dependencyName: '@aws-cdk*' },
    ],
  },

  cdkVersion: '1.73.0',
  cdkDependencies: [
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/core',
    '@aws-cdk/custom-resources',
  ],
  devDeps: [
    'aws-sdk',
    'aws-sdk-mock',
    'esbuild',
  ],

  gitignore: [
    '.build', // Ignore the esbuild bundle
  ],

  python: {
    distName: 'cdk-personalize-datasetgroup',
    module: 'cdk_personalize_datasetgroup',
  },
});

project.addTask('clean', {
  exec: 'rm -rf .build',
});

project.addTask('build:lambda', {
  exec: 'yarn run clean && esbuild lambda/src/index.ts --bundle --outdir=.build/ --target=node12 --platform=node',
});

project.addTask('test', {
  exec: 'yarn run clean && yarn run build:lambda && jest --passWithNoTests --updateSnapshot && yarn run eslint',
});

project.synth();
