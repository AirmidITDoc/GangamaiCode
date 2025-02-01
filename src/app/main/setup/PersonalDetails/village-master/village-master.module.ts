import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { VillageMasterComponent } from "./village-master.component";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatTableModule } from "@angular/material/table";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { SharedModule } from "app/main/shared/shared.module";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { VillageMasterService } from "./village-master.service";
import { MatStepperModule } from "@angular/material/stepper";
import { ReactiveFormsModule } from "@angular/forms";
import { NewvillageMasterComponent } from './newvillage-master/newvillage-master.component';
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { NotificationServiceService } from "app/core/notification-service.service";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatRippleModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

const routes: Routes = [
    {
        path: "**",
        component: VillageMasterComponent,
    },
];

@NgModule({
    declarations: [VillageMasterComponent, NewvillageMasterComponent],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatButtonModule,
        MatCheckboxModule,

        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatStepperModule,
        MatRadioModule,
        FuseSharedModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatAutocompleteModule,
        SharedModule,
        NgxMatSelectSearchModule,

        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatToolbarModule,
        MatRippleModule,
        MatDatepickerModule,
        MatTabsModule,
        MatCardModule,
        MatExpansionModule,
        MatDividerModule,
        MatDialogModule,
        MatProgressSpinnerModule,
        MatBadgeModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatListModule,
        MatChipsModule,
    ],
    providers: [VillageMasterService, NotificationServiceService],

    entryComponents: [VillageMasterComponent],
})
export class VillageMasterModule {}
