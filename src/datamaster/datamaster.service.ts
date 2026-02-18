import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { DataMasterResponseDto } from './dto/datamaster-response.dto';

@Injectable()
export class DataMasterService {

  private async getConnection(): Promise<oracledb.Connection> {
    return oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING,
    });
  }

  async findAll(filters: {
    wrin?: string;
    wsi?: number;
    localItem?: string;
    localItemDesc?: string;
    supplierName?: string;
    dcCountry?: string;
    logDate?: string;
  }): Promise<DataMasterResponseDto[]> {

    let connection: oracledb.Connection | undefined;

    const conditions: string[] = [];
    const binds: any = {};

    if (filters.wrin) {
      conditions.push('TRIM(WRIN) = TRIM(:wrin)');
      binds.wrin = filters.wrin;
    }

    if (filters.wsi) {
      conditions.push('WSI = :wsi');
      binds.wsi = filters.wsi;
    }

    if (filters.localItem) {
      conditions.push('LOCAL_ITEM = :localItem');
      binds.localItem = filters.localItem;
    }

    if (filters.localItemDesc) {
      conditions.push('UPPER(LOCAL_ITEM_DESC) LIKE UPPER(:localItemDesc)');
      binds.localItemDesc = `%${filters.localItemDesc}%`;
    }

    if (filters.supplierName) {
      conditions.push(`UPPER(SUPPLIER_NAME) LIKE UPPER(:supplierName)`);
      binds.supplierName = `%${filters.supplierName}%`;
    }

    if (filters.dcCountry) {
        conditions.push('DC_COUNTRY = :dcCountry');
        binds.dcCountry = filters.dcCountry;
      }

    if (filters.logDate) {
      conditions.push(`
        LOG_DATE >= TO_DATE(:logDate, 'YYYY-MM-DD')
        AND LOG_DATE < TO_DATE(:logDate, 'YYYY-MM-DD') + 1
      `);
      binds.logDate = filters.logDate;
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    try {
      connection = await this.getConnection();

      const result = await connection.execute(
        `
        SELECT
          WRIN,
          DC_COUNTRY,
          REST_MARKET,
          WSI,
          LOCAL_ITEM,
          LOCAL_ITEM_DESC,
          PRODUCT_CATEGORY,
          SIM_SUPPLIER,
          SUPPLIER_NAME,
          SIM_ID,
          FACILITY_NAME,
          FACILITY_COUNTRY,
          FACILITY_CITY,
          FACILITY_ADDRESS,
          LOCAL_ITEM_FLAG,
          LOG_DATE
        FROM SAR2SAP.SS_DW_DATAMASTER_HIST
        ${whereClause}
        ORDER BY LOG_DATE DESC
        `,
        binds,
        { outFormat: oracledb.OUT_FORMAT_OBJECT }
      );

      return (result.rows ?? []).map(row => ({
        wrin: row.WRIN,
        dcCountry: row.DC_COUNTRY,
        restMarket: row.REST_MARKET,
        wsi: row.WSI,
        localItem: row.LOCAL_ITEM,
        localItemDesc: row.LOCAL_ITEM_DESC,
        productCategory: row.PRODUCT_CATEGORY,
        simSupplier: row.SIM_SUPPLIER,
        supplierName: row.SUPPLIER_NAME,
        simId: row.SIM_ID,
        facilityName: row.FACILITY_NAME,
        facilityCountry: row.FACILITY_COUNTRY,
        facilityCity: row.FACILITY_CITY,
        facilityAddress: row.FACILITY_ADDRESS,
        localItemFlag: row.LOCAL_ITEM_FLAG,
        logDate: row.LOG_DATE,
      }));

    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
}
