import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RelationshipMasterComponent } from "./relationship-master.component";
import { RouterModule, Routes } from "@angular/router";
import { MatSortModule } from "@angular/material/sort";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { NotificationServiceService } from "app/core/notification-service.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RelationshipMasterService } from "./relationship-master.service";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
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
import { NewRelationshipMasterComponent } from './new-relationship-master/new-relationship-master.component'; 

const routes: Routes = [
    {
        path: "**",
        component: RelationshipMasterComponent,
    },
];

@NgModule({
    declarations: [RelationshipMasterComponent, NewRelationshipMasterComponent],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,

        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatRadioModule,
        MatSnackBarModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule,
        MatCheckboxModule,
        MatMenuModule,
        MatToolbarModule,
        SharedModule,
        MatRippleModule,
        MatDatepickerModule,
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
    ],
    providers: [RelationshipMasterService, NotificationServiceService],

    entryComponents: [RelationshipMasterComponent],
})
export class RelationshipMasterModule {}
