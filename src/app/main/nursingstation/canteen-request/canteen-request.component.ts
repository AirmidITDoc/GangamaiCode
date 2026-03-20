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
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import Swal from 'sweetalert2';

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
    fname = "%"
    lname = "%"
    WardId="0"
      autocompleteModewardName: string = "Room";

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('Billstatus') Billstatus!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'isBillGenerated')!.template = this.Billstatus;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    allcolumns = [

        { heading: "-", key: "isBillGenerated", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },

        { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 100  },
        { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 150  },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100  },
       
        { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Ward Name | Bed No", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Payer Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        // { heading: "AddUserName", key: "addedUserName", sort: true, align: 'left', emptySign: 'NA' },

        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]


    constructor(public _CanteenRequestService: CanteenRequestService,
        public _matDialog: MatDialog, private _formBuilder: FormBuilder,
        private commonService: PrintserviceService,
        public toastr: ToastrService, public datePipe: DatePipe) { }
    ngOnInit(): void {
        this.myFilterform = this.filterForm()
    }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: '',
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            fName: "",
            lName: "",
            wardId:''
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
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "F_Name", fieldValue: this.fname, opType: OperatorComparer.Equals },
            { fieldName: "L_Name", fieldValue: this.lname, opType: OperatorComparer.Equals },
             { fieldName: "WardId", fieldValue: this.WardId, opType: OperatorComparer.Equals }

             
        ]
    }

        
  selectChangeward(value) {
    if (value.value !== 0)
      this.WardId = value.value
    else
      this.WardId = "0"

    this.onChangeFirst();
  }

    Clearfilter(event) {
        console.log(event)
        if (event == 'RegNo')
            this.myFilterform.get('RegNo').setValue("")
        if (event == 'fName')
            this.myFilterform.get('fName').setValue("")

        if (event == 'lName')
            this.myFilterform.get('lName').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.regNo = this.myFilterform.get('RegNo').value
        this.fname = this.myFilterform.get('fName').value + "%"
        this.lname = this.myFilterform.get('lName').value + "%"

        this.getfilterdata();
    }

    getfilterdata() {

        debugger
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
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "F_Name", fieldValue: this.fname, opType: OperatorComparer.Equals },
                { fieldName: "L_Name", fieldValue: this.lname, opType: OperatorComparer.Equals },
                 { fieldName: "WardId", fieldValue: this.WardId, opType: OperatorComparer.Equals }

            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    gridConfig1: gridModel = new gridModel();

    isShowDetailTable: boolean = false;

    GetDetails(data) {
        console.log(data)
        const reqId = String(data.reqId)
        this.gridConfig1 = {
            apiUrl: "CanteenRequest/CanteenRequestList",
            columnsList: [

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

    onPrint(element) {
        console.log(element)
        this.commonService.Onprint("ReqId", element.reqId, "CanteenRequestprint");
    }

    NewRequest(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur(); 

        const that = this;
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
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    Canteencancle(data) {
        debugger
        Swal.fire({
            title: 'Do you want to cancel the Prescription?',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((flag) => {
            if (flag.isConfirmed) {
                const sub={
                    reqDetId:data.reqId

                }
                this._CanteenRequestService.CanrequestCancle(sub).subscribe((response: any) => {
                    this.toastr.success(response.message);
                    this.grid.bindGridData();
                });
            }
        });
    }

    
  getValidationMessages() {
    return {
    
      WardName: [],
         
    }
  }
}


export class CanteenList {
    IndentNo: number;
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