import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { BuddyBoardsService } from './buddyBoards.service';
import { CreateBuddyBoardInput } from './dto/createBuddyBoard.input';
import { UpdateBuddyBoardInput } from './dto/updateBuddyBoard.input';
import { BuddyBoard } from './entities/buddyBoard.entity';

@Resolver()
export class BuddyBoardsResolver {
  constructor(
    private readonly buddyBoardsService: BuddyBoardsService, //
  ) {}

  @Query(() => BuddyBoard, {
    description: 'Return : id 값으로 조회된 BuddyBoard 정보',
  })
  fetchBuddyBoard(
    @Args('buddyBoardId', { description: '조회 할 buddyBoard id' })
    buddyBoardId: string, //
  ) {
    return this.buddyBoardsService.findOne({ buddyBoardId });
  }

  @Query(() => [BuddyBoard], { description: 'Return : 버디모집 게시판 리스트' })
  fetchBuddyBoards(
    @Args('page', { description: '조회할 페이지 수' }) page: number, //
  ) {
    return this.buddyBoardsService.findAll({ page });
  }

  @Query(() => [BuddyBoard], {
    description: 'Return : SnkBoard에 연결된 BuddyBoard 리스트',
  })
  fetchLinkedBuddyBoards(
    @Args('snkBoardId', { description: 'BuddyBoard들이 연결된 SnkBoard id' })
    snkBoardId: string, //
  ) {
    return this.buddyBoardsService.findLinkedAll({ snkBoardId });
  }

  @Mutation(() => BuddyBoard, { description: 'Return : 생성된 BuddyBoard' })
  createBuddyBoard(
    @Args('userId', { description: 'BuddyBoard를 생성하는 User의 id(Host)' })
    userId: string,
    @Args('snkBoardId', { description: 'BuddyBoard를 생성할 SnkBoard의 id' })
    snkBoardId: string,
    @Args('createBuddyBoardInput', {
      description: 'BuddyBoard 입력값(제목, 상세내용, 모집일시, 모집인원)',
    })
    createBuddyBoardInput: CreateBuddyBoardInput,
  ) {
    return this.buddyBoardsService.create({
      userId,
      snkBoardId,
      createBuddyBoardInput,
    });
  }

  // @Mutation(() => BuddyBoard, {
  //   description:
  //     'Return : 수정된 BuddyBoard - 업데이트 로직 논의 필요 (버디보드 연결)',
  // })
  // updateBuddyBoard(
  //   @Args('buddyBoardId', { description: '수정할 BuddyBoard Id' })
  //   buddyBoardId: string,
  //   @Args('updateBuddyBoardInput') updateBuddyBoardInput: UpdateBuddyBoardInput,
  // ) {
  //   return this.buddyBoardsService.update({
  //     buddyBoardId,
  //     updateBuddyBoardInput,
  //   });
  // }

  // @Mutation(() => Boolean, { description: 'Return : 삭제 성공 여부' })
  // deleteBuddyBoard(
  //   @Args('buddyBoardId', { description: '삭제할 BuddyBoard Id' })
  //   buddyBoardId: string, //
  // ) {
  //   return this.buddyBoardsService.delete({ buddyBoardId });
  // }
}
