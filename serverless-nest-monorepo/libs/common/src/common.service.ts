import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
  getHello(serviceName: string) {
    return `hello ${serviceName}`;
  }
}
