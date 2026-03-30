import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ExcelImportConfig, ImportDialogResult } from '../model/excel-import.models';
import { AirmidExcelImportDialogComponent } from '../componets/airmid-excel-import/airmid-excel-import.component';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({ providedIn: 'root' })
export class ExcelImportService {
    constructor(private dialog: MatDialog, private _http: ApiCaller) { }

    /**
     * Opens the Excel import dialog and returns an observable that emits
     * the result when the dialog closes.
     *
     * @example
     * this.importService.open({
     *   title: 'Import Products',
     *   columns: [
     *     { key: 'name',  label: 'Product Name', required: true, icon: 'inventory_2' },
     *     { key: 'price', label: 'Price',         required: true, icon: 'attach_money' },
     *     { key: 'sku',   label: 'SKU',           icon: 'qr_code' },
     *   ],
     *   importApi: '/api/products/import',
     * }).subscribe(result => {
     *   if (result?.success) this.loadData();
     * });
     */
    open(config: ExcelImportConfig): Observable<ImportDialogResult | null> {
        const ref: MatDialogRef<AirmidExcelImportDialogComponent, ImportDialogResult | null> =
            this.dialog.open(AirmidExcelImportDialogComponent, {
                data: config,
                width: config.width ?? '820px',
                maxWidth: '95vw',
                maxHeight: '90vh',
                panelClass: 'excel-import-dialog-panel',
                disableClose: true,
            });

        return ref.afterClosed();
    }
    preview(url: string, formData: FormData) {
        return this._http.PostData(url, formData);
    }
}