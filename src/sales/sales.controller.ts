import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { SalesResponseDto } from './dto/sales-response.dto';

@ApiTags('Sales')
@Controller('api/sales')
export class SalesController {

constructor(private readonly salesService: SalesService) {}

@Get()
@ApiQuery({ name: 'localItemDesc', required: false })
@ApiQuery({ name: 'wrin', required: false })
@ApiQuery({ name: 'store', required: false })
@ApiQuery({ name: 'dc', required: false })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número de página (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 100,
    description: 'Cantidad de registros por página (max: 1000)',
  })
  @ApiOkResponse({
    description: 'Listado paginado de ventas históricas',
    type: SalesResponseDto,
    isArray: true,
  })
  async getAll(
    @Query('localItemDesc') localItemDesc?: string,
    @Query('wrin') wrin?: string,
    @Query('store') store?: number,
    @Query('dc') dc?: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<SalesResponseDto[]> {

    const safePage = Math.max(Number(page) || 1, 1);
    const safeLimit = Math.min(Number(limit) || 100, 1000);

    return this.salesService.findAll(safePage, safeLimit, {
      localItemDesc,
      wrin,
      store: store ? Number(store) : undefined,
      dc: dc ? Number(dc) : undefined,
    });
  }
}
