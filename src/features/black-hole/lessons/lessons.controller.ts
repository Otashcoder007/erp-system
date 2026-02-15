import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {LessonsService} from './lessons.service';
import {CreateLessonDto} from './dto/create-lesson.dto';
import {UpdateLessonDto} from './dto/update-lesson.dto';

@ApiTags('Lessons')
@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}

    @ApiOperation({summary: 'Create lesson'})
    @Post()
    create(@Body() dto: CreateLessonDto) {
        return this.lessonsService.create(dto);
    }

    @ApiOperation({summary: 'List lessons (q filter)'})
    @Get()
    findAll(@Query('q') q?: string) {
        return this.lessonsService.findAll(q);
    }

    @ApiOperation({summary: 'Get lesson by id'})
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.lessonsService.findOne(id);
    }

    @ApiOperation({summary: 'Update lesson'})
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLessonDto) {
        return this.lessonsService.update(id, dto);
    }

    @ApiOperation({summary: 'Delete lesson'})
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.lessonsService.remove(id);
    }
}
