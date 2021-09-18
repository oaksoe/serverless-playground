import { Injectable } from '@nestjs/common';
import { CommonService } from '@app/common';

@Injectable()
export class ServerlessApp2Service {
  constructor(private readonly commonService: CommonService) {}

  getHello(): string {
    return this.commonService.getHello('Serverless App 2');
  }
}
