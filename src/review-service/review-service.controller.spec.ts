import { Test, TestingModule } from '@nestjs/testing';
import { ReviewServiceController } from './review-service.controller';

describe('ReviewServiceController', () => {
  let controller: ReviewServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewServiceController],
    }).compile();

    controller = module.get<ReviewServiceController>(ReviewServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
