import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawMethodService } from './withdraw-method.service';

describe('WithdrawMethodService', () => {
  let service: WithdrawMethodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WithdrawMethodService],
    }).compile();

    service = module.get<WithdrawMethodService>(WithdrawMethodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
