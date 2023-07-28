import { Test, TestingModule } from '@nestjs/testing';
import { SticherService } from './sticher.service';

describe('SticherService', () => {
  let service: SticherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SticherService],
    }).compile();

    service = module.get<SticherService>(SticherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
