# CloudFront SPA Example

This example AWS CDK application deploys a React Single-Page Application, or SPA, to AWS.

## About the Application

This Vite template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

This React application was generated with the following command:

```
npm create vite@latest cloudfront-spa -- --template react-ts
```

## Available Scripts

### Application Scripts

Run these application scripts from the base project directory.

#### `npm run dev`

Runs the app in development mode. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

#### `npm run build`

Builds the app for production to the `/dist` directory.

### CDK Scripts

Run these AWS CDK scripts from the `/cdk` sub-directory.

#### `npm run cdk synth`

Synthesize a CDK application to produce an AWS CloudFormation template for each stack.

#### `npm run cdk deploy`

Deploy one or more AWS CDK stacks to an AWS environment.

#### `npm run cdk destroy`

Delete one or more AWS CDK stacks from the AWS environment.
