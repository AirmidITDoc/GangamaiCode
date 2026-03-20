import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { ImportExcelComponent } from './import-excel.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/main/shared/shared.module';
import { ImportExcelTableComponent } from './import-excel-table/import-excel-table.component';
import { ImportExcelComponent } from './import-excel.component';

const routes: Routes = [
    {
        path: '',
        component: ImportExcelComponent
    },
];

@NgModule({
    declarations: [ImportExcelComponent, ImportExcelTableComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        SharedModule,
        MatCardModule,
        ReactiveFormsModule,
        MatTableModule,
        MatDialogModule,
        MatRadioModule,
        MatSelectModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        FlexLayoutModule
    ]
})
export class ImportExcelModule { }
