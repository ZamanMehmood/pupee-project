import { Test, TestingModule } from '@nestjs/testing';
import { AdvertiseServiceController } from './advertise-service.controller';

describe('AdvertiseServiceController', () => {
  let controller: AdvertiseServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvertiseServiceController],
    }).compile();

    controller = module.get<AdvertiseServiceController>(AdvertiseServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
