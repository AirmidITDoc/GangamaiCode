import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import { ExcelData } from '../model';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelDownloadService {

  constructor() { }

  getExportJsonData(dataSource: any, requiredHeaders: any, fileName: string) {

    const exportData = [];
    dataSource.forEach(element => {
      let newOb = {};
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

  exportPdfDownload(header: any, data: any, name: string) {
    const doc = new jsPDF()
    autoTable(doc, {
      head: header,
      body: data,
    });
    doc.save(name + '.pdf');
  }

  readExcelFile(file: File): Promise<ExcelData[]> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();

      reader.onload = (e: any) => {
        try {
          const binaryStr: string = e.target.result;
          const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });

          const result: any[] = [];

          workbook.SheetNames.forEach((sheetName) => {
            const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              defval: '', // Keep empty cells as ""
              raw: false, // Use formatted values (e.g., "01/01/2024", not 45291)
            });

            result.push({ sheetName, data: jsonData });
          });

          resolve(result);
        } catch (err) {
          reject(err);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  }
}
