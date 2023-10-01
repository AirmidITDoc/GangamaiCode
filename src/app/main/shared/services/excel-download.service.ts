import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelDownloadService {

  constructor() { }

  getExportJsonData(dataSource: any, requiredHeaders: any, fileName: string) {
    let newOb = {};
    const exportData = [];
    dataSource.forEach(element => {
      requiredHeaders.forEach(headerElement => {
        newOb[headerElement] = element[headerElement];
      });
      exportData.push(newOb);
    });
    this.exportReport(exportData, fileName);
  }

  exportReport(jsonData: any, fileName: string) {
    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const myworkbook: XLSX.WorkBook = { Sheets: { 'data': myworksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, fileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_exported' + EXCEL_EXTENSION);
  }
}
