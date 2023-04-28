import { Test, TestingModule } from '@nestjs/testing';
import { EmbroiderController } from './embroider.controller';
import { EmbroiderService } from './embroider.service';

describe('EmbroiderController', () => {
  let controller: EmbroiderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmbroiderController],
      providers: [EmbroiderService],
    }).compile();

    controller = module.get<EmbroiderController>(EmbroiderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
