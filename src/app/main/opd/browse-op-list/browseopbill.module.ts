import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BrowseOpListComponent } from './browse-op-list.component';


const routes: Routes = [
    {
        path: '**',
        component: BrowseOpListComponent,
    },
];
@NgModule({
    declarations: [
        BrowseOpListComponent,
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
        BrowseOpListComponent,
        // NotificationServiceService
    ]
})
export class browseoplistModule {
} 