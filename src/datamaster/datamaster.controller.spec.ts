import { Test, TestingModule } from '@nestjs/testing';
import { DataMasterController } from './datamaster.controller';

describe('DataMasterController', () => {
  let controller: DataMasterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataMasterController],
    }).compile();

    controller = module.get<DataMasterController>(DataMasterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
