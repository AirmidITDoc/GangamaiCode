import { NgModule } from "@angular/core";
import { ReligionMasterComponent } from "./religion-master.component";
import { RouterModule, Routes } from "@angular/router";
import { ReligionMasterService } from "./religion-master.service";
import { NotificationServiceService } from "app/core/notification-service.service";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRadioModule } from "@angular/material/radio";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { NewreligionMasterComponent } from './newreligion-master/newreligion-master.component';
import { CommonModule } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { SharedModule } from "app/main/shared/shared.module";
import { MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

const routes: Routes = [
    {
        path: "**",
        component: ReligionMasterComponent,
    },
];

@NgModule({
    declarations: [ReligionMasterComponent, NewreligionMasterComponent],
    imports: [
        RouterModule.forChild(routes),
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
        MatSnackBarModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatTabsModule,
        MatCardModule,
        MatExpansionModule,
        MatDividerModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatStepperModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        NgxMatSelectSearchModule,
        MatBadgeModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatListModule,
        MatChipsModule,
        CommonModule,
        MatMenuModule,
        SharedModule,
        MatRippleModule,
        MatDatepickerModule,
    ],
    providers: [ReligionMasterService],

    entryComponents: [ReligionMasterComponent],
})
export class ReligionMasterModule {}
