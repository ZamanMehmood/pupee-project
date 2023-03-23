import { Test, TestingModule } from '@nestjs/testing';
import {ModelingController} from "./modeling.controller";

describe('ModelingController', () => {
  let controller: ModelingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModelingController],
    }).compile();

    controller = module.get<ModelingController>(ModelingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
