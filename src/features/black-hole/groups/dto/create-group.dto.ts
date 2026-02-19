import {ApiProperty} from "@nestjs/swagger";
import {IsDateString, IsEnum, IsInt, IsString, MaxLength} from "class-validator";
import {GroupStatus} from "../../../../core/enums/group-status.enum";

export class CreateGroupDto {
  @ApiProperty()
  @IsInt()
  teacherId: number;

  @ApiProperty()
  @IsString()
  @MaxLength(128)
  title: string;

  @ApiProperty()
  @IsDateString()
  startDate: string;

  @ApiProperty({enum: GroupStatus})
  @IsEnum(GroupStatus)
  status: GroupStatus;
}
