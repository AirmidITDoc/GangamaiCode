import { Component, OnDestroy, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { ExcelDownloadService } from '../shared/services/excel-download.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-import-excel',
  templateUrl: './import-excel.component.html',
  styleUrls: ['./import-excel.component.scss']
})
export class ImportExcelComponent implements OnInit, OnDestroy {
  tableData: any[] = [];
  fileOptions = [
    { id: 1, name: 'Excel file 1', fileUrl: '/assets/excel/excel1.xlsx' },
    { id: 2, name: 'Excel file 2', fileUrl: '/assets/excel/excel2.xlsx' },
    { id: 3, name: 'Excel file 3', fileUrl: '/assets/excel/excel3.xlsx' },
  ]

  excelForm: FormGroup = new FormGroup({
    fileId: new FormControl('', [Validators.required]),
  });

  constructor(private excelDownloadService: ExcelDownloadService) { }
  ngOnInit(): void {

  }

  async handleFileChange(event: Event, inputRef: HTMLInputElement): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) return;

    const allowedExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();

    const isExcel = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isExcel) {
      Swal.fire('Invalid file type. Please select an Excel file (.xlsx or .xls)');
      inputRef.value = ''; // reset input
      return;
    }

    // Proceed file if valid
    try {
      const sheets = await this.excelDownloadService.readExcelFile(file);
      if (sheets && sheets.length) {
        const firstSheet = sheets[0];

        // Generating dynamic column for each row
        firstSheet.data = firstSheet.data.map((row: any) => ({
          ...row,
          DYNAMIC_COLUMN: '--',
        }));

        this.tableData = [...firstSheet.data];
        //   Reset the file value
        inputRef.value = '';
      }
    } catch (error) {
      console.log('Error in importinge excel file => ', error);
    }
  }
  downloadFile(): void {
    const fileId = +this.excelForm.controls["fileId"].value;
    if (!fileId) {
      Swal.fire("Please select file");
    }
    const file = this.fileOptions.find(f => f.id === fileId);
    if (file) {
      this.excelDownloadService.downloadFileFromUrl(file.fileUrl, file.name);
    }
  }
  ngOnDestroy(): void {

  }
}
