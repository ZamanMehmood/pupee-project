import { Test, TestingModule } from '@nestjs/testing';
import { AffiliateLinkSitesService } from './affiliate-link-sites.service';

describe('AffiliateLinkSitesService', () => {
  let service: AffiliateLinkSitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AffiliateLinkSitesService],
    }).compile();

    service = module.get<AffiliateLinkSitesService>(AffiliateLinkSitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
