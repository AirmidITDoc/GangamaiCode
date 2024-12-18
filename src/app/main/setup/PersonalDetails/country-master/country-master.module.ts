import { NgModule } from "@angular/core";
import { CountryMasterComponent } from "./country-master.component";
import { RouterModule, Routes } from "@angular/router";
import { CountryMasterService } from "./country-master.service";
import { FuseSidebarModule } from "@fuse/components";
import { FuseSharedModule } from "@fuse/shared.module";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { NewCountryMasterComponent } from './new-country-master/new-country-master.component';
import { SharedModule } from "app/main/shared/shared.module";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { DatePipe } from "@angular/common";

const routes: Routes = [
    {
        path: "**",
        component: CountryMasterComponent,
    },
];

@NgModule({
    declarations: [CountryMasterComponent, NewCountryMasterComponent],
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
    providers: [CountryMasterService,DatePipe],

    entryComponents: [CountryMasterComponent],
})
export class CountryMasterModule {}
