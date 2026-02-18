import { Controller, Get , Query } from '@nestjs/common';
import { ApiQuery, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { DataMasterService } from './datamaster.service';
import { DataMasterResponseDto } from './dto/datamaster-response.dto';

@ApiTags('DataMaster')
@Controller('api/datamaster')
export class DataMasterController {
  constructor(private readonly service: DataMasterService) {}

  @Get()
  @ApiQuery({ name: 'wrin', required: false })
  @ApiQuery({ name: 'wsi', required: false })
  @ApiQuery({ name: 'localItem', required: false })
  @ApiQuery({ name: 'localItemDesc', required: false })
  @ApiQuery({ name: 'supplierName', required: false })
  @ApiQuery({ name: 'dcCountry', required: false })
  @ApiQuery({
    name: 'logDate',
    required: false,
    type: String,
    example: '2024-01-01',
    description: 'Fecha de log (formato YYYY-MM-DD)',
  })
  @ApiOkResponse({
    description: 'Listado DataMaster histórico',
    type: DataMasterResponseDto,
    isArray: true,
  })
  async getAll(
    @Query('wrin') wrin?: string,
    @Query('wsi') wsi?: string,
    @Query('localItem') localItem?: string,
    @Query('localItemDesc') localItemDesc?: string,
    @Query('supplierName') supplierName?: string,
    @Query('dcCountry') dcCountry?: string,
    @Query('logDate') logDate?: string,
  ): Promise<DataMasterResponseDto[]> {
    return this.service.findAll({
      wrin,
      wsi: wsi ? Number(wsi) : undefined,
      localItem,
      localItemDesc,
      supplierName,
      dcCountry,
      logDate,
    });
  }
}

