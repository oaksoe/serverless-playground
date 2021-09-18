import { Module } from '@nestjs/common';
import { ServerlessApp2Controller } from './serverless-app-2.controller';
import { ServerlessApp2Service } from './serverless-app-2.service';
import { CommonModule } from '@app/common';

@Module({
  imports: [CommonModule],
  controllers: [ServerlessApp2Controller],
  providers: [ServerlessApp2Service],
})
export class ServerlessApp2Module {}
