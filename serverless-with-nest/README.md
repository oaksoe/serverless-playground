### Setup
- Setup empty Nest App
```
npm i -g @nestjs/cli
nest new serverless-with-nest
```
- Install serverless packages
```
yarn init
yarn add @vendia/serverless-express aws-lambda
yarn add @types/aws-lambda serverless-offline
```

### Codes
- Serverless config: serverless.yml 
```yml
service:
  name: serverless-with-nest

plugins:
  - serverless-offline

provider:
  name: aws
  runtime: nodejs12.x

functions:
  main:
    handler: dist/main.handler
    events:
      - http:
          method: ANY
          path: /
      - http:
          method: ANY
          path: '{proxy+}'
```
- Update/Replace main.ts
```javascript
// main.ts
import { NestFactory } from '@nestjs/core';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app.module';

let server: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
```
- Update tsconfig.json
```javascript
{
  "compilerOptions": {
    ...
    "esModuleInterop": true
  }
}
```
- Update AppController `@Get()` => `@Get('/hello')`
```javascript
// src/app.controller.ts
...
@Get('/hello')
  getHello(): string {
...
```

### Run locally
- Now, run the commands
```
nest build
serverless offline
```
- Go to `http://localhost:3000/dev/hello`. You will see `Hello World!`

### Optimizations
When hello api function is invoked by serverless offline, it prompted the duration and billed duration
```
First call: Duration: 328.63 ms  Billed Duration: 329 ms
Subsequent call: Duration: 239.46 ms  Billed Duration: 240 ms
```

This can be optimized by building with webpack. In a default Nest app, `tsc` compiler is used to build, so code remains unbundled.

- Add webpack config in the root directory of the app
```javascript
module.exports = (options, webpack) => {
    const lazyImports = [
      '@nestjs/microservices/microservices-module',
      '@nestjs/websockets/socket-module',
    ];
  
    return {
      ...options,
      externals: [],
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
serverless offline
``` 
- Results
```
First call: Duration: 154.10 ms  Billed Duration: 155 ms
Subsequent call: Duration: 131.98 ms  Billed Duration: 132 ms
```
Notice the difference. The way it is compiled (whether code is bundled or not) impacts overall startup time.
