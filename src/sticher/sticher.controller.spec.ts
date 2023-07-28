import { Test, TestingModule } from '@nestjs/testing';
import { SticherController } from './sticher.controller';
import { SticherService } from './sticher.service';

describe('SticherController', () => {
  let controller: SticherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SticherController],
      providers: [SticherService],
    }).compile();

    controller = module.get<SticherController>(SticherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
