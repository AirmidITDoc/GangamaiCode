import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { DoctortypeMasterService } from "./doctortype-master.service";
import { NewDoctorTypeComponent } from "./new-doctor-type/new-doctor-type.component";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";

@Component({
    selector: "app-doctortype-master",
    templateUrl: "./doctortype-master.component.html",
    styleUrls: ["./doctortype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DoctortypeMasterComponent implements OnInit {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.DoctorTypeMaster, permissionType.Add);

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;


    gridConfig: gridModel = {
        permissionCode: permissionCodes.DoctorTypeMaster,
        apiUrl: "DoctorTypeMaster/List",
        columnsList: [
            { heading: "DoctorType", key: "doctorType", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        // action: gridActions.edit, callback: (data: any) => {
                        //     this.onSave(data);
                        // }
                        action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.DoctorTypeMaster, permissionType.Edit), callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._doctortypeService.deactivateTheStatus(data.id).subscribe((response: any) => {
                                this.grid.bindGridData();
                            });
                        }
                    }]
            }
        ],
        sortField: "id",
        sortOrder: 0,
        filters: [
            { fieldName: "doctorType", fieldValue: "", opType: OperatorComparer.StartsWith },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    }


    constructor(public _doctortypeService: DoctortypeMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService) { }

    ngOnInit(): void {

    }
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewDoctorTypeComponent,
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