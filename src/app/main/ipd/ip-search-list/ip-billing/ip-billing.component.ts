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


@Component({
  selector: 'app-ip-billing',
  templateUrl: './ip-billing.component.html',
  styleUrls: ['./ip-billing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPBillingComponent implements OnInit {

  // @Input() Id: any; 
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
  displayedColumns = [
    'checkbox',
    'IsCheck',
    'ChargesDate',
    'ServiceName',
    'Price',
    'Qty',
    'TotalAmt',
    'DiscPer',
    'DiscAmt',
    'NetAmount',
    // 'ChargeDoctorName',
    'DoctorName',
    //'ClassId',
    'ClassName',
    'ChargesAddedName',
    'buttons',
    // 'actions'
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

  dataSource = new MatTableDataSource<ChargesList>();
  dataSource1 = new MatTableDataSource<ChargesList>();
  prevbilldatasource = new MatTableDataSource<Bill>();
  advancedatasource = new MatTableDataSource<IpdAdvanceBrowseModel>();
  PackageDatasource = new MatTableDataSource

  myControl = new FormControl();
  // filteredOptions: Observable<any[]>;
  filteredOptions: any;
  billingServiceList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  private lookups: ILookup[] = [];
  private nextPage$ = new Subject();
  ConcessionReasonList: any = [];
  CashCounterList: any = [];


  disamt: any;
  b_price = '0';
  b_qty = '1';
  b_totalAmount = '0';
  b_netAmount = '0';
  FinalAmountpay = 0;
  b_disAmount: any;
  b_DoctorName = '';
  b_traiffId = '';
  b_isPath = '';
  b_isRad = '';
  b_IsEditable = '';
  b_IsDocEditable = '';
  dateTimeObj: any;

  // ConAmt: any;
  DoctornewId: any;
  concessionAmtOfNetAmt: any = 0;
  netPaybleAmt: any = 0;
  // finalAmt: any;
  isExpanded: boolean = false;
  SrvcName: any;
  totalAmtOfNetAmt: any = 0;
  interimArray: any = [];
  formDiscPersc: any;
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
  vfDiscountAmount: any = 0;
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


  filteredOptionssearchDoctor: Observable<string[]>;
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
    public toastr: ToastrService,
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

    }

    this.myControl = new FormControl();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      debounceTime(100),
      startWith(''),
      map((value) => (value && value.length >= 1 ? this.filterStates(value) : this.billingServiceList.slice()))
    );

    this.getBillingClasslist();
    this.getServiceListCombobox();
    this.getDoctorList();
    this.getChargesList();
    this.getRequestChargelist();
    this.getBillingClassCombo();
    this.getCashCounterComboList();
    this.getConcessionReasonList();
    this.getPrevBillList();
    this.getAdvanceDetList();
    this.calBalanceAmt();


    this.filteredOptionsBillingClassName = this.Serviceform.get('ChargeClass').valueChanges.pipe(
      startWith(''),
      map(value => this._filterclass(value)),

    );

    // this.filteredDoctor = this.Serviceform.get('DoctorID').valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterDoctor(value)),

    // );


    if (this.selectedAdvanceObj.IsDischarged) {
      this.Ipbillform.get('GenerateBill').enable();
      this.Ipbillform.get('GenerateBill').setValue(true);
    }
    else {
      this.Ipbillform.get('GenerateBill').disable();
      this.Ipbillform.get('GenerateBill').setValue(false);
    }
    // console.log(this.vfDiscountAmount )
    // if (this.vDiscountAmount > 0) {
    //   this.admin = false;

    // }
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
      discPer: ['', [
        Validators.minLength(2),
        Validators.maxLength(2)]],
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
      Percentage: [Validators.pattern("^[0-9]*$")],
      concessionAmt: [0],
      ConcessionId: 0,
      Remark: [''],
      GenerateBill: [1],
      FinalAmount: 0,
      CashCounterId: [''],
      IpCash: [''],
      Pharcash: [''],
      ChargeClass: [''],
      AdminPer: [''],
      AdminAmt: [''],
      Admincheck:['']
    });
  }


  //  ===================================================================================
  filterStates(name: string) {
    let tempArr = [];

    this.billingServiceList.forEach((element) => {
      if (element.ServiceName.toString().toLowerCase().search(name) !== -1) {
        tempArr.push(element);
      }
    });
    return tempArr;
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onOptionSelected(selectedItem) {
    this.b_price = selectedItem.Price
    this.b_totalAmount = selectedItem.Price
    this.b_disAmount = 0;
    this.b_netAmount = selectedItem.Price
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
      this.CalFinalDisc();
    }
  }
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

  // getDoctorList() {
  //   this._IpSearchListService.getAdmittedDoctorCombo().subscribe(data => {
  //     this.Doctor1List = data;
  //     console.log(this.Doctor1List)
  //     this.optionsRefDoc = this.Doctor1List.slice();
  //     this.filteredOptionsRefDoc = this.Serviceform.get('DoctorID').valueChanges.pipe(
  //       startWith(''),
  //       map(value => value ? this._filterRefdoc(value) : this.Doctor1List.slice()),
  //     );
  //   });
  // }
  searchDoctorList: any = [];
  getDoctorList() {
    this._IpSearchListService.getAdmittedDoctorCombo().subscribe(data => {
      this.searchDoctorList = data;
      this.optionsSearchDoc = this.searchDoctorList.slice();
      this.filteredOptionssearchDoctor = this.Serviceform.get('DoctorID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSearchdoc(value) : this.searchDoctorList.slice()),
      );
    });
  }

  private _filterSearchdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsSearchDoc.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }


ServiceList:any=[];
  getServiceListCombobox() {
    let tempObj;
    var m_data = {
      SrvcName: `${this.Serviceform.get('SrvcName').value}%`,
      TariffId: this.selectedAdvanceObj.TariffId,
      ClassId: this.selectedAdvanceObj.ClassId
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
  filteredOptionsBillingClassName: any;
  filteredDoctor: any;
  noOptionFoundsupplier: any;
  vClassId: any = 0;
  vClassName: any;


  getBillingClasslist() {
    
    var m_data = {
      'ClassName': '%' //`${this.vClassName}%`
    }
    this._IpSearchListService.getseletclassMasterCombo(m_data).subscribe(data => {
      this.ClassList = data;
      //console.log(this.ClassList)
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

  private _filterDoctor(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.doctorNameCmbList.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }

  getOptionTextclass(option) {
    return option && option.ClassName ? option.ClassName : '';
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

  // getOptionDoctor(option) {
  //   if (!option)
  //     return '';
  //   return option && option.DoctorName ? option.DoctorName : '';
  // }
  getOptionTextsearchDoctor(option) {
    return option && option.DoctorName ? option.DoctorName : '';
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


  getSelectedObj(obj) {
    
    console.log(obj)
    this.SrvcName = obj.ServiceName;
    this.b_price = obj.Price;
    this.b_totalAmount = obj.Price;
    this.b_netAmount = obj.Price;
    this.serviceId = obj.ServiceId;
    this.b_isPath = obj.IsPathology;
    this.b_isRad = obj.IsRadiology;


    if (obj.IsDocEditable) {
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

  getRequestChargelist() {
    this.chargeslist1 = [];
    this.dataSource1.data = [];
    var m = {
      OP_IP_ID: this.selectedAdvanceObj.AdmissionID,
    }
    this._IpSearchListService.getchargesList1(m).subscribe(data => {
      this.chargeslist1 = data as ChargesList[];
      this.dataSource1.data = this.chargeslist1;
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
      this.dataSource.data = this.chargeslist;

      this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
    },
      (error) => {
        this.isLoading = 'list-loaded';
      });

    this.chkdiscstatus();

  }

  getPrevBillList() {
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

  AddList(m) {
    var m_data = {
      "chargeID": 0,
      "chargesDate": this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
      "opD_IPD_Type": 1,
      "opD_IPD_Id": this.selectedAdvanceObj.AdmissionID,
      "serviceId": m.ServiceId,
      "price": m.price,// this.b_price,
      "qty": m.qty || 1,// this.b_qty,
      "totalAmt": 0,// this.b_totalAmount,
      "concessionPercentage": 0,// this.formDiscPersc || 0,
      "concessionAmount": 0,// this.b_disAmount || 0,
      "netAmount": 0,// this.b_netAmount,
      "doctorId": 0,// this.DoctornewId,// this.Ipbillform.get("doctorId").value || 0,
      "docPercentage": 0,
      "docAmt": 0,
      "hospitalAmt": 0,//this.b_netAmount,
      "isGenerated": 0,
      "addedBy": this.accountService.currentUserValue.user.id,
      "isCancelled": 0,
      "isCancelledBy": 0,
      "isCancelledDate": "01/01/1900",
      "isPathology": 0,//this.b_isPath,
      "isRadiology": 1,//this.b_isRad,
      "isPackage": 0,
      "packageMainChargeID": 0,
      "isSelfOrCompanyService": false,
      "packageId": 0,
      "chargeTime": this.datePipe.transform(this.currentDate, "MM-dd-yyyy HH:mm:ss"),
      "classId": this.Serviceform.get("ClassId").value.ClassId
    }
    this._IpSearchListService.InsertIPAddChargesNew(m_data).subscribe(data => {
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
  getCashCounterComboList() {
    // this._IpSearchListService.getCashcounterList().subscribe(data => {
    //   this.CashCounterList = data
    // });
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
 
  getDiscountSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, { ConcessionAmount }) => sum += +(ConcessionAmount || 0), 0);
    this.vDiscountAmount = netAmt;
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
    netAmt = element.reduce((sum, { AdvanceAmount }) => sum += +(AdvanceAmount || 0), 0);
    this.vAdvTotalAmount = netAmt;
    // this.vNetBillAmount = this.vTotalBillAmount;

    // console.log(this.vAdvTotalAmount )
    if (this.vNetBillAmount > this.vAdvTotalAmount) {
      this.vBalanceAmt = 0;
      this.vpaidBalanceAmt = parseInt(this.vNetBillAmount) - parseInt(this.vAdvTotalAmount)

    }
    return netAmt;
  }

  getNetAmount() {
    if (this.vDiscountAmount > 0) {
      this.FinalAmountpay = parseInt(this.vTotalBillAmount) - parseInt(this.vDiscountAmount);
      this.Ipbillform.get('FinalAmount').setValue(this.FinalAmountpay);
      this.Ipbillform.get('ConcessionId').setValue(this.ConcessionReasonList[1]);

      this.Ipbillform.get('ConcessionId').reset();
      this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
      this.Ipbillform.get('ConcessionId').enable;
      this.Consession = false;
      this.ConShow = true;
    }
    if (this.vDiscountAmount <= 0) {
      this.Ipbillform.get('ConcessionId').reset();
      this.Ipbillform.get('ConcessionId').clearValidators();
      this.Ipbillform.get('ConcessionId').updateValueAndValidity();
      this.Consession = true;
      this.FinalAmountpay = this.vTotalBillAmount;
      this.vNetBillAmount = parseInt(this.vTotalBillAmount) - parseInt(this.Adminamt);
      this.ConShow = false;
    }
    console.log(this.ConShow)
  }

  ServiceDiscDisable: boolean = false;
  // Adminchange($event) {

  //   if ($event)
  //     this.ServiceDiscDisable = true;
  //   if (!$event)
  //     this.ServiceDiscDisable = false;
  // }

  vGenbillflag: boolean = false


  generateBillchk($event) {
    if ($event)
      this.vGenbillflag = true;
    if (!$event)
      this.vGenbillflag = false;
  }

  CalculateAdminCharge(){
    if(this.vAdminPer > 0 && this.vAdminPer < 100 ){
     this.vAdminAmt = Math.round((parseFloat(this.vTotalAmount) * parseFloat(this.vAdminPer))/ 100).toFixed(2);
     let netamt = (parseFloat(this.vTotalAmount) + parseFloat(this.vAdminAmt)).toFixed(2);
     if(this.vDiscountAmount > 0){
      let netamt = (parseFloat(this.vTotalAmount) + parseFloat(this.vAdminAmt)).toFixed(2);
      let finalnetamt =(parseFloat(netamt) - parseFloat(this.vDiscountAmount)).toFixed(2);
      this.Ipbillform.get('FinalAmount').setValue(finalnetamt);
     }else{
      let finalnetamt;
      let Percentage = this.Ipbillform.get('Percentage').value || 0;
      finalnetamt = netamt
      this.vfDiscountAmount = Math.round((finalnetamt * parseInt(Percentage)) / 100).toFixed(2);
      this.vNetBillAmount = Math.round(finalnetamt - this.vfDiscountAmount).toFixed(2);
      this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount );
      this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
     }
    }else{
      if(this.vAdminPer < 0 && this.vAdminPer > 100 ){
      this.toastr.warning('Please Enter Admin % less than 100 and Greater than 0.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.Ipbillform.get('AdminPer').reset();
      this.Ipbillform.get('AdminAmt').reset();
      this.Ipbillform.get('FinalAmount').setValue(this.vTotalBillAmount);
      this.CalFinalDisc();
    }
    }
  }
  CalFinalDisc() {
//debugger
    if (this.Ipbillform.get('AdminAmt').value > 0) {
      let Percentage = this.Ipbillform.get('Percentage').value;
      let finalnetAmt = ((parseFloat(this.vNetBillAmount) + parseFloat(this.vAdminAmt)))

      if (this.Ipbillform.get('Percentage').value > 0 && Percentage < 100) {
        this.vfDiscountAmount = Math.round((finalnetAmt * parseInt(Percentage)) / 100).toFixed(2);
        this.vNetBillAmount = Math.round(finalnetAmt - this.vfDiscountAmount).toFixed(2);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
        this.ConShow = true
        this.Ipbillform.get('ConcessionId').reset();
        this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
        this.Ipbillform.get('ConcessionId').enable;
      }
      else if (Percentage > 100 || Percentage < 0) {
        this.vNetBillAmount = finalnetAmt;
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.vfDiscountAmount = 0;
        this.finaldisc.nativeElement.focus();
        this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
        this.toastr.warning('Please Enter Discount % less than 100 and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      else if ((Percentage == 0 || Percentage == null || Percentage == ' ') && this.vDiscountAmount == 0) {
        this.Ipbillform.get('ConcessionId').reset();
        this.Ipbillform.get('ConcessionId').clearValidators();
        this.Ipbillform.get('ConcessionId').updateValueAndValidity();
        this.vfDiscountAmount = 0;
        this.vNetBillAmount = finalnetAmt;
        this.Ipbillform.get('FinalAmount').setValue(this.vTotalBillAmount);
        this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
        this.ConShow = false
      }
      if (this.vDiscountAmount > 0) {
        this.Ipbillform.get('ConcessionId').reset();
        this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
        this.Ipbillform.get('ConcessionId').enable;
        this.Ipbillform.get('ConcessionId').updateValueAndValidity();
        this.Consession = true;
        this.ConShow = true;
      }
    } else {
      let Percentage = this.Ipbillform.get('Percentage').value;
      if (this.Ipbillform.get('Percentage').value > 0 && Percentage < 100) {
        this.vfDiscountAmount = Math.round((this.vNetBillAmount * parseInt(Percentage)) / 100).toFixed(2);
        this.vNetBillAmount = Math.round(this.vTotalBillAmount - this.vfDiscountAmount).toFixed(2);
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
        this.ConShow = true
        this.Ipbillform.get('ConcessionId').reset();
        this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
        this.Ipbillform.get('ConcessionId').enable;
      }
      else if (Percentage > 100 || Percentage < 0) {

        this.vNetBillAmount = this.vTotalBillAmount;
        this.Ipbillform.get('FinalAmount').setValue(this.vNetBillAmount);
        this.vfDiscountAmount = 0;
        this.finaldisc.nativeElement.focus();
        this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
        this.toastr.warning('Please Enter Discount % less than 100 and Greater than 0.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      else if ((Percentage == 0 || Percentage == null || Percentage == ' ') && this.vDiscountAmount == 0) {
        this.Ipbillform.get('ConcessionId').reset();
        this.Ipbillform.get('ConcessionId').clearValidators();
        this.Ipbillform.get('ConcessionId').updateValueAndValidity();
        this.vfDiscountAmount = 0;
        this.vNetBillAmount = this.vTotalBillAmount;
        this.Ipbillform.get('FinalAmount').setValue(this.vTotalBillAmount);
        this.Ipbillform.get('concessionAmt').setValue(this.vfDiscountAmount);
        this.ConShow = false
      }
      if (this.vDiscountAmount > 0) {
        this.Ipbillform.get('ConcessionId').reset();
        this.Ipbillform.get('ConcessionId').setValidators([Validators.required]);
        this.Ipbillform.get('ConcessionId').enable;
        this.Ipbillform.get('ConcessionId').updateValueAndValidity();
        this.Consession = true;
        this.ConShow = true;
      }
    }
  }

  tableElementChecked(event, element) {
    if (event.checked) {
      this.interimArray.push(element);
    } else if (this.interimArray.length > 0) {
      let index = this.interimArray.indexOf(element);
      if (index !== -1) {
        this.interimArray.splice(index, 1);
      }
    }
  }

  getInterimData() {
    if (this.interimArray.length > 0) {
      let xx = {
        AdmissionID: this.selectedAdvanceObj.AdmissionID,
        BillNo: 0,
        BillDate: this.dateTimeObj.date,
        concessionReasonId: this.Ipbillform.get('ConcessionId').value || 0,
        tariffId: this.selectedAdvanceObj.TariffId,
        RemarkofBill: this.Ipbillform.get('Remark').value || '',
        RegNo: this.selectedAdvanceObj.RegNo || 0,
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
        UnitId: this.selectedAdvanceObj.UnitId
      };
      // console.log(xx)
      this.advanceDataStored.storage = new Bill(xx);
      console.log('this.interimArray==', this.interimArray);
      this._matDialog.open(InterimBillComponent,
        {
          maxWidth: "85vw",
          //maxHeight: "65vh",
          width: '100%',
          height: "500px",
          data: this.interimArray
        });
        this.onClose();
    }else{
      Swal.fire('Warring !', 'Please select check box ', 'warning');
    }

  }
  // }
  onOk() {
    // this.dialogRef.close({ result: "ok" });
  }
  onClose() {
    this.dialogRef.close({ result: "cancel" });
  }

  SaveBill() {


    let InterimOrFinal = 1;
    if (this.dataSource.data.length > 0 && (this.vNetBillAmount > 0)) {
      this.isLoading = 'submit';
      let PatientHeaderObj = {};
      PatientHeaderObj['Date'] = this.dateTimeObj.date;
      PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
      PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      // PatientHeaderObj['AdvanceAmount'] = 0;
      PatientHeaderObj['AdvanceAmount'] = this.Ipbillform.get('FinalAmount').value;
      PatientHeaderObj['NetPayAmount'] = this.Ipbillform.get('FinalAmount').value;
      PatientHeaderObj['Date'] = this.dateTimeObj.date;
      PatientHeaderObj['PBillNo'] = 0;
      PatientHeaderObj['BillTime'] = this.dateTimeObj.date;
      PatientHeaderObj['RegID'] = this.selectedAdvanceObj.RegID,



        console.log('============================== Save IP Billing ===========');
      //==============-======--==============Payment======================
      // IPAdvancePaymentComponent
      this.advanceDataStored.storage = new AdvanceDetailObj(PatientHeaderObj);
      const dialogRef = this._matDialog.open(IPpaymentWithadvanceComponent,
        {
          maxWidth: "85vw",
          height: '840px',
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
        
        // this.paidamt = result.PaidAmt;
        this.flagSubmit = result.IsSubmitFlag

        if (this.flagSubmit) {
          this.paidamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
          this.balanceamt = result.submitDataPay.ipPaymentInsert.BalanceAmt;
        }

        else {

          this.balanceamt = result.BalAmt;
        }

        // this.flagSubmit = result.IsSubmitFlag
        //
        let InsertBillUpdateBillNoObj = {};
        InsertBillUpdateBillNoObj['BillNo'] = 0;
        // InsertBillUpdateBillNoObj['AdmissionID'] = this.selectedAdvanceObj.AdmissionID,
        InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,
          InsertBillUpdateBillNoObj['TotalAmt'] = this.vBillTotalAmt || 0;

        InsertBillUpdateBillNoObj['ConcessionAmt'] = this.Ipbillform.get('concessionAmt').value || 0;
        InsertBillUpdateBillNoObj['NetPayableAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
        InsertBillUpdateBillNoObj['PaidAmt'] = this.paidamt,
          InsertBillUpdateBillNoObj['BalanceAmt'] = this.balanceamt,// this.netPaybleAmt;
          InsertBillUpdateBillNoObj['BillDate'] = this.dateTimeObj.date;
        InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 1;
        InsertBillUpdateBillNoObj['AddedBy'] = this.accountService.currentUserValue.user.id,
          InsertBillUpdateBillNoObj['TotalAdvanceAmount'] = 0;//this.totalAdvanceAmt;
        InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.date;
        InsertBillUpdateBillNoObj['ConcessionReasonId'] = this.ConcessionId;
        InsertBillUpdateBillNoObj['IsSettled'] = 0;
        InsertBillUpdateBillNoObj['IsPrinted'] = 1;
        InsertBillUpdateBillNoObj['IsFree'] = 0;
        InsertBillUpdateBillNoObj['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
          InsertBillUpdateBillNoObj['TariffId'] = this.selectedAdvanceObj.TariffId || 0,
          InsertBillUpdateBillNoObj['UnitId'] = this.selectedAdvanceObj.UnitId || 0;
        InsertBillUpdateBillNoObj['InterimOrFinal'] = 0;
        InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
        InsertBillUpdateBillNoObj['ConcessionAuthorizationName'] = 0;
        InsertBillUpdateBillNoObj['TaxPer'] = 0//this.Ipbillform.get('Percentage').value || 0,
        InsertBillUpdateBillNoObj['TaxAmount'] = 0//this.Ipbillform.get('Amount').value || 0,
        InsertBillUpdateBillNoObj['DiscComments'] = this.Ipbillform.get('Remark').value || '';
        InsertBillUpdateBillNoObj['CompDiscAmt'] = 0//this.InterimFormGroup.get('Remark').value || '';
        // InsertBillUpdateBillNoObj['CashCounterId'] = 2;//this.Ipbillform.get('CashCounterId').value.CashCounterId || 0;
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

        const InsertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);
        const Cal_DiscAmount_IPBill = new Cal_DiscAmount(Cal_DiscAmount_IPBillObj);
        const AdmissionIPBillingUpdate = new AdmissionIPBilling(AdmissionIPBillingUpdateObj);
        //
        
        let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];
        UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;
        // console.log(UpdateAdvanceDetailarr1);

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
          UpdateAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceNo'],
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
            "InsertBillUpdateBillNo": InsertBillUpdateBillNo,
            "BillDetailsInsert": Billdetsarr,
            "Cal_DiscAmount_IPBill": Cal_DiscAmount_IPBill,
            "AdmissionIPBillingUpdate": AdmissionIPBillingUpdate,
            "ipInsertPayment": result.submitDataPay.ipPaymentInsert,
            "ipBillBalAmount": UpdateBillBalAmtObj,
            "ipAdvanceDetailUpdate": UpdateAdvanceDetailarr,
            "ipAdvanceHeaderUpdate": UpdateAdvanceHeaderObj

          };
          console.log(submitData)
          this._IpSearchListService.InsertIPBilling(submitData).subscribe(response => {
            if (response) {

              Swal.fire('Bill successfully !', 'IP final bill generated successfully !', 'success').then((result) => {
                if (result.isConfirmed) {

                  this._matDialog.closeAll();
                  this.viewgetBillReportPdf(response);
                  // this.getPrint(response);
                }
              });
            } else {
              Swal.fire('Error !', 'IP Final Billing data not saved', 'error');
            }
            this.isLoading = '';
          });
        }
        else {
          
          console.log(result)
          this.balanceamt = result.BalAmt;
          // if (this.concessionAmtOfNetAmt > 0) {
          //   this.balanceamt = this.totalAmtOfNetAmt - this.concessionAmtOfNetAmt;
          //   this.ConcessionId = this.Ipbillform.get('ConcessionId').value.ConcessionId;

          // } else {
          //   // this.balanceamt = this.totalAmtOfNetAmt;
          //   this.ConcessionId = 0;
          // }

          let InsertBillUpdateBillNoObj = {};
          InsertBillUpdateBillNoObj['BillNo'] = 0;
          // InsertBillUpdateBillNoObj['AdmissionID'] = this.selectedAdvanceObj.AdmissionID,
          InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID,
            InsertBillUpdateBillNoObj['TotalAmt'] = this.vBillTotalAmt || 0;
          InsertBillUpdateBillNoObj['ConcessionAmt'] = this.Ipbillform.get('concessionAmt').value || 0;
          InsertBillUpdateBillNoObj['NetPayableAmt'] = this.Ipbillform.get('FinalAmount').value || 0;
          InsertBillUpdateBillNoObj['PaidAmt'] = this.paidAmt;
          InsertBillUpdateBillNoObj['BalanceAmt'] = this.balanceamt,
            InsertBillUpdateBillNoObj['BillDate'] = this.dateTimeObj.date;
          InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 1;
          InsertBillUpdateBillNoObj['AddedBy'] = this.accountService.currentUserValue.user.id,
            InsertBillUpdateBillNoObj['TotalAdvanceAmount'] = 0;
          InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.date;
          InsertBillUpdateBillNoObj['ConcessionReasonId'] = this.ConcessionId;
          InsertBillUpdateBillNoObj['IsSettled'] = 0;
          InsertBillUpdateBillNoObj['IsPrinted'] = 1;
          InsertBillUpdateBillNoObj['IsFree'] = 0;
          InsertBillUpdateBillNoObj['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
            InsertBillUpdateBillNoObj['TariffId'] = this.selectedAdvanceObj.TariffId || 0,
            InsertBillUpdateBillNoObj['UnitId'] = this.selectedAdvanceObj.UnitId || 0;
          InsertBillUpdateBillNoObj['InterimOrFinal'] = InterimOrFinal;
          InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
          InsertBillUpdateBillNoObj['ConcessionAuthorizationName'] = '';
          InsertBillUpdateBillNoObj['TaxPer'] = 0;
          InsertBillUpdateBillNoObj['TaxAmount'] = 0;
          InsertBillUpdateBillNoObj['DiscComments'] = this.Ipbillform.get('Remark').value || '';
          // InsertBillUpdateBillNoObj['CashCounterId'] = 2;//this.Ipbillform.get('CashCounterId').value.CashCounterId;
          InsertBillUpdateBillNoObj['CompDiscAmt'] = 0//this.InterimFormGroup.get('Remark').value || '';
          // InsertBillUpdateBillNoObj['BalanceAmt'] = this.balanceamt;
          const InsertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);

          let UpdateBillBalAmtObj = {};
          UpdateBillBalAmtObj['BillNo'] = 0;
          UpdateBillBalAmtObj['BillBalAmount'] = this.balanceamt;


          let submitData = {
            "insertBillcreditUpdateBillNo": InsertBillUpdateBillNo,
            "billDetailscreditInsert": Billdetsarr,
            "cal_DiscAmount_IPBillcredit": Cal_DiscAmount_IPBill,
            "admissionIPBillingcreditUpdate": AdmissionIPBillingUpdate,
            "ipBillBalAmountcredit": UpdateBillBalAmtObj,
            "ipAdvanceDetailUpdatecedit": UpdateAdvanceDetailarr,
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
      });


    }
  }

  onSaveDraft() {
    debugger
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
      InsertDraftBillOb['ConcessionReasonId'] = this.ConcessionId,
        InsertDraftBillOb['IsSettled'] = 0;
      InsertDraftBillOb['IsPrinted'] = 0;
      InsertDraftBillOb['IsFree'] = 0;
      InsertDraftBillOb['CompanyId'] = this.selectedAdvanceObj.CompanyId || 0,
        InsertDraftBillOb['TariffId'] = 3,//this.selectedAdvanceObj.TariffId || 0,
        InsertDraftBillOb['UnitId'] = this.selectedAdvanceObj.UnitId || 0,
        InsertDraftBillOb['InterimOrFinal'] = 0;
      InsertDraftBillOb['CompanyRefNo'] = 0;
      InsertDraftBillOb['ConcessionAuthorizationName'] = '';
      InsertDraftBillOb['TaxPer'] = 0;
      InsertDraftBillOb['TaxAmount'] = 0;

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
              this._matDialog.closeAll();
              this.viewgetDraftBillReportPdf(this.selectedAdvanceObj.AdmissionID);

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

  }
  vselect:any;
  vService:any;
  vAdminPer:any;
  vAdminAmt:any;
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
    if (( this.b_price== '' || this.b_price == null || this.b_price == undefined || this.b_price == '0')) {
      this.toastr.warning('Please enter price', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (( this.b_qty== '' || this.b_qty == null || this.b_qty == undefined || this.b_qty == '0')) {
      this.toastr.warning('Please enter qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (( this.b_totalAmount== '' || this.b_totalAmount == null || this.b_totalAmount == undefined || this.b_totalAmount == '0')) {
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
    if ((this.SrvcName && (parseInt(this.b_price) > 0 || this.b_price == '0') && this.b_qty) && (parseFloat(this.b_netAmount) > 0)) {

      var m_data = {
        "chargeID": 0,
        "chargesDate": this.datePipe.transform(this.Serviceform.get('Date').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        "opD_IPD_Type": 1,
        "opD_IPD_Id": this.selectedAdvanceObj.AdmissionID,
        "serviceId": this.serviceId,
        "price": this.b_price,
        "qty": this.b_qty,
        "totalAmt": this.b_totalAmount,
        "concessionPercentage": this.formDiscPersc || 0,
        "concessionAmount": this.b_disAmount,
        "netAmount": this.b_netAmount,
        "doctorId": doctorid,
        "doctorName": doctorName,
        "docPercentage": 0,
        "docAmt": 0,
        "hospitalAmt": this.FAmount,// this.b_netAmount,
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
      this.b_disAmount = 0;
    }
    else {
      Swal.fire("Enter Proper Values !")
    }
    this.itemid.nativeElement.focus();
    this.add = false;
    if (this.formDiscPersc > 0) {
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

  calculateTotalAmt() {
    if (this.b_price && this.b_qty) {
      this.b_totalAmount = Math.round(parseInt(this.b_price) * parseInt(this.b_qty)).toString();
      this.b_netAmount = this.b_totalAmount;
      this.calculatePersc();
    }

  }

  calculatePersc() {

    this.b_disAmount = 0;
    this.formDiscPersc = this.Serviceform.get('discPer').value;
    let netAmt = parseInt(this.b_price) * parseInt(this.b_qty);
    if (this.formDiscPersc > 0 || this.formDiscPersc < 101) {
      let discAmt = Math.round((netAmt * parseInt(this.formDiscPersc)) / 100);
      this.b_disAmount = discAmt;
      this.b_netAmount = (netAmt - discAmt).toString();
      // this.discamt.nativeElement.focus();
    }
    
    if (this.formDiscPersc > 100 || this.formDiscPersc < 0) {
      this.toastr.warning('Please Enter Discount % less than 100 and Greater than 0.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
      this.formDiscPersc = 0;
      this.b_disAmount = 0;
      this.b_netAmount = (parseInt(this.b_price) * parseInt(this.b_qty)).toString();
      this.disc.nativeElement.focus();
    }
    if (this.formDiscPersc == 0 || this.formDiscPersc == '' || this.formDiscPersc == null) {
      this.b_disAmount = 0;
      this.b_netAmount = (netAmt).toString();
    }
    // console.log(this.b_netAmount)
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
    let Netamt = parseInt(this.b_netAmount);

    if (parseInt(this.disamt) > 0 && this.disamt < this.b_totalAmount) {
      let tot = 0;
      if (Netamt > 0) {
        tot = parseInt(this.b_totalAmount) - parseInt(this.disamt);
        this.b_netAmount = tot.toString();
        this.Serviceform.get('netAmount').setValue(tot);
      }
    } else if (this.Serviceform.get('discAmount').value == null || this.Serviceform.get('discAmount').value == 0) {

      this.Serviceform.get('netAmount').setValue(this.b_totalAmount);
      this.Consession = true;
      if (this.formDiscPersc > 0) {
        let netAmt = parseInt(this.b_price) * parseInt(this.b_qty);
        let discAmt = Math.round((netAmt * parseInt(this.formDiscPersc)) / 100);
        this.b_disAmount = discAmt;
        this.b_netAmount = (netAmt - discAmt).toString();
      } else {
        this.b_netAmount = (parseInt(this.b_price) * parseInt(this.b_qty)).toString();
      }
    } else if (this.Serviceform.get('discAmount').value > this.b_netAmount || this.Serviceform.get('discAmount').value < 0) {
      // this.toastr.warning('Please Enter Discount Amount less than NetAmount', 'Warning !', {
      //   toastClass: 'tostr-tost custom-toast-warning',

      // });
      this.b_disAmount = 0;
      if (this.formDiscPersc > 0) {
        let netAmt = parseInt(this.b_price) * parseInt(this.b_qty);
        let discAmt = Math.round((netAmt * parseInt(this.formDiscPersc)) / 100);
        this.b_disAmount = discAmt;
        this.b_netAmount = (netAmt - discAmt).toString();
      } else {
        this.b_netAmount = (parseInt(this.b_price) * parseInt(this.b_qty)).toString();
      }
      // return;
      // console.log(this.b_netAmount)
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


  viewgetBillReportPdf(BillNo) {

    this._IpSearchListService.getIpFinalBillReceipt(
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

  //For testing 
  viewgetDraftBillReportPdf(AdmissionID) {
debugger
    this._IpSearchListService.getIpDraftBillReceipt(
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

  backNavigate() {
    // this._location.back();
  }


  // getAdmittedDoctorCombolist() {

  //   this._IpSearchListService.getAdmittedDoctorCombo().subscribe(data => {
  //     this.filteredDoctor = data;
  //     if (this.filteredDoctor.length == 0) {
  //       this.noOptionFound = true;
  //     } else {
  //       this.noOptionFound = false;
  //     }
  //   });

  // }


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
    
    if (!(this.vPercentage > 101)) {
      if (this.dataSource.data.length > 0) {
        if (this.Ipbillform.get('GenerateBill').value) {
          Swal.fire({
            title: 'Do you want to save the Final Bill ',

            showCancelButton: true,
            confirmButtonText: 'OK',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

              this.SaveBill();
            }
          })

        }
        else {

          Swal.fire({
            title: 'Do you want to save the Draft Bill ',

            showCancelButton: true,
            confirmButtonText: 'OK',

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
    }

    this.Ipbillform.get('GenerateBill').setValue(false);
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
  CashCounterId: any;
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
    this.CashCounterId = InsertBillUpdateBillNoObj.CashCounterId || '';
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