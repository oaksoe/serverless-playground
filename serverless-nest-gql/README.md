### Setup
- Add GraphQL packages
```
nest new serverless-nest-gql
yarn add @nestjs/graphql graphql apollo-server-express
```
- Update tsconfig.json
```javascript
{
  "compilerOptions": {
   ...
    "skipLibCheck": true,
    "esModuleInterop": true // for serverless
  },
  ...
}
```
- Add/Update src files
```javascript
// app.graphql
type Query {
  hello: String!
}

// app.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query()
  hello(): string {
    return 'Hello World from GraphQL!';
  }
}

// app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      playground: {
        endpoint: '/dev/graphql',    // /{stage}/graphql => for serverless, use /graphql for normal server
      },
    }),
  ],
  providers: [AppResolver],
})
export class AppModule {}
```
- run with `yarn start` and go to `http://localhost:3000/graphql`, try the query `{ hello }`

### Compile with Webpack
- add `webpack-node-externals` dev package 
```
yarn add webpack-node-externals --dev
```
- add `nodeExternals()` to externals setting, to ignore all modules in `node_modules` folder, otherwise, will have build errors from those modules
```javascript
// webpack.config.js
const nodeExternals = require('webpack-node-externals');

module.exports = (options, webpack) => {
    const lazyImports = [
      '@nestjs/microservices/microservices-module',
      '@nestjs/websockets/socket-module',
    ];
  
    return {
      ...options,
      externals: [nodeExternals()],
      output: {
        filename: 'main.js',
        libraryTarget: 'commonjs2',
      },
      plugins: [
        ...options.plugins,
        new webpack.IgnorePlugin({
          checkResource(resource) {
            if (lazyImports.includes(resource)) {
              try {
                require.resolve(resource);
              } catch (err) {
                return true;
              }
            }
            return false;
          },
        }),
      ],
    };
  };
```
- Now, build with webpack and run
```
nest build --webpack
node dist/main
```
If all good here, we proceed to serverless part.

### Serverless
- Add `main.ts` file (refer to the previous articles)
- Add `serverless.yml`
```yml
service: serverless-nest-gql

plugins:
  - serverless-offline

provider:
  name: aws
  runtime: nodejs12.x
  stage: dev                             
  region: ap-southeast-1                 
  memorySize: 256                        

functions:
  main:
    handler: dist/main.handler
    events:
      - http:
          method: GET
          cors: true
          path: graphql
      - http:
          method: POST
          cors: true
          path: graphql
```
- Now, build with webpack, then run offline or deploy to AWS Lambda
```
nest build --webpack
serverless offline (or) serverless deploy
```
- Go to localhost:3000/dev/graphql (or) https://j18k43cia6.execute-api.ap-southeast-1.amazonaws.com/dev/graphql
- Playground will load and you can query `{ hello }` from there.

Note that playground will send introspection query every 2 seconds by default, which will incur charges by AWS Lambda, so you may want to increase polling interval in playground settings. `"schema.polling.interval": 20000000000,` for example.
