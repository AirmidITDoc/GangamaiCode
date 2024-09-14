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
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ConfigService } from 'app/core/services/config.service';
import { PrebillDetailsComponent } from '../ip-billing/prebill-details/prebill-details.component';

@Component({
  selector: 'app-company-bill',
  templateUrl: './company-bill.component.html',
  styleUrls: ['./company-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CompanyBillComponent implements OnInit {
  displayedColumns = [
    'IsCheck',
    'ChargesDate',
    'ServiceName',
    'Price',
    'Qty',
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
    'Price'
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
  filteredOptionsBillingClassName: Observable<string[]>;
  vCompanyDiscAmt:any; 
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

  
    dataSource = new MatTableDataSource<ChargesList>();
    dataSource1 = new MatTableDataSource<ChargesList>();
    prevbilldatasource = new MatTableDataSource<Bill>();
    advancedatasource = new MatTableDataSource<IpdAdvanceBrowseModel>();
    PackageDatasource = new MatTableDataSource
  
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
    vserviceTotalAmt = '0';
    vServiceNetAmount = '0';
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
    netPaybleAmt: any = 0;
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
    vfDiscountAmount: any;
    vpaidBalanceAmt: any = 0;
    vConcessionId: any = 0;
    vPercentage: any = 0;
    vserviceDiscflag: boolean = false;
  
    isClasselected: boolean = false;
    isSrvcNameSelected: boolean = false;
    isDoctorSelected: boolean = false;
  
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('drawer') public drawer: MatDrawer;
  
    ConShow: boolean = false;
  
    isLoading: String = '';
    selectedAdvanceObj: AdvanceDetailObj;
    isFilteredDateDisabled: boolean = false;
    Admincharge: boolean = true;
    doctorNameCmbList: any = [];
    BillingClassCmbList: any = [];
    IPBillingInfor: any = [];
    Ipbillform: FormGroup;
    Serviceform: FormGroup;
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
    filteredOptionsDoctors: any;
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
      private dialogRef: MatDialogRef<CompanyBillComponent>,
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
      }
  
      this.myControl = new FormControl();
  
   
      this.getBillingClasslist();
      this.getServiceListCombobox(); 
      this.getChargesList();
      this.getRequestChargelist();
      this.getBillingClassCombo();
      this.getCashCounterComboList();
      this.getConcessionReasonList();
      this.getPrevBillList();
      this.getAdvanceDetList();
      this.calBalanceAmt();
      this.getBillheaderList();  
      this.setClassdata();  
      this.getPharmacyAmount();
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
        ChargeClass: [''],
        TableClassName:['']
      });
    }
  
    createBillForm() {
      this.Ipbillform = this.formBuilder.group({
        TotalAmt: [0],
        Percentage: [''],
        concessionAmt: [''],
        ConcessionId: 0,
        Remark: [''], 
        FinalAmount: 0,
        CashCounterID: [''],
        IpCash: [''],
        Pharcash: [''],
        ChargeClass: [''],
        AdminPer: [''],
        AdminAmt: [''],
        Admincheck:[''],
        CompanyDiscAmt:['']
      });
    }
  //Service Date
  OnDateChange() {
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
  //Class list
  Tableclasslist:any=[];
  getBillingClasslist() {
    var m_data = {
      'ClassName': '%'
    }
    this._IpSearchListService.getseletclassMasterCombo(m_data).subscribe(data => {
      this.ClassList = data;
      this.Tableclasslist = data;
      //console.log(this.ClassList)
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
  private _filterclass(value: any): string[] {
    if (value) {
      const filterValue = value && value.ClassName ? value.ClassName.toLowerCase() : value.toLowerCase();
      return this.ClassList.filter(option => option.ClassName.toLowerCase().includes(filterValue));
    }
  }
  getSelectedObjClass(obj) {
    this.Serviceform.get('SrvcName').setValue('');
    this.Serviceform.get('price').setValue('');
    this.filteredOptions = [];
  }
  getOptionTextclass(option) {
    return option && option.ClassName ? option.ClassName : '';
  }
  //Service List
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
        // });
      }
    }
    getSelectedServiceObj(obj) {
    
      console.log(obj)
      this.SrvcName = obj.ServiceName;
      this.vPrice = obj.Price;
      this.vserviceTotalAmt = obj.Price;
      this.vServiceNetAmount = obj.Price;
      this.serviceId = obj.ServiceId;
      this.b_isPath = obj.IsPathology;
      this.b_isRad = obj.IsRadiology; 

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
    }
    getServiceOptionText(option) {
      if (!option)
        return ''; 
      return option && option.ServiceName ? option.ServiceName : '';
    }
    onScroll() {
      //Note: This is called multiple times after the scroll has reached the 80% threshold position.
      this.nextPage$.next();
    }

  //Doctor list 
  getAdmittedDoctorCombo() {
    var vdata = {
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
  getOptionTextDoctor(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }
    //add charges
    onSaveAddCharges() {
      if (( this.vselect== '' || this.vselect == null || this.vselect == undefined)) {
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
      if (( this.vserviceTotalAmt== '' || this.vserviceTotalAmt == null || this.vserviceTotalAmt == undefined || this.vserviceTotalAmt == '0')) {
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
      doctorid = this.Serviceform.get("DoctorID").value.DoctorID;
  
      let doctorName = '';
      if (this.Serviceform.get("DoctorID").value)
        doctorName = this.Serviceform.get("DoctorID").value.DoctorName;
  
      this.isLoading = 'save';
      if ((this.SrvcName && (parseInt(this.vPrice) > 0 || this.vPrice == '0') && this.vQty) && (parseFloat(this.vServiceNetAmount) > 0)) {
  
        var m_data = {
          "chargeID": 0,
          "chargesDate": this.datePipe.transform(this.Serviceform.get('Date').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
          "opD_IPD_Type": 1,
          "opD_IPD_Id": this.selectedAdvanceObj.AdmissionID,
          "serviceId": this.serviceId,
          "price": this.vPrice,
          "qty": this.vQty,
          "totalAmt": this.vserviceTotalAmt,
          "concessionPercentage": this.vServiceDiscPer || 0,
          "concessionAmount": this.vServiceDisAmt,
          "netAmount": this.vServiceNetAmount,
          "doctorId": doctorid,
          "doctorName": doctorName,
          "docPercentage": 0,
          "docAmt": 0,
          "hospitalAmt": this.FAmount,// this.vServiceNetAmount,
          "isGenerated": 0,
          "addedBy": this.accountService.currentUserValue.user.id,
          "isCancelled": 0,
          "isCancelledBy": 0,
          "isCancelledDate": "01/01/1900",
          "isPathology": this.b_isPath,
          "isRadiology": this.b_isRad,
          "isPackage": 0,
          "packageMainChargeID": 0,
          "isSelfOrCompanyService": false,
          "packageId": 0,
          "chargeTime":this.datePipe.transform(this.Serviceform.get('Date').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900', // this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
          "classId":this.Serviceform.get('ChargeClass').value.ClassId     // this.selectedAdvanceObj.ClassId,
        }
        console.log(m_data);
        let submitData = {
          "addCharges": m_data
        };
  
        this._IpSearchListService.InsertIPAddCharges(submitData).subscribe(data => {
          if (data) {
            this.getChargesList();
           
          }
        });
        this.onClearServiceAddList()
        this.isLoading = '';
        this.vServiceDisAmt = 0;
        this.interimArray = [];
      }
      else {
        Swal.fire("Enter Proper Values !")
      }
      this.itemid.nativeElement.focus();
      this.add = false;
      if (this.vServiceDiscPer > 0) {
        this.vserviceDiscflag = true;
        this.ServiceDiscDisable = false;
      }
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
    billheaderlist:any;
    getBillheaderList() {
      this.isLoadingStr = 'loading';
      let Query = "select Isnull(AdminPer,0) as AdminPer from Admission where AdmissionId="+  this.selectedAdvanceObj.AdmissionID
       console.log(Query);
       debugger
      this._IpSearchListService.getBillheaderList(Query).subscribe(data => {
        this.billheaderlist = data[0].AdminPer ;
       // console.log(this.billheaderlist)
          if(this.billheaderlist > 0){
            this.isAdminDisabled = true;
            this.Ipbillform.get('Admincheck').setValue(true)
            this.vAdminPer =this.billheaderlist
            console.log(this.vAdminPer)
          }else{
            this.isAdminDisabled = false;
            this.Ipbillform.get('Admincheck').setValue(false)
          }
      });
    }
  
  
    getDateTime(dateTimeObj) {
      this.dateTimeObj = dateTimeObj;
    }
  
    onOptionSelected(selectedItem) {
      this.vPrice = selectedItem.Price
      this.vserviceTotalAmt = selectedItem.Price
      this.vServiceDisAmt = 0;
      this.vServiceNetAmount = selectedItem.Price
      this.b_IsEditable = selectedItem.IsEditable
      this.b_IsDocEditable = selectedItem.IsDocEditable
      this.b_isPath = selectedItem.IsPathology
      this.b_isRad = selectedItem.IsRadiology
      this.serviceId = selectedItem.ServiceId;
      this.serviceName = selectedItem.ServiceName;
      // this.calculateTotalAmt();
    }
    isAdminDisabled : boolean=false;
    AdminStatus(event){
      if (event.checked == true)
        this.isAdminDisabled = true;
      if (event.checked == false) {
        this.isAdminDisabled = false;
        this.Ipbillform.get('AdminPer').reset();
        this.Ipbillform.get('AdminAmt').reset();
        this.Ipbillform.get('FinalAmount').setValue(this.vTotalBillAmount);
        this.CalFinalDisc1(); 
      }
    } 
 

    PharmacyAmont:any=0;
    getPharmacyAmount(){
      let Query = "select isnull(Sum(BalanceAmount),0) as PhBillCredit from T_SalesHeader where OP_IP_Type=1 and OP_IP_ID=" + this.selectedAdvanceObj.AdmissionID
      this._IpSearchListService.getPharmacyAmt(Query).subscribe((data) =>{
        //console.log(data)
        this.PharmacyAmont = data[0].PhBillCredit; 
      })
    }


    filteredDoctor: any;
    noOptionFoundsupplier: any;
    vClassId: any = 0;
    vClassName: any;
  

  
    private _filterDoctor(value: any): string[] {
      if (value) {
        const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
        return this.doctorNameCmbList.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
      }
    }
  
    onDropdownChange(element: any) {
      console.log('Selected Item:', element.itemName);
      // You can also update the price or perform other actions here
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
        // if (this.isDoctor) {
  
        //   
        // }
        // else {
        //   this.qty.nativeElement.focus();
  
        // }
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
          this.Serviceform.get('discPer').setValue(0);
          // this.calculateTotalAmt()
        }
        //this.disc.nativeElement.focus();
      }
    }
  
    public onEnterdoctor(event): void {
      // console.log(value)
  
      if (event.which === 13) {
  
        // if (this.isDoctor) {
        //   if ((value == '' || value == null || value == undefined || isNaN(value))) {
        //     this.toastr.warning('Please select Doctor', 'Warning !', {
        //       toastClass: 'tostr-tost custom-toast-warning',
        //     });
        //     return;
        //     this.doctorname.nativeElement.focus();
  
        //   } else if (value > 0) {
        //     this.disc.nativeElement.focus();
        //   }
        // }
        this.disc.nativeElement.focus();
        this.Serviceform.get('discPer').setValue(0);
      }
    }
  
    public onEnterdiscper(event, value): void {
      
      if (event.which === 13) {
        if (!(value < 0) && !(value > 100)) {
          // this.calculatePersc();
          this.discamt.nativeElement.focus();
        } else if (event.which === 13 && (parseInt(value) < 0 && parseInt(value) > 100)) {
          this.toastr.warning('Please Enter disc % less than 100 and Greater than 0  ', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
          this.calculatePersc();
          this.disc.nativeElement.focus();
        }
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
  
  
 
  
    getRequestChargelist() {
      this.chargeslist1 = [];
      this.dataSource1.data = [];
      var m = {
        OP_IP_ID: this.selectedAdvanceObj.AdmissionID,
      }
      this._IpSearchListService.getchargesList1(m).subscribe(data => {
        this.chargeslist1 = data as ChargesList[];
        this.dataSource1.data = this.chargeslist1;
        console.log(this.dataSource1.data)
        this.isLoading = 'list-loaded';
      },
        (error) => {
          this.isLoading = 'list-loaded';
        });
  
    }
  
    getChargesList() {
      this.chargeslist = [];
      this.dataSource.data = [];
      this.isLoadingStr = 'loading';
      let Query = "Select * from lvwAddCharges where IsGenerated=0 and IsPackage=0 and IsCancelled =0 AND OPD_IPD_ID=" + this.selectedAdvanceObj.AdmissionID + " and OPD_IPD_Type=1 Order by Chargesid"
      // console.log(Query);
      this._IpSearchListService.getchargesList(Query).subscribe(data => {
        this.chargeslist = data as ChargesList[];
        console.log(this.chargeslist)
        this.dataSource.data = this.chargeslist;
  
        this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
      },
        (error) => {
          this.isLoading = 'list-loaded';
        });
      this.setTableClassName();
      this.chkdiscstatus();
  
    }
    vTableClassName:any;
    setTableClassName(){
      debugger
      const dvalue = this.Tableclasslist.filter(item => item.ClassId == this.Serviceform.get('ChargeClass').value.ClassId )
      console.log(dvalue)
      this.Serviceform.get('TableClassName').setValue(dvalue);
      //       if(dvalue){
      //   let className = dvalue[0].ClassName ;
      //   this.vTableClassName = className;
      //   console.log(dvalue[0].ClassName )
      //   console.log(className)
      //   console.log(this.vTableClassName)
      // }
  
    }
  //Previouse Bill List
    getPrevBillList() {
      debugger
      var D_data = {
        "IP_Id": this.selectedAdvanceObj.AdmissionID
      }
      setTimeout(() => {
        this.sIsLoading = 'loading-data';
        this._IpSearchListService.getpreviousbilldetail(D_data).subscribe(Visit => {
          this.prevbilldatasource.data = Visit as Bill[];
           console.log(this.prevbilldatasource.data)
        },
          error => {
            this.sIsLoading = '';
          });
      }, 5);
    } 
    chkdiscstatus() { 
      if (this.vDiscountAmount == 0) {
        this.ServiceDiscDisable = true;
        // this.ConShow = true;
  
        // this.Ipbillform.get('ConcessionId').reset();
        // this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
        // this.Ipbillform.get('ConcessionId').enable;
        // this.Ipbillform.get('ConcessionId').updateValueAndValidity();
        // this.Consession = true;
      } else if (this.vDiscountAmount > 0) {
        this.ServiceDiscDisable = false;
        this.ConShow = true;
  
        this.Ipbillform.get('ConcessionId').reset();
        this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
        this.Ipbillform.get('ConcessionId').enable;
        this.Ipbillform.get('ConcessionId').updateValueAndValidity();
        this.Consession = true;
      }
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
          console.log(this.advancedatasource.data)
        },
          error => {
            this.sIsLoading = '';
          });
      }, 5);
    }
    getDatewiseChargesList(param) {
      // console.log(param);
      this.chargeslist = [];
      this.dataSource.data = [];
  
      this.isLoadingStr = 'loading';
      let Query = "Select * from lvwAddCharges where IsGenerated=0 and IsPackage=0 and IsCancelled =0 AND OPD_IPD_ID=" + this.selectedAdvanceObj.AdmissionID + " and OPD_IPD_Type=1 and ChargesDate ='" + this.datePipe.transform(param, "dd/MM/YYYY") + "' Order by Chargesid"
  
      console.log(Query)
      this._IpSearchListService.getchargesList(Query).subscribe(data => {
        this.chargeslist = data as ChargesList[];
        console.log(this.chargeslist)
        this.dataSource.data = this.chargeslist;
  
        this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
      },
        (error) => {
          this.isLoading = 'list-loaded';
        });
    }
  //Nursing list added in service list
    AddList(m) {
      console.log(m)
      var m_data = {
        "chargeID": 0,
        "chargesDate": this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
        "opD_IPD_Type": 1,
        "opD_IPD_Id": m.OP_IP_ID,
        "serviceId": m.ServiceId,
        "price": m.price, 
        "qty": 1, 
        "totalAmt": (m.price * 1),
        "concessionPercentage": 0, 
        "concessionAmount": 0,
        "netAmount": (m.price * 1),
        "doctorId": 0, 
        "docPercentage": 0,
        "docAmt": 0,
        "hospitalAmt": 0, 
        "isGenerated": 0,
        "addedBy": this.accountService.currentUserValue.user.id,
        "isCancelled": 0,
        "isCancelledBy": 0,
        "isCancelledDate": "01/01/1900",
        "isPathology": m.IsPathology, 
        "isRadiology": m.IsRadiology, 
        "isPackage": 0,
        "packageMainChargeID": 0,
        "isSelfOrCompanyService": false,
        "packageId": 0,
        "chargeTime": this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
        "classId": this.Serviceform.get("ChargeClass").value.ClassId 
      }
      let submitData = {
        "addCharges": m_data
      };
      this._IpSearchListService.InsertIPAddChargesNew(submitData).subscribe(data => {
        if (data) {
          Swal.fire('Success !', 'ChargeList Row Added Successfully', 'success');
          this.getChargesList(); 
        }
      });
      this.onClearServiceAddList()
      this.itemid.nativeElement.focus();
      this.isLoading = '';
  
    }
  
    getTotalAmount(element) {
      if (element.Price && element.Qty) {
        this.totalAmt = parseInt(element.Price) * parseInt(element.Qty);
        element.TotalAmt = this.totalAmt;
        element.NetAmount = this.totalAmt;
        this.getDiscAmount(element);
      }
    }
  
    getDiscAmount(element) {
      let netAmt = parseInt(element.Price) * parseInt(element.Qty);
      if (element.ConcessionPercentage) {
        this.discAmt = (netAmt * parseInt(element.ConcessionPercentage)) / 100;
        element.DiscAmt = this.discAmt;
        element.NetAmount = netAmt - this.discAmt;
      }
    }
  
    getDiscValue(element) {
      let netAmt = parseInt(element.Price) * parseInt(element.Qty);
      if (element.DiscAmt) {
        element.ConcessionPercentage = (parseInt(element.DiscAmt) * 100) / netAmt;
        element.NetAmount = netAmt - parseInt(element.DiscAmt);
      }
    }
    getConcessionReasonList() {
      this._IpSearchListService.getConcessionCombo().subscribe(data => {
        this.ConcessionReasonList = data;
        // this.Ipbillform.get('ConcessionId').setValue(this.ConcessionReasonList[1]);
      })
    } 
    setcashCounter:any;
    getCashCounterComboList() {
      debugger
      this._IpSearchListService.getCashcounterList().subscribe(data => {
        this.CashCounterList = data
        //console.log(this.CashCounterList)
  
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
    getOptionTextCashCounter(option){ 
      if (!option)
        return '';
      return option.CashCounterName;
    }
    vBillTotalAmt: any = 0;
  
    getNetAmtSum(element) {
      let netAmt, netAmt1;
      netAmt = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
      this.vTotalBillAmount = netAmt;
      this.vNetBillAmount = netAmt;
  
      netAmt1 = element.reduce((sum, { TotalAmt }) => sum += +(TotalAmt || 0), 0);
      this.vBillTotalAmt = netAmt1;
  
      if (this.vNetBillAmount < this.vAdvTotalAmount) {
        this.vBalanceAmt = parseInt(this.vAdvTotalAmount) - this.vNetBillAmount;
  
        this.vpaidBalanceAmt = 0;
      }
      return netAmt;
    }
   checkdiscAmt:any;
    getDiscountSum(element) {
      let netAmt;
      netAmt = element.reduce((sum, { ConcessionAmount }) => sum += +(ConcessionAmount || 0), 0);
      this.vDiscountAmount = netAmt;
      this.checkdiscAmt = netAmt
      this.vfDiscountAmount = this.vDiscountAmount;
      // this.Ipbillform.get("concessionAmt").setValue(this.vDiscountAmount)
  
      // console.log(this.vfDiscountAmount )
      if (this.vDiscountAmount > 0) {
        this.ServiceDiscDisable = false;
        this.ConShow = true;
      }else{
        this.ServiceDiscDisable = true;
        this.ConShow = true;
      }
      return netAmt;
    }
  
    vTotalAmount: any = 0;
    getTotalAmtSum(element) {
      let netAmt, netAmt1;
      netAmt = element.reduce((sum, { TotalAmt }) => sum += +(TotalAmt || 0), 0);
      this.vTotalAmount = netAmt;
      this.CalculateAdminCharge();
      return netAmt;
    }
    getAdvAmtSum(element) {
      let netAmt;
      netAmt = element.reduce((sum, { BalanceAmount }) => sum += +(BalanceAmount || 0), 0);
      this.vAdvTotalAmount = netAmt;
      // this.vNetBillAmount = this.vTotalBillAmount;
  
      // console.log(this.vAdvTotalAmount )
      if (this.vNetBillAmount > this.vAdvTotalAmount) {
        this.vBalanceAmt = 0;
        this.vpaidBalanceAmt = parseInt(this.vNetBillAmount) - parseInt(this.vAdvTotalAmount) 
      }
      return netAmt;
    }
  
  
    ServiceDiscDisable: boolean = false;
 
  
    vGenbillflag: boolean = false 

  CalculateAdminCharge() {
    if (this.vAdminPer > 0 && this.vAdminPer < 100) {
      this.vAdminAmt = Math.round((parseFloat(this.vTotalAmount) * parseFloat(this.vAdminPer)) / 100).toFixed(2);
      let netamt = (parseFloat(this.vTotalAmount) + parseFloat(this.vAdminAmt)).toFixed(2);
      if (this.checkdiscAmt > 0) {
        if (this.vCompanyDiscAmt > 0) {
          let netamt = (parseFloat(this.vTotalAmount) + parseFloat(this.vAdminAmt)).toFixed(2);
          let TotalDiscAmt = Math.round(parseFloat(this.vfDiscountAmount) + parseFloat(this.vCompanyDiscAmt)).toFixed(2);
          this.vNetBillAmount = Math.round(parseFloat(netamt) - parseFloat(TotalDiscAmt)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        } else {
          let netamt = (parseFloat(this.vTotalAmount) + parseFloat(this.vAdminAmt)).toFixed(2);
          let finalnetamt = (parseFloat(netamt) - parseFloat(this.vDiscountAmount)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(finalnetamt);
        }
      } else {
        let finalnetamt;
        let Percentage = this.Ipbillform.get('Percentage').value || 0;
        finalnetamt = netamt
        if (this.vCompanyDiscAmt > 0) {
          this.vfDiscountAmount = ((parseFloat(finalnetamt) * parseFloat(Percentage)) / 100).toFixed(2);
          let TotalDiscAmt = Math.round(parseFloat(this.vfDiscountAmount) + parseFloat(this.vCompanyDiscAmt)).toFixed(2);
          this.vNetBillAmount = Math.round(parseFloat(finalnetamt) - parseFloat(TotalDiscAmt)).toFixed(2);
          this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        } else {
          this.vfDiscountAmount = ((parseFloat(finalnetamt) * parseFloat(Percentage)) / 100).toFixed(2);
          this.vNetBillAmount = Math.round(parseFloat(finalnetamt) - parseFloat(this.vfDiscountAmount)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        }

      }
    } else {
      if (this.vAdminPer < 0 && this.vAdminPer > 100 || this.vAdminPer == 0 || this.vAdminPer == '') {
        this.Ipbillform.get('AdminPer').reset();
        this.Ipbillform.get('AdminAmt').reset();
        this.Ipbillform.get('FinalAmount').setValue(this.vTotalBillAmount);
        this.CalFinalDisc1();
      }
      if (this.vAdminPer > 100) {
        this.toastr.warning('Please Enter Admin % less than 100 and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.Ipbillform.get('AdminPer').reset();
        this.Ipbillform.get('AdminAmt').reset();
        this.Ipbillform.get('FinalAmount').setValue(this.vTotalBillAmount);
        this.CalFinalDisc1();
      }
    }
  }
  finalNetAmt: any;
  finalNetAmount: any;
  CalFinalDisc1() {
    let CompDiscAmt = this.Ipbillform.get('CompanyDiscAmt').value || 0;
    if (this.Ipbillform.get('AdminAmt').value > 0) {
      let Percentage = this.Ipbillform.get('Percentage').value;
      this.finalNetAmt = ((parseFloat(this.vNetBillAmount) + parseFloat(this.vAdminAmt)))

      if (this.Ipbillform.get('Percentage').value > 0 && Percentage < 100) {
        this.vfDiscountAmount = ((parseFloat(this.finalNetAmt) * parseFloat(Percentage)) / 100).toFixed(2);
        let totalDiscAmt = (parseFloat(this.vfDiscountAmount) + parseFloat(CompDiscAmt)).toFixed(2);
        this.vNetBillAmount = (parseFloat(this.finalNetAmt) - parseFloat(totalDiscAmt)).toFixed(2);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
        this.ConShow = true
        this.Ipbillform.get('ConcessionId').reset();
        this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
        this.Ipbillform.get('ConcessionId').enable;
      }
      else if (Percentage > 100 || Percentage < 0) {
        this.Ipbillform.get('FinalAmount').setValue(this.finalNetAmt);
        this.vfDiscountAmount = '';
        this.finaldisc.nativeElement.focus();
        this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
        this.toastr.warning('Please Enter Discount % less than 100 and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.vPercentage = '';
        return;
      }
      else if ((Percentage == 0 || Percentage == null || Percentage == ' ') && this.vDiscountAmount == 0) {
        this.Ipbillform.get('ConcessionId').reset();
        this.Ipbillform.get('ConcessionId').clearValidators();
        this.Ipbillform.get('ConcessionId').updateValueAndValidity();
        this.vfDiscountAmount = '';
        this.Ipbillform.get('FinalAmount').setValue(this.finalNetAmt);
        this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
        this.ConShow = false
      }
    }
    else {
      let Percentage = this.Ipbillform.get('Percentage').value;
      if (this.Ipbillform.get('Percentage').value > 0 && Percentage < 100) {
        this.vfDiscountAmount = Math.round((this.vNetBillAmount * parseInt(Percentage)) / 100).toFixed(2);
        let totalDiscAmt = (parseFloat(this.vfDiscountAmount) + parseFloat(CompDiscAmt)).toFixed(2);
        this.vNetBillAmount = (parseFloat(this.vTotalBillAmount) - parseFloat(totalDiscAmt)).toFixed(2);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
        this.ConShow = true
        this.Ipbillform.get('ConcessionId').reset();
        this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
        this.Ipbillform.get('ConcessionId').enable;
      }
      else if (Percentage > 100 || Percentage < 0) {
        this.Ipbillform.get('FinalAmount').setValue(this.vTotalBillAmount);
        this.vfDiscountAmount = '';
        this.finaldisc.nativeElement.focus();
        this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
        this.toastr.warning('Please Enter Discount % less than 100 and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.vPercentage = '';
        return;
      }
      else if ((Percentage == 0 || Percentage == null || Percentage == ' ') && this.vDiscountAmount == 0) {
        this.Ipbillform.get('ConcessionId').reset();
        this.Ipbillform.get('ConcessionId').clearValidators();
        this.Ipbillform.get('ConcessionId').updateValueAndValidity();
        this.vfDiscountAmount = '';
        this.vNetBillAmount = this.vTotalBillAmount;
        this.Ipbillform.get('FinalAmount').setValue(this.vTotalBillAmount);
        this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
        this.ConShow = false
      }
    }
  } 
  getDiscAmtCal1() {
    debugger
    let FinalDiscAmt = this.Ipbillform.get('concessionAmt').value || 0;
    let CompDiscAmt = this.Ipbillform.get('CompanyDiscAmt').value || 0;

    if (this.Ipbillform.get('AdminAmt').value > 0) {
      this.finalNetAmount = ((parseFloat(this.vNetBillAmount) + parseFloat(this.vAdminAmt))) || 0;
      if (FinalDiscAmt > this.finalNetAmount || CompDiscAmt > this.finalNetAmount) {
        Swal.fire('Discount Amount Should not be grather than Net Amount');
        this.vfDiscountAmount = '';
        return
      }
      if (FinalDiscAmt > 0 || CompDiscAmt > 0) {
        if (this.checkdiscAmt > 0) {
          this.vNetBillAmount = (parseFloat(this.finalNetAmount) - parseFloat(CompDiscAmt)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
          this.ConShow = true
          this.Ipbillform.get('ConcessionId').reset();
          this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
          this.Ipbillform.get('ConcessionId').enable;
        } else {
          this.vPercentage = ((parseFloat(FinalDiscAmt) / parseFloat(this.finalNetAmount)) * 100).toFixed(2);
          let totalDiscAmt = (parseFloat(FinalDiscAmt) + parseFloat(CompDiscAmt)).toFixed(2);
          this.vNetBillAmount = (parseFloat(this.finalNetAmount) - parseFloat(totalDiscAmt)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
          this.Ipbillform.get('Percentage').setValue(this.vPercentage);
          this.ConShow = true
          this.Ipbillform.get('ConcessionId').reset();
          this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
          this.Ipbillform.get('ConcessionId').enable;
        }
      }
      else if (FinalDiscAmt <= 0 || FinalDiscAmt == '' || FinalDiscAmt == null) {
        this.Ipbillform.get('FinalAmount').setValue(this.finalNetAmount);
        this.vPercentage = '';
        this.Ipbillform.get('Percentage').setValue(this.vPercentage);
        this.Ipbillform.get('ConcessionId').clearValidators();
        this.Ipbillform.get('ConcessionId').updateValueAndValidity();
        this.Consession = false;
        this.ConShow = false;
      } else if (CompDiscAmt <= 0 || CompDiscAmt == '' || CompDiscAmt == null) {
        this.vNetBillAmount = this.vTotalBillAmount;
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.Ipbillform.get('ConcessionId').clearValidators();
        this.Ipbillform.get('ConcessionId').updateValueAndValidity();
        this.Consession = false;
        this.ConShow = false;
      }
    }
    else {
      if (FinalDiscAmt > this.vNetBillAmount || CompDiscAmt > this.vNetBillAmount) {
        Swal.fire('Discount Amount Should not be grather than Net Amount');
        this.vfDiscountAmount = '';
        return
      }
      if (FinalDiscAmt > 0 || CompDiscAmt > 0) {
        if (this.checkdiscAmt > 0) {
          this.vNetBillAmount = (parseFloat(this.vNetBillAmount) - parseFloat(CompDiscAmt)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
          this.ConShow = true
          this.Ipbillform.get('ConcessionId').reset();
          this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
          this.Ipbillform.get('ConcessionId').enable;
        } else {
          this.vPercentage = (parseFloat(FinalDiscAmt) / parseFloat(this.vNetBillAmount) * 100).toFixed(2);
          let totalDiscAmt = (parseFloat(FinalDiscAmt) + parseFloat(CompDiscAmt)).toFixed(2);
          let FinalnetAmt = Math.round(parseFloat(this.vNetBillAmount) - parseFloat(totalDiscAmt)).toFixed(2);
          this.Ipbillform.get('FinalAmount').setValue(FinalnetAmt);
          this.ConShow = true
          this.Ipbillform.get('ConcessionId').reset();
          this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
          this.Ipbillform.get('ConcessionId').enable;
        }
      }
      else if (FinalDiscAmt <= 0 || FinalDiscAmt == '' || FinalDiscAmt == null) {
        this.vNetBillAmount = this.vTotalBillAmount;
        this.vPercentage = '';
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.Ipbillform.get('ConcessionId').clearValidators();
        this.Ipbillform.get('ConcessionId').updateValueAndValidity();
        this.Consession = false;
        this.ConShow = false;
      } else if (CompDiscAmt <= 0 || CompDiscAmt == '' || CompDiscAmt == null) {
        this.vNetBillAmount = this.vTotalBillAmount;
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.Ipbillform.get('ConcessionId').clearValidators();
        this.Ipbillform.get('ConcessionId').updateValueAndValidity();
        this.Consession = false;
        this.ConShow = false;
      }
    }
  }

  gettablecalculation(element, Price) {
    console.log(element)
    debugger 
    if(element.Price > 0 && element.Qty > 0){ 
    element.TotalAmt = element.Qty * element.Price
    element.ConcessionAmount = (element.ConcessionPercentage * element.TotalAmt) / 100 ;
    element.NetAmount =  element.TotalAmt - element.ConcessionAmount
    }  
    else if(element.Price == 0 || element.Price == '' || element.Qty == '' || element.Qty == 0){
      element.TotalAmt = 0;  
      element.ConcessionAmount =  0 ;
      element.NetAmount =  0 ;
    } 
  }
   
    onClose() {
      this.dialogRef.close({ result: "cancel" });
    }
    TotalAdvanceamt:any=0; 
  
    vselect:any;
    vService:any;
    vAdminPer:any;
    vAdminAmt:any;
  
    calculateTotalAmt() {
      if (this.vPrice && this.vQty) {
        this.vserviceTotalAmt = Math.round(parseInt(this.vPrice) * parseInt(this.vQty)).toString();
        this.vServiceNetAmount = this.vserviceTotalAmt;
        this.calculatePersc();
      }
  
    }
  
    calculatePersc() { 
      this.vServiceDisAmt = 0;
      this.vServiceDiscPer = this.Serviceform.get('discPer').value;
      let netAmt = parseInt(this.vPrice) * parseInt(this.vQty);
      if (this.vServiceDiscPer > 0 || this.vServiceDiscPer < 101) {
        let discAmt = Math.round((netAmt * parseInt(this.vServiceDiscPer)) / 100);
        this.vServiceDisAmt = discAmt;
        this.vServiceNetAmount = (netAmt - discAmt).toString();
        // this.discamt.nativeElement.focus();
      }
      
      if (this.vServiceDiscPer > 100 || this.vServiceDiscPer < 0) {
        this.toastr.warning('Please Enter Discount % less than 100 and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
        this.vServiceDiscPer = 0;
        this.vServiceDisAmt = 0;
        this.vServiceNetAmount = (parseInt(this.vPrice) * parseInt(this.vQty)).toString();
        this.disc.nativeElement.focus();
      }
      if (this.vServiceDiscPer == 0 || this.vServiceDiscPer == '' || this.vServiceDiscPer == null) {
        this.vServiceDisAmt = 0;
        this.vServiceNetAmount = (netAmt).toString();
      }
      // console.log(this.vServiceNetAmount)
    }
  
    getPreBilldet(contact) {
      console.log(contact)
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
  
    calculatechargesDiscamt() {
  
      this.disamt = this.Serviceform.get('discAmount').value;
      let Netamt = parseInt(this.vServiceNetAmount);
  
      if (parseInt(this.disamt) > 0 && this.disamt < this.vserviceTotalAmt) {
        let tot = 0;
        if (Netamt > 0) {
          tot = parseInt(this.vserviceTotalAmt) - parseInt(this.disamt);
          this.vServiceNetAmount = tot.toString();
          this.Serviceform.get('netAmount').setValue(tot);
        }
      } else if (this.Serviceform.get('discAmount').value == null || this.Serviceform.get('discAmount').value == 0) {
  
        this.Serviceform.get('netAmount').setValue(this.vserviceTotalAmt);
        this.Consession = true;
        if (this.vServiceDiscPer > 0) {
          let netAmt = parseInt(this.vPrice) * parseInt(this.vQty);
          let discAmt = Math.round((netAmt * parseInt(this.vServiceDiscPer)) / 100);
          this.vServiceDisAmt = discAmt;
          this.vServiceNetAmount = (netAmt - discAmt).toString();
        } else {
          this.vServiceNetAmount = (parseInt(this.vPrice) * parseInt(this.vQty)).toString();
        }
      } else if (this.Serviceform.get('discAmount').value > this.vServiceNetAmount || this.Serviceform.get('discAmount').value < 0) {
        // this.toastr.warning('Please Enter Discount Amount less than NetAmount', 'Warning !', {
        //   toastClass: 'tostr-tost custom-toast-warning',
  
        // });
        this.vServiceDisAmt = 0;
        if (this.vServiceDiscPer > 0) {
          let netAmt = parseInt(this.vPrice) * parseInt(this.vQty);
          let discAmt = Math.round((netAmt * parseInt(this.vServiceDiscPer)) / 100);
          this.vServiceDisAmt = discAmt;
          this.vServiceNetAmount = (netAmt - discAmt).toString();
        } else {
          this.vServiceNetAmount = (parseInt(this.vPrice) * parseInt(this.vQty)).toString();
        }
        // return;
        // console.log(this.vServiceNetAmount)
      }
  
      this.add = false;
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
  
  
    deleteTableRow(element) {
  
      let index = this.chargeslist.indexOf(element);
      if (index >= 0) {
        this.chargeslist.splice(index, 1);
        this.dataSource.data = [];
        this.dataSource.data = this.chargeslist;
      }
  
      // console.log(this.dataSource.data)
      Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
    }
  
  
 

  
    deletecharges(contact) {
      Swal.fire({
        title: 'Do you want to Delete Charges',
        // showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'OK',
  
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
                this.getChargesList();
                this.CalculateAdminCharge();
              });
            } else {
              Swal.fire('Error !', 'Charges cancelled data not saved', 'error');
            }
            this.isLoading = '';
          });
        }
      });
  
    }
  
  
    calBalanceAmt() {
      // select isnull(Sum(BalanceAmount),0) as PhBillCredit from T_SalesHeader where OP_IP_Type=1 and OP_IP_ID=
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
      if (this.dataSource.data.length > 0 && (this.vNetBillAmount > 0)) {
        this.chargeslist = this.dataSource;
        this.isLoading = 'submit';
  
        let InsertDraftBillOb = {};
        InsertDraftBillOb['drbNo'] = 0;
        InsertDraftBillOb['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,
        InsertDraftBillOb['TotalAmt'] = this.vBillTotalAmt || 0;
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
            Swal.fire('Draft Bill successfully!', 'Company Draft bill generated successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this.viewgetDraftBillReportPdf(response);
              }
            });
          } else {
            Swal.fire('Error !', 'Company Draft Billing data not saved', 'error');
          }
          this.isLoading = '';
        });
  
      }else{
        Swal.fire('error !', 'Please select check box ', 'error');
      } 
      this._matDialog.closeAll();
    }
     //For testing 
     viewgetDraftBillReportPdf(AdmissionID) {
      this._IpSearchListService.getCompanyDraftBillReceipt(
        AdmissionID
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "IP Draft Bill  Viewer"
            }
          });
      });
    }
 



    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
  
      // console.log('tabChangeEvent => ', tabChangeEvent); 
      // console.log('index => ', tabChangeEvent.index); 
      if (tabChangeEvent.index == 1) {
        this.getAdvanceDetList();
      }
    }
    chkprint: boolean = false;
    AdList:boolean=false;
    viewgetIPAdvanceReportPdf(contact) {
      debugger
       this.chkprint=true;
      this.sIsLoading = 'loading-data';
      setTimeout(() => {
        // this.SpinLoading =true;
       this.AdList=true;
       
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
            this.AdList=false;
            this.sIsLoading = '';
          });
      });
     
      },100)
      this.chkprint=false;
    }
  
  // onwhatsappbill() {
    getWhatsappshareIPFinalBill(el, vmono) {
      debugger
      
      if(vmono !='' && vmono !="0"){
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
