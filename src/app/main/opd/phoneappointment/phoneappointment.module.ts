import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PhoneappointmentComponent } from './phoneappointment.component';


const routes: Routes = [
    {
        path: '**',
        component: PhoneappointmentComponent,
    },
];
@NgModule({
    declarations: [
        PhoneappointmentComponent,
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
        PhoneappointmentComponent,
        // NotificationServiceService
    ]
})
export class phoneappointmentModule {
} 