import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { DoctortypeMasterService } from "./doctortype-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NewDoctorTypeComponent } from "./new-doctor-type/new-doctor-type.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-doctortype-master",
    templateUrl: "./doctortype-master.component.html",
    styleUrls: ["./doctortype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DoctortypeMasterComponent implements OnInit {
    
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    

    gridConfig: gridModel = {
        apiUrl: "DoctorTypeMaster/List",
        columnsList: [
            { heading: "Code", key: "id", sort: true, align: 'left', emptySign: 'NA', width:200 },
            { heading: "Doctor Type Name", key: "doctorType", sort: true, align: 'left', emptySign: 'NA', width:580},
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center", width:200 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:200, actions: [
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
                                    this._doctortypeService.deactivateTheStatus(data.id).subscribe((response: any) => {
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
        sortField: "id",
        sortOrder: 0,
        filters: [
            { fieldName: "doctorType", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }


    constructor(public _doctortypeService: DoctortypeMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
       
    }
    onSave(row: any = null) {
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(NewDoctorTypeComponent,
            {
                maxWidth: "45vw",
                height: '35%',
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