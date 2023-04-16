import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BrowseRefundListComponent } from './browse-refund-list.component';


const routes: Routes = [
    {
        path: '**',
        component: BrowseRefundListComponent,
    },
];
@NgModule({
    declarations: [
        BrowseRefundListComponent,
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
        BrowseRefundListComponent,
        // NotificationServiceService
    ]
})
export class browserefundModule {
} 