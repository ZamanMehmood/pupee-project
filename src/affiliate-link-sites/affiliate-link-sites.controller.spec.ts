import { Test, TestingModule } from '@nestjs/testing';
import { AffiliateLinkSitesController } from './affiliate-link-sites.controller';

describe('AffiliateLinkSitesController', () => {
  let controller: AffiliateLinkSitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffiliateLinkSitesController],
    }).compile();

    controller = module.get<AffiliateLinkSitesController>(AffiliateLinkSitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
