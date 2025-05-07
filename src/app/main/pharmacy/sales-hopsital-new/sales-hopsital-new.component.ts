import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, HostListener, Inject, Injector, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference, forEach, parseInt } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { ConditionalExpr } from '@angular/compiler';
import { Observable, Subscription } from 'rxjs';
import * as converter from 'number-to-words';
// import { ItemNameList } from 'app/main/inventory/issue-to-department/issue-to-department.component';
import { IpPaymentInsert } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentPortal, DomPortalOutlet, PortalInjector } from '@angular/cdk/portal';
import { HeaderComponent } from 'app/main/shared/componets/header/header.component';
import { element } from 'protractor';
import { OPSearhlistService } from 'app/main/opd/op-search-list/op-searhlist.service';
import { map, startWith } from 'rxjs/operators';
import { RequestforlabtestService } from 'app/main/nursingstation/requestforlabtest/requestforlabtest.service';

import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToasterService } from 'app/main/shared/services/toaster.service';
import { PaymentModeComponent } from 'app/main/shared/componets/payment-mode/payment-mode.component';
import { ToastrService } from 'ngx-toastr';
import { OnlinePaymentService } from 'app/main/shared/services/online-payment.service';
import { ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { MatDrawer } from '@angular/material/sidenav';
import { BrowsSalesBillService } from '../brows-sales-bill/brows-sales-bill.service';
import { ConcessionReasonMasterModule } from 'app/main/setup/billing/concession-reason-master/concession-reason-master.module';
import { SubstitutesComponent } from '../sales/substitutes/substitutes.component';
import { SalesHospitalService } from './sales-hospital-new.service';
import { PrescriptionComponent } from '../sales/prescription/prescription.component';
import { SalePopupComponent } from '../sales/sale-popup/sale-popup.component';
import { BalAvaListStore, DraftSale, IndentList, PatientType, Printsal, SalesBatchItemModel, SalesFormModel, SalesItemModel } from './types';

@Component({
  selector: 'app-sales-hospital',
  templateUrl: './sales-hopsital-new.component.html',
  styleUrls: ['./sales-hopsital-new.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SalesHospitalNewComponent implements OnInit {
  // View Children
  @ViewChild('qtyInputRef') qtyInputRef: ElementRef;
  @ViewChild('discAmount') discAmount: ElementRef;
  @ViewChild('ConseId') ConseId: ElementRef;
  @ViewChild('drawer') public drawer: MatDrawer;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('billTemplate2') billTemplate2: ElementRef;
  @ViewChild('discamt') discamt: ElementRef;
  @ViewChild('doctorname') doctorname: ElementRef;
  @ViewChild('mobileno') mobileno: ElementRef;
  @ViewChild('disper') disper: ElementRef;
  @ViewChild('discamount') discamount: ElementRef;
  @ViewChild('patientname') patientname: ElementRef;
  @ViewChild('address') address: ElementRef;
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('addbutton') addbutton: ElementRef;

  // Form Groups
  ItemSubform: FormGroup;
  patientDetailsFormGrp: FormGroup;

  // Data Sources
  dsIndentList = new MatTableDataSource<IndentList>();
  datasource = new MatTableDataSource<IndentList>();
  saleSelectedDatasource = new MatTableDataSource<IndentList>();
  tempDatasource = new MatTableDataSource<IndentList>();
  chargeslist = new MatTableDataSource<IndentList>();
  dsPatientList = new MatTableDataSource();
  dsDraftList = new MatTableDataSource<DraftSale>();
  dsBalAvaListStore = new MatTableDataSource<BalAvaListStore>();
  dsItemNameList1 = new MatTableDataSource<IndentList>();

  // Display Columns
  patientDisplayedColumns: string[] = ['UHID', 'PatientName', 'NetAmt', 'MobileNo', 'UserName'];
  displayedColumns = ['FromStoreId', 'IndentNo', 'IndentDate', 'FromStoreName', 'ToStoreName', 'Addedby', 'IsInchargeVerify', 'action'];
  displayedColumns1 = ['ItemName', 'Qty', 'IssQty', 'Bal'];
  selectedSaleDisplayedCol = ['ItemName', 'BatchNo', 'BatchExpDate', 'Qty', 'UnitMRP', 'GSTPer', 'GSTAmount', 'TotalMRP', 'DiscPer', 'DiscAmt', 'NetAmt', 'MarginAmt', 'buttons'];
  DraftAvbStkListDisplayedCol = ['StoreName', 'BalQty'];
  DraftSaleDisplayedCol = ['ExtMobileNo', 'buttons'];

  // Patient Related
  PatientType = PatientType;
  PatientName: any;
  RegID: any;
  MobileNo: any;
  DoctorName: any;
  vPatientType: any;
  Patienttype: any;
  vAdmissionID: any;
  RegId: any = '';
  IPMedID: any;
  OPDNo: any;
  IPDNo: any;
  TariffName: any;
  CompanyName: any;
  Age: any;

  // Item Related
  ItemName: any;
  ItemId: any;
  BalanceQty: any;
  Itemchargeslist: any = [];
  Itemchargeslist1: any = [];
  BalChkList: any = [];
  BatchNo: any;
  BatchExpDate: any;
  UnitMRP: any;
  Qty: any = 0;
  IssQty: any;
  Bal: any;
  StoreName: any;
  GSTPer: any;
  MRP: any;
  DiscPer: any = 0;
  DiscAmt: any = 0;
  FinalDiscPer: any = 0;
  FinalDiscAmt: any = 0;
  NetAmt: any = 0;
  TotalMRP: any = 0;
  FinalTotalAmt: any;
  FinalNetAmount: any = 0;
  FinalGSTAmt: any = 0;
  BalQty: any = 0;
  TotalBalQty: any = 0;
  ItemObj: IndentList;
  v_marginamt: any = 0;
  TotalMarginAmt: any = 0;

  // Payment Related
  paidamt: number;
  balanceamt: number = 0;
  BalAmount: any = 0;
  v_PaidbyPatient: any = 0;
  v_PaidbacktoPatient: any = 0;
  roundoffAmt: any;
  paidAmt: number;
  balanceAmt: number = 0;
  TotalCreditAmt: any = 0;
  TotalAdvanceAmt: any = 0;
  TotalBalanceAmt: any = 0;
  netPayAmt: number = 0;
  isPaymentSuccess: boolean = false;
  nowDate: Date;
  amount1: any;
  amount2: any;
  amount3: any;
  amount4: any;
  amount5: any;
  selectedPaymnet1: string = '';
  selectedPaymnet2: string = '';
  selectedPaymnet3: string = '';
  selectedPaymnet4: string = '';
  selectedPaymnet5: string = '';
  PatientHeaderObj: any;
  data: any;

  // Store Related
  Store1List: any = [];
  StoreId: any;
  StockId: any;
  vStockId: any = 0;

  // Flags
  isItemIdSelected: boolean = false;
  paymethod: boolean = false;
  IsOnlineRefNo: boolean = false;
  ConShow: Boolean = false;
  add1: Boolean = false;
  isPatienttypeDisabled: boolean = true;
  chkdiscper: boolean = true;
  stockidflag: boolean = true;
  deleteflag: boolean = true;
  isPaymentSelected: boolean = false;
  Creditflag: boolean = false;
  IsCreditflag: boolean = false;
  drafttable: boolean = false;
  IsLoading: boolean = false;
  showTable: boolean = false;
  Addflag: boolean = false;
  vBarcodeflag: boolean = false;
  Itemflag: boolean = false;
  opflag: Boolean = false;
  ipflag: Boolean = false;
  externalflag: Boolean = false;
  barcodeflag: boolean = false;
  add: Boolean = false;

  // Other Properties
  sIsLoading: string = '';
  isLoading = true;
  filteredOptions: any;
  noOptionFound: boolean = false;
  labelPosition: 'before' | 'after' = 'after';
  msg: any;
  currentDate = new Date();
  DiscId: any;
  DraftID: any = 0;
  DiffNetRoundAmt: any = 0;
  Functionflag = 0;
  type = ' ';
  vPaymode = '';
  vBarcode: any;
  chargeslistBarcode: any = [];
  dateTimeObj: any;
  newDateTimeObj: any = {};
  GSalesNo: any = 0;
  LandedRate: any;
  LandedRateandedTotal: any = 0;
  PurchaseRate: any;
  PurTotAmt: any = 0;
  GSTAmount: any;
  CGSTAmt: any;
  SGSTAmt: any;
  IGSTAmt: any;
  VatPer: any;
  CgstPer: any;
  SgstPer: any;
  IgstPer: any;
  VatAmount: any;
  TotDiscAmt: any = 0;
  gstAmt: any;
  DiscOld: any = 0.0;
  QtyBalchk: any = 0;
  DraftQty: any = 0;
  RQty: any = 0;
  loadingRow: number | null = null;
  OP_IP_Id: any = 0;
  OP_IPType: any = 2;
  BalancechkFlag: any = 0;
  SalesDraftId: any = 0;
  OP_IP_Type: any;
  vSalesDetails: Printsal[] = [];
  vSalesIdList: any = [];
  screenFromString = 'payment-form';
  vextAddress: any = '';
  paymentRowObj = {
    cash: false,
    cheque: false,
    card: false,
    upi: false,
    neft: false,
  };

  // Lists
  ConcessionReasonList: any = [];
  paymentArr1: any[] = [];
  paymentArr2: any[] = [];
  paymentArr3: any[] = [];
  paymentArr4: any[] = [];
  paymentArr5: any[] = [];
  BankNameList2: any = [];
  BankNameList3: any = [];
  BankNameList4: any = [];

  // Print Related
  reportPrintObj: Printsal;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: Printsal[] = [];
  SalesIDObjList: Printsal[] = [];
  Filepath: any;
  reportItemPrintObj: Printsal;
  reportPrintObjItemList: Printsal[] = [];
  repeatItemList: IndentList[] = [];

  // Pharmacy Options
  vPharExtOpt: any;
  vPharOPOpt: any;
  vPharIPOpt: any;
  vSelectedOption: any = 'OP';
  vCondition: boolean = false;
  vConditionExt: boolean = false;
  vConditionIP: boolean = false;

  // Payment Details
  advanceData: any = {};
  billNo: any;
  chequeNo: any;
  chequeAmt: any;
  cashAmt: any;
  cardNo: any;
  BillDate: any;
  paytmTransNo: any;
  neftAmt: any;
  cardAmt: any;
  neftNo: any;
  paytmAmt: any;
  UTRNO: any;
  selectedItem: SalesBatchItemModel;

  constructor(
    public _BrowsSalesBillService: BrowsSalesBillService,
    public _salesService: SalesHospitalService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private renderer: Renderer2,
    private _loggedService: AuthenticationService,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private opService: OPSearhlistService,
    public _RequestforlabtestService: RequestforlabtestService,
    public toastr: ToastrService,
    private onlinePaymentService: OnlinePaymentService
  ) {
    this.PatientHeaderObj = this.data;
  }

  ngOnInit(): void {
    this.BindPaymentTypes(); 
    this.getItemSubform();
    this.getConcessionReasonList();
    this.getStoredet();
    this.selectedPaymnet1 = this.paymentArr1[0]?.value;
    this.amount1 = this.FinalNetAmount;
    this.paidAmt = 0;
    this.getDraftorderList();

    if (this.vPharExtOpt == true) {
      this.paymethod = false;
      this.vSelectedOption = 'External';
    } else {
      this.vPharOPOpt = true;
    }

    if (this.vPharIPOpt == true) {
      if (this.vPharOPOpt == false) {
        this.paymethod = true;
        this.vSelectedOption = 'IP';
      }
    } else {
      this.vConditionIP = true;
    }
    if (this.vPharOPOpt == true) {
      if (this.vPharExtOpt == false) {
        this.paymethod = true;
        this.vSelectedOption = 'OP';
      }
    } else {
      this.vCondition = true;
    }
  }

  RegNo: any;
  WardName:any;
  BedName:any;
  DoctorNamecheck: boolean = false;
  IPDNocheck: boolean = false;
  OPDNoCheck: boolean = false;
  autocompletestore: string = "Store";
  //New code 

  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.OP_IPType = 0;
      this.RegId = '';
      this.paymethod = true;
      this.ItemSubform.get('MobileNo').clearValidators();
      this.ItemSubform.get('PatientName').clearValidators();
      this.ItemSubform.get('MobileNo').updateValueAndValidity();
      this.ItemSubform.get('PatientName').updateValueAndValidity();
    } else if (event.value == 'IP') {
      this.OP_IPType = 1;
      this.RegId = '';
      this.paymethod = true;
      this.ItemSubform.get('MobileNo').clearValidators();
      this.ItemSubform.get('PatientName').clearValidators();
      this.ItemSubform.get('MobileNo').updateValueAndValidity();
      this.ItemSubform.get('PatientName').updateValueAndValidity();
    } else {
      this.ItemSubform.get('MobileNo').reset();
      this.ItemSubform.get('MobileNo').setValidators([Validators.required]);
      this.ItemSubform.get('MobileNo').enable();
      this.ItemSubform.get('PatientName').reset();
      this.ItemSubform.get('PatientName').setValidators([Validators.required]);
      this.ItemSubform.get('PatientName').enable();
      this.ItemSubform.updateValueAndValidity();
      this.paymethod = false;
      this.OP_IPType = 2;
    }
  }

  getSelectedObjRegIP(obj) {
    console.log(obj)
    let IsDischarged = 0;
    IsDischarged = obj.isDischarged;
    if (IsDischarged == 1) {
      Swal.fire('Selected Patient is already discharged'); 
      this.RegId = '';
    } else {
      console.log(obj);
      this.DoctorNamecheck = true;
      this.IPDNocheck = true;
      this.OPDNoCheck = false; 
      this.PatientName = obj.firstName + ' ' + obj.lastName;
      this.RegId = obj.regID;
      this.OP_IP_Id = obj.admissionID;
      this.IPDNo = obj.ipdNo;
      this.RegNo = obj.regNo;
      this.DoctorName = obj.doctorName;
      this.TariffName = obj.tariffName;
      this.CompanyName = obj.CompanyName;
      this.Age = obj.age;
      this.WardName = obj.roomName
      this.BedName = obj.bedName
    }
    this.getBillSummary();
  } 

  getSelectedObjOP(obj) {
    console.log(obj); 
    this.OPDNoCheck = true;
    this.DoctorNamecheck = false;
    this.IPDNocheck = false; 
    this.PatientName = obj.firstName + ' ' + obj.lastName;
    this.RegId = obj.regID;
    this.OP_IP_Id = obj.VisitId;
    this.OPDNo = obj.OPDNo;
    this.RegNo = obj.regNo;
    this.DoctorName = obj.doctorName;
    this.TariffName = obj.tariffName;
    this.CompanyName = obj.CompanyName;
    this.Age = obj.age;
    this.WardName = obj.roomName
    this.BedName = obj.bedName 
     
    this.getBillSummary();
  } 
  onPatientChange(event: any): void {
    console.log(event);
  }

  onItemChange(event: SalesItemModel): void {
    console.log('Event: ', event);
    this.ItemName = event.itemName;
    this.ItemId = event.itemId;
    this.getBatch(); 
  }
  getBatch() {  
    const dialogRef = this._matDialog.open(SalePopupComponent, {
      maxWidth: '800px',
      minWidth: '800px',
      width: '800px',
      height: '380px',
      disableClose: true,
      data: {
        ItemId: this._salesService.ItemSearchGroup.get('ItemId').value.itemId,
        StoreId: this._salesService.ItemSearchGroup.get('ItemId').value.storeId,
      },
    });
    dialogRef.afterClosed().subscribe((result1) => {
      let isEscaped = result1.vEscflag;

      if (isEscaped) {
        this._salesService.ItemSearchGroup.get('ItemId').setValue('a');
        return;
        // this.itemid.nativeElement.focus();
      }
      const QtyElement = document.querySelector(`[name='Qty']`) as HTMLElement;
      if (QtyElement) {
        QtyElement.focus();
      }
      let result = result1.selectedData as SalesBatchItemModel;
 
      const isAlreadyExists = this.Itemchargeslist.find((i) => i.StockId === result.stockId && i.ItemId === result.itemId);
      if (isAlreadyExists) {
        this.toastr.warning('Selected Item already added in the list', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        const ItemIdElement = document.querySelector(`[name='ItemId']`) as HTMLElement;
        if (ItemIdElement) {
          ItemIdElement.focus();
        }
        this.ItemFormreset(); 
        return;
      }

      this.BatchNo = result.batchNo;
      this.BatchExpDate = this.datePipe.transform(result.batchExpDate, 'MM-dd-yyyy');
      this.MRP = result.unitMRP;
      this.Qty = 0;
      // this.Bal = result.BalanceAmt;
      this.GSTPer = result.sgstPer + result.cgstPer + result.igstPer;

      this.TotalMRP = this.Qty * this.MRP;
      this.DiscPer = 0;
      this.DiscAmt = 0;
      this.NetAmt = this.TotalMRP;
      this.BalanceQty = result.balanceQty;

      // this.VatPer = result.VatPercentage;
      this.CgstPer = result.cgstPer;
      this.SgstPer = result.sgstPer;
      this.IgstPer = result.igstPer;

      // this.VatAmount = result.VatPercentage;
      this.StockId = result.stockId;
      this.StoreId = result.storeId;
      this.LandedRate = result.landedRate;
      this.PurchaseRate = result.purchaseRate;
      this.UnitMRP = result.unitMRP;

      this.selectedItem = result;
    }); 
  }
  calculateTotalAmt() {
    let qty = +this._salesService.ItemSearchGroup.get('Qty').value;
    if (qty > this.BalanceQty) {
      Swal.fire('Enter Qty less than Balance');
      // this._salesService.ItemSearchGroup.patchValue({
      //   Qty: 0,
      //   TotalMrp: 0,
      //   NetAmt: 0,
      // });
      this.ItemFormreset();
    }

    if (qty && this.MRP) {
      this.TotalMRP = (qty * this._salesService.ItemSearchGroup.get('MRP').value).toFixed(2);
      this.LandedRateandedTotal = (qty * this.LandedRate).toFixed(2);
      this.v_marginamt = (parseFloat(this.TotalMRP) - parseFloat(this.LandedRateandedTotal)).toFixed(2);
      this.PurTotAmt = (qty * this.PurchaseRate).toFixed(2);

      this.GSTAmount = (((this.UnitMRP * this.GSTPer) / 100) * qty).toFixed(2);
      this.CGSTAmt = (((this.UnitMRP * this.CgstPer) / 100) * qty).toFixed(2);
      this.SGSTAmt = (((this.UnitMRP * this.SgstPer) / 100) * qty).toFixed(2);
      this.IGSTAmt = (((this.UnitMRP * this.IgstPer) / 100) * qty).toFixed(2);
 
      this.getDiscPer();
    }
  }

  checkdisc1: boolean = false;
  getDiscPer() {
    let DiscPer = this._salesService.ItemSearchGroup.get('DiscPer').value;
    if (this.DiscPer > 0) {
      this.ItemSubform.get('FinalDiscPer').disable();
      this.chkdiscper = true;
      this.DiscAmt = ((this.TotalMRP * this.DiscPer) / 100).toFixed(2);
      this.ItemSubform.get('DiscAmt').disable();
    } else {
      this.chkdiscper = false;
      this.DiscAmt = 0;
      this.ItemSubform.get('DiscAmt').enable();
    }
    this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);
  }

  getFinalDiscperAmt() {
    let Disc = this.ItemSubform.get('FinalDiscPer').value || 0;
    let DiscAmt = this.ItemSubform.get('FinalDiscAmt').value || 0;

    if (Disc > 0 || Disc < 100) {
      this.ConShow = true;
      this.FinalDiscAmt = ((this.FinalTotalAmt * Disc) / 100).toFixed(2);
      this.ItemSubform.get('FinalDiscAmt').setValue(this.FinalDiscAmt);
      this.FinalNetAmount = (this.FinalTotalAmt - this.FinalDiscAmt).toFixed(2);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();
      this.ItemSubform.updateValueAndValidity();
    } else {
      this.ConShow = false;
      this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();
      // this.ConseId.nativeElement.focus();
    }

    this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
  }

  getFinalDiscAmount() {
    // console.log("total disc");
    let totDiscAmt = this.ItemSubform.get('FinalDiscAmt').value;
    // console.log(totDiscAmt);
    // console.log(this.FinalDiscAmt);
    if (totDiscAmt > 0) {
      this.FinalNetAmount = (this.FinalNetAmount - this.FinalDiscAmt).toFixed(2);
      this.ConShow = true;
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();
    } else {
      this.ConShow = false;
      this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();
      //this.ConseId.nativeElement.focus();
    }
  }
  public discperCal(): void {
    const formValue = this._salesService.ItemSearchGroup.value;
    const discPer = Number(formValue.DiscPer);

    if (discPer < 0 || discPer > 100) {
      this.toastr.error('Enter discount between 0 - 100', 'Error !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this._salesService.ItemSearchGroup.patchValue({
        DiscAmt: 0,
        DiscPer: 0,
      });
      return;
    }
    if (formValue.TotalMrp) {
      // Calculate discount amount from percentage
      this.DiscAmt = ((formValue.TotalMrp * discPer) / 100).toFixed(2);
      this._salesService.ItemSearchGroup.patchValue({
        DiscAmt: this.DiscAmt,
      });
      this.calculateNetAmount();
      // this.discamount.nativeElement.focus();
    }
  }
  private calculateNetAmount(): void {
    const formValue = this._salesService.ItemSearchGroup.value;
    if (formValue.TotalMrp) {
      this.NetAmt = (formValue.TotalMrp - (formValue.DiscAmt || 0)).toFixed(2);
      this._salesService.ItemSearchGroup.patchValue({
        NetAmt: this.NetAmt,
      });
    }
  }
  public CaldiscAmount(): void {
    const formValue = this._salesService.ItemSearchGroup.value;
    const discAmt = Number(formValue.DiscAmt);

    if (discAmt < 0 || discAmt > Number(formValue.TotalMrp)) {
      this.toastr.error('Discount amount should less then Total MRP', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
      this._salesService.ItemSearchGroup.patchValue({
        DiscAmt: 0,
        DiscPer: 0,
      });
      return;
    }

    if (formValue.TotalMrp && discAmt) {
      // Calculate discount percentage from amount
      this.DiscPer = ((formValue.DiscAmt / formValue.TotalMrp) * 100).toFixed(2);
      this._salesService.ItemSearchGroup.patchValue({
        DiscPer: this.DiscPer,
      });
      this.calculateNetAmount(); 
    }
  }
//Add Item list
OnAddUpdate() {
  debugger
  if (this.saleSelectedDatasource.data.length > 0) {
    this.saleSelectedDatasource.data.forEach((element) => {
      if (element.StockId == this.StockId) {
        this.toastr.warning('Selected Item already added in the list', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.ItemFormreset();
        return
      }
    });
  }  
  if (this.vBarcode == 0) {
    if (this.ItemId == 0 || this.Qty == null || this.MRP == '' || this.TotalMRP == 0) {
      this.toastr.warning('Please select Item Detail', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }
  if (!this.vBarcodeflag) { 
    let Qty = this._salesService.ItemSearchGroup.get('Qty').value;
    this.Qty = parseInt(Qty);
    if (this.ItemName && parseInt(Qty) != 0 && this.MRP > 0 && this.NetAmt > 0) {
      this.Itemchargeslist = this.saleSelectedDatasource.data;
      this.Itemchargeslist.push({
        ItemId: this.ItemId,
        ItemName: this.ItemName,
        BatchNo: this.BatchNo,
        BatchExpDate: this.BatchExpDate || '01/01/1900',
        Qty: this.Qty,
        UnitMRP: this.MRP,
        GSTPer: this.GSTPer || 0,
        GSTAmount: this.GSTAmount || 0,
        TotalMRP: this.TotalMRP,
        DiscPer: this._salesService.ItemSearchGroup.get('DiscPer').value || 0,
        DiscAmt: this._salesService.ItemSearchGroup.get('DiscAmt').value || 0,
        NetAmt: this.NetAmt,
        RoundNetAmt: Math.round(this.NetAmt),
        StockId: this.StockId,
        VatPer: this.VatPer,
        VatAmount: this.GSTAmount,
        LandedRate: this.LandedRate,
        LandedRateandedTotal: this.LandedRateandedTotal,
        CgstPer: this.CgstPer,
        CGSTAmt: this.CGSTAmt,
        SgstPer: this.SgstPer,
        SGSTAmt: this.SGSTAmt,
        IgstPer: this.IgstPer,
        IGSTAmt: this.IGSTAmt,
        PurchaseRate: this.PurchaseRate,
        PurTotAmt: this.PurTotAmt,
        MarginAmt: this.v_marginamt,
        BalanceQty: this.BalQty,
        SalesDraftId: 1,
      });
      this.sIsLoading = '';
      this.saleSelectedDatasource.data = this.Itemchargeslist;
      this.ItemFormreset();
    }
    this.add = false;
  }
}

ItemFormreset() {
  this.BatchNo = '';
  this.BatchExpDate = '01/01/1900';
  this.MRP = 0;
  this.Qty = '';
  this.Bal = 0;
  this.GSTPer = 0;
  this.DiscPer = 0;
  this.DiscAmt = 0;
  this.TotalMRP = 0;
  this.NetAmt = 0;
  this.v_marginamt = 0;
  this._salesService.ItemSearchGroup.get('ItemId').reset('a');
  this.filteredOptions = [];
  this.dsBalAvaListStore.data = []; 
}

Formreset() {
  this.FinalTotalAmt = 0;
  this.FinalDiscPer = 0;
  this.FinalDiscAmt = 0;
  this.BalAmount = 0;
  this.FinalGSTAmt = 0;
  this.FinalNetAmount = 0;
  this.ItemSubform.reset();
  this.RegId = '';
  this.PatientName = '';
  this.DoctorName = '';
  this.ItemSubform.get('PatientType').setValue('External');
  this.ItemSubform.get('CashPay').setValue('CashPay');

  this.IsOnlineRefNo = false;
  this.ItemSubform.get('referanceNo').reset('');
  this.ItemSubform.get('MobileNo').reset('');
  this.ItemSubform.get('PatientName').reset('');
  this.ItemSubform.get('DoctorName').reset('');
  this.ConShow = false;
  this.ItemSubform.get('ConcessionId').clearValidators();
  this.ItemSubform.get('ConcessionId').updateValueAndValidity();
  this.ItemSubform.get('ConcessionId').disable();

  this.saleSelectedDatasource.data = [];
  this.getDraftorderList();
  this.TotalAdvanceAmt = 0;
  this.TotalBalanceAmt = 0;
  this.TotalCreditAmt = 0;
}
deleteTableRow(event, element) {
  // if (this.key == "Delete") {
  let index = this.Itemchargeslist.indexOf(element);
  if (index >= 0) {
    this.Itemchargeslist.splice(index, 1);
    this.saleSelectedDatasource.data = [];
    this.saleSelectedDatasource.data = this.Itemchargeslist;
  }
  Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success'); 
}
getStoredet(){ 
  this._salesService.getstoreDetails(this.autocompletestore).subscribe(data=>{
    const storename = data
    this.StoreName = storename[1].text
    console.log( this.StoreName)
  })



  
}











 
 

  secondAddEnable() {
    return parseInt(this.amount1.toString()) + parseInt(this.amount2.toString()) < this.netPayAmt ? true : false;
  }

  thirdAddEnable() {
    return parseInt(this.amount1.toString()) + parseInt(this.amount2.toString()) + parseInt(this.amount3.toString()) < this.netPayAmt ? true : false;
  }

  fourthAddEnable() {
    if (parseInt(this.amount1.toString()) + parseInt(this.amount2.toString()) + parseInt(this.amount3.toString()) + parseInt(this.amount4.toString()) < this.netPayAmt) {
      return true;
    } else {
      return false;
    }
  }

  getItemSubform() {
    this.ItemSubform = this.formBuilder.group({
      PatientName: '',
      DoctorName: '',
      extAddress: '',
      MobileNo: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],
      PatientType: ['OP'],
      TotalAmt: '',
      GSTPer: '',
      DiscAmt: '',
      concessionAmt: [0],
      ConcessionId: [0, [Validators.required]],
      Remark: [''],
      FinalAmount: '',
      BalAmount: '',
      FinalDiscPer: 0,
      FinalDiscAmt: 0,
      FinalTotalAmt: 0,
      FinalNetAmount: 0,
      FinalGSTAmt: 0,
      BalanceAmt: 0,
      CashPay: ['CashPay'],
      referanceNo: '',
      RegID: '',
      RegID1: '',
      PaidbyPatient: '',
      PaidbacktoPatient: '',
      roundoffAmt: '0',
      StoreId:[this._loggedService.currentUserValue.user.storeId]
    });
  }

  getConcessionReasonList() {
    this._salesService.getConcessionCombo().subscribe((data) => {
      this.ConcessionReasonList = data;
    });
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

 
 

 
  salesIdWiseObj: any;
  getTopSalesDetailsList(MobileNo) {
    var vdata = {
      ExtMobileNo: MobileNo,
    };
    this.sIsLoading = 'get-sales-data';
    this._salesService.getTopSalesDetails(vdata).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.reportPrintObjItemList = data as Printsal[];
        this.repeatItemList = data;
        this.reportItemPrintObj = data[0] as Printsal;
        this.PatientName = data[0].ExternalPatientName;
        this.DoctorName = data[0].DoctorName;
        this.salesIdWiseObj = this.reportPrintObjItemList.reduce((acc, item: any) => {
          if (!acc[item.SalesId]) {
            acc[item.SalesId] = [];
          }
          acc[item.SalesId].push(item);
          return acc;
        }, {});
        this.sIsLoading = '';
        this.patientname.nativeElement.focus();
      } else {
        this.sIsLoading = '';
      }
    });
    this.getTopSalesDetailsprint();
  }

  dummySalesIdNameArr = [];
  SalesIdWiseObj: any = {};

  getTopSalesDetailsprint() {
    var strrowslist = '';
    let onlySalesId = [];
    this.reportPrintObjItemList.forEach((ele) => onlySalesId.push(ele.SalesId));

    let SalesidNamesArr = [...new Set(onlySalesId)];
    SalesidNamesArr.forEach((ele) => this.dummySalesIdNameArr.push({ SalesId: ele, isHidden: false }));

    this.SalesIdWiseObj = this.reportPrintObjItemList.reduce((acc, item: any) => {
      if (!acc[item.SalesId]) {
        acc[item.SalesId] = [];
      }
      acc[item.SalesId].push(item);
      return acc;
    }, {});

    for (let i = 1; i <= this.reportPrintObjItemList.length; i++) {
      var objreportPrint = this.reportPrintObjItemList[i - 1];

      var strabc =
        this.getSalesIdName(objreportPrint.SalesId) +
        `
  <div style="display:flex;margin:8px 0">
  <div style="display:flex;width:80px;margin-left:20px;">
      <div>` +
        objreportPrint.ItemShortName +
        `</div>
  </div>
  </div>`;
      strrowslist += strabc;
    }
  }

  getSalesIdName(SalesId: String) {
    let groupDiv;
    for (let i = 0; i < this.dummySalesIdNameArr.length; i++) {
      if (this.dummySalesIdNameArr[i].SalesId == SalesId && !this.dummySalesIdNameArr[i].isHidden) {
        let groupHeader =
          `<div style="display:flex;width:960px;margin-left:20px;justify-content:space-between;">
          <div> <h3>` +
          SalesId +
          `</h3></div>
           </div>`;
        this.dummySalesIdNameArr[i].isHidden = true;
        groupDiv = groupHeader;
        break;
      } else {
        groupDiv = ``;
      }
    }
    return groupDiv;
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 119) {
      this.onsubstitutes();
    }
    if (event.keyCode === 120) {
      this.onSave(event);
    }
  }

  loadingarry: any = [];
  getWhatsappshare() {
    var m_data = {
      insertWhatsappsmsInfo: {
        mobileNumber: this.MobileNo,
        isSent: 0,
        smsType: 'bulk',
        smsFlag: 0,
        smsDate: this.currentDate,
        tranNo: this.GSalesNo,
        templateId: 0,
        smSurl: 'info@gmail.com',
        filePath: this.Filepath || '',
        smsOutGoingID: 0,
      },
    };
    console.log(m_data);
    this._salesService.InsertWhatsappSms(m_data).subscribe((response) => {
      if (response) {
        Swal.fire('Congratulations !', 'WhatsApp Sms  Data  save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Whatsapp Sms Data  not saved', 'error');
      }
    });
    this.IsLoading = false;
  }

  onsubstitutes() {
    const dialogRef = this._matDialog.open(SubstitutesComponent, {
      maxWidth: '65vw',
      height: '650px',
      width: '60%',
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

  onClear() {}

 

  Addrepeat(row) {
    console.log(row);
    this.repeatItemList = row.value;
    this.Itemchargeslist = [];
    this.repeatItemList.forEach((element) => {
      let Qty = parseInt(element.Qty.toString());
      let UnitMrp = element.UnitMRP.split('|')[0];
      let GSTAmount = (((element.UnitMRP * this.GSTPer) / 100) * Qty).toFixed(2);
      let CGSTAmt = (((element.UnitMRP * this.CgstPer) / 100) * Qty).toFixed(2);
      let SGSTAmt = (((element.UnitMRP * this.SgstPer) / 100) * Qty).toFixed(2);
      let IGSTAmt = (((element.UnitMRP * this.IgstPer) / 100) * Qty).toFixed(2);

      this.NetAmt = (UnitMrp * element.Qty).toFixed(2);
      this.Itemchargeslist.push({
        ItemId: element.ItemId,
        ItemName: element.ItemShortName,
        BatchNo: element.BatchNo,
        BatchExpDate: this.datePipe.transform(element.BatchExpDate, 'dd/MM/YYYY'),
        Qty: element.Qty,
        UnitMRP: UnitMrp || element.UnitMRP,
        TotalMRP: element.TotalAmount,
        GSTPer: element.VatPer || 0,
        GSTAmount: element.VatAmount || 0,
        DiscPer: element.DiscPer,
        DiscAmt: element.DiscAmount,
        NetAmt: this.NetAmt,
        RoundNetAmt: Math.round(this.NetAmt),
        StockId: this.StockId,
        VatPer: this.VatPer,
        VatAmount: this.GSTAmount,
        LandedRate: this.LandedRate,
        LandedRateandedTotal: this.LandedRateandedTotal,
        CgstPer: this.CgstPer,
        CGSTAmt: this.CGSTAmt,
        SgstPer: this.SgstPer,
        SGSTAmt: this.SGSTAmt,
        IgstPer: this.IgstPer,
        IGSTAmt: this.IGSTAmt,
        PurchaseRate: this.PurchaseRate,
        PurTotAmt: this.PurTotAmt,
        MarginAmt: this.v_marginamt,
        BalanceQty: this.BalQty,
        SalesDraftId: 1,
      });
    });
    this.sIsLoading = '';
    this.saleSelectedDatasource.data = this.Itemchargeslist;
  }
  getGSTAmtSum(element) {
    this.FinalGSTAmt = element.reduce((sum, { GSTAmount }) => (sum += +(GSTAmount || 0)), 0).toFixed(2);
    return this.FinalGSTAmt;
  }

  getNetAmtSum(element) {
    this.FinalNetAmount = element.reduce((sum, { NetAmt }) => (sum += +(NetAmt || 0)), 0).toFixed(2);
    this.FinalTotalAmt = element.reduce((sum, { TotalMRP }) => (sum += +(TotalMRP || 0)), 0).toFixed(2);
    this.FinalDiscAmt = element.reduce((sum, { DiscAmt }) => (sum += +(DiscAmt || 0)), 0).toFixed(2);
    this.FinalGSTAmt = element.reduce((sum, { GSTAmount }) => (sum += +(GSTAmount || 0)), 0).toFixed(2);
    this.roundoffAmt = Math.round(this.ItemSubform.get('FinalNetAmount').value);

    this.DiffNetRoundAmt = (parseFloat(this.roundoffAmt) - parseFloat(this.FinalNetAmount)).toFixed(2);
    return this.FinalNetAmount;
  }
  getMarginSum(element) {
    this.TotalMarginAmt = element.reduce((sum, { MarginAmt }) => (sum += +(MarginAmt || 0)), 0).toFixed(2);
    return this.TotalMarginAmt;
  }

  calculateDiscAmt() {
    let ItemDiscAmount = this._salesService.ItemSearchGroup.get('DiscAmt').value;
    // let PurTotalAmount = this.PurTotAmt;
    let LandedTotalAmount = this.LandedRateandedTotal;
    let m_marginamt = (parseFloat(this.TotalMRP) - parseFloat(ItemDiscAmount)).toFixed(2);
    this.v_marginamt = (parseFloat(this.TotalMRP) - parseFloat(ItemDiscAmount) - parseFloat(LandedTotalAmount)).toFixed(2);

    if (parseFloat(this.DiscAmt) > 0 && parseFloat(this.DiscAmt) < parseFloat(this.TotalMRP)) {
      // this.DiscId=1;
      this.ConShow = true;
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();
      if (parseFloat(m_marginamt) <= parseFloat(LandedTotalAmount)) {
        Swal.fire('Discount amount greater than Purchase amount, Please check !');
        this.ItemFormreset();
        this.itemid.nativeElement.focus();
        this.ConShow = false;
        this.ItemSubform.get('ConcessionId').clearValidators();
        this.ItemSubform.get('ConcessionId').updateValueAndValidity();
      } else {
        this.NetAmt = (this.TotalMRP - this._salesService.ItemSearchGroup.get('DiscAmt').value).toFixed(2);
        this.add = true;
        // this.addbutton.focus();
      }
    } else if (parseFloat(this.DiscAmt) > parseFloat(this.NetAmt)) {
      Swal.fire('Check Discount Amount !');
      this.ConShow = false;
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();
    }
    if (parseFloat(this._salesService.ItemSearchGroup.get('DiscAmt').value) == 0) {
      this.add = true;
      this.ConShow = false;
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();
      // this.addbutton.focus();
    }
  }
  convertToWord(e) {
    return converter.toWords(e);
  }
  transform2(value: string) {
    var datePipe = new DatePipe('en-US');
    value = datePipe.transform(new Date(), 'dd/MM/yyyy h:mm a');
    return value;
  }
  transform1(value: string) {
    var datePipe = new DatePipe('en-US');
    value = datePipe.transform(new Date(), 'dd/MM/yyyy');
    return value;
  }

  // PRINT
  print1() {
    let popupWin, printContents;

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
    if (this.reportPrintObjList.length > 0) {
      // if(this.reportPrintObjList[0].BalanceAmt === 0) {
      //   popupWin.document.getElementById('trAmountBalance').style.display = 'none';
      // }
      // if (this.reportPrintObjList[0].ConcessionAmt === 0) {
      //   popupWin.document.getElementById('trAmountconcession').style.display = 'none';
      // }
      // if (this.reportPrintObjList[0].BalanceAmt === 0) {
      //   popupWin.document.getElementById('idBalAmt').style.display = 'none';
      // }
    }
    popupWin.document.close();
  }
  chargeslist1: any = [];

  DeleteDraft() {
    let Query = 'delete T_SalesDraftHeader where DSalesId=' + this.DraftID + '';
    this._salesService.getDelDrat(Query).subscribe((data) => {
      if (data) {
        this.getDraftorderList();
      }
    });
  }

  onSave(event) {
    event.srcElement.setAttribute('disabled', true);
    let patientTypeValue1 = this.ItemSubform.get('PatientType').value;
    if (this.ItemSubform.get('PatientType').value == 'External') {
      if (this.PatientName == '' || this.MobileNo == '' || this.DoctorName == '') {
        this.toastr.warning('Please select Customer Detail', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        event.srcElement.removeAttribute('disabled');
        return;
      }
    }
    if (this.FinalTotalAmt == 0 || this.FinalNetAmount == 0) {
      this.toastr.warning('Please check Sales total Amount', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      event.srcElement.removeAttribute('disabled');
      return;
    }
    let patientTypeValue = this.ItemSubform.get('PatientType').value;
    if ((patientTypeValue == 'OP' || patientTypeValue == 'IP') && (this.RegNo == '' || this.RegNo == null || this.RegNo == undefined)) {
      this.toastr.warning('Please select Patient Type.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      event.srcElement.removeAttribute('disabled');
      return;
    }
    if (this.ItemSubform.get('CashPay').value == 'CashPay' || this.ItemSubform.get('CashPay').value == 'Online') {
      this.onCashOnlinePaySave();
    } else if (this.ItemSubform.get('CashPay').value == 'Credit') {
      this.onCreditpaySave();
    } else if (this.ItemSubform.get('CashPay').value == 'PayOption') {
      this.onSavePayOption();
    }

    this.getDraftorderList();
    event.srcElement.removeAttribute('disabled');
    this.PatientName = '';
    this.DoctorName = '';
    this.ItemSubform.get('FinalDiscPer').enable();
  }
  isLoading123 = false;
  onCashOnlinePaySave() {
    this.isLoading123 = true;
    let nowDate = new Date();
    let nowDate1 = nowDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }).split(',');
    this.newDateTimeObj = { date: nowDate1[0], time: nowDate1[1] };
    // console.log(this.newDateTimeObj);

    let NetAmt = this.ItemSubform.get('FinalNetAmount').value;
    let ConcessionId = 0;
    if (this.ItemSubform.get('ConcessionId').value) ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

    let SalesInsert = {};
    SalesInsert['Date'] = this.newDateTimeObj.date;
    SalesInsert['time'] = this.newDateTimeObj.time;

    if (this.ItemSubform.get('PatientType').value == 'External') {
      SalesInsert['oP_IP_Type'] = 2;
      SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
    } else if (this.ItemSubform.get('PatientType').value == 'OP') {
      SalesInsert['oP_IP_Type'] = 0;
      SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
    } else if (this.ItemSubform.get('PatientType').value == 'IP') {
      SalesInsert['oP_IP_Type'] = 1;
      SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
    }
    SalesInsert['totalAmount'] = this.ItemSubform.get('FinalTotalAmt').value || 0; //this.FinalTotalAmt
    SalesInsert['vatAmount'] = this.ItemSubform.get('FinalGSTAmt').value || 0;
    SalesInsert['discAmount'] = this.ItemSubform.get('FinalDiscAmt').value || 0; //this.FinalDiscAmt;
    SalesInsert['netAmount'] = this.ItemSubform.get('roundoffAmt').value || 0;
    SalesInsert['paidAmount'] = this.ItemSubform.get('roundoffAmt').value; // NetAmt;
    SalesInsert['balanceAmount'] = 0;
    SalesInsert['concessionReasonID'] = ConcessionId || 0;
    SalesInsert['concessionAuthorizationId'] = 0;
    SalesInsert['isSellted'] = 0;
    SalesInsert['isPrint'] = 0;
    SalesInsert['isFree'] = 0;
    SalesInsert['unitID'] = 1;
    (SalesInsert['addedBy'] = this._loggedService.currentUserValue.userId), (SalesInsert['externalPatientName'] = this.PatientName || '');
    SalesInsert['doctorName'] = this.DoctorName || '';
    SalesInsert['storeId'] = this._salesService.ItemSearchGroup.get('StoreId').value.storeid;
    SalesInsert['isPrescription'] = this.IPMedID || 0;
    SalesInsert['creditReason'] = '';
    SalesInsert['creditReasonID'] = 0;
    SalesInsert['wardId'] = 0;
    SalesInsert['bedID'] = 0;
    SalesInsert['discper_H'] = 0;
    SalesInsert['isPurBill'] = 0;
    SalesInsert['isBillCheck'] = 0;
    SalesInsert['salesHeadName'] = '';
    SalesInsert['salesTypeId'] = 0;
    SalesInsert['salesId'] = 0;
    SalesInsert['extMobileNo'] = this.MobileNo || 0;
    SalesInsert['extAddress'] = this.vextAddress || '';

    if (this.ItemSubform.get('FinalDiscPer').value != 0) {
      SalesInsert['IsItem_Header_disc'] = 1; // total amount wise discount
    } else if (this.ItemSubform.get('FinalDiscPer').value == 0) {
      SalesInsert['IsItem_Header_disc'] = 0; // item wise discount amt
    }

    let salesDetailInsertarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      console.log(element);
      let salesDetailInsert = {};
      salesDetailInsert['salesID'] = 0;
      salesDetailInsert['itemId'] = element.ItemId;
      salesDetailInsert['batchNo'] = element.BatchNo;
      salesDetailInsert['batchExpDate'] = element.BatchExpDate; //|| this.datePipe.transform(element.BatchExpDate,"yyyy/MM/dd");
      salesDetailInsert['unitMRP'] = element.UnitMRP;
      salesDetailInsert['qty'] = element.Qty;
      salesDetailInsert['totalAmount'] = element.TotalMRP;
      salesDetailInsert['vatPer'] = element.VatPer;
      salesDetailInsert['vatAmount'] = element.VatAmount;
      salesDetailInsert['discPer'] = element.DiscPer;
      salesDetailInsert['discAmount'] = element.DiscAmt;
      salesDetailInsert['grossAmount'] = element.NetAmt;
      salesDetailInsert['landedPrice'] = element.LandedRate;
      salesDetailInsert['totalLandedAmount'] = element.LandedRateandedTotal;
      salesDetailInsert['purRateWf'] = element.PurchaseRate;
      salesDetailInsert['purTotAmt'] = element.PurTotAmt;
      salesDetailInsert['cgstPer'] = element.CgstPer;
      salesDetailInsert['cgstAmt'] = element.CGSTAmt;
      salesDetailInsert['sgstPer'] = element.SgstPer;
      salesDetailInsert['sgstAmt'] = element.SGSTAmt;
      salesDetailInsert['igstPer'] = element.IgstPer;
      salesDetailInsert['igstAmt'] = element.IGSTAmt;
      salesDetailInsert['isPurRate'] = 0;
      salesDetailInsert['stkID'] = element.StockId;
      salesDetailInsertarr.push(salesDetailInsert);
    });

    let updateCurStkSalestarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let updateCurStkSales = {};
      updateCurStkSales['itemId'] = element.ItemId;
      updateCurStkSales['issueQty'] = element.Qty;
      (updateCurStkSales['storeID'] = this._loggedService.currentUserValue.storeId), (updateCurStkSales['stkID'] = element.StockId);
      updateCurStkSalestarr.push(updateCurStkSales);
    });

    let cal_DiscAmount_Sales = {};
    cal_DiscAmount_Sales['salesID'] = 0;

    let cal_GSTAmount_Sales = {};
    cal_GSTAmount_Sales['salesID'] = 0;

    let salesDraftStatusUpdate = {};
    console.log(this.DraftID);
    salesDraftStatusUpdate['DSalesId'] = this.DraftID || 0;
    salesDraftStatusUpdate['IsClosed'] = 1;

    let PaymentInsertobj = {};

    (PaymentInsertobj['BillNo'] = 0), (PaymentInsertobj['ReceiptNo'] = ''), (PaymentInsertobj['PaymentDate'] = this.newDateTimeObj.date); //  this.dateTimeObj.date;
    PaymentInsertobj['PaymentTime'] = this.newDateTimeObj.time; //  this.dateTimeObj.time;
    PaymentInsertobj['CashPayAmount'] = this.ItemSubform.get('roundoffAmt').value; //NetAmt;
    (PaymentInsertobj['ChequePayAmount'] = 0),
      (PaymentInsertobj['ChequeNo'] = 0),
      (PaymentInsertobj['BankName'] = ''),
      (PaymentInsertobj['ChequeDate'] = '01/01/1900'),
      (PaymentInsertobj['CardPayAmount'] = 0),
      (PaymentInsertobj['CardNo'] = ''),
      (PaymentInsertobj['CardBankName'] = ''),
      (PaymentInsertobj['CardDate'] = '01/01/1900'),
      (PaymentInsertobj['AdvanceUsedAmount'] = 0);
    PaymentInsertobj['AdvanceId'] = 0;
    PaymentInsertobj['RefundId'] = 0;
    PaymentInsertobj['TransactionType'] = 4;
    (PaymentInsertobj['Remark'] = ''), (PaymentInsertobj['AddBy'] = this._loggedService.currentUserValue.userId), (PaymentInsertobj['IsCancelled'] = 0);
    PaymentInsertobj['IsCancelledBy'] = 0;
    (PaymentInsertobj['IsCancelledDate'] = '01/01/1900'), (PaymentInsertobj['OPD_IPD_Type'] = 3);
    (PaymentInsertobj['NEFTPayAmount'] = 0),
      (PaymentInsertobj['NEFTNo'] = ''),
      (PaymentInsertobj['NEFTBankMaster'] = ''),
      (PaymentInsertobj['NEFTDate'] = '01/01/1900'),
      (PaymentInsertobj['PayTMAmount'] = 0),
      (PaymentInsertobj['PayTMTranNo'] = ''),
      (PaymentInsertobj['PayTMDate'] = '01/01/1900');

    let submitData = {
      salesInsert: SalesInsert,
      salesDetailInsert: salesDetailInsertarr,
      updateCurStkSales: updateCurStkSalestarr,
      cal_DiscAmount_Sales: cal_DiscAmount_Sales,
      cal_GSTAmount_Sales: cal_GSTAmount_Sales,
      salesDraftStatusUpdate: salesDraftStatusUpdate,
      salesPayment: PaymentInsertobj,
    };

    console.log(submitData);
    let vMobileNo = this.MobileNo;

    this._salesService.InsertCashSales(submitData).subscribe(
      (response) => {
        if (response) {
          if (response == -1) {
            this.toastr.error('Stock has been updated. few items are out of stock.', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          } else {
            this.toastr.success('Record Saved Successfully.', 'Save !', {
              toastClass: 'tostr-tost custom-toast-success',
            });

            this.getPrint3(response);
            this.getWhatsappshareSales(response, vMobileNo);
            this.Itemchargeslist = [];
            this._matDialog.closeAll();
            this.ItemFormreset();
            this.isLoading123 = false;
            // this.patientDetailsFormGrp.reset();
            this.ItemSubform.reset();
            this.Formreset();
            this.ItemSubform.get('ConcessionId').reset();
            // this.PatientName = '';
            // this.MobileNo = '';
            this.saleSelectedDatasource.data = [];
          }
        } else {
          this.toastr.error('API Error!', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
          this.isLoading123 = false;
        }
      },
      (error) => {
        this.toastr.error('API Error!', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        this.isLoading123 = false;
      }
    );

    // }
  }
  onSavePayOption() {
    this.vPatientType = this.ItemSubform.get('PatientType').value;
    this.isLoading123 = true;
    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['RegNo'] = this.RegNo;
    PatientHeaderObj['PatientName'] = this.PatientName;
    if (this.vPatientType == 'IP') {
      PatientHeaderObj['OPD_IPD_Id'] = this.IPDNo;
    } else {
      PatientHeaderObj['OPD_IPD_Id'] = this.OPDNo;
    }
    PatientHeaderObj['Age'] = this.Age;
    PatientHeaderObj['NetPayAmount'] = this.ItemSubform.get('roundoffAmt').value; //this.ItemSubform.get('FinalNetAmount').value;

    const dialogRef = this._matDialog.open(OpPaymentNewComponent, {
      maxWidth: '80vw',
      height: '650px',
      width: '80%',
      data: {
        vPatientHeaderObj: PatientHeaderObj,
        FromName: 'Phar-SalesPay',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
      // let CurrDate = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
      // let dateobj=this.datePipe.transform( result.submitDataPay.ipPaymentInsert.PaymentDate, 'MM/dd/yyyy')

      // if(CurrDate == dateobj){
      //   if(this.dateTimeObj.date == result.submitDataPay.ipPaymentInsert.PaymentDate)
      // {
      if (result?.IsSubmitFlag == true) {
        let cashpay = result.submitDataPay.ipPaymentInsert.CashPayAmount;
        let chequepay = result.submitDataPay.ipPaymentInsert.ChequePayAmount;
        let cardpay = result.submitDataPay.ipPaymentInsert.CardPayAmount;
        let Neftpay = result.submitDataPay.ipPaymentInsert.NEFTPayAmount;
        let onlinepay = result.submitDataPay.ipPaymentInsert.PayTMAmount;

        if ((cashpay == 0 && chequepay == 0 && cardpay == 0 && Neftpay == 0 && onlinepay == 0) == false) {
          let NetAmt = this.ItemSubform.get('FinalNetAmount').value;
          let ConcessionId = 0;
          if (this.ItemSubform.get('ConcessionId').value) ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

          let nowDate = new Date();
          let nowDate1 = nowDate.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }).split(',');
          this.newDateTimeObj = { date: nowDate1[0], time: nowDate1[1] };

          let SalesInsert = {};
          SalesInsert['Date'] = this.newDateTimeObj.date;
          SalesInsert['time'] = this.newDateTimeObj.time;

          if (this.ItemSubform.get('PatientType').value == 'External') {
            SalesInsert['oP_IP_Type'] = 2;
            SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
          } else if (this.ItemSubform.get('PatientType').value == 'OP') {
            SalesInsert['oP_IP_Type'] = 0;
            SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
          } else if (this.ItemSubform.get('PatientType').value == 'IP') {
            SalesInsert['oP_IP_Type'] = 1;
            SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
          }
          SalesInsert['totalAmount'] = this.ItemSubform.get('FinalTotalAmt').value || 0; //this.FinalTotalAmt
          SalesInsert['vatAmount'] = this.ItemSubform.get('FinalGSTAmt').value || 0;
          SalesInsert['discAmount'] = this.ItemSubform.get('FinalDiscAmt').value || 0; //this.FinalDiscAmt;
          SalesInsert['netAmount'] = this.ItemSubform.get('roundoffAmt').value || 0;
          SalesInsert['paidAmount'] = this.ItemSubform.get('roundoffAmt').value || 0; // NetAmt;
          SalesInsert['balanceAmount'] = 0;
          SalesInsert['concessionReasonID'] = ConcessionId || 0;
          SalesInsert['concessionAuthorizationId'] = 0;
          SalesInsert['isSellted'] = 0;
          SalesInsert['isPrint'] = 0;
          SalesInsert['isFree'] = 0;
          SalesInsert['unitID'] = 1;
          (SalesInsert['addedBy'] = this._loggedService.currentUserValue.userId), (SalesInsert['externalPatientName'] = this.PatientName || '');
          SalesInsert['doctorName'] = this.DoctorName || '';
          SalesInsert['storeId'] = this._salesService.ItemSearchGroup.get('StoreId').value.storeid;
          SalesInsert['isPrescription'] = this.IPMedID || 0;
          SalesInsert['creditReason'] = '';
          SalesInsert['creditReasonID'] = 0;
          SalesInsert['wardId'] = 0;
          SalesInsert['bedID'] = 0;
          SalesInsert['discper_H'] = 0;
          SalesInsert['isPurBill'] = 0;
          SalesInsert['isBillCheck'] = 0;
          SalesInsert['salesHeadName'] = '';
          SalesInsert['salesTypeId'] = 0;
          SalesInsert['salesId'] = 0;
          SalesInsert['extMobileNo'] = this.MobileNo || 0;
          SalesInsert['extAddress'] = this.vextAddress || '';
          if (this.ItemSubform.get('FinalDiscPer').value != 0) {
            SalesInsert['IsItem_Header_disc'] = 1; // total amount wise discount
          } else if (this.ItemSubform.get('FinalDiscPer').value == 0) {
            SalesInsert['IsItem_Header_disc'] = 0; // item wise discount amt
          }

          let salesDetailInsertarr = [];
          this.saleSelectedDatasource.data.forEach((element) => {
            // console.log(element);
            let salesDetailInsert = {};
            salesDetailInsert['salesID'] = 0;
            salesDetailInsert['itemId'] = element.ItemId;
            salesDetailInsert['batchNo'] = element.BatchNo;
            salesDetailInsert['batchExpDate'] = element.BatchExpDate; // this.datePipe.transform(element.BatchExpDate,"yyyy/mm/dd");//element.BatchExpDate;
            salesDetailInsert['unitMRP'] = element.UnitMRP;
            salesDetailInsert['qty'] = element.Qty;
            salesDetailInsert['totalAmount'] = element.TotalMRP;
            salesDetailInsert['vatPer'] = element.VatPer;
            salesDetailInsert['vatAmount'] = element.VatAmount;
            salesDetailInsert['discPer'] = element.DiscPer;
            salesDetailInsert['discAmount'] = element.DiscAmt;
            salesDetailInsert['grossAmount'] = element.NetAmt;
            salesDetailInsert['landedPrice'] = element.LandedRate;
            salesDetailInsert['totalLandedAmount'] = element.LandedRateandedTotal;
            salesDetailInsert['purRateWf'] = element.PurchaseRate;
            salesDetailInsert['purTotAmt'] = element.PurTotAmt;
            salesDetailInsert['cgstPer'] = element.CgstPer;
            salesDetailInsert['cgstAmt'] = element.CGSTAmt;
            salesDetailInsert['sgstPer'] = element.SgstPer;
            salesDetailInsert['sgstAmt'] = element.SGSTAmt;
            salesDetailInsert['igstPer'] = element.IgstPer;
            salesDetailInsert['igstAmt'] = element.IGSTAmt;
            salesDetailInsert['isPurRate'] = 0;
            salesDetailInsert['stkID'] = element.StockId;
            salesDetailInsertarr.push(salesDetailInsert);
          });
          let updateCurStkSalestarr = [];
          this.saleSelectedDatasource.data.forEach((element) => {
            let updateCurStkSales = {};
            updateCurStkSales['itemId'] = element.ItemId;
            updateCurStkSales['issueQty'] = element.Qty;
            (updateCurStkSales['storeID'] = this._loggedService.currentUserValue.storeId), (updateCurStkSales['stkID'] = element.StockId);
            updateCurStkSalestarr.push(updateCurStkSales);
          });

          let cal_DiscAmount_Sales = {};
          cal_DiscAmount_Sales['salesID'] = 0;

          let cal_GSTAmount_Sales = {};
          cal_GSTAmount_Sales['salesID'] = 0;

          let salesDraftStatusUpdate = {};
          salesDraftStatusUpdate['DSalesId'] = this.DraftID || 0;
          salesDraftStatusUpdate['IsClosed'] = 1;

          let submitData = {
            salesInsert: SalesInsert,
            salesDetailInsert: salesDetailInsertarr,
            updateCurStkSales: updateCurStkSalestarr,
            cal_DiscAmount_Sales: cal_DiscAmount_Sales,
            cal_GSTAmount_Sales: cal_GSTAmount_Sales,
            salesDraftStatusUpdate: salesDraftStatusUpdate,
            salesPayment: result.submitDataPay.ipPaymentInsert,
          };

          let vMobileNo = this.MobileNo;
          console.log(submitData);
          this._salesService.InsertCashSales(submitData).subscribe(
            (response) => {
              if (response) {
                if (response == -1) {
                  this.toastr.error('Stock has been updated. few items are out of stock.', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                  });
                } else {
                  this.toastr.success('Record Saved Successfully.', 'Save !', {
                    toastClass: 'tostr-tost custom-toast-success',
                  });
                  this.getPrint3(response);
                  this.getWhatsappshareSales(response, vMobileNo);
                  this.Itemchargeslist = [];
                  this._matDialog.closeAll();
                  this.ItemFormreset();
                  this.Formreset();
                  this.isLoading123 = false;
                }
              } else {
                this.toastr.error('API Error!', 'Error !', {
                  toastClass: 'tostr-tost custom-toast-error',
                });
              }

              // });
            },
            (error) => {
              this.toastr.error('API Error!', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
              });
              this.isLoading123 = false;
            }
          );

          this.ItemFormreset();
          this.patientDetailsFormGrp.reset();
          this.Formreset();
          this.ItemSubform.get('ConcessionId').reset();
          this.saleSelectedDatasource.data = [];
        } else {
          this.toastr.warning('Please check Payment Mode and Amount (Now it is Selected Zero).', 'Save !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
        }
        this.isLoading123 = false;
      }
      this.isLoading123 = false;
    });
  }
  onCreditpaySave() {
    this.isLoading123 = true;
    // if (this._salesService.ItemSearchGroup.get('PatientType').value == "External" && this.PatientName  != null && this.MobileNo != null) {
    let NetAmt = this.ItemSubform.get('FinalNetAmount').value;
    let ConcessionId = 0;
    if (this.ItemSubform.get('ConcessionId').value) ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

    let salesInsertCredit = {};
    salesInsertCredit['Date'] = this.dateTimeObj.date;
    salesInsertCredit['time'] = this.dateTimeObj.time;
    if (this.ItemSubform.get('PatientType').value == 'External') {
      salesInsertCredit['oP_IP_Type'] = 2;
      salesInsertCredit['oP_IP_ID'] = this.OP_IP_Id;
    } else if (this.ItemSubform.get('PatientType').value == 'OP') {
      salesInsertCredit['oP_IP_Type'] = 0;
      salesInsertCredit['oP_IP_ID'] = this.OP_IP_Id;
    } else if (this.ItemSubform.get('PatientType').value == 'IP') {
      salesInsertCredit['oP_IP_Type'] = 1;
      salesInsertCredit['oP_IP_ID'] = this.OP_IP_Id;
    }

    salesInsertCredit['totalAmount'] = this.ItemSubform.get('FinalTotalAmt').value || 0; //this.FinalTotalAmt
    salesInsertCredit['vatAmount'] = this.ItemSubform.get('FinalGSTAmt').value || 0;
    salesInsertCredit['discAmount'] = this.ItemSubform.get('FinalDiscAmt').value || 0; //this.FinalDiscAmt;
    salesInsertCredit['netAmount'] = this.ItemSubform.get('roundoffAmt').value || 0;
    salesInsertCredit['paidAmount'] = 0;
    salesInsertCredit['balanceAmount'] = NetAmt;
    salesInsertCredit['concessionReasonID'] = ConcessionId || 0;
    salesInsertCredit['concessionAuthorizationId'] = 0;
    salesInsertCredit['isSellted'] = 0;
    salesInsertCredit['isPrint'] = 0;
    salesInsertCredit['isFree'] = 0;
    salesInsertCredit['unitID'] = 1;
    (salesInsertCredit['addedBy'] = this._loggedService.currentUserValue.userId), (salesInsertCredit['externalPatientName'] = this.PatientName);
    salesInsertCredit['doctorName'] = '';
    (salesInsertCredit['storeId'] = this._loggedService.currentUserValue.storeId), (salesInsertCredit['isPrescription'] = this.IPMedID || 0);
    salesInsertCredit['creditReason'] = '';
    salesInsertCredit['creditReasonID'] = 0;
    salesInsertCredit['wardId'] = 0;
    salesInsertCredit['bedID'] = 0;
    salesInsertCredit['discper_H'] = 0;
    salesInsertCredit['isPurBill'] = 0;
    salesInsertCredit['isBillCheck'] = 0;
    salesInsertCredit['salesHeadName'] = '';
    salesInsertCredit['salesTypeId'] = 0;
    salesInsertCredit['salesId'] = 0;
    salesInsertCredit['extMobileNo'] = this.MobileNo || 0;
    salesInsertCredit['extAddress'] = this.vextAddress || '';
    if (this.ItemSubform.get('FinalDiscPer').value != 0) {
      salesInsertCredit['isItem_Header_disc'] = 1; // total wise discount amt
    } else if (this.ItemSubform.get('FinalDiscPer').value == 0) {
      salesInsertCredit['isItem_Header_disc'] = 0; // item amount wise discount
    }

    let salesDetailInsertCreditarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let salesDetailInsertCredit = {};
      salesDetailInsertCredit['salesID'] = 0;
      salesDetailInsertCredit['itemId'] = element.ItemId;
      salesDetailInsertCredit['batchNo'] = element.BatchNo;
      salesDetailInsertCredit['batchExpDate'] = element.BatchExpDate; //this.datePipe.transform(element.BatchExpDate,"yyyy/mm/dd");// element.BatchExpDate;
      salesDetailInsertCredit['unitMRP'] = element.UnitMRP;
      salesDetailInsertCredit['qty'] = element.Qty;
      salesDetailInsertCredit['totalAmount'] = element.TotalMRP;
      salesDetailInsertCredit['vatPer'] = element.VatPer;
      salesDetailInsertCredit['vatAmount'] = element.VatAmount;
      salesDetailInsertCredit['discPer'] = element.DiscPer;
      salesDetailInsertCredit['discAmount'] = element.DiscAmt;
      salesDetailInsertCredit['grossAmount'] = element.NetAmt;
      salesDetailInsertCredit['landedPrice'] = element.LandedRate;
      salesDetailInsertCredit['totalLandedAmount'] = element.LandedRateandedTotal;
      salesDetailInsertCredit['purRateWf'] = element.PurchaseRate;
      salesDetailInsertCredit['purTotAmt'] = element.PurTotAmt;
      salesDetailInsertCredit['cgstPer'] = element.CgstPer;
      salesDetailInsertCredit['cgstAmt'] = element.CGSTAmt;
      salesDetailInsertCredit['sgstPer'] = element.SgstPer;
      salesDetailInsertCredit['sgstAmt'] = element.SGSTAmt;
      salesDetailInsertCredit['igstPer'] = element.IgstPer;
      salesDetailInsertCredit['igstAmt'] = element.IGSTAmt;
      salesDetailInsertCredit['isPurRate'] = 0;
      salesDetailInsertCredit['stkID'] = element.StockId;
      salesDetailInsertCreditarr.push(salesDetailInsertCredit);
    });

    let updateCurStkSalesCreditarray = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let updateCurStkSalesCredit = {};
      updateCurStkSalesCredit['itemId'] = element.ItemId;
      updateCurStkSalesCredit['issueQty'] = element.Qty;
      (updateCurStkSalesCredit['storeID'] = this._loggedService.currentUserValue.storeId), (updateCurStkSalesCredit['stkID'] = element.StockId);

      updateCurStkSalesCreditarray.push(updateCurStkSalesCredit);
    });

    let cal_DiscAmount_SalesCredit = {};
    cal_DiscAmount_SalesCredit['salesID'] = 0;

    let cal_GSTAmount_SalesCredit = {};
    cal_GSTAmount_SalesCredit['salesID'] = 0;

    // console.log("Procced with Payment Option");

    let submitData = {
      salesInsertCredit: salesInsertCredit,
      salesDetailInsertCredit: salesDetailInsertCreditarr,
      updateCurStkSalesCredit: updateCurStkSalesCreditarray,
      cal_DiscAmount_SalesCredit: cal_DiscAmount_SalesCredit,
      cal_GSTAmount_SalesCredit: cal_GSTAmount_SalesCredit,
    };
    console.log(submitData);
    let vMobileNo = this.mobileno;
    this._salesService.InsertCreditSales(submitData).subscribe(
      (response) => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Credit Save !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.getPrint3(response);
          this.getWhatsappshareSales(response, vMobileNo);
          this.Itemchargeslist = [];
          this._matDialog.closeAll();
          this.isLoading123 = false;
        } else {
          this.toastr.error('API Error!', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
          this.isLoading123 = false;
        }
      },
      (error) => {
        this.toastr.error('API Error!', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        this.isLoading123 = false;
      }
    );

    this.ItemFormreset();
    this.Formreset();
    this.ItemSubform.get('ConcessionId').reset();
    this.getConcessionReasonList();
    //this.PatientName = '';
    // this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
    this.saleSelectedDatasource.data = [];
  }

  getPrint3(el) {
    if (this.vPaymode == 'Credit') {
      this.type = 'Credit';
      this.Creditflag = true;
    } else if (!(this.vPaymode == 'Credit')) {
      this.type = ' ';
      this.Creditflag = false;
    }

    var D_data = {
      SalesID: el, //
      OP_IP_Type: this.OP_IPType,
    };
    let printContents;
    this.subscriptionArr.push(
      this._salesService.getSalesPrint(D_data).subscribe((res) => {
        this.reportPrintObjList = res as Printsal[];
        this.reportPrintObj = res[0] as Printsal;
        setTimeout(() => {
          this.print3();
        }, 1000);
      })
    );
  }

  getWhatsappshareSales(el, vmono) {
    var m_data = {
      insertWhatsappsmsInfo: {
        mobileNumber: vmono || 0,
        smsString:
          'Dear' +
            vmono +
            ',Your Sales Bill has been successfully completed. UHID is ' +
            el +
            ' For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur ' || '',
        isSent: 0,
        smsType: 'Sales',
        smsFlag: 0,
        smsDate: this.currentDate,
        tranNo: el,
        PatientType: 2, //el.PatientType,
        templateId: 0,
        smSurl: 'info@gmail.com',
        filePath: this.Filepath || '',
        smsOutGoingID: 0,
      },
    };
    this._BrowsSalesBillService.InsertWhatsappSales(m_data).subscribe((response) => {
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
    this.IsLoading = false;
  }

  print3() {
    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

    popupWin.document.write(` <html>
  <head><style type="text/css">`);
    popupWin.document.write(`
    </style>
    <style type="text/css" media="print">
  @page { size: portrait; }
</style>
        <title></title>
    </head>
  `);
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.billTemplate2.nativeElement.innerHTML}</body>
  <script>
    var css = '@page { size: portrait; }',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');
    style.type = 'text/css';
    style.media = 'print';

    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);
  </script>
  </html>`);
    // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
    // </html>`);

    popupWin.document.close();
  }

 

  // getCellCalculation(contact, Qty) {
  //   //
  //   let Qtyfinal = this.Qty;
  //   console.log(contact);
  //   this.StockId = contact.StockId;
  //   this.Qty = Qty;
  //   if (contact.Qty != 0 && contact.Qty != null) {
  //     // console.log(contact.Qty);
  //     this.BalChkList = [];
  //     this.StoreId = this._loggedService.currentUserValue.storeId;

  //     // let SelectQuery = "select isnull(BalanceQty,0) as BalanceQty from lvwCurrentBalQtyCheck where StoreId = " + this.StoreId + " AND ItemId = " + contact.ItemId + " AND  BatchNo='" + contact.BatchNo + "' AND  StockId=" + contact.StockId + ""
  //     let SelectQuery = 'select isnull(BalanceQty,0) as BalanceQty from lvwCurrentBalQtyCheck where StoreId = ' + this.StoreId + ' AND ItemId = ' + contact.ItemId + '';

  //     console.log(SelectQuery);
  //     this._salesService.getchargesList(SelectQuery).subscribe(
  //       (data) => {
  //         this.BalChkList = data;
  //         console.log(this.BalChkList);

  //         // if (this.BalChkList.length > 0) {

  //         //   if (this.BalChkList[0].BalanceQty >= contact.Qty) {
  //         //     this.QtyBalchk = 1;

  //         //     this.tblCalucation(contact,contact.Qty)
  //         //   }
  //         //   else {
  //         //     this.QtyBalchk = 1;
  //         //     Swal.fire("Please Enter Qty Less than Balance Qty :" + contact.ItemName + " . Available Balance Qty :" + this.BalChkList[0].BalanceQty)
  //         //     contact.Qty = parseInt(this.BalChkList[0].BalanceQty);
  //         //     contact.Qty=this.Qty;
  //         //     this.tblCalucation(contact,contact.Qty)
  //         //   }
  //         // }

  //         //
  //         if (this.BalChkList.length > 0) {
  //           let AllQty = 0;
  //           this.BalChkList.forEach((element) => {
  //             AllQty += element.BalanceQty;
  //             console.log(AllQty);
  //           });

  //           if (AllQty >= contact.Qty) {
  //             this.QtyBalchk = 1;

  //             this.tblCalucation(contact, contact.Qty);
  //             this.getDiscountCellCal(contact, contact.DiscPer);
  //           } else {
  //             // this.QtyBalchk = 1;
  //             Swal.fire('Please Enter Qty Less than Balance Qty :' + contact.ItemName + ' . Available Balance Qty :' + this.BalChkList[0].BalanceQty);
  //             //     contact.Qty = parseInt(this.BalChkList[0].BalanceQty);
  //             //     contact.Qty=this.Qty;
  //             //     this.tblCalucation(contact,contact.Qty)
  //             contact.Qty = 1;
  //           }
  //         }
  //       },
  //       (error) => {
  //         Swal.fire('No Item Found!!');
  //       }
  //     );
  //   } else {
  //     Swal.fire('Please enter Qty!!');

  //     contact.GSTAmount = 0;
  //     contact.TotalMRP = 0;
  //     (contact.DiscAmt = 0), (contact.NetAmt = 0);
  //     contact.RoundNetAmt = 0;
  //     (contact.StockId = this.StockId), (contact.VatAmount = 0);
  //     contact.LandedRateandedTotal = 0;
  //     contact.CGSTAmt = 0;
  //     contact.SGSTAmt = 0;
  //     contact.IGSTAmt = 0;
  //     (contact.PurchaseRate = this.PurchaseRate), (contact.PurTotAmt = this.PurTotAmt), (contact.MarginAmt = 0);
  //   }

  //   // this.DiscOld=contact.DiscPer;
  //   this.ItemFormreset();
  // }

  tblCalucation(contact, Qty) {
    let TotalMRP;
    this.RQty = parseInt(contact.Qty) || 1;
    if (this.RQty && contact.UnitMRP) {
      TotalMRP = (parseInt(this.RQty) * contact.UnitMRP).toFixed(2);
      let LandedRateandedTotal = (parseInt(this.RQty) * contact.LandedRate).toFixed(2);
      let v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
      //
      this.PurTotAmt = (parseInt(this.RQty) * contact.PurchaseRate).toFixed(2);
      let NetAmt;
      let DiscAmt;
      this.GSTAmount = (((contact.UnitMRP * contact.VatPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.CGSTAmt = (((contact.UnitMRP * contact.CgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.SGSTAmt = (((contact.UnitMRP * contact.SgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.IGSTAmt = (((contact.UnitMRP * contact.IgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
      NetAmt = (parseFloat(TotalMRP) - parseFloat(contact.DiscAmt)).toFixed(2);

      if (contact.DiscPer > 0) {
        DiscAmt = ((TotalMRP * contact.DiscPer) / 100).toFixed(2);
        NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);
      }

      contact.GSTAmount = (((contact.UnitMRP * contact.VatPer) / 100) * parseInt(this.RQty)).toFixed(2) || 0;
      contact.TotalMRP = (parseInt(this.RQty) * contact.UnitMRP).toFixed(2); //this.TotalMRP || 0,
      (contact.DiscAmt = DiscAmt || 0),
        (contact.NetAmt = NetAmt), // (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2); //this.NetAmt,
        (contact.RoundNetAmt = Math.round(NetAmt)),
        (contact.StockId = this.StockId),
        (contact.VatAmount = 0), // this.GSTAmount || 0,
        (contact.LandedRateandedTotal = LandedRateandedTotal),
        (contact.CGSTAmt = contact.CGSTAmt || 0),
        (contact.SGSTAmt = contact.SGSTAmt || 0),
        (contact.IGSTAmt = contact.IGSTAmt || 0),
        (contact.PurchaseRate = contact.PurchaseRate || 0),
        (contact.PurTotAmt = 0), //this.PurTotAmt || 0,
        (contact.MarginAmt = v_marginamt || 0);
    }
    this.ItemFormreset();
  }

  OnEnableDraftAdd() {
    if (this.drafttable == false) {
      this.drafttable = true;
      this.saleSelectedDatasource.data = [];
    } else {
      this.drafttable = false;
    }
  }

  getDraftorderList() {
    this.chargeslist1 = [];
    this.dsDraftList.data = [];
    let currentDate = new Date();
    var m = {
      FromDate: this.datePipe.transform(currentDate, 'MM/dd/yyyy') || '01/01/1900',
      ToDate: this.datePipe.transform(currentDate, 'MM/dd/yyyy') || '01/01/1900',
    };
    this._salesService.getDraftList(m).subscribe(
      (data) => {
        this.chargeslist1 = data as ChargesList[];
        this.dsDraftList.data = this.chargeslist1;
      },
      (error) => {}
    );
  }

  m_getBalAvaListStore(Param) {
    this.dsDraftList.data = [];
    var m = {
      ItemId: Param,
    };
    this._salesService.getBalAvaListStore(m).subscribe(
      (data) => {
        this.dsBalAvaListStore.data = data as BalAvaListStore[];
      },
      (error) => {}
    );
  }

  onAddRepeat(contact) {
    this.tempDatasource.data = [];
    this.saleSelectedDatasource.data = [];
    this.Itemchargeslist1 = [];
    this.Itemchargeslist = [];
    let strSql = 'Select ItemId,Qty from m_vSalesListforRepeat where SalesId=' + contact.value[0].vSalesId + ' Order by ItemId ';
    this._salesService.getchargesList(strSql).subscribe((data) => {
      this.tempDatasource.data = data as any;
      // console.log(this.tempDatasource.data);
      if (this.tempDatasource.data.length >= 1) {
        this.tempDatasource.data.forEach((element) => {
          this.DraftQty = element.Qty;
          this.onAddDraftListTosale(element, this.DraftQty);
        });
      }
    });
  }
  onAddDraftList(contact) {
    // console.log(contact)
    this.PatientName = contact.PatientName;
    this.MobileNo = contact.ExtMobileNo;
    this.vextAddress = contact.extAddress;
    this.DoctorName = contact.AdmDoctorName;
    this.DraftID = contact.DSalesId;
    this.saleSelectedDatasource.data = [];
    this.Itemchargeslist1 = [];
    this.Itemchargeslist = [];

    let strSql = 'Select ItemId,QtyPerDay,BalQty,IsBatchRequired from Get_SalesDraftBillItemDet where DSalesId=' + contact.DSalesId + ' Order by ItemId ';
    this._salesService.getchargesList(strSql).subscribe((data) => {
      this.tempDatasource.data = data as any;
      // console.log(this.tempDatasource.data);
      if (this.tempDatasource.data.length >= 1) {
        this.tempDatasource.data.forEach((element) => {
          this.DraftQty = element.QtyPerDay;
          this.onAddDraftListTosale(element, this.DraftQty);
        });
      }
    });
  }

  onAddDraftListTosale(contact, DraftQty) {
    // console.log(contact)
    this.Itemchargeslist1 = [];
    this.QtyBalchk = 0;

    var m_data = {
      ItemId: contact.ItemId,
      StoreId: this._loggedService.currentUserValue.storeId || 0,
    };
    this._salesService.getDraftBillItem(m_data).subscribe((draftdata) => {
      console.log(draftdata);
      this.Itemchargeslist1 = draftdata as any;
      if (this.Itemchargeslist1.length == 0) {
        Swal.fire(contact.ItemId + ' : ' + 'Item Stock is Not Avilable:');
      } else if (this.Itemchargeslist1.length > 0) {
        let ItemID;
        this.Itemchargeslist1.forEach((element) => {
          // console.log(element)
          if (ItemID != element.ItemId) {
            this.QtyBalchk = 0;
          }
          if (this.QtyBalchk != 1) {
            if (DraftQty <= element.BalanceQty) {
              this.QtyBalchk = 1;
              this.getFinalCalculation(element, DraftQty);
              ItemID = element.ItemId;
            } else {
              Swal.fire('Balance Qty is :', element.BalanceQty);
              this.QtyBalchk = 0;
              Swal.fire('Balance Qty is Less than Selected Item Qty for Item :' + element.ItemId + 'Balance Qty:', element.BalanceQty);
            }
          }
        });
      }
    });
 
  }

  getFinalCalculation(contact, DraftQty) {
    console.log(contact);
    // if (parseInt(contact.BalanceQty) > parseInt(this.)) {

    this.RQty = parseInt(DraftQty);
    if (this.RQty && contact.UnitMRP) {
      this.TotalMRP = (parseInt(this.RQty) * contact.UnitMRP).toFixed(2);
      this.LandedRateandedTotal = (parseInt(this.RQty) * contact.LandedRate).toFixed(2);
      this.PurTotAmt = (parseInt(this.RQty) * contact.PurchaseRate).toFixed(2);

      this.v_marginamt = (parseFloat(this.TotalMRP) - parseFloat(this.LandedRateandedTotal)).toFixed(2);

      this.GSTAmount = (((contact.UnitMRP * contact.VatPercentage) / 100) * parseInt(this.RQty)).toFixed(2);
      this.CGSTAmt = (((contact.UnitMRP * contact.CGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.SGSTAmt = (((contact.UnitMRP * contact.SGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.IGSTAmt = (((contact.UnitMRP * contact.IGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);

      this.NetAmt = (parseFloat(this.TotalMRP) - 0).toFixed(2);

      if (contact.DiscPer > 0) {
        this.DiscAmt = ((this.TotalMRP * contact.DiscPer) / 100).toFixed(2);
        this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);
      }

      // if (this.ItemName && (parseInt(contact.Qty) != 0) && this.MRP > 0 && this.NetAmt > 0) {
      // this.saleSelectedDatasource.data = [];

      this.Itemchargeslist.push({
        ItemId: contact.ItemId,
        ItemName: contact.ItemName,
        BatchNo: contact.BatchNo,
        BatchExpDate: this.datePipe.transform(contact.BatchExpDate, 'yyyy-MM-dd'),
        Qty: DraftQty,
        UnitMRP: contact.UnitMRP,
        GSTPer: contact.VatPercentage || 0,
        GSTAmount: this.GSTAmount || 0,
        TotalMRP: this.TotalMRP,
        DiscPer: contact.DiscPer || 0,
        DiscAmt: this.DiscAmt || 0,
        NetAmt: this.NetAmt || 0,
        RoundNetAmt: Math.round(this.NetAmt),
        StockId: contact.StockId,
        VatPer: contact.VatPer,
        VatAmount: this.GSTAmount,
        LandedRate: contact.LandedRate,
        LandedRateandedTotal: this.LandedRateandedTotal,
        CgstPer: contact.CgstPer,
        CGSTAmt: this.CGSTAmt,
        SgstPer: contact.SgstPer,
        SGSTAmt: this.SGSTAmt,
        IgstPer: contact.IgstPer,
        IGSTAmt: this.IGSTAmt,
        PurchaseRate: contact.PurchaseRate,
        PurTotAmt: this.PurTotAmt,
        MarginAmt: this.v_marginamt,
        BalanceQty: contact.BalQty,
        SalesDraftId: 0,
      });
      this.sIsLoading = '';

      this.saleSelectedDatasource.data = this.Itemchargeslist;
      this.ItemFormreset();
    }

    // this.Itemchargeslist=[];
  }
 
  onSaveDraftBill() {
    let NetAmt = this.ItemSubform.get('FinalNetAmount').value;
    let ConcessionId = 0;
    if (this.ItemSubform.get('ConcessionId').value) ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

    let SalesInsert = {};
    SalesInsert['Date'] = this.dateTimeObj.date;
    SalesInsert['time'] = this.dateTimeObj.time;

    if (this.ItemSubform.get('PatientType').value == 'External') {
      SalesInsert['oP_IP_Type'] = 2;
      SalesInsert['oP_IP_ID'] = 0;
    } else if (this.ItemSubform.get('PatientType').value == 'OP') {
      SalesInsert['oP_IP_Type'] = 0;
      SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
    } else if (this.ItemSubform.get('PatientType').value == 'IP') {
      SalesInsert['oP_IP_Type'] = 1;
      SalesInsert['oP_IP_ID'] = this.OP_IP_Id;
    }
    SalesInsert['totalAmount'] = this.FinalTotalAmt;
    SalesInsert['vatAmount'] = this.FinalGSTAmt || 0; //this.ItemSubform.get('FinalGSTAmt').value;
    SalesInsert['discAmount'] = this.FinalDiscAmt;
    SalesInsert['netAmount'] = NetAmt;
    SalesInsert['paidAmount'] = NetAmt;
    SalesInsert['balanceAmount'] = 0;
    SalesInsert['concessionReasonID'] = ConcessionId || 0;
    SalesInsert['concessionAuthorizationId'] = 0;
    SalesInsert['isSellted'] = 0;
    SalesInsert['isPrint'] = 0;
    SalesInsert['unitID'] = 1;
    (SalesInsert['addedBy'] = this._loggedService.currentUserValue.userId), (SalesInsert['externalPatientName'] = this.PatientName || '');
    SalesInsert['doctorName'] = this.DoctorName || '';
    SalesInsert['storeId'] = this._salesService.ItemSearchGroup.get('StoreId').value.storeid;
    SalesInsert['isPrescription'] = this.IPMedID || 0;
    SalesInsert['creditReason'] = '';
    SalesInsert['creditReasonID'] = 0;
    SalesInsert['wardId'] = 0;
    SalesInsert['bedId'] = 0;
    SalesInsert['extMobileNo'] = this.MobileNo;
    SalesInsert['extAddress'] = this.vextAddress;

    SalesInsert['DsalesId'] = 0;

    let salesDetailInsertarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let salesDetailInsert = {};
      salesDetailInsert['DsalesID'] = 0;
      salesDetailInsert['itemId'] = element.ItemId;
      salesDetailInsert['batchNo'] = element.BatchNo;
      salesDetailInsert['batchExpDate'] = element.BatchExpDate;
      salesDetailInsert['unitMRP'] = element.UnitMRP;
      salesDetailInsert['qty'] = element.Qty;
      salesDetailInsert['totalAmount'] = element.TotalMRP;
      salesDetailInsert['vatPer'] = element.VatPer;
      salesDetailInsert['vatAmount'] = element.VatAmount;
      salesDetailInsert['discPer'] = element.DiscPer;
      salesDetailInsert['discAmount'] = element.DiscAmt;
      salesDetailInsert['grossAmount'] = element.NetAmt;
      salesDetailInsert['landedPrice'] = element.LandedRate;
      salesDetailInsert['totalLandedAmount'] = element.LandedRateandedTotal;
      salesDetailInsert['purRateWf'] = element.PurchaseRate;
      salesDetailInsert['purTotAmt'] = element.PurTotAmt;

      salesDetailInsertarr.push(salesDetailInsert);
    });

    let submitData = {
      salesDraftbillInsert: SalesInsert,
      salesDraftbillDetailInsert: salesDetailInsertarr,
    };
    // console.log(submitData);
    this._salesService.InsertSalesDraftBill(submitData).subscribe(
      (response) => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Save !', {
            toastClass: 'tostr-tost custom-toast-success',
          });

          this.Itemchargeslist = [];
          this._matDialog.closeAll();

          //  this.onAddDraftList(response);
          this.getDraftorderList();
        } else {
          this.toastr.error('API Error!', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
        this.sIsLoading = '';
      },
      (error) => {
        // this.snackBarService.showErrorSnackBar('Sales data not saved !, Please check API error..', 'Error !');
        this.toastr.error('API Error!', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    );

    this.ItemFormreset();
    this.patientDetailsFormGrp.reset();
    this.Formreset();
    this.ItemSubform.get('ConcessionId').reset();
    this.PatientName = '';
    this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
  }
  
  public onEnterpatientname(event): void {
    if (event.which === 13) {
      // this.itemid.nativeElement.focus();
      this.doctorname.nativeElement.focus();
    }
  }
  public onEntermobileno(event): void {
    if (this.ItemSubform.get('MobileNo').value && this.ItemSubform.get('MobileNo').value.length == 10) {
      this.getTopSalesDetailsList(this.MobileNo);
      this.patientname.nativeElement.focus();
    }
  }

  public onEnterDoctorname(event): void {
    if (event.which === 13) {
      this.address.nativeElement.focus();
    }
  }
  public onEnterAddress(event): void {
    if (event.which === 13) {
      this.itemid.nativeElement.focus();
    }
  }

  public onF6Reset(event): void {
    if (event.which === 117) {
      this.onClose();
    }
  }

  getPrint(el) {
    var D_data = {
      SalesID: el,
      OP_IP_Type: 2,
    };
    let printContents;
    this.subscriptionArr.push(
      this._salesService.getSalesPrint(D_data).subscribe((res) => {
        this.reportPrintObjList = res as Printsal[];
        // console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as Printsal;

        if (this.reportPrintObj.ChequePayAmount != 0) {
          this.UTRNO = this.reportPrintObj.ChequeNo;
        } else if (this.reportPrintObj.CardPayAmount != 0) {
          this.UTRNO = this.UTRNO + ',' + this.reportPrintObj.ChequeNo;
        } else if (this.reportPrintObj.NEFTPayAmount != 0) {
          this.UTRNO = this.UTRNO + ',' + this.reportPrintObj.NEFTNo;
        } else if (this.reportPrintObj.PayTMAmount != 0) {
          this.UTRNO = this.UTRNO + ',' + this.reportPrintObj.PayTMTranNo;
        }
      })
    );
  }

  print() {
    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

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
    this.Itemchargeslist = [];
    this.ItemFormreset();
    // this.patientDetailsFormGrp.reset();
    this.ItemSubform.reset();
    this.Formreset();
    this.ItemSubform.get('ConcessionId').reset();
    this.PatientName = '';
    this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
  }

  getOptionTextReg(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
  } 

  PatientInformRest() {
    this.PatientName = '';
    this.IPDNo = '';
    this.RegNo = '';
    this.DoctorName = '';
    this.TariffName = '';
    this.CompanyName = '';
    this.OPDNo = '';
  }
  CalPaidbackAmt() {
    this.v_PaidbacktoPatient = (parseFloat(this.roundoffAmt) - parseFloat(this.v_PaidbyPatient)).toFixed(2);
  }

  payOnline() {
    const matDialog = this._matDialog.open(PaymentModeComponent, {
      data: { finalAmount: this.FinalNetAmount },
      // height: '380px',
      disableClose: true,
      panelClass: 'payment-dialog',
      // panelClass: ['animate__animated','animate__slideInRight']
    });
    matDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.isPaymentSuccess = true;
        this.ItemSubform.get('referanceNo').setValue(this.onlinePaymentService.PlutusTransactionReferenceID);
      }
    });
  }

  chkbarcode(event) {
    if (event.checked == true) {
      this.barcodeflag = true;
    } else {
      this.barcodeflag = false;
    }
  }

  barcodeItemfetch() {
    var d = {
      StockId: this._salesService.ItemSearchGroup.get('Barcode').value || 0,
      StoreId: this._loggedService.currentUserValue.storeId || 0,
    };
    this._salesService.getCurrentStockItem(d).subscribe((data) => {
      this.tempDatasource.data = data as any;
      if (this.tempDatasource.data.length >= 1) {
        this.tempDatasource.data.forEach((element) => {
          this.DraftQty = 0;
          this.onAddBarcodeItemList(element, element.IssueQty);
        });
      } else if (this.tempDatasource.data.length == 0) {
        this.toastr.error('Item Not Found !', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    });
    this.vBarcode = '';
    this.Addflag = false;
  }

  onAddBarcodeItemList(contact, DraftQty) {
    console.log(contact);
    //
    this.vBarcodeflag = true;
    let i = 0;

    if (this.saleSelectedDatasource.data.length > 0) {
      this.chargeslistBarcode = this.saleSelectedDatasource.data;

      this.saleSelectedDatasource.data.forEach((element) => {
        if (element.ItemId == contact.ItemId) {
          this.Itemflag = true;
          this.toastr.warning('Selected Item already added in the list', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          //

          if (contact.IssueQty != null) {
            this.DraftQty = element.Qty + contact.IssueQty;
            if (this.DraftQty > contact.BalanceQty) {
              Swal.fire('Enter Qty less than Balance :', contact.BalanceQty);
              element.Qty = this.DraftQty - contact.IssueQty;
              this.ItemFormreset();
            }
          } else {
            this.DraftQty = element.Qty + 1;
            if (this.DraftQty > contact.BalanceQty) {
              Swal.fire('Enter Qty less than Balance :', contact.BalanceQty);
              element.Qty = this.DraftQty - 1;
              this.ItemFormreset();
            }
          }

          let TotalMRP = (parseInt(this.DraftQty) * contact.UnitMRP).toFixed(2);
          let Vatamount = ((parseFloat(TotalMRP) * contact.VatPercentage) / 100).toFixed(2);
          let vFinalNetAmount = (parseFloat(Vatamount) + parseFloat(TotalMRP)).toFixed(2);
          let LandedRateandedTotal = (parseInt(this.DraftQty) * contact.LandedRate).toFixed(2);
          let v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
          let PurTotAmt = (parseInt(this.DraftQty) * contact.PurUnitRateWF).toFixed(2);

          let CGSTAmt = (((contact.UnitMRP * contact.CgstPer) / 100) * this.DraftQty).toFixed(2);
          let SGSTAmt = (((contact.UnitMRP * contact.SgstPer) / 100) * this.DraftQty).toFixed(2);
          let IGSTAmt = (((contact.UnitMRP * contact.IgstPer) / 100) * this.DraftQty).toFixed(2);

          // let DiscAmt= ((parseFloat(TotalMRP) * (contact.DiscPer)) / 100).toFixed(2)

          let DiscAmt = ((parseFloat(TotalMRP) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
          let NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);

          let BalQty = contact.BalanceQty - this.DraftQty;

          this.saleSelectedDatasource.data[i].Qty = this.DraftQty;
          this.saleSelectedDatasource.data[i].VatAmount = Vatamount;
          this.saleSelectedDatasource.data[i].TotalAmount = TotalMRP;
          this.saleSelectedDatasource.data[i].NetAmt = vFinalNetAmount;
          this.saleSelectedDatasource.data[i].TotalMRP = TotalMRP;
          this.saleSelectedDatasource.data[i].VatAmount = Vatamount;
          this.saleSelectedDatasource.data[i].TotalAmount = TotalMRP;
          this.saleSelectedDatasource.data[i].NetAmt = NetAmt;

          this.saleSelectedDatasource.data[i].DiscPer = contact.DiscPer;
          this.saleSelectedDatasource.data[i].DiscAmt = DiscAmt;

          this.saleSelectedDatasource.data[i].CGSTAmt = CGSTAmt;
          this.saleSelectedDatasource.data[i].SGSTAmt = SGSTAmt;
          this.saleSelectedDatasource.data[i].IGSTAmt = IGSTAmt;

          this.saleSelectedDatasource.data[i].CgstPer = contact.CGSTPer;
          this.saleSelectedDatasource.data[i].SgstPer = contact.SGSTPer;
          this.saleSelectedDatasource.data[i].IgstPer = contact.IGSTPer;

          this.saleSelectedDatasource.data[i].LandedRate = contact.LandedRate;
          this.saleSelectedDatasource.data[i].LandedRateandedTotal = LandedRateandedTotal;
          this.saleSelectedDatasource.data[i].PurchaseRate = contact.PurUnitRateWF;
          this.saleSelectedDatasource.data[i].PurTotAmt = PurTotAmt;

          this.saleSelectedDatasource.data[i].BalanceQty = BalQty;
          this.saleSelectedDatasource.data[i].StockId = contact.StockId;
        }
        i++;
      });
    }
    if (!this.Itemflag) {
      if (contact.IssueQty != null) {
        this.DraftQty = DraftQty + contact.IssueQty;

        if (this.DraftQty > contact.BalanceQty) {
          Swal.fire('Enter Qty less than Balance');
          this.DraftQty = DraftQty - contact.IssueQty;
          this.ItemFormreset();
        }
      } else {
        this.DraftQty = DraftQty + 1;
        if (this.DraftQty > contact.BalanceQty) {
          Swal.fire('Enter Qty less than Balance');
          this.DraftQty = DraftQty - 1;
          this.ItemFormreset();
        }
      }

      let TotalMRP = (parseInt(this.DraftQty) * contact.UnitMRP).toFixed(2);
      let Vatamount = ((parseFloat(TotalMRP) * contact.VatPercentage) / 100).toFixed(2);
      let TotalNet = parseFloat(TotalMRP + Vatamount).toFixed(2);
      let LandedRateandedTotal = (parseInt(this.DraftQty) * contact.LandedRate).toFixed(2);
      let v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
      let PurTotAmt = (parseInt(this.DraftQty) * contact.PurUnitRateWF).toFixed(2);

      let CGSTAmt = (((contact.UnitMRP * contact.CGSTPer) / 100) * this.DraftQty).toFixed(2);
      let SGSTAmt = (((contact.UnitMRP * contact.SGSTPer) / 100) * this.DraftQty).toFixed(2);
      let IGSTAmt = (((contact.UnitMRP * contact.IGSTPer) / 100) * this.DraftQty).toFixed(2);

      let DiscAmt = ((parseFloat(TotalMRP) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
      let NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);

      this.chargeslistBarcode.push({
        ItemId: contact.ItemId || 0,
        ItemName: contact.ItemName || '',
        BatchNo: contact.BatchNo,
        BatchExpDate: this.datePipe.transform(contact.BatchExpDate, 'yyyy-MM-dd') || '01/01/1900',
        BalanceQty: contact.BalanceQty,
        Qty: this.DraftQty || 0,
        UnitMRP: contact.UnitMRP,
        GSTPer: contact.VatPer || 0,
        GSTAmount: Vatamount || 0,
        TotalMRP: TotalMRP,
        DiscPer: contact.DiscPer,
        DiscAmt: DiscAmt || 0,
        NetAmt: TotalNet,
        RoundNetAmt: parseInt(TotalNet), // Math.round(TotalNet),
        StockId: contact.StockId,
        LandedRate: contact.LandedRate,
        LandedRateandedTotal: LandedRateandedTotal,
        CgstPer: contact.CGSTPer,
        CGSTAmt: CGSTAmt,
        SgstPer: contact.SGSTPer,
        SGSTAmt: SGSTAmt,
        IgstPer: contact.IGSTPer,
        IGSTAmt: IGSTAmt,
        PurchaseRate: contact.PurUnitRateWF,
        PurTotAmt: PurTotAmt,
        MarginAmt: v_marginamt,
        SalesDraftId: 1,
      });
      console.log(this.chargeslistBarcode);
      // });
    }
    this.saleSelectedDatasource.data = this.chargeslistBarcode;
    console.log(this.saleSelectedDatasource.data);

    this.vBarcode = 0;
    this.vBarcodeflag = false;
  }

  getPRESCRIPTION() {
    if (this.ItemSubform.get('PatientType').value == 'IP') {
      const dialogRef = this._matDialog.open(PrescriptionComponent, {
        maxWidth: '100%',
        height: '95%',
        width: '95%',
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log('The dialog was closed - Insert Action', result);
        console.log(result);
        this.DoctorNamecheck = true;
        this.IPDNocheck = true;
        this.OPDNoCheck = false;
        // this.registerObj = result;
        // console.log(this.registerObj)
        this.PatientName = result[0].PatientName;
        this.RegId = result[0].RegId;
        this.OP_IP_Id = result[0].AdmissionID;
        this.ItemSubform.get('RegID').setValue(result[0].RegId);
        this.IPDNo = result[0].IPDNo;
        this.RegNo = result[0].RegNo;
        this.DoctorName = result[0].DoctorName;
        this.TariffName = result[0].TariffName;
        this.IPMedID = result[0].IPMedID;
        this.CompanyName = result[0].CompanyName;
        this.IPDNo = result[0].IPDNo;
        if (this.IPMedID > 0) {
          this.paymethod = true;
          this.vSelectedOption = 'IP';
        }

        this.dsItemNameList1.data = result;
        this.dsItemNameList1.data.forEach((contact) => {
          var m_data = {
            ItemId: contact.ItemId,
            StoreId: this._loggedService.currentUserValue.storeId || 0,
          };
          this._salesService.getDraftBillItem(m_data).subscribe((draftdata) => {
            //console.log(draftdata)
            this.Itemchargeslist1 = draftdata as any;
            if (this.Itemchargeslist1.length == 0) {
              Swal.fire(contact.ItemId + ' : ' + 'Item Stock is Not Avilable:');
            } else if (this.Itemchargeslist1.length > 0) {
              let ItemID = contact.ItemId;
              //
              let remaing_qty = contact.QtyPerDay;
              let bal_qnt = 0;
              this.Itemchargeslist1.forEach((element) => {
                let PreQty = remaing_qty;
                if (PreQty > 0) {
                  if (ItemID != element.ItemId) {
                    this.QtyBalchk = 0;
                  }
                  // if (this.QtyBalchk != 1) {
                  if (PreQty <= element.BalanceQty) {
                    this.QtyBalchk = 1;
                    this.getFinalCalculation(element, PreQty);
                    ItemID = element.ItemId;
                    bal_qnt += element.BalanceQty - PreQty;
                  } else if (PreQty > element.BalanceQty) {
                    this.QtyBalchk = 1;
                    //Swal.fire("For Item :" + element.ItemId + " adding the Balance Qty: ", element.BalanceQty)
                    this.getFinalCalculation(element, element.BalanceQty);
                    ItemID = element.ItemId;
                  }
                  remaing_qty = PreQty - element.BalanceQty;
                } else {
                  bal_qnt += element.BalanceQty;
                }
              });
              Swal.fire('Balance Qty is :', String(bal_qnt));
            }
          });
        });
      });
    } else {
      this.toastr.warning('Please Select PatientType IP.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }

  getBillSummary() {
    let query;

    query = 'select  SUM(BalanceAmount) as CreditAmount from t_salesheader where OP_IP_ID=' + this.OP_IP_Id;
    this._salesService.getBillSummaryQuery(query).subscribe((data) => {
      console.log(data);
      this.TotalCreditAmt = data[0].CreditAmount;
    });

    query = 'select AdvanceAmount,BalanceAmount from T_PHAdvanceHeader where OPD_IPD_Id=' + this.OP_IP_Id;
    this._salesService.getBillSummaryQuery(query).subscribe((data) => {
      console.log(data);
      let mdata = (this.TotalAdvanceAmt = data[0].AdvanceAmount);
      this.TotalBalanceAmt = data[0].BalanceAmount;
    });
  }

  // NEW BHAVDIP CODE
  getValidationMessages() {
    return {
      mobileNo: [
        { name: 'required', Message: 'Mobile no required' },
        { name: 'pattern', Message: 'only Number allowed.' },
      ],
      StoreId: [
        // { name: "required", Message: "Invoice No is required" }
    ]
    };
  }


  // Methods
  BindPaymentTypes() {
    this.opService.getPaymentModes().subscribe((data) => {
      this.paymentArr1 = data;
      this.paymentArr2 = data;
      this.paymentArr3 = data;
      this.paymentArr4 = data;
      this.paymentArr5 = data;
    });
  }

  keyPressAlphanumeric(event) {
    // ... existing code ...
  }

  updateCellDiscount(item: IndentList): void {
    let discPer = +item.DiscPer;
    let totalMrp = +item.TotalMRP;

    if (discPer < 0 || discPer > 100) {
      this.toastr.error('Enter discount between 0 - 100', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      item.DiscPer = 0;
      item.DiscAmt = 0;
      this.calculateCellNetAmount(item);
      return;
    }
    item.DiscAmt = ((totalMrp * discPer) / 100).toFixed(2);
    this.calculateCellNetAmount(item);
  }
  calculateCellNetAmount(item: IndentList): void {
    const discAmt = +item.DiscAmt;
    const totalMrp = +item.TotalMRP;

    const netAmount = (totalMrp - discAmt).toFixed(2);
    item.NetAmt = netAmount;
    this.updateItemSubForm();
  }

  updateItemSubForm(): void {
    // this.FinalDiscPer = this.Itemchargeslist.reduce((sum, item) => sum + (+item.TotalAmt), 0);
    this.FinalDiscPer = ((this.FinalDiscAmt * 100) / this.FinalTotalAmt).toFixed(2);
  }
  getCellCalculation(item: IndentList) {
    // Check validation of quantity
    let qty = +item.Qty;
    if (this.isNagative(qty)) {
      Swal.fire('Enter valid qty');
      qty = 0;
    }
    const gstPer = +item.GSTPer;
    const unitMrp = +item.UnitMRP;
    const totalMrp = qty * unitMrp;
    const gstAmount = (totalMrp * gstPer) / 100;

    const landedRateandedTotal = qty * item.LandedRate;
    const marginAmt = totalMrp - landedRateandedTotal;

    const updatedItem = {
      GSTAmount: gstAmount.toFixed(2),
      TotalMRP: totalMrp.toFixed(2),
      MarginAmt: marginAmt.toFixed(2),
      Qty: qty,
    } as IndentList;

    Object.assign(item, updatedItem);
    this.calculateCellNetAmount(item);
  }
  focusNext(ref: ElementRef): void {
    ((ref as any).el?.nativeElement as HTMLElement)?.querySelector('input')?.focus();
  }
  isNagative(value: number) {
    return value < 0;
  }
}
