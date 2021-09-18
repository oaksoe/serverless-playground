import { Injectable } from '@nestjs/common';
import { CommonService } from '@app/common';

@Injectable()
export class AppService {
  constructor(private readonly commonService: CommonService) {}

  getHello(): string {
    return this.commonService.getHello('Serverless App 1');
  }
}
