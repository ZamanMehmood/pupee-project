import { Test, TestingModule } from '@nestjs/testing';
import { WeddingController } from './wedding.controller';

describe('WeddingController', () => {
  let controller: WeddingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeddingController],
    }).compile();

    controller = module.get<WeddingController>(WeddingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
