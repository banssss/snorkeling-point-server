import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BuddyBoard } from 'src/apis/buddyBoards/entities/buddyBoard.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { BUDDY_PARTY_ROLE } from 'src/commons/type/enums';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

// graphql에 enum type 등록
registerEnumType(BUDDY_PARTY_ROLE, {
  name: 'BUDDY_PARTY_ROLE',
});
@Entity()
@ObjectType()
export class BuddyParty {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  id: string;

  @Column({ type: 'enum', enum: BUDDY_PARTY_ROLE })
  @Field(() => BUDDY_PARTY_ROLE)
  role: string;

  // BuddyParty : User - N : 1 연결
  @JoinColumn()
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.buddyParties)
  user: User;

  // BuddyParty : BuddyBoard - N : 1 연결
  @JoinColumn()
  @Field(() => BuddyBoard)
  @ManyToOne(() => BuddyBoard, (buddyBoard) => buddyBoard.buddyParties)
  buddyBoard: BuddyBoard;
}
