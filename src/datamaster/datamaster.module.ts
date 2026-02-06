import { Module } from '@nestjs/common';
import { DataMasterController } from './datamaster.controller';
import { DataMasterService } from './datamaster.service';

@Module({
  controllers: [DataMasterController],
  providers: [DataMasterService]
})
export class DatamasterModule {}
