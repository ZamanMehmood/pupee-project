import { Test, TestingModule } from '@nestjs/testing';
import {ModelingService} from "./modeling.service";

describe('ModelingService', () => {
  let service: ModelingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModelingService],
    }).compile();

    service = module.get<ModelingService>(ModelingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
