import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { FuseSharedModule } from "@fuse/shared.module";
import { FuseConfirmDialogModule, FuseSidebarModule } from "@fuse/components";
import { RolePermissionComponent } from "../role-permission/role-permission.component";
import { TemplateDescriptionComponent } from "./template-description.component";
import { NewTemplateDescComponent } from "./new-template-desc/new-template-desc.component";
import { TempDescService } from "./temp-desc.service";
import { CommonModule } from "@angular/common";
import { MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { ReactiveFormsModule } from "@angular/forms";
import { MatStepperModule } from "@angular/material/stepper";
import { AngularEditorModule } from "@kolkov/angular-editor";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";


const routes: Routes = [
  {
      path: "**",
      component: TemplateDescriptionComponent,
  },
];

@NgModule({
  declarations: [TemplateDescriptionComponent,NewTemplateDescComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatRadioModule,
    MatTabsModule,
    MatCardModule,
    FuseSharedModule,
    FuseConfirmDialogModule,
    FuseSidebarModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatStepperModule,
    NgxMatSelectSearchModule,
    MatToolbarModule,
    MatAutocompleteModule,
    AngularEditorModule
],
schemas: [
  CUSTOM_ELEMENTS_SCHEMA
],
providers: [TempDescService],
entryComponents: [TemplateDescriptionComponent],

})
export class TempDescModule { }
