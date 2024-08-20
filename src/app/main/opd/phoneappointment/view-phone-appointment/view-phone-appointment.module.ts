// import { AppointmentComponent } from './appointment.component';
import { DatePipe } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'app/main/shared/shared.module';
import { ViewPhoneAppointmentComponent } from './view-phone-appointment.component';
import { AppService } from './app.service';
import { CalendarDateFormatter, CalendarModule, DateAdapter, MOMENT } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { SchedulerDateFormatter, SchedulerModule } from 'angular-calendar-scheduler';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
import moment from 'moment';
import { AddSchedulerAppointmentComponent } from './add-scheduler-appointment/add-scheduler-appointment.component';
registerLocaleData(localeIt);

const routes: Routes = [
    {
        path: "**",
        component: ViewPhoneAppointmentComponent,
    },
];
@NgModule({
    declarations: [ViewPhoneAppointmentComponent,AddSchedulerAppointmentComponent],
    imports: [
        RouterModule.forChild(routes),
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
        MatTabsModule,
        MatCardModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatDialogModule,
        MatListModule,
        MatSnackBarModule,
        MatSlideToggleModule,
        MatDividerModule,
        MatDialogModule,

        MatSnackBarModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatCardModule,
        MatListModule,
        MatTooltipModule,
        MatExpansionModule,
        MatListModule,

        
        FormsModule,
        CalendarModule.forRoot({
          provide: DateAdapter,
          useFactory: adapterFactory,
        }),
        SchedulerModule.forRoot({
          locale: 'en',
          headerDateFormat: 'daysRange',
          logEnabled: true,
        }),
        MatProgressSpinnerModule
    ],
    providers: [DatePipe, 
        AppService,
        { provide: LOCALE_ID, useValue: 'en-US' },
        { provide: MOMENT, useValue: moment },
        {
            provide: CalendarDateFormatter,
            useClass: SchedulerDateFormatter
        },
    ],
    entryComponents: [ViewPhoneAppointmentComponent],
})
export class viewPhoneAppointmentModule {}
