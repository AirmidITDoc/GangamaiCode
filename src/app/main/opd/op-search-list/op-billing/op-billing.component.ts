import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, ReplaySubject, Subject, Subscription, of } from 'rxjs';
import { SearchInforObj, ChargesList } from '../opd-search-list/opd-search-list.component';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { OPSearhlistService } from '../op-searhlist.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { debounceTime, exhaustMap, filter, scan, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { BrowseOPDBill } from '../../browse-opbill/browse-opbill.component';
import { IpPaymentInsert, OPAdvancePaymentComponent } from '../op-advance-payment/op-advance-payment.component';
import * as converter from 'number-to-words';

type NewType = Observable<any[]>;
export class ILookup {
  BalanceQty: number;
  ItemID: number;
  ItemName: string;
  UOM: string;
  UnitofMeasurementId: number;
}

@Component({
  selector: 'app-op-billing',
  templateUrl: './op-billing.component.html',
  styleUrls: ['./op-billing.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OPBillingComponent implements OnInit {
  saveclick: boolean = false;
  hasSelectedContacts: boolean;
  paidamt: number;
  flagSubmit: boolean;
  balanceamt: number;
  disamt: any;
  msg: any;
  reportPrintObj: BrowseOPDBill;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: BrowseOPDBill[] = [];
  chargeslist: any = [];
  screenFromString = 'OP-billing';
  isDoctor: boolean = false;
  Consessionres: boolean = false;

  displayedColumns = [
        'ChargesDate',
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

  tableColumns = [
    'ServiceName',
    'Price',
    'Qty',
    'action'
  ];

  dataSource = new MatTableDataSource<ChargesList>();
  myControl = new FormControl();
  filteredOptions: any;
  billingServiceList = [];
  showAutocomplete = false;
  ConcessionReasonList: any = [];
  FinalAmt: any;
  DoctorFinalId = 'N';
  b_price = '0';
  b_qty = '1';
  b_totalAmount = '';
  tettotalAmount: any;
  b_netAmount = '';
  B_netAmount: any;
  b_disAmount = '0';
  b_DoctorName = '';
  b_traiffId = '';
  b_isPath = '';
  b_isRad = '';
  b_IsEditable = '';
  b_IsDocEditable = '';
  totalamt = 0;
  TotalAmount = 0;
  concessionDiscPer: any = 0;
  isExpanded: boolean = false;
  totalAmtOfNetAmt: any;
  interimArray: any = [];
  formDiscPersc: any;
  serviceId: number;
  serviceName: String;
  b_TotalChargesAmount: any;
  DoctornewId: any;
  ChargesDoctorname: any;
  finalAmt: any;
  CashorPay = 1;
  Consessionamt: any = 0;
  


  isLoading: String = '';
  selectedAdvanceObj: SearchInforObj;
  isFilteredDateDisabled: boolean = true;
  currentDate = new Date();

  doctorNameCmbList: any = [];
  BillingClassCmbList: any = [];
  IPBillingInfor: any = [];
  registeredForm: FormGroup;
  myShowAdvanceForm: FormGroup;
  concessionAmtOfNetAmt: any = 0;
  netPaybleAmt: any;
  netPaybleAmt1: any;
  TotalnetPaybleAmt: any;
  drugList1: any = [];
  filteredDrugs$: Observable<ILookup[]>;
  filteredDrugs1$: Observable<ILookup[]>;
  public filteredDose: ReplaySubject<any> = new ReplaySubject<any>(1);
  public filteredDrug: ReplaySubject<any> = new ReplaySubject<any>(1);
  public historyFilterCtrl: FormControl = new FormControl();
  public diagnosisFilterCtrl: FormControl = new FormControl();
  public doseFilterCtrl: FormControl = new FormControl();
  public drugFilterCtrl: FormControl = new FormControl();
  private lookups: ILookup[] = [];
  private nextPage$ = new Subject();
  noOptionFound: boolean = false;
  SrvcName: any;

  Paymentdata: any;

  //doctorone filter
  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);


  public serviceFilterCtrl: FormControl = new FormControl();
  public filteredService: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  resBillId: Post;


  constructor(
    private _fuseSidebarService: FuseSidebarService,
    private changeDetectorRefs: ChangeDetectorRef,
    public _opappointmentService: OPSearhlistService,
    public element: ElementRef<HTMLElement>,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private renderer: Renderer2,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private dialogRef: MatDialogRef<OPBillingComponent>,
    public _httpClient: HttpClient,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
    }

    this.getServiceListCombobox();
    this.getAdmittedDoctorCombo();
    this.getChargesList();
    this.getChargesList1();
    this.getBillingClassCombo();
    this.getConcessionReasonList();

    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();
      });
  }

  focusNextPrice() {
    this.renderer.selectRootElement('#Price').focus();
  }

  focusNextQty() {
    this.renderer.selectRootElement('#qty').focus();
  }

  focusNextbtnAdd() {
    this.renderer.selectRootElement('#DoctorId').focus();

  }
  // doctorone filter code  
  private filterDoctor() {

    if (!this.doctorNameCmbList) {
      return;
    }
    // get the search keyword
    let search = this.doctorFilterCtrl.value;
    if (!search) {
      this.filteredDoctor.next(this.doctorNameCmbList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctor.next(
      this.doctorNameCmbList.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }

  // Create registered form group
  createForm() {
    this.registeredForm = this.formBuilder.group({
      price: [Validators.required,
      Validators.pattern("^[0-9]*$")],
      qty: [Validators.required,
      Validators.pattern("^[0-9]*$")],
      totalAmount: [Validators.required],
      DoctorId: [''],
      doctorId: [''],
      DoctorID: [Validators.required, ''],
      discPer: [Validators.pattern("^[0-9]*$")],
      discAmount: [Validators.pattern("^[0-9]*$")],
      netAmount: ['', Validators.pattern("^[0-9]*$")],
      // BillingClassId: [''],
      ConcessionReasonId: [''],
      ConcessionId: [],
      concesDiscPer: [Validators.pattern("^[0-9]*$")],
      BillRemark: [''],
      TotalAmount: [Validators.pattern("^[0-9]*$")],
      serviceId: [''],
      serviceName: [''],
      ServiceName: [''],
      ServiceId: [''],
      SrvcName: [''],
      concessionAmt: [''],
      TotallistAmount: [''],
      FinalAmt: ['', Validators.required],
      cashpay: ['1']
      // TotalBillAmount: [Validators.pattern("^[0-9]*$")],
      // NetBillAmount: [Validators.pattern("^[0-9]*$")],
      // Concession:[Validators.pattern("^[0-9]*$")],

    });
  }

  private getDrugs(startsWith: string, page: number): Observable<ILookup[]> {
    const take = 10;
    const skip = page > 0 ? (page - 1) * take : 0;
    const filtered = this.lookups
      .filter(option => option.ItemName.toLowerCase().startsWith(startsWith.toLowerCase()));
    return of(filtered.slice(skip, skip + take));
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

  // onOptionSelected(selectedItem) {
  //   this.b_price = selectedItem.Price
  //   this.b_totalAmount = selectedItem.Price  //* parseInt(this.b_qty)
  //   this.b_disAmount = '0';
  //   this.b_netAmount = selectedItem.Price
  //   this.b_IsEditable = selectedItem.IsEditable
  //   this.b_IsDocEditable = selectedItem.IsDocEditable
  //   this.b_isPath = selectedItem.IsPathology
  //   this.b_isRad = selectedItem.IsRadiology
  //   this.serviceId = selectedItem.ServiceId;
  //   this.serviceName = selectedItem.ServiceName;
  //   this.calculateTotalAmt();
  // }

  // updatedVal(e) {
  //   if (e && e.length >= 2) {
  //     this.showAutocomplete = true;
  //   } else {
  //     this.showAutocomplete = false;
  //   }
  //   if (e.length == 0) { this.b_price = ''; this.b_totalAmount = '0'; this.b_netAmount = '0'; this.b_disAmount = '0'; this.b_isPath = ''; this.b_isRad = ''; this.b_IsEditable = '0'; }
  // }

  getServiceListCombobox() {
    let tempObj;
    var m_data = {
      SrvcName: `${this.registeredForm.get('SrvcName').value}%`,
      TariffId: 1,// this.selectedAdvanceObj.TariffId,
      ClassId: this.selectedAdvanceObj.ClassId
    };
    console.log(m_data);
    if (this.registeredForm.get('SrvcName').value.length >= 1) {
      this._opappointmentService.getBillingServiceList(m_data).subscribe(data => {
        console.log(data);
        this.filteredOptions = data;
        console.log(this.filteredOptions);
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
      // });
    }
  }

  getOptionText(option) {
    // debugger;
    if (!option)
      return '';
    return option.ServiceName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  }

  getSelectedObj(obj) {
    // debugger;
    console.log(obj);
    console.log('obj==', obj);
    this.SrvcName = obj.ServiceName;
    this.b_price = obj.Price;
    this.b_totalAmount = obj.Price;
    this.b_netAmount = obj.Price;
    this.serviceId = obj.ServiceId;
    this.b_isPath = obj.IsPathology;
    this.b_isRad = obj.IsRadiology;

    if (obj.IsDocEditable) {

      this.isDoctor = true;
    } else {

      this.isDoctor = false;

    }
  }

  // drugChange(event) {

  //   const filter$ = this.registeredForm.get(`drugController$`).valueChanges.pipe(
  //     startWith(''),
  //     debounceTime(200),
  //     filter(q => typeof q === "string"));

  //   this.filteredDrugs$ = filter$.pipe(
  //     switchMap(filter => {
  //       //Note: Reset the page with every new seach text
  //       let currentPage = 1;
  //       return this.nextPage$.pipe(
  //         startWith(currentPage),
  //         //Note: Until the backend responds, ignore NextPage requests.
  //         exhaustMap(_ => this.getDrugs(filter, currentPage)),
  //         tap(() => currentPage++),

  //         //Note: This is a custom operator because we also need the last emitted value.
  //         //Note: Stop if there are no more pages, or no results at all for the current search text.
  //         takeWhileInclusive(p => p.length > 0),
  //         scan((allProducts, newProducts) => allProducts.concat(newProducts), []),
  //       );
  //     }));
  // }

  // getTotalAmount(element) {
  //   // debugger
  //   if (element.Price && element.Qty) {
  //     let totalAmt;
  //     totalAmt = parseInt(element.Price) * parseInt(element.Qty);
  //     element.TotalAmt = totalAmt;
  //     element.NetAmount = totalAmt;
  //     this.totalAmtOfNetAmt = totalAmt;
  //     this.getDiscAmount(element);

  //   }
  // }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // getDiscAmount(element) {
  //   let netAmt = parseInt(element.Price) * parseInt(element.Qty);
  //   if (element.ConcessionPercentage) {
  //     let discAmt = (netAmt * parseInt(element.ConcessionPercentage)) / 100;
  //     element.DiscAmt = discAmt;
  //     element.NetAmount = netAmt - discAmt;
  //   }
  // }

  // getDiscValue(element) {
  //   let netAmt = parseInt(element.Price) * parseInt(element.Qty);
  //   if (element.DiscAmt) {
  //     element.ConcessionPercentage = (parseInt(element.DiscAmt) * 100) / netAmt;
  //     element.NetAmount = netAmt - parseInt(element.DiscAmt);
  //   }
  // }

  // openBillInfo() {
  //   this.isExpanded = !this.isExpanded;
  // }

  getNetAmtSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    this.totalAmtOfNetAmt = netAmt;
    this.netPaybleAmt = netAmt;
    this.b_TotalChargesAmount = netAmt;
    return netAmt
  }
  transform(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd/MM/yyyy hh:mm a');
    return value;
  }
  getTotalNetAmount() {
    this.TotalnetPaybleAmt = this.b_TotalChargesAmount - this.concessionAmtOfNetAmt;
  }

  // tableElementChecked(event, element) {

  //   if (event.checked) {
  //     this.interimArray.push(element);
  //   } else if (this.interimArray.length > 0) {
  //     let index = this.interimArray.indexOf(element);
  //     if (index !== -1) {
  //       this.interimArray.splice(index, 1);
  //     }
  //   }
  // }

  // getInterimData() {
  //   // console.log('this.interimArray==', this.interimArray);
  //   // this._matDialog.open(InterimComponentComponent,
  //   //   { data: this.interimArray });
  // }
  

  getChargesList1() {
    this.chargeslist = [];
    this.dataSource.data = [];
    this.isLoading = 'list-loading';
    let Query = "Select * from lvwAddCharges where IsGenerated=0 and IsPackage=0 and IsCancelled =0 AND OPD_IPD_ID=" + this.selectedAdvanceObj.AdmissionID + " and OPD_IPD_Type=0 Order by Chargesid"
    this._opappointmentService.getchargesList(Query).subscribe(data => {
      this.chargeslist = data as ChargesList[];
      this.dataSource.data = data as ChargesList[];
      this.getNetAmtSum(this.dataSource.data);
      this.isLoading = 'list-loaded';
    },
      (error) => {
        this.isLoading = 'list-loaded';
      });
  }

  getChargesList() {
    this.chargeslist = [];
    this.dataSource.data = [];
    this.isLoading = 'list-loading';
    let Query = "Select * from lvwAddCharges where IsGenerated=0 and IsPackage=0 and IsCancelled =0 AND OPD_IPD_ID=" + this.selectedAdvanceObj.AdmissionID + " and OPD_IPD_Type=0 Order by Chargesid"
    this._opappointmentService.getchargesList(Query).subscribe(data => {
      this.chargeslist = data as ChargesList[];
      this.dataSource.data = data as ChargesList[];
      this.getNetAmtSum(this.dataSource.data);
      this.getTotalNetAmount();
      if (this.dataSource.data.length > 0) {
        this.onSaveOPBill2();
      }
      this.isLoading = 'list-loaded';
    },
      (error) => {
        this.isLoading = 'list-loaded';
      });
  }
  

  onSaveOPBill2() {
    this.saveclick = true;
    let disamt = this.registeredForm.get('concessionAmt').value;

    if (this.concessionDiscPer > 0 || this.concessionAmtOfNetAmt > 0) {
      this.FinalAmt = this.TotalnetPaybleAmt; //this.registeredForm.get('FinalAmt').value;
      this.netPaybleAmt1 = this.TotalnetPaybleAmt;
    }
    else {
      this.FinalAmt = this.TotalnetPaybleAmt;
      this.netPaybleAmt1 = this.TotalnetPaybleAmt;
    }


    this.isLoading = 'submit';


    let Billdetsarr = [];
    this.dataSource.data.forEach((element) => {
      let BillDetailsInsertObj = {};
      BillDetailsInsertObj['BillNo'] = 0;
      BillDetailsInsertObj['ChargesId'] = element.ChargesId;
      Billdetsarr.push(BillDetailsInsertObj);
    });

    let InterimOrFinal=1

    let ConcessionId=0;
    if(this.registeredForm.get('ConcessionId').value)
    ConcessionId = this.registeredForm.get('ConcessionId').value.ConcessionId;

    let InsertBillUpdateBillNoObj = {};
    InsertBillUpdateBillNoObj['BillNo'] = 0;
    InsertBillUpdateBillNoObj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID;
    InsertBillUpdateBillNoObj['TotalAmt'] = this.totalAmtOfNetAmt;
    InsertBillUpdateBillNoObj['ConcessionAmt'] = this.concessionAmtOfNetAmt;
    InsertBillUpdateBillNoObj['NetPayableAmt'] = this.registeredForm.get('FinalAmt').value;
    InsertBillUpdateBillNoObj['PaidAmt'] = this.registeredForm.get('FinalAmt').value;
    InsertBillUpdateBillNoObj['BalanceAmt'] = 0;
    InsertBillUpdateBillNoObj['BillDate'] = this.dateTimeObj.date;
    InsertBillUpdateBillNoObj['OPD_IPD_Type'] = 0;
    InsertBillUpdateBillNoObj['AddedBy'] = this.accountService.currentUserValue.user.id,
      InsertBillUpdateBillNoObj['TotalAdvanceAmount'] = 0,
      InsertBillUpdateBillNoObj['BillTime'] = this.dateTimeObj.date;
    InsertBillUpdateBillNoObj['ConcessionReasonId'] =ConcessionId// this.registeredForm.get('ConcessionId').value.ConcessionId || 0;
    InsertBillUpdateBillNoObj['IsSettled'] = 0;
    InsertBillUpdateBillNoObj['IsPrinted'] = 0;
    InsertBillUpdateBillNoObj['IsFree'] = 0;
    InsertBillUpdateBillNoObj['CompanyId'] = 0;
    InsertBillUpdateBillNoObj['TariffId'] = this.selectedAdvanceObj.TariffId || 0;
    InsertBillUpdateBillNoObj['UnitId'] = this.selectedAdvanceObj.UnitId || 0;
    InsertBillUpdateBillNoObj['InterimOrFinal'] = InterimOrFinal;
    InsertBillUpdateBillNoObj['CompanyRefNo'] = 0;
    InsertBillUpdateBillNoObj['ConcessionAuthorizationName'] = '';
    InsertBillUpdateBillNoObj['TaxPer'] = 0;
    InsertBillUpdateBillNoObj['TaxAmount'] = 0; 
    InsertBillUpdateBillNoObj['CashCounterId'] = 0;
    InsertBillUpdateBillNoObj['DiscComments'] = 'Remark';// 
    //



    let InsertAdddetArr = [];
debugger
    if (this.registeredForm.get("DoctorID").value) {
      this.DoctornewId = this.registeredForm.get("DoctorID").value.DoctorID;
      this.ChargesDoctorname = this.registeredForm.get("DoctorID").value.DoctorName || '';
    } else {
      this.DoctornewId = 0;
      this.ChargesDoctorname = '';
    }

    this.dataSource.data.forEach((element) => {
      let InsertAddChargesObj = {};
      InsertAddChargesObj['ChargeID'] = 0,
        InsertAddChargesObj['ChargesDate'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
        InsertAddChargesObj['opD_IPD_Type'] = 0,
        InsertAddChargesObj['opD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID,
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
        InsertAddChargesObj['classId'] = this.selectedAdvanceObj.ClassId,

        InsertAdddetArr.push(InsertAddChargesObj);
          })


    let opCalDiscAmountBill = {}
    opCalDiscAmountBill['billNo'] = 0

    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
    PatientHeaderObj['NetPayAmount'] = this.FinalAmt;
    debugger
    if (!this.registeredForm.get('cashpay').value) {
      const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
        {
          maxWidth: "85vw",
          height: '540px',
          width: '100%',
          data: {
            advanceObj: PatientHeaderObj,
            FromName: "OP-Bill"
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        let Data = {
          "opInsertPayment": result.submitDataPay.ipPaymentInsert
        };
        this.paidamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
        this.balanceamt = result.submitDataPay.ipPaymentInsert.BalanceAmt;
        this.flagSubmit = result.IsSubmitFlag
      
        if (this.concessionDiscPer > 0) {
          this.FinalAmt = this.totalAmtOfNetAmt - this.concessionAmtOfNetAmt;
        } else {
          this.FinalAmt = this.TotalnetPaybleAmt;
        }

        let InterimOrFinal = 1;


        if (this.flagSubmit == true) {
          console.log("Procced with Payment Option");
          const insertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);
          let submitData = {
            "chargesDetailInsert": InsertAdddetArr,
            "insertBillupdatewithbillno": insertBillUpdateBillNo,
            "opBillDetailsInsert": Billdetsarr,
            "opCalDiscAmountBill": opCalDiscAmountBill,
            "opInsertPayment": result.submitDataPay.ipPaymentInsert
          };
          console.log(submitData);
          this._opappointmentService.InsertOPBilling(submitData).subscribe(response => {
            if (response) {
              Swal.fire('OP Bill With Payment!', 'Bill Generated Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                  let m = response;
                  this.getPrint(m);
                  this._matDialog.closeAll();
                }
              });
            } else {
              Swal.fire('Error !', 'OP Billing data not saved', 'error');
            }
            this.isLoading = '';
          });
        }
        else {

        
          const insertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);
          let submitData = {
            "chargesDetailCreditInsert":InsertAdddetArr,
            "insertBillcreditupdatewithbillno": insertBillUpdateBillNo,
            "opBillDetailscreditInsert": Billdetsarr,
            "opCalDiscAmountBillcredit": opCalDiscAmountBill,
            
          };
          console.log(submitData);
          this._opappointmentService.InsertOPBillingCredit(submitData).subscribe(response => {
            if (response) {
              Swal.fire('OP Bill Credit !', 'Bill Generated Successfully!', 'success').then((result) => {
                if (result.isConfirmed) {
                  let m = response;
                  // this.getPrint(m);
                  this._matDialog.closeAll();

                }
              });
            } else {
              Swal.fire('Error !', 'OP Billing data not saved', 'error');
            }
            this.isLoading = '';
          });
        }
      });
    } else {

      debugger
      let Paymentobj = {};
      Paymentobj['BillNo'] = 0;
      Paymentobj['ReceiptNo'] = "";
      Paymentobj['PaymentDate'] = this.dateTimeObj.date;
      Paymentobj['PaymentTime'] = this.dateTimeObj.time;
      Paymentobj['CashPayAmount'] = this.registeredForm.get('FinalAmt').value || 0;
      Paymentobj['ChequePayAmount'] = 0;
      Paymentobj['ChequeNo'] = 0;
      Paymentobj['BankName'] = "";
      Paymentobj['ChequeDate'] = this.dateTimeObj.date;
      Paymentobj['CardPayAmount'] = 0;
      Paymentobj['CardNo'] = 0;
      Paymentobj['CardBankName'] = "";
      Paymentobj['CardDate'] = this.dateTimeObj.date;
      Paymentobj['AdvanceUsedAmount'] = 0;
      Paymentobj['AdvanceId'] = 0;
      Paymentobj['RefundId'] = 0;
      Paymentobj['TransactionType'] = 0;
      Paymentobj['Remark'] = "Cashpayment";
      Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
        Paymentobj['IsCancelled'] = 0;
      Paymentobj['IsCancelledBy'] = 0;
      Paymentobj['IsCancelledDate'] = this.dateTimeObj.date;
      Paymentobj['CashCounterId'] = 0;
      Paymentobj['NEFTPayAmount'] = 0;
      Paymentobj['NEFTNo'] = 0;
      Paymentobj['NEFTBankMaster'] = "";
      Paymentobj['NEFTDate'] = this.dateTimeObj.date;
      Paymentobj['PayTMAmount'] = 0;
      Paymentobj['PayTMTranNo'] = 0;
      Paymentobj['PayTMDate'] = this.dateTimeObj.date;
      Paymentobj['PaidAmt'] = this.registeredForm.get('FinalAmt').value || 0;
      Paymentobj['BalanceAmt'] = 0;

      const ipPaymentInsert = new IpPaymentInsert(Paymentobj);
      let submitDataPay = {
        ipPaymentInsert,
      };

     
      const insertBillUpdateBillNo = new Bill(InsertBillUpdateBillNoObj);
      let submitData = {
        "chargesDetailInsert": InsertAdddetArr,
        "insertBillupdatewithbillno": insertBillUpdateBillNo,
        "opBillDetailsInsert": Billdetsarr,
        "opCalDiscAmountBill": opCalDiscAmountBill,
        "opInsertPayment": Paymentobj
      };
      console.log(submitData);
      this._opappointmentService.InsertOPBilling(submitData).subscribe(response => {
        if (response) {
          Swal.fire('OP Bill With Cash Payment!', 'Bill Generated Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              let m = response;
              this.getPrint(m);
              this._matDialog.closeAll();
            }
          });
        } else {
          Swal.fire('Error !', 'OP Billing data not saved', 'error');
        }
        this.isLoading = '';
      });
    }
  }





  onSaveEntry() {
    
    if (this.registeredForm.get("DoctorID").value) {
      this.DoctornewId = this.registeredForm.get("DoctorID").value.DoctorID;
      this.ChargesDoctorname = this.registeredForm.get("DoctorID").value.DoctorName || '';
    } else {
      this.DoctornewId = 0;
      this.ChargesDoctorname = '';
    }
    this.isLoading = 'save';

    if (this.SrvcName && (parseInt(this.b_price) != 0) && this.b_qty) {
      this.isLoading = 'save';
      this.dataSource.data = [];
      this.chargeslist.push(
        {
          ChargesId: 0,// this.serviceId,
          ServiceId: this.serviceId,
          ServiceName: this.SrvcName,
          Price: this.b_price || 0,
          Qty: this.b_qty || 0,
          TotalAmt: this.b_totalAmount || 0,
          ConcessionPercentage: this.formDiscPersc || 0,
          DiscAmt: this.b_disAmount || 0,
          NetAmount: this.b_netAmount || 0,
          ClassId: this.selectedAdvanceObj.ClassId || 0,
          DoctorId: this.DoctornewId,// (this.registeredForm.get("DoctorID").value.DoctorName).toString() || '',
          DoctorName: this.ChargesDoctorname,
          ChargesDate: this.dateTimeObj.date,
          IsPathology: this.b_isPath,
          IsRadiology: this.b_isRad,
          ClassName: this.selectedAdvanceObj.ClassName || '',
          ChargesAddedName: this.accountService.currentUserValue.user.id || 1,
          
        });
      this.isLoading = '';
      
      this.dataSource.data = this.chargeslist;
      
      this.changeDetectorRefs.detectChanges();

    }
    this.onClearServiceAddList();
    this.getTotalNetAmount();

    this.isDoctor = false;
  }


  // getSelectedDrug(value) {
  //   // console.log('historyContoller==', this.caseFormGroup.get('historyContoller').value);
  //   console.log('controll===', value);
  //   this.registeredForm.get(`drugController$`).setValue(value);
  //   console.log(this.registeredForm.get(`drugController$`).value);
  // }

  displayWith(lookup) {
    return lookup ? lookup.ItemName : null;
  }

  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    this.nextPage$.next();
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClearServiceAddList() {
    // this.registeredForm.get('SrvcName').reset();
    // this.registeredForm.get('price').reset();
    // this.registeredForm.get('qty').reset('1');
    // this.registeredForm.get('totalAmount').reset();
    // this.registeredForm.get('DoctorId').reset();
    // this.registeredForm.get('discPer').reset();
    // this.registeredForm.get('discAmount').reset();
    // this.registeredForm.get('netAmount').reset();

    this.registeredForm.reset();

  }

  calculateTotalAmt() {
    if (this.b_price && this.b_qty) {
      this.b_totalAmount = Math.round(parseInt(this.b_price) * parseInt(this.b_qty)).toString();
      this.b_netAmount = this.b_totalAmount;
      this.calculatePersc();
    }
  }

  calculatePersc() {
    this.tettotalAmount = parseInt(this.b_netAmount);
    let beforeamt = this.b_totalAmount;
    let disper = this.registeredForm.get('discPer').value;
    if (disper == null || disper == 0) {
      this.registeredForm.get('netAmount').setValue(beforeamt);
      this.b_disAmount = '';
    }
    else {
      let amt = parseInt(this.b_disAmount);
      let netAmt = parseInt(this.b_price) * parseInt(this.b_qty);
      if (this.formDiscPersc) {
        let discAmt = (netAmt * parseInt(this.formDiscPersc)) / 100;
        this.b_disAmount = Math.round(discAmt).toString();
        this.b_netAmount = Math.round(netAmt - discAmt).toString();
        this.TotalnetPaybleAmt = this.b_netAmount;
      } else if (amt > 0) {
        this.b_netAmount = Math.round(netAmt - amt).toString();
        this.TotalnetPaybleAmt = this.b_netAmount;
      }
    }
  }



  calculatePersc1() {

    this.concessionAmtOfNetAmt = 0;
    let netAmt = this.b_TotalChargesAmount;

    if (this.concessionDiscPer > 0) {
      let discAmt1 = (this.b_TotalChargesAmount * parseInt(this.concessionDiscPer)) / 100;
      this.concessionAmtOfNetAmt = Math.round(discAmt1).toString();
      this.TotalnetPaybleAmt = Math.round(this.b_TotalChargesAmount - discAmt1).toString();
      this.registeredForm.get('FinalAmt').setValue(this.TotalnetPaybleAmt);
      this.TotalnetPaybleAmt = parseInt(this.TotalnetPaybleAmt);
      this.Consessionres = true;

    }

    this.TotalnetPaybleAmt = this.b_TotalChargesAmount - this.concessionAmtOfNetAmt;
    this.registeredForm.get('FinalAmt').setValue(this.TotalnetPaybleAmt);

    if ((this.concessionDiscPer == 0)) {
      this.Consessionres = false
    }
  }

  calculatechargesDiscamt() {
    debugger;
    let d = this.registeredForm.get('discAmount').value;
    this.Consessionres = false;
    this.disamt = this.registeredForm.get('discAmount').value;
    let Netamt = parseInt(this.b_netAmount);

    if (parseInt(this.disamt) > 0 && this.disamt < this.b_totalAmount) {
    
      let tot = 0;
      if (Netamt > 0) {
        tot = Netamt - parseInt(this.disamt);
        this.b_netAmount = tot.toString();
        this.registeredForm.get('netAmount').setValue(tot);
      }
    } else if (d == null) {
      this.registeredForm.get('netAmount').setValue(this.b_totalAmount);
      // this.Consessionres = true;
    }
    //   else
    //     this.TotalnetPaybleAmt = this.disamt;
    // }
  }

  calculateDiscamtfinal() {
    let d = this.registeredForm.get('concessionAmt').value;
    this.Consessionres = false;
    this.disamt = this.registeredForm.get('concessionAmt').value;
    if (this.concessionAmtOfNetAmt < this.totalAmtOfNetAmt) {
      if (parseInt(this.disamt) > 0) {
        let tot = 0;
        if (this.b_TotalChargesAmount > 0) {
          tot = parseInt(this.b_TotalChargesAmount) - parseInt(this.disamt);
          this.TotalnetPaybleAmt = tot;
          this.registeredForm.get('FinalAmt').setValue(tot);
        }
        this.Consessionres = true;
      }
      else if (d == null) {
        this.registeredForm.get('FinalAmt').setValue(this.TotalnetPaybleAmt);
      
      }
    } else {
      Swal.fire("Discount Amount Schoud be Less than Total Amount")
    }

    if ( (this.Consessionamt == 0)) {
      this.Consessionres = false
    }
  }


  deleteTableRow(element) {

    // debugger;
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dataSource.data = [];
      this.dataSource.data = this.chargeslist;
    }
    Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
  }


  getAdmittedDoctorCombo() {

    this._opappointmentService.getAdmittedDoctorCombo().subscribe(data => {
      this.doctorNameCmbList = data;
      console.log(this.doctorNameCmbList);
      this.filteredDoctor.next(this.doctorNameCmbList.slice());
    })

  }

  getBillingClassCombo() {
    this._opappointmentService.getClassCombo().subscribe(data => {
      this.BillingClassCmbList = data
      
    });
  }

  getConcessionReasonList() {
    this._opappointmentService.getConcessionCombo().subscribe(data => {
      this.ConcessionReasonList = data;
        })
  }

  getPrint(el) {
    debugger;
    var D_data = {
      "BillNo": el,
    }
  
    let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
    this.subscriptionArr.push(
      this._opappointmentService.getBillPrint(D_data).subscribe(res => {

        this.reportPrintObjList = res as BrowseOPDBill[];
        console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as BrowseOPDBill;

        this.getTemplate();

      })
    );
  }
  getTemplate() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=2';
    this._opappointmentService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName', 'HospitalAddress', 'Phone', 'EmailId', 'PhoneNo', 'RegNo', 'BillNo', 'AgeYear', 'AgeDay', 'AgeMonth', 'PBillNo', 'PatientName', 'BillDate', 'VisitDate', 'ConsultantDocName', 'DepartmentName', 'ServiceName', 'ChargesDoctorName', 'Price', 'Qty', 'ChargesTotalAmount', 'TotalBillAmount', 'NetPayableAmt', 'NetAmount', 'ConcessionAmt', 'PaidAmount', 'BalanceAmt', 'AddedByName']; // resData[0].TempKeys;
      debugger;
      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        console.log(this.reportPrintObjList);
        var objreportPrint = this.reportPrintObjList[i - 1];

        let docname;
        if (objreportPrint.ChargesDoctorName)
          docname = objreportPrint.ChargesDoctorName;
        else
          docname = '';
        var strabc = `<hr style="border-color:white" >
        <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:60px;margin-left:20px;">
            <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
        <div style="display:flex;width:300px;margin-left:10px;text-align:left;">
            <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
        <div style="display:flex;width:300px;margin-left:10px;text-align:left;">
        <div>`+ docname + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
        <div style="display:flex;width:80px;margin-left:10px;text-align:left;">
            <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
        </div>
        <div style="display:flex;width:80px;margin-left:10px;text-align:left;">
            <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
        </div>
        <div style="display:flex;width:110px;margin-left:30px;text-align:center;">
            <div>`+ '₹' + objreportPrint.NetAmount.toFixed(2) + `</div> <!-- <div>450</div> -->
        </div>
        </div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];
      let concessinamt;

      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.PaidAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      setTimeout(() => {
        this.print();
      }, 1000);
    });
  }

  convertToWord(e) {

    return converter.toWords(e);
  }

 

  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }

  transformBilld(value: string) {
    // var datePipe = new DatePipe("en-US");
    // value = datePipe.transform(this.reportPrintObj.BillDate, 'dd/MM/yyyy');
    // return value;
  }
  // PRINT 
  print() {
    // HospitalName, HospitalAddress, AdvanceNo, PatientName
    let popupWin, printContents;
    // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    // popupWin.document.open();
    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
    </html>`);
    popupWin.document.close();
  }

  onClose() {
    this.dialogRef.close();
  }

}


export class Bill {
  BillNo: number;
  OPD_IPD_ID: number;
  TotalAmt: number;
  ConcessionAmt: number;
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

  constructor(InsertBillUpdateBillNoObj) {
    {
      this.BillNo = InsertBillUpdateBillNoObj.BillNo || 0;
      this.OPD_IPD_ID = InsertBillUpdateBillNoObj.OPD_IPD_ID || 0;
      this.TotalAmt = InsertBillUpdateBillNoObj.TotalAmt || 0;
      this.ConcessionAmt = InsertBillUpdateBillNoObj.ConcessionAmt || 0;
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
      this.DiscComments = InsertBillUpdateBillNoObj.DiscComments || 0;
      this.CashCounterId = InsertBillUpdateBillNoObj.CashCounterId || 0;
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



function takeWhileInclusive(arg0: (p: any) => boolean): import("rxjs").OperatorFunction<unknown, unknown> {
  throw new Error('Function not implemented.');
}
// select * from Bill order by 1 desc
// select * from BillDetails order by 1 desc
// select * from lvwBill order by 1 desc
// select * from AddCharges where ChargesId=21
// select * from ServiceMaster where ServiceId=21
// exec rptBillPrint 611755