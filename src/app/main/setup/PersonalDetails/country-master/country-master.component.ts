import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { CountryMasterService } from "./country-master.service";
import { NewCountryMasterComponent } from "./new-country-master/new-country-master.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
@Component({
    selector: "app-country-master",
    templateUrl: "./country-master.component.html",
    styleUrls: ["./country-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CountryMasterComponent implements OnInit {
    msg: any;
    countryName: any = ""
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.CountryMaster, permissionType.Add);

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    allcolumns = [
        // { heading: "Code", key: "countryId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Country Name", key: "countryName", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.CompanyMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.CompanyMaster, permissionType.Delete), callback: (data: any) => {
                        this._CountryService.deactivateTheStatus(data.countryId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]
    allfilters = [
        { fieldName: "countryName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.CountryMaster,
        apiUrl: "CountryMaster/List",
        columnsList: this.allcolumns,
        sortField: "countryId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(public _CountryService: CountryMasterService, public _matDialog: MatDialog, public permissionService: PagePermissionService,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewCountryMasterComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}
