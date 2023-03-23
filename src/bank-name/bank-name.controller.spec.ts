import { Test, TestingModule } from '@nestjs/testing';
import { BankNameController } from './bank-name.controller';

describe('BankNameController', () => {
  let controller: BankNameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankNameController],
    }).compile();

    controller = module.get<BankNameController>(BankNameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
