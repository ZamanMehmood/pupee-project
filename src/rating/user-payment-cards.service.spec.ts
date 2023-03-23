import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from './user-payment-cards.service';

describe('UserPaymentCardsService', () => {
  let service: RatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RatingService],
    }).compile();

    service = module.get<RatingService>(RatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
