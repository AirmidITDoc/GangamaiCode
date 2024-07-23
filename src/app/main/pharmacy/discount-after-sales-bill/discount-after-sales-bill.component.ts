import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DiscountAfterSalesBillService } from './discount-after-sales-bill.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-discount-after-sales-bill',
  templateUrl: './discount-after-sales-bill.component.html',
  styleUrls: ['./discount-after-sales-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DiscountAfterSalesBillComponent implements OnInit {

  displayedColumns = [
    'button',
    'SalesDate',
    'PillNo',
    'RegNo',
    'CompanyName',
    'BillAmt',
    'conAmount',
    'NetPayAmount',
    'RefundAmt',
    'PaidAmount',
    'BalanceAmt',
    'discPer',
    'PreDiscAmt',
    // 'action', 
  ];
  
 
    sIsLoading: string = '';
    isLoading = true;
    isRegIdSelected:boolean=false;
    PatientListfilteredOptions: any; 
    noOptionFound:any;
    filteredOptions:any;  
    screenFromString = 'admission-form';
    chargeslist: any = []; 
    dateTimeObj: any;
    vRegNo:any;
    vPatientName:any;
    vMobileNo:any;
    vAdmissionDate:any;
    vReturnQty:any;
    vItemName:any;
    vRegId:any;
    vAdmissionID:any;  
    FinalBalAmt:any;
    vFinalPaidAmt:any=0;
    vSalesID:any;
    vOP_IP_Id:any;
    vOP_IP_Type:any;  
    vFinalNetAmount:any=0;
    vFinalBalAmt:any=0;
    vRegID:any;
    vIPDNo:any; 
    vTariffName:any;
    vCompanyName:any; 
    vDoctorName:any;
    vRoomName:any;
    vBedName:any;
    vAge:any;
    vGenderName:any;  

     dsIpSaleItemList = new MatTableDataSource<ItemList>();  

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  
    constructor(
      public _DiscAftSalesBillService: DiscountAfterSalesBillService,
      public _matDialog: MatDialog,
      private _fuseSidebarService: FuseSidebarService,
      public datePipe: DatePipe,
      private accountService: AuthenticationService,
      public toastr: ToastrService,
    ) { }
    
    ngOnInit(): void {  
    }
     
    getDateTime(dateTimeObj) {
      // console.log('dateTimeObj==', dateTimeObj);
      this.dateTimeObj = dateTimeObj;
    }
    getSearchList() {
      var m_data = {
        "Keyword": `${this._DiscAftSalesBillService.SearchGroupForm.get('RegID').value}%`
      }
      if (this._DiscAftSalesBillService.SearchGroupForm.get('RegID').value.length >= 1) {
        this._DiscAftSalesBillService.getAdmittedpatientlist(m_data).subscribe(resData => {
          this.filteredOptions = resData;
          console.log(resData)
          this.PatientListfilteredOptions = resData;
          if (this.filteredOptions.length == 0) {
            this.noOptionFound = true;
          } else {
            this.noOptionFound = false;
          } 
        });
      } 
    } 
    getOptionText(option) {
      if (!option) return '';
      return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
    } 
    getSelectedObj(obj){
      console.log(obj)
     this.vRegNo = obj.RegNo;
     this.vPatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.PatientName;
     this.vAdmissionDate = obj.AdmissionDate;
     this.vMobileNo = obj.MobileNo; 
     this.vAdmissionID = obj.AdmissionID;
     this.vRegId = obj.RegID;
     this.vIPDNo = obj.IPDNo; 
     this.vDoctorName = obj.DoctorName;
     this.vTariffName =obj.TariffName
     this.vCompanyName = obj.CompanyName 
     this.vRoomName = obj.RoomName;
     this.vBedName = obj.BedName
     this.vGenderName = obj.GenderName
     this.vAge = obj.Age  
     this.getIpSalesList();
    } 
    getIpSalesList() {   
      this.sIsLoading = 'loading-data'; 
      var m_data = {
        "RegId": this.vRegId,
        "OP_IP_ID": this.vAdmissionID,
        "OP_IP_Type":1
      }
      console.log(m_data)
      this._DiscAftSalesBillService.getSalesList(m_data).subscribe(Visit => {
        this.dsIpSaleItemList.data = Visit as ItemList[];
        console.log(this.dsIpSaleItemList.data)
        this.dsIpSaleItemList.sort = this.sort;
        this.dsIpSaleItemList.paginator = this.paginator; 
        this.sIsLoading = ''; 
      },
        error => {
          this.sIsLoading = '';
        });
    } 
    SelectedArray: any = [];
    tableElementChecked(event, element) { 
      if (event.checked) {
        console.log(element) 
        element.PaidAmount =  element.BalanceAmount;
        element.BalanceAmount = 0;
        this.vFinalNetAmount = (parseFloat(this.vFinalNetAmount) + parseFloat(element.NetAmount)).toFixed(2);
        this.vFinalBalAmt = (parseFloat(this.vFinalBalAmt) + parseFloat(element.BalanceAmount)).toFixed(2);
        this.vFinalPaidAmt = (parseFloat(this.vFinalPaidAmt) + parseFloat(element.PaidAmount)).toFixed(2); 
       
      }
      else{ 
        this.vFinalNetAmount = (parseFloat(this.vFinalNetAmount) - parseFloat(element.NetAmount)).toFixed(2);
        this.vFinalBalAmt = (parseFloat(this.vFinalBalAmt) - parseFloat(element.BalanceAmount)).toFixed(2);
        this.vFinalPaidAmt = (parseFloat(this.vFinalPaidAmt) - parseFloat(element.PaidAmount)).toFixed(2); 
        element.BalanceAmount =  element.PaidAmount;
        element.PaidAmount = 0;
      }
      //console.log(this.SelectedArray) 
    } 
  getCellCalculation(contact, discPer) {
    debugger 
    if (parseInt(contact.discPer) >= 100 ) {
      this.toastr.warning('Discount cannot be greater than 100%', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      contact.discPer = '';
    } 
    else if(contact.discPer > 0) { 
      let finaldiscAmt = (parseFloat(contact.discPer) * parseFloat(contact.TotalAmount) / 100).toFixed(2);
      let TotaldiscAmt =  (parseFloat(contact.DiscAmount) + parseFloat(finaldiscAmt)).toFixed(2);
      contact.DiscAmount =  TotaldiscAmt ;  

      contact.NetAmount = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount)).toFixed(2);  
      contact.BalanceAmount = contact.NetAmount ; 
    }
    else if(contact.discPer == '0' || contact.discPer == '' || contact.discPer == null || contact.discPer == undefined){
       
      contact.DiscAmount =  contact.PreDiscAmt ;  

      contact.NetAmount = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount)).toFixed(2);  
      contact.BalanceAmount = contact.NetAmount ; 
    }
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
    
    vcheckreturnQty:any=''; 
    savebtn:boolean=false;
    onSave() {
    //   if ((this.vRegID == '' || this.vRegID == null || this.vRegID == undefined)) {
    //     this.toastr.warning('Please select patient', 'Warning !', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    //   }
    //   if ((!this.dsIpSaleItemList.data.length)) {
    //     this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    //   }
    //   const isCheckReturnQty = this.dsIpSaleItemList.data.some(item => item.ReturnQty === this.vcheckreturnQty);
    //   if(!isCheckReturnQty){
    //   if (this._DiscAftSalesBillService.SearchGroupForm.get('TypeodPay').value == 'CashPay') {
    //     this.onCashPaySave();
    //   } else {
    //     this.onCreditPaySave();
    //   }
    // }
    // else{
    //   this.toastr.warning('Please enter ReturnQty Without ReturnQty Cannot perform save operation.', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-error',
    //   }); 
    // }
    }
   
    OnReset() {
      this._DiscAftSalesBillService.SearchGroupForm.reset();
      this._DiscAftSalesBillService.IPFinalform.reset();
      this.dsIpSaleItemList.data = [];
      this.chargeslist = [];
      this.vRegNo = '';
      this.vPatientName = '';
      this.vAdmissionID = '';
      this.vAdmissionDate = ''; 
      this.vRegId ='';
      this.vIPDNo = ''; 
      this.vDoctorName =  '';
      this.vTariffName =  '';
      this.vCompanyName =  '';
      this.vRoomName =  '';
      this.vBedName =  '';
      this.vGenderName =  '';
      this.vAge =  '';
      this._DiscAftSalesBillService.SearchGroupForm.get('Op_ip_id').setValue('1');
    }
  
    onClear() {
  
    } 
  } 
  export class  ItemList {
  
    SalesDate: number;
    PillNo: number;
    RegNo: number;
    BillAmt: any;
    conAmount: any;
    NetPayAmount: any;
    PaidAmount: number;
    BalanceAmt: number;
    RefundAmt: any; 
  
    constructor(ItemList) {
      { 
        this.SalesDate = ItemList.SalesDate || 0;
        this.PillNo = ItemList.PillNo || 0;
        this.RegNo = ItemList.RegNo || 0;
        this.BillAmt = ItemList.BillAmt || 0;
        this.conAmount = ItemList.conAmount || 0;
        this.NetPayAmount = ItemList.NetPayAmount || 0;
        this.PaidAmount = ItemList.PaidAmount || 0;
        this.BalanceAmt = ItemList.BalanceAmt || 0; 
      }
    }
  }
  // <!-- (keyup)="getTotalAmount(contact)" -->