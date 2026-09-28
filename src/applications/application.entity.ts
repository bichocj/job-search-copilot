import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum ApplicationStatus {
  SAVED = 'saved',
  APPLIED = 'applied',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
}

class FitAnalysis {
  @ApiProperty({ type: [String] })
  extractedStack: string[];

  @ApiProperty({ type: [String] })
  matchedSkills: string[];

  @ApiProperty({ type: [String] })
  gaps: string[];

  @ApiProperty({ nullable: true, example: 'Requires on-site in Dubai' })
  locationFlag: string | null;

  @ApiProperty()
  summary: string;
}

@Entity('applications')
export class Application {
  @ApiProperty({ example: 'b3f1c2e0-...' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Neginet' })
  @Column()
  company: string;

  @ApiProperty({ example: 'Senior Software Engineer — Payments Infrastructure' })
  @Column()
  role: string;

  @ApiProperty({ example: 'https://example.com/careers/123' })
  @Column()
  url: string;

  @ApiProperty({ enum: ApplicationStatus, default: ApplicationStatus.SAVED })
  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.SAVED })
  status: ApplicationStatus;

  @ApiProperty({ type: FitAnalysis, nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  fitAnalysis: FitAnalysis | null;

  @ApiProperty({ nullable: true, required: false })
  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
