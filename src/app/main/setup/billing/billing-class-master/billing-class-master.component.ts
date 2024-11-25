import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { BillingClassMasterService } from "./billing-class-master.service";
import { fuseAnimations } from "@fuse/animations";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewClassComponent } from "./new-class/new-class.component";

@Component({
    selector: "app-billing-class-master",
    templateUrl: "./billing-class-master.component.html",
    styleUrls: ["./billing-class-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BillingClassMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  
   
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "ClassMaster/List",
    columnsList: [
        { heading: "Code", key: "classId", sort: true, align: 'left', emptySign: 'NA', width:160 },
        { heading: "Billing Class Name", key: "className", sort: true, align: 'left', emptySign: 'NA', width:700 },
       
       { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center",width:160 },
             {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:160, actions: [
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
                                    this._BillingClassMasterService.deactivateTheStatus(data.classId).subscribe((response: any) => {
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
        sortField: "classId",
        sortOrder: 0,
        filters: [
            { fieldName: "className", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    

    constructor(
        public _BillingClassMasterService: BillingClassMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewClassComponent,
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