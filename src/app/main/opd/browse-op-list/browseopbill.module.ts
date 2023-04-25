import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatePipe } from '@angular/common';
import { BrowseOpListComponent } from './browse-op-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatRippleModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatDividerModule } from '@angular/material/divider';
import { FuseSharedModule } from '@fuse/shared.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';


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
        FuseSharedModule,
        MatProgressSpinnerModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatProgressBarModule,
        MatTooltipModule
    ],
    providers: [
        DatePipe
    ],
    entryComponents: [
        BrowseOpListComponent,
    ]
})
export class browseoplistModule {
} 