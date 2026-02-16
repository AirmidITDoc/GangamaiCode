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
import { FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { SharedModule } from "app/main/shared/shared.module";
import { ItemDrugMasterComponent } from "./item-drug-master.component";
import { ItemDrugMasterService } from "./item-drug-master.service";
import { NewitemDrugMasterComponent } from "./newitem-drug-master/newitem-drug-master.component";

const routes: Routes = [
    {
        path: "**",
        component: ItemDrugMasterComponent,
    },
];

@NgModule({
  declarations: [ItemDrugMasterComponent,NewitemDrugMasterComponent],
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
          MatSnackBarModule,
          FuseSharedModule,
          FuseSidebarModule,
          MatDialogModule,
      ],
      providers: [ItemDrugMasterService, DatePipe]
})
export class ItemDrugMasterModule { }
