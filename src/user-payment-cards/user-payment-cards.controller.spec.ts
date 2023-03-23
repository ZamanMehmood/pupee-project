import { Test, TestingModule } from '@nestjs/testing';
import { UserPaymentCardsController } from './user-payment-cards.controller';

describe('UserPaymentCardsController', () => {
  let controller: UserPaymentCardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserPaymentCardsController],
    }).compile();

    controller = module.get<UserPaymentCardsController>(UserPaymentCardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
