import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { CanteenRequestService } from './canteen-request.service';
import { NewCanteenRequestComponent } from './new-canteen-request/new-canteen-request.component';



@Component({
    selector: 'app-canteen-request',
    templateUrl: './canteen-request.component.html',
    styleUrls: ['./canteen-request.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CanteenRequestComponent implements OnInit {
    myFilterform: FormGroup;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    regNo: any = ""

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    ngAfterViewInit() {
        // this.gridConfig.columnsList.find(col => col.key === 'admId')!.template = this.Status;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    allcolumns=[
            { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Visit/AdmDate", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', type: 8 },
            { heading: "WardName", key: "wardName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AddUserName", key: "addedUserName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsBillGenerated", key: "isBillGenerated", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
                template: this.actionButtonTemplate  // Assign ng-template to the column
            }
        ]

        
    constructor(public _CanteenRequestService: CanteenRequestService, public _matDialog: MatDialog, private _formBuilder: FormBuilder,
        public toastr: ToastrService, public datePipe: DatePipe) { }
    ngOnInit(): void {
        this.myFilterform = this.filterForm()
    }
    
    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: '',
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
        });
    }

    gridConfig: gridModel = {
        apiUrl: "CanteenRequest/CanteenRequestHeaderList",
        columnsList: this.allcolumns,
        sortField: "ReqId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals }
        ]
    }

     Clearfilter(event) {
        console.log(event)
        if (event == 'RegNo')
            this.myFilterform.get('RegNo').setValue("")
        this.onChangeFirst();
    }

    onChangeFirst() {
        this.regNo = this.myFilterform.get('RegNo').value
        this.getfilterdata();
    }

     getfilterdata() {
        let fromDate1 = this.myFilterform.get("fromDate").value || "";
        let toDate1 = this.myFilterform.get("enddate").value || "";
        fromDate1 = fromDate1 ? this.datePipe.transform(fromDate1, "yyyy-MM-dd") : "";
        toDate1 = toDate1 ? this.datePipe.transform(toDate1, "yyyy-MM-dd") : "";
        this.gridConfig = {
            apiUrl: "CanteenRequest/CanteenRequestHeaderList",
            columnsList: this.allcolumns,
            sortField: "ReqId",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: fromDate1, opType: OperatorComparer.Equals },
                { fieldName: "ToDate", fieldValue: toDate1, opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    gridConfig1: gridModel = new gridModel();

    isShowDetailTable: boolean = false;

    GetDetails(data) {
        console.log(data)
        let reqId = String(data.reqId)
        this.gridConfig1 = {
            apiUrl: "CanteenRequest/CanteenRequestList",
            columnsList: [
                // { heading: "Code", key: "reqId", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
                // { heading: "UnitMRP", key: "unitMRP", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
            ],
            sortField: "ReqId",
            sortOrder: 0,
            filters: [
                { fieldName: "ReqId", fieldValue: reqId, opType: OperatorComparer.Equals }

            ]
        }
        this.isShowDetailTable = true;
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }
    
    onPrint() { }

    NewRequest(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewCanteenRequestComponent,
            {
                maxWidth: "95vw",
                maxHeight: "98vh",
                width: "100%",
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }
    
    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
}


export class CanteenList {
    IndentNo: Number;
    IndentDate: number;
    FromStoreName: string;
    ToStoreName: string;
    Addedby: number;
    IsInchargeVerify: string;
    CanteenList: any;
    FromStoreId: boolean;

    /**
     * Constructor
     *
     * @param CanteenList
     */
    constructor(CanteenList) {
        {
            this.IndentNo = CanteenList.IndentNo || 0;
            this.IndentDate = CanteenList.IndentDate || 0;
            this.FromStoreName = CanteenList.FromStoreName || "";
            this.ToStoreName = CanteenList.ToStoreName || "";
            this.Addedby = CanteenList.Addedby || 0;
            this.IsInchargeVerify = CanteenList.IsInchargeVerify || "";
            this.CanteenList = CanteenList.CanteenList || "";
            this.FromStoreId = CanteenList.FromStoreId || "";

        }
    }
}
export class CanteenDetList {

    ItemName: string;
    Qty: number;
    IssQty: number;
    BalQty: any;
    StoreName: any;
    /**
     * Constructor
     *
     * @param CanteenDetList
     */
    constructor(CanteenDetList) {
        {

            this.ItemName = CanteenDetList.ItemName || "";
            this.Qty = CanteenDetList.Qty || 0;
            this.IssQty = CanteenDetList.IssQty || 0;
            this.BalQty = CanteenDetList.BalQty || 0;
            this.StoreName = CanteenDetList.StoreName || '';
        }
    }
}