import { ApplicationRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, HostListener, Injector, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SalesService } from './sales.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { SalePopupComponent } from './sale-popup/sale-popup.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { ConditionalExpr } from '@angular/compiler';
import { Subscription } from 'rxjs';
import * as converter from 'number-to-words';
import { ItemNameList } from 'app/main/inventory/issue-to-department/issue-to-department.component';
import { IpPaymentInsert } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponentPortal, DomPortalOutlet, PortalInjector } from '@angular/cdk/portal';
import { HeaderComponent } from 'app/main/shared/componets/header/header.component';
import { element } from 'protractor';



@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class SalesComponent implements OnInit {

  @ViewChild('Quantity') Quantity: ElementRef;
  @ViewChild('discAmount') discAmount: ElementRef;
  @ViewChild('ConseId') ConseId: ElementRef;

  ItemSubform: FormGroup;
  sIsLoading: string = '';
  isLoading = true;
  Store1List: any = [];
  screenFromString = 'admission-form';
  filteredOptions: any;
  noOptionFound: boolean = false;
  labelPosition: 'before' | 'after' = 'after';
  isItemIdSelected: boolean = false;
  dsIndentID = new MatTableDataSource<IndentID>();

  ItemName: any;
  ItemId: any;
  BalanceQty: any;
  Itemchargeslist: any = [];
  ConcessionReasonList: any = [];

  BatchNo: any;
  BatchExpDate: any;
  UnitMRP: any;
  Qty: any = 1;
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

  ConShow: Boolean = false;
  ItemObj: IndentList;

  paidamt: number;
  flagSubmit: boolean;
  balanceamt: number;
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

  BalAmount: any = 0;
  MobileNo: any;
  gstAmt: any;
  DoctorName: any;
  isPatienttypeDisabled: boolean = true;
  chkdiscper: boolean = true;
  stockidflag: boolean = true;
  deleteflag: boolean = true;
  reportPrintObj: Printsal;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: Printsal[] = [];
  GSTAmount: any;

  dsIndentList = new MatTableDataSource<IndentList>();
  datasource = new MatTableDataSource<IndentList>();
  saleSelectedDatasource = new MatTableDataSource<IndentList>();

  vSalesDetails: any = [];
  vSalesIdList: any = [];

  displayedColumns = [
    'FromStoreId',
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'IsInchargeVerify',
    'action',
  ];

  displayedColumns1 = [
    'ItemName',
    'Qty',
    'IssQty',
    'Bal',
  ];

  selectedSaleDisplayedCol = [
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'Qty',
    'UnitMRP',
    'GSTPer',
    'GSTAmount',
    'TotalMRP',
    'DiscAmt',
    'NetAmt',
    // 'StkId',
    'buttons'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _salesService: SalesService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private _loggedService: AuthenticationService,
    private injector: Injector,
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef

  ) { }

  ngOnInit(): void {
    // this.Itemchargeslist = [];
    this.gePharStoreList();
    this.getItemSubform();
    this.getConcessionReasonList();
    // this.getTopSalesDetailsList();
  }

  getItemSubform() {
    this.ItemSubform = this.formBuilder.group({
      PatientName: '',
      DoctorName: '',
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      PatientType: ['External'],
      TotalAmt: '',
      GSTPer: '',
      DiscAmt: '',
      concessionAmt: [0],
      ConcessionId: 0,
      Remark: [''],
      FinalAmount: '',
      BalAmount: '',
      FinalDiscPer: '',
      FinalDiscAmt: '',
      FinalTotalAmt: '',
      FinalNetAmount: '',
      FinalGSTAmt: '',
      BalanceAmt: '',
      CashPay: ['CashPay'],
      // Credit: [0]
    });
  }


  getConcessionReasonList() {
    this._salesService.getConcessionCombo().subscribe(data => {
      this.ConcessionReasonList = data;
      // this.Ipbillform.get('ConcessionId').setValue(this.ConcessionReasonList[1]);
    })
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  getPharItemList() {
    var m_data = {
      "ItemName": `${this._salesService.IndentSearchGroup.get('ItemId').value}%`,
      "StoreId": this._salesService.IndentSearchGroup.get('StoreId').value.storeid || 0
    }
    if (this._salesService.IndentSearchGroup.get('ItemId').value.length >= 2) {
      this._salesService.getItemList(m_data).subscribe(data => {
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

    if (this.BalanceQty > 0) {
      this.getBatch();
    }
  }

  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._salesService.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
      this._salesService.IndentSearchGroup.get('StoreId').setValue(this.Store1List[0]);
      this.StoreName = this._salesService.IndentSearchGroup.get('StoreId').value.StoreName;
    });
  }

  getTopSalesDetailsList(MobileNo) {
    var vdata = {
      ExtMobileNo: MobileNo //this.ItemSubform.get('MobileNo').value 
    }
    this._salesService.getTopSalesDetails(vdata).subscribe(data => {
      this.vSalesDetails = data;
      console.log(data)
      this.PatientName = data[0].ExternalPatientName;
      this.DoctorName = data[0].DoctorName;
    });

    this.vSalesDetails.forEach((element) => {
    this.vSalesIdList.push(element.SalesID)
    console.log('SalesID :', this.vSalesIdList)
  });
  
  }
  onClear() {

  }

  onAdd() {
    this.sIsLoading = 'save';
    let Qty = this._salesService.IndentSearchGroup.get('Qty').value
    if (this.ItemName && (parseInt(Qty) != 0) && this.MRP > 0 && this.NetAmt > 0) {
      this.saleSelectedDatasource.data = [];
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
          DiscAmt: this._salesService.IndentSearchGroup.get('DiscAmt').value || 0,
          NetAmt: this.NetAmt,
          StockId: this.StockId,
        });
      this.sIsLoading = '';
      this.saleSelectedDatasource.data = this.Itemchargeslist;
      this.ItemFormreset();
    }
    this.itemid.nativeElement.focus();
    this.add = false;
  }

  OnAddUpdate(event) {

    this.sIsLoading = 'save';
    // let Qty = this._salesService.IndentSearchGroup.get('Qty').value

    if (this.Itemchargeslist.length > 0) {
      this.Itemchargeslist.forEach((element) => {
        if (element.StockId.toString().toLowerCase().search(this.StockId) !== -1) {
          debugger
          this.stockidflag = false;
          // Swal.fire('Item from Present StockID');
          console.log(element);
          debugger
          this.Qty= parseInt(this.Qty) + parseInt(element.Qty);
          this.TotalMRP = this.Qty * this.UnitMRP,
           
          this.GSTAmount = this.GSTAmount + parseFloat(element.GSTAmount);
          this.NetAmt = parseFloat(this.NetAmt) + (parseFloat(element.NetAmt));
          this.DiscAmt = parseFloat(element.DiscAmt) + this.DiscAmt;
          this.ItemId =element.ItemId;
          this.ItemName=element.ItemName;
          this.BatchNo=element.BatchNo;
          this.StockId=element.StockId; 
          this.BatchExpDate=element.BatchExpDate  || '01/01/1900';
          this.deleteflag=false;
          this.deleteTableRow(event, element);
          
          // this.Itemchargeslist.push(
          //   {

          //     ItemId: this.ItemId,
          //     ItemName: this.ItemName,
          //     BatchNo: this.BatchNo,
          //     BatchExpDate: this.BatchExpDate || '01/01/1900',
          //     Qty: this.Qty + element.Qty,
          //     UnitMRP: this.MRP,
          //     GSTPer: this.GSTPer || 0,
          //     GSTAmount: this.GSTAmount || 0,
          //     TotalMRP: this.TotalMRP,
          //     DiscAmt: this._salesService.IndentSearchGroup.get('DiscAmt').value || 0,
          //     NetAmt: this.NetAmt,
          //     StockId: this.StockId,

          //   });
          // this.saleSelectedDatasource.data = this.Itemchargeslist;
          // this.ItemFormreset();

        } 
        // else {
        //   this.stockidflag = true;
        // }

      });

    }
    
    if (this.stockidflag == true) {
      this.onAdd();
    }else{
       
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
              DiscAmt: this.DiscAmt| 0,
              NetAmt: this.NetAmt,
              StockId: this.StockId,

            });
          this.saleSelectedDatasource.data = this.Itemchargeslist;
          this.ItemFormreset();

    }

    this.itemid.nativeElement.focus();
    this.add = false;


  }

  getBatch() {
    this.Quantity.nativeElement.focus();
    const dialogRef = this._matDialog.open(SalePopupComponent,
      {
        maxWidth: "800px",
        minWidth: '800px',
        width: '800px',
        height: '380px',
        disableClose: true,
        data: {
          "ItemId": this._salesService.IndentSearchGroup.get('ItemId').value.ItemId,
          "StoreId": this._salesService.IndentSearchGroup.get('StoreId').value.storeid
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.BatchNo = result.BatchNo;
      this.BatchExpDate = this.datePipe.transform(result.BatchExpDate, "MM-dd-yyyy");
      this.MRP = result.UnitMRP;
      this.Qty = 1;
      this.Bal = result.BalanceAmt;
      this.GSTPer = result.VatPercentage;

      this.TotalMRP = this.Qty * this.MRP;
      this.DiscAmt = 0;
      this.NetAmt = this.TotalMRP;
      this.BalanceQty = this.BalanceQty;
      this.ItemObj = result;

      this.VatPer = result.VatPercentage;
      this.CgstPer = result.CGSTPer;
      this.SgstPer = result.SGSTPer;
      this.IgstPer = result.IGSTPer;

      this.VatAmount = result.VatPercentage;
      this.CGSTAmt = result.VatPercentage;
      this.SGSTAmt = result.VatPercentage;
      this.IGSTAmt = result.VatPercentage;
      this.StockId = result.StockId
      this.StoreId = result.StoreId;
      this.LandedRate = result.LandedRate;
      this.PurchaseRate = result.PurchaseRate;
      this.UnitMRP = result.UnitMRP;
    });

    this.Quantity.nativeElement.focus();
  }

  focusNextService() {
    // this.renderer.selectRootElement('#myInput').focus();
  }

  ItemFormreset() {
    this.BatchNo = "";
    this.BatchExpDate = "01/01/1900"
    this.MRP = 0;
    this.Qty = 1;
    this.Bal = 0;
    this.GSTPer = 0;
    this.DiscPer=0;
    this.DiscAmt=0;
    this.TotalMRP = 0;
    this.NetAmt = 0;
    this._salesService.IndentSearchGroup.get('ItemId').reset('');

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
  }


  getNetAmtSum(element) {
    let netAmt;
    netAmt = (element.reduce((sum, { NetAmt }) => sum += +(NetAmt || 0), 0)).toFixed(2);
    this.FinalTotalAmt = netAmt;
    this.FinalNetAmount = this.FinalTotalAmt;


    this.TotDiscAmt = (element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0)).toFixed(2);
    // this.ItemSubform.get('FinalNetAmount').setValue(this.FinalTotalAmt)
    return netAmt;
  }
  getGSTSum(element) {
    let TotGST;
    TotGST = (element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0)).toFixed(2);
    return TotGST;
  }

  calculateTotalAmt() {

    let Qty = this._salesService.IndentSearchGroup.get('Qty').value
    if (Qty > this.BalanceQty) {
      Swal.fire("Enter Qty less than Balance");
      this.ItemFormreset();
    }

    if (Qty && this.MRP) {
      this.TotalMRP = (parseInt(Qty) * (this._salesService.IndentSearchGroup.get('MRP').value)).toFixed(2);
      debugger
      // let GST = this.GSTPer;
      if (this.GSTPer > 0) {
        this.GSTAmount = ((this.TotalMRP * (this.GSTPer)) / 100).toFixed(2);
        this.NetAmt = (parseFloat(this.TotalMRP) + parseFloat(this.GSTAmount)).toFixed(2);

        // let NetAmt =(this.TotalMRP + this.gstAmt);
        // this.NetAmt = netAmount;
      }

      this.FinalGSTAmt = ((this.UnitMRP) * (this.VatPer) / 100 * parseInt(Qty)).toFixed(2);
      console.log("Vat", this.FinalGSTAmt);
      this.CGSTAmt = (((this.UnitMRP) * (this.CgstPer) / 100) * parseInt(Qty)).toFixed(2);
      console.log("CGST", this.CGSTAmt);
      this.SGSTAmt = (((this.UnitMRP) * (this.SgstPer) / 100) * parseInt(Qty)).toFixed(2);
      console.log("SGST", this.SGSTAmt);
      this.IGSTAmt = (((this.UnitMRP) * (this.IgstPer) / 100) * parseInt(Qty)).toFixed(2);
      console.log("IGST", this.IGSTAmt);
      this.TotalMRP = ((Qty) * (this.MRP)).toFixed(2);
      console.log("TotMRP", this.TotalMRP);

      //  disc need to chk
      //  this.TotDiscAmt = (parseInt(Qty) * parseInt(this.MRP)).toFixed(2)
      console.log("TotDiscAmt", this.TotDiscAmt);
      this.LandedRateandedTotal = (parseInt(Qty) * (this.LandedRate)).toFixed(2)
      console.log("TotLandedRate", this.LandedRateandedTotal);
      this.PurTotAmt = (parseInt(Qty) * (this.PurchaseRate)).toFixed(2)
      console.log("TotPureRate", this.PurTotAmt);


    }



    // txtMRPTotal.Text = Format(Val(txtIssueQty.Text) * Val(txtPerMRP.Text), "0.00")
    // txtTotMRPAftDisAmt.Text = Format(Val(txtIssueQty.Text) * Val(txtPerMRP.Text), "0.00")
    // txtLandedTotal.Text = Format(Val(txtIssueQty.Text) * Val(txtUnitLandedRate.Text), "0.00")
    // txtPurTotAmt.Text = Format(Val(txtIssueQty.Text) * Val(txtPurUnitRateWF.Text), "0.00")
    // Call CalculateVatAmount()

    // Dim lngVatAmount, lngCGSTAmt, lngSGSTAmt, lngIGSTAmt As Double
    // lngVatAmount = (Val(txtPerMRP.Text) * Val(txtVatPer.Text) / 100) * Val(txtIssueQty.Text)
    // lngCGSTAmt = (Val(txtPerMRP.Text) * Val(txtCGSTPer.Text) / 100) * Val(txtIssueQty.Text)
    // lngSGSTAmt = (Val(txtPerMRP.Text) * Val(txtSGSTPer.Text) / 100) * Val(txtIssueQty.Text)
    // lngIGSTAmt = (Val(txtPerMRP.Text) * Val(txtIGSTPer.Text) / 100) * Val(txtIssueQty.Text)

    // footer total
    // txtPerItemVatAmt.Text = Format(lngVatAmount, "0.00")
    // txtCGSTAmt.Text = Format(lngCGSTAmt, "0.00")
    // txtSGSTAmt.Text = Format(lngSGSTAmt, "0.00")
    // txtIGSTAmt.Text = Format(lngIGSTAmt, "0.00")


  }

  calculateDiscAmt() {
    if (parseFloat(this.DiscAmt) > 0 && (parseFloat(this.DiscAmt)) < parseFloat(this.TotalMRP)) {
      this.NetAmt = (this.TotalMRP - (this._salesService.IndentSearchGroup.get('DiscAmt').value)).toFixed(2);
      this.add = true;
      this.addbutton.focus();
    }
    else if (parseFloat(this.DiscAmt) > parseFloat(this.NetAmt)) {
      Swal.fire('Check Discount Amount !')
    }
    if (parseFloat(this.DiscAmt) == 0) {
      this.add = true;
      this.addbutton.focus();
    }
  }

  // calculateGSTAmt() {
  //   let GST = this._salesService.IndentSearchGroup.get('GSTPer').value
  //   if (GST > 0) {
  //     this.GSTAmount = ((this.NetAmt * (GST)) / 100);
  //     // this.DiscAmt = this.GSTAmount.toFixed(2);
  //     this.NetAmt = ((this.NetAmt) - (discAmt)).toFixed(2);
  //   }
  // }

  getDiscPer() {
    debugger
    let DiscPer = this._salesService.IndentSearchGroup.get('DiscPer').value
    if (this.DiscPer > 0) {
      this.DiscAmt = ((this.TotalMRP * (this.DiscPer)) / 100).toFixed(2);
      this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);
      this.ItemSubform.get('DiscAmt').disable();
    } else {
      this.chkdiscper = true;
      this.DiscAmt=0;
      this.ItemSubform.get('DiscAmt').enable();
      this.NetAmt = (this.TotalMRP - this.DiscAmt).toFixed(2);
    }
  }

  getFinalDiscperAmt() {
    let Disc = this.ItemSubform.get('FinalDiscPer').value;
    // this.FinalDiscAmt=0
    // if (Disc > 0) {
    //   this.FinalDiscAmt = ((this.FinalTotalAmt * (Disc)) / 100).toFixed(2);
    //   this.FinalNetAmount = ((this.FinalTotalAmt) - (this.FinalDiscAmt)).toFixed(2);
    //   this.ConShow = true
    // }

    if (Disc > 0) {
      this.ConShow = true
      this.FinalDiscAmt = ((this.FinalTotalAmt * (Disc)) / 100).toFixed(2);
      this.FinalNetAmount = ((this.FinalTotalAmt) - (this.FinalDiscAmt)).toFixed(2);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();

    } else {

      this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();

      this.ConseId.nativeElement.focus();

    }

    this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
  }

  getFinalDiscAmount() {
    let Discamt = this.ItemSubform.get('FinalDiscAmt').value

    if (Discamt > 0 && Discamt < this.FinalNetAmount) {
      this.FinalNetAmount = ((this.FinalNetAmount) - (Discamt)).toFixed(2);
      this.ConShow = true
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').setValidators([Validators.required]);
      this.ItemSubform.get('ConcessionId').enable();

    } else {

      this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
      this.ItemSubform.get('ConcessionId').reset();
      this.ItemSubform.get('ConcessionId').clearValidators();
      this.ItemSubform.get('ConcessionId').updateValueAndValidity();

      this.ConseId.nativeElement.focus();

    }
  }



  CalfinalGST() {
    let GST = this.ItemSubform.get('FinalGSTAmt').value
    if (GST > 0 && GST < this.FinalNetAmount) {
      this.FinalNetAmount = ((this.FinalNetAmount) + (GST))
      this.ConShow = true
    }
    this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount.toFixed(2));
  }
  // key: any;
  // @HostListener('document:keyup', ['$event'])
  // handleDeleteKeyboardEvent(event: KeyboardEvent, s) {
  //   if (event.key === 'Delete') {
  //     this.key = 'Delete';

  //   }
  // }
  // @HostListener('document:keydown.delete', ['$event'])

  // show(eve, contact) {
  //   // Swal.fire(contact);
  //   if (this.key == "Delete") {
  //     this.deleteTableRow(eve, contact);
  //   }
  // }


  onChangePatientType(event) {
    if (event.value == 'External') {

      this.ItemSubform.get('MobileNo').reset();
      this.ItemSubform.get('MobileNo').setValidators([Validators.required]);
      this.ItemSubform.get('MobileNo').enable();
      this.ItemSubform.get('PatientName').reset();
      this.ItemSubform.get('PatientName').setValidators([Validators.required]);
      this.ItemSubform.get('PatientName').enable();


    } else {
      // this.Regdisplay = true;

      this.ItemSubform.get('MobileNo').disable();

      this.ItemSubform.get('PatientName').disable();
      this.isPatienttypeDisabled = false;

      this.ItemSubform.get('MobileNo').reset();
      this.ItemSubform.get('MobileNo').clearValidators();
      this.ItemSubform.get('MobileNo').updateValueAndValidity();

      this.ItemSubform.get('PatientName').reset();
      this.ItemSubform.get('PatientName').clearValidators();
      this.ItemSubform.get('PatientName').updateValueAndValidity();

    }


  }



  convertToWord(e) {

    return converter.toWords(e);
  }


  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }

  transform1(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy');
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


  onSave() {
    if (this.ItemSubform.get('CashPay').value == 'CashPay') {
      this.onCashpaySave()
    }
    else if (this.ItemSubform.get('CashPay').value == 'Credit') {
      this.onCreditpaySave()
    }
  }

  onCashpaySave() {


    // if (this._salesService.IndentSearchGroup.get('PatientType').value == "External" && this.PatientName  != null && this.MobileNo != null) {
    let NetAmt = (this.ItemSubform.get('FinalNetAmount').value);
    let ConcessionId = 0;
    if (this.ItemSubform.get('ConcessionId').value)
      ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

    // if (this.flagSubmit) {
    console.log("Procced with Payment Option");

    let SalesInsert = {};
    SalesInsert['Date'] = this.dateTimeObj.date;
    SalesInsert['time'] = this.dateTimeObj.time;
    SalesInsert['oP_IP_ID'] = 0;
    SalesInsert['oP_IP_Type'] = 2;
    SalesInsert['totalAmount'] = this.FinalTotalAmt
    SalesInsert['vatAmount'] = this.VatAmount;
    SalesInsert['discAmount'] = this.FinalDiscAmt;
    SalesInsert['netAmount'] = NetAmt;
    SalesInsert['paidAmount'] = NetAmt;
    SalesInsert['balanceAmount'] = 0;
    SalesInsert['concessionReasonID'] = ConcessionId || 0;
    SalesInsert['concessionAuthorizationId'] = 0;
    SalesInsert['isSellted'] = 0;
    SalesInsert['isPrint'] = 0;
    SalesInsert['isFree'] = 0;
    SalesInsert['unitID'] = 1;
    SalesInsert['addedBy'] = this._loggedService.currentUserValue.user.id,
      SalesInsert['externalPatientName'] = this.PatientName;
    SalesInsert['doctorName'] = "";
    SalesInsert['storeId'] = this._salesService.IndentSearchGroup.get('StoreId').value.storeid;
    SalesInsert['isPrescription'] = 0;
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
    SalesInsert['extMobileNo'] = this.MobileNo;

    let salesDetailInsertarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let salesDetailInsert = {};
      salesDetailInsert['salesID'] = 0;
      salesDetailInsert['itemId'] = element.ItemId;
      salesDetailInsert['batchNo'] = element.BatchNo;
      salesDetailInsert['batchExpDate'] = element.BatchExpDate;
      salesDetailInsert['unitMRP'] = element.UnitMRP;
      salesDetailInsert['qty'] = element.Qty;
      salesDetailInsert['totalAmount'] = element.TotalMRP;
      salesDetailInsert['vatPer'] = this.VatPer;
      salesDetailInsert['vatAmount'] = this.VatAmount;
      salesDetailInsert['discPer'] = this.DiscPer;
      salesDetailInsert['discAmount'] = element.DiscAmt;
      salesDetailInsert['grossAmount'] = element.NetAmt;
      salesDetailInsert['landedPrice'] = this.LandedRate;
      salesDetailInsert['totalLandedAmount'] = this.LandedRateandedTotal;
      salesDetailInsert['purRateWf'] = this.PurchaseRate;
      salesDetailInsert['purTotAmt'] = this.PurTotAmt;
      salesDetailInsert['cgstPer'] = this.CgstPer;
      salesDetailInsert['cgstAmt'] = this.CGSTAmt;
      salesDetailInsert['sgstPer'] = this.SgstPer;
      salesDetailInsert['sgstAmt'] = this.SGSTAmt;
      salesDetailInsert['igstPer'] = this.IgstPer
      salesDetailInsert['igstAmt'] = this.IGSTAmt
      salesDetailInsert['isPurRate'] = 0;
      salesDetailInsert['stkID'] = element.StockId;
      salesDetailInsertarr.push(salesDetailInsert);
    });
    let updateCurStkSalestarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let updateCurStkSales = {};
      updateCurStkSales['itemId'] = element.ItemId;
      updateCurStkSales['issueQty'] = element.Qty;
      updateCurStkSales['storeID'] = element.StoreId;
      updateCurStkSales['stkID'] = this.StockId;

      updateCurStkSalestarr.push(updateCurStkSales);
    });

    let cal_DiscAmount_Sales = {};
    cal_DiscAmount_Sales['salesID'] = 0;

    let cal_GSTAmount_Sales = {};
    cal_GSTAmount_Sales['salesID'] = 0;

    let Paymentobj = {};

    Paymentobj['BillNo'] = 0,// this.billNo;
      Paymentobj['ReceiptNo'] = '',//'RE';
      Paymentobj['PaymentDate'] = this.dateTimeObj.date;
    Paymentobj['PaymentTime'] = this.dateTimeObj.time;
    Paymentobj['CashPayAmount'] = NetAmt;
    Paymentobj['ChequePayAmount'] = 0,// parseInt(this.chequeAmt.toString());
      Paymentobj['ChequeNo'] = 0,//this.chequeNo;
      Paymentobj['BankName'] = '',//this.paymentForm.get('chequeBankNameController').value.BankName;
      Paymentobj['ChequeDate'] = '',//this.dateTimeObj.date;
      Paymentobj['CardPayAmount'] = '',//parseInt(this.cardAmt.toString());
      Paymentobj['CardNo'] = '',//this.cardNo;
      Paymentobj['CardBankName'] = '',// this.paymentForm.get('cardBankNameController').value.BankName;
      Paymentobj['CardDate'] = '',//this.dateTimeObj.date;
      Paymentobj['AdvanceUsedAmount'] = 0;
    Paymentobj['AdvanceId'] = 0;
    Paymentobj['RefundId'] = 0;
    Paymentobj['TransactionType'] = 2;
    Paymentobj['Remark'] = '',//'REMArk';
      Paymentobj['AddBy'] = this._loggedService.currentUserValue.user.id,
      Paymentobj['IsCancelled'] = 0;
    Paymentobj['IsCancelledBy'] = 0;
    Paymentobj['IsCancelledDate'] = '',//this.dateTimeObj.date;
      Paymentobj['CashCounterId'] = 0;
    Paymentobj['IsSelfORCompany'] = 0;
    Paymentobj['CompanyId'] = 0;
    Paymentobj['NEFTPayAmount'] = '',//parseInt(this.neftAmt.toString());
      Paymentobj['NEFTNo'] = '',// this.neftNo;
      Paymentobj['NEFTBankMaster'] = '',//this.paymentForm.get('neftBankNameController').value.BankName;
      Paymentobj['NEFTDate'] = '',//this.dateTimeObj.date;
      Paymentobj['PayTMAmount'] = '',//parseInt(this.paytmAmt.toString());
      Paymentobj['PayTMTranNo'] = '',// this.paytmTransNo;
      Paymentobj['PayTMDate'] = '',// this.dateTimeObj.date;
      Paymentobj['PaidAmt'] = NetAmt;
    Paymentobj['BalanceAmt'] = 0;

    const ipPaymentInsert = new IpPaymentInsert(Paymentobj);

    console.log("Procced with Payment Option");

    let submitData = {
      "salesInsert": SalesInsert,
      "salesDetailInsert": salesDetailInsertarr,
      "updateCurStkSales": updateCurStkSalestarr,
      "cal_DiscAmount_Sales": cal_DiscAmount_Sales,
      "cal_GSTAmount_Sales": cal_GSTAmount_Sales,
      "salesPayment": ipPaymentInsert
    };
    console.log(submitData);
    this._salesService.InsertCashSales(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Sale CashPay!', 'Data saved Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            // let m = response;
            this.getPrint(response);
            this.Itemchargeslist = [];
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Sale data not saved', 'error');
      }
      this.sIsLoading = '';
    });
    // }
    // });

    this.ItemFormreset();
    this.Formreset();
    this.ItemSubform.get('ConcessionId').reset();
    this.PatientName = '';
    this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
  }


  onCreditpaySave() {
    // if (this._salesService.IndentSearchGroup.get('PatientType').value == "External" && this.PatientName  != null && this.MobileNo != null) {
    let NetAmt = (this.ItemSubform.get('FinalNetAmount').value);

    let ConcessionId = 0;
    if (this.ItemSubform.get('ConcessionId').value)
      ConcessionId = this.ItemSubform.get('ConcessionId').value.ConcessionId;

    console.log("Procced with Credit Option");

    let salesInsertCredit = {};
    salesInsertCredit['Date'] = this.dateTimeObj.date;
    salesInsertCredit['time'] = this.dateTimeObj.time;
    salesInsertCredit['oP_IP_ID'] = 0;
    salesInsertCredit['oP_IP_Type'] = 2;
    salesInsertCredit['totalAmount'] = this.FinalTotalAmt
    salesInsertCredit['vatAmount'] = this.VatAmount;
    salesInsertCredit['discAmount'] = this.FinalDiscAmt;
    salesInsertCredit['netAmount'] = NetAmt;
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
      salesInsertCredit['isPrescription'] = 0;
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
    salesInsertCredit['extMobileNo'] = this.MobileNo;

    let salesDetailInsertCreditarr = [];
    this.saleSelectedDatasource.data.forEach((element) => {
      let salesDetailInsertCredit = {};
      salesDetailInsertCredit['salesID'] = 0;
      salesDetailInsertCredit['itemId'] = element.ItemId;
      salesDetailInsertCredit['batchNo'] = element.BatchNo;
      salesDetailInsertCredit['batchExpDate'] = element.BatchExpDate;
      salesDetailInsertCredit['unitMRP'] = element.UnitMRP;
      salesDetailInsertCredit['qty'] = element.Qty;
      salesDetailInsertCredit['totalAmount'] = element.TotalMRP;
      salesDetailInsertCredit['vatPer'] = this.VatPer;
      salesDetailInsertCredit['vatAmount'] = this.VatAmount;
      salesDetailInsertCredit['discPer'] = this.DiscPer;
      salesDetailInsertCredit['discAmount'] = element.DiscAmt;
      salesDetailInsertCredit['grossAmount'] = element.NetAmt;
      salesDetailInsertCredit['landedPrice'] = this.LandedRate;
      salesDetailInsertCredit['totalLandedAmount'] = this.LandedRateandedTotal;
      salesDetailInsertCredit['purRateWf'] = this.PurchaseRate;
      salesDetailInsertCredit['purTotAmt'] = this.PurTotAmt;
      salesDetailInsertCredit['cgstPer'] = this.CgstPer;
      salesDetailInsertCredit['cgstAmt'] = this.CGSTAmt;
      salesDetailInsertCredit['sgstPer'] = this.SgstPer;
      salesDetailInsertCredit['sgstAmt'] = this.SGSTAmt;
      salesDetailInsertCredit['igstPer'] = this.IgstPer
      salesDetailInsertCredit['igstAmt'] = this.IGSTAmt
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


    console.log("Procced with Payment Option");

    let submitData = {
      "salesInsertCredit": salesInsertCredit,
      "salesDetailInsertCredit": salesDetailInsertCreditarr,
      "updateCurStkSalesCredit": updateCurStkSalesCreditarray,
      "cal_DiscAmount_SalesCredit": cal_DiscAmount_SalesCredit,
      "cal_GSTAmount_SalesCredit": cal_GSTAmount_SalesCredit
    };
    console.log(submitData);
    debugger
    this._salesService.InsertCreditSales(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Sale Credit!', 'Data saved Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            this.getPrint(m);
            this.Itemchargeslist = [];
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Sale Credit data not saved', 'error');
      }
      this.sIsLoading = '';
    });
    this.ItemFormreset();
    this.Formreset();
    this.ItemSubform.get('ConcessionId').reset();
    this.getConcessionReasonList();
    this.PatientName = '';
    this.MobileNo = '';
    this.saleSelectedDatasource.data = [];
    this.saleSelectedDatasource.data = [];

  }

  @ViewChild('discamt') discamt: ElementRef;
  // @ViewChild('Lname') Lname: ElementRef;
  @ViewChild('mobileno') mobileno: ElementRef;
  @ViewChild('disper') disper: ElementRef;
  @ViewChild('discamount') discamount: ElementRef;
  @ViewChild('patientname') patientname: ElementRef;
  @ViewChild('itemid') itemid: ElementRef;
  add: boolean = false;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;

  public onEnterqty(event): void {
    if (event.which === 13) {
      this.disper.nativeElement.focus();
    }
  }

  public onEnterdiscper(event): void {
    debugger

    if (event.which === 13) {
      // if (this.DiscPer == 0) {
      //   this.discamount.nativeElement.focus();
      // }
      // else {

      //   this.addbutton.focus();
      // }
      this.discamount.nativeElement.focus();

    }
  }

  public onEnterpatientname(event): void {
    if (event.which === 13) {
      this.itemid.nativeElement.focus();
    }
  }
  public onEntermobileno(event): void {
    if (event.which === 13) {
      this.patientname.nativeElement.focus();
      this.getTopSalesDetailsList(this.MobileNo);
    }
  }
  public onEnterdiscAmount(event): void {
    if (event.which === 13) {
      this.addbutton.focus();
    }
  }



  getPrint(el) {

    var D_data = {
      "SalesID": 428263,// 
      "OP_IP_Type": 2
    }

    let printContents;
    this.subscriptionArr.push(
      this._salesService.getSalesPrint(D_data).subscribe(res => {

        this.reportPrintObjList = res as Printsal[];
        console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as Printsal;

        this.getTemplate();

      })
    );
  }
  getTemplate() {
    debugger
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=36';
    this._salesService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmount', 'CGSTAmount', 'CGSTPer', 'SGSTPer', 'SGSTAmount', 'IGSTPer', 'IGSTAmount', 'ManufShortName', 'StoreNo', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName'];
      // ;
      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        console.log(this.reportPrintObjList);
        var objreportPrint = this.reportPrintObjList[i - 1];
        let UnitValue = 'Com'
        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>

        var strabc = `<hr style="border-color:white" >
        <div style="display:flex;margin:8px 0">
       
        <div style="display:flex;width:50px;text-align:center;">
            <div>`+ UnitValue + `</div> 
        </div>
        <div style="display:flex;width:80px;text-align:center;">
        <div>`+ objreportPrint.HSNcode + `</div> 
        </div>
        <div style="display:flex;width:220px;text-align:left;margin-right:10px">
            <div>`+ objreportPrint.ItemName + `</div> 
        </div>
        <div style="display:flex;width:70px;text-align:left;margin-left:20px;">
            <div>`+ objreportPrint.Qty + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.BatchNo + `</div> 
         </div>
        <div style="display:flex;width:90px;text-align:left;margin-left:10px;">
        <div>`+ this.datePipe.transform(objreportPrint.BatchExpDate, 'dd/MM/yyyy') + `</div> 
        </div>
        <div style="display:flex;width:120px;text-align:center;margin-left:20px;">
        <div>`+ objreportPrint.CGSTPer + objreportPrint.CGSTAmt + `</div> 
        </div>  
        <div style="display:flex;width:120px;text-align:center;margin-left:10px;">
        <div>`+ objreportPrint.SGSTPer + objreportPrint.SGSTAmt + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;margin-left:10px;">
        <div>`+ objreportPrint.UnitMRP + `</div> 
        </div>
        <div style="display:flex;width:110px;margin-left:10px;text-align:center;">
            <div>`+ '₹' + objreportPrint.TotalAmount.toFixed(2) + `</div> 
        </div>
        </div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];

      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.PaidAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate);

      setTimeout(() => {
        this.print();
      }, 1000);
    });


  }

  print() {

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
    popupWin.document.write(`<body onload="window.print();window.close()"></body> 
    </html>`);

    // if(this.reportPrintObj.CashPayAmount === 0) {
    //   popupWin.document.getElementById('idCashpay').style.display = 'none';
    // }
    // if(this.reportPrintObj.CardPayAmount === 0) {
    //   popupWin.document.getElementById('idCardpay').style.display = 'none';
    // }
    // if(this.reportPrintObj.ChequePayAmount === 0) {
    //   popupWin.document.getElementById('idChequepay').style.display = 'none';
    // }
    // if(this.reportPrintObj.NEFTPayAmount === 0) {
    //   popupWin.document.getElementById('idNeftpay').style.display = 'none';
    // }
    // if(this.reportPrintObj.PayTMAmount === 0) {
    //   popupWin.document.getElementById('idPaytmpay').style.display = 'none';
    // }
    // if(this.reportPrintObj.PayTMAmount === 0) {
    //   popupWin.document.getElementById('idPaytmpay').style.display = 'none';
    // }
    // if(this.reportPrintObj.Remark === '') {
    //   popupWin.document.getElementById('idremark').style.display = 'none';
    // }
    this.createCDKPortal({}, popupWin);
    popupWin.document.close();
  }

  createCDKPortal(data, windowInstance) {
    if (windowInstance) {
      const outlet = new DomPortalOutlet(windowInstance.document.body, this.componentFactoryResolver, this.applicationRef, this.injector);
      const injector = this.createInjector(data);
      let componentInstance;
      componentInstance = this.attachHeaderContainer(outlet, injector);
      // console.log(windowInstance.document)
      let template = windowInstance.document.createElement('div'); // is a node
      template.innerHTML = this.printTemplate;
      windowInstance.document.body.appendChild(template);
    }
  }
  createInjector(data): any {
    const injectionTokens = new WeakMap();
    injectionTokens.set({}, data);
    return new PortalInjector(this.injector, injectionTokens);
  }

  attachHeaderContainer(outlet, injector) {
    const containerPortal = new ComponentPortal(HeaderComponent, null, injector);
    const containerRef: ComponentRef<HeaderComponent> = outlet.attach(containerPortal);
    return containerRef.instance;
  }


  onClose() {
    // this.dialogRef.close({ result: "cancel" });
    this.Itemchargeslist = [];
  }
}

export class IndentList {
  ItemId: any;
  ItemName: string;
  BatchNo: string;
  BatchExpDate: any;
  BalanceQty: any;
  UnitMRP: any;
  Qty: number;
  IssQty: number;
  Bal: number;
  StoreId: any;
  StoreName: any;
  GSTPer: any;

  TotalMRP: any;
  DiscAmt: any;
  NetAmt: any;
  StockId: any;

  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {
      this.ItemId = IndentList.ItemId || 0;
      this.ItemName = IndentList.ItemName || "";
      this.BatchNo = IndentList.BatchNo || "";
      this.BatchExpDate = IndentList.BatchExpDate || "";
      this.UnitMRP = IndentList.UnitMRP || "";
      this.ItemName = IndentList.ItemName || "";
      this.Qty = IndentList.Qty || 0;
      this.IssQty = IndentList.IssQty || 0;
      this.Bal = IndentList.Bal || 0;
      this.StoreId = IndentList.StoreId || 0;
      this.StoreName = IndentList.StoreName || '';
      this.GSTPer = IndentList.GSTPer || "";
      this.TotalMRP = IndentList.TotalMRP || 0;
      this.DiscAmt = IndentList.DiscAmt || 0;
      this.NetAmt = IndentList.NetAmt || 0;
      this.StockId = IndentList.StockId || 0;
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

export class Printsal {
  PatientName: any;
  RegNo: any;
  IP_OP_Number: any;
  DoctorName: any;
  SalesNo: any;
  Date: Date;
  Time: any;
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
  VatPer: any;
  VatAmount: any;
  DiscAmount: any;
  ConcessionReason: any;
  PaidAmount: any;
  BalanceAmount: any;
  UserName: any;
  HSNcode: any;
  CashPayAmount: any;
  CardPayAMount: any;
  ChequePayAmount: any;
  PayTMAmount: any;
  NEFTPayAmount: any;
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

    this.VatPer = Printsal.VatPer || '';
    this.VatAmount = Printsal.VatAmount || 0;
    this.DiscAmount = Printsal.DiscAmount || "";
    this.ConcessionReason = Printsal.ConcessionReason || "";
    this.PaidAmount = Printsal.PaidAmount || 0;
    this.BalanceAmount = Printsal.BalanceAmount || "";
    this.UserName = Printsal.UserName || "";
    this.HSNcode = Printsal.HSNcode || "";

    this.CashPayAmount = Printsal.CashPayAmount || '';
    this.CardPayAMount = Printsal.CardPayAMount || 0;
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

    this.StoreNo = Printsal.StoreNo || "";
    this.DL_NO = Printsal.DL_NO || "";
    this.GSTIN = Printsal.GSTIN || "";
    this.CreditReason = Printsal.CreditReason || "";
    this.CompanyName = Printsal.CompanyName || "";

  }
}

function Consructur() {
  throw new Error('Function not implemented.');
}
