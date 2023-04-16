import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AppointmentComponent } from './appointment.component';


const routes: Routes = [
    {
        path: '**',
        component: AppointmentComponent,
    },
];
@NgModule({
    declarations: [
        AppointmentComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
    ],
    providers: [
        // RegistrationService,
        // NotificationServiceService ,
        DatePipe
    ],
    entryComponents: [
        AppointmentComponent,
        // NotificationServiceService
    ]
})
export class appointmentModule {
} 