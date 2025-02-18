import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CashCounterMasterService } from "./cash-counter-master.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { MatDialog } from "@angular/material/dialog";
import { NewCashCounterComponent } from "./new-cash-counter/new-cash-counter.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";



@Component({
    selector: "app-cash-counter-master",
    templateUrl: "./cash-counter-master.component.html",
    styleUrls: ["./cash-counter-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CashCounterMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "CashCounter/List",
        columnsList: [
            { heading: "Code", key: "cashCounterId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Cash Counter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
            { heading: "Prefix Name", key: "prefix", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CashCounterMasterService.deactivateTheStatus(data.cashCounterId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "cashCounterId",
        sortOrder: 0,
        filters: [
            { fieldName: "cashCounterName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(
        public _CashCounterMasterService: CashCounterMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewCashCounterComponent,
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