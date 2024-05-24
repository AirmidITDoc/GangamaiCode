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

@Component({
  selector: 'app-sales-return-bill-settlement',
  templateUrl: './sales-return-bill-settlement.component.html',
  styleUrls: ['./sales-return-bill-settlement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SalesReturnBillSettlementComponent implements OnInit {

  displayedColumnsPaid = [
    'SalesDate',
    'PillNo',
    'RegNo',
    'BillAmt',
    'conAmount',
    'NetPayAmount',
    'PaidAmount',
    'BalanceAmt',
    'RefundAmt', 
  ];
  displayedColumnsCredit = [
    'SalesDate',
    'PillNo',
    'RegNo',
    'BillAmt',
    'conAmount',
    'NetPayAmount',
    'PaidAmount',
    'BalanceAmt',
    'RefundAmt', 
    'FinalAmt'
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

  dsPaidItemList = new MatTableDataSource<PaidItemList>();
  dsCredititemList = new MatTableDataSource<CreditItemList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('Secondpaginator', { static: true }) public Secondpaginator: MatPaginator;
  
  constructor(
    public _SelseSettelmentservice: SalesReturnBillSettlementService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    
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
  getSelectedObjRegIP(obj) {
    console.log(obj)
    this.DoctorNamecheck = true;
    this.IPDNocheck = true;
    this.OPDNoCheck = false;
    this.registerObj = obj;
    this.PatientName = obj.FirstName + ' ' + obj.LastName;
    this.RegId = obj.RegID;
    this.OP_IP_Id = this.registerObj.AdmissionID;
    this.IPDNo = obj.IPDNo;
    this.RegNo =obj.RegNo;
    this.DoctorName = obj.DoctorName;
    this.TariffName =obj.TariffName
    this.CompanyName = obj.CompanyName 
  }
  OPDNo:any;
  OP_IPType:any;
  DoctorNamecheck:boolean=false;
  IPDNocheck:boolean=false;
  OPDNoCheck:boolean=false;
  vFinalPaidAmount:any;
  vFinalNetAmount:any;
  vFinalBalAmount:any;
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
      this._SelseSettelmentservice.ItemSubform.get('PatientName').clearValidators();
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').updateValueAndValidity();
      this._SelseSettelmentservice.ItemSubform.get('PatientName').updateValueAndValidity();
    }
    else if (event.value == 'IP') {
      this.OP_IPType = 1;
      this.RegId = ""; 
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').clearValidators();
      this._SelseSettelmentservice.ItemSubform.get('PatientName').clearValidators();
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').updateValueAndValidity();
      this._SelseSettelmentservice.ItemSubform.get('PatientName').updateValueAndValidity();
    } else {
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').reset();
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').setValidators([Validators.required]);
      this._SelseSettelmentservice.ItemSubform.get('MobileNo').enable();
      this._SelseSettelmentservice.ItemSubform.get('PatientName').reset();
      this._SelseSettelmentservice.ItemSubform.get('PatientName').setValidators([Validators.required]);
      this._SelseSettelmentservice.ItemSubform.get('PatientName').enable();
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
  getRefSearchList() {
    var m_data = {
      "Keyword": `${this._SelseSettelmentservice.userFormGroup.get('RegID').value}%`
    }
    if (this._SelseSettelmentservice.userFormGroup.get('RegID').value.length >= 1) {
      this._SelseSettelmentservice.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData)
        this.PatientListfilteredOptionsref = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }
  getOptionTextref(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.PatientName + ' (' + option.RegID + ')';
  }
  getSelectedObj(obj) {
    console.log(obj)
    this.vRegNo = obj.RegNo;
    this.vPatienName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
    this.vAdmissionDate = obj.AdmissionDate;
    this.vMobileNo = obj.MobileNo;
    this.vAdmissionID = obj.AdmissionID;
    this.vIPDNo = obj.IPDNo  
  } 
  
  getSalesList(obj) {
    this.sIsLoading = 'loading';
    var m_data = {
      "AdmissionId": obj.AdmissionId
    }
    console.log(m_data)
    setTimeout(() => {
      this.sIsLoading = 'loading';
      this._SelseSettelmentservice.getSalesList(m_data).subscribe(Visit => {
        this.dsPaidItemList.data = Visit as PaidItemList[];
        console.log(this.dsPaidItemList.data)
        this.dsPaidItemList.sort = this.sort;
        this.dsPaidItemList.paginator = this.Secondpaginator; 
      },
        error => {
          this.sIsLoading = this.dsPaidItemList.data.length == 0 ? 'no-data' : '';
        });
    }, 500);

  }
  TotalAdvamt: any;
  Advavilableamt: any;
  vadvanceAmount: any;
  vPatientType: any;
  getAdvancetotal(element) {
    let netAmt;
    netAmt = element.reduce((sum, { AdvanceAmount }) => sum += +(AdvanceAmount || 0), 0);
    this.TotalAdvamt = netAmt;
    return netAmt;
  }

  getAdvavilable(element) {
    let netAmt;
    netAmt = element.reduce((sum, { BalanceAmount }) => sum += +(BalanceAmount || 0), 0);
    this.Advavilableamt = netAmt;
    return netAmt;
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
  OnSave() {
    
  } 
  onClose() {
    this._matDialog.closeAll();
    this.OnReset();
  }
  OnReset() {
    this._SelseSettelmentservice.ItemSubform.reset(); 
    this.dsPaidItemList.data = [];
    this.dsCredititemList.data =[];
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

