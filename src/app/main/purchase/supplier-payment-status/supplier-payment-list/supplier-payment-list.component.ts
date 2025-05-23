import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SupplierPaymentStatusService } from '../supplier-payment-status.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';

@Component({
  selector: 'app-supplier-payment-list',
  templateUrl: './supplier-payment-list.component.html',
  styleUrls: ['./supplier-payment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SupplierPaymentListComponent implements OnInit {
  // displayedColumns = [
  //   'SupPayNo',
  //   'Date',
  //   'SupplierName',
  //   'TotalAmount',
  //   'CashPayAmt',
  //   'ChequePayAmt',
  //   'UserName',
  //   'PartyReceipt',
  //   'action',
  // ];

  isSupplierSelected: boolean = false;
  ToStoreList: any = [];
  dateTimeObj: any;
  filteredSupplier: any;
  noOptionFound: any;
  sIsLoading: string = '';

  dsSupplierList = new MatTableDataSource<SupplierPayStatusList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  supplierN: any = "%";
  autocompleteSupplier: string = "SupplierMaster"

  constructor(
    public _SupplierPaymentStatusService: SupplierPaymentStatusService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
     this._SupplierPaymentStatusService.SupplierListForm.get('SupplierId')?.valueChanges.subscribe(value => {
            this.supplierN = value.text || "%";
            this.getfilterdata();
        });
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  allColumns = [
    { heading: "SupPayNo", key: "mo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Date", key: "bankName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "SupplierName", key: "supplierName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "TotalAmount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "CashPayAmt", key: "cash", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "ChequePayAmt", key: "chequ", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PartyReceipt", key: "par", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.print, callback: (data: any) => {
            // this.onSave(data) // EDIT Records
          }
        }]
    }
  ]

  allFilters = [
    { fieldName: "SupplierName", fieldValue: this.supplierN, opType: OperatorComparer.StartsWith }
  ]

  gridConfig: gridModel = {
    apiUrl: "SupplierPayment/supplierPaymentList",
    columnsList: this.allColumns,
    sortField: "SupplierId",
    sortOrder: 0,
    filters: this.allFilters
  }

  selectChangeSupplier(obj: any) {
    console.log(obj);
    if (!obj || obj.text === null || obj.text === undefined || obj.text === 0 || obj.text === '') {
      this.supplierN = "%";
    } else {
      this.supplierN = obj.text;
    }
    this.getfilterdata();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "SupplierPayment/supplierPaymentList",
      columnsList: this.allColumns,
      sortField: "SupplierId",
      sortOrder: 0,
      filters: [
        { fieldName: "SupplierName", fieldValue: this.supplierN, opType: OperatorComparer.Contains }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  // getSupplierPayStatusList(){
  //   this.sIsLoading = '';
  //   var vdata={
  //     'ToStoreId': this.accountService.currentUserValue.storeId || 0,
  //     'From_Dt':this.datePipe.transform(this._SupplierPaymentStatusService.SupplierListForm.get('start').value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  //     'To_Dt':this.datePipe.transform(this._SupplierPaymentStatusService.SupplierListForm.get('end').value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  //     'IsPaymentProcess':this._SupplierPaymentStatusService.SupplierListForm.get('Status').value || 0,
  //     'Supplier_Id':this._SupplierPaymentStatusService.SupplierListForm.get('SupplierId').value.SupplierId || 0,
  //   }
  //   console.log(vdata)
  //   this._SupplierPaymentStatusService.getSupplierPayStatusList(vdata).subscribe((data) =>{
  //     this.dsSupplierList.data = data as SupplierPayStatusList[];
  //     console.log(this.dsSupplierList)
  //     this.dsSupplierList.sort =this.sort;
  //     this.dsSupplierList.paginator = this.paginator;
  //     this.sIsLoading = '';
  //   },
  //     error => {
  //       this.sIsLoading = '';
  //     });
  // }

  onClear() {

  }
  onClose() {
    this._matDialog.closeAll();
  }
}

export class SupplierPayStatusList {
  GRNReturnNo: any;
  SupplierName: string;
  GRNReturnDate: number;
  InvoiceNo: number;
  NetAmount: any;
  PaidAmount: any;
  BalAmount: any;
  InvDate: any;
  Mobile: any;
  constructor(SupplierPayStatusList) {
    {
      this.GRNReturnNo = SupplierPayStatusList.GRNReturnNo || 0;
      this.SupplierName = SupplierPayStatusList.SupplierName || '';
      this.GRNReturnDate = SupplierPayStatusList.GRNReturnDate || 0;
      this.InvoiceNo = SupplierPayStatusList.InvoiceNo || 0;
      this.NetAmount = SupplierPayStatusList.NetAmount || 0;
      this.PaidAmount = SupplierPayStatusList.PaidAmount || 0;
      this.BalAmount = SupplierPayStatusList.BalAmount || '';
      this.InvDate = SupplierPayStatusList.InvDate || '';
      this.Mobile = SupplierPayStatusList.Mobile || 0;
    }
  }
}
