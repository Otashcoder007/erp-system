import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {SubmissionsService} from './submissions.service';
import {CreateSubmissionDto} from './dto/create-submission.dto';
import {UpdateSubmissionDto} from './dto/update-submission.dto';
import {MarkSubmissionDto} from './dto/mark-submission.dto';

@ApiTags('Submissions')
@Controller('submissions')
export class SubmissionsController {
    constructor(private readonly submissionsService: SubmissionsService) {}

    @ApiOperation({summary: 'Create submission'})
    @Post()
    create(@Body() dto: CreateSubmissionDto) {
        return this.submissionsService.create(dto);
    }

    @Get()
    findAll(@Query('page') _page?: number, @Query('limit') _limit?: number, @Query('q') q?: string) {
        return this.submissionsService.findAll(q);
    }

    @ApiOperation({summary: 'Get submission by id'})
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.submissionsService.findOne(id);
    }

    @ApiOperation({summary: 'Update submission content'})
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSubmissionDto) {
        return this.submissionsService.updateOwned(id, dto);
    }

    @ApiOperation({summary: 'Mark submission'})
    @Patch(':id/mark')
    mark(@Param('id', ParseIntPipe) id: number, @Body() dto: MarkSubmissionDto) {
        return this.submissionsService.mark(id, dto);
    }

    @ApiOperation({summary: 'Delete submission'})
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.submissionsService.remove(id);
    }
}
