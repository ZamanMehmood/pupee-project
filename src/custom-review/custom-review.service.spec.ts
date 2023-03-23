import { Test, TestingModule } from '@nestjs/testing';
import { CustomReviewService } from './custom-review.service';

describe('CustomReviewService', () => {
  let service: CustomReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomReviewService],
    }).compile();

    service = module.get<CustomReviewService>(CustomReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
