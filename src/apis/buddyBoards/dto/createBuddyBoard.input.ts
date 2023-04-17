import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class CreateBuddyBoardInput {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  meetDate: string;

  @Field(() => Int)
  members: number;
}
