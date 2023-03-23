import { Test, TestingModule } from '@nestjs/testing';
import { UserPaymentCardsService } from './user-payment-cards.service';

describe('UserPaymentCardsService', () => {
  let service: UserPaymentCardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserPaymentCardsService],
    }).compile();

    service = module.get<UserPaymentCardsService>(UserPaymentCardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
