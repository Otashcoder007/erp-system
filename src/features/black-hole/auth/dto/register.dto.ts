import {ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import {IsEnum, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';
import {Roles} from '../../../../core/enums/roles.enum';
import {Gender} from '../../../../core/enums/gender.enum';

export class RegisterDto {
    @ApiProperty({enum: Roles, example: Roles.student})
    @IsEnum(Roles)
    role: Roles;

    @ApiProperty({maxLength: 32, example: 'otash007'})
    @IsString()
    @MaxLength(32)
    login: string;

    @ApiProperty({minLength: 6})
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({maxLength: 32})
    @IsString()
    @MaxLength(32)
    firstName: string;

    @ApiProperty({maxLength: 32})
    @IsString()
    @MaxLength(32)
    lastName: string;

    @ApiPropertyOptional({maxLength: 32})
    @IsOptional()
    @IsString()
    @MaxLength(32)
    middleName?: string;

    @ApiPropertyOptional({maxLength: 128})
    @IsOptional()
    @IsString()
    @MaxLength(128)
    profileImage?: string;

    @ApiProperty({example: '2004-02-13', description: 'YYYY-MM-DD'})
    @IsString()
    birthDate: string;

    @ApiProperty({enum: Gender})
    @IsEnum(Gender)
    gender: Gender;
}
