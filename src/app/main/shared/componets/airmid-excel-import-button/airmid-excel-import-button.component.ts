import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ExcelImportConfig, ImportDialogResult } from '../../model/excel-import.models';
import { ExcelImportService } from '../../services/excel-import.service';
export type ImportStep = 'upload' | 'mapping' | 'preview';
@Component({
    selector: 'airmid-excel-import-button',
    templateUrl: './airmid-excel-import-button.component.html',
    styleUrls: ['./airmid-excel-import-button.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AirmidExcelImportButtonComponent  {
  @Input() config!: ExcelImportConfig;
  @Input() label = 'Import';
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() disabled = false;
 
  @Output() imported = new EventEmitter<ImportDialogResult>();
 
  constructor(private importService: ExcelImportService) {}
 
  openImport(): void {
    this.importService.open(this.config).subscribe((result) => {
      if (result?.success) {
        this.imported.emit(result);
      }
    });
  }
}