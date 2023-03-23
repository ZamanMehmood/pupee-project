import { Test, TestingModule } from '@nestjs/testing';
import { AppImagesService } from './app-images.service';

describe('AppImagesService', () => {
  let service: AppImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppImagesService],
    }).compile();

    service = module.get<AppImagesService>(AppImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
