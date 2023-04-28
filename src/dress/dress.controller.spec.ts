import { Test, TestingModule } from '@nestjs/testing';
import { DressController } from './dress.controller';
import { DressService } from './dress.service';

describe('DressController', () => {
  let controller: DressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DressController],
      providers: [DressService],
    }).compile();

    controller = module.get<DressController>(DressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
