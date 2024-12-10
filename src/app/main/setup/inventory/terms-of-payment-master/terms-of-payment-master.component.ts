import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { TermsOfPaymentMasterService } from "./terms-of-payment-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { NewTermofpaymentComponent } from "./new-termofpayment/new-termofpayment.component";
import { MatDialog } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-terms-of-payment-master",
    templateUrl: "./terms-of-payment-master.component.html",
    styleUrls: ["./terms-of-payment-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TermsOfPaymentMasterComponent implements OnInit {
    confirmDialogRef: any;
    constructor(public _TermsOfPaymentMasterService: TermsOfPaymentMasterService,
                public _matDialog: MatDialog,
                public toastr : ToastrService,) {}
                
        @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        gridConfig: gridModel = {
            apiUrl: "TermsOfPayment/List",
            columnsList: [
                { heading: "Code", key: "id", sort: true, align: 'left', emptySign: 'NA', width:150 },
                { heading: "TermsOfPayment", key: "termsOfPayment", sort: true, align: 'left', emptySign: 'NA', width:400 },
                { heading: "addedBy", key: "addedBy", sort: true, align: 'left', emptySign: 'NA', width:400 },
                { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center", width:100 },
                { heading: "Action", key: "action", width:100, align: "right", type: gridColumnTypes.action, actions: [
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
                                        this._TermsOfPaymentMasterService.deactivateTheStatus(data.itemTypeId).subscribe((response: any) => {
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
                { fieldName: "termsOfPayment", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ],
            row: 25
        }
    
     
        ngOnInit(): void { }

        onSave(row: any = null) {
            let that = this;
            const dialogRef = this._matDialog.open(NewTermofpaymentComponent,
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