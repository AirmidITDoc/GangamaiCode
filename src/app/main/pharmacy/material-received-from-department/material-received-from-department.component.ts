import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { AcceptMaterialListPopupComponent } from './accept-material-list-popup/accept-material-list-popup.component';
import { MaterialReceivedFromDepartmentService } from './material-received-from-department.service';
import { FormGroup } from '@angular/forms';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';

@Component({
  selector: 'app-material-received-from-department',
  templateUrl: './material-received-from-department.component.html',
  styleUrls: ['./material-received-from-department.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})

export class MaterialReceivedFromDepartmentComponent implements OnInit {

  hasSelectedContacts: boolean;
  IssueSearchGroup: FormGroup;

  tempDatasource = new MatTableDataSource<IssueItemList>();

  tempdata: any = [];
  ItemSamelist: any = [];
  BatchSamelist: any = [];
  DraftQty: any = 0;
  Tostore = "0"
  // FromStore: any = String(this.accountService.currentUserValue.user.storeId);
  Status = "0"
  IsAccepted = "0"
  autocompletestore: string = "Store";
  autocompleteitem: string = "ItemType"; //Item
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  AgainstInd: boolean = true;
  Addflag: boolean = false;

  constructor(
    public _MaterialReceivedFromDepartmentService: MaterialReceivedFromDepartmentService,
    public toastr: ToastrService, private commonService: PrintserviceService,
    public _matDialog: MatDialog, private accountService: AuthenticationService,
    public datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.IssueSearchGroup = this._MaterialReceivedFromDepartmentService.MaterialSearchFrom();
  }

  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('isVerifiedstatus') isVerifiedstatus!: TemplateRef<any>;
  @ViewChild('isacceptstatus') isacceptstatus!: TemplateRef<any>;
  @ViewChild('Rstatus') Rstatus!: TemplateRef<any>;
  @ViewChild('Pstatus') Pstatus!: TemplateRef<any>;
  @ViewChild('Astatus') Astatus!: TemplateRef<any>;
  @ViewChild('detailstatus') detailstatus!: TemplateRef<any>;
  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    // this.gridConfig.columnsList.find(col => col.key === 'isVerified')!.template = this.isVerifiedstatus;
    // this.gridConfig.columnsList.find(col => col.key === 'isAccepted')!.template = this.isacceptstatus;

    this.gridConfig.columnsList.find(col => col.key === 'rejetcedByDepartment')!.template = this.Rstatus;
    this.gridConfig.columnsList.find(col => col.key === 'pendingByDepartment')!.template = this.Pstatus;
    this.gridConfig.columnsList.find(col => col.key === 'acceptedByDepartment')!.template = this.Astatus;

    //  this.gridConfig.columnsList.find(col => col.key === 'status')!.template = this.detailstatus;

  }


  gridConfig1: gridModel = new gridModel();

  allcolumns = [

    { heading: "Status", key: "acceptedByDepartment", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 70 },

    { heading: "", key: "rejetcedByDepartment", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },

    { heading: "", key: "pendingByDepartment", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },


    // { heading: "Status", key: "isAccepted", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "IssueNo", key: "issueNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Issue Date", key: "issueDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
    { heading: "Accepted Date", key: "acceptedDatetime", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
    { heading: "Total Qty", key: "totalQtyIssued", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "From Store Name", key: "fromStoreName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "To Store Name", key: "toStoreName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Total Amount", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "GST Amount", key: "totalVatAmount", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "Net Amount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "Added By", key: "addedby", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Recevied By", key: "receivedby", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    {
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ];

  @ViewChild('grid') grid: AirmidTableComponent;
  @ViewChild('grid1') grid1: AirmidTableComponent;


  gridConfig: gridModel = {
    apiUrl: "IssueToDepartment/MaterialRecvedByDeptList",
    columnsList: this.allcolumns,
    sortField: "IssueId",
    sortOrder: 0,
    filters: [
      { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "IsClosed", fieldValue: this.Status, opType: OperatorComparer.Equals },
      // { fieldName: "IsAccepted", fieldValue: this.IsAccepted, opType: OperatorComparer.Equals }
    ]
  }


  isShowDetailTable: boolean = false;
  GetDetails1(data) {
    debugger
    const IssueId = data.issueId
    this.gridConfig1 = {
      apiUrl: "IssueToDepartment/MaterialreceiveddetailList",
      columnsList: [
        { heading: "ItemName", key: "itemName", sort: true, align: 'left', emptySign: 'NA', widthh: 450 },
        { heading: "Batch No", key: "batchNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Batch Exp Date", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 100 },
        { heading: "Issue Qty", key: "issueQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Rate", key: "perUnitLandedRate", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "Total Amount", key: "landedTotalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
        { heading: "GST(%)", key: "vatPercentage", sort: true, align: 'left', emptySign: 'NA', width: 100 }
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


  barcodeItemfetch() {
    this.Addflag = true;
    const d = {
      // "StockId": this._IssueToDep.NewIssueGroup.get("Barcode").value || 0,
      // "StoreId": this._loggedService.currentUserValue.user.storeId || 0
    }
    //  this._IssueToDep.getCurrentStockItem(d).subscribe(data => {
    //      this.tempDatasource.data = data as any;

    //      if (this.tempDatasource.data.length >= 1) {
    //          this.tempDatasource.data.forEach((element) => {
    //              this.DraftQty = 1;
    //              this.onAddBarcodeItemList(element, this.DraftQty);
    //          });
    //      }
    //      else if (this.tempDatasource.data.length == 0) {
    //          this.toastr.error('Item Not Found !', 'Error !', {
    //              toastClass: 'tostr-tost custom-toast-error',
    //          });
    //      }
    //  });
    // this.vBarcode = '';
    this.Addflag = false
  }

  onAddBarcodeItemList(contact, DraftQty) {

  }
  selectChangeStore(obj: any) {
    console.log(obj)
  }

  ListView1(value) {
    this.isShowDetailTable = false
    if (value.value !== 0)
      this.Tostore = value.value
    else
      this.Tostore = "0"
    this.onChangeFirst(value);
  }

  onChangeFirst(value) {
    debugger
    let IsVerify = "0"
    if (this.IssueSearchGroup.get("IsVerify").value)
      IsVerify = "1"
    else
      IsVerify = "0"

    this.isShowDetailTable = false;
    this.fromDate = this.datePipe.transform(this.IssueSearchGroup.get('startdate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.IssueSearchGroup.get('enddate').value, "yyyy-MM-dd")
    this.Tostore = this.IssueSearchGroup.get("ToStoreId").value || this.Tostore
    this.Status = IsVerify,//this.IssueSearchGroup.get("IsVerify").value || "0"
      this.getfilterdata();
  }

  getfilterdata() {
    debugger
    this.gridConfig = {
      apiUrl: "IssueToDepartment/MaterialRecvedByDeptList",
      columnsList: this.allcolumns,
      sortField: "IssueId",
      sortOrder: 0,
      filters: [
        //  { fieldName: "FromStoreId", fieldValue: this.FromStore, opType: OperatorComparer.Equals },
        { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsClosed", fieldValue: this.Status, opType: OperatorComparer.Equals },
        //  { fieldName: "IsAccepted", fieldValue: this.IsAccepted, opType: OperatorComparer.Equals }
      ],
      row: 25
    }

    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();

  }


  onEdit(contact) {
    // if(contact.pendingByDepartment > 0){
    console.log(contact);
    const dialogRef = this._matDialog.open(AcceptMaterialListPopupComponent,
      {
        maxWidth: "75vw",
        height: '650px',
        width: '100%',
        data: {
          Obj: contact,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
       this.getfilterdata()
       this.isShowDetailTable=false
    });

  }


  viewgetIssuetodeptReportPdf(element) {
    console.log(element)
    this.commonService.Onprint("IssueId", element.issueId, "MaterialReceivedByDept");
  }

}

export class ItemList {
  ItemName: string;
  IssueQty: number;
  Bal: number;
  StoreId: any;
  StoreName: any;
  selected: any;
  /**
   * Constructor
   *
   * @param ItemList
   */
  constructor(ItemList) {
    {
      this.ItemName = ItemList.ItemName || "";
      this.IssueQty = ItemList.IssueQty || 0;
      this.Bal = ItemList.Bal || 0;
      this.StoreId = ItemList.StoreId || 0;
      this.StoreName = ItemList.StoreName || '';
      this.selected = ItemList.selected || 0;
    }
  }
}

export class Issuetodept {
  IssueNo: any;
  IssueDate: any;
  FromStoreName: any;
  ToStoreName: any;
  NetAmount: any;
  Remark: any;
  Receivedby: any;
  FromStoreId: any;

  /**
   * Constructor
   *
   * @param Issuetodept
   */
  constructor(Issuetodept) {
    {
      this.IssueNo = Issuetodept.IssueNo || 0;
      this.IssueDate = Issuetodept.IssueDate || '';
      this.FromStoreName = Issuetodept.FromStoreName || "";
      this.ToStoreName = Issuetodept.ToStoreName || "";
      this.NetAmount = Issuetodept.NetAmount || 0;
      this.Remark = Issuetodept.Remark || "";
      this.Receivedby = Issuetodept.Receivedby || "";

    }
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
    }
  }
}


