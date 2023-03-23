import { Test, TestingModule } from '@nestjs/testing';
import { CustomReviewController } from './custom-review.controller';

describe('CustomReviewController', () => {
  let controller: CustomReviewController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomReviewController],
    }).compile();

    controller = module.get<CustomReviewController>(CustomReviewController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
