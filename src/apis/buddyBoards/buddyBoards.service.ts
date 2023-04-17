import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BUDDY_PARTY_ROLE } from 'src/commons/type/enums';
import { Repository } from 'typeorm';
import { BuddyBoardImage } from '../buddyBoardsImages/entities/buddyBoardImage.entity';
import { BuddyParty } from '../buddyParties/entities/buddyParty.entity';
import { BuddyBoard } from './entities/buddyBoard.entity';

@Injectable()
export class BuddyBoardsService {
  constructor(
    @InjectRepository(BuddyBoard)
    private readonly buddyBoardsRepository: Repository<BuddyBoard>, //

    @InjectRepository(BuddyBoardImage)
    private readonly buddyBoardsImagesRepository: Repository<BuddyBoardImage>,

    @InjectRepository(BuddyParty)
    private readonly buddyPartiesRepository: Repository<BuddyParty>,
  ) {}

  async findOne({ buddyBoardId }) {
    return await this.buddyBoardsRepository.findOne({
      where: { id: buddyBoardId },
      relations: {
        snkBoard: true,
        buddyChatRoom: true,
        buddyBoardImages: true,
        buddyParties: {
          user: true,
          role: true,
        },
        buddyBoardComments: true,
      },
      order: { buddyBoardImages: { isMain: 'DESC' } },
    });
  }

  async findAll({ page }) {
    return await this.buddyBoardsRepository.find({
      skip: page ? (page - 1) * 50 : 0, // page당 50개씩 조회
      take: 50,
      relations: {
        snkBoard: true,
        buddyChatRoom: true,
        buddyBoardImages: true,
        buddyParties: {
          user: true,
          role: true,
        },
        buddyBoardComments: true,
      },
      order: { buddyBoardImages: { isMain: 'DESC' } },
    });
  }

  async findLinkedAll({ snkBoardId }) {
    return await this.buddyBoardsRepository.find({
      where: { snkBoard: { id: snkBoardId } },
      relations: {
        snkBoard: true,
        buddyChatRoom: true,
        buddyBoardImages: true,
        buddyParties: {
          user: true,
          role: true,
        },
        buddyBoardComments: true,
      },
      order: { buddyBoardImages: { isMain: 'DESC' } },
    });
  }

  async create({ userId, snkBoardId, createBuddyBoardInput }) {
    // 이미 해당하는 SnkBoard에 Host로 등록되어 있는가?
    const isAlreadyHost = await this.buddyBoardsRepository.find({
      where: {
        buddyParties: { user: { id: userId }, role: BUDDY_PARTY_ROLE.HOST },
        snkBoard: { id: snkBoardId },
      },
    });

    if(isAlreadyHost.length !== 0)
      throw new ConflictException("해당 SnkBoard에 이미 Host인 BuddyBoard가 존재합니다. (중복 생성 불가)");

    // 1. SnkBoard와 연결된 BuddyBoard 생성
    const newBuddyBoard = await this.buddyBoardsRepository.save({
      ...createBuddyBoardInput,
      snkBoard: { id: snkBoardId },
    });

    // 2. BuddyBoard를 만들고자 하는 User가 Host인 BuddyParty 생성

    await this.buddyPartiesRepository.save({
      role: BUDDY_PARTY_ROLE.HOST,
      user: { id: userId },
      buddyBoard: newBuddyBoard,
    });

    return newBuddyBoard;
  }
}
