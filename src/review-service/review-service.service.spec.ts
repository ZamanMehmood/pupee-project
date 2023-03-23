import { Test, TestingModule } from '@nestjs/testing';
import { ReviewServiceService } from './review-service.service';

describe('ReviewServiceService', () => {
  let service: ReviewServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewServiceService],
    }).compile();

    service = module.get<ReviewServiceService>(ReviewServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
