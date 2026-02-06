export class InventoryResponseDto {
  localItemDesc?: string;
  wrin: string;
  gtin?: number;
  dcWsi: number;
  dcGln?: number;
  facilityCountry: number;
  inventoryDate: Date;
  supplierName?: string;
  facilityWsi: number;
  facilityGln?: number;
  supplierWsi: number;
  supplierGln?: number;
  inventoryCase: number;
  inventoryType: string;
  logDate: Date;
}
