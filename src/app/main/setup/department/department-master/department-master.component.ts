import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { DepartmentMasterService } from "./department-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewDepartmentComponent } from "./new-department/new-department.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-department-master",
    templateUrl: "./department-master.component.html",
    styleUrls: ["./department-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DepartmentMasterComponent implements OnInit {
    msg: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
 
    constructor(public _departmentService: DepartmentMasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,) {}
        @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        gridConfig: gridModel = {
            apiUrl: "DepartmentMaster/List",
            columnsList: [
                { heading: "Code", key: "departmentId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Department Name", key: "departmentName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
                {
                    heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
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
                                        this._departmentService.deactivateTheStatus(data.departmentId).subscribe((response: any) => {
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
            sortField: "departmentId",
            sortOrder: 0,
            filters: [
                { fieldName: "departmentName", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ],
            row: 25
        }
    
     
        ngOnInit(): void { }
        onSave(row: any = null) {
            let that = this;
            const dialogRef = this._matDialog.open(NewDepartmentComponent,
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