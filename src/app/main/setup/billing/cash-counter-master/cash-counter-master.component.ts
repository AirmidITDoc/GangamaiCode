import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { CashCounterMasterService } from "./cash-counter-master.service";
import { NewCashCounterComponent } from "./new-cash-counter/new-cash-counter.component";



@Component({
    selector: "app-cash-counter-master",
    templateUrl: "./cash-counter-master.component.html",
    styleUrls: ["./cash-counter-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CashCounterMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
cashCounterName: any = "";
     allcolumns = [
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
        ]
       
       allfilters = [
            { fieldName: "cashCounterName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    gridConfig: gridModel = {
        apiUrl: "CashCounter/List",
        columnsList: this.allcolumns,
        sortField: "cashCounterId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _CashCounterMasterService: CashCounterMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
//filters addedby avdhoot vedpathak date-27/05/2025
    Clearfilter(event) {
        console.log(event)
        if (event == 'CashCounterNameSearch')
            this._CashCounterMasterService.myformSearch.get('CashCounterNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.cashCounterName = this._CashCounterMasterService.myformSearch.get('CashCounterNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._CashCounterMasterService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "CashCounter/List",
            columnsList: this.allcolumns,
            sortField: "cashCounterId",
            sortOrder: 0,
            filters: [
                { fieldName: "cashCounterName", fieldValue: this.cashCounterName, opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
            ]
        }
        // this.grid.gridConfig = this.gridConfig;
        // this.grid.bindGridData();
        console.log("GridConfig:", this.gridConfig);

    if (this.grid) {
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    } else {
        console.error("Grid is undefined!");
    }
    }
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewCashCounterComponent,
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