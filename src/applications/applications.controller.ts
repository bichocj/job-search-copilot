import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';
import { CreateApplicationDto, UpdateApplicationDto } from './application.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly service: ApplicationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all tracked job applications' })
  @ApiOkResponse({ description: 'List of applications', type: Application, isArray: true })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single application by id' })
  @ApiOkResponse({ description: 'The application', type: Application })
  @ApiNotFoundResponse({ description: 'No application exists with the given id' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Save a new job application (without analysis yet)' })
  @ApiOkResponse({ description: 'Application created', type: Application })
  @ApiBadRequestResponse({ description: 'Missing or invalid fields (e.g. company/role/url required, url must be a valid URL)' })
  create(@Body() dto: CreateApplicationDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update status or notes for an application' })
  @ApiOkResponse({ description: 'Application updated', type: Application })
  @ApiBadRequestResponse({ description: 'Invalid status value or malformed body' })
  @ApiNotFoundResponse({ description: 'No application exists with the given id' })
  update(@Param('id') id: string, @Body() dto: UpdateApplicationDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a tracked application' })
  @ApiOkResponse({ description: 'Application removed' })
  @ApiNotFoundResponse({ description: 'No application exists with the given id' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

