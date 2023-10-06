import { Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class SalesComponent implements OnInit {

  @ViewChild('Quantity') Quantity: ElementRef;
  @ViewChild('DiscAmount') DiscAmount: ElementRef;
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
  Qty: any;
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
  FinalGSTAmt: any;

  ConShow: Boolean = false;
  ItemObj: IndentList;

  paidamt: number;
  flagSubmit: boolean;
  balanceamt: number;
  disamt: any;
  msg: any;


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

  dsIndentList = new MatTableDataSource<IndentList>();
  datasource = new MatTableDataSource<IndentList>();
  saleSelectedDatasource = new MatTableDataSource<IndentList>();

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
    'TotalMRP',
    'DiscAmt',
    'NetAmt',
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

  ) { }

  ngOnInit(): void {
    this.gePharStoreList();
    this.getItemSubform();
    this.getConcessionReasonList();
    // this.ItemObj=
  }

  // toggleSidebar(name): void {
  //   this._fuseSidebarService.getSidebar(name).toggleOpen();
  // }


  getItemSubform() {
    this.ItemSubform = this.formBuilder.group({
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
      CashPay: ['1'],
      Credit: [0]
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

    this.getBatch();
  }


  // onclickrow(Param) {
  //   Swal.fire("Row selected :" + Param)
  //   console.log(Param);
  // }

  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._salesService.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
      this._salesService.IndentSearchGroup.get('StoreId').setValue(this.Store1List[0]);
    });
  }

  onClear() {

  }

  OnAdd() {
    debugger
    this.sIsLoading = 'save';
    let Qty = this._salesService.IndentSearchGroup.get('Qty').value
    if (this.ItemName && (parseInt(Qty) != 0) && this.MRP > 0) {
      this.saleSelectedDatasource.data = [];
      this.Itemchargeslist.push(
        {
          ItemId: this.ItemId,
          ItemName: this.ItemName,
          BatchNo: this.BatchNo,
          BatchExpDate: this.BatchExpDate || '01/01/1900',
          Qty: this.Qty,
          UnitMRP: this.MRP,
          GSTPer: this._salesService.IndentSearchGroup.get('GSTPer').value || 0,
          TotalMRP: this.TotalMRP,
          DiscAmt: this._salesService.IndentSearchGroup.get('DiscAmt').value || 0,
          NetAmt: this.NetAmt,
        });
      this.sIsLoading = '';
      this.saleSelectedDatasource.data = this.Itemchargeslist;

    }
    this.ItemFormreset();
  }

  getBatch() {
    this.Quantity.nativeElement.focus();
    const dialogRef = this._matDialog.open(SalePopupComponent,
      {
        maxWidth: "700px",
        minWidth: '700px',
        width: '700px',
        height: '500px',
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
      this.Qty = 0;
      this.Bal = result.BalanceAmt;
      this.StoreName = result.StoreName;
      this.GSTPer = result.VatPercentage;
      this.TotalMRP = this.Qty * this.MRP;
      this.DiscAmt = result.DiscAmt;
      this.NetAmt = this.TotalMRP;
      this.BalanceQty=this.BalanceQty;
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
    this.TotalMRP = 0;
    this.NetAmt = 0;

  }


  getNetAmtSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, { NetAmt }) => sum += +(NetAmt || 0), 0);
    this.FinalTotalAmt = netAmt;
    this.FinalNetAmount = this.FinalTotalAmt;


    this.TotDiscAmt = element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0);
    // this.ItemSubform.get('FinalNetAmount').setValue(this.FinalTotalAmt)
    return netAmt;
  }

  calculateTotalAmt() {
debugger
    let Qty = this._salesService.IndentSearchGroup.get('Qty').value
    if(Qty > this.BalanceQty){
      Swal.fire("Enter Qty less than Balance");
      this.ItemFormreset();
    }

    if (Qty && this.MRP) {
      this.TotalMRP = (parseInt(Qty) * (this._salesService.IndentSearchGroup.get('MRP').value)).toString();

      this.NetAmt = this.TotalMRP;


      this.VatAmount = (this.UnitMRP) * (this.VatPer) / 100 * parseInt(Qty)
      console.log("Vat", this.VatAmount);
      this.CGSTAmt = ((this.UnitMRP) * (this.CgstPer) / 100) * parseInt(Qty)
      console.log("CGST", this.CGSTAmt);
      this.SGSTAmt = ((this.UnitMRP) * (this.SgstPer) / 100) * parseInt(Qty)
      console.log("SGST", this.SGSTAmt);
      this.IGSTAmt = ((this.UnitMRP) * (this.IgstPer) / 100) * parseInt(Qty)
      console.log("IGST", this.IGSTAmt);
      debugger
      this.TotalMRP = ((Qty) * (this.MRP)).toFixed(2)
      console.log("TotMRP", this.TotalMRP);

      //  disc need to chk
      //  this.TotDiscAmt = (parseInt(Qty) * parseInt(this.MRP)).toFixed(2)
      console.log("Tot DiscAmt", this.TotDiscAmt);
      this.LandedRateandedTotal = (parseInt(Qty) * (this.LandedRate)).toFixed(2)
      console.log("TotLandedRate", this.LandedRateandedTotal);
      this.PurTotAmt = (parseInt(Qty) * (this.PurchaseRate)).toFixed(2)
      console.log("TotPureRate", this.LandedRateandedTotal);

      this.DiscAmount.nativeElement.focus();
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
    debugger
    this.NetAmt = this.NetAmt - (this._salesService.IndentSearchGroup.get('DiscAmt').value);

  }

  calculateGSTAmt() {
    let GST = this._salesService.IndentSearchGroup.get('GSTPer').value
    if (GST > 0) {
      let discAmt = ((this.NetAmt * (GST)) / 100);
      this.DiscAmt = discAmt;
      this.NetAmt = (this.NetAmt) - (discAmt);
    }
  }

  getDiscAmount() {
    if (this.FinalDiscPer > 0) {
      let discAmt = (this.FinalTotalAmt * (this.FinalDiscPer)) / 100;
      this.FinalTotalAmt = this.FinalTotalAmt - discAmt;
    }
  }

  getFinalDiscperAmt() {
    let Disc = this.ItemSubform.get('FinalDiscPer').value
    // this.FinalDiscAmt=0
    if (Disc > 0) {
      this.FinalDiscAmt = Math.round((this.FinalTotalAmt * (Disc)) / 100);
      this.FinalNetAmount = (this.FinalTotalAmt) - (this.FinalDiscAmt);
      this.ConShow = true
    }

    this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
  }

  getFinalDiscAmount() {
    // this.FinalDiscPer=0;
    let Discamt = this.ItemSubform.get('FinalDiscAmt').value

    if (Discamt > 0 && Discamt < this.FinalNetAmount) {
      this.FinalNetAmount = ((this.FinalNetAmount) - (Discamt)).toFixed(2);
      this.ConShow = true
    }

    this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);

    this.ConseId.nativeElement.focus();

  }




  CalfinalGST() {
    let GST = this.ItemSubform.get('FinalGSTAmt').value
    if (GST > 0 && GST < this.FinalNetAmount) {
      this.FinalNetAmount = ((this.FinalNetAmount) - (GST)).toFixed(2);
      this.ConShow = true
    }
    this.ItemSubform.get('FinalNetAmount').setValue(this.FinalNetAmount);
  }

  deleteTableRow(event,element) {
debugger
    // Delete row in datatable level
    console.log(event.key)
    if(event.key == "Delete"){
    let index = this.Itemchargeslist.indexOf(element);
    if (index >= 0) {
      this.Itemchargeslist.splice(index, 1);
      this.saleSelectedDatasource.data = [];
      this.saleSelectedDatasource.data = this.Itemchargeslist;
    }
    Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');
  }
  }

  onSave() {
    debugger
    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['PatientName'] = "AirMid";//this.selectedAdvanceObj.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] = '007';
    PatientHeaderObj['NetPayAmount'] = this.FinalNetAmount;


    if (this.ItemSubform.get('CashPay').value) {
      const dialogRef = this._matDialog.open(OpPaymentNewComponent,
        {
          maxWidth: "100vw",
          height: '600px',
          width: '100%',
          data: {
            vPatientHeaderObj: PatientHeaderObj,
            FromName: "OP-Bill"
          }
        });

      dialogRef.afterClosed().subscribe(result => {

        this.paidamt = result.submitDataPay.ipPaymentInsert.PaidAmt;
        this.balanceamt = result.submitDataPay.ipPaymentInsert.BalanceAmt;
        this.flagSubmit = result.IsSubmitFlag

      });
    }
    else if(this.ItemSubform.get('Credit').value){
      this.paidamt =0;
      this.balanceamt = this.FinalNetAmount;
    }

        console.log("Procced with Payment Option");

        let SalesInsert = {};
        SalesInsert['Date'] = this.dateTimeObj.date;
        SalesInsert['time'] = this.dateTimeObj.date;
        SalesInsert['oP_IP_ID'] = '007';
        SalesInsert['oP_IP_Type'] = 1;
        SalesInsert['totalAmount'] = this.FinalTotalAmt
        SalesInsert['vatAmount'] = this.VatAmount;
        SalesInsert['discAmount'] = this.DiscAmt;
        SalesInsert['netAmount'] = this.NetAmt;
        SalesInsert['paidAmount'] = this.paidamt
        SalesInsert['balanceAmount'] = this.balanceamt;
        SalesInsert['concessionReasonID'] = this.ItemSubform.get('ConcessionId').value.ConcessionId;
        SalesInsert['concessionAuthorizationId'] = 1;
        SalesInsert['isSellted'] = 0;
        SalesInsert['isPrint'] = 0;//this.selectedAdvanceObj.PatientName;
        SalesInsert['isFree'] = 0;
        SalesInsert['unitID'] = 1;
        SalesInsert['addedBy'] = this._loggedService.currentUserValue.user.id,
          SalesInsert['externalPatientName'] = "Abc";//this.selectedAdvanceObj.PatientName;
        SalesInsert['doctorName'] = 'xya';
        SalesInsert['storeId'] = this._salesService.IndentSearchGroup.get('StoreId').value.storeid;
        SalesInsert['isPrescription'] = 0;//this.selectedAdvanceObj.PatientName;
        SalesInsert['creditReason'] = '';
        SalesInsert['creditReasonID'] = 1;
        SalesInsert['wardId'] = 'a';
        SalesInsert['bedID'] = 2;//this.selectedAdvanceObj.PatientName;
        SalesInsert['discper_H'] = '007';
        SalesInsert['isPurBill'] = 0;
        SalesInsert['isBillCheck'] = 0;
        SalesInsert['salesHeadName'] = "AirMid";//this.selectedAdvanceObj.PatientName;
        SalesInsert['salesTypeId'] = '007';
        SalesInsert['salesId'] = 0;

        let salesDetailInsertarr = [];
        this.saleSelectedDatasource.data.forEach((element) => {
          let salesDetailInsert = {};
          salesDetailInsert['salesID'] = this.dateTimeObj.date;
          salesDetailInsert['itemId'] = element.ItemId;
          salesDetailInsert['batchNo'] = element.BatchNo;
          salesDetailInsert['batchExpDate'] = element.BatchExpDate;
          salesDetailInsert['unitMRP'] = element.UnitMRP;
          salesDetailInsert['qty'] = element.Qty;
          salesDetailInsert['totalAmount'] = element.TotalMRP;
          salesDetailInsert['vatPer'] = this.VatPer;
          salesDetailInsert['vatAmount'] = this.VatAmount;
          salesDetailInsert['discPer'] = this.DiscPer;
          salesDetailInsert['discAmount'] = this.DiscAmt;
          salesDetailInsert['grossAmount'] = this.FinalTotalAmt;
          salesDetailInsert['landedPrice'] = this.LandedRate;
          salesDetailInsert['totalLandedAmount'] = this.LandedRateandedTotal
          salesDetailInsert['purRateWf'] = this.PurchaseRate;
          salesDetailInsert['purTotAmt'] = this.PurTotAmt;
          salesDetailInsert['cgstPer'] = this.CgstPer;
          salesDetailInsert['cgstAmt'] = this.CGSTAmt;
          salesDetailInsert['sgstAmt'] = this.GSTPer;
          salesDetailInsert['igstPer'] = this.IgstPer
          salesDetailInsert['igstAmt'] = this.IGSTAmt
          salesDetailInsert['isPurRate'] = 0;
          salesDetailInsert['stkID'] = this.StockId;
          salesDetailInsertarr.push(salesDetailInsert);
        });
        let updateCurStkSalestarr = [];
        this.saleSelectedDatasource.data.forEach((element) => {
          let updateCurStkSales = {};
          updateCurStkSales['itemId'] = element.ItemId;
          updateCurStkSales['issueQty'] =element.Qty;
          updateCurStkSales['storeID'] = element.StoreId;
          updateCurStkSales['stkID'] = this.StockId;

          updateCurStkSalestarr.push(updateCurStkSales);
        });

        let cal_DiscAmount_Sales = {};
        cal_DiscAmount_Sales['salesID'] = 0;

        let cal_GSTAmount_Sales = {};
        cal_GSTAmount_Sales['salesID'] = 0;


        console.log("Procced with Payment Option");

        let submitData = {
          "salesInsert": SalesInsert,
          "salesDetailInsert": salesDetailInsertarr,
          "updateCurStkSales": updateCurStkSalestarr,
          "cal_DiscAmount_Sales": cal_DiscAmount_Sales,
          "cal_GSTAmount_Sales": cal_GSTAmount_Sales
        };
        console.log(submitData);
        this._salesService.InsertSales(submitData).subscribe(response => {
          if (response) {
            Swal.fire('Sale CashPay!', 'Data saved Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                let m = response;
                // this.getPrint(m);
                this._matDialog.closeAll();
              }
            });
          } else {
            Swal.fire('Error !', 'Sale data not saved', 'error');
          }
          this.sIsLoading = '';
        });


     
    // }
    // else {

    //   let SalesInsert = {};
    //   SalesInsert['Date'] = this.dateTimeObj.date;
    //   SalesInsert['time'] = this.dateTimeObj.date;
    //   SalesInsert['oP_IP_ID'] = '007';
    //   SalesInsert['oP_IP_Type'] = 1;
    //   SalesInsert['totalAmount'] = this.FinalTotalAmt
    //   SalesInsert['vatAmount'] = this.VatAmount;
    //   SalesInsert['discAmount'] = this.DiscAmt;
    //   SalesInsert['netAmount'] = this.NetAmt;
    //   SalesInsert['paidAmount'] = this.NetAmt;
    //   SalesInsert['balanceAmount'] = this.balanceamt;
    //   SalesInsert['concessionReasonID'] = this.ItemSubform.get('ConcessionId').value.ConcessionId;
    //   SalesInsert['concessionAuthorizationId'] = 1;
    //   SalesInsert['isSellted'] = 0;
    //   SalesInsert['isPrint'] = 0;//this.selectedAdvanceObj.PatientName;
    //   SalesInsert['isFree'] = 0;
    //   SalesInsert['unitID'] = 1;
    //   SalesInsert['addedBy'] = this._loggedService.currentUserValue.user.id,
    //     SalesInsert['externalPatientName'] = "Abc";//this.selectedAdvanceObj.PatientName;
    //   SalesInsert['doctorName'] = 'xya';
    //   SalesInsert['storeId'] = this._salesService.IndentSearchGroup.get('StoreId').value.storeid;
    //   SalesInsert['isPrescription'] = 0;//this.selectedAdvanceObj.PatientName;
    //   SalesInsert['creditReason'] = '';
    //   SalesInsert['creditReasonID'] = 1;
    //   SalesInsert['wardId'] = 'a';
    //   SalesInsert['bedID'] = 2;//this.selectedAdvanceObj.PatientName;
    //   SalesInsert['discper_H'] = '007';
    //   SalesInsert['isPurBill'] = 0;
    //   SalesInsert['isBillCheck'] = 0;
    //   SalesInsert['salesHeadName'] = "AirMid";//this.selectedAdvanceObj.PatientName;
    //   SalesInsert['salesTypeId'] = '007';
    //   SalesInsert['salesId'] = 0;

    //   let salesDetailInsertarr = [];
    //   this.saleSelectedDatasource.data.forEach((element) => {
    //     let salesDetailInsert = {};
    //     salesDetailInsert['salesID'] = this.dateTimeObj.date;
    //     salesDetailInsert['itemId'] = element.ItemId;
    //     salesDetailInsert['batchNo'] = element.BatchNo;
    //     salesDetailInsert['batchExpDate'] = element.BatchExpDate;
    //     salesDetailInsert['unitMRP'] = element.UnitMRP;
    //     salesDetailInsert['qty'] = element.Qty;
    //     salesDetailInsert['totalAmount'] = element.TotalMRP;
    //     salesDetailInsert['vatPer'] = this.VatPer;
    //     salesDetailInsert['vatAmount'] = this.VatAmount;
    //     salesDetailInsert['discPer'] = this.DiscPer;
    //     salesDetailInsert['discAmount'] = this.DiscAmt;
    //     salesDetailInsert['grossAmount'] = this.FinalTotalAmt;
    //     salesDetailInsert['landedPrice'] = this.LandedRate;
    //     salesDetailInsert['totalLandedAmount'] = this.LandedRateandedTotal
    //     salesDetailInsert['purRateWf'] = this.PurchaseRate;
    //     salesDetailInsert['purTotAmt'] = this.PurTotAmt;
    //     salesDetailInsert['cgstPer'] = this.CgstPer;
    //     salesDetailInsert['cgstAmt'] = this.CGSTAmt;
    //     salesDetailInsert['sgstAmt'] = this.GSTPer;
    //     salesDetailInsert['igstPer'] = this.IgstPer
    //     salesDetailInsert['igstAmt'] = this.IGSTAmt
    //     salesDetailInsert['isPurRate'] = 0;
    //     salesDetailInsert['stkID'] = this.StockId;
    //     salesDetailInsertarr.push(salesDetailInsert);
    //   });
    //   let updateCurStkSalestarr = [];
    //   this.saleSelectedDatasource.data.forEach((element) => {
    //     let updateCurStkSales = {};
    //     updateCurStkSales['itemId'] = element.ItemId;
    //     updateCurStkSales['issueQty'] = 0;//element.IssQty;
    //     updateCurStkSales['storeID'] = element.StoreId;
    //     updateCurStkSales['stkID'] = this.StockId;

    //     updateCurStkSalestarr.push(updateCurStkSales);
    //   });

    //   let cal_DiscAmount_Sales = {};
    //   cal_DiscAmount_Sales['salesID'] = 0;

    //   let cal_GSTAmount_Sales = {};
    //   cal_GSTAmount_Sales['salesID'] = 0;


    //   console.log("Procced with Payment Option");

    //   let submitData = {
    //     "salesInsert": SalesInsert,
    //     "salesDetailInsert": salesDetailInsertarr,
    //     "updateCurStkSales": updateCurStkSalestarr,
    //     "cal_DiscAmount_Sales": cal_DiscAmount_Sales,
    //     "cal_GSTAmount_Sales": cal_GSTAmount_Sales
    //   };
    //   console.log(submitData);
    //   this._salesService.InsertSales(submitData).subscribe(response => {
    //     if (response) {
    //       Swal.fire('Sale Credit!', 'Data saved Successfully !', 'success').then((result) => {
    //         if (result.isConfirmed) {
    //           let m = response;
    //           // this.getPrint(m);
    //           this._matDialog.closeAll();
    //         }
    //       });
    //     } else {
    //       Swal.fire('Error !', 'Sale data not saved', 'error');
    //     }
    //     this.sIsLoading = '';
    //   });


    // }
  }

  onClose() {
    // this.dialogRef.close({ result: "cancel" });
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
      this.DiscAmt = IndentList.IssQty || 0;
      this.NetAmt = IndentList.NetAmt || 0;

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

