import { Controller, Get ,Query} from '@nestjs/common';
import { ApiQuery, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReceiptService } from './receipt.service';
import { ReceiptResponseDto } from './dto/receipt-response.dto';

@ApiTags('Receipts')
@Controller('api/receipts')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

@Get()
@ApiQuery({ name: 'localItemDesc', required: false })
@ApiQuery({ name: 'wrin', required: false })
@ApiQuery({ name: 'supplierName', required: false })
@ApiQuery({ name: 'wsi', required: false })
@ApiQuery({ name: 'dc', required: false })
    @ApiOkResponse({
      description: 'Listado de recibos históricos',
      type: ReceiptResponseDto,
      isArray: true,
    })
async getAll(
    @Query('localItemDesc') localItemDesc?: string,
    @Query('wrin') wrin?: string,
    @Query('supplierName') supplierName?: string,
    @Query('wsi') wsi?: string,
    @Query('dc') dc?: number,
): Promise<ReceiptResponseDto[]> {
      return this.receiptService.findAll({
        localItemDesc,
        wrin,
        supplierName,
        wsi: wsi ? Number(wsi) : undefined,
        dc: dc ? Number(dc) : undefined,
      });
    }
}

