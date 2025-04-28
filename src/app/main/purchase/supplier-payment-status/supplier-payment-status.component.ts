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
  
  isSupplierSelected:boolean=false;
  ToStoreList:any=[];
  dateTimeObj:any;
  filteredSupplier:any;
  noOptionFound:any;
  sIsLoading:string='';
  vSupplierName:any;
  vInvoiceNo:any;
  GRNID:any;
  SelectedList:any=[];
  vNetAmount:any=0;
  vPaidAmount:any=0;
  vBalanceAmount:any=0;
  CurrentDate = new Date()

  dsSupplierpayList =new MatTableDataSource<SupplierPayStatusList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  constructor(
    public _SupplierPaymentStatusService : SupplierPaymentStatusService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getStoreList();
  } 
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getStoreList() {
    var vdata = {
      Id: this.accountService.currentUserValue.storeId
    }
    this._SupplierPaymentStatusService.getLoggedStoreList(vdata).subscribe(data => {
      this.ToStoreList = data;
      this._SupplierPaymentStatusService.SearchFormGroup.get('ToStoreId').setValue(this.ToStoreList[0]);
    });
  }
  getSupplierList(){
    var vdata={
      'SupplierName': `${this._SupplierPaymentStatusService.SearchFormGroup.get('SupplierId').value}%`
    }
    this._SupplierPaymentStatusService.getSupplierSearchList(vdata).subscribe((data) =>{
      this.filteredSupplier = data ;
      if(this.filteredSupplier.length == 0){
        this.noOptionFound = true;
      }else{
        this.noOptionFound = false;
      }
    });
  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }
                                
  getSupplierPayStatusList(){
       var vdata={
      "first": 0,
      "rows": 10,
      "sortField": "GRNID",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ToStoreId",
          "fieldValue": "2",
          "opType": "Equals"
        },
    {
          "fieldName": "From_Dt ",
          "fieldValue": "2024-01-01",
          "opType": "Equals"
        },
    {
          "fieldName": "To_Dt",
          "fieldValue": "2025-01-01",
          "opType": "Equals"
        },
    {
          "fieldName": "IsPaymentProcess ",
          "fieldValue": "0",
          "opType": "Equals"
        },
    {
          "fieldName": "Supplier_Id",
          "fieldValue": "1",
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }

    console.log(vdata)
    this._SupplierPaymentStatusService.getSupplierPayStatusList(vdata).subscribe((data) =>{
      this.dsSupplierpayList.data = data.data as SupplierPayStatusList[];
      console.log(this.dsSupplierpayList)
      this.dsSupplierpayList.sort =this.sort;
      this.dsSupplierpayList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  } 

  tableElementChecked(event, element) {
    this.vSupplierName = element.SupplierName;
    this.vInvoiceNo =  element.InvoiceNo;
    this.GRNID =  element.GRNID;
    if (event.checked) {
      console.log(element) 
      this.SelectedList.push(element)
      this.vNetAmount += element.NetAmount
      this.vPaidAmount += element.PaidAmount
      this.vBalanceAmount += element.BalAmount 
    }
    else{
      this.vNetAmount -= element.NetAmount
      this.vPaidAmount -= element.PaidAmount
      this.vBalanceAmount -= element.BalAmount
    }
    console.log(this.SelectedList) 
  }

  OnSave() {
    if ((this.vBalanceAmount < 0)) {
      this.toastr.warning('Please select Check Box', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    let grnHeaderPayStatus = [];
    this.SelectedList.forEach((element) => {
      let grnHeaderPayStatusObj = {};
      grnHeaderPayStatusObj['grnId'] = element.GRNID || 0;
      grnHeaderPayStatusObj['paidAmount'] = this.vPaidAmount || 0;
      grnHeaderPayStatusObj['balAmount'] =  this.vBalanceAmount  || 0;
      grnHeaderPayStatus.push(grnHeaderPayStatusObj);
    });

    let SupPayDetPayStatus = [];
    this.SelectedList.forEach((element) => {
      let SupPayDetPayStatusObj = {};
      SupPayDetPayStatusObj['supPayId'] = 0
      SupPayDetPayStatusObj['supGrnId'] = element.GRNID || 0;
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
      console.log(result)

      let submitData = {
        'tgrnHeaderPayStatus': grnHeaderPayStatus,
        'tSupPayDetPayStatus': SupPayDetPayStatus,
        'tgrNsupppayInsert': result.submitDataPay.ipPaymentInsert
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
  onClear(){

  }
  OnReset(){
    this.getSupplierList();
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
  getSupplierPaymentReport(){
    
  }
}

export class SupplierPayStatusList{
  GRNNo: any;
  SupplierName: string;
  GRNDate: number;
  InvoiceNo: number;
  NetAmount: any;
  PaidAmount: any;
  BalAmount: any;
  InvDate:any;
  Mobile:any;
  GRNID:any;

  grnNumber:any;
  grnTime:any;
  supplierName:any;
  invoiceNo:any;
  netAmount:any;
  paidAmount:any;
  balAmount:any;
  invDate:any;

  
constructor(SupplierPayStatusList){
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

    this.grnNumber= SupplierPayStatusList.grnNumber || 0;
    this.grnTime= SupplierPayStatusList.grnTime || 0;
    this.supplierName= SupplierPayStatusList.supplierName || 0;
    this.invoiceNo= SupplierPayStatusList.invoiceNo || 0;
    this.netAmount= SupplierPayStatusList.netAmount || 0;
    this.paidAmount= SupplierPayStatusList.paidAmount || 0;
    this.balAmount= SupplierPayStatusList.balAmount || 0;
    this.invDate= SupplierPayStatusList.invDate || 0;
  }
}
}
