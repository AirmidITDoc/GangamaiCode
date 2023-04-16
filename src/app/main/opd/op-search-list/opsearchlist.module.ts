import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OpSearchListComponent } from './op-search-list.component';


const routes: Routes = [
    {
        path: '**',
        component: OpSearchListComponent,
    },
];
@NgModule({
    declarations: [
        OpSearchListComponent,
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
        OpSearchListComponent,
        // NotificationServiceService
    ]
})
export class opseachlistModule {
} 