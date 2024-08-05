import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SalesReturnBillSettlementService } from './sales-return-bill-settlement.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { Validators } from '@angular/forms';
import { IpPaymentInsert, IPpaymentWithadvanceComponent } from 'app/main/ipd/ip-settlement/ippayment-withadvance/ippayment-withadvance.component';
import { ToastrService } from 'ngx-toastr';
import { DiscountAfterFinalBillComponent } from './discount-after-final-bill/discount-after-final-bill.component';

@Component({
  selector: 'app-sales-return-bill-settlement',
  templateUrl: './sales-return-bill-settlement.component.html',
  styleUrls: ['./sales-return-bill-settlement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SalesReturnBillSettlementComponent implements OnInit {

  displayedColumnsPaid = [
    'button',
    'SalesDate',
    'PillNo',
    'RegNo',
    'CompanyName',
    'BillAmt',
    'conAmount',
    'NetPayAmount',
    'PaidAmount',
    'BalanceAmt',
    'action', 
  ];
 

  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;
  isRegIdSelected: boolean = false;
  PatientListfilteredOptionsref: any;
  noOptionFound: any;
  filteredOptions: any; 
  vRegNo: any;
  vPatienName: any;
  vMobileNo: any;
  vAdmissionDate: any;
  vAdmissionID: any;
  vIPDNo: any;
  PatientListfilteredOptionsOP:any;
  PatientListfilteredOptionsIP:any;
  RegNo:any;
  IPDNo:any; 
  TariffName:any;
  CompanyName:any;
  registerObj:any;
  PatientName:any;
  RegId:any;
  OP_IP_Id:any;
  DoctorName:any;
  RoomName:any;
  BedName:any;
  Age:any;
  GenderName:any;
  OPDNo:any;
  OP_IPType:any;
  DoctorNamecheck:boolean=false;
  IPDNocheck:boolean=false;
  OPDNoCheck:boolean=false;
  vFinalPaidAmount:any;
  vFinalNetAmount:any;
  vFinalBalAmount:any;
  dsPaidItemList = new MatTableDataSource<PaidItemList>(); 

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('Secondpaginator', { static: true }) public Secondpaginator: MatPaginator;
  
  constructor(
    public _SelseSettelmentservice: SalesReturnBillSettlementService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    public toastr: ToastrService,
  ) { }
  vPharExtOpt:any ;
  vPharOPOpt: any ;
  vPharIPOpt: any ; 
  vSelectedOption: any= '';

  vCondition:boolean=false;
  vConditionExt:boolean=false;
  vConditionIP:boolean=false;

  ngOnInit(): void {  
    this.vPharExtOpt = this._loggedService.currentUserValue.user.pharExtOpt;
    this.vPharOPOpt = this._loggedService.currentUserValue.user.pharOPOpt;
    this.vPharIPOpt = this._loggedService.currentUserValue.user.pharIPOpt;
 
    if (this.vPharExtOpt == true) {  
        this.vSelectedOption = 'External'; 
    }else{
      this.vPharOPOpt = true
    }

    if (this.vPharIPOpt == true) { 
      if(this.vPharOPOpt == false){ 
        this.vSelectedOption = 'IP'; 
      }  
    }else{
      this.vConditionIP = true
    } 
    if (this.vPharOPOpt == true) {
      if (this.vPharExtOpt == false) {  
        this.vSelectedOption = 'OP'; 
      }
    } else{
      this.vCondition = true
    } 
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getSearchListIP() {
    var m_data = {
      "Keyword": `${this._SelseSettelmentservice.ItemSubform.get('RegID').value}%`
    }
    if (this._SelseSettelmentservice.ItemSubform.get('PatientType').value == 'OP'){
      if (this._SelseSettelmentservice.ItemSubform.get('RegID').value.length >= 1) {
        this._SelseSettelmentservice.getPatientVisitedListSearch(m_data).subscribe(resData => {
          this.filteredOptions = resData;
          this.PatientListfilteredOptionsOP = resData;
           console.log(resData);
          if (this.filteredOptions.length == 0) {
            this.noOptionFound = true;
          } else {
            this.noOptionFound = false;
          } 
        });
      }
    }else if (this._SelseSettelmentservice.ItemSubform.get('PatientType').value == 'IP') {
      if (this._SelseSettelmentservice.ItemSubform.get('RegID').value.length >= 1) {
        this._SelseSettelmentservice.getAdmittedPatientList(m_data).subscribe(resData => {
          this.filteredOptions = resData;
          // console.log(resData);
          this.PatientListfilteredOptionsIP = resData;
          if (this.filteredOptions.length == 0) {
            this.noOptionFound = true;
          } else {
            this.noOptionFound = false;
          }
        });
      }
    }
  //  this.saleSelectedDatasource.data = [];
   this.PatientInformRest();
  } 
  getSelectedObjRegIP(obj) {
    console.log(obj)
    this.DoctorNamecheck = true;
    this.IPDNocheck = true;
    this.OPDNoCheck = false;
    this.registerObj = obj;
    this.PatientName = obj.FirstName + ' ' + obj.LastName;
    this.RegId = obj.RegID;
    this.vAdmissionDate = obj.AdmissionDate;
    this.OP_IP_Id = this.registerObj.AdmissionID;
    this.IPDNo = obj.IPDNo;
    this.RegNo =obj.RegNo;
    this.DoctorName = obj.DoctorName;
    this.TariffName =obj.TariffName
    this.CompanyName = obj.CompanyName 
    this.RoomName = obj.RoomName;
    this.BedName = obj.BedName
    this.GenderName = obj.GenderName
    this.Age = obj.Age 
    this.getIpSalesList();
  }

  getSelectedObjOP(obj) {
    console.log(obj)
    this.OPDNoCheck = true;
    this.DoctorNamecheck = false;
    this.IPDNocheck = false;
    this.registerObj = obj;
    this.PatientName = obj.FirstName + " " + obj.LastName;
    this.RegId = obj.RegId;
    this.OP_IP_Id  = obj.VisitId;
    this.RegNo =obj.RegNo; 
    this.OPDNo = obj.OPDNo;
    this.CompanyName = obj.CompanyName;
    this.TariffName = obj.TariffName;  
    this.GenderName = obj.GenderName
    this.Age = obj.AgeYear 
    this.getIpSalesList();
  }
  getOptionTextOp(option) {
    if (!option)
      return '';
    return option.FirstName + ' ' + option.MiddleName + ' ' + option.LastName; 
  }
  getOptionTextIP(option) {
    if (!option)
      return '';
    return option.FirstName + ' ' + option.MiddleName + ' ' + option.LastName;

  }
  PatientInformRest(){
    this.PatientName = ''  
    this.IPDNo =  ''
    this.RegNo = ''
    this.DoctorName =  ''
    this.TariffName = ''
    this.CompanyName =''
    this.OPDNo = ''
  }
  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.OP_IPType = 0;
      this.RegId = ""; 
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').clearValidators(); 
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').updateValueAndValidity(); 
      this.PatientInformRest();
      this._SelseSettelmentservice.ItemSubform.get('RegID').setValue('');
    }
    else if (event.value == 'IP') {
      this.OP_IPType = 1;
      this.RegId = ""; 
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').clearValidators(); 
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').updateValueAndValidity(); 
      this.PatientInformRest();
      this._SelseSettelmentservice.ItemSubform.get('RegID').setValue('');
    } else {
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').reset();
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').setValidators([Validators.required]);
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').enable(); 
      this._SelseSettelmentservice.ItemSubform.updateValueAndValidity(); 
      this.OP_IPType = 2; 
    }
  }
 
  @ViewChild('doctorname') doctorname: ElementRef;
  @ViewChild('mobileno') mobileno: ElementRef; 
  @ViewChild('patientname') patientname: ElementRef;

  public onEntermobileno(event): void {
    if (event.which === 13) { 
      this.patientname.nativeElement.focus();
    }
  }
  public onEnterpatientname(event): void {
    if (event.which === 13) {
      // this.itemid.nativeElement.focus();
      this.doctorname.nativeElement.focus();
    }
  }
  public onEnterDoctorname(event): void {
    if (event.which === 13) {
     // this.address.nativeElement.focus();
    }
  }
   
  getIpSalesList() {  
    let OP_IP_Type
    if (this.vSelectedOption == 'OP') {
      OP_IP_Type = 0;
    }
    else if (this.vSelectedOption == 'IP') {
      OP_IP_Type = 1;
    } else {
      OP_IP_Type = 2;
    } 
    this.sIsLoading = 'loading-data'; 
    var m_data = {
      "RegId": this.RegId,
      "OP_IP_ID": this.OP_IP_Id,
      "OP_IP_Type":OP_IP_Type
    }
    console.log(m_data)
    this._SelseSettelmentservice.getSalesList(m_data).subscribe(Visit => {
      this.dsPaidItemList.data = Visit as PaidItemList[];
      console.log(this.dsPaidItemList.data)
      this.dsPaidItemList.sort = this.sort;
      this.dsPaidItemList.paginator = this.Secondpaginator; 
      this.sIsLoading = ''; 
    },
      error => {
        this.sIsLoading = '';
      });
  } 
  isLoading123 = false;
  BalanceAm1:any= 0;
  UsedAmt1:any =0;
  OnPayment(contact) { 
    
    this.isLoading123 = true; 
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    console.log(contact)
    let PatientHeaderObj = {}; 
    
    PatientHeaderObj['Date'] = formattedDate;
    PatientHeaderObj['PatientName'] = this.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = contact.OP_IP_ID;
    PatientHeaderObj['AdvanceAmount'] = contact.BalanceAmount; 
    PatientHeaderObj['NetPayAmount'] = contact.BalanceAmount;
    PatientHeaderObj['BillNo'] = contact.SalesId;
    PatientHeaderObj['IPDNo'] = this.IPDNo;
    PatientHeaderObj['RegNo'] = this.RegNo; 
    PatientHeaderObj['OP_IP_Type'] = contact.OP_IP_Type; 
    const dialogRef = this._matDialog.open(IPpaymentWithadvanceComponent,
      {
        maxWidth: "95vw",
        height: '650px',
        width: '85%',
        data: {
          advanceObj: PatientHeaderObj,
          FromName: "IP-Pharma-SETTLEMENT"
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)

      if (result.IsSubmitFlag == true) {
        let updateBillobj = {};
        updateBillobj['salesID'] = contact.SalesId;
        updateBillobj['salRefundAmt'] =0 ;
        updateBillobj['balanceAmount'] = result.BalAmt || 0 ;// result.submitDataPay.ipPaymentInsert.balanceAmountController //result.BalAmt;
 

        let UpdateAdvanceDetailarr1: IpPaymentInsert[] = []; 
    
         UpdateAdvanceDetailarr1 = result.submitDataAdvancePay; 

        let UpdateAdvanceDetailarr = [];
       0;
        if (result.submitDataAdvancePay.length > 0) {
          result.submitDataAdvancePay.forEach((element) => {
            let update_T_PHAdvanceDetailObj = {};
            update_T_PHAdvanceDetailObj['AdvanceDetailID'] = element.AdvanceDetailID;
            update_T_PHAdvanceDetailObj['UsedAmount'] = element.UsedAmount;
            this.UsedAmt1 = (this.UsedAmt1 + element.UsedAmount);
            update_T_PHAdvanceDetailObj['BalanceAmount'] = element.BalanceAmount;
            this.BalanceAm1 =(this.BalanceAm1 + element.BalanceAmount);
            UpdateAdvanceDetailarr.push(update_T_PHAdvanceDetailObj);
          }); 
        }
        else {
          let update_T_PHAdvanceDetailObj = {};
          update_T_PHAdvanceDetailObj['AdvanceDetailID'] = 0,
          update_T_PHAdvanceDetailObj['UsedAmount'] = 0,
          update_T_PHAdvanceDetailObj['BalanceAmount'] = 0,
            UpdateAdvanceDetailarr.push(update_T_PHAdvanceDetailObj);
        }
     
        let update_T_PHAdvanceHeaderObj = {};
        if (result.submitDataAdvancePay.length > 0) { 
          update_T_PHAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceId'],
          update_T_PHAdvanceHeaderObj['AdvanceUsedAmount'] =this.UsedAmt1 ,
          update_T_PHAdvanceHeaderObj['BalanceAmount'] = this.BalanceAm1
        }
        else { 
          update_T_PHAdvanceHeaderObj['AdvanceId'] = 0,
          update_T_PHAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
          update_T_PHAdvanceHeaderObj['BalanceAmount'] = 0
        }

        let Data = {
          "salesPaymentSettlement": result.submitDataPay.ipPaymentInsert, 
          "update_Pharmacy_BillBalAmountSettlement": updateBillobj,
          "update_T_PHAdvanceDetailSettlement":UpdateAdvanceDetailarr,
          "update_T_PHAdvanceHeaderSettlement":update_T_PHAdvanceHeaderObj
        };
        console.log(Data);

        this._SelseSettelmentservice.InsertSalessettlement(Data).subscribe(response => { 
          if (response) {  
            this.toastr.success('Sales Credit Payment Successfully !', 'Success', {
              toastClass: 'tostr-tost custom-toast-error',
            });
            this._matDialog.closeAll();  
            this.getIpSalesList(); 
          }
          else { 
            this.toastr.error('Sales Credit Payment  not saved !', 'error', {
              toastClass: 'tostr-tost custom-toast-error',
            }); 
          }
        });
        this.isLoading123 = false; 
      } 
    
    });
    
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  } 
  onClose() {
    this._matDialog.closeAll();
    this.OnReset();
    this.isLoading123 = false; 
  }
  OnReset() {
    this._SelseSettelmentservice.ItemSubform.reset(); 
    this.dsPaidItemList.data = []; 
    this.PatientInformRest();  
  }
  getDiscFinalBill(contact){  
    console.log(contact)
    let PatientInfo = this.registerObj
    const dialogRef = this._matDialog.open(DiscountAfterFinalBillComponent,
      {
        maxWidth: "100%",
        height: '72%',
        width: '60%',
        data: {
          Obj:contact,PatientInfo
        } 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result); 
      this.getIpSalesList();
    });
  } 
}
  export class PaidItemList {
  
    SalesDate: number;
    PillNo: number;
    RegNo: number;
    BillAmt: any;
    conAmount: any;
    NetPayAmount: any;
    PaidAmount: number;
    BalanceAmt: number;
    RefundAmt: any; 
  
    constructor(PaidItemList) {
      { 
        this.SalesDate = PaidItemList.SalesDate || 0;
        this.PillNo = PaidItemList.PillNo || 0;
        this.RegNo = PaidItemList.RegNo || 0;
        this.BillAmt = PaidItemList.BillAmt || 0;
        this.conAmount = PaidItemList.conAmount || 0;
        this.NetPayAmount = PaidItemList.NetPayAmount || 0;
        this.PaidAmount = PaidItemList.PaidAmount || 0;
        this.BalanceAmt = PaidItemList.BalanceAmt || 0; 
      }
    }
  }
  export class CreditItemList {
  
    SalesDate: number;
    PillNo: number;
    RegNo: number;
    BillAmt: any;
    conAmount: any;
    NetPayAmount: any;
    PaidAmount: number;
    BalanceAmt: number;
    RefundAmt: any;
    FinalAmt:any; 
  
    constructor(CreditItemList) {
      { 
        this.SalesDate = CreditItemList.SalesDate || 0;
        this.PillNo = CreditItemList.PillNo || 0;
        this.RegNo = CreditItemList.RegNo || 0;
        this.BillAmt = CreditItemList.BillAmt || 0;
        this.conAmount = CreditItemList.conAmount || 0;
        this.NetPayAmount = CreditItemList.NetPayAmount || 0;
        this.PaidAmount = CreditItemList.PaidAmount || 0;
        this.BalanceAmt = CreditItemList.BalanceAmt || 0;
        this.FinalAmt = CreditItemList.FinalAmt || 0;  
      }
    }
  }

