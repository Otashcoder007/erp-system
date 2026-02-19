import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

import {TemplatesService} from './templates.service';
import {CreateTaskCategoryDto} from './dto/create-task-category.dto';
import {CreateTaskTemplateDto} from './dto/create-task-template.dto';
import {UpdateTaskTemplateDto} from './dto/update-task-template.dto';

@ApiTags('Templates')
@Controller('templates')
export class TemplatesController {
    constructor(private readonly templatesService: TemplatesService) {}

    @ApiOperation({summary: 'Create task category'})
    @Post('categories')
    createCategory(@Body() dto: CreateTaskCategoryDto) {
        return this.templatesService.createCategory(dto);
    }

    @ApiOperation({summary: 'List categories (pagination + q filter)'})
    @Get('categories')
    listCategories(@Query('q') q?: string) {
        return this.templatesService.listCategories(q);
    }

    @ApiOperation({summary: 'Create task template'})
    @Post()
    createTemplate(@Body() dto: CreateTaskTemplateDto) {
        return this.templatesService.createTemplate(dto);
    }

    @ApiOperation({summary: 'List templates (pagination + q filter)'})
    @Get()
    listTemplates(@Query('q') q?: string) {
        return this.templatesService.listTemplates(q);
    }

    @ApiOperation({summary: 'Get template by id'})
    @Get(':id')
    getTemplate(@Param('id', ParseIntPipe) id: number) {
        return this.templatesService.getTemplate(id);
    }

    @ApiOperation({summary: 'Update template'})
    @Patch(':id')
    updateTemplate(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTaskTemplateDto) {
        return this.templatesService.updateTemplate(id, dto);
    }

    @ApiOperation({summary: 'Delete template'})
    @Delete(':id')
    deleteTemplate(@Param('id', ParseIntPipe) id: number) {
        return this.templatesService.deleteTemplate(id);
    }
}
