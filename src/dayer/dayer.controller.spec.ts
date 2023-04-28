import { Test, TestingModule } from '@nestjs/testing';
import { DayerController } from './dayer.controller';
import { DayerService } from './dayer.service';

describe('DayerController', () => {
  let controller: DayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DayerController],
      providers: [DayerService],
    }).compile();

    controller = module.get<DayerController>(DayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
