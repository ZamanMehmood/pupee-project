import { Test, TestingModule } from '@nestjs/testing';
import { AffliatedLinksService } from './affliated-links.service';

describe('AffliatedLinksService', () => {
  let service: AffliatedLinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AffliatedLinksService],
    }).compile();

    service = module.get<AffliatedLinksService>(AffliatedLinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
