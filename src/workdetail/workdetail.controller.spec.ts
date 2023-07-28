import { Test, TestingModule } from '@nestjs/testing';
import { WorkdetailController } from './workdetail.controller';
import { WorkdetailService } from './workdetail.service';

describe('WorkdetailController', () => {
  let controller: WorkdetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkdetailController],
      providers: [WorkdetailService],
    }).compile();

    controller = module.get<WorkdetailController>(WorkdetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
