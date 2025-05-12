# AWS CDK Example: A REST multi-component back end

This example AWS CDK application consists of multiple components which together create a REST API. This is a common approach for developing microservices. Each microservice has a dedicated repository and, possibly, the microservices are maintained by different teams.

In this example, there are 3 components:

- `rest-multi-api` - An API gateway component
- `rest-multi-auth` - A Cognito user pool and auth domain components
- `rest-multi-user` - A REST API component served by the API gateway and secured by custom authorizers and Cognito
