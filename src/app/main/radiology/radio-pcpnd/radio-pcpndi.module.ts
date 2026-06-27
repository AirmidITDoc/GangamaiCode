import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NotificationService } from 'app/core/notification.service';
import { SharedModule } from 'app/main/shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTimepickerModule } from 'mat-timepicker';
import { RadopPcpndService } from './radop-pcpnd.service';
import { RadioPcpndComponent } from './radio-pcpnd.component';
import { NewPcpndComponent } from './new-pcpnd/new-pcpnd.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

const routes: Routes = [

    {
        path: '**',
        component: RadioPcpndComponent,
    },

];
@NgModule({
    declarations: [
        RadioPcpndComponent,
        NewPcpndComponent
    ],
    imports: [
          RouterModule.forChild(routes),
        CommonModule,
               MatButtonModule,
               MatCheckboxModule,
               MatDatepickerModule,
               MatFormFieldModule,
               MatIconModule,
               MatInputModule,
               MatMenuModule,
               MatRippleModule,
               MatTableModule,
               MatPaginatorModule,
               MatSortModule,
               MatRadioModule,
               MatDividerModule,
               MatDialogModule,
               ReactiveFormsModule,
               MatSnackBarModule,
               MatListModule,
               SharedModule,
               NgxMatSelectSearchModule,
               MatBadgeModule,
               MatSelectModule,
               MatSelectModule,
               FuseConfirmDialogModule,
               FuseSidebarModule,
               MatProgressSpinnerModule,
               MatCardModule,
               MatToolbarModule,
               MatSlideToggleModule,
               FuseSharedModule,
               MatTooltipModule,
               MatAutocompleteModule,
               MatTimepickerModule,
               MatExpansionModule,
               MatTabsModule,
       
       
            //    MatChipsModule,
            //    MatSidenavModule,
            //    MatGridListModule,
            //    MatStepperModule,
            //    MatStepperModule,
            //    MatTreeModule,
               FormsModule,
               MatButtonToggleModule,
            //    NgxJsonViewerModule,
               MatMenuModule
       
    ],
    providers: [
        RadopPcpndService,
        DatePipe,
      
        NotificationService,
    ]
})

export class RadioPcpndiModule { }
