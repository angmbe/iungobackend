import { Test, TestingModule } from '@nestjs/testing';
import { DataMasterService } from './datamaster.service';

describe('DataMasterService', () => {
  let service: DataMasterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataMasterService],
    }).compile();

    service = module.get<DataMasterService>(DataMasterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
