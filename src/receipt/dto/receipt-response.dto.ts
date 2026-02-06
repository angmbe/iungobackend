import { ApiProperty } from '@nestjs/swagger';

export class ReceiptResponseDto {
  localItemDesc?: string;
  wrin: string;
  supplierName?: string;
  wsi: number;
  dc: number;
  countryCode: number;
  transDc: number;
  dateRec: Date;
  cases: number;
  fcaCost: number;
  fcaCurr: string;
  freeDc: number;
  freeDcCurr: string;
  poNum: string;
  poLine: number;
  transDate: Date;
  logDate: Date;
  ordDate?: Date;
  localFlag?: string;
  gtin?: string;
  dcGln?: string;
  transDcGln?: string;
  facilityGln?: string;
}
