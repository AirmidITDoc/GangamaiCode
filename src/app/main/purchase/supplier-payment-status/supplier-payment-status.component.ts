import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { SupplierPaymentStatusService } from './supplier-payment-status.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SupplierPaymentListComponent } from './supplier-payment-list/supplier-payment-list.component';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { element } from 'protractor';
import { error } from 'console';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-supplier-payment-status',
  templateUrl: './supplier-payment-status.component.html',
  styleUrls: ['./supplier-payment-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SupplierPaymentStatusComponent implements OnInit {
  autocompletestore: string = "Store";
  autocompleteSupplier: string = "SupplierMaster"
  displayedColumns = [
    'CheckBox',
    'grnNumber',
    'grnTime',
    'supplierName',
    'invoiceNo',
    'netAmount',
    'paidAmount',
    'balAmount',
    'invDate',
    // 'action',
  ];

  isSupplierSelected: boolean = false;
  ToStoreList: any = [];
  dateTimeObj: any;
  filteredSupplier: any;
  noOptionFound: any;
  sIsLoading: string = '';
  vSupplierName: any;
  vInvoiceNo: any;
  GRNID: any;
  SelectedList: any = [];
  vNetAmount: any = 0;
  vPaidAmount: any = 0;
  vBalanceAmount: any = 0;
  CurrentDate = new Date()

  dsSupplierpayList = new MatTableDataSource<SupplierPayStatusList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  
  storeId = this.accountService.currentUserValue.user.storeId;
  supplierid="0";
  status="0";

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
    this.getSupplierPayStatusList();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

    selectChangeSupplier(obj: any) {
        console.log(obj)
        if (obj.value !== 0)
            this.supplierid = obj.value
        else
            this.supplierid = "0"
    this.getSupplierPayStatusList();
    }

  getSupplierPayStatusList() {
    // debugger
    let fromDate = this._SupplierPaymentStatusService.SearchFormGroup.get("start").value || "";
    let toDate = this._SupplierPaymentStatusService.SearchFormGroup.get("end").value || "";
    fromDate = fromDate ? this.datePipe.transform(fromDate, "yyyy-MM-dd") : "";
    toDate = toDate ? this.datePipe.transform(toDate, "yyyy-MM-dd") : "";
    var vdata ={
      "first": 0,
      "rows": 10,
      "sortField": "Supplier_Id",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ToStoreId",
          "fieldValue": String(this.storeId),
          "opType": "Equals"
        },
        {
          "fieldName": "From_Dt",
          "fieldValue": fromDate, //"2024-01-01",
          "opType": "Equals"
        },
        {
          "fieldName": "To_Dt",
          "fieldValue": toDate, //"2025-01-01",
          "opType": "Equals"
        },
        {
          "fieldName": "IsPaymentProcess",
          "fieldValue": this._SupplierPaymentStatusService.SearchFormGroup.get('Status').value,
          "opType": "Equals"
        },
        {
          "fieldName": "Supplier_Id",
          "fieldValue": this.supplierid, //"1",
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }

    console.log(vdata)
    this._SupplierPaymentStatusService.getSupplierPayStatusList(vdata).subscribe((data) => {
      this.dsSupplierpayList.data = data.data as SupplierPayStatusList[];
      console.log(this.dsSupplierpayList)
      this.dsSupplierpayList.sort = this.sort;
      this.dsSupplierpayList.paginator = this.paginator;
    });
  }

  parseToDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const [datePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
}

  tableElementChecked(event, element) {
    // debugger
    this.vSupplierName = element.supplierName;
    this.vInvoiceNo = element.invoiceNo;
    this.GRNID = element.grnid;
    if (event.checked) {
      console.log(element)
      this.SelectedList.push(element)
      this.vNetAmount += element.netAmount
      this.vPaidAmount += element.paidAmount
      this.vBalanceAmount += element.balAmount
    }
    else {
      this.vNetAmount -= element.netAmount
      this.vPaidAmount -= element.paidAmount
      this.vBalanceAmount -= element.balAmount
    }
    console.log(this.SelectedList)
  }

  OnSave() {
    if (!this.dsSupplierpayList.data.length) {
      this.toastr.warning('Please add Supplier list in table', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if ((this.vBalanceAmount < 0)) {
      this.toastr.warning('Please select Check Box', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    // let grnHeaderPayStatus = [];
    // this.SelectedList.forEach((element) => {
    //   let grnHeaderPayStatusObj = {};
    //   grnHeaderPayStatusObj['grnId'] = element.grnid || 0;
    //   grnHeaderPayStatusObj['paidAmount'] = this.vPaidAmount || 0;
    //   grnHeaderPayStatusObj['balAmount'] = this.vBalanceAmount || 0;
    //   grnHeaderPayStatus.push(grnHeaderPayStatusObj);
    // });

    let SupPayDetPayStatus = [];
    this.SelectedList.forEach((element) => {
      let SupPayDetPayStatusObj = {};
      SupPayDetPayStatusObj['supTranId'] = 0
      SupPayDetPayStatusObj['supPayId'] = 0
      SupPayDetPayStatusObj['supGrnId'] = element.grnid || 0;
      SupPayDetPayStatus.push(SupPayDetPayStatusObj);
    });

    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = this.datePipe.transform(this.CurrentDate, 'dd/MM/YYYY') || '01/01/1900'
    PatientHeaderObj['GRNID'] = this.GRNID;
    PatientHeaderObj['NetPayAmount'] = this._SupplierPaymentStatusService.SearchFormGroup.get('NetAmount').value || 0;


    const dialogRef = this._matDialog.open(OpPaymentComponent,
      {
        maxWidth: "80vw",
        height: '650px',
        width: '80%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "Phar-SupplierPay",
          advanceObj: PatientHeaderObj,
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      debugger
      console.log("payment:", result)

      let submitData = {
        "grnid": this.GRNID,
        "paidAmount": this.vPaidAmount,
        "balAmount": this.vBalanceAmount,
        // 'tgrnHeaderPayStatus': grnHeaderPayStatus,,
        'tGrnsupPayments': result.submitDataPay.ipPaymentInsert,
        'tSupPayDets': SupPayDetPayStatus
      }
      console.log(submitData)
      this._SupplierPaymentStatusService.InsertSupplierPay(submitData).subscribe((response) => {
        if (response) {
          this.toastr.success('Supplier payment Successfuly', 'Saved', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        else {
          this.toastr.warning('Supplier payment Not Saved', 'Error', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      },
        error => {
          this.toastr.warning('Please Check Api Error', 'Error', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      );
    });
  }
  onClear() {

  }
  OnReset() {
    // this.getSupplierList();
    this.vNetAmount = 0;
    this.vPaidAmount = 0;
    this.vBalanceAmount = 0;
  }
  getSupplierPaymentList() {
    this.dsSupplierpayList.data = [];
    const dialogRef = this._matDialog.open(SupplierPaymentListComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      //console.log(result)  
    });
  }
  getSupplierPaymentReport() {

  }

  selection = new SelectionModel<SupplierPayStatusList>(true, []);
  masterToggle() {
    debugger
    // if there is a selection then clear that selection
    if (this._SupplierPaymentStatusService.SearchFormGroup.get('Status').value == 1) {
      this.toastr.warning('Please select unpaid list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this._SupplierPaymentStatusService.SearchFormGroup.get('SupplierId').value) {
      this.toastr.warning('Please select supplier Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._SupplierPaymentStatusService.SearchFormGroup.get('SupplierId').value) {
      if (!this.filteredSupplier.some(item => item.SupplierId == this._SupplierPaymentStatusService.SearchFormGroup.get('SupplierId').value.SupplierId)) {
        this.toastr.warning('Please select valid supplier Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.isSomeSelected()) {
      this.vNetAmount = 0;
      this.vPaidAmount = 0;
      this.vBalanceAmount = 0;
      this.selection.clear();
      this.SelectedList = [];
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dsSupplierpayList.data.forEach(row => this.selection.select(row));

      this.dsSupplierpayList.data.forEach(element => {
        console.log(element)
        this.GRNID = element.grnid;
        this.vNetAmount += element.netAmount
        this.vPaidAmount += element.paidAmount
        this.vBalanceAmount += element.balAmount
        this.SelectedList.push(element)
      })

    }
    //this.SelectedList.push(this.selection.selected); 
    console.log(this.SelectedList)
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dsSupplierpayList.data.length;

    return numSelected === numRows;
  }

  isSomeSelected() {
    return this.selection.selected.length > 0;
  }


  OnSelectSUpplier(event, element) {
    this.GRNID = element.grnid;
    if (event.checked) {
      if (this.SelectedList.length > 0) {
        if (!this.SelectedList.some(item => item.supplierName == element.supplierName)) {
          this.toastr.warning('Please select same supplier Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.SelectedList = [];
          this.selection.clear()
          this.getSupplierPayStatusList();
          return;
        }
        this.SelectedList.push(element)
      } else {
        this.SelectedList.push(element)
      }

      this.vNetAmount += element.netAmount
      this.vPaidAmount += element.paidAmount
      this.vBalanceAmount += element.balAmount
    }
    else {
      let index = this.SelectedList.indexOf(element);
      if (index >= 0) {
        this.SelectedList.splice(index, 1);
      }
      this.vNetAmount -= element.netAmount
      this.vPaidAmount -= element.paidAmount
      this.vBalanceAmount -= element.balAmount
    }
    console.log(this.SelectedList)
  }
}

export class SupplierPayStatusList {
  GRNNo: any;
  SupplierName: string;
  GRNDate: number;
  InvoiceNo: number;
  NetAmount: any;
  PaidAmount: any;
  BalAmount: any;
  InvDate: any;
  Mobile: any;
  GRNID: any;

  grnNumber: any;
  grnTime: any;
  supplierName: any;
  invoiceNo: any;
  netAmount: any;
  paidAmount: any;
  balAmount: any;
  invDate: any;
  grnid:any


  constructor(SupplierPayStatusList) {
    {
      this.GRNNo = SupplierPayStatusList.GRNNo || 0;
      this.SupplierName = SupplierPayStatusList.SupplierName || '';
      this.GRNDate = SupplierPayStatusList.GRNDate || 0;
      this.InvoiceNo = SupplierPayStatusList.InvoiceNo || 0;
      this.NetAmount = SupplierPayStatusList.NetAmount || 0;
      this.PaidAmount = SupplierPayStatusList.PaidAmount || 0;
      this.BalAmount = SupplierPayStatusList.BalAmount || '';
      this.InvDate = SupplierPayStatusList.InvDate || '';
      this.Mobile = SupplierPayStatusList.Mobile || 0;
      this.GRNID = SupplierPayStatusList.GRNID || 0;
      this.grnid = SupplierPayStatusList.grnid || 0;

      this.grnNumber = SupplierPayStatusList.grnNumber || 0;
      this.grnTime = SupplierPayStatusList.grnTime || 0;
      this.supplierName = SupplierPayStatusList.supplierName || 0;
      this.invoiceNo = SupplierPayStatusList.invoiceNo || 0;
      this.netAmount = SupplierPayStatusList.netAmount || 0;
      this.paidAmount = SupplierPayStatusList.paidAmount || 0;
      this.balAmount = SupplierPayStatusList.balAmount || 0;
      this.invDate = SupplierPayStatusList.invDate || 0;
    }
  }
}
