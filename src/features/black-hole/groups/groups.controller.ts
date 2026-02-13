import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {GroupsService} from './groups.service';
import {CreateGroupDto} from './dto/create-group.dto';
import {AddStudentToGroupDto} from './dto/add-student.dto';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
    constructor(private readonly groupsService: GroupsService) {}

    @ApiOperation({summary: 'Create group'})
    @Post()
    create(@Body() dto: CreateGroupDto) {
        return this.groupsService.create(dto);
    }

    @ApiOperation({summary: 'List groups (q filter)'})
    @Get()
    findAll(@Query('q') q?: string) {
        return this.groupsService.findAll(q);
    }

    @ApiOperation({summary: 'Get group by id'})
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.groupsService.findOne(id);
    }

    @ApiOperation({summary: 'Add student to group'})
    @Post(':id/students')
    addStudent(@Param('id', ParseIntPipe) id: number, @Body() dto: AddStudentToGroupDto) {
        return this.groupsService.addStudent(id, dto);
    }

    @ApiOperation({summary: 'Remove student from group'})
    @Delete(':id/students/:studentId')
    removeStudent(@Param('id', ParseIntPipe) id: number, @Param('studentId', ParseIntPipe) studentId: number) {
        return this.groupsService.removeStudent(id, studentId);
    }
}
