import { Test, TestingModule } from '@nestjs/testing';
import { DresscutterController } from './dresscutter.controller';
import { DresscutterService } from './dresscutter.service';

describe('DresscutterController', () => {
  let controller: DresscutterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DresscutterController],
      providers: [DresscutterService],
    }).compile();

    controller = module.get<DresscutterController>(DresscutterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
