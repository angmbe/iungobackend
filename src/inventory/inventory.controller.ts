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
@ApiQuery({ name: 'supplierName', required: false })
      @ApiOkResponse({
        description: 'Listado de inventario histórico',
        type: InventoryResponseDto,
        isArray: true,
})
async getAll(
    @Query('localItemDesc') localItemDesc?: string,
    @Query('wrin') wrin?: string,
    @Query('dcWsi') dcWsi?: string,
    @Query('supplierName') supplierName?: string,
  ): Promise<InventoryResponseDto[]> {

    return this.inventoryService.findAll(
      localItemDesc,
      wrin,
      dcWsi,
      supplierName,
    );
  }
}

