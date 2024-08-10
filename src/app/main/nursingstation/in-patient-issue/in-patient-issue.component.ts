import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OnlinePaymentService } from 'app/main/shared/services/online-payment.service';
import { ToastrService } from 'ngx-toastr';
import { InPatientIssueService } from './in-patient-issue.service';
import { MatDrawer } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PrescriptionComponent } from '../prescription/prescription.component';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { BrowsSalesBillService } from 'app/main/pharmacy/brows-sales-bill/brows-sales-bill.service';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';

@Component({
  selector: 'app-in-patient-issue',
  templateUrl: './in-patient-issue.component.html',
  styleUrls: ['./in-patient-issue.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class InPatientIssueComponent implements OnInit {

  selectedSaleDisplayedCol = [
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'Qty',
    'UnitMRP',
    'GSTPer',
    'GSTAmount',
    'TotalMRP',
    'DiscPer',
    'DiscAmt',
    'NetAmt',
    'MarginAmt',
    'buttons'
  ];

  @ViewChild('Quantity') Quantity: ElementRef;
  @ViewChild('discAmount') discAmount: ElementRef;
  @ViewChild('ConseId') ConseId: ElementRef;

  ItemSubform: FormGroup;
  sIsLoading: string = '';
  isLoading = true;
  Store1List: any = [];
  filteredOptions: any;
  noOptionFound: boolean = false;
  labelPosition: 'before' | 'after' = 'after';
  isItemIdSelected: boolean = false;
  paymethod: boolean = false;
  IsOnlineRefNo: boolean = false;

  // dsIndentID = new MatTableDataSource<IndentID>();

  ItemName: any;
  ItemId: any;
  BalanceQty: any;
  Itemchargeslist: any = [];
  Itemchargeslist1: any = [];
  BalChkList: any = [];
  ConcessionReasonList: any = [];
  vextAddress: any = '';
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
  ConShow: Boolean = false;
  add1: Boolean = false;

  ItemObj: IndentList;
  v_marginamt: any = 0;
  TotalMarginAmt: any = 0;
  paidamt: number;
  flagSubmit: boolean;
  balanceamt: number = 0;
  disamt: any;
  msg: any;
  currentDate = new Date();

  VatPer: any;
  CgstPer: any;
  SgstPer: any;
  IgstPer: any;

  VatAmount: any;
  CGSTAmt: any;
  SGSTAmt: any;
  IGSTAmt: any;
  StockId: any;
  StoreId: any;
  LandedRate: any;
  PurchaseRate: any;
  LandedRateandedTotal: any = 0;
  PurTotAmt: any = 0;
  TotDiscAmt: any = 0;
  PatientName: any;
  RegID: any;

  BalAmount: any = 0;
  MobileNo: any;
  gstAmt: any;
  DoctorName: any;
  isRegIdSelected: boolean = true;
  chkdiscper: boolean = true;
  stockidflag: boolean = true;
  deleteflag: boolean = true;
  reportPrintObj: Printsal;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: Printsal[] = [];
  SalesIDObjList: Printsal[] = [];
  Filepath: any;
  reportItemPrintObj: Printsal;
  reportPrintObjItemList: Printsal[] = [];
  newDateTimeObj: any = {};
  repeatItemList: IndentList[] = [];
  DiscOld: any = 0.0;
  GSTAmount: any;
  QtyBalchk: any = 0;
  DraftQty: any = 0;
  RQty: any = 0;
  GSalesNo: any = 0;
  @ViewChild('drawer') public drawer: MatDrawer;
 
  saleSelectedDatasource = new MatTableDataSource<IndentList>();
  chargeslist = new MatTableDataSource<IndentList>();

  datasource = new MatTableDataSource<IndentList>(); 
  tempDatasource = new MatTableDataSource<IndentList>();
 

  dataSource1 = new MatTableDataSource<DraftSale>();
  dsBalAvaListStore = new MatTableDataSource<BalAvaListStore>();
  // vSalesDetails: any = [];
  vSalesDetails: Printsal[] = [];
  vSalesIdList: any = [];
  isPaymentSelected: boolean = false;
  OP_IP_Type: any;
  // payment code
  DiscId: any;
  DraftID: any = 0;
  DiffNetRoundAmt: any = 0;
  roundoffAmt: any;
  Functionflag = 0;

  patientDetailsFormGrp: FormGroup;  
  dateTimeObj: any;
  screenFromString = 'payment-form';
  // Paymentobj = {};
  paidAmt: number;
  balanceAmt: number = 0;
  BankNameList2: any = [];
  BankNameList3: any = [];
  BankNameList4: any = [];
  //latest
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
  @ViewChild('billTemplate2') billTemplate2: ElementRef;
 
  Creditflag: boolean = false;
  IsCreditflag: boolean = false
  OP_IP_Id: any = 0;
  OP_IPType: any = 2;
  drafttable: boolean = false 
  SalesDraftId: any = 0;
  v_PaidbyPatient: any = 0;
  v_PaidbacktoPatient: any = 0;
  loadingRow: number | null = null
  IsLoading: boolean = false;
  showTable: boolean = false
  vPatientType: any;
  type = " ";

  Addflag: boolean = false;
  vBarcodeflag: boolean = false; 
  vStockId: any = 0;
  Itemflag: boolean = false; 
  opflag:Boolean=false;
  ipflag:Boolean=false;
  externalflag:Boolean=false;
  vPaymode='';
  RegId:any;
  RegNo:any;
  IPDNo:any; 
  TariffName:any;
  CompanyName:any;
  Age:any;
  PatientListfilteredOptionsIP:any;
  registerObj:any;
  constructor(

     public _InPatientIssueService: InPatientIssueService, 
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,
    private formBuilder: FormBuilder, 
    private _loggedService: AuthenticationService, 
    public _BrowsSalesBillService: BrowsSalesBillService,
    // private applicationRef: ApplicationRef,
    // private opService: OPSearhlistService,
    // public _RequestforlabtestService: RequestforlabtestService,
    public toastr: ToastrService,
    // private onlinePaymentService: OnlinePaymentService
  ) { }

  vSelectedOption: any= '';
  ngOnInit(): void {
    this.gePharStoreList();
    this.getItemSubform();
    this.getConcessionReasonList();
  }
  getItemSubform() {
    this.ItemSubform = this.formBuilder.group({
      PatientName: '',
      DoctorName: '',
      extAddress: '',
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      PatientType: ['OP'],
      // paymode: ['cashpay'],
      // OP_IP_ID: [0,[Validators.required]],
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
      roundoffAmt: '0' 
    });
  } 
  getConcessionReasonList() {
    this._InPatientIssueService.getConcessionCombo().subscribe(data => {
      this.ConcessionReasonList = data; 
    })
  } 
  getDateTime(dateTimeObj) {  
    this.dateTimeObj = dateTimeObj;
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._InPatientIssueService.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
      this._InPatientIssueService.IndentSearchGroup.get('StoreId').setValue(this.Store1List[0]);
      this.StoreName = this._InPatientIssueService.IndentSearchGroup.get('StoreId').value.StoreName;
    });
  }
  OnAddUpdate(event) {
    this.sIsLoading = 'save';
    if (this.Itemchargeslist.length > 0) {
      this.Itemchargeslist.forEach((element) => {
        if (element.StockId == this.StockId) {
          // Swal.fire('Selected Item already added in the list');
          this.toastr.warning('Selected Item already added in the list', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.ItemFormreset();
        } else {
          this.onAdd();
        }
      });
    }
    else { 
      this.onAdd();
    } 
  }
  onAdd() { 
    if (this.vBarcode == 0) {
      if ((this.ItemId == 0 || this.Qty == null || this.MRP == "" || this.TotalMRP == 0)) {
        this.toastr.warning('Please select Item Detail', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (!this.vBarcodeflag) {

      this.sIsLoading = 'save';
      let Qty = this._InPatientIssueService.IndentSearchGroup.get('Qty').value
      if (this.ItemName && (parseInt(Qty) != 0) && this.MRP > 0 && this.NetAmt > 0) {
        // this.saleSelectedDatasource.data = [];

        this.Itemchargeslist = this.saleSelectedDatasource.data;
        this.Itemchargeslist.push(
          {
            ItemId: this.ItemId,
            ItemName: this.ItemName,
            BatchNo: this.BatchNo,
            BatchExpDate: this.BatchExpDate || '01/01/1900',
            Qty: this.Qty,
            UnitMRP: this.MRP,
            GSTPer: this.GSTPer || 0,
            GSTAmount: this.GSTAmount || 0,
            TotalMRP: this.TotalMRP,
            DiscPer: this._InPatientIssueService.IndentSearchGroup.get('DiscPer').value || 0,
            DiscAmt: this._InPatientIssueService.IndentSearchGroup.get('DiscAmt').value || 0,
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
            SalesDraftId: 1
          });
        this.sIsLoading = '';
        this.saleSelectedDatasource.data = this.Itemchargeslist;
        this.ItemFormreset();
      }
      this.itemid.nativeElement.focus();
      this.add = false;
    }
  }
  
  getSearchListIP() {
    var m_data = {
      "Keyword": `${this.ItemSubform.get('RegID').value}%`
    }
    if (this.ItemSubform.get('RegID').value.length >= 1) {
      this._InPatientIssueService.getAdmittedPatientList(m_data).subscribe(resData => {
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
    this.saleSelectedDatasource.data = [];
    this.PatientInformRest();
  }

  getSelectedObjRegIP(obj) {
    let IsDischarged = 0;
    IsDischarged = obj.IsDischarged 
    if(IsDischarged == 1){
      Swal.fire('Selected Patient is already discharged');
      //this.PatientInformRest();
      this.RegId = ''
    }
    else{
      console.log(obj) 
      this.registerObj = obj;
      this.PatientName = obj.FirstName + ' ' + obj.LastName;
      this.RegId = obj.RegID;
      this.OP_IP_Id = this.registerObj.AdmissionID;
      this.IPDNo = obj.IPDNo;
      this.RegNo =obj.RegNo;
      this.DoctorName = obj.DoctorName;
      this.TariffName =obj.TariffName
      this.CompanyName = obj.CompanyName;
      this.Age = obj.Age;
    }  
  } 
  getOptionTextIPObj(option) { 
    return option && option.FirstName + " " + option.LastName; 
  } 
  PatientInformRest(){
    this.PatientName = ''  
    this.IPDNo =  ''
    this.RegNo = ''
    this.DoctorName =  ''
    this.TariffName = ''
    this.CompanyName ='' 
  }
  getPharItemList() {
    var m_data = {
      "ItemName": `${this._InPatientIssueService.IndentSearchGroup.get('ItemId').value}%`,
      "StoreId": this._loggedService.currentUserValue.user.storeId || 0
    }
    if (this._InPatientIssueService.IndentSearchGroup.get('ItemId').value.length >= 1) {
      this._InPatientIssueService.getItemList(m_data).subscribe(data => {
        this.filteredOptions = data;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  } 
  getOptionText(option) {
    this.ItemId = option.ItemId;
    if (!option) return '';
    return option.ItemId + ' ' + option.ItemName + ' (' + option.BalanceQty + ')';
  } 
  getSelectedObj(obj) {
    // this.registerObj = obj;
    this.ItemName = obj.ItemName;
    this.ItemId = obj.ItemId;
    this.BalanceQty = obj.BalanceQty;
    this.LandedRate = obj.LandedRate;
    if (this.BalanceQty > 0) {
      this.getBatch();
    }
    this.m_getBalAvaListStore(obj.ItemId)
  }
  m_getBalAvaListStore(Param) {
    this.dataSource1.data = [];
    var m = {
      "ItemId": Param
    }
    this._InPatientIssueService.getBalAvaListStore(m).subscribe(data => {
      this.dsBalAvaListStore.data = data as BalAvaListStore[];
    },
      (error) => {
      });
  }
  getBatch() {
    this.Quantity.nativeElement.focus();
    // setTimeout(() => this.Quantity.nativeElement.focus(), 1000);
    const dialogRef = this._matDialog.open(SalePopupComponent,
      {
        maxWidth: "800px",
        minWidth: '800px',
        width: '800px',
        height: '380px',
        disableClose: true,
        data: {
          "ItemId": this._InPatientIssueService.IndentSearchGroup.get('ItemId').value.ItemId,
          "StoreId": this._InPatientIssueService.IndentSearchGroup.get('StoreId').value.storeid
        }
      });
    dialogRef.afterClosed().subscribe(result1 => {
     // debugger
      let result = result1.selectedData
      let vescflag = result1.vEscflag
      console.log(result);

      if (vescflag) {
        this._InPatientIssueService.IndentSearchGroup.get('ItemId').setValue('')
        this.itemid.nativeElement.focus();
      } else if (!vescflag) {
        this.Quantity.nativeElement.focus();

        this.BatchNo = result.BatchNo;
        this.BatchExpDate = this.datePipe.transform(result.BatchExpDate, "MM-dd-yyyy");
        this.MRP = result.UnitMRP;
        this.Qty = '';
        this.Bal = result.BalanceAmt;
        this.GSTPer = result.VatPercentage;

        this.TotalMRP = this.Qty * this.MRP;
        this.DiscPer = result.DiscPer;
        this.DiscAmt = 0;
        this.NetAmt = this.TotalMRP;
        this.BalanceQty = result.BalanceQty;
        this.ItemObj = result;

        this.VatPer = result.VatPercentage;
        // console.log(this.VatPer);
        this.CgstPer = result.CGSTPer;
        this.SgstPer = result.SGSTPer;
        this.IgstPer = result.IGSTPer;

        this.VatAmount = result.VatPercentage;
        this.StockId = result.StockId
        this.StoreId = result.StoreId;
        this.LandedRate = result.LandedRate;
        this.PurchaseRate = result.PurchaseRate;
        this.UnitMRP = result.UnitMRP;
      }
    });


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

    // }
  }
  calculateTotalAmt() { 
     let Qty = this._InPatientIssueService.IndentSearchGroup.get('Qty').value
     if (Qty > this.BalanceQty) {
       Swal.fire("Enter Qty less than Balance");
       this.ItemFormreset();
     }
 
     if (Qty && this.MRP) {
       this.TotalMRP = (parseInt(Qty) * (this._InPatientIssueService.IndentSearchGroup.get('MRP').value)).toFixed(2);
       //this.TotalMRP = ((Qty) * (this.MRP)).toFixed(2);
       this.LandedRateandedTotal = (parseInt(Qty) * (this.LandedRate)).toFixed(2);
       this.v_marginamt = (parseFloat(this.TotalMRP) - parseFloat(this.LandedRateandedTotal)).toFixed(2);
       this.PurTotAmt = (parseInt(Qty) * (this.PurchaseRate)).toFixed(2); 
       this.GSTAmount = (((this.UnitMRP) * (this.GSTPer) / 100) * parseInt(Qty)).toFixed(2);
       this.CGSTAmt = (((this.UnitMRP) * (this.CgstPer) / 100) * parseInt(Qty)).toFixed(2);
       this.SGSTAmt = (((this.UnitMRP) * (this.SgstPer) / 100) * parseInt(Qty)).toFixed(2);
       this.IGSTAmt = (((this.UnitMRP) * (this.IgstPer) / 100) * parseInt(Qty)).toFixed(2); 
       this.getDiscPer();
     } 
   }
   getDiscPer() {
    let DiscPer = this._InPatientIssueService.IndentSearchGroup.get('DiscPer').value
    if (this.DiscPer > 0) {
      this.ItemSubform.get('FinalDiscPer').disable();
      this.chkdiscper = true;
      this.DiscAmt = ((this.TotalMRP * (this.DiscPer)) / 100).toFixed(2);
      this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);
      this.ItemSubform.get('DiscAmt').disable();
    } else {
      this.chkdiscper = false;
      this.DiscAmt = 0;
      this.ItemSubform.get('DiscAmt').enable(); 
      this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);
    }
  }
  calculateDiscAmt() {
    let ItemDiscAmount = this._InPatientIssueService.IndentSearchGroup.get('DiscAmt').value;
    // let PurTotalAmount = this.PurTotAmt;
    let LandedTotalAmount = this.LandedRateandedTotal;
    let m_marginamt = (parseFloat(this.TotalMRP) - parseFloat(ItemDiscAmount)).toFixed(2);
    this.v_marginamt = ((parseFloat(this.TotalMRP) - parseFloat(ItemDiscAmount)) - (parseFloat(LandedTotalAmount))).toFixed(2);

    if (parseFloat(this.DiscAmt) > 0 && (parseFloat(this.DiscAmt)) < parseFloat(this.TotalMRP)) {
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
        this.NetAmt = (this.TotalMRP - (this._InPatientIssueService.IndentSearchGroup.get('DiscAmt').value)).toFixed(2);
        this.add = true;
        // this.addbutton.focus();
      }
    }
    else if (parseFloat(this.DiscAmt) > parseFloat(this.NetAmt)) {
      Swal.fire('Check Discount Amount !')
      this.ConShow = false;
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();
    }
    if (parseFloat(this._InPatientIssueService.IndentSearchGroup.get('DiscAmt').value) == 0) {
      this.add = true;
      this.ConShow = false;
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();
      // this.addbutton.focus();
    }
  }
  getDiscountCellCal(contact, DiscPer) {
    // debugger


    // let DiscOld=DiscPer;
    let DiscAmt;
    let TotalMRP = contact.TotalMRP;

    if (DiscPer > 0) {
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();
      this.ConShow = true;

      DiscAmt = ((contact.TotalMRP * (DiscPer)) / 100).toFixed(2);
      let NetAmt = (parseFloat(contact.TotalMRP) - parseFloat(DiscAmt)).toFixed(2);

      if (parseFloat(DiscAmt) > parseFloat(NetAmt)) {
        Swal.fire('Check Discount Amount !')
        this.ConShow = false;
        this.ItemSubform.get('ConcessionId').clearValidators();
        this.ItemSubform.get('ConcessionId').updateValueAndValidity();
      }

      contact.DiscAmt = DiscAmt || 0,
        contact.NetAmt = NetAmt
    } else {
      let DiscAmt = 0;
      let NetAmt = (parseFloat(contact.TotalMRP)).toFixed(2);

      contact.DiscAmt = DiscAmt || 0,
        contact.NetAmt = NetAmt
    }


    let ItemDiscAmount = DiscAmt// this._salesService.IndentSearchGroup.get('DiscAmt').value;
    // let PurTotalAmount = this.PurTotAmt;
    let LandedTotalAmount = (parseInt(contact.Qty) * (contact.LandedRate)).toFixed(2);
    // this.LandedRateandedTotal = (parseInt(this.RQty) * (contact.LandedRate)).toFixed(2);
    let m_marginamt = (parseFloat(contact.TotalMRP) - parseFloat(ItemDiscAmount)).toFixed(2);
    let v_marginamt = ((parseFloat(contact.TotalMRP) - parseFloat(ItemDiscAmount)) - (parseFloat(LandedTotalAmount))).toFixed(2);

    if (parseFloat(DiscAmt) > 0 && (parseFloat(DiscAmt)) < parseFloat(TotalMRP)) {

      if (parseFloat(m_marginamt) <= parseFloat(LandedTotalAmount)) {
        Swal.fire('Discount amount greater than Purchase amount, Please check !');

        contact.DiscPer = this.DiscOld;
        DiscAmt = 0// ((contact.TotalMRP * (this.DiscOld)) / 100).toFixed(2);
        let NetAmt = parseFloat(contact.TotalMRP);

        contact.DiscAmt = DiscAmt || 0,
          contact.NetAmt = NetAmt

      } else {
        // this.NetAmt = (this.TotalMRP - (this._salesService.IndentSearchGroup.get('DiscAmt').value)).toFixed(2);
      }
    }



  }
  getCellCalculation(contact, Qty) {
    // debugger
    let Qtyfinal = this.Qty;
    console.log(contact)
    this.StockId = contact.StockId;
    this.Qty = Qty;
    if (contact.Qty != 0 && contact.Qty != null) {
      // console.log(contact.Qty);
      this.BalChkList = [];
      this.StoreId = this._loggedService.currentUserValue.user.storeId

      // let SelectQuery = "select isnull(BalanceQty,0) as BalanceQty from lvwCurrentBalQtyCheck where StoreId = " + this.StoreId + " AND ItemId = " + contact.ItemId + " AND  BatchNo='" + contact.BatchNo + "' AND  StockId=" + contact.StockId + ""
      let SelectQuery = "select isnull(BalanceQty,0) as BalanceQty from lvwCurrentBalQtyCheck where StoreId = " + this.StoreId + " AND ItemId = " + contact.ItemId + ""


      console.log(SelectQuery);
      this._InPatientIssueService.getchargesList(SelectQuery).subscribe(data => {
        this.BalChkList = data;
        console.log(this.BalChkList); 
        if (this.BalChkList.length > 0) {
          let AllQty = 0;
          this.BalChkList.forEach((element) => {

            AllQty += element.BalanceQty
            console.log(AllQty);
          });

          if (AllQty >= contact.Qty) {
            this.QtyBalchk = 1;

            this.tblCalucation(contact, contact.Qty)
            this.getDiscountCellCal(contact, contact.DiscPer)
          }

          else {
            // this.QtyBalchk = 1;
            Swal.fire("Please Enter Qty Less than Balance Qty :" + contact.ItemName + " . Available Balance Qty :" + this.BalChkList[0].BalanceQty)
            //     contact.Qty = parseInt(this.BalChkList[0].BalanceQty);
            //     contact.Qty=this.Qty;
            //     this.tblCalucation(contact,contact.Qty)
            contact.Qty = 1;
          }
        }

      },
        (error) => {
          Swal.fire("No Item Found!!")
        });

    }
    else {
      Swal.fire("Please enter Qty!!")

      contact.GSTAmount = 0;
      contact.TotalMRP = 0
      contact.DiscAmt = 0,
      contact.NetAmt = 0;
      contact.RoundNetAmt = 0;
      contact.StockId = this.StockId,
      contact.VatAmount = 0;
      contact.LandedRateandedTotal = 0;
      contact.CGSTAmt = 0;
      contact.SGSTAmt = 0;
      contact.IGSTAmt = 0;
      contact.PurchaseRate = this.PurchaseRate,
      contact.PurTotAmt = this.PurTotAmt,
      contact.MarginAmt = 0
    } 
    this.ItemFormreset();
  }
  tblCalucation(contact, Qty) {
    let TotalMRP;
    this.RQty = parseInt(contact.Qty) || 1;
    if (this.RQty && contact.UnitMRP) {
      TotalMRP = (parseInt(this.RQty) * (contact.UnitMRP)).toFixed(2);
      let LandedRateandedTotal = (parseInt(this.RQty) * (contact.LandedRate)).toFixed(2);
      let v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
      // debugger
      this.PurTotAmt = (parseInt(this.RQty) * (contact.PurchaseRate)).toFixed(2);
      let NetAmt
      let DiscAmt
      this.GSTAmount = (((contact.UnitMRP) * (contact.VatPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.CGSTAmt = (((contact.UnitMRP) * (contact.CgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.SGSTAmt = (((contact.UnitMRP) * (contact.SgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.IGSTAmt = (((contact.UnitMRP) * (contact.IgstPer) / 100) * parseInt(this.RQty)).toFixed(2);
      NetAmt = (parseFloat(TotalMRP) - parseFloat(contact.DiscAmt)).toFixed(2);

      if (contact.DiscPer > 0) {
        DiscAmt = ((TotalMRP * (contact.DiscPer)) / 100).toFixed(2);
        NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);
      }

      contact.GSTAmount = (((contact.UnitMRP) * (contact.VatPer) / 100) * parseInt(this.RQty)).toFixed(2) || 0;
      contact.TotalMRP = (parseInt(this.RQty) * (contact.UnitMRP)).toFixed(2);  //this.TotalMRP || 0,
      contact.DiscAmt = DiscAmt || 0,
        contact.NetAmt = NetAmt,// (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2); //this.NetAmt,
        contact.RoundNetAmt = Math.round(NetAmt),
        contact.StockId = this.StockId,
        contact.VatAmount = 0,// this.GSTAmount || 0,
        contact.LandedRateandedTotal = LandedRateandedTotal,
        contact.CGSTAmt = contact.CGSTAmt || 0,
        contact.SGSTAmt = contact.SGSTAmt || 0,
        contact.IGSTAmt = contact.IGSTAmt || 0,
        contact.PurchaseRate = contact.PurchaseRate || 0,
        contact.PurTotAmt = 0,//this.PurTotAmt || 0,
        contact.MarginAmt = v_marginamt || 0
    }
    this.ItemFormreset();
  }
  getGSTAmtSum(element) {
    //this.FinalDiscAmt = (element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0)).toFixed(2);
    this.FinalGSTAmt = (element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0)).toFixed(2);
    return this.FinalGSTAmt;
  }

  getNetAmtSum(element) { 
    this.FinalNetAmount = (element.reduce((sum, { NetAmt }) => sum += +(NetAmt || 0), 0)).toFixed(2);
    this.FinalTotalAmt = (element.reduce((sum, { TotalMRP }) => sum += +(TotalMRP || 0), 0)).toFixed(2);
    this.FinalDiscAmt = (element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0)).toFixed(2);
    this.FinalGSTAmt = (element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0)).toFixed(2);
    this.roundoffAmt = Math.round(this.ItemSubform.get("FinalNetAmount").value)// Math.round(this.FinalNetAmount); //(element.reduce((sum, { RoundNetAmt }) => sum += +(RoundNetAmt || 0), 0)).toFixed(2) || Math.round(this.FinalNetAmount);

    this.DiffNetRoundAmt = (parseFloat(this.roundoffAmt) - parseFloat(this.FinalNetAmount)).toFixed(2);
    return this.FinalNetAmount;
  }
  getMarginSum(element) {
    this.TotalMarginAmt = (element.reduce((sum, { MarginAmt }) => sum += +(MarginAmt || 0), 0)).toFixed(2);
    return this.TotalMarginAmt;
  }
  getFinalDiscperAmt() { 
    let Disc = this.ItemSubform.get('FinalDiscPer').value || 0;
    let DiscAmt = this.ItemSubform.get('FinalDiscAmt').value || 0;

    if (Disc > 0 || Disc < 100) {
      this.ConShow = true
      this.FinalDiscAmt = ((this.FinalTotalAmt * (Disc)) / 100).toFixed(2);
      this.ItemSubform.get('FinalDiscAmt').setValue(this.FinalDiscAmt);
      this.FinalNetAmount = ((this.FinalTotalAmt) - (this.FinalDiscAmt)).toFixed(2);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();
      this.ItemSubform.updateValueAndValidity();

    } else {
      this.ConShow = false
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
    let totDiscAmt = this.ItemSubform.get('FinalDiscAmt').value
    // console.log(totDiscAmt);
    // console.log(this.FinalDiscAmt);
    if (totDiscAmt > 0) {
      this.FinalNetAmount = ((this.FinalNetAmount) - (this.FinalDiscAmt)).toFixed(2);
      this.ConShow = true
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();

    } else {
      this.ConShow = false
      this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();
      //this.ConseId.nativeElement.focus();
    }
  }
  CalPaidbackAmt() {
    this.v_PaidbacktoPatient = (parseFloat(this.roundoffAmt) - parseFloat(this.v_PaidbyPatient)).toFixed(2);
  }
  onSaveDraftBill() {
    let NetAmt = (this.ItemSubform.get('FinalNetAmount').value);
    let ConcessionId = 0;
    if (this.ItemSubform.get('ConcessionId').value)
      ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

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
    SalesInsert['totalAmount'] = this.FinalTotalAmt
    SalesInsert['vatAmount'] = this.FinalGSTAmt || 0;//this.ItemSubform.get('FinalGSTAmt').value;
    SalesInsert['discAmount'] = this.FinalDiscAmt;
    SalesInsert['netAmount'] = NetAmt;
    SalesInsert['paidAmount'] = NetAmt;
    SalesInsert['balanceAmount'] = 0;
    SalesInsert['concessionReasonID'] = ConcessionId || 0;
    SalesInsert['concessionAuthorizationId'] = 0;
    SalesInsert['isSellted'] = 0;
    SalesInsert['isPrint'] = 0;
    SalesInsert['unitID'] = 1;
    SalesInsert['addedBy'] = this._loggedService.currentUserValue.user.id,
      SalesInsert['externalPatientName'] = this.PatientName || '';
    SalesInsert['doctorName'] = this.DoctorName || '';
    SalesInsert['storeId'] = this._InPatientIssueService.IndentSearchGroup.get('StoreId').value.storeid;
    SalesInsert['isPrescription'] =this.IPMedID || 0;
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
      "salesDraftbillInsert": SalesInsert,
      "salesDraftbillDetailInsert": salesDetailInsertarr

    };
    // console.log(submitData);
    this._InPatientIssueService.InsertSalesDraftBill(submitData).subscribe(response => {
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
    }, error => {
      // this.snackBarService.showErrorSnackBar('Sales data not saved !, Please check API error..', 'Error !');
      this.toastr.error('API Error!', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });

    this.ItemFormreset();
    this.patientDetailsFormGrp.reset();
    this.Formreset();
    this.ItemSubform.get('ConcessionId').reset();
    this.PatientName = '';
    this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
  }
  onSave(event) {
    event.srcElement.setAttribute('disabled', true);
    let patientTypeValue1 = this.ItemSubform.get('PatientType').value;
    if(this.ItemSubform.get('PatientType').value == 'External'){
      if (this.PatientName == "" || this.MobileNo == "" || this.DoctorName == "") {
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
    if ((patientTypeValue == 'OP' || patientTypeValue == 'IP')
      && (this.RegNo == '' || this.RegNo == null || this.RegNo == undefined)) {
      this.toastr.warning('Please select Patient Type.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      event.srcElement.removeAttribute('disabled');
      return;
    }  
    if (this.ItemSubform.get('CashPay').value == 'CashPay' || this.ItemSubform.get('CashPay').value == 'Online') {
      this.onCashOnlinePaySave()
    }
    else if (this.ItemSubform.get('CashPay').value == 'Credit') { 
      this.onCreditpaySave()
    }
    else if (this.ItemSubform.get('CashPay').value == 'PayOption') { 
      this.onSavePayOption()
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
    let nowDate1 = nowDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
    this.newDateTimeObj = { date: nowDate1[0], time: nowDate1[1] };
    // console.log(this.newDateTimeObj);

    let NetAmt = (this.ItemSubform.get('FinalNetAmount').value);
    let ConcessionId = 0;
    if (this.ItemSubform.get('ConcessionId').value)
      ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;
 
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
    SalesInsert['netAmount'] =  this.ItemSubform.get('roundoffAmt').value || 0;  
    SalesInsert['paidAmount'] = this.ItemSubform.get('roundoffAmt').value; // NetAmt;
    SalesInsert['balanceAmount'] = 0;
    SalesInsert['concessionReasonID'] = ConcessionId || 0;
    SalesInsert['concessionAuthorizationId'] = 0;
    SalesInsert['isSellted'] = 0;
    SalesInsert['isPrint'] = 0;
    SalesInsert['isFree'] = 0;
    SalesInsert['unitID'] = 1;
    SalesInsert['addedBy'] = this._loggedService.currentUserValue.user.id,
    SalesInsert['externalPatientName'] = this.PatientName || '';
    SalesInsert['doctorName'] = this.DoctorName || '';
    SalesInsert['storeId'] = this._InPatientIssueService.IndentSearchGroup.get('StoreId').value.storeid;
    SalesInsert['isPrescription'] = this.IPMedID || 0;
    SalesInsert['creditReason'] = '';
    SalesInsert['creditReasonID'] = 0;
    SalesInsert['wardId'] = 0;
    SalesInsert['bedID'] = 0;
    SalesInsert['discper_H'] = 0;
    SalesInsert['isPurBill'] = 0;
    SalesInsert['isBillCheck'] = 0;
    SalesInsert['salesHeadName'] = ""
    SalesInsert['salesTypeId'] = 0;
    SalesInsert['salesId'] = 0;
    SalesInsert['extMobileNo'] = this.MobileNo || 0;
    SalesInsert['extAddress'] = this.vextAddress || ''; 

    if (this.ItemSubform.get('FinalDiscPer').value != 0) {
      SalesInsert['IsItem_Header_disc'] = 1;   // total amount wise discount 
    } else if (this.ItemSubform.get('FinalDiscPer').value == 0) {
      SalesInsert['IsItem_Header_disc'] =0;   // item wise discount amt
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
      salesDetailInsert['igstPer'] = element.IgstPer
      salesDetailInsert['igstAmt'] = element.IGSTAmt
      salesDetailInsert['isPurRate'] = 0;
      salesDetailInsert['stkID'] = element.StockId;
      salesDetailInsertarr.push(salesDetailInsert);
    });

    let updateCurStkSalestarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let updateCurStkSales = {};
      updateCurStkSales['itemId'] = element.ItemId;
      updateCurStkSales['issueQty'] = element.Qty;
      updateCurStkSales['storeID'] = this._loggedService.currentUserValue.user.storeId,
        updateCurStkSales['stkID'] = element.StockId;
      updateCurStkSalestarr.push(updateCurStkSales);
    });

    let cal_DiscAmount_Sales = {};
    cal_DiscAmount_Sales['salesID'] = 0;

    let cal_GSTAmount_Sales = {};
    cal_GSTAmount_Sales['salesID'] = 0;

    let salesDraftStatusUpdate = {};
    console.log(this.DraftID);
    salesDraftStatusUpdate['DSalesId'] = this.DraftID || 0;
    salesDraftStatusUpdate['IsClosed'] = 1

    let PaymentInsertobj = {};

    PaymentInsertobj['BillNo'] = 0,
    PaymentInsertobj['ReceiptNo'] = '',
    PaymentInsertobj['PaymentDate'] = this.newDateTimeObj.date; //  this.dateTimeObj.date;
    PaymentInsertobj['PaymentTime'] = this.newDateTimeObj.time; //  this.dateTimeObj.time;
    PaymentInsertobj['CashPayAmount'] = this.ItemSubform.get('roundoffAmt').value; //NetAmt;
    PaymentInsertobj['ChequePayAmount'] = 0,
    PaymentInsertobj['ChequeNo'] = 0,
    PaymentInsertobj['BankName'] = '',
    PaymentInsertobj['ChequeDate'] = '01/01/1900',
    PaymentInsertobj['CardPayAmount'] = 0,
    PaymentInsertobj['CardNo'] = '',
    PaymentInsertobj['CardBankName'] = '',
    PaymentInsertobj['CardDate'] = '01/01/1900',
    PaymentInsertobj['AdvanceUsedAmount'] = 0;
    PaymentInsertobj['AdvanceId'] = 0;
    PaymentInsertobj['RefundId'] = 0;
    PaymentInsertobj['TransactionType'] = 4;
    PaymentInsertobj['Remark'] = '',
    PaymentInsertobj['AddBy'] = this._loggedService.currentUserValue.user.id,
    PaymentInsertobj['IsCancelled'] = 0;
    PaymentInsertobj['IsCancelledBy'] = 0;
    PaymentInsertobj['IsCancelledDate'] = '01/01/1900',
    PaymentInsertobj['OPD_IPD_Type'] = 3;
    PaymentInsertobj['NEFTPayAmount'] = 0,
    PaymentInsertobj['NEFTNo'] = '',
    PaymentInsertobj['NEFTBankMaster'] = '',
    PaymentInsertobj['NEFTDate'] = '01/01/1900',
    PaymentInsertobj['PayTMAmount'] = 0,
    PaymentInsertobj['PayTMTranNo'] = '',
    PaymentInsertobj['PayTMDate'] = '01/01/1900'

    let submitData = {
      "salesInsert": SalesInsert,
      "salesDetailInsert": salesDetailInsertarr,
      "updateCurStkSales": updateCurStkSalestarr,
      "cal_DiscAmount_Sales": cal_DiscAmount_Sales,
      "cal_GSTAmount_Sales": cal_GSTAmount_Sales,
      "salesDraftStatusUpdate": salesDraftStatusUpdate,
      "salesPayment": PaymentInsertobj
    };

    console.log(submitData)
    let vMobileNo = this.MobileNo;

    this._InPatientIssueService.InsertCashSales(submitData).subscribe(response => {
      if (response) {
        if (response == -1) {
          this.toastr.error('Stock has been updated. few items are out of stock.', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
        else {
          this.toastr.success('Record Saved Successfully.', 'Save !', {
            toastClass: 'tostr-tost custom-toast-success',
          });

          this.getPrint3(response);
          this.getWhatsappshareSales(response, vMobileNo);
          this.Itemchargeslist = [];
          this._matDialog.closeAll();
          this.ItemFormreset();
          this.isLoading123=false;
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
        this.isLoading123=false;
      } 
    }, error => {
      this.toastr.error('API Error!', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
      this.isLoading123=false;
    }); 
 

    // }
  }
  onSavePayOption() {
    this.vPatientType = this.ItemSubform.get('PatientType').value; 
    this.isLoading123=true; 
    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['RegNo'] = this.RegNo;
    PatientHeaderObj['PatientName'] = this.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = this.IPDNo;
    PatientHeaderObj['Age'] = this.Age ;
    PatientHeaderObj['NetPayAmount'] = this.ItemSubform.get('roundoffAmt').value; //this.ItemSubform.get('FinalNetAmount').value;
  
    const dialogRef = this._matDialog.open(OpPaymentNewComponent,
        {
          maxWidth: "80vw",
          height: '650px',
          width: '80%',
          data: {
            vPatientHeaderObj: PatientHeaderObj,
          FromName: "Phar-SalesPay"
          }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
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
          let NetAmt = (this.ItemSubform.get('FinalNetAmount').value);
          let ConcessionId = 0;
          if (this.ItemSubform.get('ConcessionId').value)
            ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

          let nowDate = new Date();
          let nowDate1 = nowDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
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
          SalesInsert['netAmount'] =  this.ItemSubform.get('roundoffAmt').value || 0;  
          SalesInsert['paidAmount'] = this.ItemSubform.get('roundoffAmt').value || 0; // NetAmt;
          SalesInsert['balanceAmount'] = 0;
          SalesInsert['concessionReasonID'] = ConcessionId || 0;
          SalesInsert['concessionAuthorizationId'] = 0;
          SalesInsert['isSellted'] = 0;
          SalesInsert['isPrint'] = 0;
          SalesInsert['isFree'] = 0;
          SalesInsert['unitID'] = 1;
          SalesInsert['addedBy'] = this._loggedService.currentUserValue.user.id,
          SalesInsert['externalPatientName'] = this.PatientName || '';
          SalesInsert['doctorName'] = this.DoctorName || '';
          SalesInsert['storeId'] = this._InPatientIssueService.IndentSearchGroup.get('StoreId').value.storeid;
          SalesInsert['isPrescription'] =this.IPMedID || 0;
          SalesInsert['creditReason'] = '';
          SalesInsert['creditReasonID'] = 0;
          SalesInsert['wardId'] = 0;
          SalesInsert['bedID'] = 0;
          SalesInsert['discper_H'] = 0;
          SalesInsert['isPurBill'] = 0;
          SalesInsert['isBillCheck'] = 0;
          SalesInsert['salesHeadName'] = ""
          SalesInsert['salesTypeId'] = 0;
          SalesInsert['salesId'] = 0;
          SalesInsert['extMobileNo'] = this.MobileNo || 0;
          SalesInsert['extAddress'] = this.vextAddress || '';
          if(this.ItemSubform.get('FinalDiscPer').value != 0) {
            SalesInsert['IsItem_Header_disc'] = 1;   // total amount wise discount 
          } else if(this.ItemSubform.get('FinalDiscPer').value == 0) {
            SalesInsert['IsItem_Header_disc'] =0;   // item wise discount amt
          } 
        

          let salesDetailInsertarr = [];
          this.saleSelectedDatasource.data.forEach((element) => {
            // console.log(element);
            let salesDetailInsert = {};
            salesDetailInsert['salesID'] = 0;
            salesDetailInsert['itemId'] = element.ItemId;
            salesDetailInsert['batchNo'] = element.BatchNo;
            salesDetailInsert['batchExpDate'] = element.BatchExpDate;// this.datePipe.transform(element.BatchExpDate,"yyyy/mm/dd");//element.BatchExpDate;
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
            salesDetailInsert['igstPer'] = element.IgstPer
            salesDetailInsert['igstAmt'] = element.IGSTAmt
            salesDetailInsert['isPurRate'] = 0;
            salesDetailInsert['stkID'] = element.StockId;
            salesDetailInsertarr.push(salesDetailInsert);
          });
          let updateCurStkSalestarr = [];
          this.saleSelectedDatasource.data.forEach((element) => {
            let updateCurStkSales = {};
            updateCurStkSales['itemId'] = element.ItemId;
            updateCurStkSales['issueQty'] = element.Qty;
            updateCurStkSales['storeID'] = this._loggedService.currentUserValue.user.storeId,
            updateCurStkSales['stkID'] = element.StockId;
            updateCurStkSalestarr.push(updateCurStkSales);
          });

          let cal_DiscAmount_Sales = {};
          cal_DiscAmount_Sales['salesID'] = 0;

          let cal_GSTAmount_Sales = {};
          cal_GSTAmount_Sales['salesID'] = 0;


          let salesDraftStatusUpdate = {};
          salesDraftStatusUpdate['DSalesId'] = this.DraftID || 0;
          salesDraftStatusUpdate['IsClosed'] = 1

          let submitData = {
            "salesInsert": SalesInsert,
            "salesDetailInsert": salesDetailInsertarr,
            "updateCurStkSales": updateCurStkSalestarr,
            "cal_DiscAmount_Sales": cal_DiscAmount_Sales,
            "cal_GSTAmount_Sales": cal_GSTAmount_Sales,
            "salesDraftStatusUpdate": salesDraftStatusUpdate,
            "salesPayment": result.submitDataPay.ipPaymentInsert
          };
          
          let vMobileNo = this.MobileNo;
          console.log(submitData)
          this._InPatientIssueService.InsertCashSales(submitData).subscribe(response => {
            if (response) {
              if (response == -1) {
                this.toastr.error('Stock has been updated. few items are out of stock.', 'Error !', {
                  toastClass: 'tostr-tost custom-toast-error',
                });
              }
              else {
                this.toastr.success('Record Saved Successfully.', 'Save !', {
                  toastClass: 'tostr-tost custom-toast-success',
                });
                this.getPrint3(response);
                this.getWhatsappshareSales(response, vMobileNo)
                this.Itemchargeslist = [];
                this._matDialog.closeAll();
                this.ItemFormreset();
                this.Formreset();
                this.isLoading123=false;
              }
            } else {
              this.toastr.error('API Error!', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
              });
          
            }
           
            // });
          }, error => {

            this.toastr.error('API Error!', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
            this.isLoading123=false; 
          });

          this.ItemFormreset();
          this.patientDetailsFormGrp.reset();
          this.Formreset();
          this.ItemSubform.get('ConcessionId').reset(); 
          this.saleSelectedDatasource.data = [];
         
        }
        else {
          this.toastr.warning('Please check Payment Mode and Amount (Now it is Selected Zero).', 'Save !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
        }
         this.isLoading123=false;
      } 
    })

  }
  onCreditpaySave() {
    this.isLoading123 = true; 
    // if (this._salesService.IndentSearchGroup.get('PatientType').value == "External" && this.PatientName  != null && this.MobileNo != null) {
    let NetAmt = (this.ItemSubform.get('FinalNetAmount').value);
    let ConcessionId = 0;
    if (this.ItemSubform.get('ConcessionId').value)
      ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

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
    salesInsertCredit['addedBy'] = this._loggedService.currentUserValue.user.id,
    salesInsertCredit['externalPatientName'] = this.PatientName;
    salesInsertCredit['doctorName'] = "";
    salesInsertCredit['storeId'] = this._loggedService.currentUserValue.user.storeId,
    salesInsertCredit['isPrescription'] = this.IPMedID || 0;
    salesInsertCredit['creditReason'] = '';
    salesInsertCredit['creditReasonID'] = 0;
    salesInsertCredit['wardId'] = 0;
    salesInsertCredit['bedID'] = 0;
    salesInsertCredit['discper_H'] = 0;
    salesInsertCredit['isPurBill'] = 0;
    salesInsertCredit['isBillCheck'] = 0;
    salesInsertCredit['salesHeadName'] = ""
    salesInsertCredit['salesTypeId'] = 0;
    salesInsertCredit['salesId'] = 0;
    salesInsertCredit['extMobileNo'] = this.MobileNo || 0;
    salesInsertCredit['extAddress'] = this.vextAddress || '';
    if(this.ItemSubform.get('FinalDiscPer').value != 0) {
      salesInsertCredit['isItem_Header_disc'] = 1;   // total wise discount amt 
    } else if(this.ItemSubform.get('FinalDiscPer').value == 0) {
      salesInsertCredit['isItem_Header_disc'] = 0;   // item amount wise discount 
    } 
  

    let salesDetailInsertCreditarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let salesDetailInsertCredit = {};
      salesDetailInsertCredit['salesID'] = 0;
      salesDetailInsertCredit['itemId'] = element.ItemId;
      salesDetailInsertCredit['batchNo'] = element.BatchNo;
      salesDetailInsertCredit['batchExpDate'] = element.BatchExpDate;//this.datePipe.transform(element.BatchExpDate,"yyyy/mm/dd");// element.BatchExpDate;
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
      salesDetailInsertCredit['igstPer'] = element.IgstPer
      salesDetailInsertCredit['igstAmt'] = element.IGSTAmt
      salesDetailInsertCredit['isPurRate'] = 0;
      salesDetailInsertCredit['stkID'] = element.StockId;
      salesDetailInsertCreditarr.push(salesDetailInsertCredit);
    });

    let updateCurStkSalesCreditarray = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let updateCurStkSalesCredit = {};
      updateCurStkSalesCredit['itemId'] = element.ItemId;
      updateCurStkSalesCredit['issueQty'] = element.Qty;
      updateCurStkSalesCredit['storeID'] = this._loggedService.currentUserValue.user.storeId,
        updateCurStkSalesCredit['stkID'] = element.StockId;

      updateCurStkSalesCreditarray.push(updateCurStkSalesCredit);
    });

    let cal_DiscAmount_SalesCredit = {};
    cal_DiscAmount_SalesCredit['salesID'] = 0;

    let cal_GSTAmount_SalesCredit = {};
    cal_GSTAmount_SalesCredit['salesID'] = 0;

    // console.log("Procced with Payment Option");

    let submitData = {
      "salesInsertCredit": salesInsertCredit,
      "salesDetailInsertCredit": salesDetailInsertCreditarr,
      "updateCurStkSalesCredit": updateCurStkSalesCreditarray,
      "cal_DiscAmount_SalesCredit": cal_DiscAmount_SalesCredit,
      "cal_GSTAmount_SalesCredit": cal_GSTAmount_SalesCredit
    };
    console.log(submitData)
    let vMobileNo = this.mobileno;
    this._InPatientIssueService.InsertCreditSales(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record Saved Successfully.', 'Credit Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.getPrint3(response);
        this.getWhatsappshareSales(response, vMobileNo);
        this.Itemchargeslist = [];
        this._matDialog.closeAll();
        this.isLoading123=false; 

      } else { 
        this.toastr.error('API Error!', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        }); 
        this.isLoading123=false;
      } 
    }, error => { 
      this.toastr.error('API Error!', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      }); 
      this.isLoading123=false;
    });
  
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
    if (this.vPaymode=='Credit') {
      this.type = "Credit"
      this.Creditflag = true;
    } else if(!(this.vPaymode=='Credit')){
      this.type=" "
      this.Creditflag = false;
    }

    var D_data = {
      "SalesID": el,// 
      "OP_IP_Type": this.OP_IPType
    }
    let printContents;
    this.subscriptionArr.push(
      this._InPatientIssueService.getSalesPrint(D_data).subscribe(res => {
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
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": "Dear" + vmono + ",Your Sales Bill has been successfully completed. UHID is " + el + " For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur " || '',
        "isSent": 0,
        "smsType": 'Sales',
        "smsFlag": 0,
        "smsDate": this.currentDate,
        "tranNo": el,
        "PatientType": 2,//el.PatientType,
        "templateId": 0,
        "smSurl": "info@gmail.com",
        "filePath": this.Filepath || '',
        "smsOutGoingID": 0
      }
    }
    this._BrowsSalesBillService.InsertWhatsappSales(m_data).subscribe(response => {
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
  payOnline() {  
    // const matDialog = this._matDialog.open(PaymentModeComponent, {
    //   data: { finalAmount: this.FinalNetAmount },
    //   // height: '380px',
    //   disableClose: true,
    //   panelClass: 'payment-dialog'
    //   // panelClass: ['animate__animated','animate__slideInRight']
    // });
    // matDialog.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.isPaymentSuccess = true;
    //     this.ItemSubform.get('referanceNo').setValue(this.onlinePaymentService.PlutusTransactionReferenceID);
    //   }
    // });
  }
  public onF6Reset(event): void {
    ;
    if (event.which === 117) {
      this.onClose();
    }
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
  chargeslist1: any = [];
  getDraftorderList() {
    this.chargeslist1 = [];
    this.dataSource1.data = [];
    let currentDate = new Date();
    var m = {
      "FromDate": this.datePipe.transform(currentDate, "MM/dd/yyyy") || "01/01/1900",
      "ToDate": this.datePipe.transform(currentDate, "MM/dd/yyyy") || "01/01/1900",
    }
    this._InPatientIssueService.getDraftList(m).subscribe(data => {
      this.chargeslist1 = data as ChargesList[];
      this.dataSource1.data = this.chargeslist1;
    },
      (error) => {
      });
  }
  vBarcode: any;
  barcodeflag: boolean = false;
  barcodeItemfetch() {
    var d = {
      "StockId": this._InPatientIssueService.IndentSearchGroup.get("Barcode").value || 0,
      "StoreId": this._loggedService.currentUserValue.user.storeId || 0
    }
    this._InPatientIssueService.getCurrentStockItem(d).subscribe(data => {
      this.tempDatasource.data = data as any;
      if (this.tempDatasource.data.length >= 1) {
        this.tempDatasource.data.forEach((element) => {
          this.DraftQty = 0;
          this.onAddBarcodeItemList(element, element.IssueQty);
        });
      }
      else if (this.tempDatasource.data.length == 0) {
        this.toastr.error('Item Not Found !', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    });
    this.vBarcode = '';
    this.Addflag = false
  }

  chargeslistBarcode: any = [];
  onAddBarcodeItemList(contact, DraftQty) {
    console.log(contact)
   // debugger
    this.vBarcodeflag = true;
    let i = 0;

    if (this.saleSelectedDatasource.data.length > 0) {
      this.chargeslistBarcode = this.saleSelectedDatasource.data

      this.saleSelectedDatasource.data.forEach((element) => {

        if (element.ItemId == contact.ItemId) {
          this.Itemflag = true;
          this.toastr.warning('Selected Item already added in the list', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
         // debugger


          if (contact.IssueQty != null) {

            this.DraftQty = element.Qty + contact.IssueQty;
            if (this.DraftQty > contact.BalanceQty) {
              Swal.fire("Enter Qty less than Balance :", contact.BalanceQty);
              element.Qty = this.DraftQty - contact.IssueQty;
              this.ItemFormreset();
            }

          } else {
            this.DraftQty = element.Qty + 1;
            if (this.DraftQty > contact.BalanceQty) {
              Swal.fire("Enter Qty less than Balance :", contact.BalanceQty);
              element.Qty = this.DraftQty - 1;
              this.ItemFormreset();
            }
          }


          let TotalMRP = (parseInt(this.DraftQty) * (contact.UnitMRP)).toFixed(2);
          let Vatamount = ((parseFloat(TotalMRP) * (contact.VatPercentage)) / 100).toFixed(2)
          let vFinalNetAmount = (parseFloat(Vatamount) + parseFloat(TotalMRP)).toFixed(2);
          let LandedRateandedTotal = (parseInt(this.DraftQty) * (contact.LandedRate)).toFixed(2);
          let v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
          let PurTotAmt = (parseInt(this.DraftQty) * (contact.PurUnitRateWF)).toFixed(2);

          let CGSTAmt = (((contact.UnitMRP) * (contact.CgstPer) / 100) * (this.DraftQty)).toFixed(2);
          let SGSTAmt = (((contact.UnitMRP) * (contact.SgstPer) / 100) * (this.DraftQty)).toFixed(2);
          let IGSTAmt = (((contact.UnitMRP) * (contact.IgstPer) / 100) * (this.DraftQty)).toFixed(2);

          // let DiscAmt= ((parseFloat(TotalMRP) * (contact.DiscPer)) / 100).toFixed(2)

          let DiscAmt = ((parseFloat(TotalMRP) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
          let NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);



          let BalQty = contact.BalanceQty - this.DraftQty

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
          Swal.fire("Enter Qty less than Balance");
          this.DraftQty = DraftQty - contact.IssueQty;
          this.ItemFormreset();
        }
      } else {
        this.DraftQty = DraftQty + 1;
        if (this.DraftQty > contact.BalanceQty) {
          Swal.fire("Enter Qty less than Balance");
          this.DraftQty = DraftQty - 1;
          this.ItemFormreset();
        }
      }


      let TotalMRP = (parseInt(this.DraftQty) * (contact.UnitMRP)).toFixed(2);
      let Vatamount = ((parseFloat(TotalMRP) * (contact.VatPercentage)) / 100).toFixed(2)
      let TotalNet = (parseFloat(TotalMRP + Vatamount)).toFixed(2)
      let LandedRateandedTotal = (parseInt(this.DraftQty) * (contact.LandedRate)).toFixed(2);
      let v_marginamt = (parseFloat(TotalMRP) - parseFloat(LandedRateandedTotal)).toFixed(2);
      let PurTotAmt = (parseInt(this.DraftQty) * (contact.PurUnitRateWF)).toFixed(2);

      let CGSTAmt = (((contact.UnitMRP) * (contact.CGSTPer) / 100) * (this.DraftQty)).toFixed(2);
      let SGSTAmt = (((contact.UnitMRP) * (contact.SGSTPer) / 100) * (this.DraftQty)).toFixed(2);
      let IGSTAmt = (((contact.UnitMRP) * (contact.IGSTPer) / 100) * (this.DraftQty)).toFixed(2);

      let DiscAmt = ((parseFloat(TotalMRP) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
      let NetAmt = (parseFloat(TotalMRP) - parseFloat(DiscAmt)).toFixed(2);


      this.chargeslistBarcode.push(
        {
          ItemId: contact.ItemId || 0,
          ItemName: contact.ItemName || '',
          BatchNo: contact.BatchNo,
          BatchExpDate: this.datePipe.transform(contact.BatchExpDate, "yyyy-MM-dd") || '01/01/1900',
          BalanceQty: contact.BalanceQty,
          Qty: this.DraftQty || 0,
          UnitMRP: contact.UnitMRP,
          GSTPer: contact.VatPer || 0,
          GSTAmount: Vatamount || 0,
          TotalMRP: TotalMRP,
          DiscPer: contact.DiscPer,
          DiscAmt: DiscAmt || 0,
          NetAmt: TotalNet,
          RoundNetAmt: parseInt(TotalNet),// Math.round(TotalNet),
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
          SalesDraftId: 1

        });
      console.log(this.chargeslistBarcode);
      // });

    }
    this.saleSelectedDatasource.data = this.chargeslistBarcode
    console.log(this.saleSelectedDatasource.data)

    this.vBarcode = 0;
    this.vBarcodeflag = false;
  }
  dsItemNameList1 = new MatTableDataSource<IndentList>();
  IPMedID:any;
  TotalBalQty:any=0;
  getPRESCRIPTION() {
    if (this.ItemSubform.get('PatientType').value == 'IP') {
      const dialogRef = this._matDialog.open(PrescriptionComponent,
        {
          maxWidth: "100%",
          height: '95%',
          width: '95%',
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        console.log(result) 
        this.registerObj = result;
        console.log(this.registerObj)
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
            "ItemId": contact.ItemId,
            "StoreId": this._loggedService.currentUserValue.user.storeId || 0
          }
          this._InPatientIssueService.getDraftBillItem(m_data).subscribe(draftdata => {
            //console.log(draftdata)
            this.Itemchargeslist1 = draftdata as any;
            if (this.Itemchargeslist1.length == 0) {
              Swal.fire(contact.ItemId + " : " + "Item Stock is Not Avilable:")
            }
            else if (this.Itemchargeslist1.length > 0) {
              let ItemID = contact.ItemId;
              // Debugger
              let remaing_qty = contact.QtyPerDay;
              let bal_qnt = 0;
              this.Itemchargeslist1.forEach((element) => { 
                  let PreQty = remaing_qty;
                  if (PreQty > 0){    
                      if (ItemID != element.ItemId) {
                          this.QtyBalchk = 0;
                      }
                      // if (this.QtyBalchk != 1) {
                      if (PreQty <= element.BalanceQty) {
                          this.QtyBalchk = 1;
                          this.getFinalCalculation(element, PreQty);
                          ItemID = element.ItemId;
                          bal_qnt += element.BalanceQty-PreQty;
                      }
                      else if (PreQty > element.BalanceQty) {                          
                          this.QtyBalchk = 1;
                          //Swal.fire("For Item :" + element.ItemId + " adding the Balance Qty: ", element.BalanceQty)
                          this.getFinalCalculation(element, element.BalanceQty);
                          ItemID = element.ItemId;
                      } 
                      remaing_qty = PreQty- element.BalanceQty;
                  }else{
                      bal_qnt+=element.BalanceQty;
                  }
              });
              Swal.fire("Balance Qty is :", String(bal_qnt))
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
  getFinalCalculation(contact, DraftQty) {
    console.log(contact)
    // if (parseInt(contact.BalanceQty) > parseInt(this.)) {


    this.RQty = parseInt(DraftQty);
    if (this.RQty && contact.UnitMRP) {
      this.TotalMRP = (parseInt(this.RQty) * (contact.UnitMRP)).toFixed(2);
      this.LandedRateandedTotal = (parseInt(this.RQty) * (contact.LandedRate)).toFixed(2);
      this.PurTotAmt = (parseInt(this.RQty) * (contact.PurchaseRate)).toFixed(2);

      this.v_marginamt = (parseFloat(this.TotalMRP) - parseFloat(this.LandedRateandedTotal)).toFixed(2);

      this.GSTAmount = (((contact.UnitMRP) * (contact.VatPercentage) / 100) * parseInt(this.RQty)).toFixed(2);
      this.CGSTAmt = (((contact.UnitMRP) * (contact.CGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.SGSTAmt = (((contact.UnitMRP) * (contact.SGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);
      this.IGSTAmt = (((contact.UnitMRP) * (contact.IGSTPer) / 100) * parseInt(this.RQty)).toFixed(2);

      this.NetAmt = (parseFloat(this.TotalMRP) - 0).toFixed(2);

      if (contact.DiscPer > 0) {
        this.DiscAmt = ((this.TotalMRP * (contact.DiscPer)) / 100).toFixed(2);
        this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);

      }


      // if (this.ItemName && (parseInt(contact.Qty) != 0) && this.MRP > 0 && this.NetAmt > 0) {
      // this.saleSelectedDatasource.data = [];

      this.Itemchargeslist.push(
        {
          ItemId: contact.ItemId,
          ItemName: contact.ItemName,
          BatchNo: contact.BatchNo,
          BatchExpDate: this.datePipe.transform(contact.BatchExpDate, "yyyy-MM-dd"),
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
          SalesDraftId: 0
        });
      this.sIsLoading = '';

      this.saleSelectedDatasource.data = this.Itemchargeslist;
      this.ItemFormreset();
    }

    // this.Itemchargeslist=[];
  }
  TotalCreditAmt:any=0;
  TotalAdvanceAmt:any=0;
  TotalBalanceAmt:any=0;
getBillSummary(){
  let query

  query  = "select  SUM(BalanceAmount) as CreditAmount from t_salesheader where OP_IP_ID="+ this.OP_IP_Id 
  this._InPatientIssueService.getBillSummaryQuery(query).subscribe((data) =>{
    console.log(data)
    this.TotalCreditAmt = data[0].CreditAmount ;
  });

  query  = "select AdvanceAmount,BalanceAmount from T_PHAdvanceHeader where OPD_IPD_Id="+ this.OP_IP_Id
  this._InPatientIssueService.getBillSummaryQuery(query).subscribe((data) =>{
    console.log(data)
    let mdata = 
    this.TotalAdvanceAmt = data[0].AdvanceAmount ;
    this.TotalBalanceAmt = data[0].BalanceAmount ;
  }); 
}
ItemFormreset() {
  this.BatchNo = "";
  this.BatchExpDate = "01/01/1900"
  this.MRP = 0;
  this.Qty = '';
  this.Bal = 0;
  this.GSTPer = 0;
  this.DiscPer = 0;
  this.DiscAmt = 0;
  this.TotalMRP = 0;
  this.NetAmt = 0;
  this.v_marginamt = 0;
  this._InPatientIssueService.IndentSearchGroup.get('ItemId').reset('');
  this.filteredOptions = [];
  this.dsBalAvaListStore.data = [];

  // this.add=false;
  this.getPharItemList();
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
  this.ItemSubform.get('CashPay').setValue('CashPay'); 
  this.IsOnlineRefNo = false; 
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
salesIdWiseObj: any;
  getTopSalesDetailsList(MobileNo) {
    var vdata = {
      ExtMobileNo: MobileNo
    }
    this.sIsLoading = 'get-sales-data'
    this._InPatientIssueService.getTopSalesDetails(vdata).subscribe((data: any) => {
      if (data && data.length > 0) {
        this.reportPrintObjItemList = data as Printsal[];
        this.repeatItemList = data;
        // console.log(data)
        this.reportItemPrintObj = data[0] as Printsal;
        this.PatientName = data[0].ExternalPatientName;
        this.DoctorName = data[0].DoctorName;
        this.salesIdWiseObj = this.reportPrintObjItemList.reduce((acc, item: any) => {
          if (!acc[item.SalesId]) {
            acc[item.SalesId] = [];
          }
          acc[item.SalesId].push(item);
          return acc;
        }, {})
        this.sIsLoading = '';
        this.patientname.nativeElement.focus();
        // console.log(this.salesIdWiseObj);
      } else {
        this.sIsLoading = '';
      }
    });
    this.getTopSalesDetailsprint();

  }
  dummySalesIdNameArr = [];
  SalesIdWiseObj: any = {};

  getTopSalesDetailsprint() {
    // 
    var strrowslist = "";
    let onlySalesId = [];
    this.reportPrintObjItemList.forEach(ele => onlySalesId.push(ele.SalesId));

    let SalesidNamesArr = [...new Set(onlySalesId)];
    SalesidNamesArr.forEach(ele => this.dummySalesIdNameArr.push({ SalesId: ele, isHidden: false }));

    this.SalesIdWiseObj = this.reportPrintObjItemList.reduce((acc, item: any) => {
      if (!acc[item.SalesId]) {
        acc[item.SalesId] = [];
      }
      acc[item.SalesId].push(item);
      return acc;
    }, {})
    // console.log(this.SalesIdWiseObj);

    for (let i = 1; i <= this.reportPrintObjItemList.length; i++) {
      var objreportPrint = this.reportPrintObjItemList[i - 1];

      var strabc = this.getSalesIdName(objreportPrint.SalesId) + `
  <div style="display:flex;margin:8px 0">
  <div style="display:flex;width:80px;margin-left:20px;">
      <div>`+ objreportPrint.ItemShortName + `</div>
  </div>
  </div>`;
      strrowslist += strabc;
    }  
  }
  getSalesIdName(SalesId: String) {
    let groupDiv;
    for (let i = 0; i < this.dummySalesIdNameArr.length; i++) {
      if (this.dummySalesIdNameArr[i].SalesId == SalesId && !this.dummySalesIdNameArr[i].isHidden) {
        let groupHeader = `<div style="display:flex;width:960px;margin-left:20px;justify-content:space-between;">
          <div> <h3>`+ SalesId + `</h3></div>
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
  // to handel functio keys
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    // f10
    // if (event.keyCode === 121) {
    //   this.Formreset();
    // }
    // f8
    if (event.keyCode === 119) {
      // this.onSave();
      this.onsubstitutes();
    }
    // f9
    if (event.keyCode === 120) {
      // this.Functionflag = 1
      //this.onSave(event);
    }

  }
  onsubstitutes() {
    throw new Error('Method not implemented.');
  }
add: Boolean = false;
@ViewChild('discamt') discamt: ElementRef;
@ViewChild('doctorname') doctorname: ElementRef;
@ViewChild('mobileno') mobileno: ElementRef;
@ViewChild('disper') disper: ElementRef;
@ViewChild('discamount') discamount: ElementRef;
@ViewChild('patientname') patientname: ElementRef;
@ViewChild('address') address: ElementRef;
@ViewChild('itemid') itemid: ElementRef;
// @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
@ViewChild('addbutton') addbutton: ElementRef;
// showSearch(){
//   this.add = !this.add;    
//   this.searchElement.nativeElement.focus();
//   alert("focus");
// }

public onEnterqty(event): void {
  if (event.which === 13) {
    this.disper.nativeElement.focus();
    this.calculateTotalAmt()
  }
}
public onEnterdiscper(event): void {

  if (event.which === 13) {
    this.discamount.nativeElement.focus();
  }
}

public onEnterpatientname(event): void {
  if (event.which === 13) {
    // this.itemid.nativeElement.focus();
    this.doctorname.nativeElement.focus();
  }
}
public onEntermobileno(event): void {
  if ((this.ItemSubform.get('MobileNo').value && this.ItemSubform.get('MobileNo').value.length == 10)) {
    this.getTopSalesDetailsList(this.MobileNo);
    this.patientname.nativeElement.focus();
  }
}
public onEnterdiscAmount(event): void {
  if (event.which === 13) {
    // this.addbutton.focus();
    this.addbutton.nativeElement.focus();
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
onChangePaymentMode(event) {
  if (event.value == 'Online') {
    this.IsOnlineRefNo = true;
  
    this.ItemSubform.get('referanceNo').reset();
    this.ItemSubform.get('referanceNo').setValidators([Validators.required]);
    this.ItemSubform.get('referanceNo').enable();
    // other payment Option   
    this.isPaymentSelected = false;

  } else if (event.value == 'Other') {
    // this.isPaymentSelected = true;
    // this.amount1 = this.FinalNetAmount;
    // this.paidAmt = this.FinalNetAmount;
    // this.netPayAmt = this.FinalNetAmount;
    // this.getBalanceAmt();
    // this.paymentRowObj["cash"] = true;
    // this.vPaymode='Online';

    this.IsOnlineRefNo = false;
    this.ItemSubform.get('referanceNo').clearValidators();
    this.ItemSubform.get('referanceNo').updateValueAndValidity();
  } else if (event.value == "PayOption") {
    this.IsOnlineRefNo = false;
    this.ItemSubform.get('referanceNo').clearValidators();
    this.ItemSubform.get('referanceNo').updateValueAndValidity();
  }else if (event.value == "Credit") {
    this.vPaymode='Credit';
  }
  else {
    this.IsOnlineRefNo = false;
    this.ItemSubform.get('referanceNo').clearValidators();
    this.ItemSubform.get('referanceNo').updateValueAndValidity();
    // other payment Option   
    this.isPaymentSelected = false;
  }

}
}

export class IndentList {
  SalesNo: any
  ItemId: any;
  ItemName: string;
  ItemShortName: any;
  BatchNo: string;
  BatchExpDate: any;
  BalanceQty: any;
  QtyPerDay: any;
  UnitMRP: any;
  Qty: number;
  IssueQty: number;
  Bal: number;
  StoreId: any;
  StoreName: any;
  GSTPer: any;
  GSTAmount: any;
  TotalMRP: any;
  DiscPer: any;
  DiscAmt: any;
  NetAmt: any;
  StockId: any;
  ReturnQty: any;
  TotalAmount: any;
  Total: any;
  VatPer: any;
  VatAmount: any;
  LandedRate: any;
  CgstPer: any;
  CGSTAmt: any;
  SgstPer: any;
  SGSTAmt: any;
  IgstPer: any;
  IGSTAmt: any;
  LandedRateandedTotal: any;
  PurchaseRate: any;
  PurTotAmt; any;
  BalanceAmount: any;
  PatientName: any;
  SalesReturnId: any;
  DiscAmount: any;
  NetAmount: any;
  MarginAmt: any;
  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {
      this.SalesNo = IndentList.SalesNo || 0;
      this.ItemId = IndentList.ItemId || 0;
      this.ItemName = IndentList.ItemName || "";
      this.ItemShortName = IndentList.ItemShortName || "";
      this.BatchNo = IndentList.BatchNo || "";
      this.BatchExpDate = IndentList.BatchExpDate || "";
      this.UnitMRP = IndentList.UnitMRP || "";
      this.ItemName = IndentList.ItemName || "";
      this.Qty = IndentList.Qty || 0;
      this.IssueQty = IndentList.IssueQty || 0;
      this.QtyPerDay = IndentList.QtyPerDay || 0;
      this.Bal = IndentList.Bal || 0;
      this.StoreId = IndentList.StoreId || 0;
      this.StoreName = IndentList.StoreName || '';
      this.GSTPer = IndentList.GSTPer || "";
      this.TotalMRP = IndentList.TotalMRP || 0;
      this.DiscAmt = IndentList.DiscAmt || 0;
      this.NetAmt = IndentList.NetAmt || 0;
      this.StockId = IndentList.StockId || 0;
      this.NetAmt = IndentList.NetAmt || 0;
      this.ReturnQty = IndentList.ReturnQty || 0;
      this.TotalAmount = IndentList.TotalAmount || 0;
      this.Total = IndentList.Total || '';
      this.VatPer = IndentList.VatPer || 0;
      this.VatAmount = IndentList.VatAmount || 0;
      this.LandedRate = IndentList.LandedRate || 0;
      this.CgstPer = IndentList.CgstPer || 0;
      this.CGSTAmt = IndentList.CGSTAmt || 0;
      this.SgstPer = IndentList.SgstPer || 0;
      this.SGSTAmt = IndentList.SGSTAmt || 0;
      this.IgstPer = IndentList.IgstPer || 0;
      this.IGSTAmt = IndentList.IGSTAmt || 0;
      this.BalanceAmount = IndentList.BalanceAmount || 0;
      this.PatientName = IndentList.PatientName || '';
      this.SalesReturnId = IndentList.SalesReturnId || 0;
      this.NetAmount = IndentList.NetAmount || 0;
      this.DiscAmount = IndentList.DiscAmount || 0;
      this.MarginAmt = IndentList.MarginAmt || 0;
    }
  }
}
export class IndentID {
  IndentNo: Number;
  IndentDate: number;
  FromStoreName: string;
  ToStoreName: string;
  Addedby: number;
  IsInchargeVerify: string;
  IndentId: any;
  FromStoreId: boolean;

  /**
   * Constructor
   *
   * @param IndentID
   */
  constructor(IndentID) {
    {
      this.IndentNo = IndentID.IndentNo || 0;
      this.IndentDate = IndentID.IndentDate || 0;
      this.FromStoreName = IndentID.FromStoreName || "";
      this.ToStoreName = IndentID.ToStoreName || "";
      this.Addedby = IndentID.Addedby || 0;
      this.IsInchargeVerify = IndentID.IsInchargeVerify || "";
      this.IndentId = IndentID.IndentId || "";
      this.FromStoreId = IndentID.FromStoreId || "";
    }
  }
}

export class BalAvaListStore {
  StoreName: any;
  BalQty: any;

  /**
   * Constructor
   *
   * @param BalAvaListStore
   */
  constructor(BalAvaListStore) {
    {
      this.StoreName = BalAvaListStore.StoreName || "";
      this.BalQty = BalAvaListStore.BalQty || 0;
    }
  }
}
export class DraftSale {
  DSalesId: any;
  PatientName: any;
  RegID: any;
  Time: any;
  NetAmount: any;
  OP_IP_ID: any;
  OP_IP_Type: any;
  WardId: any;
  BedId: any;
  IsPrescription: any;
  ExtMobileNo: any;
  extAddress: any;

  /**
   * Constructor
   *
   * @param DraftSale
   */
  constructor(DraftSale) {
    {
      this.DSalesId = DraftSale.DSalesId || 0;
      this.PatientName = DraftSale.PatientName || 0;
      this.RegID = DraftSale.RegID || "";
      this.Time = DraftSale.Time || "";
      this.NetAmount = DraftSale.NetAmount || 0;
      this.OP_IP_ID = DraftSale.OP_IP_ID || "";
      this.OP_IP_Type = DraftSale.OP_IP_Type || "";
      this.WardId = DraftSale.WardId || "";
      this.BedId = DraftSale.BedId || "";
      this.IsPrescription = DraftSale.IsPrescription || "";
      this.ExtMobileNo = DraftSale.ExtMobileNo || "";
      this.extAddress = DraftSale.extAddress || "";

    }
  }
}

export class Printsal {
  PatientName: any;
  RegNo: any;
  ItemShortName: any;
  SalesId: any;
  StoreName: any;
  IP_OP_Number: any;
  DoctorName: any;
  SalesNo: any;
  Date: Date;
  Time: Date;
  ItemName: any;
  OP_IP_Type: any;
  GenderName: any;
  AgeYear: any;
  BatchNo: any;
  BatchExpDate: any;
  UnitMRP: any;
  Qty: any;
  TotalAmount: any;
  GrossAmount: any;
  NetAmount: any;
  RoundNetAmt: any;
  VatPer: any;
  VatAmount: any;
  DiscAmount: any;
  ConcessionReason: any;
  PaidAmount: any;
  BalanceAmount: any;
  UserName: any;
  HSNcode: any;
  CashPayAmount: any;
  CardPayAmount: any;
  ChequePayAmount: any;
  PayTMAmount: any;
  NEFTPayAmount: any;

  CardNo: any;
  ChequeNo: any;
  PayTMTranNo: any;
  NEFTNo: any;


  GSTPer: any;
  GSTAmount: any;
  CGSTAmt: any;
  CGSTPer: any;
  SGSTPer: any;
  SGSTAmt: any;
  IGSTPer: any;
  IGSTAmt: any;
  ManufShortName: any;
  StoreNo: any;
  DL_NO: any;
  GSTIN: any;
  CreditReason: any;
  CompanyName: any;
  HTotalAmount: any;
  ExtMobileNo: any;
  StoreAddress: any;
  PayMode: any;
  MRNO: any;
  AdvanceUsedAmount: any;
  Label: any;
  ConversionFactor: any;
  TotalBillAmount: any;
  BalAmount: any;
  CashPay: any;
  ChequePay: any;
  CardPay: any;
  NEFTPay: any;
  OnlinePay: any;
  PrintStoreName: any;
  PatientType: any;
  BillVatAmount: any;
  BillDiscAmount: any;
  BillTotalAmount: any;
  HospitalMobileNo: any;
  HospitalEmailId: any;
  SalesReturnNo: any;
  RoundOff: any;


  Consructur(Printsal) {
    this.PatientName = Printsal.PatientName || '';
    this.RegNo = Printsal.RegNo || 0;
    this.IP_OP_Number = Printsal.OP_IP_Number || "";
    this.DoctorName = Printsal.DoctorName || "";
    this.Date = Printsal.Date || 0;
    this.Time = Printsal.Time || "";
    this.OP_IP_Type = Printsal.OP_IP_Type || "";
    this.GenderName = Printsal.GenderName || "";

    this.AgeYear = Printsal.AgeYear || '';
    this.BatchNo = Printsal.BatchNo || 0;
    this.BatchExpDate = Printsal.BatchExpDate || "";
    this.UnitMRP = Printsal.UnitMRP || "";
    this.Qty = Printsal.Qty || 0;
    this.TotalAmount = Printsal.TotalAmount || "";
    this.GrossAmount = Printsal.GrossAmount || "";
    this.NetAmount = Printsal.NetAmount || "";
    this.RoundNetAmt = Printsal.RoundNetAmt || "";
    this.VatPer = Printsal.VatPer || '';
    this.VatAmount = Printsal.VatAmount || 0;
    this.DiscAmount = Printsal.DiscAmount || "";
    this.ConcessionReason = Printsal.ConcessionReason || "";
    this.PaidAmount = Printsal.PaidAmount || 0;
    this.BalanceAmount = Printsal.BalanceAmount || "";
    this.UserName = Printsal.UserName || "";
    this.HSNcode = Printsal.HSNcode || "";

    this.CashPayAmount = Printsal.CashPayAmount || '';
    this.CardPayAmount = Printsal.CardPayAmount || 0;
    this.NEFTPayAmount = Printsal.NEFTPayAmount || "";
    this.PayTMAmount = Printsal.PayTMAmount || "";
    this.ChequePayAmount = Printsal.ChequePayAmount || 0;
    this.GSTPer = Printsal.GSTPer || "";
    this.GSTAmount = Printsal.GSTAmount || "";
    this.SGSTPer = Printsal.SGSTPer || "";
    this.SGSTAmt = Printsal.SGSTAmt || 0;
    this.CGSTPer = Printsal.CGSTPer || "";
    this.CGSTAmt = Printsal.CGSTAmt || "";
    this.IGSTPer = Printsal.IGSTPer || "";
    this.IGSTAmt = Printsal.IGSTAmt || "";
    this.StoreName = Printsal.StoreName || '';
    this.StoreNo = Printsal.StoreNo || "";
    this.DL_NO = Printsal.DL_NO || "";
    this.GSTIN = Printsal.GSTIN || "";
    this.CreditReason = Printsal.CreditReason || "";
    this.CompanyName = Printsal.CompanyName || "";
    this.ItemShortName = Printsal.ItemShortName || ''
    this.HTotalAmount = Printsal.HTotalAmount || '';
    this.ExtMobileNo = Printsal.ExtMobileNo || '';
    this.StoreAddress = Printsal.StoreAddress || '';
    this.PayMode = Printsal.PayMode || '';

    this.ItemShortName = Printsal.ItemShortName || ''
    this.HTotalAmount = Printsal.HTotalAmount || '';
    this.ExtMobileNo = Printsal.ExtMobileNo || '';
    this.StoreAddress = Printsal.StoreAddress || '';
    this.PayMode = Printsal.PayMode || '';
    this.MRNO = Printsal.MRNO || '';
    this.AdvanceUsedAmount = Printsal.PayMode || '';
    this.Label = Printsal.Label || ';'
    this.TotalBillAmount = Printsal.PayMode || '';
    this.CashPay = Printsal.CashPay || '';
    this.ChequePay = Printsal.ChequePay || '';
    this.CardPay = Printsal.CardPay || '';
    this.NEFTPay = Printsal.NEFTPay || '';
    this.OnlinePay = Printsal.OnlinePay || '';
    this.PrintStoreName = Printsal.PrintStoreName || '';
    this.PatientType = Printsal.PatientType || '';

    this.BillVatAmount = Printsal.BillVatAmount || '';
    this.BillDiscAmount = Printsal.BillDiscAmount || '';
    this.BillTotalAmount = Printsal.BillTotalAmount || '';
    this.HospitalMobileNo = Printsal.HospitalMobileNo || '';
    this.HospitalEmailId = Printsal.HospitalEmailId || '';
    this.ConversionFactor = Printsal.ConversionFactor || '';
    this.SalesReturnNo = Printsal.SalesReturnNo || 0;
    this.RoundOff = Printsal.RoundOff || 0;
  }
}

function Consructur() {
  throw new Error('Function not implemented.');
}



