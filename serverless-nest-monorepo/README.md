### Monorepo Setup (Nest Way)
- Create first nest app as usual
```
nest new serverless-app-1
```
- Convert to monorepo mode by generating 2nd app
```
nest generate app serverless-app-2
```
- folder structure inside will be like:
```
apps
  serverless-app-1
    src
      app.controller.ts
      app.module.ts
      app.service.ts
      main.ts
    tsconfig.app.json
  serverless-app-2
    src
      app.controller.ts
      app.module.ts
      app.service.ts
      main.ts
    tsconfig.app.json
nest-cli.json
package.json
tsconfig.json
.eslintrc.js
```
- Now, rename the root folder name and name inside `package.json` to `serverless-nest-monorepo`

### Shared library
- For shared codes among the apps, you can create a library
```
nest generate library common
```
- Reference mapping to the library with be auto-generated in tsconfig.json with default `@app/`.
```javascript
// tsconfig.json
{
  "compilerOptions: {
    "paths": {
      "@app/common": [
        "libs/common/src"
      ],
      "@app/common/*": [
        "libs/common/src/*"
      ]
    }
  }
}
```
- Add some functions to the library
```javascript
// libs/common/src/common.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  getHello(serviceName: string) {
    return `hello ${serviceName}`;
  }
}
```
- Now, use this function in the apps
```javascript
// serverless-app-1/src/app.module.ts
import { CommonModule } from '@app/common';
@Module({
  imports: [CommonModule],
  ...
})
export class AppModule {}

// serverless-app-1/src/app.service.ts
import { Injectable } from '@nestjs/common';
import { CommonService } from '@app/common';

@Injectable()
export class AppService {
  constructor(private readonly commonService: CommonService) {}

  getHello(): string {
    return this.commonService.getHello('Serverless App 1');
  }
}
```

### Run the apps
Update port to `3001` in app 2 to avoid using same port in 2 apps
```
nest build serverless-app-1
node dist/apps/serverless-app-1/main
nest build serverless-app-2
node dist/apps/serverless-app-2/main
```

### Convert apps into serverless
- Follow previous article and convert each app to serverless
- Although monorepo mode builds the apps with its setting `webpack: true` in nest-cli.json, for serverless, will need to update certain webpack configuration, so add webpack.config.js file in the root directory. Make sure the following configuration in the file.
```javascript
// webpack.config.js
...
output: {
        libraryTarget: 'commonjs2',
      },
...
```
- Add serverless.yml file to the root directory.
```yml
service:
  name: serverless-apis

plugins:
  - serverless-offline

provider:
  name: aws
  runtime: nodejs12.x

functions:
  app1:
    handler: dist/apps/serverless-app-1/main.handler
    events:
      - http:
          method: ANY
          path: /app1/
      - http:
          method: ANY
          path: '/app1/{proxy+}'
  app2:
    handler: dist/apps/serverless-app-2/main.handler
    events:
      - http:
          method: ANY
          path: /app2/
      - http:
          method: ANY
          path: '/app2/{proxy+}'
```
- Now, run the following commands to build
```
nest build serverless-app-1 && mv dist/main.js dist/apps/serverless-app-1
nest build serverless-app-2 && mv dist/main.js dist/apps/serverless-app-2
```
- Run offline or deploy to AWS Lambda
```
serverless offline
serverless deploy --region ap-southeast-1 
```
