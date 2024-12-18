import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { PatienttypeMasterService } from "./patienttype-master.service";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewPatientTypeComponent } from "./new-patient-type/new-patient-type.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";



@Component({
    selector: "app-patienttype-master",
    templateUrl: "./patienttype-master.component.html",
    styleUrls: ["./patienttype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PatienttypeMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "PatientType/List",
        columnsList: [
            { heading: "Code", key: "patientTypeId", sort: true, align: 'left', emptySign: 'NA', width:150 },
            { heading: "Patient Type Name", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width:800 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width:100 },
            {
                heading: "Action", key: "action", align: "right", width:100, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                if (result) {
                                    let that = this;
                                    this._PatienttypeMasterService.deactivateTheStatus(data.patientTypeId).subscribe((response: any) => {
                                        this.toastr.success(response.message);
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "patientTypeId",
        sortOrder: 0,
        filters: [
            { fieldName: "patientType", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(
        public _PatienttypeMasterService: PatienttypeMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewPatientTypeComponent,
            {
                maxWidth: "45vw",
                height: '30%',
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