import { Controller, Get } from '@nestjs/common';
import { ServerlessApp2Service } from './serverless-app-2.service';

@Controller()
export class ServerlessApp2Controller {
  constructor(private readonly serverlessApp2Service: ServerlessApp2Service) {}

  @Get()
  getHello(): string {
    return this.serverlessApp2Service.getHello();
  }
}
