import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { InventoryResponseDto } from './dto/inventory-response.dto';

@Injectable()
export class InventoryService {

  private async getConnection() {
    return oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING,
    });
  }

  async findAll(
    localItemDesc?: string,
    wrin?: string,
    dcWsi?: string,
    facilityCountry?: string,
    supplierName?: string,
    logDate?: string,
  ): Promise<InventoryResponseDto[]> {

    let connection: oracledb.Connection | undefined;

    try {
      connection = await this.getConnection();

      let query = `
        SELECT
          LOCAL_ITEM_DESC,
          WRIN,
          GTIN,
          DC_WSI,
          DC_GLN,
          FACILITY_COUNTRY,
          INVENTORY_DATE,
          SUPPLIER_NAME,
          FACILITY_WSI,
          FACILITY_GLN,
          SUPPLIER_WSI,
          SUPPLIER_GLN,
          INVENTORY_CASE,
          INVENTORY_TYPE,
          LOG_DATE
        FROM SAR2SAP.SS_DW_INVENTORY_HIST
        WHERE 1 = 1
      `;

      const binds: any = {};

      if (localItemDesc) {
        query += ` AND UPPER(LOCAL_ITEM_DESC) LIKE '%' || UPPER(:localItemDesc) || '%'`;
        binds.localItemDesc = localItemDesc;
      }

      if (wrin) {
        query += ` AND WRIN = :wrin`;
        binds.wrin = wrin;
      }

      if (dcWsi) {
        query += ` AND DC_WSI = :dcWsi`;
        binds.dcWsi = dcWsi;
      }

      if (facilityCountry) {
        query += ` AND FACILITY_COUNTRY = :facilityCountry`;
        binds.facilityCountry = facilityCountry;
      }

      if (supplierName) {
        query += ` AND UPPER(SUPPLIER_NAME) LIKE '%' || UPPER(:supplierName) || '%'`;
        binds.supplierName = supplierName;
      }

      if (logDate) {
        query += ` AND LOG_DATE >= TO_DATE(:logDate, 'YYYY-MM-DD') AND LOG_DATE < TO_DATE(:logDate, 'YYYY-MM-DD') + 1`;
        binds.logDate = logDate;
      }
    

      const result = await connection.execute(
        query,
        binds,
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      return (result.rows ?? []).map((row: any) => ({
        localItemDesc: row.LOCAL_ITEM_DESC,
        wrin: row.WRIN,
        gtin: row.GTIN,
        dcWsi: row.DC_WSI,
        dcGln: row.DC_GLN,
        facilityCountry: row.FACILITY_COUNTRY,
        inventoryDate: row.INVENTORY_DATE,
        supplierName: row.SUPPLIER_NAME,
        facilityWsi: row.FACILITY_WSI,
        facilityGln: row.FACILITY_GLN,
        supplierWsi: row.SUPPLIER_WSI,
        supplierGln: row.SUPPLIER_GLN,
        inventoryCase: row.INVENTORY_CASE,
        inventoryType: row.INVENTORY_TYPE,
        logDate: row.LOG_DATE,
      }));

    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
}
