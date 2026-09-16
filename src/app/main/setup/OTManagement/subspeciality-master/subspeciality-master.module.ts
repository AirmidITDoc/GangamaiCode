import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SubspecialityMasterComponent } from './subspeciality-master.component';
// import { SubspecialityMasterService } from './subspeciality-master.service';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/main/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NewSubspecialityMasterComponent } from './new-subspeciality-master/new-subspeciality-master.component';

const routes: Routes = [
  {
    path: "**",
    component: SubspecialityMasterComponent,
  },
];

@NgModule({
  declarations: [SubspecialityMasterComponent, NewSubspecialityMasterComponent],
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    CommonModule,
    MatExpansionModule,
    MatCardModule,
    MatSlideToggleModule,
  ],
  providers: [DatePipe]
})
export class SubspecialityMasterModule { }
