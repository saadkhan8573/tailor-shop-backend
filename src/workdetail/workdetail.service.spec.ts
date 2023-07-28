import { Test, TestingModule } from '@nestjs/testing';
import { WorkdetailService } from './workdetail.service';

describe('WorkdetailService', () => {
  let service: WorkdetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkdetailService],
    }).compile();

    service = module.get<WorkdetailService>(WorkdetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
