import { InputType, PartialType } from '@nestjs/graphql';
import { CreateBuddyBoardInput } from './createBuddyBoard.input';

@InputType()
export class UpdateBuddyBoardInput extends PartialType(CreateBuddyBoardInput) {}
