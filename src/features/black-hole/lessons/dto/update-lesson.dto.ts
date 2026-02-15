import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsDateString, IsOptional, IsString, MaxLength} from 'class-validator';

export class UpdateLessonDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(128)
    title?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsDateString()
    startDate?: string;
}
