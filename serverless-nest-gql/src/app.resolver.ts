import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query()
  hello(): string {
    return 'Hello World from GraphQL!';
  }
}
