import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TalukaMasterComponent } from "./taluka-master.component";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { FuseSharedModule } from "@fuse/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { TalukaMasterService } from "./taluka-master.service";
import { NewtalukaMasterComponent } from './newtaluka-master/newtaluka-master.component';
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { NotificationServiceService } from "app/core/notification-service.service";
import { MatMenuModule } from "@angular/material/menu";
import { SharedModule } from "app/main/shared/shared.module";
import { MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

const routes: Routes = [
    {
        path: "**",
        component: TalukaMasterComponent,
    },
];

@NgModule({
    declarations: [TalukaMasterComponent, NewtalukaMasterComponent],
    imports: [
        RouterModule.forChild(routes),

        CommonModule,
        MatButtonModule,
        MatCheckboxModule,

        MatFormFieldModule,
        MatIconModule,
        MatInputModule,

        MatTableModule,
        MatToolbarModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatRadioModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        NgxMatSelectSearchModule,
        FuseSidebarModule,
        MatMenuModule,
        SharedModule,
        MatRippleModule,
        MatDatepickerModule,
        MatTabsModule,
        MatCardModule,
        MatExpansionModule,
        MatDividerModule,
        MatDialogModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        MatBadgeModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatListModule,
        MatChipsModule,
    ],
    providers: [TalukaMasterService, NotificationServiceService],

    entryComponents: [TalukaMasterComponent],
})
export class TalukaMasterModule {}
