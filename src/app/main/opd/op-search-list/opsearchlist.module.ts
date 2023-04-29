import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OpdSearchListComponent } from './opd-search-list.component';

const routes: Routes = [
    {
        path: '**',
        component: OpdSearchListComponent,
    },
];
@NgModule({
    declarations: [
        OpdSearchListComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
    ],
    providers: [
        DatePipe
    ],
    entryComponents: [
        OpdSearchListComponent,
    ]
})
export class opseachlistModule {
} 