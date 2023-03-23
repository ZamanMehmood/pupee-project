import { Test, TestingModule } from '@nestjs/testing';
import { AppImagesController } from './app-images.controller';

describe('AppImagesController', () => {
  let controller: AppImagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppImagesController],
    }).compile();

    controller = module.get<AppImagesController>(AppImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
