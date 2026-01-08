import { DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { RouterModule, Routes } from "@angular/router";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { SharedModule } from "app/main/shared/shared.module";
import { NewSubquestionComponent } from './new-subquestion/new-subquestion.component';
import { SubQuestionMasterComponent } from "./sub-question-master.component";
import { SubquestionMasterService } from "./subquestion-master.service";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCardModule } from "@angular/material/card";
import { MatSidenavModule } from "@angular/material/sidenav";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { MatExpansionModule } from "@angular/material/expansion";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { OverlayModule } from "@angular/cdk/overlay";

const routes: Routes = [
    {
        path: "**",
        component: SubQuestionMasterComponent,
    },
];

@NgModule({
    declarations: [SubQuestionMasterComponent, NewSubquestionComponent],
    imports: [
        RouterModule.forChild(routes),
        SharedModule,
    MatButtonModule,
            MatCheckboxModule,
            MatFormFieldModule,
            MatIconModule,
            MatInputModule,
            MatMenuModule,
            MatTableModule,
            MatToolbarModule,
            MatPaginatorModule,
            MatSortModule,
            MatSelectModule,
            MatRadioModule,
            FuseSidebarModule,
            MatDialogModule,
            FuseSharedModule,
            FuseConfirmDialogModule,
            ReactiveFormsModule,
            MatSnackBarModule,
            MatStepperModule,
            MatAutocompleteModule,
            NgxMatSelectSearchModule,
            MatCardModule,
            MatTooltipModule,
            MatExpansionModule,
            ScrollingModule,
            MatSidenavModule,
            MatButtonToggleModule,
            OverlayModule
    ],
    providers: [SubquestionMasterService, DatePipe]
})
export class SubquestionMasterModule { }

