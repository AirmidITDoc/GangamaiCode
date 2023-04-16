import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BrowsePaymentListComponent } from './browse-payment-list.component';


const routes: Routes = [
    {
        path: '**',
        component: BrowsePaymentListComponent,
    },
];
@NgModule({
    declarations: [
        BrowsePaymentListComponent,
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
        BrowsePaymentListComponent,
        // NotificationServiceService
    ]
})
export class browsepaymentModule {
} 