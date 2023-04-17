import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuddyBoard } from './entities/buddyBoard.entity';
import { BuddyBoardsResolver } from './buddyBoards.resolver';
import { BuddyBoardsService } from './buddyBoards.service';
import { BuddyBoardImage } from '../buddyBoardsImages/entities/buddyBoardImage.entity';
import { BuddyParty } from '../buddyParties/entities/buddyParty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BuddyBoard,
      BuddyBoardImage,
      BuddyParty, //
    ]),
  ],
  providers: [
    BuddyBoardsResolver, //
    BuddyBoardsService,
  ],
})
export class BuddyBoardsModule {}
