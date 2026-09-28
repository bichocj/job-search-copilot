import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './application.entity';
import { CreateApplicationDto, UpdateApplicationDto } from './application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private readonly repo: Repository<Application>,
  ) {}

  findAll(): Promise<Application[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<Application> {
    const app = await this.repo.findOne({ where: { id } });
    if (!app) throw new NotFoundException(`Application ${id} not found`);
    return app;
  }

  create(dto: CreateApplicationDto): Promise<Application> {
    const app = this.repo.create({ ...dto, fitAnalysis: null });
    return this.repo.save(app);
  }

  async update(id: string, dto: UpdateApplicationDto): Promise<Application> {
    const app = await this.findOne(id);
    Object.assign(app, dto);
    return this.repo.save(app);
  }

  async saveFitAnalysis(id: string, fitAnalysis: Application['fitAnalysis']): Promise<Application> {
    const app = await this.findOne(id);
    app.fitAnalysis = fitAnalysis;
    return this.repo.save(app);
  }

  async remove(id: string): Promise<void> {
    const app = await this.findOne(id);
    await this.repo.remove(app);
  }
}
