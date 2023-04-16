import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OpRefundBillComponent } from './op-refund-bill.component';


const routes: Routes = [
    {
        path: '**',
        component: OpRefundBillComponent,
    },
];
@NgModule({
    declarations: [
        OpRefundBillComponent,
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
        OpRefundBillComponent,
        // NotificationServiceService
    ]
})
export class oprefundbillModule {
} 