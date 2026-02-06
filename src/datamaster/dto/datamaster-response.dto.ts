import { ApiProperty } from '@nestjs/swagger';

export class DataMasterResponseDto {
  @ApiProperty() wrin: string;
  @ApiProperty() dcCountry: number;
  @ApiProperty({ required: false }) restMarket?: number;
  @ApiProperty() wsi: number;
  @ApiProperty() localItem: string;
  @ApiProperty({ required: false }) localItemDesc?: string;
  @ApiProperty({ required: false }) productCategory?: string;
  @ApiProperty({ required: false }) simSupplier?: string;
  @ApiProperty({ required: false }) supplierName?: string;
  @ApiProperty({ required: false }) simId?: string;
  @ApiProperty({ required: false }) facilityName?: string;
  @ApiProperty({ required: false }) facilityCountry?: number;
  @ApiProperty({ required: false }) facilityCity?: string;
  @ApiProperty({ required: false }) facilityAddress?: string;
  @ApiProperty({ required: false }) localItemFlag?: string;
  @ApiProperty() logDate: Date;
}
