import {ApiProperty} from "@nestjs/swagger";
import {IsString, MaxLength, MinLength} from "class-validator";

export class LoginDto {
  @ApiProperty()
  @IsString()
  @MaxLength(32)
  login: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
