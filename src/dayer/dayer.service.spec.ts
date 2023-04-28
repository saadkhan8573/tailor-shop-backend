import { Test, TestingModule } from '@nestjs/testing';
import { DayerService } from './dayer.service';

describe('DayerService', () => {
  let service: DayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DayerService],
    }).compile();

    service = module.get<DayerService>(DayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
