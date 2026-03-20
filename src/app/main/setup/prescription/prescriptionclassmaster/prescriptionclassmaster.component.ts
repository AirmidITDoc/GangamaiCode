import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewPrescriptionClassComponent } from "./new-prescription-class/new-prescription-class.component";
import { PrescriptionclassmasterService } from "./prescriptionclassmaster.service";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";


@Component({
    selector: "app-prescriptionclassmaster",
    templateUrl: "./prescriptionclassmaster.component.html",
    styleUrls: ["./prescriptionclassmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PrescriptionclassmasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    className: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.Prescription, permissionType.Add);

    allcolumns = [
        { heading: "ClassName", key: "className", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "TemplateDesc Name", key: "templateDescName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.Prescription, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data)
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.Prescription, permissionType.Delete), callback: (data: any) => {

                        this.confirmDialogRef = this._matDialog.open(
                            FuseConfirmDialogComponent,
                            {
                                disableClose: false,
                            }
                        );
                        this.confirmDialogRef.componentInstance.confirmMessage =
                            "Are you sure you want to deactive?";
                        this.confirmDialogRef.afterClosed().subscribe((result) => {

                            if (result) {
                                const that = this;
                                this._PrescriptionclassService.deactivateTheStatus(data.classId).subscribe((data: any) => {
                                    that.grid.bindGridData();
                                });
                            }
                            this.confirmDialogRef = null;
                        });
                    }
                }]
        }
    ]


    allfilters = [
        { fieldName: "className", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.Prescription,
        apiUrl: "Priscriptionclass/List",
        columnsList: this.allcolumns,
        sortField: "classId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _PrescriptionclassService: PrescriptionclassmasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,
        public permissionService: PagePermissionService
    ) { }


    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button


        const that = this;
        const dialogRef = this._matDialog.open(NewPrescriptionClassComponent,
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

    ngOnInit(): void { }

}
