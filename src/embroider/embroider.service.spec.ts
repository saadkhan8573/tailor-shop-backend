import { Test, TestingModule } from '@nestjs/testing';
import { EmbroiderService } from './embroider.service';

describe('EmbroiderService', () => {
  let service: EmbroiderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmbroiderService],
    }).compile();

    service = module.get<EmbroiderService>(EmbroiderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
