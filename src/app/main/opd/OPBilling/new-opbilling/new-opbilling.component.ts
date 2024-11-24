import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { ChargesList, SearchInforObj } from '../../op-search-list/opd-search-list/opd-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { OPSearhlistService } from '../../op-search-list/op-searhlist.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { OpPaymentNewComponent } from '../../op-search-list/op-payment-new/op-payment-new.component';
import { IpPaymentInsert, OPAdvancePaymentComponent } from '../../op-search-list/op-advance-payment/op-advance-payment.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { MatSelect } from '@angular/material/select';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { OpPaymentComponent } from '../../op-search-list/op-payment/op-payment.component';
import { ConfigService } from 'app/core/services/config.service';

@Component({
  selector: 'app-new-opbilling',
  templateUrl: './new-opbilling.component.html',
  styleUrls: ['./new-opbilling.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class NewOPBillingComponent implements OnInit {
  displayedColumns = [
    'IsCheck',
    'ServiceName',
    'Price',
    'Qty',
    'TotalAmt',
    'DiscPer',
    'DiscAmt',
    'NetAmount',
    'ChargeDoctorName',
    'ClassName',
    'ChargesAddedName',
    'action'
  ];
  displayedColumnspackage = [
    'IsCheck',
    'ServiceName',
    'Price',
    'Qty',
    'TotalAmt',
    'DiscPer',
    'DiscAmt',
    'NetAmount',
    'action'
  ];
  displayedPrescriptionColumns = [
    'ServiceName',
    'Qty',
    'Price',
    'TotalAmt',
  ];


  searchFormGroup: FormGroup;
  registeredForm: FormGroup;
  BillingForm: FormGroup;
  isRegIdSelected: boolean = false;
  isCashCounterSelected: boolean = false;
  PatientListfilteredOptions: any;
  noOptionFound: boolean = false;
  VisitDate: any;
  DepartmentName: any;
  AgeMonth: any;
  AgeDay: any;
  GenderName: any;
  RefDocName: any;
  BedName: any;
  PatientType: any;
  PatientName: any = "";
  RegId: any;
  RegDate: any;
  City: any;
  CompanyName: any;
  Tarrifname: any;
  Doctorname: any;
  Paymentdata: any;
  vOPIPId: any = 0;
  vOPDNo: any;
  vTariffId: any = 0;
  vClassId: any = 0;
  CompanyId: any = 0;
  AgeYear: any = 0;
  VisitId: any = 0;
  RegNo: any;
  vClassName: any;
  filteredOptionsCashCounter: Observable<string[]>;
  CashCounterList: any = [];
  screenFromString = 'OP-billing';
  dateTimeObj: any;
  filteredOptionsService: any;
  isServiceSelected: boolean = false;
  CreditedtoDoctor: any;
  IsPathology: any;
  IsRadiology: any;
  isLoading: String = '';
  vIsPackage: any;
  vPrice = '0';
  vQty: any;
  vChargeTotalAmount: any = 0;
  isDoctor: boolean = false;
  isDoctorSelected: boolean = false;
  vDoctor: any;
  filteredOptionsDoctors: any;
  VchargeDiscPer: any = 0;
  vchargeDisAmount: any = 0;
  vCahrgeNetAmount: any = 0;
  serviceId: number;
  ChargesDoctorname: any;
  DoctornewId: any;
  chargeslist: any = [];
  PacakgeList: any = [];
  vFinalTotalAmt: any;
  vFinalConcessionAmt: any;
  vFinalconcessionDiscPer: any;
  ConcessionReasonList: any = [];
  vFinalnetPaybleAmt: any = 0;
  Consessionres: boolean = false;
  savebtn: boolean = true;
  PatientHeaderObj: any;
  BillDiscPer: boolean = false;
  vRegNo: any;

  dataSource = new MatTableDataSource<ChargesList>();
  dsPackageDet = new MatTableDataSource<ChargesList>();
  dsprescritionList = new MatTableDataSource<ChargesList>();


  vMobileNo: any;
  saveclick: boolean = false;
  paidamt: number;
  flagSubmit: boolean;
  balanceamt: number;
  disamt: any;
  msg: any;
  reportPrintObj: any;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: any[] = [];
  billingServiceList = [];
  ConcessionReason: any;
  FinalNetAmt: any;
  filteredOptionsDoctor: Observable<string[]>;
  optionsDoctor: any[] = [];
  totalamt = 0;
  TotalAmount = 0;
  isExpanded: boolean = false;
  totalAmtOfNetAmt: any;
  interimArray: any = [];
  serviceName: String;
  selectedAdvanceObj: SearchInforObj;
  isFilteredDateDisabled: boolean = true;
  currentDate = new Date();
  doctorNameCmbList: any = [];
  IPBillingInfor: any = [];
  myShowAdvanceForm: FormGroup;
  netPaybleAmt: any;
  netPaybleAmt1: any;



  private nextPage$ = new Subject();
  SrvcName: any;
  add: Boolean = false;
// New Api?
autocompleteModecashcounter: string = "CashCounter";
    autocompleteModeservice: string = "Service";
    autocompleteModedoctor: string = "ConDoctor";


  resBillId: Post;
  constructor(
    private _fuseSidebarService: FuseSidebarService,
    private changeDetectorRefs: ChangeDetectorRef,
    public _oPSearhlistService: OPSearhlistService,
    public element: ElementRef<HTMLElement>,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private renderer: Renderer2,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    public _httpClient: HttpClient,
    public toastr: ToastrService,
    private formBuilder: FormBuilder,
    public _WhatsAppEmailService: WhatsAppEmailService,
    public _ConfigService: ConfigService
  ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();

    this.createForm();

    this.BillingFooterForm();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
      this.VisitId = this.selectedAdvanceObj.VisitId;
      this.RegId = this.selectedAdvanceObj.RegId;
      this.RegNo = this.selectedAdvanceObj.RegNo;
      this.AgeYear = this.selectedAdvanceObj.AgeYear;
      this.AgeDay = this.selectedAdvanceObj.AgeDay;
      this.AgeMonth = this.selectedAdvanceObj.AgeMonth;
      this.vOPIPId = this.selectedAdvanceObj.VisitId;
      this.vOPDNo = this.selectedAdvanceObj.OPDNo
      this.PatientName = this.selectedAdvanceObj.PatientName;
      this.Doctorname = this.selectedAdvanceObj.Doctorname;
      this.CompanyId = this.selectedAdvanceObj.CompanyId;
      this.CompanyName = this.selectedAdvanceObj.CompanyName;
      this.Tarrifname = this.selectedAdvanceObj.TariffName;
      this.vTariffId = this.selectedAdvanceObj.TariffId;
      this.vClassId = this.selectedAdvanceObj.ClassId;
      this.vClassName = this.selectedAdvanceObj.ClassName;
      this.vMobileNo = this.selectedAdvanceObj.MobileNo;
      this.DepartmentName = this.selectedAdvanceObj.DepartmentName;
      this.RefDocName = this.selectedAdvanceObj.RefDocName;
      this.PatientType = this.selectedAdvanceObj.PatientType;
    }
    this.getCashCounterComboList();
    this.getConcessionReasonList();
  }
  createSearchForm() {
    return this.formBuilder.group({
      RegId: [''],
      CashCounterID: ['']
    });
  }
  // Create registered form group
  createForm() {
    this.registeredForm = this.formBuilder.group({
      SrvcName: [''],
      price: [Validators.required],
      qty: [Validators.required, Validators.pattern("^[0-9]*$")],
      ChargeTotalAmount: [Validators.required],
      DoctorID: [0],
      ChargeDiscPer: [''],
      ChargeDiscAmount: [''],
      doctorId: [0],
      netAmount: [''],
    });
  }
  BillingFooterForm() {
    this.BillingForm = this.formBuilder.group({
      FinalTotalAmt: ['', Validators.required],
      FinalconcessionAmt: [''],
      FinalconcessionPer: [''],
      ConcessionId: [''],
      BillRemark: [''],
      FinalNetAmt: ['', Validators.required],
      PaymentType: ['CashPay'],
      CashCounterID: ['']
    });
  }


  // Patient Search;
  getSearchList() {
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}`
    }
    this._oPSearhlistService.getPatientVisitedListSearch(m_data).subscribe(data => {
      this.PatientListfilteredOptions = data;
      if (this.PatientListfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  registerObj: any;
  //patient infomation
  getSelectedObj1(obj) {
    console.log(obj)
    this.dataSource.data = [];
    this.registerObj = obj;
    this.PatientName = obj.FirstName + " " + obj.LastName;
    this.RegId = obj.RegId;
    this.Doctorname = obj.DoctorName;
    this.VisitDate = this.datePipe.transform(obj.VisitDate, 'dd/MM/yyyy hh:mm a');
    this.CompanyName = obj.CompanyName;
    this.Tarrifname = obj.TariffName;
    this.DepartmentName = obj.DepartmentName;
    this.RegNo = obj.RegNo;
    this.vOPIPId = obj.VisitId;
    this.vOPDNo = obj.OPDNo;
    this.vTariffId = obj.TariffId;
    this.vClassId = obj.ClassId;
    this.AgeYear = obj.AgeYear;
    this.AgeMonth = obj.AgeMonth;
    this.vClassName = obj.ClassName;
    this.AgeDay = obj.AgeDay;
    this.GenderName = obj.GenderName;
    this.RefDocName = obj.RefDoctorName
    this.BedName = obj.BedName;
    this.PatientType = obj.PatientType;
  }
  getOptionText1(option) {
    if (!option)
      return '';
    return option.FirstName + ' ' + option.MiddleName + ' ' + option.LastName;

  }
  //cashCounterList
  setcashCounter: any;
  getCashCounterComboList() {
    this._oPSearhlistService.getCashcounterList().subscribe(data => {
      this.CashCounterList = data
      console.log(this.CashCounterList)

      this.setcashCounter = this.CashCounterList.find(item => item.CashCounterId == this._ConfigService.configParams.OPD_Billing_CounterId)
      this.searchFormGroup.get('CashCounterID').setValue(this.setcashCounter)
      this.filteredOptionsCashCounter = this.searchFormGroup.get('CashCounterID').valueChanges.pipe(
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
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  //Service list
  getServiceListCombobox() {
    if (this.RegNo) {
      var m_data = {
        SrvcName: `${this.registeredForm.get('SrvcName').value}%`,
        TariffId: this.vTariffId,
        ClassId: this.vClassId,
      };
      console.log(m_data)
      if (this.registeredForm.get('SrvcName').value.length >= 1) {
        this._oPSearhlistService.getBillingServiceList(m_data).subscribe(data => {
          this.filteredOptionsService = data;
          if (this.filteredOptionsService.length == 0) {
            this.noOptionFound = true;
          } else {
            this.noOptionFound = false;
          }
        });
        // });
      }
    } else {
      Swal.fire('Please select RegNo ');
    }
  }
  getOptionText(option) {
    if (!option)
      return '';
    return option.ServiceName;
  }
  getSelectedObj(obj) {
    console.log(obj)
    if (this.dataSource.data.length > 0) {
      this.dataSource.data.forEach((element) => {
        if (obj.ServiceId == element.ServiceId) {
          Swal.fire('Selected Item already added in the list ');
          this.onClearServiceAddList();
        }
      });
      this.SrvcName = obj.ServiceName;
      this.vPrice = obj.Price;
      this.vQty = 1;
      this.vChargeTotalAmount = obj.Price;
      this.vCahrgeNetAmount = obj.Price;
      this.serviceId = obj.ServiceId;
      this.IsPathology = obj.IsPathology;
      this.IsRadiology = obj.IsRadiology;
      this.vIsPackage = obj.IsPackage;
      this.CreditedtoDoctor = obj.CreditedtoDoctor;
      if (this.CreditedtoDoctor == true) {
        this.isDoctor = true;
        this.registeredForm.get('DoctorID').reset();
        this.registeredForm.get('DoctorID').setValidators([Validators.required]);
        this.registeredForm.get('DoctorID').enable();

      } else {
        this.isDoctor = false;
        this.registeredForm.get('DoctorID').reset();
        this.registeredForm.get('DoctorID').clearValidators();
        this.registeredForm.get('DoctorID').updateValueAndValidity();
        this.registeredForm.get('DoctorID').disable();
      }
    }
    else {
      this.SrvcName = obj.ServiceName;
      this.vPrice = obj.Price;
      this.vQty = 1;
      this.vChargeTotalAmount = obj.Price;
      this.vCahrgeNetAmount = obj.Price;
      this.serviceId = obj.ServiceId;
      this.IsPathology = obj.IsPathology;
      this.IsRadiology = obj.IsRadiology;
      this.vIsPackage = obj.IsPackage;
      this.CreditedtoDoctor = obj.CreditedtoDoctor;
      if (this.CreditedtoDoctor == true) {
        this.isDoctor = true;
        this.registeredForm.get('DoctorID').reset();
        this.registeredForm.get('DoctorID').setValidators([Validators.required]);
        this.registeredForm.get('DoctorID').enable();
      } else {
        this.isDoctor = false;
        this.registeredForm.get('DoctorID').reset();
        this.registeredForm.get('DoctorID').clearValidators();
        this.registeredForm.get('DoctorID').updateValueAndValidity();
        this.registeredForm.get('DoctorID').disable();
      }
    }
  }
  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    this.nextPage$.next();
  }
  //Doctor list 
  getAdmittedDoctorCombo() {
    var vdata = {
      "Keywords": this.registeredForm.get('DoctorID').value + "%" || "%"
    }
    console.log(vdata)
    this._oPSearhlistService.getAdmittedDoctorCombo(vdata).subscribe(data => {
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
  //add service
  onAddCharges() {

    if ((this.serviceId == 0)) {
      this.toastr.warning('Please select Service', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if (this.registeredForm.get('SrvcName').value) {
    //   if (!this.filteredOptionsService.find(item => item.ServiceName == this.registeredForm.get('SrvcName').value.ServiceName)) {
    //     this.toastr.warning('Please select valid Service Name', 'Warning !', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    //   }
    // }
    if ((this.vPrice == null || this.vPrice == "" || this.vPrice == undefined || this.vPrice == '0')) {
      this.toastr.warning('Please enter price ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vQty == '0' || this.vQty == null || this.vQty == "" || this.vQty == undefined)) {
      this.toastr.warning('Please enter qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.CreditedtoDoctor) {
      if ((this.vDoctor == 0)) {
        this.toastr.warning('Please select Doctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this.registeredForm.get('DoctorID').value) {
        if (!this.filteredOptionsDoctors.find(item => item.Doctorname == this.registeredForm.get('DoctorID').value.Doctorname)) {
          this.toastr.warning('Please select valid Doctor Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        this.ChargesDoctorname = this.registeredForm.get('DoctorID').value.Doctorname || ''
        this.DoctornewId = this.registeredForm.get('DoctorID').value.DoctorId || 0;
        console.log(this.ChargesDoctorname)
      }
    }
    this.isLoading = 'save';
    this.dataSource.data = [];
    this.chargeslist.push(
      {
        ChargesId: 0,// this.serviceId,
        ServiceId: this.serviceId,
        ServiceName: this.SrvcName,
        Price: this.vPrice || 0,
        Qty: this.vQty || 0,
        TotalAmt: this.vChargeTotalAmount || 0,
        DiscPer: this.VchargeDiscPer || 0,
        DiscAmt: this.vchargeDisAmount || 0,
        NetAmount: this.vCahrgeNetAmount || 0,
        ClassId: 1,//this.selectedAdvanceObj.ClassId || 0,
        DoctorId: this.vDoctor,// (this.registeredForm.get("DoctorID").value.DoctorName).toString() || '',
        DoctorName: this.ChargesDoctorname,
        ChargesDate: this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        IsPathology: this.IsPathology,
        IsRadiology: this.IsRadiology,
        IsPackage: this.vIsPackage,
        ClassName: this.vClassName,// this.selectedAdvanceObj.ClassName || '',
        ChargesAddedName: 1//this.accountService.currentUserValue.user.id || 1,

      });
    this.isLoading = '';
    this.dataSource.data = this.chargeslist;
    this.changeDetectorRefs.detectChanges();
    this.isDoctor = false;
    // this.Servicename.nativeElement.focus();
    this.add = false;
    this.savebtn = false;
    this.ChargesDoctorname = '';
    this.DoctornewId = 0;
    this.getConcessionChek();
    this.calculateTotalAmtbyprice();
    this.finaldiscAmt();
    this.getpackagedetList();
    this.onClearServiceAddList();

  }
  onClearServiceAddList() {
    this.registeredForm.get('SrvcName').reset();
    this.registeredForm.get('price').reset(0);
    this.registeredForm.get('qty').reset('1');
    this.registeredForm.get('ChargeTotalAmount').reset(0);
    this.registeredForm.get('DoctorID').reset(0);
    this.registeredForm.get('ChargeDiscPer').reset(0);
    this.registeredForm.get('ChargeDiscAmount').reset(0);
    this.registeredForm.get('netAmount').reset(0);
    this.registeredForm.get('DoctorID').reset('');
    this.registeredForm.reset();
  }
  vchargewisetotaldiscAmt: any = 0;
  finaldiscAmt() {
    this.vchargewisetotaldiscAmt += this.vchargeDisAmount;
    this.vFinalConcessionAmt = this.vchargewisetotaldiscAmt;
    console.log(this.vFinalConcessionAmt)
    this.CalcDiscPercentageonBill();
  }
  chkdelte: any;
  deleteTableRow(element) {
    console.log(element)
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dataSource.data = [];
      this.dataSource.data = this.chargeslist;
    }
    Swal.fire({
      title: 'ChargeList Row Deleted Successfully',
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Ok!"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.CalcDiscPercentageonBill();
        if (element.IsPackage == '1') {
          this.serviceId = 0;
          this.getpackagedetList();
        }
        if (this.dataSource.data.length == 0) {
          this.ServiceDiscper = 0;
          this.vFinalconcessionDiscPer = '';
        }
      }
    });
  }

  deleteTableRowPackage(element) {
    let index = this.PacakgeList.indexOf(element);
    if (index >= 0) {
      this.PacakgeList.splice(index, 1);
      this.dsPackageDet.data = [];
      this.dsPackageDet.data = this.PacakgeList;
    }
    Swal.fire('Success !', 'PacakgeList Row Deleted Successfully', 'success');

  }
  //package list 
  getpackagedetList() {
    var vdata = {
      'ServiceId': this.serviceId
    }
    console.log(vdata);
    this._oPSearhlistService.getpackagedetList(vdata).subscribe((data) => {
      this.dsPackageDet.data = data as ChargesList[];
      this.PacakgeList = this.dsPackageDet.data;
      console.log(this.dsPackageDet.data);
    });
  }
  getConcessionReasonList() {
    this._oPSearhlistService.getConcessionCombo().subscribe(data => {
      this.ConcessionReasonList = data;
    })
  }
  calculateTotalAmtbyprice() {
    if (this.vPrice && this.vQty) {
      this.vChargeTotalAmount = Math.round(parseInt(this.vPrice) * parseInt(this.vQty)).toString();
      this.vCahrgeNetAmount = this.vChargeTotalAmount;
    }
  }
  // Charges Wise Disc Percentage 

  calculatePersc() {
    let ServiceDiscper = this.registeredForm.get('ChargeDiscPer').value || 0;

    if (ServiceDiscper > 0 && ServiceDiscper < 100 || ServiceDiscper > 100) {
      if (ServiceDiscper > 100) {
        Swal.fire("Enter Discount % Less than 100 & Greater > 0")
        this.vchargeDisAmount = '';
        this.registeredForm.get('ChargeDiscPer').setValue('')
        this.vCahrgeNetAmount = this.vChargeTotalAmount;
      } else {
        this.vchargeDisAmount = ((parseFloat(this.vChargeTotalAmount) * parseFloat(ServiceDiscper)) / 100).toFixed(2);

        this.vCahrgeNetAmount = (parseFloat(this.vChargeTotalAmount) - parseFloat(this.vchargeDisAmount)).toFixed(2);
      }
    } else {
      this.vCahrgeNetAmount = this.vChargeTotalAmount;
      this.vchargeDisAmount = '';
      this.registeredForm.get('ChargeDiscPer').setValue('')
    }
  }
  calChargeDiscAmt() {

    let ServiceDiscAmt = this.registeredForm.get('ChargeDiscAmount').value || 0;
    if (ServiceDiscAmt > 0 && ServiceDiscAmt < this.vChargeTotalAmount || ServiceDiscAmt > this.vChargeTotalAmount) {
      if (parseFloat(ServiceDiscAmt) > parseFloat(this.vChargeTotalAmount)) {
        Swal.fire("Enter Discount Amt Less than Toatal Amt & Greater > 0")
        this.VchargeDiscPer = '';
        this.vchargeDisAmount = '';
        this.vCahrgeNetAmount = this.vChargeTotalAmount;
      } else {
        this.VchargeDiscPer = ((parseFloat(ServiceDiscAmt) / parseFloat(this.vChargeTotalAmount)) * 100).toFixed(2);
        this.vCahrgeNetAmount = (parseFloat(this.vChargeTotalAmount) - parseFloat(this.vchargeDisAmount)).toFixed(2);
      }
    } else {
      this.vCahrgeNetAmount = this.vChargeTotalAmount;
      this.VchargeDiscPer = '';
      this.vchargeDisAmount = '';
    }
  }
  getNetAmtSum(element) {
    this.vFinalnetPaybleAmt = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0).toFixed(2);
    this.vFinalTotalAmt = element.reduce((sum, { TotalAmt }) => sum += +(TotalAmt || 0), 0).toFixed(2);
    return this.vFinalnetPaybleAmt;
  }
  vserviceDiscPerFlag: any;
  getDiscAmtSum(element) {
    let FinalDiscAmt = element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0).toFixed(2);
    this.vserviceDiscPerFlag = element.reduce((sum, { DiscPer }) => sum += +(DiscPer || 0), 0).toFixed(2);

    if (FinalDiscAmt > 0) {
      this.BillingForm.get('FinalconcessionAmt').setValue(FinalDiscAmt);
      this.BillingForm.get('FinalNetAmt').setValue(this.vFinalnetPaybleAmt);
      this.getConcessionChek();
    } else {
      this.BillingForm.get('FinalconcessionAmt').clearValidators();
      this.vFinalConcessionAmt = '';
      this.BillingForm.get('FinalNetAmt').clearValidators();
      this.vFinalnetPaybleAmt = this.vFinalTotalAmt;
    }

    return FinalDiscAmt;
  }

  CalcDiscPercentageonBill() {
    // let finalDiscPer = !this.BillingForm.get("FinalconcessionPer").value ? "0" : this.BillingForm.get("FinalconcessionPer").value || "0" ; //this.BillingForm.get('FinalconcessionPer').value? 0 : this.BillingForm.get('FinalconcessionPer').value || "0";
    let finalDiscPer = this.BillingForm.get("FinalconcessionPer").value || 0;
    if (finalDiscPer > 0 && finalDiscPer < 100 || finalDiscPer > 100) {
      if (finalDiscPer > 100) {
        Swal.fire("Please enter discount percentage less than 100");
        this.vFinalConcessionAmt = '';
        this.vFinalnetPaybleAmt = this.vFinalTotalAmt;
        this.BillingForm.get('FinalconcessionAmt').setValue(this.vFinalConcessionAmt)
        this.BillingForm.get('FinalNetAmt').setValue(this.vFinalnetPaybleAmt)
      } else {
        this.vFinalConcessionAmt = Math.round((parseFloat(this.vFinalTotalAmt) * parseFloat(finalDiscPer)) / 100);
        this.vFinalnetPaybleAmt = Math.round(parseFloat(this.vFinalTotalAmt) - parseFloat(this.vFinalConcessionAmt)).toFixed(2);
        this.BillingForm.get('FinalconcessionAmt').setValue(this.vFinalConcessionAmt)
        this.BillingForm.get('FinalNetAmt').setValue(this.vFinalnetPaybleAmt)
      }
    } else {
      this.vFinalConcessionAmt = '';
      this.vFinalnetPaybleAmt = this.vFinalTotalAmt;
      this.BillingForm.get('FinalconcessionAmt').setValue(this.vFinalConcessionAmt)
      this.BillingForm.get('FinalNetAmt').setValue(this.vFinalnetPaybleAmt)
    }
    this.getConcessionChek();
  }

  CalcDiscAmtonBill() {
    let finalDiscAmt = this.BillingForm.get('FinalconcessionAmt').value || 0;
    if (finalDiscAmt > 0 && finalDiscAmt < this.vFinalTotalAmt || finalDiscAmt > this.vFinalTotalAmt) {
      if (parseFloat(finalDiscAmt) > parseFloat(this.vFinalTotalAmt)) {
        Swal.fire("Enter Discount Amt Less than Toatal Amt & Greater > 0")
        this.vFinalconcessionDiscPer = '';
        this.vFinalnetPaybleAmt = this.vFinalTotalAmt;
        this.BillingForm.get('FinalNetAmt').setValue(this.vFinalnetPaybleAmt)

      } else {
        this.vFinalconcessionDiscPer = ((parseFloat(finalDiscAmt) / parseFloat(this.vFinalTotalAmt)) * 100).toFixed(2);
        this.vFinalnetPaybleAmt = Math.round(parseFloat(this.vFinalTotalAmt) - parseFloat(finalDiscAmt)).toFixed(2);
        this.BillingForm.get('FinalNetAmt').setValue(this.vFinalnetPaybleAmt)
        this.Consessionres = true;
      }
    } else {
      this.vFinalconcessionDiscPer = '';
      this.vFinalnetPaybleAmt = this.vFinalTotalAmt;
      this.BillingForm.get('FinalNetAmt').setValue(this.vFinalnetPaybleAmt)
      this.getConcessionChek();
    }
  }

  ServiceDiscper: any = 0;
  getConcessionChek() {
    let Discper = 0;
    if (this.vFinalConcessionAmt > 0) {
      this.Consessionres = true;
    } else {
      this.Consessionres = false;
    }
    if (parseInt(this.vserviceDiscPerFlag) > 0) {
      this.BillDiscPer = false;
    } else {
      this.BillDiscPer = true;
    }

  }
  onSaveOPBill2() {
    debugger
    // if ((this.vOPIPId == '' || this.vOPIPId == null || this.vOPIPId == undefined)) {
    //   this.toastr.warning('Please select Patient', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if ((!this.dataSource.data.length)) {
    //   this.toastr.warning('Please add service in table', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if (this.BillingForm.get('FinalconcessionPer').value > 0 || this.BillingForm.get('FinalconcessionAmt').value > 0) {
    //   if (!this.BillingForm.get('ConcessionId').value) {
    //     this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    //   }
    // }
    // if (!this.searchFormGroup.get('CashCounterID').value) {
    //   this.toastr.warning('Select Cash Counter', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if (this.searchFormGroup.get('CashCounterID').value) {
    //   if (!this.CashCounterList.some(item => item.CashCounterName === this.searchFormGroup.get('CashCounterID').value.CashCounterName)) {
    //     this.toastr.warning('Please Select valid Cash Counter Name', 'Warning !', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    //   }
    // }
    this.savebtn = true;
    if (this.CompanyId !== 0 && this.CompanyId !== "") {
      this.saveCreditbill();
    }
    else if (this.CompanyId == '' || this.CompanyId == 0) {
      let disamt = this.BillingForm.get('FinalconcessionAmt').value;

      if (this.vFinalconcessionDiscPer > 0 || disamt > 0) {
        this.FinalNetAmt = this.vFinalnetPaybleAmt;
        this.netPaybleAmt1 = this.vFinalnetPaybleAmt;
      }
      else {
        this.FinalNetAmt = this.vFinalnetPaybleAmt;
        this.netPaybleAmt1 = this.vFinalnetPaybleAmt;
      }
      let ConcessionId = 0;
      if (this.BillingForm.get('ConcessionId').value)
        ConcessionId = this.BillingForm.get('ConcessionId').value.ConcessionId;

      let ConcessionReason = '';
      if (this.BillingForm.get('ConcessionId').value)
        ConcessionReason = this.BillingForm.get('ConcessionId').value.ConcessionReason;

      this.isLoading = 'submit';
      let InsertBillUpdateBillNoObj = {};
      InsertBillUpdateBillNoObj['BillNo'] = 0;
      InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.vOPIPId;
      InsertBillUpdateBillNoObj['TotalAmt'] = this.BillingForm.get('FinalTotalAmt').value || 0;
      InsertBillUpdateBillNoObj['concessionAmt'] = parseFloat(this.BillingForm.get('FinalconcessionAmt').value) || 0
      InsertBillUpdateBillNoObj['NetPayableAmt'] = this.BillingForm.get('FinalNetAmt').value || 0;
      InsertBillUpdateBillNoObj['PaidAmt'] = 0;//this.BillingForm.get('FinalNetAmt').value;
      InsertBillUpdateBillNoObj['BalanceAmt'] = 0;
      InsertBillUpdateBillNoObj['BillDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 0;
      InsertBillUpdateBillNoObj['AddedBy'] = 1,//this.accountService.currentUserValue.user.id,
        InsertBillUpdateBillNoObj['TotalAdvanceAmount'] = 0,
        InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.time,// this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        InsertBillUpdateBillNoObj['ConcessionReasonId'] = ConcessionId;
      InsertBillUpdateBillNoObj['IsSettled'] = 0;
      InsertBillUpdateBillNoObj['IsPrinted'] = 0;
      InsertBillUpdateBillNoObj['IsFree'] = 0;
      InsertBillUpdateBillNoObj['CompanyId'] = 0;
      InsertBillUpdateBillNoObj['TariffId'] = this.vTariffId || 0;
      InsertBillUpdateBillNoObj['UnitId'] = 1,//this.selectedAdvanceObj.UnitId || 0;
        InsertBillUpdateBillNoObj['InterimOrFinal'] = 0;
      InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
      InsertBillUpdateBillNoObj['concessionAuthorizationName'] = 0;
      InsertBillUpdateBillNoObj['TaxPer'] = 0;
      InsertBillUpdateBillNoObj['TaxAmount'] = 0
      InsertBillUpdateBillNoObj['compDiscAmt'] = 0// Math.round(this.BillingForm.get('FinalconcessionAmt').value) || 0;
      InsertBillUpdateBillNoObj['discComments'] = ConcessionReason;
      InsertBillUpdateBillNoObj['cashCounterId'] = this.searchFormGroup.get('CashCounterID').value.CashCounterId || 0;



      let Billdetsarr = [];
      this.dataSource.data.forEach((element) => {
        let BillDetailsInsertObj = {};
        BillDetailsInsertObj['BillNo'] = 0;
        BillDetailsInsertObj['ChargesId'] = element.ServiceId;
        Billdetsarr.push(BillDetailsInsertObj);
      });

      let InsertAdddetArr = [];
      this.dataSource.data.forEach((element) => {

        let InsertAddChargesObj = {};
        InsertAddChargesObj['ChargesId'] = element.ServiceId,
          InsertAddChargesObj['ChargesDate'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
          InsertAddChargesObj['opD_IPD_Type'] = 0,
          InsertAddChargesObj['opD_IPD_Id'] = this.vOPIPId,
          InsertAddChargesObj['serviceId'] = element.ServiceId,
          InsertAddChargesObj['price'] = element.Price,
          InsertAddChargesObj['qty'] = element.Qty,
          InsertAddChargesObj['totalAmt'] = element.TotalAmt,
          InsertAddChargesObj['concessionPercentage'] = element.DiscPer || 0,
          InsertAddChargesObj['concessionAmount'] = element.DiscAmt || 0,
          InsertAddChargesObj['netAmount'] = element.NetAmount,
          InsertAddChargesObj['doctorId'] = element.DoctorId,
          InsertAddChargesObj['docPercentage'] = 0,
          InsertAddChargesObj['docAmt'] = 0,
          InsertAddChargesObj['hospitalAmt'] = element.NetAmount,
          InsertAddChargesObj['isGenerated'] = 0,
          InsertAddChargesObj['addedBy'] =1// this.accountService.currentUserValue.user.id,
          InsertAddChargesObj['isCancelled'] = 0,
          InsertAddChargesObj['isCancelledBy'] = 0,
          InsertAddChargesObj['isCancelledDate'] = "01/01/1900",
          InsertAddChargesObj['isPathology'] = element.IsPathology,
          InsertAddChargesObj['isRadiology'] = element.IsRadiology,
          InsertAddChargesObj['isPackage'] = 0,
          InsertAddChargesObj['packageMainChargeID'] = 0,
          InsertAddChargesObj['isSelfOrCompanyService'] = false,
          InsertAddChargesObj['packageId'] = 0,
          InsertAddChargesObj['BillNo'] = 0,
          InsertAddChargesObj['chargeTime'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
          InsertAddChargesObj['classId'] = this.vClassId,

          InsertAdddetArr.push(InsertAddChargesObj);
      })


      let opCalDiscAmountBill = {}
      opCalDiscAmountBill['billNo'] = 0

      let PatientHeaderObj = {};

      PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        PatientHeaderObj['PatientName'] = this.PatientName;
      PatientHeaderObj['RegNo'] = this.RegNo;
      PatientHeaderObj['DoctorName'] = this.Doctorname;
      PatientHeaderObj['CompanyName'] = this.CompanyName;
      PatientHeaderObj['DepartmentName'] = this.DepartmentName;
      PatientHeaderObj['OPD_IPD_Id'] = this.vOPDNo;
      PatientHeaderObj['Age'] = this.AgeYear;
      PatientHeaderObj['NetPayAmount'] = this.BillingForm.get('FinalNetAmt').value;

      if (this.BillingForm.get('PaymentType').value == 'PayOption') {
        const dialogRef = this._matDialog.open(OpPaymentComponent,
          {
            maxWidth: "80vw",
            height: '650px',
            width: '80%',
            data: {
              vPatientHeaderObj: PatientHeaderObj,
              FromName: "OP-Bill",
              advanceObj: PatientHeaderObj,
            }
          });

        dialogRef.afterClosed().subscribe(result => {
          this.flagSubmit = result.IsSubmitFlag

          if (this.flagSubmit) {
            this.paidamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
            this.balanceamt = result.submitDataPay.ipPaymentInsert.BalanceAmt;
          }

          else {

            this.balanceamt = result.BalAmt;
          }
          InsertBillUpdateBillNoObj['PaidAmt'] = result.submitDataPay.ipPaymentInsert.PaidAmt;
          if (this.vFinalconcessionDiscPer > 0) {
            this.FinalNetAmt = this.totalAmtOfNetAmt - this.BillingForm.get('FinalconcessionAmt').value;
          } else {
            this.FinalNetAmt = this.vFinalnetPaybleAmt;
          }
          let vmMobileNo = this.vMobileNo;
          console.log(vmMobileNo);
          if (this.flagSubmit == true) {
            //   console.log("Procced with Payment Option"); 
            //   let submitData = {
            //     "chargesDetailInsert": InsertAdddetArr,
            //     "insertBillupdatewithbillno": InsertBillUpdateBillNoObj,
            //     "opBillDetailsInsert": Billdetsarr,
            //     "opCalDiscAmountBill": opCalDiscAmountBill,
            //     "opInsertPayment": result.submitDataPay.ipPaymentInsert
            //   };
            //   console.log(submitData);

            var submitData = {

              "BillNo": 0,
              "OPDIPDID": this.vOPIPId,
              "TotalAmt": this.BillingForm.get('FinalTotalAmt').value || 0,
              "ConcessionAmt": parseFloat(this.BillingForm.get('FinalconcessionAmt').value) || 0,
              "NetPayableAmt": this.BillingForm.get('FinalNetAmt').value || 0,
              "PaidAmt": 0,
              "BalanceAmt": 0,
              "BillDate": this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
              "OPDIPDType": 0,
              "AddedBy": 10,
              "TotalAdvanceAmount": 0,
              "BillTime": this.dateTimeObj.time,
              "ConcessionReasonId": ConcessionId,
              "IsSettled": true,
              "IsPrinted": true,
              "IsFree": true,
              "CompanyId": 0,
              "TariffId": 0,
              "UnitId": 1,
              "InterimOrFinal": 0,
              "CompanyRefNo": 0,
              "ConcessionAuthorizationName": 0,
              "SpeTaxPer": 10,
              "SpeTaxAmt": 10,
              "CompDiscAmt": 0,
              "DiscComments": ConcessionReason,
              "CashCounterId": this.searchFormGroup.get('CashCounterID').value.CashCounterId || 0 ,
              "AddCharges": InsertAdddetArr,
              "BillDetails": Billdetsarr, "Payments": result.submitDataPay.ipPaymentInsert
            }
            console.log(submitData)
            this._oPSearhlistService.OpBillInsertSave(submitData).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
            }, (error) => {
              this.toastr.error(error.message);
            });
          }
        });
      }
      else if (this.BillingForm.get('PaymentType').value == 'CreditPay') {
        this.saveCreditbill();
      }
      else {

        InsertBillUpdateBillNoObj['PaidAmt'] = this.BillingForm.get('FinalNetAmt').value || 0;

        let Paymentobj = {};
        Paymentobj['BillNo'] = 0;
        // Paymentobj['ReceiptNo'] = 0;
        Paymentobj['PaymentDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          Paymentobj['PaymentTime'] = this.dateTimeObj.time || '01/01/1900',
          Paymentobj['CashPayAmount'] = parseFloat(this.BillingForm.get('FinalNetAmt').value) || 0;
        Paymentobj['ChequePayAmount'] = 0;
        Paymentobj['ChequeNo'] = 0;
        Paymentobj['BankName'] = "";
        Paymentobj['ChequeDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          Paymentobj['CardPayAmount'] = 0;
        Paymentobj['CardNo'] = 0;
        Paymentobj['CardBankName'] = "";
        Paymentobj['CardDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          Paymentobj['AdvanceUsedAmount'] = 0;
        Paymentobj['AdvanceId'] = 0;
        Paymentobj['RefundId'] = 0;
        Paymentobj['TransactionType'] = 0;
        Paymentobj['Remark'] = "Cashpayment";
        Paymentobj['AddBy'] = 1,//this.accountService.currentUserValue.user.id,
          Paymentobj['IsCancelled'] = 0;
        Paymentobj['IsCancelledBy'] = 0;
        Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          Paymentobj['CashCounterId'] = 0;
        Paymentobj['NEFTPayAmount'] = 0;
        Paymentobj['NEFTNo'] = 0;
        Paymentobj['NEFTBankMaster'] = "";
        Paymentobj['NEFTDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          Paymentobj['PayTMAmount'] = 0;
        Paymentobj['PayTMTranNo'] = 0;
        Paymentobj['PayTMDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          Paymentobj['PaidAmt'] = this.BillingForm.get('FinalNetAmt').value || 0;
        Paymentobj['BalanceAmt'] = 0;
        Paymentobj['tdsAmount'] = 0;

        const ipPaymentInsert = new IpPaymentInsert(Paymentobj);
        let submitDataPay = {
          ipPaymentInsert,
        }; 
        // let submitData = {
        //   "chargesDetailInsert": InsertAdddetArr,
        //   "insertBillupdatewithbillno": InsertBillUpdateBillNoObj,
        //   "opBillDetailsInsert": Billdetsarr,
        //   "opCalDiscAmountBill": opCalDiscAmountBill,
        //   "opInsertPayment": Paymentobj
        // };
        console.log(submitData);
              var submitData = {

          "BillNo": 0,
          "OPDIPDID": this.vOPIPId,
          "TotalAmt": this.BillingForm.get('FinalTotalAmt').value || 0,
          "ConcessionAmt": parseFloat(this.BillingForm.get('FinalconcessionAmt').value) || 0,
          "NetPayableAmt": this.BillingForm.get('FinalNetAmt').value || 0,
          "PaidAmt":this.BillingForm.get('FinalNetAmt').value || 0,
          "BalanceAmt": 0,
          "BillDate": this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          "OPDIPDType": 0,
          "AddedBy": 10,
          "TotalAdvanceAmount": 0,
          "BillTime": this.dateTimeObj.time,
          "ConcessionReasonId": ConcessionId,
          "IsSettled": true,
          "IsPrinted": true,
          "IsFree": true,
          "CompanyId": 0,
          "TariffId": 0,
          "UnitId": 1,
          "InterimOrFinal": 0,
          "CompanyRefNo": 0,
          "ConcessionAuthorizationName": 0,
          "SpeTaxPer": 10,
          "SpeTaxAmt": 10,
          "CompDiscAmt": 0,
          "DiscComments": ConcessionReason,
          "CashCounterId": this.searchFormGroup.get('CashCounterID').value.CashCounterId || 0 ,
          "AddCharges": InsertAdddetArr,
          "BillDetails": Billdetsarr, "Payments":Paymentobj
        }
        console.log(submitData)
        this._oPSearhlistService.OpBillInsertSave(submitData).subscribe((response) => {
          this.toastr.success(response.message);
          this.viewgetBillReportPdf(response);
                this.getWhatsappshareSales(response, this.vMobileNo)
          this.onClear(true);
        }, (error) => {
          this.toastr.error(error.message);
        });
      }
    }

    this.vOPIPId == ''
  }
  onClear(val: boolean) {
    // this.phoneappForm.reset();
    // this.dialogRef.close(val);
  }

  saveCreditbill1() {
    this.savebtn = true;
    let disamt = this.BillingForm.get('FinalconcessionAmt').value;

    if (!this.searchFormGroup.get('CashCounterID').value) {
      this.toastr.warning('Select Cash Counter', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.searchFormGroup.get('CashCounterID').value) {
      if (!this.CashCounterList.some(item => item.CashCounterName === this.searchFormGroup.get('CashCounterID').value.CashCounterName)) {
        this.toastr.warning('Please Select valid Cash Counter Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    let ConcessionId = 0;
    if (this.BillingForm.get('ConcessionId').value)
      ConcessionId = this.BillingForm.get('ConcessionId').value.ConcessionId;

    let ConcessionReason = '';
    if (this.BillingForm.get('ConcessionId').value)
      ConcessionReason = this.BillingForm.get('ConcessionId').value.ConcessionReason;

    if (this.vFinalconcessionDiscPer > 0 || disamt > 0) {
      this.FinalNetAmt = this.vFinalnetPaybleAmt;
      this.netPaybleAmt1 = this.vFinalnetPaybleAmt;
    }
    else {
      this.FinalNetAmt = this.vFinalnetPaybleAmt;
      this.netPaybleAmt1 = this.vFinalnetPaybleAmt;
    }

    this.isLoading = 'submit';

    let InsertBillUpdateBillNoObj = {};
    InsertBillUpdateBillNoObj['BillNo'] = 0;
    InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.vOPIPId;
    InsertBillUpdateBillNoObj['TotalAmt'] = this.BillingForm.get('FinalTotalAmt').value;
    InsertBillUpdateBillNoObj['concessionAmt'] = this.BillingForm.get('FinalconcessionAmt').value || 0
    InsertBillUpdateBillNoObj['NetPayableAmt'] = parseFloat(this.BillingForm.get('FinalNetAmt').value) || 0;
    InsertBillUpdateBillNoObj['PaidAmt'] = 0//this.BillingForm.get('FinalNetAmt').value;
    InsertBillUpdateBillNoObj['BalanceAmt'] = 0;
    InsertBillUpdateBillNoObj['BillDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 0;
    InsertBillUpdateBillNoObj['AddedBy'] = this.accountService.currentUserValue.user.id,
      InsertBillUpdateBillNoObj['TotalAdvanceAmount'] = 0,
      InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.time,// this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy hh:mm tt') || '01/01/1900',
      InsertBillUpdateBillNoObj['ConcessionReasonId'] = ConcessionId;
    InsertBillUpdateBillNoObj['IsSettled'] = 0;
    InsertBillUpdateBillNoObj['IsPrinted'] = 0;
    InsertBillUpdateBillNoObj['IsFree'] = 0;
    InsertBillUpdateBillNoObj['CompanyId'] = 0;
    InsertBillUpdateBillNoObj['TariffId'] = this.vTariffId || 0;
    InsertBillUpdateBillNoObj['UnitId'] = 1,//this.selectedAdvanceObj.UnitId || 0;
      InsertBillUpdateBillNoObj['InterimOrFinal'] = 0;
    InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
    InsertBillUpdateBillNoObj['concessionAuthorizationName'] = 0;
    InsertBillUpdateBillNoObj['TaxPer'] = 0;
    InsertBillUpdateBillNoObj['TaxAmount'] = 0;
    InsertBillUpdateBillNoObj['DiscComments'] = ConcessionReason;
    InsertBillUpdateBillNoObj['cashCounterId'] = this.searchFormGroup.get('CashCounterID').value.CashCounterId || 0

    let Billdetsarr = [];
    this.dataSource.data.forEach((element) => {
      let BillDetailsInsertObj = {};
      BillDetailsInsertObj['BillNo'] = 0;
      BillDetailsInsertObj['ChargesId'] = element.ServiceId;
      Billdetsarr.push(BillDetailsInsertObj);
    });

    let InsertAdddetArr = [];
    this.dataSource.data.forEach((element) => {

      let InsertAddChargesObj = {};
      InsertAddChargesObj['ChargeID'] = element.ServiceId,
        InsertAddChargesObj['ChargesDate'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
        InsertAddChargesObj['opD_IPD_Type'] = 0,
        InsertAddChargesObj['opD_IPD_Id'] = this.vOPIPId,
        InsertAddChargesObj['serviceId'] = element.ServiceId,
        InsertAddChargesObj['price'] = element.Price,
        InsertAddChargesObj['qty'] = element.Qty,
        InsertAddChargesObj['totalAmt'] = element.TotalAmt,
        InsertAddChargesObj['concessionPercentage'] = element.DiscPer || 0,
        InsertAddChargesObj['concessionAmount'] = element.DiscAmt || 0,
        InsertAddChargesObj['netAmount'] = element.NetAmount,
        InsertAddChargesObj['doctorId'] = element.DoctorId,
        InsertAddChargesObj['docPercentage'] = 0,
        InsertAddChargesObj['docAmt'] = 0,
        InsertAddChargesObj['hospitalAmt'] = element.NetAmount,
        InsertAddChargesObj['isGenerated'] = 0,
        InsertAddChargesObj['addedBy'] = this.accountService.currentUserValue.user.id,
        InsertAddChargesObj['isCancelled'] = 0,
        InsertAddChargesObj['isCancelledBy'] = 0,
        InsertAddChargesObj['isCancelledDate'] = "01/01/1900",
        InsertAddChargesObj['isPathology'] = element.IsPathology,
        InsertAddChargesObj['isRadiology'] = element.IsRadiology,
        InsertAddChargesObj['isPackage'] = 0,
        InsertAddChargesObj['packageMainChargeID'] = 0,
        InsertAddChargesObj['isSelfOrCompanyService'] = false,
        InsertAddChargesObj['packageId'] = 0,
        InsertAddChargesObj['BillNo'] = 0,
        InsertAddChargesObj['chargeTime'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
        InsertAddChargesObj['classId'] = this.vClassId,

        InsertAdddetArr.push(InsertAddChargesObj);
    })


    let opCalDiscAmountBill = {}
    opCalDiscAmountBill['billNo'] = 0

    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      PatientHeaderObj['PatientName'] = this.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = this.vOPIPId;
    PatientHeaderObj['NetPayAmount'] = this.BillingForm.get('FinalNetAmt').value;


    if (this.vFinalconcessionDiscPer > 0) {
      this.FinalNetAmt = this.totalAmtOfNetAmt - disamt;
    } else {
      this.FinalNetAmt = this.vFinalnetPaybleAmt;
    }

    InsertBillUpdateBillNoObj['BalanceAmt'] = this.BillingForm.get('FinalNetAmt').value;
    let submitData = {
      "chargesDetailCreditInsert": InsertAdddetArr,
      "insertBillcreditupdatewithbillno": InsertBillUpdateBillNoObj,
      "opBillDetailscreditInsert": Billdetsarr,
      "opCalDiscAmountBillcredit": opCalDiscAmountBill,
    };
    console.log(submitData);
    this._oPSearhlistService.InsertOPBillingCredit(submitData).subscribe(response => {
      if (response) {
        this.toastr.success(' OP Bill Credit Record Saved Successfully.', 'Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.savebtn = true;
        let m = response;
        this.viewgetBillReportPdf(response);
        this.getWhatsappshareSales(response, this.vMobileNo);
        this.onClose();

      } else {
        this.toastr.success('OP Billing data not saved', 'error', {
          toastClass: 'tostr-tost custom-toast-success',
        });
      }
      this.isLoading = '';
    });
  }

  saveCreditbill(){
   
    var mdata=
    {
      "BillNo": 0,
        "OPDIPDID": 211110,
        "TotalAmt": 2220,
        "ConcessionAmt": 1110,
        "NetPayableAmt": 210,
        "PaidAmt": 0,
        "BalanceAmt": 22210,
        "BillDate": "2024-08-10 00:00:00.000",
        "OPDIPDType": 0,
        "AddedBy": 110,
        "TotalAdvanceAmount": 0,
        "BillTime": "2024-08-10 00:00:00.000",
        "ConcessionReasonId": 0,
        "IsSettled": true,
        "IsPrinted": true,
        "IsFree": true,
        "CompanyId": 10,
        "TariffId": 10,
        "UnitId": 10,
        "InterimOrFinal": 0,
        "CompanyRefNo": 0,
        "ConcessionAuthorizationName": 0,
        "SpeTaxPer": 10,
        "SpeTaxAmt": 10,
        "CompDiscAmt": 0,
        "DiscComments": "string",
        "CashCounterId":this.CashCounterId,
        "AddCharges": [
          {
            "ChargesId": 0,
            "ChargesDate":"2024-08-10 00:00:00.000",
            "OpdIpdType": 0,
            "OpdIpdId": 2210,
            "ServiceId": 120,
            "Price": 4410,
            "Qty": 510,
            "TotalAmt": 5510,
            "ConcessionPercentage": 10,
            "ConcessionAmount": 5510,
            "NetAmount": 665510,
            "DoctorId": 410,
            "DocPercentage": 10,
            "DocAmt": 410,
            "HospitalAmt": 440,
            "IsGenerated": true,
            "AddedBy": 310,
            "IsCancelled": true,
            "IsCancelledBy": 30,
            "IsCancelledDate":"2024-08-10 00:00:00.000",
            "IsPathology": true,
            "IsRadiology": true,
            "IsPackage": true,
            "PackageMainChargeID": 0,
            "IsSelfOrCompanyService": true,
            "PackageId": 0,
            "ChargesTime":"2024-08-10 00:00:00.000",
            "ClassId": 110,
            "BillNo": 20
          }
        ],
        "BillDetails": [
          {
            "BillNo": 120,
            "ChargesId": 0
          }
        ]
      , "Payments": [
          {
            "PaymentId": 0,
            "BillNo": 1440,
            "PaymentDate": "2024-08-10 00:00:00.000",
            "PaymentTime": "2024-08-10 00:00:00.000",
            "CashPayAmount": 4430,
            "ChequePayAmount": 330,
            "ChequeNo": "C78",
            "BankName": "BOI",
            "ChequeDate": "2024-08-10 00:00:00.000",
            "CardPayAmount": 110,
            "CardNo": "C99",
            "CardBankName": "OCO",
            "CardDate": "2024-08-10 00:00:00.000",
            "AdvanceUsedAmount": 220,
            "AdvanceId": 10,
            "RefundId": 20,
            "TransactionType": 0,
            "Remark": "string",
            "AddBy": 210,
            "IsCancelled": true,
            "IsCancelledBy": 20,
            "IsCancelledDate": "2024-08-10 00:00:00.000",
            "NeftpayAmount": 220,
            "Neftno": "2",
            "NeftbankMaster": "BOI",
            "Neftdate": "2024-08-10 00:00:00.000",
            "PayTmamount": 110,
            "PayTmtranNo": "PM",
            "PayTmdate": "2024-08-10 00:00:00.000",
            "Tdsamount": 220
          }
        ]
      }
      
console.log(mdata)
    this._oPSearhlistService.InsertOPBillingCredit(mdata).subscribe((response) => {
      this.toastr.success(response.message);
      this.onClear(true);
    }, (error) => {
      this.toastr.error(error.message);
    });
  }
  




  getWhatsappshareSales(el, vmono) {
    if (vmono != '') {
      var m_data = {
        "insertWhatsappsmsInfo": {
          "mobileNumber": vmono || 0,
          "smsString": '',
          "isSent": 0,
          "smsType": 'OPBill',
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
          this.toastr.success('Bill Sent on WhatsApp Successfully.', 'Save !', {
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
  viewgetBillReportPdf(BillNo) {

    this._oPSearhlistService.getOpBillReceipt(
      BillNo
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Op Bill  Viewer"
          }
        });
    });
  }



  onClose() {
    this._matDialog.closeAll();
    this.registeredForm.reset();
    this.searchFormGroup.reset();
    this.BillingForm.reset();
    this.dataSource.data = [];
    this.chargeslist = [];
    this.RegNo = ''
    this.PatientName = ''
    this.Doctorname = ''
    this.vOPDNo = ''
    this.AgeYear = ''
    this.AgeMonth = ''
    this.AgeDay = ''
    this.GenderName = ''
    this.DepartmentName = ''
    this.PatientType = ''
    this.Tarrifname = ''
    this.CompanyName = ''
    this.RefDocName = ''
    this.ServiceDiscper = ''
    this.advanceDataStored.storage = [];
    this.BillingForm.get('PaymentType').setValue('CashPay');
    this.searchFormGroup.get('CashCounterID').setValue(this.setcashCounter)
  }
  addData() {
    this.add = true;
    // this.addbutton.nativeElement.focus();
  }
  @ViewChild('Servicename') Servicename: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('price') price: ElementRef;
  @ViewChild('disper') disper: ElementRef;
  @ViewChild('discamt') discamt: ElementRef;
  @ViewChild('doctorname') doctorname: ElementRef;
  @ViewChild('addbutton') addbutton: ElementRef;
  @ViewChild('netamt') netamt: ElementRef;
  @ViewChild('Doctor') Doctor: ElementRef;
  // @ViewChild('Doctor') Doctor: MatSelect;

  onEnterservice(event): void {

    if (event.which === 13) {
      // this.price.nativeElement.focus();
    }
  }

  public onEnterorice(event): void {
    if (event.which === 13) {
      // this.qty.nativeElement.focus();
    }
  }

  public onEnterqty(event): void {

    if (event.which === 13) {
      if (this.isDoctor) {
        // this.doctorname.nativeElement.focus();
      }
      else {
        // this.disper.nativeElement.focus();
      }
    }
  }
  public onEnterdoctor(event): void {
    if (event.which === 13) {
      // this.disper.nativeElement.focus();
    }
  }
  public onEnterdiscper(event): void {
    if (event.which === 13) {
      // this.discamt.nativeElement.focus();
    }
  }

  public onEnterdiscAmount(event): void {

    if (event.which === 13) {
      // this.netamt.nativeElement.focus();
    }
  }

  public onEnternetAmount(event): void {

    if (event.which === 13) {
      this.add = true;
      // this.addbutton.nativeElement.focus();
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
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  transform(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd/MM/yyyy hh:mm a');
    return value;
  }



  // new API?
  CashCounterId=0;
  ServiceName='';
 
  selectChangecashcounter(obj: any){
    console.log(obj);
this.CashCounterId=obj.value
  }
  
  selectChangeService(obj: any){
    console.log(obj);
    this.serviceId=obj.value
    this.SrvcName=obj.text
  }

  selectChangedoctor(obj: any){
    console.log(obj);
    this.vDoctor=obj.value
    this.ChargesDoctorname=obj.text
  }
}


export class Bill {
  BillNo: number;
  OPD_IPD_ID: number;
  TotalAmt: number;
  FinalconcessionAmt: number;
  NetPayableAmt: number;
  PaidAmt: number;
  BalanceAmt: number;
  BillDate: any;
  OPD_IPD_Type: number;
  AddedBy: number;
  TotalAdvanceAmount: number;
  BillTime: Date;
  ConcessionReasonId: number;
  IsSettled: boolean;
  IsPrinted: boolean;
  IsFree: boolean;
  CompanyId: number;
  TariffId: number;
  UnitId: number;
  InterimOrFinal: number;

  CompanyRefNo: any;
  ConcessionAuthorizationName: number;
  TaxPer: any;
  TaxAmount: any;
  DiscComments: String;
  CashCounterId: any;
  discComments: any;
  constructor(InsertBillUpdateBillNoObj) {
    {
      this.BillNo = InsertBillUpdateBillNoObj.BillNo || 0;
      this.OPD_IPD_ID = InsertBillUpdateBillNoObj.OPD_IPD_ID || 0;
      this.TotalAmt = InsertBillUpdateBillNoObj.TotalAmt || 0;
      this.FinalconcessionAmt = InsertBillUpdateBillNoObj.FinalconcessionAmt || 0;
      this.NetPayableAmt = InsertBillUpdateBillNoObj.NetPayableAmt || 0;
      this.PaidAmt = InsertBillUpdateBillNoObj.PaidAmt || 0;
      this.BalanceAmt = InsertBillUpdateBillNoObj.BalanceAmt || 0;
      this.BillDate = InsertBillUpdateBillNoObj.BillDate || '';
      this.OPD_IPD_Type = InsertBillUpdateBillNoObj.OPD_IPD_Type || 0;
      this.AddedBy = InsertBillUpdateBillNoObj.AddedBy || 0;
      this.TotalAdvanceAmount = InsertBillUpdateBillNoObj.TotalAdvanceAmount || 0;
      this.BillTime = InsertBillUpdateBillNoObj.BillTime || '';
      this.ConcessionReasonId = InsertBillUpdateBillNoObj.ConcessionReasonId || 0;
      this.IsSettled = InsertBillUpdateBillNoObj.IsSettled || 0;
      this.IsPrinted = InsertBillUpdateBillNoObj.IsPrinted || 0;
      this.IsFree = InsertBillUpdateBillNoObj.IsFree || 0;
      this.CompanyId = InsertBillUpdateBillNoObj.CompanyId || 0;
      this.TariffId = InsertBillUpdateBillNoObj.TariffId || 0;
      this.UnitId = InsertBillUpdateBillNoObj.UnitId || 0;
      this.InterimOrFinal = InsertBillUpdateBillNoObj.InterimOrFinal || 0;
      this.CompanyRefNo = InsertBillUpdateBillNoObj.CompanyRefNo || 0;
      this.ConcessionAuthorizationName = InsertBillUpdateBillNoObj.ConcessionAuthorizationName || 0;
      this.TaxPer = InsertBillUpdateBillNoObj.TaxPer || 0;
      this.TaxAmount = InsertBillUpdateBillNoObj.TaxAmount || 0;
      this.DiscComments = InsertBillUpdateBillNoObj.DiscComments || '';
      this.CashCounterId = InsertBillUpdateBillNoObj.CashCounterId || 0;
      this.discComments = InsertBillUpdateBillNoObj.discComments || 0;
    }
  }
}

export class BillDetails {
  BillNo: number;
  ChargesId: number;

  constructor(BillDetailsInsertObj) {
    {
      this.BillNo = BillDetailsInsertObj.BillNo || 0;
      this.ChargesId = BillDetailsInsertObj.ChargesId || 0;
      //this.BillDetailId=BillDetailsInsertObj.BillDetailId || 0;
    }
  }
}
export class Cal_DiscAmount {
  BillNo: number;

  constructor(Cal_DiscAmount_OPBillObj) {
    {
      this.BillNo = Cal_DiscAmount_OPBillObj.BillNo || 0;
    }
  }
}

export class PathologyReportHeader {

  PathDate: Date;
  PathTime: Date;
  OPD_IPD_Type: number;
  OPD_IPD_Id: number;
  PathTestID: number;
  AddedBy: number;
  ChargeID: number;
  IsCompleted: Boolean;
  IsPrinted: Boolean;
  IsSampleCollection: Boolean;
  TestType: Boolean;

  /**
   * Constructor
   *
   * @param PathologyReportHeaderObj
   */
  constructor(PathologyReportHeaderObj) {
    {
      this.PathDate = PathologyReportHeaderObj.PathDate || '';
      this.PathTime = PathologyReportHeaderObj.PathTime || '';
      this.OPD_IPD_Type = PathologyReportHeaderObj.OPD_IPD_Type || 0;
      this.OPD_IPD_Id = PathologyReportHeaderObj.OPD_IPD_Id || 0;
      this.PathTestID = PathologyReportHeaderObj.PathTestID || 0;
      this.AddedBy = PathologyReportHeaderObj.AddedBy || 0;
      this.ChargeID = PathologyReportHeaderObj.ChargeID || 0;
      this.IsCompleted = PathologyReportHeaderObj.IsCompleted || 0;
      this.IsPrinted = PathologyReportHeaderObj.IsPrinted || 0;
      this.IsSampleCollection = PathologyReportHeaderObj.IsSampleCollection || 0;
      this.TestType = PathologyReportHeaderObj.TestType || 0;

    }
  }
}

export class RadiologyReportHeader {

  RadDate: Date;
  RadTime: Date;
  OPD_IPD_Type: number;
  OPD_IPD_Id: number;
  RadTestID: number;
  AddedBy: number;
  IsCancelled: Boolean;
  ChargeID: number;
  IsCompleted: Boolean;
  IsPrinted: Boolean;
  TestType: Boolean;

  /**
   * Constructor
   *
   * @param RadiologyReportHeaderObj
   */
  constructor(RadiologyReportHeaderObj) {
    {
      this.RadDate = RadiologyReportHeaderObj.RadDate || '';
      this.RadTime = RadiologyReportHeaderObj.RadTime || '';
      this.OPD_IPD_Type = RadiologyReportHeaderObj.OPD_IPD_Type || 0;
      this.OPD_IPD_Id = RadiologyReportHeaderObj.OPD_IPD_Id || 1;
      this.RadTestID = RadiologyReportHeaderObj.RadTestID || 0;
      this.AddedBy = RadiologyReportHeaderObj.AddedBy || 0;
      this.ChargeID = RadiologyReportHeaderObj.ChargeID || 0;
      this.IsCompleted = RadiologyReportHeaderObj.IsCompleted || 0;
      this.IsPrinted = RadiologyReportHeaderObj.IsPrinted || 0;
      this.TestType = RadiologyReportHeaderObj.TestType || 0;

    }
  }
}

export class OPDoctorShareGroupAdmCharge {

  BillNo: number;

  /**
  * Constructor
  *
  * @param OPDoctorShareGroupAdmChargeObj
  */
  constructor(OPDoctorShareGroupAdmChargeObj) {
    {
      this.BillNo = OPDoctorShareGroupAdmChargeObj.BillNo || 0;
    }
  }
}


export class PaymentInsert {
  PaymentId: number;
  BillNo: number;
  ReceiptNo: String;
  PaymentDate: any;
  PaymentTime: any;
  CashPayAmount: number;
  ChequePayAmount: number;
  ChequeNo: String;
  BankName: String;
  ChequeDate: any;
  CardPayAmount: number;
  CardNo: String;
  CardBankName: String;
  CardDate: any;
  AdvanceUsedAmount: number;
  AdvanceId: number;
  RefundId: number;
  TransactionType: number;
  Remark: String;
  AddBy: number;
  IsCancelled: Boolean;
  IsCancelledBy: number;
  IsCancelledDate: any;
  CashCounterId: number;
  IsSelfORCompany: number;
  CompanyId: number;
  NEFTPayAmount: any;
  NEFTNo: String;
  NEFTBankMaster: String;
  NEFTDate: any;
  PayTMAmount: number;
  PayTMTranNo: String;
  PayTMDate: any;

  /**
  * Constructor
  *
  * @param PaymentInsertObj
  */
  constructor(PaymentInsertObj) {
    {
      this.PaymentId = PaymentInsertObj.PaymentId || 0;
      this.BillNo = PaymentInsertObj.BillNo || 0;
      this.ReceiptNo = PaymentInsertObj.ReceiptNo || 0;
      this.PaymentDate = PaymentInsertObj.PaymentDate || '';
      this.PaymentTime = PaymentInsertObj.PaymentTime || '';
      this.CashPayAmount = PaymentInsertObj.CashPayAmount || 0;
      this.ChequePayAmount = PaymentInsertObj.ChequePayAmount || 0;
      this.ChequeNo = PaymentInsertObj.ChequeNo || '';
      this.BankName = PaymentInsertObj.BankName || '';
      this.ChequeDate = PaymentInsertObj.ChequeDate || '';
      this.CardPayAmount = PaymentInsertObj.CardPayAmount || 0;
      this.CardNo = PaymentInsertObj.CardNo || 0;
      this.CardBankName = PaymentInsertObj.CardBankName || '';
      this.CardDate = PaymentInsertObj.CardDate || '';
      this.AdvanceUsedAmount = PaymentInsertObj.AdvanceUsedAmount || 0;
      this.AdvanceId = PaymentInsertObj.AdvanceId || 0;
      this.RefundId = PaymentInsertObj.RefundId || 0;
      this.TransactionType = PaymentInsertObj.TransactionType || 0;
      this.Remark = PaymentInsertObj.Remark || '';
      this.AddBy = PaymentInsertObj.AddBy || 0;
      this.IsCancelled = PaymentInsertObj.IsCancelled || false;
      this.IsCancelledBy = PaymentInsertObj.IsCancelledBy || 0;
      this.IsCancelledDate = PaymentInsertObj.IsCancelledDate || '';
      this.IsCancelledDate = PaymentInsertObj.IsCancelledDate || '';
      this.CashCounterId = PaymentInsertObj.CashCounterId || 0;
      this.IsSelfORCompany = PaymentInsertObj.IsSelfORCompany || 0;
      this.CompanyId = PaymentInsertObj.CompanyId || 0;
      this.NEFTPayAmount = PaymentInsertObj.NEFTPayAmount || 0;
      this.NEFTNo = PaymentInsertObj.NEFTNo || '';
      this.NEFTBankMaster = PaymentInsertObj.NEFTBankMaster || '';
      this.NEFTDate = PaymentInsertObj.NEFTDate || '';
      this.PayTMAmount = PaymentInsertObj.PayTMAmount || 0;
      this.PayTMTranNo = PaymentInsertObj.PayTMTranNo || '';
      this.PayTMDate = PaymentInsertObj.PayTMDate || '';
    }

  }
}


export class patientinfo {
  Date: Date;
  OPD_IPD_Id: number;
  NetPayAmount: number;

  constructor(patientinfo) {
    this.Date = patientinfo.Date || 0;
    this.OPD_IPD_Id = patientinfo.OPD_IPD_Id || 0;
    this.NetPayAmount = patientinfo.NetPayAmount || '';
  }
}


export class AddChargesInsert {


  ChargeID: number;
  ChargesDate: Date;
  OPD_IPD_Type: number;
  OPD_IPD_Id: number;
  ServiceId: any;
  Price: number;
  Qty: number;
  TotalAmt: String;
  ConcessionPercentage: String;
  ConcessionAmount: any;
  NetAmount: number;
  DoctorId: String;
  DocPercentage: String;
  DocAmt: any;
  HospitalAmt: number;
  IsGenerated: boolean;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: String;
  IsCancelledDate: number;
  CashCounterId: number;
  IsPathology: boolean;
  IsRadiology: boolean;
  IsPackage: boolean;
  PackageMainChargeID: any;
  IsSelfOrCompanyService: boolean;
  PackageId: String;
  ChargeTime: any;
  ClassId: number;

  /**
  * Constructor
  *
  * @param AddChargesInsert
  */
  constructor(AddChargesInsertObj) {
    {
      this.ChargeID = AddChargesInsertObj.ChargeID || 0;
      this.ChargesDate = AddChargesInsertObj.ChargesDate || 0;
      this.OPD_IPD_Type = AddChargesInsertObj.OPD_IPD_Type || 0;
      this.OPD_IPD_Id = AddChargesInsertObj.OPD_IPD_Id || '';
      this.ServiceId = AddChargesInsertObj.ServiceId || '';
      this.Price = AddChargesInsertObj.Price || 0;
      this.Qty = AddChargesInsertObj.Qty || 0;
      this.TotalAmt = AddChargesInsertObj.TotalAmt || '';
      this.ConcessionPercentage = AddChargesInsertObj.ConcessionPercentage || '';
      this.ConcessionAmount = AddChargesInsertObj.ConcessionAmount || '';
      this.NetAmount = AddChargesInsertObj.NetAmount || 0;
      this.DoctorId = AddChargesInsertObj.DoctorId || 0;
      this.DocPercentage = AddChargesInsertObj.DocPercentage || '';
      this.DocAmt = AddChargesInsertObj.DocAmt || '';
      this.HospitalAmt = AddChargesInsertObj.HospitalAmt || 0;
      this.IsGenerated = AddChargesInsertObj.IsGenerated || 0;
      this.AddedBy = AddChargesInsertObj.AddedBy || 0;
      this.IsCancelled = AddChargesInsertObj.IsCancelled || 0;
      this.IsCancelledBy = AddChargesInsertObj.IsCancelledBy || '';
      this.IsCancelledDate = AddChargesInsertObj.IsCancelledDate || 0;
      this.IsPathology = AddChargesInsertObj.IsPathology || false;
      this.IsRadiology = AddChargesInsertObj.IsRadiology || 0;
      this.IsPackage = AddChargesInsertObj.IsPackage || '';
      this.PackageMainChargeID = AddChargesInsertObj.PackageMainChargeID || '';
      this.IsSelfOrCompanyService = AddChargesInsertObj.IsSelfOrCompanyService || 0;
      this.PackageId = AddChargesInsertObj.PackageId || 0;
      this.ChargeTime = AddChargesInsertObj.ChargeTime || 0;
      this.ClassId = AddChargesInsertObj.ClassId || 0;

    }
  }
}

export class advanceHeader {
  AdvanceId: number;
  AdvanceAmount: number;
  Date: Date;
  RefId: number;
  OPD_IPD_Type: number;
  OPD_IPD_Id: number;
  AdvanceUsedAmount: number;
  BalanceAmount: number;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: Date;

  constructor(advanceHeaderObj) {
    {
      this.AdvanceId = advanceHeaderObj.AdvanceId || 0;
      this.Date = advanceHeaderObj.Date || '';
      this.RefId = advanceHeaderObj.RefId || 0;
      this.OPD_IPD_Type = advanceHeaderObj.OPD_IPD_Type || 0;
      this.OPD_IPD_Id = advanceHeaderObj.OPD_IPD_Id || 0;
      this.AdvanceAmount = advanceHeaderObj.AdvanceAmount || 0;
      this.AdvanceUsedAmount = advanceHeaderObj.AdvanceUsedAmount || 0;
      this.BalanceAmount = advanceHeaderObj.BalanceAmount || 0;
      this.AddedBy = advanceHeaderObj.AddedBy || 0;
      this.IsCancelled = advanceHeaderObj.IsCancelled || false;
      this.IsCancelledBy = advanceHeaderObj.IsCancelledBy || 0;
      this.IsCancelledDate = advanceHeaderObj.IsCancelledDate || '';
    }
  }
}
export class Post {
  BillNo: any;

  constructor(Post) {
    {
      this.BillNo = Post.BillNo || 0;
    }
  }
}

