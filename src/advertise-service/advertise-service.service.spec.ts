import { Test, TestingModule } from '@nestjs/testing';
import { AdvertiseServiceService } from './advertise-service.service';

describe('AdvertiseServiceService', () => {
  let service: AdvertiseServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdvertiseServiceService],
    }).compile();

    service = module.get<AdvertiseServiceService>(AdvertiseServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
