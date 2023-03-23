import { Test, TestingModule } from '@nestjs/testing';
import { AffliatedLinksController } from './affliated-links.controller';

describe('AffliatedLinksController', () => {
  let controller: AffliatedLinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AffliatedLinksController],
    }).compile();

    controller = module.get<AffliatedLinksController>(AffliatedLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
