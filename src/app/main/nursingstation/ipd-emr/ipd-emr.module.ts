import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IpdEMRComponent } from './ipd-emr.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

const routes: Routes = [
    {
        path: "**",
        component: IpdEMRComponent,
    },
];

@NgModule({
  declarations: [
    IpdEMRComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  providers: []
})
export class IpdEMRModule { }
