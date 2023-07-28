import { Test, TestingModule } from '@nestjs/testing';
import { DresscutterService } from './dresscutter.service';

describe('DresscutterService', () => {
  let service: DresscutterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DresscutterService],
    }).compile();

    service = module.get<DresscutterService>(DresscutterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
