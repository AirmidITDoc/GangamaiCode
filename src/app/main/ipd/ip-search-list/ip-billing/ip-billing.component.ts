import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AdvanceDetailObj, ChargesList } from '../ip-search-list.component';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { ILookup } from 'app/main/opd/op-search-list/op-billing/op-billing.component';
import { ReportPrintObj } from '../../ip-bill-browse-list/ip-bill-browse-list.component';
import { IPSearchListService } from '../ip-search-list.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { DatePipe } from '@angular/common';
import { debounceTime, map, startWith, takeUntil } from 'rxjs/operators';
import { IPAdvancePaymentComponent, IpPaymentInsert } from '../ip-advance-payment/ip-advance-payment.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { MatDrawer } from '@angular/material/sidenav';
import { MatAccordion } from '@angular/material/expansion';
import * as converter from 'number-to-words';
import { InterimBillComponent } from '../interim-bill/interim-bill.component';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { IpdAdvanceBrowseModel } from '../../browse-ipadvance/browse-ipadvance.component';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { debug } from 'console';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { ToastrService } from 'ngx-toastr';
import { forEach } from 'lodash';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { IpPaymentwithAdvanceComponent } from '../ip-paymentwith-advance/ip-paymentwith-advance.component';
import { IPpaymentWithadvanceComponent } from '../../ip-settlement/ippayment-withadvance/ippayment-withadvance.component';
import { PrebillDetailsComponent } from './prebill-details/prebill-details.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ConfigService } from 'app/core/services/config.service';
import { query } from '@angular/animations';
import { OpPackageBillInfoComponent } from 'app/main/opd/OPBilling/new-opbilling/op-package-bill-info/op-package-bill-info.component';
import { element } from 'protractor';


@Component({
  selector: 'app-ip-billing',
  templateUrl: './ip-billing.component.html',
  styleUrls: ['./ip-billing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPBillingComponent implements OnInit {
  displayedColumns = [
    'checkbox',
    'IsCheck',
    'ChargesDate',
    'ServiceName',
    'Price',
    'EdiPrice',
    'Qty',
    'EditQty',
    'TotalAmt',
    'DiscPer',
    'DiscAmt',
    'NetAmount', 
    'DoctorName', 
    'ClassName',
    'ChargesAddedName',
    'buttons', 
  ]; 
  tableColumns = [  
    'ServiceName',
    'Price',
    'UserName',
    'BillDate',
    'Action', 
  ]; 
  PrevBillColumns = [
    'BDate',
    'PBillNo',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'BalanceAmt',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'AdvanceUsedAmount',
    'Action'
  ]; 
  AdvDetailColumns = [
    'Date',
    'AdvanceNo',
    'AdvanceAmount',
    'UsedAmount',
    'BalanceAmount',
    'RefundAmount',
    'Reason',
    'IsCancelled',
    'UserName',
    'Action'
  ];
  PackageBillColumns = [ 
    'IsCheck',
    'ServiceNamePackage',
    'ServiceName',
    'Price',
    'Qty',
    'TotalAmt', 
    'DiscAmt',
    'NetAmount', 
   // 'DoctorName',  
  ];

  Ipbillform: FormGroup;
  Serviceform: FormGroup;
  isClasselected: boolean = false;
  isSrvcNameSelected: boolean = false;
  isDoctorSelected: boolean = false;
  filteredOptionsBillingClassName: Observable<string[]>;

  BillDiscperFlag: boolean = false;  
  vGenbillflag: boolean = false
  IntreamFinal: any;
  sIsLoading: string = '';
  showTable: boolean;
  msg: any;
  chargeslist: any = [];
  chargeslist1: any = [];
  vDoctorID: any = 0;
  currentDate: Date = new Date();
  chkDiscflag: boolean = false;
  selectDate: Date = new Date();
  filteredDoctor: any;
  noOptionFoundsupplier: any;
  vClassId: any = 0;
  vClassName: any;
  vService:any;
  vAdminPer:any;
  vAdminAmt:any;


  dataSource = new MatTableDataSource<ChargesList>();
  dataSource1 = new MatTableDataSource<ChargesList>();
  prevbilldatasource = new MatTableDataSource<Bill>();
  advancedatasource = new MatTableDataSource<IpdAdvanceBrowseModel>();
  PackageDatasource = new MatTableDataSource<ChargesList>();

  myControl = new FormControl(); 
  filteredOptions: any;
  billingServiceList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  private lookups: ILookup[] = [];
  private nextPage$ = new Subject();
  ConcessionReasonList: any = [];
  CashCounterList: any = [];

  vCashCounterID: any;
  disamt: any;
  vPrice = '0';
  vQty = '1';
  vServiceTotalAmt = '0';
  vServiceNetAmt = '0';
  FinalAmountpay = 0;
  vServiceDisAmt: any;
  b_DoctorName = '';
  b_traiffId = '';
  b_isPath = '';
  b_isRad = '';
  b_IsEditable = '';
  b_IsDocEditable = '';
  dateTimeObj: any;
  isCashCounterSelected:boolean=false;
  // ConAmt: any;
  DoctornewId: any;
  concessionAmtOfNetAmt: any = 0;
  PharmacyAmont: any = 0;
  // finalAmt: any;
  isExpanded: boolean = false;
  SrvcName: any;
  totalAmtOfNetAmt: any = 0;
  interimArray: any = [];
  vServiceDiscPer: any;
  serviceId: number;
  serviceName: String;
  totalAmt: number;
  paidAmt: number;
  balanceAmt: number;
  netAmt: number;
  discAmt: number;
  Price: any;
  Qty: any;
  TotalAmt: any;
  DiscAmt: any;
  NetAmount: any;
  ChargeDoctorName: string;
  ClassName: any;
  ChargesAddedName: any;
  totalAmount: any;
  discAmount: any;
  screenFromString = 'IP-billing';
  ChargesDoctorname: any;
  isLoadingStr: string = '';
  BalanceAmt: any;
  paidamt: any;
  balanceamt: any;
  IsCredited: boolean;
  flagSubmit: boolean;
  Adminamt: any;
  Adminper: any;
  FAmount: any;
  AdminDiscamt: any;
  CompDisamount: any;

  vTotalBillAmount: any;
  vDiscountAmount: any = 0;
  vNetBillAmount: any;
  vAdvTotalAmount: any = 0;
  vBalanceAmt: any = 0;
  vFinalDiscountAmt: any;
  vpaidBalanceAmt: any = 0;
  vConcessionId: any = 0;
  vFinalDiscper: any = 0; 

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('drawer') public drawer: MatDrawer;

  ConcessionShow: boolean = false; 
  isLoading: String = '';
  selectedAdvanceObj: AdvanceDetailObj;
  isFilteredDateDisabled: boolean = false;
  Admincharge: boolean = true;
  doctorNameCmbList: any = [];
  BillingClassCmbList: any = [];
  IPBillingInfor: any = []; 
  AdmissionId: any;
  MenuMasterid: any;
  reportPrintObj: ReportPrintObj;
  reportPrintObjList: ReportPrintObj[] = [];
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  ConcessionId: any;
  vIpCash: any = 0;
  vPharcash: any = 0;
  ClassList: any = [];
  optionsclass: any[] = [];

  vMobileNo:any;
  filteredOptionsCashCounter: Observable<string[]>;
  filteredOptionsDoctors:any;
  optionsSearchDoc: any[] = [];

  private _onDestroy = new Subject<void>();
  isDoctor: boolean = false;
  Consession: boolean = true;
  percentag: boolean = true;
  Amount: boolean = true;

  filteredOptionsselclass: Observable<string[]>;

  constructor(
    private _Activatedroute: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef,
    public _printPreview: PrintPreviewService,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public _IpSearchListService: IPSearchListService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<IPBillingComponent>,
    private accountService: AuthenticationService,
    public _WhatsAppEmailService:WhatsAppEmailService,
    public toastr: ToastrService,
    public _ConfigService : ConfigService,
    private formBuilder: FormBuilder) {
    this.showTable = false; 
  }
 
  ngOnInit(): void { 
    this.AdmissionId = this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value;
    this.createserviceForm();
    this.createBillForm();

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj)
      this.vClassId = this.selectedAdvanceObj.ClassId
      this.ClassName = this.selectedAdvanceObj.ClassName 
      this.vMobileNo=this.selectedAdvanceObj.MobileNo;
      this.AdmissionId = this.selectedAdvanceObj.AdmissionID; 
    }

    this.myControl = new FormControl();
    this.getBillheaderList(); 
    this.getPharmacyAmount();
    this.getBillingClasslist();
    this.getServiceListCombobox();
    this.getChargesList();
    this.getRtrvPackageList();
    this.getRequestChargelist();
    this.getBillingClassCombo();
    this.getCashCounterComboList();
    this.getConcessionReasonList();
    this.getPrevBillList();
    this.getAdvanceDetList(); 
    

    if (this.selectedAdvanceObj.IsDischarged) {
      this.Ipbillform.get('GenerateBill').enable();
      this.Ipbillform.get('GenerateBill').setValue(true); 
    }
    else {
      this.Ipbillform.get('GenerateBill').disable();
      this.Ipbillform.get('GenerateBill').setValue(false); 
    }
    if (this.selectedAdvanceObj.CompanyName) {
      this.Ipbillform.get('CreditBill').enable();
      this.Ipbillform.get('CreditBill').setValue(true);
    }
    else { 
      //this.Ipbillform.get('CreditBill').disable();
      this.Ipbillform.get('CreditBill').setValue(false);
    } 
    this.setClassdata(); 
  } 
  setClassdata() {
    const toSelectClass = this.ClassList.find(c => c.ClassId == this.vClassId);
    this.Serviceform.get('ChargeClass').setValue(toSelectClass);
    this.Serviceform.updateValueAndValidity(); 
  } 
  public setFocus(nextElementId): void {
    document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
  }

  // Create registered form group
  createserviceForm() {
    this.Serviceform = this.formBuilder.group({
      ClassId: [],
      SrvcName: [''],
      price: [Validators.required],
      qty: [Validators.required,
      Validators.pattern("^[0-9]*$")],
      totalAmount: [Validators.required],
      DoctorID: [''],
      discPer: [''],
      discAmt: [],
      discAmount: [''],
      netAmount: [''],
      paidAmt: [''],
      ChargeDate: [new Date()],
      Date:[new Date()],
      balanceAmt: [''],
      ChargeClass: ['']
    });
  } 
  createBillForm() {
    this.Ipbillform = this.formBuilder.group({
      TotalAmt: [0],
      Percentage: [''],
      concessionAmt: [''],
      ConcessionId: 0,
      Remark: [''],
      GenerateBill: [1],
      CreditBill:[''],
      FinalAmount: 0,
      CashCounterID: [''],
      IpCash: [''],
      Pharcash: [''],
      ChargeClass: [''],
      AdminPer: [''],
      AdminAmt: [''],
      Admincheck:[''], 
      BillType:["1"]

    });
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  //Service date 
  OnDateChange(){
    // debugger
    // if (this.selectedAdvanceObj.AdmDateTime) {
    //   const day = +this.selectedAdvanceObj.AdmDateTime.substring(0, 2);
    //   const month = +this.selectedAdvanceObj.AdmDateTime.substring(3, 5);
    //   const year = +this.selectedAdvanceObj.AdmDateTime.substring(6, 10);

    //   this.vExpDate = `${year}/${this.pad(month)}/${day}`;
    // }
    // const serviceDate = this.datePipe.transform(this.Serviceform.get('Date').value,"yyyy-MM-dd 00:00:00.000") || 0;
    // const AdmissionDate = this.datePipe.transform(this.selectedAdvanceObj.AdmDateTime,"yyyy-MM-dd 00:00:00.000") || 0;
    // if(serviceDate > AdmissionDate){
    //   Swal.fire('should not chnage');
    // }
    // else{
    //   Swal.fire('ok');
    // }
  }
  //service class list
  getBillingClasslist() { 
    var m_data = {
      'ClassName': '%'  
    }
    this._IpSearchListService.getseletclassMasterCombo(m_data).subscribe(data => {
      this.ClassList = data; 
      this.filteredOptionsBillingClassName = this.Serviceform.get('ChargeClass').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterclass(value) : this.ClassList.slice()),
      );
      if (this.vClassId != 0) {
        const ddValue = this.ClassList.filter(c => c.ClassId == this.vClassId);  
        this.Serviceform.get('ChargeClass').setValue(ddValue[0]);
        this.Serviceform.updateValueAndValidity();
        return;
      }
    }); 
  }
  getSelectedObjClass(obj){
    this.Serviceform.get('SrvcName').setValue('');
    this.Serviceform.get('price').setValue('');
    this.filteredOptions = [];
  } 
  private _filterclass(value: any): string[] {
    if (value) {
      const filterValue = value && value.ClassName ? value.ClassName.toLowerCase() : value.toLowerCase();
      return this.ClassList.filter(option => option.ClassName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextclass(option) { 
    return option && option.ClassName ? option.ClassName : ''; 
  }
// service List
ServiceList:any=[];
  getServiceListCombobox() {
    let tempObj;
    var m_data = {
      SrvcName: `${this.Serviceform.get('SrvcName').value}%`,
      TariffId: this.selectedAdvanceObj.TariffId,
      ClassId: this.Serviceform.get('ChargeClass').value.ClassId || 0
    };
    if (this.Serviceform.get('SrvcName').value.length >= 1) {
      this._IpSearchListService.getBillingServiceList(m_data).subscribe(data => {
        this.filteredOptions = data;
        this.ServiceList = data;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      }); 
    }
  }
  IsPackage:any;
  getSelectedObj(obj) { 
    console.log(obj)
    this.SrvcName = obj.ServiceName;
    this.vPrice = obj.Price;
    this.vServiceTotalAmt = obj.Price;
    this.vServiceNetAmt = obj.Price;
    this.serviceId = obj.ServiceId;
    this.b_isPath = obj.IsPathology;
    this.b_isRad = obj.IsRadiology; 
    this.IsPackage = obj.IsPackage;

    if (obj.CreditedtoDoctor == true) {
      this.Serviceform.get('DoctorID').reset();
      this.Serviceform.get('DoctorID').setValidators([Validators.required]);
      this.Serviceform.get('DoctorID').enable();
      this.isDoctor = true;

    } else {
      this.Serviceform.get('DoctorID').reset();
      this.Serviceform.get('DoctorID').clearValidators();
      this.Serviceform.get('DoctorID').updateValueAndValidity();
      this.Serviceform.get('DoctorID').disable();
      this.isDoctor = false;
    }
    this.getpackagedetList();
  }
  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    this.nextPage$.next();
  }
  getOptionText(option) {
    if (!option)
      return ''; 
    return option && option.ServiceName ? option.ServiceName : '';
  }

    //Doctor list 
    getAdmittedDoctorCombo() {
      var vdata={
        "Keywords": this.Serviceform.get('DoctorID').value + "%" || "%"
      }
      console.log(vdata)
      this._IpSearchListService.getAdmittedDoctorCombo(vdata).subscribe(data => { 
        this.filteredOptionsDoctors = data; 
        console.log(this.filteredOptionsDoctors)  
          if (this.filteredOptionsDoctors.length == 0) {
            this.noOptionFound = true;
          } else {
            this.noOptionFound = false;
          } 
      }); 
    }
    getOptionTextsearchDoctor(option) {
      return option && option.Doctorname ? option.Doctorname : '';
    }
// Service Add 
  onSaveAddCharges() {
   
    if (( this.vClassName== '' || this.vClassName == null || this.vClassName == undefined)) {
      this.toastr.warning('Please select Ward', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(!this.ClassList.find(item => item.ClassName == this.Serviceform.get('ChargeClass').value.ClassName)){
      this.toastr.warning('Please select valid ward', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (( this.vService== '' || this.vService == null || this.vService == undefined)) {
      this.toastr.warning('Please select service', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(!this.ServiceList.find(item => item.ServiceName == this.Serviceform.get('SrvcName').value.ServiceName)){
      this.toastr.warning('Please select valid Service', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (( this.vPrice== '' || this.vPrice == null || this.vPrice == undefined || this.vPrice == '0')) {
      this.toastr.warning('Please enter price', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (( this.vQty== '' || this.vQty == null || this.vQty == undefined || this.vQty == '0')) {
      this.toastr.warning('Please enter qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (( this.vServiceTotalAmt== '' || this.vServiceTotalAmt == null || this.vServiceTotalAmt == undefined || this.vServiceTotalAmt == '0')) {
      this.toastr.warning('Please check TotalAmt is 0', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.isDoctor){
      if (( this.vDoctorID== '' || this.vDoctorID == null || this.vDoctorID == undefined)) {
        this.toastr.warning('Please select Doctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    } 
    let doctorid = 0;
    if (this.Serviceform.get("DoctorID").value)
    doctorid = this.Serviceform.get("DoctorID").value.DoctorId;

    let doctorName = '';
    if (this.Serviceform.get("DoctorID").value)
      doctorName = this.Serviceform.get("DoctorID").value.Doctorname;

    this.isLoading = 'save';
    if ((this.SrvcName && (parseInt(this.vPrice) > 0 || this.vPrice == '0') && this.vQty) && (parseFloat(this.vServiceNetAmt) > 0)) {
      
        var  m_data = {
        "chargeID": 0,
        "chargesDate": this.datePipe.transform(this.Serviceform.get('Date').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "opD_IPD_Type": 1,
        "opD_IPD_Id": this.selectedAdvanceObj.AdmissionID,
        "serviceId": this.serviceId,
        "price": this.vPrice || 0,
        "qty": this.vQty || 0,
        "totalAmt": this.vServiceTotalAmt || 0,
        "concessionPercentage": this.vServiceDiscPer || 0,
        "concessionAmount": this.vServiceDisAmt || 0,
        "netAmount": this.vServiceNetAmt || 0,
        "doctorId": doctorid,
        "doctorName": doctorName,
        "docPercentage": 0,
        "docAmt": 0,
        "hospitalAmt": this.FAmount,// this.vServiceNetAmt,
        "isGenerated": 0,
        "addedBy": this.accountService.currentUserValue.user.id,
        "isCancelled": 0,
        "isCancelledBy": 0,
        "isCancelledDate": "01/01/1900",
        "isPathology": this.b_isPath,
        "isRadiology": this.b_isRad,
        "isPackage": 0 ,//this.IsPackage,
        "packageMainChargeID": 0,
        "isSelfOrCompanyService": false,
        "packageId": this.IsPackage,
        "chargeTime":this.datePipe.transform(this.Serviceform.get('Date').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', // this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
        "classId":this.Serviceform.get('ChargeClass').value.ClassId,    // this.selectedAdvanceObj.ClassId, 
      } 
 debugger
      let PackageData =[]
      if(this.IsPackage == '1'){ 
       
        this.PacakgeList.forEach(element=>{
           var  Vdata = {
            "chargesDate": this.datePipe.transform(this.Serviceform.get('Date').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
            "opD_IPD_Type": 1,
            "opD_IPD_Id": this.selectedAdvanceObj.AdmissionID,
            "serviceId": element.PackageServiceId,
            "price": element.Price || 0,
            "qty": element.Qty || 0,
            "totalAmt": element.TotalAmt || 0,
            "concessionPercentage":  0,
            "concessionAmount": element.ConcessionAmt || 0,
            "netAmount": element.NetAmount || 0,
            "doctorId": 0,
            "doctorName": '',
            "docPercentage": 0,
            "docAmt": 0,
            "hospitalAmt": this.FAmount,// this.vServiceNetAmt,
            "isGenerated": 0,
            "addedBy": this.accountService.currentUserValue.user.id,
            "isCancelled": 0,
            "isCancelledBy": 0,
            "isCancelledDate": "01/01/1900",
            "isPathology": element.IsPathology,
            "isRadiology": element.IsRadiology,
            "isPackage": 1,
            "packageMainChargeID": 0,
            "isSelfOrCompanyService": false,
            "packageId": element.ServiceId,  
          }  
          console.log(Vdata)
          PackageData.push(Vdata)
        })  
    } 
      let submitData = {
        "addCharges": m_data,
        "chargesIPPackageInsert":PackageData
      }; 
      console.log(submitData)
      this._IpSearchListService.InsertIPAddCharges(submitData).subscribe(data => {
        if (data) {
          this.getChargesList(); 
        }
      });
      this.onClearServiceAddList()
      this.isLoading = '';
      this.interimArray = [];
     
    }
    else {
      Swal.fire("Enter Proper Values !")
    }
    this.itemid.nativeElement.focus();
    this.add = false; 
    this.isDoctor = false;
  }
  onClearServiceAddList() {
    this.Serviceform.get('SrvcName').reset();
    this.Serviceform.get('price').reset();
    this.Serviceform.get('qty').reset('1');
    this.Serviceform.get('totalAmount').reset();
    this.Serviceform.get('DoctorID').reset();
    this.Serviceform.get('discPer').reset();
    this.Serviceform.get('discAmount').reset();
    this.Serviceform.get('netAmount').reset();
  }
    //package list 
    PacakgeList:any=[];
    getpackagedetList() {
      debugger
      var vdata = {
        'ServiceId': this.serviceId || 0
      }
      console.log(vdata);
      this._IpSearchListService.getpackagedetList(vdata).subscribe((data) => {
        this.PackageDatasource.data = data as ChargesList[];
        this.PackageDatasource.data.forEach(element =>{
          this.PacakgeList.push(
            { 
              ServiceId: element.ServiceId,
              ServiceName: element.ServiceName,
              Price: element.Price || 0,
              Qty: 1,
              TotalAmt:  0,
              ConcessionAmt:  0,  
              NetAmount: 0,
              IsPathology: element.IsPathology,
              IsRadiology: element.IsRadiology, 
              PackageId:element.PackageId,
              PackageServiceId:element.PackageServiceId,
              PacakgeServiceName:element.PacakgeServiceName,
            })
        })
        this.PackageDatasource.data = this.PacakgeList
        console.log(this.PacakgeList);
        console.log(this.PackageDatasource.data);
      });
    }
 
    //add charge Table Cal
   
    getQtytable(element,Qty) {
      console.log(Qty)
      console.log(element)
      let discAmt = 0; 
      let discPer = 0;
      discPer = element.ConcessionPercentage 
      if(element.Price > 0 && Qty > 0){ 
      element.TotalAmt = Qty * element.Price
      element.ConcessionAmount = (discPer * element.TotalAmt) / 100 ;
      discAmt = element.ConcessionAmount;
      element.NetAmount =  element.TotalAmt - discAmt
      }  
      else if(element.Price == 0 || element.Price == '' || Qty == '' || Qty == 0){
        element.TotalAmt = 0;  
        element.ConcessionAmount =  0 ;
        element.NetAmount =  0 ;
      } 
    }
    getPricetable(element,Price) {
      console.log(Price)
      console.log(element)
      let discAmt = 0; 
      let discPer = 0;
      element.Price = Price
      discPer = element.ConcessionPercentage 
      if(Price > 0 && element.Qty > 0){ 
      element.TotalAmt = element.Qty *Price
      element.ConcessionAmount = (discPer * element.TotalAmt) / 100 ;
      discAmt = element.ConcessionAmount;
      element.NetAmount =  element.TotalAmt - discAmt
      }  
      else if(Price == 0 || Price == '' || element.Qty == '' || element.Qty == 0){
        element.TotalAmt = 0;  
        element.ConcessionAmount =  0 ;
        element.NetAmount =  0 ;
      } 
    }
    QtyEditable:boolean=false;
    PriceEditable:boolean=false;
      QtyenableEditing(row:Bill) {
        console.log(row)
        row.QtyEditable = true; 
        
      }
     QtydisableEditing(row:Bill) {
        row.QtyEditable = false; 
        this.getChargesList();
      } 
      PriceenableEditing(row:Bill) {
        row.PriceEditable = true;  
        
      }
     PricedisableEditing(row:Bill) {
        row.PriceEditable = false; 
        this.getChargesList();
      }
  OnSaveEditedValue(element) { 
    console.log(element)
    let Query; 
    Query = "update addcharges set Qty=" +element.Qty+",Price=" +element.Price+ 
    ",TotalAmt="+element.TotalAmt+",ConcessionAmount="+element.ConcessionAmount+ 
     ",NetAmount="+element.NetAmount+"where ChargesId="+element.ChargesId;
     
    console.log(Query)
    this._IpSearchListService.UpdateipbillService(Query).subscribe(data => {
      if (data) { 
        this.toastr.success('Record Successfuly Updated','Updated !',{
          toastClass: 'tostr-tost custom-toast-success',
        })
        this.getChargesList();
      } else { 
        this.toastr.error('Record data not  Updated','Updated !',{
          toastClass: 'tostr-tost custom-toast-error',
        })
      }
    });

  }
  //Previouse bill list
  getPrevBillList() {
    var D_data = {
      "IP_Id": this.selectedAdvanceObj.AdmissionID
    }
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._IpSearchListService.getpreviousbilldetail(D_data).subscribe(Visit => {
        this.prevbilldatasource.data = Visit as Bill[];
        // console.log(this.prevbilldatasource.data)
      },
        error => {
          this.sIsLoading = '';
        });
    }, 5);
  }
  //Advance list
  getAdvanceDetList() {
    var D_data = {
      "AdmissionID": this.selectedAdvanceObj.AdmissionID
    }
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._IpSearchListService.getAdvancedetail(D_data).subscribe(Visit => {
        this.advancedatasource.data = Visit as IpdAdvanceBrowseModel[];
        //console.log(this.advancedatasource.data)
      },
        error => {
          this.sIsLoading = '';
        });
    }, 5);
  }
  //Pharamcy Amount 
  getPharmacyAmount() {
    let Query = "select isnull(Sum(BalanceAmount),0) as PhBillCredit from T_SalesHeader where OP_IP_Type=1 and OP_IP_ID=" + this.AdmissionId
    this._IpSearchListService.getPharmacyAmt(Query).subscribe((data) => {
      console.log(data)
      this.PharmacyAmont = data[0].PhBillCredit;
    })
  }
  getDatewiseChargesList(param) {
    // console.log(param);
    this.chargeslist = [];
    this.dataSource.data = []; 
    this.isLoadingStr = 'loading';
    let Query = "Select * from lvwAddCharges where IsGenerated=0 and IsCancelled =0 AND OPD_IPD_ID=" + this.selectedAdvanceObj.AdmissionID + " and OPD_IPD_Type=1 and ChargesDate ='" + this.datePipe.transform(param, "dd/MM/YYYY") + "' Order by Chargesid"
 
   // console.log(Query)
    this._IpSearchListService.getchargesList(Query).subscribe(data => {
      this.chargeslist = data as ChargesList[];
     // console.log(this.chargeslist)
      this.dataSource.data = this.chargeslist; 
      this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
    },
      (error) => {
        this.isLoading = 'list-loaded';
      });
  }
  getRequestChargelist() {
    this.chargeslist1 = [];
    this.dataSource1.data = [];
    var m = {
      OP_IP_ID: this.selectedAdvanceObj.AdmissionID,
    }
    this._IpSearchListService.getchargesList1(m).subscribe(data => {
      this.chargeslist1 = data as ChargesList[];
      this.dataSource1.data = this.chargeslist1;
     // console.log(this.dataSource1.data)
      this.isLoading = 'list-loaded';
    },
      (error) => {
        this.isLoading = 'list-loaded';
      }); 
  } 

  getRtrvPackageList() {  
    //  this.isLoadingStr = 'loading';
    //  let Query = "Select *  from lvwAddCharges where IsGenerated=0 and PackageId !=0  and IsCancelled =0 AND OPD_IPD_ID=" + this.selectedAdvanceObj.AdmissionID + " and OPD_IPD_Type=1 Order by Chargesid"
    //  console.log(Query); 
    //  this._IpSearchListService.getchargesPackageList(Query).subscribe(data => {
    //    this.PackageDatasource.data = data as ChargesList[];
    //    this.PacakgeList = data as ChargesList[];
    //    console.log(this.PacakgeList)   
    //  },
    //    (error) => {
    //      this.isLoading = 'list-loaded';
    //    });  
   }

  getChargesList() {
   // debugger
    this.chargeslist = [];
    this.dataSource.data = [];
    this.isLoadingStr = 'loading';
    let Query = "Select * , '' as QtyEditable,'' as PriceEditable from lvwAddCharges where IsGenerated=0 and  IsPackage=0 and IsCancelled =0 AND OPD_IPD_ID=" + this.selectedAdvanceObj.AdmissionID + " and OPD_IPD_Type=1 and IsComServ= 0 Order by Chargesid"
    // console.log(Query);
     this._IpSearchListService.getchargesList(Query).subscribe(data => {
      this.chargeslist = data as ChargesList[];
      //console.log(this.chargeslist)
      this.dataSource.data = this.chargeslist;

      this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
    },
      (error) => {
        this.isLoading = 'list-loaded';
      }); 
    this.chkdiscstatus(); 
  }

  billheaderlist: any;
  //Admin Charge retreiving 
  getBillheaderList() {
    this.isLoadingStr = 'loading';
    let Query = "select Isnull(AdminPer,0) as AdminPer from Admission where AdmissionId=" + this.selectedAdvanceObj.AdmissionID
    //console.log(Query); 
    this._IpSearchListService.getBillheaderList(Query).subscribe(data => {
      this.billheaderlist = data[0].AdminPer;
      // console.log(this.billheaderlist)
      if (this.billheaderlist > 0) {
        this.isAdminDisabled = true;
        this.Ipbillform.get('Admincheck').setValue(true)
        this.vAdminPer = this.billheaderlist
        //   console.log(this.vAdminPer)
      } else {
        this.isAdminDisabled = false;
        this.Ipbillform.get('Admincheck').setValue(false)
      }
    });
  } 
  //nursing Service List added
 
  AddList(m) {
    console.log(m)   
    var m_data = { 
      "opipid": m.OP_IP_ID,
      "serviceId":  m.ServiceId,
      "classId": this.Serviceform.get("ChargeClass").value.ClassId || 0 ,    // this.selectedAdvanceObj.ClassId,
      "userId": this.accountService.currentUserValue.user.id,
      "traiffId": 1,  
      "reqDetId": m.ReqDetId , 
      "chargesDate": this.datePipe.transform(this.currentDate, "MM-dd-yyyy") || '01/01/1900', // this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
    }
    console.log(m_data);
    let submitData = { 
      "labRequestCharges":m_data
    };  
    this._IpSearchListService.InsertIPLabReqCharges(submitData).subscribe(data => {
      console.log(data)
      if (data) { 
        Swal.fire('Success !', 'ChargeList Row Added Successfully', 'success'); 
        this.getChargesList();
        this.getRequestChargelist();  
      }
    });
    this.onClearServiceAddList() 
    this.itemid.nativeElement.focus();
    this.isLoading = '';
  }

  //Concession DropDown
  getConcessionReasonList() {
    this._IpSearchListService.getConcessionCombo().subscribe(data => {
      this.ConcessionReasonList = data;
      // this.Ipbillform.get('ConcessionId').setValue(this.ConcessionReasonList[1]);
    })
  }
  //CashCounter List
  setcashCounter: any;
  getCashCounterComboList() {
    this._IpSearchListService.getCashcounterList().subscribe(data => {
      this.CashCounterList = data
      // console.log(this.CashCounterList)

      this.setcashCounter = this.CashCounterList.find(item => item.CashCounterId == this._ConfigService.configParams.IPD_Billing_CounterId)
      this.Ipbillform.get('CashCounterID').setValue(this.setcashCounter)

      this.filteredOptionsCashCounter = this.Ipbillform.get('CashCounterID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCashCounter(value) : this.CashCounterList.slice()),
      );
    });
  }
  private _filterCashCounter(value: any): string[] {
    if (value) {
      const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
      return this.CashCounterList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextCashCounter(option) {
    if (!option)
      return '';
    return option.CashCounterName;
  }
//Calculate Service Total Amt
  calculateTotalAmt() {
    if (this.vPrice && this.vQty) {
      this.vServiceTotalAmt = Math.round(parseInt(this.vPrice) * parseInt(this.vQty)).toString();
      this.vServiceNetAmt = this.vServiceTotalAmt;
    } 
  }
//Service Wise DiscPer
  calculateServicePersc() { 
    let ServiceDiscper = this.Serviceform.get('discPer').value || 0;

    if (ServiceDiscper > 0 && ServiceDiscper < 100 || ServiceDiscper > 100) {
      if (ServiceDiscper > 100) {
        Swal.fire("Enter Discount % Less than 100 & Greater > 0")
        this.vServiceDisAmt = '';
        this.vServiceDiscPer = '';
        //this.registeredForm.get('ChargeDiscPer').setValue('') 
        this.vServiceNetAmt = this.vServiceTotalAmt; 
      } else {
        this.vServiceDisAmt = ((parseFloat(this.vServiceTotalAmt) * parseFloat(ServiceDiscper)) / 100).toFixed(2);
 
        this.vServiceNetAmt = (parseFloat(this.vServiceTotalAmt) - parseFloat(this.vServiceDisAmt)).toFixed(2); 
      }
    } else {
      this.vServiceNetAmt = this.vServiceTotalAmt;
      this.vServiceDisAmt = ''; 
      this.vServiceDiscPer = '';
     // this.registeredForm.get('ChargeDiscPer').setValue('') 
    }
  }  
  //Service Disc Amt 
  calculatechargesDiscamt() { 
    let ServiceDiscAmt = this.Serviceform.get('discAmount').value || 0;
    let Netamt = parseInt(this.vServiceNetAmt); 

    if (ServiceDiscAmt > 0 && ServiceDiscAmt < this.vServiceTotalAmt  || ServiceDiscAmt > this.vServiceTotalAmt) {
      if (parseFloat(ServiceDiscAmt) > parseFloat(this.vServiceTotalAmt)) {
        Swal.fire("Enter Discount Amt Less than Total Amt & Greater > 0")
        this.vServiceDiscPer = '';
        this.vServiceDisAmt = ' ';
        //this.registeredForm.get('ChargeDiscPer').setValue('') 
        this.vServiceNetAmt = this.vServiceTotalAmt; 
      } else {
        this.vServiceDiscPer = ((parseFloat(ServiceDiscAmt) / parseFloat(this.vServiceTotalAmt )) * 100).toFixed(2);   
        this.vServiceNetAmt = (parseFloat(this.vServiceTotalAmt) - parseFloat(this.vServiceDisAmt)).toFixed(2);  
      }
    } else {
      this.vServiceNetAmt = this.vServiceTotalAmt;
      this.vServiceDiscPer = ''; 
     // this.registeredForm.get('ChargeDiscPer').setValue('') 
    }  
    this.add = false;
  }
//TotalBill Amt
  vTotalAmount: any = 0;
  getTotalAmtSum(element) {
    let totalAmt;
    totalAmt = element.reduce((sum, { TotalAmt }) => sum += +(TotalAmt || 0), 0);
    this.vTotalAmount = totalAmt;
    this.CalculateAdminCharge(); 
    this.chkdiscstatus();
    return totalAmt;
  }
  //Total bill DiscAmt 
  TotalServiceDiscPer:any=0;
  getDiscountSum(element) {
     this.TotalServiceDiscPer = element.reduce((sum, { ConcessionPercentage }) => sum += +(ConcessionPercentage || 0), 0);
    let ServiceDiscAmt = element.reduce((sum, { ConcessionAmount }) => sum += +(ConcessionAmount || 0), 0);
    if(ServiceDiscAmt > 0){
      this.vFinalDiscountAmt = ServiceDiscAmt;
      this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt);
    }else{
      this.Ipbillform.get('concessionAmt').clearValidators();
      this.vFinalDiscountAmt = '';
    } 
    return ServiceDiscAmt;
  }
  //Table Total netAmt
  getNetAmtSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0); 
    this.vNetBillAmount = netAmt;  
    return netAmt;
  }
  //Total Advance Amt
  getAdvAmtSum(element) {
    let AdvanceAmt;
    AdvanceAmt = element.reduce((sum, { BalanceAmount }) => sum += +(BalanceAmount || 0), 0);
    this.vAdvTotalAmount = AdvanceAmt; 
    if (this.vNetBillAmount < this.vAdvTotalAmount) {
      this.vBalanceAmt = parseInt(this.vAdvTotalAmount) - this.vNetBillAmount;  
    } 
    return AdvanceAmt;
  }
//Admin Charge Check Box On 
isAdminDisabled : boolean=false;
AdminStatus(event){
  if (event.checked == true){
    this.isAdminDisabled = true;
  }else{
    this.isAdminDisabled = false;
    this.Ipbillform.get('AdminPer').reset();
    this.Ipbillform.get('AdminAmt').reset();  
  }
  if(parseInt(this.TotalServiceDiscPer) > 0){
    this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
  }else{
    this.Ipbillform.get('FinalAmount').setValue(this.vTotalAmount);
    this.CalFinalDisc();
    this.chkdiscstatus();
  }
}
//Admin Charge Cal
// CalculateAdminCharge(){
// debugger
// let AdminPer = this.Ipbillform.get('AdminPer').value || 0;
//   if (AdminPer > 0 && AdminPer < 100) {

//     if (AdminPer > 100) {
//       this.toastr.warning('Please Enter Admin % less than 100 and Greater than 0.', 'Warning !', {
//         toastClass: 'tostr-tost custom-toast-warning',
//       });
//       this.Ipbillform.get('AdminPer').reset();
//       this.Ipbillform.get('AdminAmt').reset();
//       this.Ipbillform.get('FinalAmount').setValue(this.vTotalBillAmount);
//       this.CalFinalDisc();
//     }
//     else {
//       this.vAdminAmt = Math.round((parseFloat(this.vTotalAmount) * parseFloat(AdminPer)) / 100).toFixed(2);
//       let FinalTotalAmt = (parseFloat(this.vTotalAmount) + parseFloat(this.vAdminAmt)).toFixed(2);

//       if (parseInt(this.TotalServiceDiscPer) > 0) {
//         let finalnetamt = (parseFloat(FinalTotalAmt) - parseFloat(this.vDiscountAmount)).toFixed(2);
//         this.Ipbillform.get('FinalAmount').setValue(finalnetamt);
//       } else {
//         let Percentage = this.Ipbillform.get('Percentage').value || 0;
//         this.vFinalDiscountAmt = ((parseFloat(FinalTotalAmt) * parseFloat(Percentage)) / 100).toFixed(2);
//         this.vNetBillAmount = Math.round(parseFloat(FinalTotalAmt) - parseFloat(this.vFinalDiscountAmt)).toFixed(2);
//         this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
//       }
//     }
//   } else {
//     this.toastr.warning('Please Enter Admin % less than 100 and Greater than 0.', 'Warning !', {
//       toastClass: 'tostr-tost custom-toast-warning',
//     });
//     this.Ipbillform.get('AdminPer').reset();
//     this.Ipbillform.get('AdminAmt').reset();
//     this.Ipbillform.get('FinalAmount').setValue(this.vTotalBillAmount);
//     this.CalFinalDisc();
//   }
// } 
CalculateAdminCharge(){ 
  if(this.vAdminPer > 0 && this.vAdminPer < 100 ){
    this.vAdminAmt = Math.round((parseFloat(this.vTotalAmount) * parseFloat(this.vAdminPer)) / 100).toFixed(2);
    let FinalTotalAmt = (parseFloat(this.vTotalAmount) + parseFloat(this.vAdminAmt)).toFixed(2);

    if (parseInt(this.TotalServiceDiscPer) > 0) {
      let finalnetamt =  Math.round(parseFloat(FinalTotalAmt) - parseFloat(this.vFinalDiscountAmt)).toFixed(2);
      this.Ipbillform.get('FinalAmount').setValue(finalnetamt);
    } else {
      let Percentage = this.Ipbillform.get('Percentage').value || 0;
      this.vFinalDiscountAmt =  Math.round((parseFloat(FinalTotalAmt) * parseFloat(Percentage)) / 100).toFixed(2);
      this.vNetBillAmount = Math.round(parseFloat(FinalTotalAmt) - parseFloat(this.vFinalDiscountAmt)).toFixed(2); 
      this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount); 
    }
  }else{
    if(this.vAdminPer < 0 && this.vAdminPer > 100 || this.vAdminPer == 0 || this.vAdminPer == ''){
    this.Ipbillform.get('AdminPer').reset();
    this.Ipbillform.get('AdminAmt').reset();
    this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
    this.CalFinalDisc();
  }
  if( this.vAdminPer > 100 ){
    this.toastr.warning('Please Enter Admin % less than 100 and Greater than 0.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    this.Ipbillform.get('AdminPer').reset();
    this.Ipbillform.get('AdminAmt').reset();
    this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
    this.CalFinalDisc();
  }
  }
}
// Total Bill Disc Per cal 
  CalFinalDisc() {
   // debugger
    let BillDiscPer = this.Ipbillform.get('Percentage').value || 0;

    if (this.Ipbillform.get('AdminAmt').value > 0) {
      let FinalTotalAmt = ((parseFloat(this.vTotalAmount) + parseFloat(this.vAdminAmt))).toFixed(2);

      if (BillDiscPer > 0 && BillDiscPer < 100 || BillDiscPer > 100) {
        if (BillDiscPer > 100) {
          this.toastr.warning('Please Enter Discount % less than 100 and Greater than 0.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.Ipbillform.get('Percentage').reset();
          this.vFinalDiscountAmt = '';
          this.vNetBillAmount = FinalTotalAmt;
          this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount); 
        } else {
          this.vFinalDiscountAmt = Math.round((parseFloat(FinalTotalAmt) * parseFloat(BillDiscPer)) / 100).toFixed(2);
          this.vNetBillAmount = Math.round(parseFloat(FinalTotalAmt) - parseFloat(this.vFinalDiscountAmt)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
          this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt);
        }
      } else { 
        this.Ipbillform.get('Percentage').reset();
        this.vFinalDiscountAmt = '';
        this.vNetBillAmount = FinalTotalAmt;
        this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.finaldisc.nativeElement.focus();
      }
      this.chkdiscstatus();
    } else {
      if (BillDiscPer > 0 && BillDiscPer < 100) { 
          this.vFinalDiscountAmt = Math.round((parseFloat(this.vTotalAmount) * parseFloat(BillDiscPer)) / 100).toFixed(2);
          this.vNetBillAmount = Math.round(parseFloat(this.vTotalAmount) - parseFloat(this.vFinalDiscountAmt)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
          this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt); 
      } else { 
        this.Ipbillform.get('Percentage').reset();
        this.vFinalDiscountAmt = '';
        this.vNetBillAmount = this.vTotalAmount;
        this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount); 
      }
      if (BillDiscPer > 100) {
        this.toastr.warning('Please Enter Discount % less than 100 and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.Ipbillform.get('Percentage').reset();
        this.vFinalDiscountAmt = '';
        this.vNetBillAmount = this.vTotalAmount;
        this.Ipbillform.get('concessionAmt').setValue(this.vFinalDiscountAmt);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount); 
      }
      this.chkdiscstatus();
    }
    
  } 
  //Total Bill DiscAMt cal
  getDiscAmtCal() {
    let FinalDiscAmt = this.Ipbillform.get('concessionAmt').value || 0;

    if (this.Ipbillform.get('AdminAmt').value > 0) {

      let FinalTotalAMt = ((parseFloat(this.vTotalAmount) + parseFloat(this.vAdminAmt))).toFixed(2);

      if (FinalDiscAmt > 0 && parseFloat(FinalDiscAmt) < parseFloat(FinalTotalAMt) || parseFloat(FinalDiscAmt) > parseFloat(FinalTotalAMt)) {
        if (parseFloat(FinalDiscAmt) > parseFloat(FinalTotalAMt)) {
          this.toastr.warning('Please Enter Discount amt less than Total and Greater than 0.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.Ipbillform.get('concessionAmt').reset();
          this.vFinalDiscper = '';
          this.vNetBillAmount = FinalTotalAMt;
          this.Ipbillform.get('Percentage').setValue(this.vFinalDiscper);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        } else {
          this.vFinalDiscper = ((parseFloat(FinalDiscAmt) / parseFloat(FinalTotalAMt)) * 100).toFixed(2);
          this.vNetBillAmount = Math.round(parseFloat(FinalTotalAMt) - parseFloat(FinalDiscAmt)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
          this.Ipbillform.get('Percentage').setValue(this.vFinalDiscper);
        }
      } else {
        this.toastr.warning('Please Enter Discount amt less than Total and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.Ipbillform.get('concessionAmt').reset();
        this.vFinalDiscper = '';
        this.vNetBillAmount = FinalTotalAMt;
        this.Ipbillform.get('Percentage').setValue(this.vFinalDiscper);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
      }

    } else {
      if (FinalDiscAmt > 0 && parseFloat(FinalDiscAmt) < parseFloat(this.vTotalAmount) || parseFloat(FinalDiscAmt) > parseFloat(this.vTotalAmount)) {
        if (parseFloat(FinalDiscAmt) > parseFloat(this.vTotalAmount)) {
          this.toastr.warning('Please Enter Discount amt less than Total and Greater than 0.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.Ipbillform.get('concessionAmt').reset();
          this.vFinalDiscper = '';
          this.vNetBillAmount = this.vTotalAmount;
          this.Ipbillform.get('Percentage').setValue(this.vFinalDiscper);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        } else {
          this.vFinalDiscper = ((parseFloat(FinalDiscAmt) / parseFloat(this.vTotalAmount)) * 100).toFixed(2);
          this.vNetBillAmount = Math.round(parseFloat(this.vTotalAmount) - parseFloat(FinalDiscAmt)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
          this.Ipbillform.get('Percentage').setValue(this.vFinalDiscper);
        }
      } else {
        this.toastr.warning('Please Enter Discount amt less than Total and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.Ipbillform.get('concessionAmt').reset();
        this.vFinalDiscper = '';
        this.vNetBillAmount = this.vTotalAmount;
        this.Ipbillform.get('Percentage').setValue(this.vFinalDiscper);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
      }
    }
    this.chkdiscstatus();
  }
 
  chkdiscstatus() {  
    let CheckDiscAmt =  this.Ipbillform.get('concessionAmt').value || 0
    if (this.vFinalDiscountAmt > 0 || CheckDiscAmt > 0) { 
      this.ConcessionShow = true; 
    } else{ 
      this.ConcessionShow = false; 
    }
    if (parseFloat(this.TotalServiceDiscPer) > 0) {
      this.BillDiscperFlag = false; 
    }else{ 
      this.BillDiscperFlag = true; 
    }
  } 
  generateBillchk($event) {
    if ($event)
      this.vGenbillflag = true;
    if (!$event)
      this.vGenbillflag = false;
  } 

  //select cehckbox
  tableElementChecked(event, element) {
    if (event.checked) {
      this.interimArray.push(element);
      // console.log(this.interimArray)
    } else if (this.interimArray.length > 0) {
      let index = this.interimArray.indexOf(element);
      if (index !== -1) {
        this.interimArray.splice(index, 1);
      }
    }
  }
  //Intrim bill popup 
  getInterimData() {
    if (this.interimArray.length > 0) {
      let m_data = {
        AdmissionID: this.selectedAdvanceObj.AdmissionID,
        BillNo: 0,
        BillDate: this.dateTimeObj.date,
        concessionReasonId: this.Ipbillform.get('ConcessionId').value || 0,
        tariffId: this.selectedAdvanceObj.TariffId,
        RemarkofBill: this.Ipbillform.get('Remark').value || '',
        RegNo: this.selectedAdvanceObj.RegNo,
        PatientName: this.selectedAdvanceObj.PatientName,
        Doctorname: this.selectedAdvanceObj.Doctorname,
        AdmDateTime: this.selectedAdvanceObj.AdmDateTime,
        AgeYear: this.selectedAdvanceObj.AgeYear,
        ClassId: this.selectedAdvanceObj.ClassId,
        TariffName: this.selectedAdvanceObj.TariffName,
        TariffId: this.selectedAdvanceObj.TariffId,
        IsDischarged: this.selectedAdvanceObj.IsDischarged,
        IPDNo: this.selectedAdvanceObj.IPDNo,
        BedName: this.selectedAdvanceObj.BedName,
        CompanyId: this.selectedAdvanceObj.CompanyId,
        IsBillGenerated: this.selectedAdvanceObj.IsBillGenerated,
        UnitId: this.selectedAdvanceObj.UnitId,
        MobileNo: this.selectedAdvanceObj.MobileNo,
        AdvTotalAmount: this.vAdvTotalAmount || 0
      };
      // console.log(m_data)
      this.advanceDataStored.storage = new AdvanceDetailObj(m_data);
      console.log('this.interimArray==', this.interimArray, m_data);
      const dialogRef =  this._matDialog.open(InterimBillComponent,
        {
          maxWidth: "85vw",
          //maxHeight: "65vh",
          width: '100%',
          height: "500px",
          data: this.interimArray
        });
        dialogRef.afterClosed().subscribe(result => {
          this.getChargesList();
        }); 
    } else {
      Swal.fire('Warring !', 'Please select check box ', 'warning');
    }
    this.getChargesList();
    this.interimArray = [];
  }
  deletecharges(contact) {
    if (contact.IsPathTestCompleted == 1) {
      this.toastr.warning('Selected Service Test is Already Completed you cannot delete !', 'warning', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }
    if (contact.IsRadTestCompleted == 1) {
      this.toastr.warning('Selected Service Test is Already Completed you cannot delete !', 'warning', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
    }
    Swal.fire({
      title: 'Do you want to Delete Charges',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!"

    }).then((flag) => {

      if (flag.isConfirmed) {
        let Chargescancle = {};
        Chargescancle['ChargesId'] = contact.ChargesId;
        Chargescancle['userId'] = this.accountService.currentUserValue.user.id;

        let submitData = {
          "deleteCharges": Chargescancle
        };
        console.log(submitData);
        this._IpSearchListService.Addchargescancle(submitData).subscribe(response => {
          if (response) {
            Swal.fire('Charges cancelled !', 'Charges cancelled Successfully!', 'success').then((result) => {
              if (contact.IsPackageMaster == '1' && contact.ServiceId) {
                this.PacakgeList = this.PacakgeList.filter(item => item.ServiceId !== contact.ServiceId)
                console.log(this.PacakgeList)
                this.PackageDatasource.data = this.PacakgeList;
              }
              this.getChargesList();
              this.CalculateAdminCharge();
              this.CalFinalDisc();
              this.chkdiscstatus()
            });
          } else {
            Swal.fire('Error !', 'Charges cancelled data not saved', 'error');
          }
          this.isLoading = '';
        });
      }
    });
  }
   EditedPackageService:any=[];
   OriginalPackageService:any = [];
   TotalPrice:any = 0; 
   
 getPacakgeDetail(contact){
   let deleteservice;
   deleteservice = this.PackageDatasource.data
   this.PackageDatasource.data.forEach(element => {
     deleteservice = deleteservice.filter(item => item.ServiceId !== element.ServiceId)
     console.log(deleteservice)   
     this.PackageDatasource.data =  deleteservice
  
     this.OriginalPackageService = this.dataSource.data.filter(item => item.ServiceId !== element.ServiceId)
     this.EditedPackageService = this.dataSource.data.filter(item => item.ServiceId === element.ServiceId)
     console.log(this.OriginalPackageService)
     console.log(this.EditedPackageService)
   });
 
   const dialogRef = this._matDialog.open(OpPackageBillInfoComponent,
     {
       maxWidth: "100%",
       height: '75%',
       width: '70%' ,
       data: {
         Obj:contact
       }
     });
   dialogRef.afterClosed().subscribe(result => {
     debugger
     console.log('The dialog was closed - Insert Action', result);
     if (result) {
 
       this.PackageDatasource.data = result
       console.log( this.PackageDatasource.data)   
       this.PackageDatasource.data.forEach(element => {
         this.PacakgeList = this.PacakgeList.filter(item => item.PackageServiceId !== element.PackageServiceId)
         console.log(this.PacakgeList)   
         if(element.BillwiseTotalAmt > 0){
           this.TotalPrice = element.BillwiseTotalAmt;  
           console.log(this.TotalPrice) 
         }else{
           this.TotalPrice = parseInt(this.TotalPrice) + parseInt(element.Price);  
           console.log(this.TotalPrice) 
         }
      
         this.OriginalPackageService = this.dataSource.data.filter(item => item.ServiceId !== element.ServiceId)
         this.EditedPackageService = this.dataSource.data.filter(item => item.ServiceId === element.ServiceId)
         console.log(this.OriginalPackageService)
         console.log(this.EditedPackageService)
       });
 
       this.PackageDatasource.data.forEach(element => {
         this.PacakgeList.push(
           {
             ServiceId: element.ServiceId,
             ServiceName: element.ServiceName,
             Price: element.Price || 0,
             Qty: element.Qty || 1,
             TotalAmt: element.TotalAmt || 0,
             ConcessionPercentage: element.DiscPer || 0,
             DiscAmt: element.DiscAmt || 0,
             NetAmount: element.NetAmount || 0,
             IsPathology: element.IsPathology || 0,
             IsRadiology: element.IsRadiology || 0,
             PackageId: element.PackageId || 0,
             PackageServiceId: element.PackageServiceId || 0, 
             PacakgeServiceName:element.PacakgeServiceName || '',
           });
         this.PackageDatasource.data = this.PacakgeList;
       });
  
         if(this.EditedPackageService.length){
           this.EditedPackageService.forEach(element => {
             this.OriginalPackageService.push(
               {  
                 ChargesId: 0,// this.serviceId,
                 ServiceId:  element.ServiceId,
                 ServiceName: element.ServiceName,
                 Price: this.TotalPrice || 0,
                 Qty:  element.Qty || 0,
                 TotalAmt: (parseFloat(element.Qty) *  parseFloat(this.TotalPrice)) || 0,
                 DiscPer: element.DiscPer || 0, 
                 DiscAmt: element.DiscAmt || 0,
                 NetAmount: (parseFloat(element.Qty) *  parseFloat(this.TotalPrice))  || 0,
                 ClassId: 1, 
                 DoctorId: element.DoctornewId, 
                 DoctorName: element.DoctorName,
                 ChargesDate: this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
                 IsPathology: element.IsPathology,
                 IsRadiology: element.IsRadiology,
                 IsPackage: element.IsPackage,
                 ClassName: element.ClassName, 
                 ChargesAddedName: this.accountService.currentUserValue.user.id || 1,
               });
           
             this.dataSource.data = this.OriginalPackageService;
            this.chargeslist = this.dataSource.data 
           });
         } 
         
         this.TotalPrice = 0;
     }
   })
 }
  showAllFilter(event) {
    console.log(event);
    if (event.checked == true)
      // this.isFilteredDateDisabled = event.value;
      this.isFilteredDateDisabled = true;
    if (event.checked == false) {
      this.getChargesList();
      this.isFilteredDateDisabled = false;
    }
  } 
  //Save
  onSave() { 
    if (this.Ipbillform.get('concessionAmt').value > 0 || this.Ipbillform.get('Percentage').value > 0) {
      if(!this.Ipbillform.get('ConcessionId').value.ConcessionId){
        this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (!this.Ipbillform.get('CashCounterID').value) {
      this.toastr.warning('Please select Cash Counter.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this.Ipbillform.get('CashCounterID').value) {
      if (!this.CashCounterList.some(item => item.CashCounterName === this.Ipbillform.get('CashCounterID').value.CashCounterName)) {
        this.toastr.warning('Please Select valid Cash Counter Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    } 
 
      if (this.dataSource.data.length > 0) {
        if (this.Ipbillform.get('GenerateBill').value) {
          Swal.fire({
            title: 'Do you want to generate the Final Bill ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Generate!" 
 
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

             // this.SaveBill();
             this.SaveBill1();
            }
          })
        }
        else {
          Swal.fire({
            title: 'Do you want to save the Draft Bill ', 
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Save!"  

          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.onSaveDraft();
            }
          })
        }
      } else {
        Swal.fire("Select Data For Save")
      }
   

    //this.Ipbillform.get('GenerateBill').setValue(false);
  } 
  SaveBill1() {  
    if (this.dataSource.data.length > 0 && (this.vNetBillAmount > 0)) {
      this.isLoading = 'submit';
      if(this.Ipbillform.get('CreditBill').value || this.selectedAdvanceObj.CompanyId){
        this.IPCreditBill();
      }
      else{
      let PatientHeaderObj = {};
      PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
      PatientHeaderObj['Date'] = this.dateTimeObj.date;
      PatientHeaderObj['UHIDNO'] =this.selectedAdvanceObj.RegNo;
      PatientHeaderObj['DoctorName'] = this.selectedAdvanceObj.Doctorname;
      PatientHeaderObj['IPDNo'] = this.selectedAdvanceObj.IPDNo ; // this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value;
      PatientHeaderObj['NetPayAmount'] = this.Ipbillform.get('FinalAmount').value;
      PatientHeaderObj['AdvanceAmount'] = this.Ipbillform.get('FinalAmount').value;
      PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;

        console.log('============================== Save IP Billing ===========');
      //==============-======--==============Payment======================
      // IPAdvancePaymentComponent
      this.advanceDataStored.storage = new AdvanceDetailObj(PatientHeaderObj);
      const dialogRef = this._matDialog.open(IPpaymentWithadvanceComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            vPatientHeaderObj: PatientHeaderObj,
            FromName: "IP-Bill",
            advanceObj: PatientHeaderObj
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        // console.log('============================== Save IP Billing ===========');
        console.log(result);
         
        this.flagSubmit = result.IsSubmitFlag

        if (this.flagSubmit) {  
          this.paidamt = result.PaidAmt;
          this.balanceamt = result.BalAmt; 
        } 
        else {  
          this.balanceamt = result.BalAmt;
        } 
        let InsertBillUpdateBillNoObj = {};
        InsertBillUpdateBillNoObj['BillNo'] = 0; 
        InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,
        InsertBillUpdateBillNoObj['TotalAmt'] = this.vTotalAmount || 0; 
        InsertBillUpdateBillNoObj['ConcessionAmt'] = this.Ipbillform.get('concessionAmt').value || 0;
        InsertBillUpdateBillNoObj['NetPayableAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
        InsertBillUpdateBillNoObj['PaidAmt'] = this.paidamt,
        InsertBillUpdateBillNoObj['BalanceAmt'] = this.balanceamt, 
        InsertBillUpdateBillNoObj['BillDate'] = this.dateTimeObj.date;
        InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 1;
        InsertBillUpdateBillNoObj['AddedBy'] = this.accountService.currentUserValue.user.id,
        InsertBillUpdateBillNoObj['TotalAdvanceAmount'] =  this.vAdvTotalAmount || 0,
        InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.time;
        InsertBillUpdateBillNoObj['ConcessionReasonId'] = this.Ipbillform.get('ConcessionId').value.ConcessionId || 0
        InsertBillUpdateBillNoObj['IsSettled'] = 0;
        InsertBillUpdateBillNoObj['IsPrinted'] = 1;
        InsertBillUpdateBillNoObj['IsFree'] = 0;
        InsertBillUpdateBillNoObj['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
        InsertBillUpdateBillNoObj['TariffId'] = this.selectedAdvanceObj.TariffId || 0,
        InsertBillUpdateBillNoObj['UnitId'] = this.selectedAdvanceObj.UnitId || 0;
        InsertBillUpdateBillNoObj['InterimOrFinal'] = 0;
        InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
        InsertBillUpdateBillNoObj['ConcessionAuthorizationName'] = 0;
        InsertBillUpdateBillNoObj['TaxPer'] = this.Ipbillform.get('AdminPer').value || 0;
        InsertBillUpdateBillNoObj['TaxAmount'] = this.Ipbillform.get('AdminAmt').value || 0;
        InsertBillUpdateBillNoObj['DiscComments'] = this.Ipbillform.get('Remark').value || '';
        InsertBillUpdateBillNoObj['CompDiscAmt'] = 0//this.InterimFormGroup.get('Remark').value || ''; 
        InsertBillUpdateBillNoObj['cashCounterId'] = this.Ipbillform.get('CashCounterID').value.CashCounterId || 0;

        let Billdetsarr = []; 
        this.dataSource.data.forEach((element) => {
          let BillDetailsInsertObj = {};
          BillDetailsInsertObj['BillNo'] = 0;
          BillDetailsInsertObj['ChargesId'] = element.ChargesId;
          Billdetsarr.push(BillDetailsInsertObj);
        });

        let Cal_DiscAmount_IPBillObj = {};
        Cal_DiscAmount_IPBillObj['BillNo'] = 0;

        let AdmissionIPBillingUpdateObj = {};
        AdmissionIPBillingUpdateObj['AdmissionID'] = this.selectedAdvanceObj.AdmissionID;

        // const InsertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);
        // const Cal_DiscAmount_IPBill = new Cal_DiscAmount(Cal_DiscAmount_IPBillObj);
        // const AdmissionIPBillingUpdate = new AdmissionIPBilling(AdmissionIPBillingUpdateObj); 
        
        let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];
        UpdateAdvanceDetailarr1 = result.submitDataAdvancePay; 

        // new
        let UpdateBillBalAmtObj = {};
        UpdateBillBalAmtObj['BillNo'] = 0;
        UpdateBillBalAmtObj['BillBalAmount'] = this.balanceamt;


        let UpdateAdvanceDetailarr = [];
        if (result.submitDataAdvancePay.length > 0) {
          result.submitDataAdvancePay.forEach((element) => {
            let UpdateAdvanceDetailObj = {};
            UpdateAdvanceDetailObj['AdvanceDetailID'] = element.AdvanceDetailID;
            UpdateAdvanceDetailObj['UsedAmount'] = element.UsedAmount;
            UpdateAdvanceDetailObj['BalanceAmount'] = element.BalanceAmount;
            UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
          }); 
        }
        else {
          let UpdateAdvanceDetailObj = {};
          UpdateAdvanceDetailObj['AdvanceDetailID'] = 0,
            UpdateAdvanceDetailObj['UsedAmount'] = 0,
            UpdateAdvanceDetailObj['BalanceAmount'] = 0,
            UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
        }

        let UpdateAdvanceHeaderObj = {};
        if (result.submitDataAdvancePay.length > 0) {
          UpdateAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceId'],
            UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = UpdateAdvanceDetailarr1[0]['AdvanceAmount'],
            UpdateAdvanceHeaderObj['BalanceAmount'] = UpdateAdvanceDetailarr1[0]['BalanceAmount']
        }
        else {
          UpdateAdvanceHeaderObj['AdvanceId'] = 0,
            UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
            UpdateAdvanceHeaderObj['BalanceAmount'] = 0
        }

        if (this.flagSubmit == true) {
          let submitData = {
            "InsertBillUpdateBillNo": InsertBillUpdateBillNoObj,
            "BillDetailsInsert": Billdetsarr,
            "Cal_DiscAmount_IPBill": Cal_DiscAmount_IPBillObj,
            "AdmissionIPBillingUpdate": AdmissionIPBillingUpdateObj,
            "ipInsertPayment": result.submitDataPay.ipPaymentInsert,
            "ipBillBalAmount": UpdateBillBalAmtObj,
            "ipAdvanceDetailUpdate": UpdateAdvanceDetailarr,
            "ipAdvanceHeaderUpdate": UpdateAdvanceHeaderObj

          };
          console.log(submitData)
          this._IpSearchListService.InsertIPBilling(submitData).subscribe(response => {
            if (response) {

              Swal.fire('Bill successfully !', 'IP final Bill generated successfully !', 'success').then((result) => {
                if (result.isConfirmed) { 
                  this._matDialog.closeAll();
                  this.viewgetBillReportPdf(response);
                  this.getWhatsappshareIPFinalBill(response,this.vMobileNo)
                }
              });
            } else {
              Swal.fire('Error !', 'IP Final Billing data not saved', 'error');
            }
            this.isLoading = '';
          });
        } 
      }); 
    }
    } 
    this.Ipbillform.get('CashCounterID').setValue(this.setcashCounter) 
    this.advanceDataStored.storage = [];
  } 
  IPCreditBill(){ 
    if(this.Ipbillform.get('CreditBill').value){   
    let InsertBillUpdateBillNoObj = {};
    InsertBillUpdateBillNoObj['BillNo'] = 0;
    InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,
    InsertBillUpdateBillNoObj['totalAmt'] = this.vTotalAmount || 0;
    InsertBillUpdateBillNoObj['ConcessionAmt'] = this.Ipbillform.get('concessionAmt').value || 0;
    InsertBillUpdateBillNoObj['NetPayableAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
    InsertBillUpdateBillNoObj['PaidAmt'] = 0;
    InsertBillUpdateBillNoObj['BalanceAmt'] =  this.Ipbillform.get('FinalAmount').value || 0;
    InsertBillUpdateBillNoObj['BillDate'] = this.dateTimeObj.date;
    InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 1;
    InsertBillUpdateBillNoObj['AddedBy'] = this.accountService.currentUserValue.user.id,
    InsertBillUpdateBillNoObj['TotalAdvanceAmount'] = this.vAdvTotalAmount || 0,
    InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.time;
    InsertBillUpdateBillNoObj['ConcessionReasonId'] = this.Ipbillform.get('ConcessionId').value.ConcessionId || 0 ,//this.ConcessionId;
    InsertBillUpdateBillNoObj['IsSettled'] = false;
    InsertBillUpdateBillNoObj['IsPrinted'] = true;
    InsertBillUpdateBillNoObj['IsFree'] = false;
    InsertBillUpdateBillNoObj['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
    InsertBillUpdateBillNoObj['TariffId'] = this.selectedAdvanceObj.TariffId || 0,
    InsertBillUpdateBillNoObj['UnitId'] = this.selectedAdvanceObj.UnitId || 0;
    InsertBillUpdateBillNoObj['InterimOrFinal'] = 0;
    InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
    InsertBillUpdateBillNoObj['ConcessionAuthorizationName'] = 0;
    InsertBillUpdateBillNoObj['TaxPer'] = this.Ipbillform.get('AdminPer').value || 0;
    InsertBillUpdateBillNoObj['TaxAmount'] = this.Ipbillform.get('AdminAmt').value || 0;
    InsertBillUpdateBillNoObj['DiscComments'] = this.Ipbillform.get('Remark').value || '';
    InsertBillUpdateBillNoObj['CompDiscAmt'] = 0//this.InterimFormGroup.get('Remark').value || '';
    InsertBillUpdateBillNoObj['cashCounterId'] = this.Ipbillform.get('CashCounterID').value.CashCounterId || 0;
    
    //const InsertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);

    let billDetailscreditInsert = [];
    this.dataSource.data.forEach((element) => {
      let BillDetailsInsertObj = {};
      BillDetailsInsertObj['BillNo'] = 0;
      BillDetailsInsertObj['ChargesId'] = element.ChargesId;
      billDetailscreditInsert.push(BillDetailsInsertObj);
    });

    let Cal_DiscAmount_IPBillObj = {};
    Cal_DiscAmount_IPBillObj['BillNo'] = 0;

    //const cal_DiscAmount_IPBillcredit = new Bill(Cal_DiscAmount_IPBillObj);

    let AdmissionIPBillingUpdateObj = {};
    AdmissionIPBillingUpdateObj['AdmissionID'] = this.selectedAdvanceObj.AdmissionID;

    //const admissionIPBillingcreditUpdate = new Bill(AdmissionIPBillingUpdateObj);

    let ipBillBalAmountcreditObj = {};
    // let BillBalAmt = 0;
    // BillBalAmt = this.Ipbillform.get('FinalAmount').value
    ipBillBalAmountcreditObj['BillNo'] = 0;
    ipBillBalAmountcreditObj['BillBalAmount'] =parseFloat(this.Ipbillform.get('FinalAmount').value) || 0;

    //const ipBillBalAmountcredit = new Bill(ipBillBalAmountcreditObj)

    let ipAdvanceDetailUpdatecedit = []; 

      let UpdateAdvanceDetailObj = {};
      UpdateAdvanceDetailObj['AdvanceDetailID'] = 0,
      UpdateAdvanceDetailObj['UsedAmount'] = 0,
      UpdateAdvanceDetailObj['BalanceAmount'] = 0,
      ipAdvanceDetailUpdatecedit.push(UpdateAdvanceDetailObj); 

     let UpdateAdvanceHeaderObj = {}; 
      UpdateAdvanceHeaderObj['AdvanceId'] = 0,
      UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
      UpdateAdvanceHeaderObj['BalanceAmount'] = 0

      let submitData = {
        "insertBillcreditUpdateBillNo": InsertBillUpdateBillNoObj,
        "billDetailscreditInsert": billDetailscreditInsert,
        "cal_DiscAmount_IPBillcredit": Cal_DiscAmount_IPBillObj,
        "admissionIPBillingcreditUpdate": AdmissionIPBillingUpdateObj,
        "ipBillBalAmountcredit": ipBillBalAmountcreditObj,
        "ipAdvanceDetailUpdatecedit": ipAdvanceDetailUpdatecedit,
        "ipAdvanceHeaderUpdatecredit": UpdateAdvanceHeaderObj
      };
      console.log(submitData);
      this._IpSearchListService.InsertIPBillingCredit(submitData).subscribe(response => {
        if (response) {
          Swal.fire('Bill successfully !', 'IP final bill Credited successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
              this.viewgetBillReportPdf(response);
            }
          });
        } else {
          Swal.fire('Error !', 'IP Final Billing Credited data not saved', 'error');
        }
        this.isLoading = '';
      }); 
    }
    else{
      Swal.fire('check is a credit bill or not ')
    }
    this.Ipbillform.get('CashCounterID').setValue(this.setcashCounter) 
    this.advanceDataStored.storage = [];
  }
  onSaveDraft() { 
    if (this.dataSource.data.length > 0 && (this.vNetBillAmount > 0)) {
      this.chargeslist = this.dataSource;
      this.isLoading = 'submit';

      let InsertDraftBillOb = {};
      InsertDraftBillOb['drbNo'] = 0;
      InsertDraftBillOb['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,
      InsertDraftBillOb['TotalAmt'] = this.vTotalAmount || 0;
      InsertDraftBillOb['ConcessionAmt'] =  this.vDiscountAmount || this.Ipbillform.get('concessionAmt').value || 0;
      InsertDraftBillOb['NetPayableAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
      InsertDraftBillOb['PaidAmt'] = 0;
      InsertDraftBillOb['BalanceAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
      InsertDraftBillOb['BillDate'] = this.dateTimeObj.date;
      InsertDraftBillOb['OPD_IPD_Type'] = 1;
      InsertDraftBillOb['AddedBy'] = this.accountService.currentUserValue.user.id,
      InsertDraftBillOb['TotalAdvanceAmount'] = 0;
      InsertDraftBillOb['BillTime'] = this.dateTimeObj.time;
      InsertDraftBillOb['ConcessionReasonId'] = this.Ipbillform.get('ConcessionId').value.ConcessionId || 0
      InsertDraftBillOb['IsSettled'] = 0;
      InsertDraftBillOb['IsPrinted'] = 0;
      InsertDraftBillOb['IsFree'] = 0;
      InsertDraftBillOb['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
      InsertDraftBillOb['TariffId'] = 3,//this.selectedAdvanceObj.TariffId || 0,
      InsertDraftBillOb['UnitId'] = this.selectedAdvanceObj.UnitId || 0,
      InsertDraftBillOb['InterimOrFinal'] = 0;
      InsertDraftBillOb['CompanyRefNo'] = 0;
      InsertDraftBillOb['ConcessionAuthorizationName'] = '';
      InsertDraftBillOb['TaxPer'] = this.Ipbillform.get('AdminPer').value || 0;
      InsertDraftBillOb['TaxAmount'] = this.Ipbillform.get('AdminAmt').value || 0;

      let DraftBilldetsarr = [];
      this.dataSource.data.forEach((element) => {
        let DraftBillDetailsInsertObj = {};
        DraftBillDetailsInsertObj['DRNo'] = 0;
        DraftBillDetailsInsertObj['ChargesId'] = element.ChargesId;
        DraftBilldetsarr.push(DraftBillDetailsInsertObj);
      });

      const InsertDraftBillObj = new DraftBill(InsertDraftBillOb);
      console.log('============================== Save IP Billing ===========');
      let submitData = {
        "ipIntremdraftbillInsert": InsertDraftBillObj,
        "interimBillDetailsInsert": DraftBilldetsarr
      };
      console.log(submitData)
      this._IpSearchListService.InsertIPDraftBilling(submitData).subscribe(response => {
        if (response) {
          Swal.fire('Draft Bill successfully!', 'IP Draft bill generated successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              if(this.Ipbillform.get("BillType").value==2)
              this.viewgetDraftBillservicePdf(response);
            else if(this.Ipbillform.get("BillType").value==1)
              this.viewgetDraftBillclassPdf(response);
            }
          });
        } else {
          Swal.fire('Error !', 'IP Draft Billing data not saved', 'error');
        }
        this.isLoading = '';
      });

    }else{
      Swal.fire('error !', 'Please select check box ', 'error');
    }
    this._matDialog.closeAll();
  }

  onClose() {
    this.dialogRef.close({ result: "cancel" });
    this.advanceDataStored.storage = [];
  }
  chkprint: boolean = false;
  AdList:boolean=false;
  viewgetIPAdvanceReportPdf(contact) {
    this.chkprint = true;
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      // this.SpinLoading =true;
      this.AdList = true;

      this._IpSearchListService.getViewAdvanceReceipt(
        contact.AdvanceDetailID
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Ip advance Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
        });
      });

    }, 100)
    this.chkprint = false;
  }
  // onwhatsappbill() {
  getWhatsappshareIPFinalBill(el, vmono) {

    if (vmono != '' && vmono != "0") {
      var m_data = {
        "insertWhatsappsmsInfo": {
          "mobileNumber": vmono || 0,
          "smsString": '',
          "isSent": 0,
          "smsType": 'IPBill',
          "smsFlag": 0,
          "smsDate": this.currentDate,
          "tranNo": el,
          "PatientType": 2,//el.PatientType,
          "templateId": 0,
          "smSurl": "info@gmail.com",
          "filePath": '',
          "smsOutGoingID": 0
        }
      }
      this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
        if (response) {
          this.toastr.success('IP Final Bill Sent on WhatsApp Successfully.', 'Save !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
        } else {
          this.toastr.error('API Error!', 'Error WhatsApp!', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  }
  // exec rptIPDInterimBill 193667 9507 
  viewgetInterimBillReportPdf(contact) {
    this._IpSearchListService.getIpInterimBillReceipt(
      contact.BillNo
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Ip Interim Bill  Viewer"
          }
        });
    });
  }
  //For testing 
  viewgetDraftBillservicePdf(AdmissionID) {
    this._IpSearchListService.getIpDraftBillServicewiseReceipt(
      AdmissionID
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "IP Draft Bill Service Wise Viewer"
          }
        });
    });
  }
  viewgetBillReportPdf(BillNo) {
    debugger
    console.log(BillNo)
    this._IpSearchListService.getIpFinalBillReceiptgroupwise(
      BillNo
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Ip Bill  Viewer"
          }
        });
    });
  }

  viewgetDraftBillclassPdf(BillNo) {
    debugger
    console.log(BillNo)
    this._IpSearchListService.getIpDraftBillclasswise(
      BillNo
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Ip Draft Bill Class Wise Viewer"
          }
        });
    });
  }

  
  getBillingClassCombo() {
    this._IpSearchListService.getClassList({ "Id": this.selectedAdvanceObj.ClassId }).subscribe(data => {
      this.BillingClassCmbList = data;
      this.Serviceform.get('ClassId').setValue(this.BillingClassCmbList[0]);
    });
  } 
  getIPBillinginformation() {
    this._IpSearchListService.getIpPatientBillInfo({ "AdmissionId": this.selectedAdvanceObj.AdmissionID }).subscribe(data => {
      this.IPBillingInfor = data 
    });
  }

  add: Boolean = false;

  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('doctorname') doctorname: ElementRef;
  @ViewChild('disc') disc: ElementRef;
  @ViewChild('discamt') discamt: ElementRef; 
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('Netamt') Netamt: ElementRef;
  @ViewChild('price') price: ElementRef;
  @ViewChild('finaldisc') finaldisc: ElementRef; 
  @ViewChild('addbutton') addbutton: ElementRef;

  onEnterservice(event): void { 
    if (event.which === 13) { 
      this.price.nativeElement.focus();
    }
  } 
  public onEnterprice(event): void { 
    if (event.which === 13) {
      this.qty.nativeElement.focus(); 
    }
  }
  public onEnterqty(event): void {
    if (event.which === 13) {
      if (this.isDoctor) {
        this.doctorname.nativeElement.focus();
      }
      else {
        this.disc.nativeElement.focus(); 
      }
      //this.disc.nativeElement.focus();
    }
  } 
  public onEnterdoctor(event): void { 
    if (event.which === 13) { 
      this.disc.nativeElement.focus(); 
    }
  }

  public onEnterdiscper(event,value): void { 
    if (event.which === 13) { 
        this.discamt.nativeElement.focus(); 
     
      // if (!(value < 0) && !(value > 100)) {
      //   this.discamt.nativeElement.focus();
      // } else if (event.which === 13 && (parseInt(value) < 0 && parseInt(value) > 100)) {
      //   this.toastr.warning('Please Enter disc % less than 100 and Greater than 0  ', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   });
      //   this.discamt.nativeElement.focus();
      //   return;
      //   this.calculateServicePersc();
      //   this.disc.nativeElement.focus();
      // }
    }
  } 
  public onEnterdiscamt(event): void {
    if (event.which === 13) {
      this.Netamt.nativeElement.focus();
    }
  } 
  addData() {
    this.add = true;
    this.addbutton.nativeElement.focus();
  }
  public onEnternetAmount(event): void { 
    if (event.which === 13) {
      this.add = true;
      this.addbutton.nativeElement.focus();
    }
  }


  getPreBilldet(contact) {
    //console.log(contact)
    const dialogRef = this._matDialog.open(PrebillDetailsComponent,
      {
        maxWidth: "100%",
        height: '60%',
        width: '74%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  } 
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => { 
    // console.log('tabChangeEvent => ', tabChangeEvent); 
    // console.log('index => ', tabChangeEvent.index); 
    if (tabChangeEvent.index == 1) {
      this.getAdvanceDetList();
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
  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  onOptionSelected(selectedItem) {
    this.vPrice = selectedItem.Price
    this.vServiceTotalAmt = selectedItem.Price
    this.vServiceDisAmt = 0;
    this.vServiceNetAmt = selectedItem.Price
    this.b_IsEditable = selectedItem.IsEditable
    this.b_IsDocEditable = selectedItem.IsDocEditable
    this.b_isPath = selectedItem.IsPathology
    this.b_isRad = selectedItem.IsRadiology
    this.serviceId = selectedItem.ServiceId;
    this.serviceName = selectedItem.ServiceName; 
  }
}

export class Bill {
  AdmissionID: any;
  BillNo: number;
  OPD_IPD_ID: number;
  TotalAmt: any;
  ConcessionAmt: any;
  NetPayableAmt: any;
  PaidAmt: any;
  BalanceAmt: any;
  BillDate: any;
  OPD_IPD_Type: any;
  AddedBy: any;
  TotalAdvanceAmount: any;
  BillTime: any;
  ConcessionReasonId: any;
  IsSettled: boolean;
  IsPrinted: boolean;
  IsFree: boolean;
  CompanyId: any;
  TariffId: any;
  UnitId: any;
  InterimOrFinal: any;
  CompanyRefNo: any;
  ConcessionAuthorizationName: any;
  TaxPer: any;
  TaxAmount: any;
  DiscComments: String;
  vCashCounterID: any;
  Bdate: any;
  PBillNo: any;
  CashPayAmount: any;
  ChequePayAmount: any;
  CardPayAmount: any;
  AdvanceUsedAmount: any;
  PatientName: any;
  PriceEditable:any;
  QtyEditable:any;
  Qty:any;
  Price:any;

  constructor(InsertBillUpdateBillNoObj) {
    this.AdmissionID = InsertBillUpdateBillNoObj.AdmissionID || 0;
    this.BillNo = InsertBillUpdateBillNoObj.BillNo || 0;
    this.OPD_IPD_ID = InsertBillUpdateBillNoObj.OPD_IPD_ID || 0;
    this.TotalAmt = InsertBillUpdateBillNoObj.TotalAmt || 0;
    this.ConcessionAmt = InsertBillUpdateBillNoObj.ConcessionAmt || 0;
    this.NetPayableAmt = InsertBillUpdateBillNoObj.NetPayableAmt || 0;
    this.PaidAmt = InsertBillUpdateBillNoObj.PaidAmt || '0';
    this.BalanceAmt = InsertBillUpdateBillNoObj.BalanceAmt || '0';
    this.BillDate = InsertBillUpdateBillNoObj.BillDate || '';
    this.OPD_IPD_Type = InsertBillUpdateBillNoObj.OPD_IPD_Type || '0';
    this.AddedBy = InsertBillUpdateBillNoObj.AddedBy || '0';
    this.TotalAdvanceAmount = InsertBillUpdateBillNoObj.TotalAdvanceAmount || '0';
    this.BillTime = InsertBillUpdateBillNoObj.BillTime || '';
    this.ConcessionReasonId = InsertBillUpdateBillNoObj.ConcessionReasonId || '0';
    this.IsSettled = InsertBillUpdateBillNoObj.IsSettled || 0;
    this.IsPrinted = InsertBillUpdateBillNoObj.IsPrinted || 0;
    this.IsFree = InsertBillUpdateBillNoObj.IsFree || 0;
    this.CompanyId = InsertBillUpdateBillNoObj.CompanyId || '0';
    this.TariffId = InsertBillUpdateBillNoObj.TariffId || '0';
    this.UnitId = InsertBillUpdateBillNoObj.UnitId || '0';
    this.InterimOrFinal = InsertBillUpdateBillNoObj.InterimOrFinal || '0';
    this.CompanyRefNo = InsertBillUpdateBillNoObj.CompanyRefNo || '0';
    this.ConcessionAuthorizationName = InsertBillUpdateBillNoObj.ConcessionAuthorizationName || '0';
    this.TaxPer = InsertBillUpdateBillNoObj.TaxPer || '0';
    this.TaxAmount = InsertBillUpdateBillNoObj.TaxAmount || '0';
    this.DiscComments = InsertBillUpdateBillNoObj.DiscComments || '';
    this.vCashCounterID = InsertBillUpdateBillNoObj.CashCounterID || '';
    this.Bdate = InsertBillUpdateBillNoObj.Bdate || '';

    this.PBillNo = InsertBillUpdateBillNoObj.PBillNo || '0';
    this.CashPayAmount = InsertBillUpdateBillNoObj.CashPayAmount || '0';
    this.ChequePayAmount = InsertBillUpdateBillNoObj.ChequePayAmount || '';
    this.CardPayAmount = InsertBillUpdateBillNoObj.CardPayAmount || '';
    this.AdvanceUsedAmount = InsertBillUpdateBillNoObj.AdvanceUsedAmount || '';
    this.PatientName = InsertBillUpdateBillNoObj.PatientName || ''
  }

}

export class BillDetails {
  BillNo: number;
  ChargesID: number;

  constructor(BillDetailsInsertObj) {
    this.BillNo = BillDetailsInsertObj.BillNo || 0;
    this.ChargesID = BillDetailsInsertObj.ChargesID || 0;
  }

}
export class Cal_DiscAmount {
  BillNo: number;

  constructor(Cal_DiscAmount_IPBillObj) {
    this.BillNo = Cal_DiscAmount_IPBillObj.BillNo || 0;
  }

}

export class AdmissionIPBilling {
  AdmissionID: number;

  constructor(Cal_DiscAmount_IPBillObj) {
    this.AdmissionID = Cal_DiscAmount_IPBillObj.AdmissionID || 0;
  }

}


export class PatientBilldetail {
  AdmissionID: Number;
  BillNo: any;
  BillDate: Date;
  concessionReasonId: number;
  tariffId: number;
  RemarkofBill: string
  /**
 * Constructor
 *
 * @param PatientBilldetail
 */
  constructor(PatientBilldetail) {
    {
      this.AdmissionID = PatientBilldetail.AdmissionID || '';
      this.BillNo = PatientBilldetail.BillNo || '';
      this.BillDate = PatientBilldetail.BillDate || '';
      this.concessionReasonId = PatientBilldetail.concessionReasonId || '';
      this.tariffId = PatientBilldetail.tariffId || '';
      this.RemarkofBill = PatientBilldetail.RemarkofBill;
    }
  }
}


export class DraftBill {
 
  OPD_IPD_ID: number;
  TotalAmt: any;
  ConcessionAmt: any;
  NetPayableAmt: any;
  PaidAmt: any;
  BalanceAmt: any;
  BillDate: any;
  OPD_IPD_Type: any;
  AddedBy: any;
  TotalAdvanceAmount: any;
  BillTime: any;
  ConcessionReasonId: any;
  IsSettled: boolean;
  IsPrinted: boolean;
  IsFree: boolean;
  CompanyId: any;
  TariffId: any;
  UnitId: any;
  InterimOrFinal: any;
  CompanyRefNo: any;
  ConcessionAuthorizationName: any;
  TaxPer: any;
  TaxAmount: any;
  drbNo: any;
  
  constructor(DraftBill) {
    
    this.OPD_IPD_ID = DraftBill.OPD_IPD_ID || 0;
    this.TotalAmt = DraftBill.TotalAmt || 0;
    this.ConcessionAmt = DraftBill.ConcessionAmt || 0;
    this.NetPayableAmt = DraftBill.NetPayableAmt || 0;
    this.PaidAmt = DraftBill.PaidAmt || '0';
    this.BalanceAmt = DraftBill.BalanceAmt || '0';
    this.BillDate = DraftBill.BillDate || '';
    this.OPD_IPD_Type = DraftBill.OPD_IPD_Type || '0';
    this.AddedBy = DraftBill.AddedBy || '0';
    this.TotalAdvanceAmount = DraftBill.TotalAdvanceAmount || '0';
    this.BillTime = DraftBill.BillTime || '';
    this.ConcessionReasonId = DraftBill.ConcessionReasonId || '0';
    this.IsSettled = DraftBill.IsSettled || 0;
    this.IsPrinted = DraftBill.IsPrinted || 0;
    this.IsFree = DraftBill.IsFree || 0;
    this.CompanyId = DraftBill.CompanyId || '0';
    this.TariffId = DraftBill.TariffId || '0';
    this.UnitId = DraftBill.UnitId || '0';
    this.InterimOrFinal = DraftBill.InterimOrFinal || '0';
    this.CompanyRefNo = DraftBill.CompanyRefNo || '0';
    this.ConcessionAuthorizationName = DraftBill.ConcessionAuthorizationName || '0';
    this.TaxPer = DraftBill.TaxPer || '0';
    this.TaxAmount = DraftBill.TaxAmount || '0';
    this.drbNo = DraftBill.drbNo || 0;
  
  }

}