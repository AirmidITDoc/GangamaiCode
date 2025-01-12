import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { ChargesList, SearchInforObj } from '../../op-search-list/opd-search-list/opd-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { UntypedFormBuilder, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
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
import { BrowseOPDBill } from '../../new-oplist/new-oplist.component';
import { Regdetail } from '../../appointment-list/appointment-list.component';
import { AdvanceDetailObj } from '../../appointment/appointment.component';
import { Payment } from 'app/main/ipd/ip-search-list/ip-search-list.component';

@Component({
  selector: 'app-new-opbilling',
  templateUrl: './new-opbilling.component.html',
  styleUrls: ['./new-opbilling.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations

})
export class NewOPBillingComponent implements OnInit {
  searchFormGroup: FormGroup;
  registeredForm: FormGroup;
  BillingForm: FormGroup;

  myShowAdvanceForm: FormGroup;

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
    'ServiceNamePackage',
    'ServiceName',
    'Qty',
    'Price',
    'TotalAmt',
    'DiscPer',
    'DiscAmt',
    'NetAmount',
    // 'action'
  ];
  displayedPrescriptionColumns = [
    'ServiceName',
    'Qty',
    'Price',
    'TotalAmt',
  ];

  CashCounterList: any = [];
  ConcessionReasonList: any = [];
  chargeslist: any = [];
  PacakgeList: any = [];
  interimArray: any = [];
  doctorNameCmbList: any = [];
  IPBillingInfor: any = [];
  reportPrintObj: BrowseOPDBill;
  subscriptionArr: Subscription[] = [];
  filteredOptionsDoctor: Observable<string[]>;
  reportPrintObjList: BrowseOPDBill[] = [];
  optionsDoctor: any[] = [];
  billingServiceList = [];
  Paymentdataobj:PaymentInsert[] = [];
  private nextPage$ = new Subject();
  registerObj = new BrowseOPDBill({});
  registerObj1 = new Regdetail({});
  Paymentdataobj1 = new PaymentInsert({});
  selectedAdvanceObj: SearchInforObj;
  PatientHeaderObj: AdvanceDetailObj;
  dataSource = new MatTableDataSource<ChargesList>();
  dsPackageDet = new MatTableDataSource<ChargesList>();
  dsprescritionList = new MatTableDataSource<ChargesList>();



  isRegIdSelected: boolean = false;
  isCashCounterSelected: boolean = false;
  noOptionFound: boolean = false;
  isServiceSelected: boolean = false;
  isDoctor: boolean = false;
  isDoctorSelected: boolean = false;
  Consessionres: boolean = false;
  savebtn: boolean = true;
  BillDiscPer: boolean = false;
  saveclick: boolean = false;
  isExpanded: boolean = false;
  add: Boolean = false;
  isFilteredDateDisabled: boolean = true;

  filteredOptionsCashCounter: Observable<string[]>;

  PatientListfilteredOptions: any;
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
  RegNo: any = 12;
  vClassName: any;
  screenFromString = 'OP-billing';
  dateTimeObj: any;
  filteredOptionsService: any;
  CreditedtoDoctor: any;
  IsPathology: any;
  IsRadiology: any;
  isLoading: String = '';
  vIsPackage: any;
  vPrice = '0';
  vQty: any;
  vChargeTotalAmount: any = 0;
  vDoctor: any;
  filteredOptionsDoctors: any;
  VchargeDiscPer: any = 0;
  vchargeDisAmount: any = 0;
  vCahrgeNetAmount: any = 0;
  serviceId: number;
  ChargesDoctorname: any;
  DoctornewId: any;
  vFinalTotalAmt: any;
  vFinalConcessionAmt: any;
  vFinalconcessionDiscPer: any;
  vFinalnetPaybleAmt: any = 0;
  vMobileNo: any;
  paidamt: number;
  flagSubmit: boolean;
  balanceamt: number;
  disamt: any;
  msg: any;
  vRegNo: any;
  printTemplate: any;
  ConcessionReason: any;
  FinalNetAmt: any;
  totalamt = 0;
  TotalAmount = 0;
  netPaybleAmt: any;
  netPaybleAmt1: any;
  resBillId: Post;
  SrvcName: any;
  totalAmtOfNetAmt: any;
  serviceName: String;


  currentDate = new Date();

  //new 
  autocompleteModeCashcounter: string = "CashCounter";
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModeService: string = "Service";
  autocompleteModeConcession: string = "Concession";

  getsupplierId
  ServiceList: any = [];
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
    public _ConfigService: ConfigService,
    private _loggedService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();

    this.createForm();

    this.BillingFooterForm();
    if (this.data) {
      console.log(this.data)
      setTimeout(() => {
        this._oPSearhlistService.getRegistraionById(this.data.regId).subscribe((response) => {
          this.registerObj1 = response;
          console.log(this.registerObj1)
        });
      }, 500);
    }

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
    this.CompanyId = obj.CompanyId;
  }
  getOptionText1(option) {
    if (!option)
      return '';
    return option.serviceName;

  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  //Service list

  getServiceListCombobox() {
    debugger
    let sname = this.registeredForm.get('SrvcName').value + '%' || '%'
    var m_data = {

      "first": 0,
      "rows": 30,
      "sortField": "ServiceId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "ServiceName", "fieldValue": sname, "opType": "StartsWith" },
        { "fieldName": "TariffId", "fieldValue": "0", "opType": "Equals" },
        { "fieldName": "GroupId", "fieldValue": "0", "opType": "Equals" },
        { "fieldName": "Start", "fieldValue": "0", "opType": "Equals" },
        { "fieldName": "Length", "fieldValue": "30", "opType": "Equals" }
      ],
      "exportType": "JSON"
    }

    console.log(m_data)

    this._oPSearhlistService.getBillingServiceList(m_data).subscribe(data => {
      this.filteredOptionsService = data.data;
      this.ServiceList = data.data;

      if (this.filteredOptionsService.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });


  }
  SrvcName1: any = ""
  getSelectedObj(obj) {
    if (this.dataSource.data.length > 0) {
      this.dataSource.data.forEach((element) => {
        if (obj.serviceId == element.serviceId) {

          Swal.fire('Selected Item already added in the list ');

          this.onClearServiceAddList();
        }

      });
    } else {
      console.log(obj)

      this.SrvcName1 = obj.serviceName;
      this.vPrice = obj.price;
      this.vQty = 1;
      this.vChargeTotalAmount = obj.price;
      this.vCahrgeNetAmount = obj.price;
      this.serviceId = obj.serviceId;
      this.IsPathology = obj.isPathology;
      this.IsRadiology = obj.isRadiology;
      this.vIsPackage = obj.IsPackage;
      this.CreditedtoDoctor = obj.creditedtoDoctor;
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



  getOptionText(option) {

    return option && option.serviceName ? option.serviceName : '';
  }
  // getSelectedObj3(obj) {
  //   console.log(obj)
  //   if (this.dataSource.data.length > 0) {
  //     this.dataSource.data.forEach((element) => {
  //       if (obj.ServiceId == element.ServiceId) {
  //         Swal.fire('Selected Item already added in the list ');
  //         this.onClearServiceAddList();
  //       }
  //     });
  //     this.SrvcName = obj.ServiceName;
  //     this.vPrice = obj.Price;
  //     this.vQty = 1;
  //     this.vChargeTotalAmount = obj.Price;
  //     this.vCahrgeNetAmount = obj.Price;
  //     this.serviceId = obj.ServiceId;
  //     this.IsPathology = obj.IsPathology;
  //     this.IsRadiology = obj.IsRadiology;
  //     this.vIsPackage = obj.IsPackage;
  //     this.CreditedtoDoctor = obj.CreditedtoDoctor;
  //     if (this.CreditedtoDoctor == true) {
  //       this.isDoctor = true;
  //       this.registeredForm.get('DoctorID').reset();
  //       this.registeredForm.get('DoctorID').setValidators([Validators.required]);
  //       this.registeredForm.get('DoctorID').enable();

  //     } else {
  //       this.isDoctor = false;
  //       this.registeredForm.get('DoctorID').reset();
  //       this.registeredForm.get('DoctorID').clearValidators();
  //       this.registeredForm.get('DoctorID').updateValueAndValidity();
  //       this.registeredForm.get('DoctorID').disable();
  //     }
  //   }
  //   else {
  //     this.SrvcName = obj.ServiceName;
  //     this.vPrice = obj.Price;
  //     this.vQty = 1;
  //     this.vChargeTotalAmount = obj.Price;
  //     this.vCahrgeNetAmount = obj.Price;
  //     this.serviceId = obj.ServiceId;
  //     this.IsPathology = obj.IsPathology;
  //     this.IsRadiology = obj.IsRadiology;
  //     this.vIsPackage = obj.IsPackage;
  //     this.CreditedtoDoctor = obj.CreditedtoDoctor;
  //     if (this.CreditedtoDoctor == true) {
  //       this.isDoctor = true;
  //       this.registeredForm.get('DoctorID').reset();
  //       this.registeredForm.get('DoctorID').setValidators([Validators.required]);
  //       this.registeredForm.get('DoctorID').enable();
  //     } else {
  //       this.isDoctor = false;
  //       this.registeredForm.get('DoctorID').reset();
  //       this.registeredForm.get('DoctorID').clearValidators();
  //       this.registeredForm.get('DoctorID').updateValueAndValidity();
  //       this.registeredForm.get('DoctorID').disable();
  //     }
  //   }
  // }
  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    // this.nextPage$.next();
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

    this.isLoading = 'save';
    this.dataSource.data = [];
    console.log(this.registeredForm.get('SrvcName').value)
    this.chargeslist.push(
      {
        ChargesId: 0,// this.serviceId,
        ServiceId: this.serviceId,
        ServiceName: this.SrvcName1,
        Price: this.vPrice || 0,
        Qty: this.vQty || 0,
        TotalAmt: this.vChargeTotalAmount || 0,
        DiscPer: this.VchargeDiscPer || 0,
        DiscAmt: this.vchargeDisAmount || 0,
        NetAmount: this.vCahrgeNetAmount || 0,
        ClassId: 1,//this.selectedAdvanceObj.ClassId || 0,
        DoctorId: this.DoctornewId,// (this.registeredForm.get("DoctorID").value.DoctorName).toString() || '',
        DoctorName: this.ChargesDoctorname,
        ChargesDate: this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        IsPathology: this.IsPathology,
        IsRadiology: this.IsRadiology,
        IsPackage: this.vIsPackage,
        ClassName: this.vClassName,// this.selectedAdvanceObj.ClassName || '',
        ChargesAddedName: 1// this.accountService.currentUserValue.user.id || 1,

      });
    this.isLoading = '';
    this.dataSource.data = this.chargeslist;
    this.changeDetectorRefs.detectChanges();
    this.isDoctor = false;
    this.Servicename.nativeElement.focus();
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
  chkdelte: any = [];
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
        if (element.IsPackage == '1' && element.ServiceId) {
          this.PacakgeList = this.PacakgeList.filter(item => item.ServiceId !== element.ServiceId)
          console.log(this.PacakgeList)
          this.dsPackageDet.data = this.PacakgeList;
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
    // 
    // var vdata = {
    //   'ServiceId': this.serviceId
    // }
    // console.log(vdata);
    // this._oPSearhlistService.getpackagedetList(vdata).subscribe((data) => {
    //   this.dsPackageDet.data = data as ChargesList[];
    //   this.dsPackageDet.data.forEach(element =>{
    //     this.PacakgeList.push(
    //       { 
    //         ServiceId: element.ServiceId,
    //         ServiceName: element.ServiceName,
    //         Price: element.Price || 0,
    //         Qty: 1,
    //         TotalAmt:  0,
    //         ConcessionPercentage:  0, 
    //         DiscAmt: 0,
    //         NetAmount: 0,
    //         IsPathology: element.IsPathology,
    //         IsRadiology: element.IsRadiology, 
    //         PackageId:element.PackageId,
    //         PackageServiceId:element.PackageServiceId,
    //         PacakgeServiceName:element.PacakgeServiceName,
    //       })
    //   })
    //   this.dsPackageDet.data = this.PacakgeList
    //   console.log(this.PacakgeList);
    //   console.log(this.dsPackageDet.data);
    // });
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

    // if (this._loggedService.currentUserValue.user.isDiscApply == 1) {

    let discPerLimit = 0//this._loggedService.currentUserValue.user.discApplyPer || 0

    let finalDiscPer = this.BillingForm.get("FinalconcessionPer").value || 0;
    if (finalDiscPer > 0 && finalDiscPer < discPerLimit || finalDiscPer > discPerLimit) {
      if (finalDiscPer > discPerLimit) {
        Swal.fire({
          title: 'The Administration Defined The Dicount Limit',
          text: `Your discount limit is: ${discPerLimit}%`,
          icon: 'info',
          confirmButtonText: 'OK'
        });
        // Swal.fire("The Administration defined the dicount limit");
        this.vFinalconcessionDiscPer = '';
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
    // }
    // else {
    //   let finalDiscPer = this.BillingForm.get("FinalconcessionPer").value || 0;
    //   if (finalDiscPer > 0 && finalDiscPer < 100 || finalDiscPer > 100) {
    //     if (finalDiscPer > 100) {
    //       Swal.fire("Please enter discount percentage less than 100");
    //       this.vFinalconcessionDiscPer = '';
    //       this.vFinalConcessionAmt = '';
    //       this.vFinalnetPaybleAmt = this.vFinalTotalAmt;
    //       this.BillingForm.get('FinalconcessionAmt').setValue(this.vFinalConcessionAmt)
    //       this.BillingForm.get('FinalNetAmt').setValue(this.vFinalnetPaybleAmt)
    //     } else {
    //       this.vFinalConcessionAmt = Math.round((parseFloat(this.vFinalTotalAmt) * parseFloat(finalDiscPer)) / 100);
    //       this.vFinalnetPaybleAmt = Math.round(parseFloat(this.vFinalTotalAmt) - parseFloat(this.vFinalConcessionAmt)).toFixed(2);
    //       this.BillingForm.get('FinalconcessionAmt').setValue(this.vFinalConcessionAmt)
    //       this.BillingForm.get('FinalNetAmt').setValue(this.vFinalnetPaybleAmt)
    //     }
    //   } else {
    //     this.vFinalConcessionAmt = '';
    //     this.vFinalnetPaybleAmt = this.vFinalTotalAmt;
    //     this.BillingForm.get('FinalconcessionAmt').setValue(this.vFinalConcessionAmt)
    //     this.BillingForm.get('FinalNetAmt').setValue(this.vFinalnetPaybleAmt)
    //   }
    // }
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

  onsave() {
    // if ((this.vOPIPId == '' || this.vOPIPId == null || this.vOPIPId == undefined)) {
    //   this.toastr.warning('Please select Patient', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    if ((!this.dataSource.data.length)) {
      this.toastr.warning('Please add service in table', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    Swal.fire({
      title: 'Do you want to Generate the Bill',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Generate!"

    }).then((result) => {
      if (result.isConfirmed) {
        this.onSaveOPBill2();
      }
    })
  }



  SavePackageList: any = [];
  onSaveOPBill2() {
    debugger

    if ((!this.dataSource.data.length)) {
      this.toastr.warning('Please add service in table', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.savebtn = true;
    if (this.CompanyId !== 0 && this.CompanyId !== "" && this.CompanyId !== undefined) {
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
        ConcessionId = this.BillingForm.get('ConcessionId').value.value;

      let ConcessionReason = '';
      // if (this.BillingForm.get('ConcessionId').value)
      //   ConcessionReason = this.BillingForm.get('ConcessionId').value.ConcessionReason;

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
        // if(element.IsPackage == '1'){
        //   this.SavePackageList = this.dsPackageDet.data.filter(item => item.ServiceId == element.ServiceId);
        //   if(this.SavePackageList.length > 0){ 
        //     this.SavePackageList.forEach((element) => {
        //       let BillDetailsInsertObj = {};
        //       BillDetailsInsertObj['BillNo'] = 0;
        //       BillDetailsInsertObj['ChargesId'] = element.PackageServiceId;
        //       Billdetsarr.push(BillDetailsInsertObj); 
        //     });
        //   } 
        //   this.SavePackageList = []; 
        // } 
        console.log(Billdetsarr)
      });

      let InsertAdddetArr = [];
      this.dataSource.data.forEach((element) => {

        let InsertAddChargesObj = {};
        InsertAddChargesObj['chargesId'] =0,// element.ServiceId,
          InsertAddChargesObj['ChargesDate'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
          InsertAddChargesObj['opdIpdType'] = 0,
          InsertAddChargesObj['opdIpdId'] = this.vOPIPId,
          InsertAddChargesObj['serviceId'] = element.ServiceId,
          InsertAddChargesObj['price'] = element.Price,
          InsertAddChargesObj['qty'] = element.Qty,
          InsertAddChargesObj['totalAmt'] = element.TotalAmt,
          InsertAddChargesObj['concessionPercentage'] = element.DiscPer || 0,
          InsertAddChargesObj['concessionAmount'] = element.DiscAmt || 0,
          InsertAddChargesObj['netAmount'] = element.NetAmount,
          InsertAddChargesObj['doctorId'] = element.DoctorId || 0,
          InsertAddChargesObj['docPercentage'] = 0,
          InsertAddChargesObj['docAmt'] = 0,
          InsertAddChargesObj['hospitalAmt'] = element.NetAmount,
          InsertAddChargesObj['isGenerated'] = false,
          InsertAddChargesObj['addedBy'] = 1,// this.accountService.currentUserValue.user.id,
          InsertAddChargesObj['isCancelled'] = false,
          InsertAddChargesObj['isCancelledBy'] = 0,
          InsertAddChargesObj['isCancelledDate'] = "01/01/1900",
          InsertAddChargesObj['isPathology'] = true,// Boolean(JSON.parse(String(element.IsPathology))),
          InsertAddChargesObj['isRadiology'] = false,// Boolean(JSON.parse(String(element.IsRadiology))),
          InsertAddChargesObj['isPackage'] = false,//element.IsPackage,
          InsertAddChargesObj['packageMainChargeID'] = 0,
          InsertAddChargesObj['isSelfOrCompanyService'] = false,
          InsertAddChargesObj['packageId'] = 0,
          InsertAddChargesObj['BillNo'] = 0,
          InsertAddChargesObj['chargesTime'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
          InsertAddChargesObj['classId'] = this.vClassId,
          InsertAdddetArr.push(InsertAddChargesObj);
      })


      // let InsertPackageDetails = [];
      // this.dsPackageDet.data.forEach((element) => {
      //   let InsertPackageDetObj = {};
      //   InsertPackageDetObj['packageMainChargeID'] = 0,
      //     InsertPackageDetObj['ChargesDate'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
      //     InsertPackageDetObj['opD_IPD_Type'] = 0,
      //     InsertPackageDetObj['opD_IPD_Id'] = this.vOPIPId,
      //     InsertPackageDetObj['serviceId'] = 1,// element.PackageServiceId,
      //     InsertPackageDetObj['price'] = element.Price,
      //     InsertPackageDetObj['qty'] = element.Qty,
      //     InsertPackageDetObj['totalAmt'] = element.TotalAmt,
      //     InsertPackageDetObj['concessionPercentage'] = element.DiscPer || 0,
      //     InsertPackageDetObj['concessionAmount'] = element.DiscAmt || 0,
      //     InsertPackageDetObj['netAmount'] = element.NetAmount,
      //     InsertPackageDetObj['doctorId'] = element.DoctorId || 0,
      //     InsertPackageDetObj['docPercentage'] = 0,
      //     InsertPackageDetObj['docAmt'] = 0,
      //     InsertPackageDetObj['hospitalAmt'] = element.NetAmount || 0,
      //     InsertPackageDetObj['isGenerated'] = 0,
      //     InsertPackageDetObj['addedBy'] = this.accountService.currentUserValue.user.id,
      //     InsertPackageDetObj['isCancelled'] = 0,
      //     InsertPackageDetObj['isCancelledBy'] = 0,
      //     InsertPackageDetObj['isCancelledDate'] = "01/01/1900",
      //     InsertPackageDetObj['isPathology'] = element.IsPathology,
      //     InsertPackageDetObj['isRadiology'] = element.IsRadiology,
      //     InsertPackageDetObj['isPackage'] = 1,
      //     InsertPackageDetObj['isSelfOrCompanyService'] = false,
      //     InsertPackageDetObj['packageId'] = element.ServiceId,
      //     InsertPackageDetObj['BillNo'] = 0,
      //     InsertPackageDetails.push(InsertPackageDetObj);
      // });



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
        const dialogRef = this._matDialog.open(OpPaymentNewComponent,
          {
            maxWidth: "90vw",
            height: '850px',
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
            this.Paymentdataobj=result.submitDataPay.ipPaymentInsert;

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
            console.log("Procced with Payment Option");
            let submitData = {
              // "chargesDetailInsert": InsertAdddetArr,
              // "insertBillupdatewithbillno": InsertBillUpdateBillNoObj,
              // "opBillDetailsInsert": Billdetsarr,
              // "opCalDiscAmountBill": opCalDiscAmountBill,
              // "opInsertPayment": result.submitDataPay.ipPaymentInsert,
              // "chargesPackageInsert": InsertPackageDetails
              BillNo: 0,
              opdipdid:76,// this.vOPIPId,
              TotalAmt: this.BillingForm.get('FinalTotalAmt').value || 0,
              ConcessionAmt: parseFloat(this.BillingForm.get('FinalconcessionAmt').value) || 0,
              NetPayableAmt: this.BillingForm.get('FinalNetAmt').value || 0,
              PaidAmt: this.paidamt,
              BalanceAmt: this.balanceamt,// this.BillingForm.get('FinalNetAmt').value,
              BillDate: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
              opdipdType: 0,
              AddedBy: 1,
              TotalAdvanceAmount: 0,
              BillTime: this.dateTimeObj.time,
              ConcessionReasonId: ConcessionId,
              IsSettled: true,
              IsPrinted: true,
              IsFree: true,
              CompanyId: 0,
              TariffId: this.vTariffId || 0,
              UnitId: 1,
              InterimOrFinal: 0,
              CompanyRefNo: 0,
              ConcessionAuthorizationName: 0,
              SpeTaxPer: 10,
              SpeTaxAmt: 10,
              CompDiscAmt: Math.round(this.BillingForm.get('FinalconcessionAmt').value) || 0,
              DiscComments: ConcessionReason,
              CashCounterId: this.searchFormGroup.get('CashCounterID').value.value || 0,


              "addCharges": InsertAdddetArr,
              // "insertBillupdatewithbillno": InsertBillUpdateBillNoObj,
              "billDetails": Billdetsarr
              // "opCalDiscAmountBill": opCalDiscAmountBill,
              //  "Payments": result.submitDataPay.ipPaymentInsert,
            }
            console.log(submitData);
            this._oPSearhlistService.InsertOPBilling(submitData).subscribe(response => {
              if (response) {
                this.toastr.success(' OP Bill payment! Record Saved Successfully.', 'Save !', {
                  toastClass: 'tostr-tost custom-toast-success',
                });
                let m = response;
                console.log(result.submitDataPay.ipPaymentInsert);
                //  this._oPSearhlistService.InsertOPBillingpayment(result.submitDataPay.ipPaymentInsert).subscribe(response => {
                //   //  this.viewgetBillReportPdf(response);
                //         //  this.getWhatsappshareSales(response, vmMobileNo)
                //    });
                this.onClose();
                this.savebtn = false;
              } else {
                this.toastr.success('OP Billing data not saved', 'error', {
                  toastClass: 'tostr-tost custom-toast-success',
                });
              }
              this.isLoading = '';
             
            });
          }

             //Payment save
        // console.log( this.Paymentdataobj)
       debugger
        let Paymentobj = {};
        Paymentobj=result.submitDataPay.ipPaymentInsert
        Paymentobj['BillNo'] = 0;
        Paymentobj['PaymentDate'] = this.datePipe.transform(result.submitDataPay.ipPaymentInsert.PaymentDate, 'yyyy-dd-MM') || '01/01/1900',
        Paymentobj['PaymentTime'] = this.datePipe.transform(result.submitDataPay.ipPaymentInsert.PaymentDate, 'yyyy-dd-MM') || '01/01/1900',
        Paymentobj['ChequeDate'] =  this.datePipe.transform(result.submitDataPay.ipPaymentInsert.ChequeDate, 'yyyy-dd-MM') || '01/01/1900',
        Paymentobj['CardPayAmount'] = 0;
        Paymentobj['CardDate'] = this.datePipe.transform(result.submitDataPay.ipPaymentInsert.CardDate, 'yyyy-dd-MM') || '01/01/1900',
        Paymentobj['IsCancelledDate'] = this.datePipe.transform(result.submitDataPay.ipPaymentInsert.IsCancelledDate, 'yyyy-dd-MM') || '01/01/1900',
        Paymentobj['NEFTDate'] = this.datePipe.transform(result.submitDataPay.ipPaymentInsert.NEFTDate, 'yyyy-dd-MM') || '01/01/1900',
        Paymentobj['PayTMDate'] = this.datePipe.transform(result.submitDataPay.ipPaymentInsert.PayTMDate, 'yyyy-dd-MM') || '01/01/1900',
          console.log(Paymentobj)
        this._oPSearhlistService.InsertOPBillingpayment(Paymentobj).subscribe(response => {
          //  this.viewgetBillReportPdf(response);
          //  this.getWhatsappshareSales(response, vmMobileNo)

        });
        });
     

      }
      else if (this.BillingForm.get('PaymentType').value == 'CreditPay') {
        this.saveCreditbill();
      }
      else {

        InsertBillUpdateBillNoObj['PaidAmt'] = this.BillingForm.get('FinalNetAmt').value || 0;

        let Paymentobj = {};
        Paymentobj['BillNo'] = 0;
        Paymentobj['PaymentDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          Paymentobj['PaymentTime'] = this.dateTimeObj.time || '01/01/1900',
          Paymentobj['CashPayAmount'] = parseFloat(this.BillingForm.get('FinalNetAmt').value) || 0;
        Paymentobj['ChequePayAmount'] = 0;
        Paymentobj['ChequeNo'] = "0";
        Paymentobj['BankName'] = "";
        Paymentobj['ChequeDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          Paymentobj['CardPayAmount'] = 0;
        Paymentobj['CardNo'] = "0";
        Paymentobj['CardBankName'] = "";
        Paymentobj['CardDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          Paymentobj['AdvanceUsedAmount'] = 0;
        Paymentobj['AdvanceId'] = 0;
        Paymentobj['RefundId'] = 0;
        Paymentobj['TransactionType'] = 0;
        Paymentobj['Remark'] = "Cashpayment";
        Paymentobj['AddBy'] = 1,//this.accountService.currentUserValue.user.id,
          Paymentobj['IsCancelled'] = false;
        Paymentobj['IsCancelledBy'] = 0;
        Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          // Paymentobj['CashCounterId'] = 0;
          Paymentobj['NEFTPayAmount'] = 0;
        Paymentobj['NEFTNo'] = "0";
        Paymentobj['NEFTBankMaster'] = "";
        Paymentobj['NEFTDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          Paymentobj['PayTMAmount'] = 0;
        Paymentobj['PayTMTranNo'] = "0";
        Paymentobj['PayTMDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          Paymentobj['tdsAmount'] = 0;

        // const ipPaymentInsert = new IpPaymentInsert(Paymentobj);
        // let submitDataPay = {
        //   ipPaymentInsert,
        // };
        let submitData = {
          BillNo: 0,
          OPDIPDID: this.vOPIPId,
          TotalAmt: this.BillingForm.get('FinalTotalAmt').value || 0,
          ConcessionAmt: parseFloat(this.BillingForm.get('FinalconcessionAmt').value) || 0,
          NetPayableAmt: this.BillingForm.get('FinalNetAmt').value || 0,
          PaidAmt: 0,
          BalanceAmt: this.BillingForm.get('FinalNetAmt').value,
          BillDate: this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
          OPDIPDType: 0,
          AddedBy: 110,
          TotalAdvanceAmount: 0,
          BillTime: this.dateTimeObj.time,
          ConcessionReasonId: ConcessionId,
          IsSettled: true,
          IsPrinted: true,
          IsFree: true,
          CompanyId: 0,
          TariffId: this.vTariffId || 0,
          UnitId: 1,
          InterimOrFinal: 0,
          CompanyRefNo: 0,
          ConcessionAuthorizationName: 0,
          SpeTaxPer: 10,
          SpeTaxAmt: 10,
          CompDiscAmt: Math.round(this.BillingForm.get('FinalconcessionAmt').value) || 0,
          DiscComments: ConcessionReason,
          CashCounterId: this.searchFormGroup.get('CashCounterID').value.CashCounterId || 0,

          "addCharges": InsertAdddetArr,
          // "insertBillupdatewithbillno": InsertBillUpdateBillNoObj,
          "billDetails": Billdetsarr,
          // "opCalDiscAmountBill": opCalDiscAmountBill,
          "Payments": Paymentobj,
          // "chargesPackageInsert": InsertPackageDetails
        };
        console.log(submitData);
        this._oPSearhlistService.InsertOPBilling(submitData).subscribe(response => {
          if (response) {
            this.toastr.success(' OP Bill with cash payment! Record Saved Successfully.', 'Save !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            let m = response;
            // this.viewgetBillReportPdf(response);
            // this.getWhatsappshareSales(response, this.vMobileNo)
            this.onClose();
            this.savebtn = false;
          } else {
            this.toastr.warning('OP Billing data not saved', 'error!', {
              toastClass: 'tostr-tost custom-toast-success',
            });
          }
          this.isLoading = '';
        });
      }
    }

    this.vOPIPId == ''
  }


  saveCreditbill() {
    this.savebtn = true;
    let disamt = this.BillingForm.get('FinalconcessionAmt').value;

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

    let ConcessionId = 0;
    // if (this.BillingForm.get('ConcessionId').value)
    //   ConcessionId = this.BillingForm.get('ConcessionId').value.ConcessionId;

    let ConcessionReason = '';
    // if (this.BillingForm.get('ConcessionId').value)
    //   ConcessionReason = this.BillingForm.get('ConcessionId').value.ConcessionReason;

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
    InsertBillUpdateBillNoObj['AddedBy'] = 1,//this.accountService.currentUserValue.user.id,
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
      InsertAddChargesObj['ChargesId'] = element.ServiceId,
        InsertAddChargesObj['ChargesDate'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
        InsertAddChargesObj['OpdIpdType'] = 0,
        InsertAddChargesObj['OpdIpdId'] = this.vOPIPId,
        InsertAddChargesObj['ServiceId'] = element.ServiceId,
        InsertAddChargesObj['Price'] = element.Price,
        InsertAddChargesObj['Qty'] = element.Qty,
        InsertAddChargesObj['TotalAmt'] = element.TotalAmt,
        InsertAddChargesObj['ConcessionPercentage'] = element.DiscPer || 0,
        InsertAddChargesObj['ConcessionAmount'] = element.DiscAmt || 0,
        InsertAddChargesObj['NetAmount'] = element.NetAmount,
        InsertAddChargesObj['DoctorId'] = element.DoctorId,
        InsertAddChargesObj['DocPercentage'] = 0,
        InsertAddChargesObj['DocAmt'] = 0,
        InsertAddChargesObj['HospitalAmt'] = element.NetAmount,
        InsertAddChargesObj['IsGenerated'] = false,
        InsertAddChargesObj['AddedBy'] = 1,// this.accountService.currentUserValue.user.id,
        InsertAddChargesObj['IsCancelled'] = false,
        InsertAddChargesObj['IsCancelledBy'] = 0,
        InsertAddChargesObj['IsCancelledDate'] = "01/01/1900",
        InsertAddChargesObj['isPathology'] = Boolean(JSON.parse(String(element.IsPathology))),
        InsertAddChargesObj['isRadiology'] = Boolean(JSON.parse(String(element.IsRadiology))),
        InsertAddChargesObj['IsPackage'] = false,
        InsertAddChargesObj['PackageMainChargeID'] = 0,
        InsertAddChargesObj['IsSelfOrCompanyService'] = false,
        InsertAddChargesObj['PackageId'] = 0,
        InsertAddChargesObj['BillNo'] = 0,
        InsertAddChargesObj['ChargesTime'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
        InsertAddChargesObj['ClassId'] = this.vClassId,

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

    let Paymentobj = {};


    Paymentobj['PaymentId'] = 0;
    Paymentobj['BillNo'] = 0;
    Paymentobj['PaymentDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      Paymentobj['PaymentTime'] = this.dateTimeObj.time || '01/01/1900',
      Paymentobj['CashPayAmount'] = 0,// parseFloat(this.BillingForm.get('FinalNetAmt').value) || 0;
      Paymentobj['ChequePayAmount'] = 0;
    Paymentobj['ChequeNo'] = "0";
    Paymentobj['BankName'] = "";
    Paymentobj['ChequeDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      Paymentobj['CardPayAmount'] = 0;
    Paymentobj['CardNo'] = "0";
    Paymentobj['CardBankName'] = "";
    Paymentobj['CardDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      Paymentobj['AdvanceUsedAmount'] = 0;
    Paymentobj['AdvanceId'] = 0;
    Paymentobj['RefundId'] = 0;
    Paymentobj['TransactionType'] = 0;
    Paymentobj['Remark'] = "Cashpayment";
    Paymentobj['AddBy'] = 1,//this.accountService.currentUserValue.user.id,
      Paymentobj['IsCancelled'] = false;
    Paymentobj['IsCancelledBy'] = 0;
    Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      // Paymentobj['CashCounterId'] = 0;
      Paymentobj['NEFTPayAmount'] = 0;
    Paymentobj['NEFTNo'] = "0";
    Paymentobj['NEFTBankMaster'] = "";
    Paymentobj['NEFTDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      Paymentobj['PayTMAmount'] = 0;
    Paymentobj['PayTMTranNo'] = "0";
    Paymentobj['PayTMDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      Paymentobj['tdsAmount'] = 0;

    InsertBillUpdateBillNoObj['BalanceAmt'] = this.BillingForm.get('FinalNetAmt').value;


    let submitData = {
      BillNo: 0,
      OPDIPDID: this.vOPIPId,
      TotalAmt: this.BillingForm.get('FinalTotalAmt').value || 0,
      ConcessionAmt: parseFloat(this.BillingForm.get('FinalconcessionAmt').value) || 0,
      NetPayableAmt: this.BillingForm.get('FinalNetAmt').value || 0,
      PaidAmt: 0,
      BalanceAmt: this.BillingForm.get('FinalNetAmt').value,
      BillDate: this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      OPDIPDType: 0,
      AddedBy: 110,
      TotalAdvanceAmount: 0,
      BillTime: this.dateTimeObj.time,
      ConcessionReasonId: ConcessionId,
      IsSettled: true,
      IsPrinted: true,
      IsFree: true,
      CompanyId: 0,
      TariffId: this.vTariffId || 0,
      UnitId: 1,
      InterimOrFinal: 0,
      CompanyRefNo: 0,
      ConcessionAuthorizationName: 0,
      SpeTaxPer: 10,
      SpeTaxAmt: 10,
      CompDiscAmt: Math.round(this.BillingForm.get('FinalconcessionAmt').value) || 0,
      DiscComments: ConcessionReason,
      CashCounterId: this.searchFormGroup.get('CashCounterID').value.CashCounterId || 0,


      "AddCharges": InsertAdddetArr,
      // "insertBillupdatewithbillno": InsertBillUpdateBillNoObj,
      "BillDetails": Billdetsarr,
      // "opCalDiscAmountBill": opCalDiscAmountBill,
      "Payments": Paymentobj,
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
    console.log(BillNo)
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
    this.dsPackageDet.data = [];
    this.chargeslist = [];
    this.PacakgeList = [];
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

  }
  addData() {
    this.add = true;
    this.addbutton.nativeElement.focus();
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
      this.price.nativeElement.focus();
    }
  }

  public onEnterorice(event): void {
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
        this.disper.nativeElement.focus();
      }
    }
  }
  public onEnterdoctor(event): void {
    if (event.which === 13) {
      this.disper.nativeElement.focus();
    }
  }
  public onEnterdiscper(event): void {
    if (event.which === 13) {
      this.discamt.nativeElement.focus();
    }
  }

  public onEnterdiscAmount(event): void {

    if (event.which === 13) {
      this.netamt.nativeElement.focus();
    }
  }

  public onEnternetAmount(event): void {

    if (event.which === 13) {
      this.add = true;
      this.addbutton.nativeElement.focus();
    }
  }
  EditedPackageService: any = [];
  OriginalPackageService: any = [];
  TotalPrice: any = 0;
  getPacakgeDetail(contact) {
    // let deleteservice;
    // deleteservice = this.dsPackageDet.data
    // this.dsPackageDet.data.forEach(element => {
    //   deleteservice = deleteservice.filter(item => item.ServiceId !== element.ServiceId)
    //   console.log(deleteservice)   
    //   this.dsPackageDet.data =  deleteservice

    //   this.OriginalPackageService = this.dataSource.data.filter(item => item.ServiceId !== element.ServiceId)
    //   this.EditedPackageService = this.dataSource.data.filter(item => item.ServiceId === element.ServiceId)
    //   console.log(this.OriginalPackageService)
    //   console.log(this.EditedPackageService)
    // });

    // const dialogRef = this._matDialog.open(OpPackageBillInfoComponent,
    //   {
    //     maxWidth: "100%",
    //     height: '75%',
    //     width: '70%' ,
    //     data: {
    //       Obj:contact
    //     }
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   
    //   console.log('The dialog was closed - Insert Action', result);
    //   if (result) {

    //     this.dsPackageDet.data = result
    //     console.log( this.dsPackageDet.data)   
    //     this.dsPackageDet.data.forEach(element => {
    //       this.PacakgeList = this.PacakgeList.filter(item => item.ServiceId !== element.ServiceId)
    //       console.log(this.PacakgeList)   
    //       if(element.BillwiseTotalAmt > 0){
    //         this.TotalPrice = element.BillwiseTotalAmt;  
    //         console.log(this.TotalPrice) 
    //       }else{
    //         this.TotalPrice = parseInt(this.TotalPrice) + parseInt(element.Price);  
    //         console.log(this.TotalPrice) 
    //       }

    //       this.OriginalPackageService = this.dataSource.data.filter(item => item.ServiceId !== element.ServiceId)
    //       this.EditedPackageService = this.dataSource.data.filter(item => item.ServiceId === element.ServiceId)
    //       console.log(this.OriginalPackageService)
    //       console.log(this.EditedPackageService)
    //     });

    //     this.dsPackageDet.data.forEach(element => {
    //       this.PacakgeList.push(
    //         {
    //           ServiceId: element.ServiceId,
    //           ServiceName: element.ServiceName,
    //           Price: element.Price || 0,
    //           Qty: element.Qty || 1,
    //           TotalAmt: element.TotalAmt || 0,
    //           ConcessionPercentage: element.DiscPer || 0,
    //           DiscAmt: element.DiscAmt || 0,
    //           NetAmount: element.NetAmount || 0,
    //           IsPathology: element.IsPathology || 0,
    //           IsRadiology: element.IsRadiology || 0,
    //           PackageId: element.PackageId || 0,
    //           PackageServiceId: element.PackageServiceId || 0, 
    //           PacakgeServiceName:element.PacakgeServiceName || '',
    //         });
    //       this.dsPackageDet.data = this.PacakgeList;
    //     });

    //       if(this.EditedPackageService.length){
    //         this.EditedPackageService.forEach(element => {
    //           this.OriginalPackageService.push(
    //             {  
    //               ChargesId: 0,// this.serviceId,
    //               ServiceId:  element.ServiceId,
    //               ServiceName: element.ServiceName,
    //               Price: this.TotalPrice || 0,
    //               Qty:  element.Qty || 0,
    //               TotalAmt: (parseFloat(element.Qty) *  parseFloat(this.TotalPrice)) || 0,
    //               DiscPer: element.DiscPer || 0, 
    //               DiscAmt: element.DiscAmt || 0,
    //               NetAmount: (parseFloat(element.Qty) *  parseFloat(this.TotalPrice))  || 0,
    //               ClassId: 1, 
    //               DoctorId: element.DoctornewId, 
    //               DoctorName: element.DoctorName,
    //               ChargesDate: this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
    //               IsPathology: element.IsPathology,
    //               IsRadiology: element.IsRadiology,
    //               IsPackage: element.IsPackage,
    //               ClassName: element.ClassName, 
    //               ChargesAddedName: this.accountService.currentUserValue.user.id || 1,
    //             });

    //           this.dataSource.data = this.OriginalPackageService;
    //          this.chargeslist = this.dataSource.data 
    //         });
    //       } 

    //       this.TotalPrice = 0;
    //   }
    // })
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
  getValidationMessages() {
    return {
      CashCounterID: [
        { name: "required", Message: "First Name is required" },

        { name: "pattern", Message: "only Number allowed." }
      ],
      price: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      qty: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      ChargeTotalAmount: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      DoctorId: [
        { name: "pattern", Message: "only Char allowed." }
      ],
      ChargeDiscPer: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      ChargeDiscAmount: [{ name: "pattern", Message: "only Number allowed." }],
      netAmount: [{ name: "pattern", Message: "only Number allowed." }],
      SrvcName: [{ name: "required", Message: "Service Name is required", }],
      ConcessionId: [{}]

    }
  }
  selectChangedeptdoc(event) { }

  selectChangeConcession(event) { }
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

