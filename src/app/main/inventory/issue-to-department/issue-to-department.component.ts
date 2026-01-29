import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { IssuTodeptComponent } from './issu-todept/issu-todept.component';
import { IssueToDepartmentService } from './issue-to-department.service';
import { NewIssueTodeptComponent } from './new-issue-todept/new-issue-todept.component';
import { Router } from '@angular/router';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';


@Component({
    selector: 'app-issue-to-department',
    templateUrl: './issue-to-department.component.html',
    styleUrls: ['./issue-to-department.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class IssueToDepartmentComponent implements OnInit {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.IssueToDepartment, permissionType.Add);
      
    hasSelectedContacts: boolean;
    IssueSearchGroup: FormGroup;

    DraftQty: any = 0;
    Tostore = "0"
    FromStore: any = String(this.accountService.currentUserValue.user.storeId);
    Status = "0"
    autocompletestore: string = "Store";
    autocompleteitem: string = "ItemType";
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    AgainstInd: boolean = true;
    Addflag: boolean = false;

    constructor(
        public _IssueToDep: IssueToDepartmentService,
        public toastr: ToastrService, private commonService: PrintserviceService,
        public _matDialog: MatDialog, private accountService: AuthenticationService,
        public datePipe: DatePipe, private _ActRoute: Router,public permissionService: PagePermissionService,
    ) { }

    ngOnInit(): void {
        this.IssueSearchGroup = this._IssueToDep.IssueSearchFrom();
        if (this._ActRoute.url == '/inventory/issuetodepartment') {


        }
    }
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    // @ViewChild('isVerifiedstatus') isVerifiedstatus!: TemplateRef<any>;
    @ViewChild('isacceptedstatus') isacceptedstatus!: TemplateRef<any>;
    @ViewChild('statusTable2') statusTable2!: TemplateRef<any>;
    @ViewChild('detailstatus') detailstatus!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        // this.gridConfig.columnsList.find(col => col.key === 'isVerified')!.template = this.isVerifiedstatus;
        this.gridConfig.columnsList.find(col => col.key === 'isAccepted')!.template = this.isacceptedstatus;
        // this.gridConfig1.columnsList.find(col => col.key === 'status')!.template = this.detailstatus;
        this.gridConfig.columnsList.find(col => col.key === 'isclosed')!.template = this.actionsTemplate1;
    }


    gridConfig1: gridModel = new gridModel();


    allcolumns = [
        { heading: "Status", key: "isAccepted", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 65 },

        // { heading: "", key: "isVerified", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "", key: "isclosed", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
        { heading: "IssueNo", key: "issueNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Issue Date", key: "issueDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
        { heading: "From StoreName", key: "fromStoreName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "To StoreName", key: "toStoreName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Total Amount", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
        { heading: "GST Amount", key: "totalVatAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
        { heading: "Net Amount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', width: 150, type: gridColumnTypes.amount },
        { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "AddedBy", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        {
            heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }
    ];

    @ViewChild('grid') grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;


    gridConfig: gridModel = {
         permissionCode: permissionCodes.IssueToDepartment,
        apiUrl: "IssueToDepartment/IssueToDeptList",
        columnsList: this.allcolumns,
        sortField: "IssueId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromStoreId", fieldValue: this.FromStore, opType: OperatorComparer.Equals },
            { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "IsClosed", fieldValue: this.Status, opType: OperatorComparer.Equals }
        ]
    }


    isShowDetailTable: boolean = false;
    GetDetails1(data) {

        let IssueId = data.issueId
        this.gridConfig1 = {
            apiUrl: "IssueToDepartment/IssueToDeptdetailList",
            columnsList: [
                  { heading: "Status", key: "status", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 70, template: this.statusTable2 },

                { heading: "ItemName", key: "itemName", sort: true, align: 'left', emptySign: 'NA', widthh: 350 },
                { heading: "Batch No", key: "batchNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Batch Exp Date", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
                { heading: "Qty", key: "issueQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
                { heading: "Rate", key: "perUnitLandedRate", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
                { heading: "Total Amount", key: "landedTotalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
                { heading: "GST%", key: "vatPercentage", sort: true, align: 'left', emptySign: 'NA', width: 100 }
            ],
            sortField: "IssueId",
            sortOrder: 0,
            filters: [
                { fieldName: "IssueId", fieldValue: String(IssueId), opType: OperatorComparer.Equals }

            ]
        };
        this.isShowDetailTable = true;
        setTimeout(() => {
            this.grid1.gridConfig = this.gridConfig1;
            this.grid1.bindGridData();
        }, 500);
    }


    getAgainstIndet(event) {
        if (event.checked == true) {
            this.AgainstInd = false;
        } else {
            this.AgainstInd = true;
        }

    }


    // barcodeItemfetch() {
    //     this.Addflag = true;
    //     var d = {
    //         "StockId": this._IssueToDep.NewIssueGroup.get("Barcode").value || 0,
    //         "StoreId": this._loggedService.currentUserValue.user.storeId || 0
    //     }
    //     this._IssueToDep.getCurrentStockItem(d).subscribe(data => {
    //         this.tempDatasource.data = data as any;

    //         if (this.tempDatasource.data.length >= 1) {
    //             this.tempDatasource.data.forEach((element) => {
    //                 this.DraftQty = 1;
    //                 this.onAddBarcodeItemList(element, this.DraftQty);
    //             });
    //         }
    //         else if (this.tempDatasource.data.length == 0) {
    //             this.toastr.error('Item Not Found !', 'Error !', {
    //                 toastClass: 'tostr-tost custom-toast-error',
    //             });
    //         }
    //     });
    //     this.vBarcode = '';
    //     this.Addflag = false
    // }

    // onAddBarcodeItemList(contact, DraftQty) {

    // }

    ListView(value) {
        if (value.value !== 0)
            this.FromStore = value.value
        else
            this.FromStore = "0"
        this.onChangeFirst(value);
    }

    ListView1(value) {
        if (value.value !== 0)
            this.Tostore = value.value
        else
            this.Tostore = "0"
        this.onChangeFirst(value);
    }

    onChangeFirst(value) {

        let IsClosed = "0"
        if (this.IssueSearchGroup.get("IsClosed").value)
            IsClosed = "1"
        else
            IsClosed = "0"
        this.isShowDetailTable = false;
        this.fromDate = this.datePipe.transform(this.IssueSearchGroup.get('startdate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.IssueSearchGroup.get('enddate').value, "yyyy-MM-dd")
        this.FromStore = this.IssueSearchGroup.get("FromStoreId").value || this.FromStore
        this.Tostore = this.IssueSearchGroup.get("ToStoreId").value || this.Tostore
        this.Status = IsClosed,//this.IssueSearchGroup.get("IsVerify").value || "0"

            this.getfilterdata();
    }

    getfilterdata() {

        this.gridConfig = {
            apiUrl: "IssueToDepartment/IssueToDeptList",
            columnsList: this.allcolumns,
            sortField: "IssueId",
            sortOrder: 0,
            filters: [
                { fieldName: "FromStoreId", fieldValue: this.FromStore, opType: OperatorComparer.Equals },
                { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "IsClosed", fieldValue: this.Status, opType: OperatorComparer.Equals }
            ],
            row: 25
        }

        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();

    }


    onSave(row: any = null) {
        let that = this;
        // if(this._ActRoute.url == '/inventory/issuetodepartment')

        const dialogRef = this._matDialog.open(NewIssueTodeptComponent,
            {
                maxWidth: "97vw",
                height: '99%',
                width: '95%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
        });
    }

    viewgetIssuetodeptReportPdf(element) {
        console.log(element)
        this.commonService.Onprint("IssueId", element.issueId, "Issutodeptissuewise");
    }
  onVerify(row) {
    debugger
    let submitData = {
      "indentId": row.indentId,
      "isInchargeVerifyId": this.accountService.currentUserValue.userId

    };
    this._IssueToDep.getVerifyIssue(submitData).subscribe(response => {
      this.onChangeFirst(event);

    });
  }

}

export class NewIssueList3 {

    ItemId: any;
    ItemName: any;
    BatchNO: any;
    ExpDate: any;
    BalanceQty: any;
    Qty: any;
    UnitRate: any;
    TotalAmount: any;
    BatchNo: string;
    BatchExpDate: any;
    QtyPerDay: any;
    UnitMRP: any;
    Bal: number;
    StoreId: any;
    StoreName: any;
    GSTPer: any;
    GSTAmount: any;
    TotalMRP: any;
    DiscPer: any;
    DiscAmt: any;
    NetAmt: any;
    StockId: any;
    ReturnQty: any;
    Total: any;
    VatPer: any;
    VatAmount: any;
    LandedRate: any;
    CgstPer: any;
    CGSTAmt: any;
    SgstPer: any;
    SGSTAmt: any;
    IgstPer: any;
    IGSTAmt: any;
    DiscAmount: any;
    NetAmount: any;
    ExpDateNo; any;
    BalQty: any;
    PurchaseRate: any;
    LandedRateandedTotal: any;
    PurTotAmt: any;
    IndentId: any;
    IndentDetailsId: any;
    IndQty: any;
    IsClosed: any;
    IssueQty: any;
    IssueBalQty: any;
    Status: any;

    constructor(NewIssueList3) {
        this.ItemId = NewIssueList3.ItemId || 0;
        this.ItemName = NewIssueList3.ItemName || '';
        this.BatchNO = NewIssueList3.BatchNO || 0;
        this.ExpDate = NewIssueList3.ExpDate || 1 / 2 / 23;
        this.BalanceQty = NewIssueList3.BalanceQty || 0;
        this.Qty = NewIssueList3.Qty || 0;
        this.UnitRate = NewIssueList3.UnitRate || 0;
        this.TotalAmount = NewIssueList3.TotalAmount || 0;
        this.BatchExpDate = NewIssueList3.BatchExpDate || "";
        this.UnitMRP = NewIssueList3.UnitMRP || "";
        this.QtyPerDay = NewIssueList3.QtyPerDay || 0;
        this.Bal = NewIssueList3.Bal || 0;
        this.StoreId = NewIssueList3.StoreId || 0;
        this.StoreName = NewIssueList3.StoreName || '';
        this.GSTPer = NewIssueList3.GSTPer || "";
        this.TotalMRP = NewIssueList3.TotalMRP || 0;
        this.DiscAmt = NewIssueList3.DiscAmt || 0;
        this.NetAmt = NewIssueList3.NetAmt || 0;
        this.StockId = NewIssueList3.StockId || 0;
        this.NetAmt = NewIssueList3.NetAmt || 0;
        this.ReturnQty = NewIssueList3.ReturnQty || 0;
        this.TotalAmount = NewIssueList3.TotalAmount || 0;
        this.Total = NewIssueList3.Total || '';
        this.VatPer = NewIssueList3.VatPer || 0;
        this.VatAmount = NewIssueList3.VatAmount || 0;
        this.LandedRate = NewIssueList3.LandedRate || 0;
        this.CgstPer = NewIssueList3.CgstPer || 0;
        this.CGSTAmt = NewIssueList3.CGSTAmt || 0;
        this.SgstPer = NewIssueList3.SgstPer || 0;
        this.SGSTAmt = NewIssueList3.SGSTAmt || 0;
        this.IgstPer = NewIssueList3.IgstPer || 0;
        this.IGSTAmt = NewIssueList3.IGSTAmt || 0;
        this.NetAmount = NewIssueList3.NetAmount || 0;
        this.DiscAmount = NewIssueList3.DiscAmount || 0;
        this.ExpDateNo = NewIssueList3.ExpDateNo || 1 / 2 / 23;
        this.BalQty = NewIssueList3.BalQty || 0;
        this.PurchaseRate = NewIssueList3.PurchaseRate || 0;
        this.LandedRateandedTotal = NewIssueList3.LandedRateandedTotal || 0;
        this.PurTotAmt = NewIssueList3.PurTotAmt || 0;
        this.IssueQty = NewIssueList3.IssueQty || 0;
        this.IssueBalQty = NewIssueList3.IssueBalQty || 0;
        this.Status = NewIssueList3.Status || false;

    }
}



export class IssueItemList {
    ItemId: any;
    ItemName: string;
    BatchNo: number;
    BatchExpDate: number;
    Qty: number;
    PerUnitLandedRate: number;
    LandedTotalAmount: number;
    VatPercentage: number;
    StoreId: any;
    StoreName: any;
    IndentId: any;
    IndentDetailsId: any;
    IsClosed: any;
    BalanceQty: any;

    constructor(IssueItemList) {
        {
            this.ItemId = IssueItemList.ItemId || 0;
            this.ItemName = IssueItemList.ItemName || "";
            this.BatchNo = IssueItemList.BatchNo || 0;
            this.BatchExpDate = IssueItemList.BatchExpDate || 0;
            this.Qty = IssueItemList.Qty || 0;
            this.PerUnitLandedRate = IssueItemList.PerUnitLandedRate || 0;
            this.LandedTotalAmount = IssueItemList.LandedTotalAmount || 0;
            this.VatPercentage = IssueItemList.VatPercentage || 0;
            this.StoreId = IssueItemList.StoreId || 0;
            this.StoreName = IssueItemList.StoreName || "";
            this.IndentId = IssueItemList.IndentId || 0;
            this.IndentDetailsId = IssueItemList.IndentDetailsId || 0;
            this.IsClosed = IssueItemList.IsClosed || 0;
            this.BalanceQty = IssueItemList.BalanceQty || 0;
        }
    }
}

export class IssueToDep {
    IssueNo: Number;
    IssueDate: number;
    FromStoreName: string;
    ToStoreName: string;
    NetAmount: number;
    Remark: string;
    Receivedby: string;
    IssueDepId: number;

    constructor(IssueToDep) {
        {
            this.IssueNo = IssueToDep.IssueNo || 0;
            this.IssueDate = IssueToDep.IssueDate || 0;
            this.FromStoreName = IssueToDep.FromStoreName || "";
            this.ToStoreName = IssueToDep.ToStoreName || "";
            this.NetAmount = IssueToDep.NetAmount || 0;
            this.Remark = IssueToDep.Remark || "";
            this.Receivedby = IssueToDep.Receivedby || "";
            this.IssueDepId = IssueToDep.IssueDepId || 0;
        }
    }
}