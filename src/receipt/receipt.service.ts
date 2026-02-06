import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { ReceiptResponseDto } from './dto/receipt-response.dto';

interface ReceiptFilters {
  localItemDesc?: string;
  wrin?: string;
  supplierName?: string;
  wsi?: number;
  dc?: number;
}

@Injectable()
export class ReceiptService {

  private async getConnection(): Promise<oracledb.Connection> {
    return oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING,
    });
  }

  async findAll(filters: ReceiptFilters = {}): Promise<ReceiptResponseDto[]> {
    let connection: oracledb.Connection | undefined;

    const conditions: string[] = [];
    const binds: any = {};

    if (filters.localItemDesc) {
      conditions.push(`UPPER(LOCAL_ITEM_DESC) LIKE UPPER(:localItemDesc)`);
      binds.localItemDesc = `%${filters.localItemDesc}%`;
    }

    if (filters.wrin) {
      conditions.push(`WRIN = :wrin`);
      binds.wrin = filters.wrin;
    }

    if (filters.supplierName) {
      conditions.push(`UPPER(SUPPLIER_NAME) LIKE UPPER(:supplierName)`);
      binds.supplierName = `%${filters.supplierName}%`;
    }

    if (filters.wsi) {
      conditions.push(`WSI = :wsi`);
      binds.wsi = filters.wsi;
    }

    if (filters.dc) {
      conditions.push(`DC = :dc`);
      binds.dc = filters.dc;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    try {
      connection = await this.getConnection();

      const result = await connection.execute(
        `
        SELECT
          LOCAL_ITEM_DESC,
          WRIN,
          SUPPLIER_NAME,
          WSI,
          DC,
          COUNTRYCODE,
          TRANSDC,
          DATEREC,
          CASES,
          FCACOST,
          FCACURR,
          FREEDC,
          FREEDCCURR,
          PONUM,
          POLINE,
          TRANSDATE,
          LOG_DATE,
          ORD_DATE,
          LOCALFLAG,
          GTIN,
          DC_GLN,
          TRANSDC_GLN,
          FACILITY_GLN
        FROM SAR2SAP.SS_DW_RECEIPTS_HIST
        ${whereClause}
        ORDER BY LOG_DATE DESC
        `,
        binds,
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        }
      );

      return (result.rows ?? []).map((row: any) => ({
        localItemDesc: row.LOCAL_ITEM_DESC,
        wrin: row.WRIN,
        supplierName: row.SUPPLIER_NAME,
        wsi: row.WSI,
        dc: row.DC,
        countryCode: row.COUNTRYCODE,
        transDc: row.TRANSDC,
        dateRec: row.DATEREC,
        cases: row.CASES,
        fcaCost: row.FCACOST,
        fcaCurr: row.FCACURR,
        freeDc: row.FREEDC,
        freeDcCurr: row.FREEDCCURR,
        poNum: row.PONUM,
        poLine: row.POLINE,
        transDate: row.TRANSDATE,
        logDate: row.LOG_DATE,
        ordDate: row.ORD_DATE,
        localFlag: row.LOCALFLAG,
        gtin: row.GTIN,
        dcGln: row.DC_GLN,
        transDcGln: row.TRANSDC_GLN,
        facilityGln: row.FACILITY_GLN,
      }));

    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
}
