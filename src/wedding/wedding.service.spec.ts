import { Test, TestingModule } from '@nestjs/testing';
import { WeddingService } from './wedding.service';

describe('WeddingService', () => {
  let service: WeddingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeddingService],
    }).compile();

    service = module.get<WeddingService>(WeddingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
