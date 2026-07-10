import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { NotificationService } from 'app/core/notification.service';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTimepickerModule } from 'mat-timepicker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { NewFormComponent } from './new-form/new-form.component';
import { NewMembershipComponent } from './new-membership/new-membership.component';
import { NewMemberService } from './new-member.service';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [

    {
        path: '**',
        component: NewMembershipComponent,
    },

];
@NgModule({
    declarations: [
        NewMembershipComponent,
        NewFormComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatRadioModule,
        MatDividerModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatListModule,
        SharedModule,
        NgxMatSelectSearchModule,
        MatBadgeModule,
        MatSelectModule,
        MatSelectModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatProgressSpinnerModule,
        MatCardModule,
        MatToolbarModule,
        MatSlideToggleModule,
        FuseSharedModule,
        MatTooltipModule,
        MatAutocompleteModule,
        MatTimepickerModule,
        MatExpansionModule,
        MatTabsModule,

        FormsModule,
        MatButtonToggleModule,
        //    NgxJsonViewerModule,
        MatMenuModule

    ],
    providers: [
        NewMemberService,
        DatePipe,

        NotificationService,
    ]
})

export class NewMemberModule { }
