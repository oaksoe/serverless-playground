import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      playground: {
        endpoint: '/graphql',
      },
    }),
  ],
  providers: [AppResolver],
})
export class AppModule {}
