import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AgentService } from './agent.service';
import { ApplicationsService } from '../applications/applications.service';

class AnalyzeUrlDto {
  @ApiProperty({ example: 'https://job-boards.greenhouse.io/example/jobs/123' })
  @IsUrl()
  url: string;
}

@ApiTags('agent')
@Controller('agent')
export class AgentController {
  constructor(
    private readonly agentService: AgentService,
    private readonly applicationsService: ApplicationsService,
  ) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze a job posting URL for fit, without saving it as an application yet' })
  analyze(@Body() dto: AnalyzeUrlDto) {
    return this.agentService.analyzeJobPosting(dto.url);
  }

  @Post('applications/:id/analyze')
  @ApiOperation({ summary: 'Re-run (or run for the first time) the fit analysis for a saved application' })
  async analyzeExisting(@Param('id') id: string) {
    const app = await this.applicationsService.findOne(id);
    const analysis = await this.agentService.analyzeJobPosting(app.url);
    return this.applicationsService.saveFitAnalysis(id, analysis);
  }
}
