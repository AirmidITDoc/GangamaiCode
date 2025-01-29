import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NewReportConfigurationComponent } from './new-report-configuration/new-report-configuration.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { ReportConfigurationService } from './report-configuration.service';
import { ReportConfigurationComponent } from './report-configuration.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'app/main/shared/shared.module';


const routes: Routes = [
    {
        path: "**",
        component: ReportConfigurationComponent,
    },
];
@NgModule({
  declarations: [ NewReportConfigurationComponent],
  imports: [
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatRadioModule,
    MatSnackBarModule,
    FuseSharedModule,
    FuseSidebarModule,
    MatDialogModule,
    SharedModule,
  ],
  providers: [ReportConfigurationService, DatePipe]
})
export class ReportConfigurationModule { }
