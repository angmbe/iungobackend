import { Controller, Get ,Query} from '@nestjs/common';
import { ApiQuery, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { InventoryResponseDto } from './dto/inventory-response.dto';

@ApiTags('Inventory')
@Controller('api/inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

@Get()
@ApiQuery({ name: 'localItemDesc', required: false })
@ApiQuery({ name: 'wrin', required: false })
@ApiQuery({ name: 'dcWsi', required: false })
@ApiQuery({ name: 'facilityCountry', required: false })
@ApiQuery({ name: 'supplierName', required: false })
@ApiQuery({
    name: 'logDate',
    required: false,
    type: String,
    example: '2024-01-01',
    description: 'Fecha de log (formato YYYY-MM-DD)',
  })
      @ApiOkResponse({
        description: 'Listado de inventario histórico',
        type: InventoryResponseDto,
        isArray: true,
})
async getAll(
    @Query('localItemDesc') localItemDesc?: string,
    @Query('wrin') wrin?: string,
    @Query('dcWsi') dcWsi?: string,
    @Query('facilityCountry') facilityCountry?: string,
    @Query('supplierName') supplierName?: string,
    @Query('logDate') logDate?: string,
  ): Promise<InventoryResponseDto[]> {

    return this.inventoryService.findAll(
      localItemDesc,
      wrin,
      dcWsi,
      facilityCountry,
      supplierName,
      logDate,
    );
  }
}

