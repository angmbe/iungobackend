import { Injectable } from '@nestjs/common';
import * as oracledb from 'oracledb';
import { SalesResponseDto } from './dto/sales-response.dto';

interface SalesFilters {
  localItemDesc?: string;
  wrin?: string;
  store?: number;
  dc?: number;
  countryCode?: string;
  logDate?: string;
}

@Injectable()
export class SalesService {

  private async getConnection(): Promise<oracledb.Connection> {
    return oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING,
    });
  }

  async findAll(
    page: number = 1,
    limit: number = 100,
    filters: SalesFilters = {},
  ): Promise<SalesResponseDto[]> {

    let connection: oracledb.Connection | undefined;

    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const binds: any = { offset, limit };

    if (filters.localItemDesc) {
      conditions.push(`UPPER(LOCAL_ITEM_DESC) LIKE UPPER(:localItemDesc)`);
      binds.localItemDesc = `%${filters.localItemDesc}%`;
    }

    if (filters.wrin) {
      conditions.push(`TRIM(WRIN) = TRIM(:wrin)`);
      binds.wrin = filters.wrin;
    }

    if (filters.store) {
      conditions.push(`STORE = :store`);
      binds.store = filters.store;
    }

    if (filters.dc) {
      conditions.push(`DC = :dc`);
      binds.dc = filters.dc;
    }

    if (filters.countryCode) {
      conditions.push(`COUNTRYCODE = :countryCode`);
      binds.countryCode = filters.countryCode;
    }

    if (filters.logDate) {
      conditions.push(`
        LOG_DATE >= TO_DATE(:logDate, 'YYYY-MM-DD')
        AND LOG_DATE < TO_DATE(:logDate, 'YYYY-MM-DD') + 1
      `);
      binds.logDate = filters.logDate;
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
          STORE,
          DC,
          COUNTRYCODE,
          RESTOCOUNTRYCODE,
          ORDERNUM,
          SOLLINE,
          DATEORD,
          SHIPTO,
          DELDATE,
          TRANSDATE,
          QTY,
          FCACOST,
          FCACURR,
          FREEDC,
          FREEDCCURR,
          FREEREST,
          FREERCURR,
          PONUM,
          SHIPDT,
          DELMETH,
          LOCALFLAG,
          GTIN,
          DC_GLN,
          SHIPTO_GLN,
          FACILITY_GLN,
          LOG_DATE
        FROM SAR2SAP.SS_DW_SALES_HIST
        ${whereClause}
        ORDER BY LOG_DATE DESC
        OFFSET :offset ROWS
        FETCH NEXT :limit ROWS ONLY
        `,
        binds,
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
        }
      );

      return (result.rows ?? []).map((row: any) => ({
        localItemDesc: row.LOCAL_ITEM_DESC,
        wrin: row.WRIN,
        store: row.STORE,
        dc: row.DC,
        countryCode: row.COUNTRYCODE,
        restoCountryCode: row.RESTOCOUNTRYCODE,
        orderNum: row.ORDERNUM,
        solLine: row.SOLLINE,
        dateOrd: row.DATEORD,
        shipTo: row.SHIPTO,
        delDate: row.DELDATE,
        transDate: row.TRANSDATE,
        qty: row.QTY,
        fcaCost: row.FCACOST,
        fcaCurr: row.FCACURR,
        freeDc: row.FREEDC,
        freeDcCurr: row.FREEDCCURR,
        freeRest: row.FREEREST,
        freeRCurr: row.FREERCURR,
        poNum: row.PONUM,
        shipDt: row.SHIPDT,
        delMeth: row.DELMETH,
        localFlag: row.LOCALFLAG,
        gtin: row.GTIN,
        dcGln: row.DC_GLN,
        shipToGln: row.SHIPTO_GLN,
        facilityGln: row.FACILITY_GLN,
        logDate: row.LOG_DATE,
      }));

    } finally {
      if (connection) {
        await connection.close();
      }
    }
  }
}
