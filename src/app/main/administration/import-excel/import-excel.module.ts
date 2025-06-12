import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// import { ImportExcelComponent } from './import-excel.component';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ImportExcelTableComponent } from './import-excel-table/import-excel-table.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SharedModule } from 'app/main/shared/shared.module';
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
