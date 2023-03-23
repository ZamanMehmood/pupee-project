import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawMethodController } from './withdraw-method.controller';

describe('WithdrawMethodController', () => {
  let controller: WithdrawMethodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WithdrawMethodController],
    }).compile();

    controller = module.get<WithdrawMethodController>(WithdrawMethodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
