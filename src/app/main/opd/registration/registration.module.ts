import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { RegistrationComponent } from './registration.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NewRegistrationComponent } from './new-registration/new-registration.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SharedModule } from 'app/main/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EditRegistrationComponent } from './edit-registration/edit-registration.component';
import { CharmaxLengthDirective } from './new-registration/charmax-length.directive';
import { ChkCharlengthDirective } from './chk-charlength.directive';
import { MatListModule } from '@angular/material/list';
import { NgxSignaturePadModule } from '@o.krucheniuk/ngx-signature-pad';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { RegistrationService } from './registration.service';


const routes: Routes = [
    {
        path: '**',
        component: RegistrationComponent,
    },
];
@NgModule({
    declarations: [
        RegistrationComponent,
        NewRegistrationComponent,
        EditRegistrationComponent,
        CharmaxLengthDirective,
        ChkCharlengthDirective,
        
    ],
    imports: [
        RouterModule.forChild(routes),
    //  MatTableExporterModule,
        MatChipsModule,
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
              MatListModule,
              MatStepperModule,
              MatAutocompleteModule,
              MatProgressSpinnerModule,
              SharedModule,
              NgxMatSelectSearchModule,
              NgxSignaturePadModule,
              MatButtonToggleModule
    ],
    providers: [RegistrationService,
        DatePipe
    ],
    entryComponents: [
        RegistrationComponent,
    ]
})
export class RegistrationModule {
} 