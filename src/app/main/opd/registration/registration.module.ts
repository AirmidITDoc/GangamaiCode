import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RegistrationComponent } from './registration.component';


const routes: Routes = [
    {
        path: '**',
        component: RegistrationComponent,
    },
];
@NgModule({
    declarations: [
        RegistrationComponent,
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
        RegistrationComponent,
        // NotificationServiceService
    ]
})
export class RegistrationModule {
} 