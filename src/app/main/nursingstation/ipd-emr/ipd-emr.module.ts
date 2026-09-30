import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IpdEMRComponent } from './ipd-emr.component';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'app/main/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { IpdEmrService } from './ipd-emr.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';

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
    MatSelectModule,
    SharedModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatTableModule,
    MatSortModule 
  ],
  providers: [DatePipe, IpdEmrService]
})
export class IpdEMRModule { }
