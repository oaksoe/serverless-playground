import { Test, TestingModule } from '@nestjs/testing';
import { ServerlessApp2Controller } from './serverless-app-2.controller';
import { ServerlessApp2Service } from './serverless-app-2.service';

describe('ServerlessApp2Controller', () => {
  let serverlessApp2Controller: ServerlessApp2Controller;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ServerlessApp2Controller],
      providers: [ServerlessApp2Service],
    }).compile();

    serverlessApp2Controller = app.get<ServerlessApp2Controller>(ServerlessApp2Controller);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(serverlessApp2Controller.getHello()).toBe('Hello World!');
    });
  });
});
