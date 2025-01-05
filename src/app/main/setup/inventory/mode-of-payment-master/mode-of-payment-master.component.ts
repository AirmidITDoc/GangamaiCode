import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { ModeOfPaymentMasterService } from "./mode-of-payment-master.service";
import { ToastrService } from "ngx-toastr";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { NewModeofpaymentComponent } from "./new-modeofpayment/new-modeofpayment.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: "app-mode-of-payment-master",
    templateUrl: "./mode-of-payment-master.component.html",
    styleUrls: ["./mode-of-payment-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ModeOfPaymentMasterComponent implements OnInit {
    constructor(public _ModeOfPaymentMasterService: ModeOfPaymentMasterService,public _matDialog: MatDialog,
    public toastr : ToastrService,) {}
        @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        gridConfig: gridModel = {
            apiUrl: "ModeOfPayment/List",
            columnsList: [
                { heading: "Code", key: "id", width:150, sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Mode Of Payment Name", width:800, key: "modeOfPayment", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "IsActive", key: "isActive", width:100, type: gridColumnTypes.status, align: "center" },
                { heading: "Action", key: "action", width:100, align: "right", type: gridColumnTypes.action, actions: [
                        {
                            action: gridActions.edit, callback: (data: any) => {
                                this.onSave(data);
                            }
                        }, {
                            action: gridActions.delete, callback: (data: any) => {
                                this._ModeOfPaymentMasterService.deactivateTheStatus(data.id).subscribe((response: any) => {
                                            this.toastr.success(response.message);
                                            this.grid.bindGridData();
                                        });
                            }
                        }]
                } //Action 1-view, 2-Edit,3-delete
            ],
            sortField: "id",
            sortOrder: 0,
            filters: [
                { fieldName: "modeOfPayment", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ],
            row: 25
        }
    
     
        ngOnInit(): void { }
        onSave(row: any = null) {
            let that = this;
            const dialogRef = this._matDialog.open(NewModeofpaymentComponent,
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