import { Component, ElementRef, HostListener, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { BrowsSalesBillService } from './brows-sales-bill.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import * as converter from 'number-to-words';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Printsal } from '../sales/sales.component';
import { SalesService } from '../sales/sales.service';
import { Subscription } from 'rxjs';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AppointmentSreviceService } from 'app/main/opd/appointment/appointment-srevice.service';
import { PatientDocument } from 'app/main/opd/appointment/appointment.component';
import { E } from '@angular/cdk/keycodes';
import * as XLSX from 'xlsx';
const jsPDF = require('jspdf');
// require('jspdf-autotable');
import autoTable from 'jspdf-autotable'
import { Admission } from 'app/main/ipd/Admission/admission/admission.component';
import { AdmissionService } from 'app/main/ipd/Admission/admission/admission.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-brows-sales-bill',
  templateUrl: './brows-sales-bill.component.html',
  styleUrls: ['./brows-sales-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowsSalesBillComponent implements OnInit {

  @ViewChild('billTemplate') billTemplate: ElementRef;
  @ViewChild('billTemplate2') billTemplate2: ElementRef;
  @ViewChild('billSalesReturn') billSalesReturn: ElementRef;

  @ViewChild('Salescollectiontemplate') Salescollectiontemplate: ElementRef;
  imgDataSource = new MatTableDataSource<any>();
  reportPrintObjList: Printsal[] = [];
  printTemplate: any;
  reportPrintObj: Printsal;
  reportPrintObjTax: Printsal;
  subscriptionArr: Subscription[] = [];
  currentDate = new Date();
  CustomerName: any = "";
  CustomerId: any = "";
  CustAddress: any = "";
  ExMobile: any = "";
  TotalCashpay: any = 0;
  TotalCardpay: any = 0;
  TotalChequepay: any = 0;
  TotalNeftpay: any = 0;
  TotalPatTmpay: any = 0;
  TotalBalancepay: any = 0;
  Filepath: any;
  loadingRow: number | null = null
  IsLoading: boolean = false;
  UTRNO: any;
  rowid: any = [];
  TotalAmt: any = 0;
  sIsLoading: any = '';
  AdList: boolean = false;
  type = " ";

  Creditflag: boolean = false;

  displayedColumns: string[] = [
    'action',
    //  'action1',
    //  'action2',
    // 'payment',
    'Date',
    'SalesNo',
    'RegNo',
    'PatientName',
    'NetAmt',
    'BalAmt',
    'PaidAmt',
    'PaidType',
    'IPNo'
  ]
  displayedColumns2: string[] = [
    'ItemName',
    'BatchNo',
    'Expdate',
    'Qty',
    'MRP',
    'TotalMRP',
    'DiscPer',
    'DiscAmt',
    'GrossAmt',
    'GST',
    'CGST',
    'SGST',
    'IGST'
  ]
  displayedColumns3: string[] = [
    'action',
    // 'action1',
    // 'action2',
    'SalesDate',
    'SalesNo',
    'RegNo',
    'PatientName',
    'NetAmt',
    'BalAmt',
    'PaidAmt',
    'Type'
  ]
  displayedColumns4: string[] = [
    'ItemName',
    'BatchNo',
    'Expdate',
    'Qty',
    'MRP',
    'TotalMRP',
    'GST',
    'CGST',
    'SGST',
    'IGST'
  ]


  displayedColumnsplist = [
    // 'IsMLC',
    'RegNo',
    'PatientName',
    'DOA',
    // 'DOT',
    'Doctorname',
    'RefDocName',
    'IPNo',
    'PatientType',
    'WardName',
    'TariffName',
    'ClassName',
    // 'CompanyName',
    // 'RelativeName',
    'buttons'
  ];

  StoreList: any = [];
  Store1List: any = [];
  hasSelectedContacts: boolean;

  dataSource = new MatTableDataSource<Admission>();
  dssaleList1 = new MatTableDataSource<SaleList>();
  dssalesList2 = new MatTableDataSource<SalesDetList>();

  dssalesReturnList = new MatTableDataSource<SalesReturnList>();
  dssalesReturnList1 = new MatTableDataSource<SalesReturnDetList>();



  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _AdmissionService: AdmissionService,
    public _BrowsSalesBillService: BrowsSalesBillService,
    public _BrowsSalesService: SalesService,
    public _AppointmentSreviceService: AppointmentSreviceService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.getAdmittedPatientList_1();
    this.getSalesList();
    this.getSalesReturnList()
    this.gePharStoreList();
    this.gePharStoreList1();
  }


  resultsLength = 0;
  getAdmittedPatientList_1() {
    var Param = {
      "F_Name": this._AdmissionService.myFilterform.get("FirstName").value + '%' || "%",
      "L_Name": this._AdmissionService.myFilterform.get("LastName").value + '%' || "%",
      "Reg_No": this._AdmissionService.myFilterform.get("RegNo").value || "0",
      "Doctor_Id": this._AdmissionService.myFilterform.get("searchDoctorId").value.DoctorID || "0",
      "From_Dt": this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "Admtd_Dschrgd_All": 0,
      "M_Name": this._AdmissionService.myFilterform.get("MiddleName").value + '%' || "%",
      "IPNo": this._AdmissionService.myFilterform.get("IPDNo").value || '0',
      Start: (this.paginator?.pageIndex ?? 1),
      Length: (this.paginator?.pageSize ?? 10),
    }
    console.log(Param);
    this._AdmissionService.getAdmittedPatientList_1(Param).subscribe(data => {
      this.dataSource.data = data["Table1"] ?? [] as Admission[];
      if (this.dataSource.data.length > 0) {
        this.Admissiondetail(this.dataSource.data);
      }
      this.dataSource.sort = this.sort;
      this.resultsLength = data["Table"][0]["total_row"];
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  Admissiondetail(data) {
    // this.Vtotalcount = 0;
    // this.VNewcount = 0;
    // this.VFollowupcount = 0;
    // this.VBillcount = 0;
    // this.vIsDischarg=0;
    // console.log(data)
    // this.Vtotalcount;
    // debugger
    // for (var i=0;i< data.length;i++){
    //   if(data[i].PatientOldNew==1){
    //       this.VNewcount=this.VNewcount+1;
    //     }
    //     else if(data[i].PatientOldNew==2){
    //       this.VFollowupcount=this.VFollowupcount+1;
    //     }
    //     else if(data[i].AdmissionID !==0){
    //       this.VAdmissioncount=data.length;
    //     }
    //      else if(data[i].IsBillGenerated ==1){
    //       this.VBillcount= this.VBillcount+1;
    //     }
    //     else if(data[i].IsOpToIPConv ==1){

    //       this.VOPtoIPcount=this.VOPtoIPcount + 1;
    //     }else if(data[i].IsDischarged ==1){
    //       this.vIsDischarg= this.vIsDischarg +1;
    //     }
    //     this.Vtotalcount= this.Vtotalcount+1;
    // }

  }


  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._BrowsSalesBillService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._BrowsSalesBillService.userForm.get('StoreId').setValue(this.StoreList[0]);

    });
  }
  gePharStoreList1() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._BrowsSalesBillService.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
      this._BrowsSalesBillService.formReturn.get('StoreId').setValue(this.Store1List[0]);

    });
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getSalesList() {

    var vdata = {
      F_Name: this._BrowsSalesBillService.userForm.get('F_Name').value || '%',
      L_Name: this._BrowsSalesBillService.userForm.get('L_Name').value || '%',
      From_Dt: this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      To_Dt: this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      Reg_No: this._BrowsSalesBillService.userForm.get('RegNo').value || 0,
      SalesNo: this._BrowsSalesBillService.userForm.get('SalesNo').value || 0,
      OP_IP_Type: this._BrowsSalesBillService.userForm.get('OP_IP_Type').value,
      StoreId: this._BrowsSalesBillService.userForm.get('StoreId').value.storeid || 0,
      IPNo: this._BrowsSalesBillService.userForm.get('IPNo').value || 0

    }
    //  console.log(vdata);
    this._BrowsSalesBillService.getSalesList(vdata).subscribe(data => {
      this.dssaleList1.data = data as SaleList[];
      this.dssaleList1.sort = this.sort;
      this.dssaleList1.paginator = this.paginator;
      console.log(this.dssaleList1.data);
    })

  }

  OnPayment(SelectedValue) {


    const dialogRef = this._matDialog.open(OpPaymentNewComponent,
      {
        maxWidth: "100vw",
        height: '600px',
        width: '100%',
        data: {
          vPatientHeaderObj: SelectedValue,
          FromName: "SalesSETTLEMENT"
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)

      if (result.IsSubmitFlag == true) {

        let updateBillobj = {};
        updateBillobj['salesID'] = SelectedValue.SalesId;
        updateBillobj['BillNo'] = SelectedValue.SalesId;
        updateBillobj['BillBalAmount'] = 0// result.submitDataPay.ipPaymentInsert.balanceAmountController //result.BalAmt;

        //const updateBill = new UpdateBill(updateBillobj);
        let CreditPaymentobj = {};
        CreditPaymentobj['paymentId'] = 0;
        CreditPaymentobj['BillNo'] = SelectedValue.SalesId;
        CreditPaymentobj['ReceiptNo'] = '';
        CreditPaymentobj['PaymentDate'] = this.currentDate || '01/01/1900';
        CreditPaymentobj['PaymentTime'] = this.currentDate || '01/01/1900';
        CreditPaymentobj['CashPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.CashPayAmount) || 0;
        CreditPaymentobj['ChequePayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.ChequePayAmount) || 0;
        CreditPaymentobj['ChequeNo'] = result.submitDataPay.ipPaymentInsert.ChequeNo || '';
        CreditPaymentobj['BankName'] = result.submitDataPay.ipPaymentInsert.BankName || '';
        CreditPaymentobj['ChequeDate'] = result.submitDataPay.ipPaymentInsert.ChequeDate || '01/01/1900';
        CreditPaymentobj['CardPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.CardPayAmount) || 0;
        CreditPaymentobj['CardNo'] = result.submitDataPay.ipPaymentInsert.CardNo || '';
        CreditPaymentobj['CardBankName'] = result.submitDataPay.ipPaymentInsert.CardBankName || '';
        CreditPaymentobj['CardDate'] = result.submitDataPay.ipPaymentInsert.CardDate || '01/01/1900';
        CreditPaymentobj['AdvanceUsedAmount'] = 0;
        CreditPaymentobj['AdvanceId'] = 0;
        CreditPaymentobj['RefundId'] = 0;
        CreditPaymentobj['TransactionType'] = 4,// result.submitDataPay.ipPaymentInsert.TransactionType || 4;
          CreditPaymentobj['Remark'] = result.submitDataPay.ipPaymentInsert.Remark || '';
        CreditPaymentobj['AddBy'] = this._loggedService.currentUserValue.user.id,
          CreditPaymentobj['IsCancelled'] = 0;
        CreditPaymentobj['IsCancelledBy'] = 0;
        CreditPaymentobj['IsCancelledDate'] = "01/01/1900";
        CreditPaymentobj['opD_IPD_Type'] = 3;
        CreditPaymentobj['neftPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.NEFTPayAmount) || 0;
        CreditPaymentobj['neftNo'] = result.submitDataPay.ipPaymentInsert.NEFTNo || '';
        CreditPaymentobj['neftBankMaster'] = result.submitDataPay.ipPaymentInsert.NEFTBankMaster || '';
        CreditPaymentobj['neftDate'] = result.submitDataPay.ipPaymentInsert.NEFTDate || '01/01/1900';
        CreditPaymentobj['PayTMAmount'] = result.submitDataPay.ipPaymentInsert.PayTMAmount || 0;
        CreditPaymentobj['PayTMTranNo'] = result.submitDataPay.ipPaymentInsert.paytmTransNo || '';
        CreditPaymentobj['PayTMDate'] = result.submitDataPay.ipPaymentInsert.PayTMDate || '01/01/1900'

        //            const ipPaymentInsert = new IpPaymentInsert(CreditPaymentobj);

        let Data = {
          "update_Pharmacy_BillBalAmount": updateBillobj,
          "salesPayment": CreditPaymentobj
        };
        console.log(Data);

        this._BrowsSalesBillService.InsertSalessettlement(Data).subscribe(response => {
          console.log(response)
          if (response) {
            console.log(response)
            // Swal.fire('Sales Credit Settlement!', 'Sales Credit Payment Successfully !', 'success').then((result) => {
            //   if (result.isConfirmed) {
            //     // let m = response;
            //     // this.getpaymentPrint(response);
            //     this._matDialog.closeAll();
            //   }
            // });
            this.toastr.success('Sales Credit Payment Successfully !', 'Success', {
              toastClass: 'tostr-tost custom-toast-error',
            });
            this._matDialog.closeAll();
            this.getSalesList();
          }
          else {
            // Swal.fire('Error !', 'Sales  Payment not saved', 'error');
            this.toastr.error('Sales Credit Payment  not saved !', 'error', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        });

      }
      // else {
      //   // Swal.fire('Payment not Done.....');
      // }
    });

  }

  getSalesDetList(Parama) {
    var vdata = {
      SalesID: Parama.SalesId,
      OP_IP_Type: Parama.OP_IP_Type
    }
    this._BrowsSalesBillService.getSalesDetList(vdata).subscribe(data => {
      this.dssalesList2.data = data as SalesDetList[];
      // this.dssalesList2.sort = this.sort;
      // this.dssalesList2.paginator = this.paginator;
      // console.log( this.dssalesList2.data);
    })
  }

  getSalesReturnList() {
    var vdata = {
      F_Name: this._BrowsSalesBillService.formReturn.get('F_Name').value || '%',
      L_Name: this._BrowsSalesBillService.formReturn.get('L_Name').value || '%',
      From_Dt: this.datePipe.transform(this._BrowsSalesBillService.formReturn.get('startdate1').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      To_Dt: this.datePipe.transform(this._BrowsSalesBillService.formReturn.get('enddate1').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      Reg_No: this._BrowsSalesBillService.formReturn.get('RegNo').value || 0,
      SalesNo: this._BrowsSalesBillService.formReturn.get('SalesNo').value || 0,
      OP_IP_Type: this._BrowsSalesBillService.formReturn.get('OP_IP_Types').value || 0,
      StoreId: this._BrowsSalesBillService.formReturn.get('StoreId').value.storeid || 0,
    }
    console.log(vdata);
    this._BrowsSalesBillService.getSalesReturnList(vdata).subscribe(data => {
      this.dssalesReturnList.data = data as SalesReturnList[];
      this.dssalesReturnList.sort = this.sort;
      this.dssalesReturnList.paginator = this.paginator;
      console.log(this.dssalesReturnList.data);
    })
  }
  getSalesReturnDetList(Parama) {
    var vdata = {
      SalesReturnId: Parama.SalesReturnId

    }

    this._BrowsSalesBillService.getSalesReturnDetList(vdata).subscribe(data => {
      this.dssalesReturnList1.data = data as SalesReturnDetList[];
      // this.dssalesReturnList1.sort = this.sort;
      // this.dssalesReturnList1.paginator = this.paginator;
      // console.log(this.dssalesReturnList1.data);
    })
  }
  onSelect1(Parama) {
    // console.log(Parama);
    this.getSalesReturnDetList(Parama)
  }




  getPrint(el) {
    debugger

    var D_data = {
      "SalesID": el.SalesId,// 
      "OP_IP_Type": el.OP_IP_Type
    }

    let printContents;
    this.subscriptionArr.push(
      this._BrowsSalesService.getSalesPrint(D_data).subscribe(res => {
        this.reportPrintObjList = res as Printsal[];
        console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as Printsal;
        this.getTemplate();
      })
    );
  }


  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    debugger


    if (event.keyCode === 114) {
      // this. selectRow(event,this.dssaleList1.data);
      this.getWhatsappshareSales(this.rowid);
    }
  }

  // private selectRow($event, dataSource) {
  //   debugger
  //   // if ($event.checked) {
  //     console.log(dataSource.name);
  //     let id=dataSource.selectedData;
  //     this. getWhatsappshare(this.rowid);
  //   }
  // }



  onSelect(Parama) {

    this.getSalesDetList(Parama)
    this.rowid = Parama;
  }


  getPrint2(el) {
    debugger
    if (el.PaidType=='Credit' && el.IsRefundFlag==false) {
      this.type = "Credit"
      this.Creditflag = true;
    } else if(!(el.PaidType=='Credit' && el.IsRefundFlag==false)){
      this.type=" "
      this.Creditflag = false;
    }
    var D_data = {
        "SalesID": el.SalesId,// 
        "OP_IP_Type": el.OP_IP_Type
      }

    let printContents;
    this.subscriptionArr.push(
      this._BrowsSalesService.getSalesPrint(D_data).subscribe(res => {

        this.reportPrintObjList = res as Printsal[];
        console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as Printsal;

        // if(this.reportPrintObj.ChequePayAmount !=0){
        //   this.UTRNO = this.reportPrintObj.ChequeNo;
        // }else if(this.reportPrintObj.CardPayAmount !=0){
        //   this.UTRNO =  this.UTRNO +','+ this.reportPrintObj.ChequeNo;
        // }else if(this.reportPrintObj.NEFTPayAmount !=0){
        //   this.UTRNO =  this.UTRNO +','+ this.reportPrintObj.NEFTNo;
        // }else if(this.reportPrintObj.PayTMAmount !=0){
        //   this.UTRNO =  this.UTRNO +','+ this.reportPrintObj.PayTMTranNo;
        // }


        console.log(this.reportPrintObj);
        setTimeout(() => {
          this.print3();
        }, 1000);

      })
    );
  }
  viewSalesPdf(el) {
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      // this.SpinLoading =true;
      this.AdList = true;
      this._BrowsSalesBillService.getPdfSales(el.SalesId, el.OP_IP_Type).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharma sales bill viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = '';
        });
      });

    }, 100);
  }

  ViewSalesRetPdf(el) {
    this.sIsLoading = true;
    setTimeout(() => {

      this.AdList = true;
      this._BrowsSalesBillService.getSalesReturnPdf(el.SalesReturnId, el.OP_IP_Type).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pharma sales bill viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = ' ';
        });
      });

    }, 100);
  }

  getPrint3(el) {

    var D_data = {
      "SalesID": el.SalesId,// 
      "OP_IP_Type": el.OP_IP_Type
    }

    let printContents;
    this.subscriptionArr.push(
      this._BrowsSalesService.getSalesPrint(D_data).subscribe(res => {

        this.reportPrintObjList = res as Printsal[];
        console.log(this.reportPrintObjList);

        this.reportPrintObj = res[0] as Printsal;
        console.log(this.reportPrintObj);
        this.getTemplateTax2();


      })
    );
  }

  getTemplateTax() {

    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=37';
    this._BrowsSalesService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo', 'StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName', 'HTotalAmount', 'ExtMobileNo'];
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
        let PackValue = '1200'
        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>

        var strabc = `<hr style="border-color:white" >
        <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:20px;margin-left:20px;">
            <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
      
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.HSNcode + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.ManufShortName + `</div> 
        </div>
        <div style="display:flex;width:240px;text-align:left;margin-left:10px;">
            <div>`+ objreportPrint.ItemName + `</div> 
        </div>
         <div style="display:flex;width:60px;text-align:left;">
            <div>`+ objreportPrint.Qty + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.BatchNo + `</div> 
         </div>
        <div style="display:flex;width:90px;text-align:left;margin-left:10px;">
        <div>`+ this.datePipe.transform(objreportPrint.BatchExpDate, 'dd/MM/yyyy') + `</div> 
        </div>
        <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
        <div>`+ objreportPrint.UnitMRP + `</div> 
        </div>
        <div style="display:flex;width:100px;margin-left:10px;text-align:left;">
            <div>`+ '₹' + objreportPrint.TotalAmount.toFixed(2) + `</div> 
        </div>
        </div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];

      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate);

      setTimeout(() => {
        this.print2();
      }, 1000);
    });


  }
  getTemplateTax2() {

    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=37';
    this._BrowsSalesService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo', 'StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName', 'HTotalAmount', 'ExtMobileNo'];
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
        let PackValue = '1200'
        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>

        var strabc = `<hr style="border-color:white" >
        <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:20px;margin-left:20px;">
            <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
      
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.HSNcode + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.ManufShortName + `</div> 
        </div>
        <div style="display:flex;width:240px;text-align:left;margin-left:10px;">
            <div>`+ objreportPrint.ItemName + `</div> 
        </div>
         <div style="display:flex;width:60px;text-align:left;">
            <div>`+ objreportPrint.Qty + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.BatchNo + `</div> 
         </div>
        <div style="display:flex;width:90px;text-align:left;margin-left:10px;">
        <div>`+ this.datePipe.transform(objreportPrint.BatchExpDate, 'dd/MM/yyyy') + `</div> 
        </div>
        <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
        <div>`+ objreportPrint.UnitMRP + `</div> 
        </div>
        <div style="display:flex;width:100px;margin-left:10px;text-align:left;">
            <div>`+ '₹' + objreportPrint.TotalAmount.toFixed(2) + `</div> 
        </div>
        </div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];

      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate);

      setTimeout(() => {
        this.print3();
      }, 1000);
    });


  }

  getTemplateSalesReturn() {

    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=37';
    this._BrowsSalesService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo', 'StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName', 'HTotalAmount', 'ExtMobileNo'];
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
        let PackValue = '1200'
        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>

        var strabc = `<hr style="border-color:white" >
        <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:20px;margin-left:20px;">
            <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
      
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.HSNcode + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.ManufShortName + `</div> 
        </div>
        <div style="display:flex;width:240px;text-align:left;margin-left:10px;">
            <div>`+ objreportPrint.ItemName + `</div> 
        </div>
         <div style="display:flex;width:60px;text-align:left;">
            <div>`+ objreportPrint.Qty + `</div> 
        </div>
        <div style="display:flex;width:90px;text-align:center;">
        <div>`+ objreportPrint.BatchNo + `</div> 
         </div>
        <div style="display:flex;width:90px;text-align:left;margin-left:10px;">
        <div>`+ this.datePipe.transform(objreportPrint.BatchExpDate, 'dd/MM/yyyy') + `</div> 
        </div>
        <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
        <div>`+ objreportPrint.UnitMRP + `</div> 
        </div>
        <div style="display:flex;width:100px;margin-left:10px;text-align:left;">
            <div>`+ '₹' + objreportPrint.TotalAmount.toFixed(2) + `</div> 
        </div>
        </div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];

      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate);

      setTimeout(() => {
        this.printSalesReturn();
      }, 1000);
    });


  }

  getTemplate(old = true) {

    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=36';
    this._BrowsSalesService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo', 'StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName', 'HTotalAmount', 'ExtMobileNo'];
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
        let PackValue = '1200'
        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>

        var strabc = `<hr style="border-color:white" >
      <div style="display:flex;margin:8px 0">
      <div style="display:flex;width:40px;margin-left:20px;">
          <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
      </div>
    
      <div style="display:flex;width:90px;text-align:center;">
      <div>`+ objreportPrint.HSNcode + `</div> 
      </div>
      <div style="display:flex;width:90px;text-align:center;">
      <div>`+ objreportPrint.ManufShortName + `</div> 
      </div>
      <div style="display:flex;width:240px;text-align:left;margin-left:10px;">
          <div>`+ objreportPrint.ItemName + `</div> 
      </div>
       <div style="display:flex;width:60px;text-align:left;">
          <div>`+ objreportPrint.Qty + `</div> 
      </div>
      <div style="display:flex;width:90px;text-align:center;">
      <div>`+ objreportPrint.BatchNo + `</div> 
       </div>
      <div style="display:flex;width:90px;text-align:left;margin-left:10px;">
      <div>`+ this.datePipe.transform(objreportPrint.BatchExpDate, 'dd/MM/yyyy') + `</div> 
      </div>
      <div style="display:flex;width:80px;text-align:left;margin-left:20px;">
      <div>`+ objreportPrint.UnitMRP + `</div> 
      </div>
      <div style="display:flex;width:100px;margin-left:10px;text-align:left;">
          <div>`+ '₹' + objreportPrint.TotalAmount.toFixed(2) + `</div> 
      </div>
      </div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];

      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate);

      setTimeout(() => {
        old ? this.print() : this.print2();
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

  printSalescollection() {
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
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.Salescollectiontemplate.nativeElement.innerHTML}</body>
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

    // popupWin.document.close();
  }
  print2() {
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
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.billTemplate.nativeElement.innerHTML}</body>
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

    // popupWin.document.close();
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

  getSalesRetPrint(el) {
    var D_data = {
      "SalesID": el.SalesReturnId,
      "OP_IP_Type": el.OP_IP_Type,
    }
    let printContents;
    this.subscriptionArr.push(
      this._BrowsSalesService.getSalesReturnPrint(D_data).subscribe(res => {
        this.reportPrintObjList = res as Printsal[];
        // console.log(this.reportPrintObjList);
        setTimeout(() => {
          this.printSalesReturn();
        }, 1000);
      })
    );
  }
  printSalesReturn() {
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
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.billSalesReturn.nativeElement.innerHTML}</body>
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

  CreateFormData(obj: any, formData: FormData, subKeyStr = '') {
    for (const i in obj) {
      const value = obj[i]; let subKeyStrTrans = i;
      if (subKeyStr) {
        if (i.indexOf(' ') > -1 || !isNaN(parseInt(i)))
          subKeyStrTrans = subKeyStr + '[' + i + ']';
        else
          subKeyStrTrans = subKeyStr + '.' + i;
      }
      if (typeof (value) === 'object' && !(value instanceof Date) && !(value instanceof File)) {
        this.CreateFormData(value, formData, subKeyStrTrans);
      }
      else {
        formData.append(subKeyStrTrans, value ?? '');
      }
    }
  }

  loadingarry: any = [];
  getWhatsappshareSales(el) {

    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": el.RegNo,
        "smsString": "Dear" + el.PatientName + ",Your Sales Bill has been successfully completed. UHID is " + el.SalesNo + " For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur " || '',
        "isSent": 0,
        "smsType": 'Sales',
        "smsFlag": 0,
        "smsDate": this.currentDate,
        "tranNo": el.SalesId,
        "PatientType": 2,//el.PatientType,
        "templateId": 0,
        "smSurl": "info@gmail.com",
        "filePath": this.Filepath || '',
        "smsOutGoingID": 0

      }
    }
    console.log(m_data);
    this._BrowsSalesBillService.InsertWhatsappSales(m_data).subscribe(response => {
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
    el.button.disbled = false;
  }

  getWhatsappshareSalesReturn(el) {
    debugger
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": el.RegNo,
        "smsString": "Dear" + el.PatientName + ",Your Sales Bill has been successfully completed. UHID is " + el.SalesNo + " For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur " || '',
        "isSent": 0,
        "smsType": 'SalesReturn',
        "smsFlag": 0,
        "smsDate": this.currentDate,
        "tranNo": el.SalesReturnId,
        "PatientType": 2,//el.PatientType,
        "templateId": 0,
        "smSurl": "info@gmail.com",
        "filePath": this.Filepath || '',
        "smsOutGoingID": 0

      }
    }
    console.log(m_data);
    this._BrowsSalesBillService.InsertWhatsappSalesReturn(m_data).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'WhatsApp  Data  save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();

          }
        });
      } else {
        Swal.fire('Error !', 'Whatsapp Sms Data  not saved', 'error');
      }

    });
    this.IsLoading = false;
    el.button.disbled = false;
  }


  expPrint(el, xls) {
    debugger
    var D_data = {
      "SalesID": el.SalesId,// 
      "OP_IP_Type": el.OP_IP_Type
    }


    this.subscriptionArr.push(
      this._BrowsSalesService.getSalesPrint(D_data).subscribe(res => {

        this.reportPrintObjList = res as Printsal[];
        if (this.reportPrintObjList.length > 0) {
          console.log(this.reportPrintObjList);
          this.onExport(this.reportPrintObjList, el, xls);
        }
      })
    );


  }

  onExport(reportPrintObjList, el, exprtType) {
    debugger
    // setTimeout(() => {
    //   this.expPrint(el);
    // }, 1000);
    this.reportPrintObjList = reportPrintObjList;

    let columnList = [];
    if (this.reportPrintObjList.length == 0) {
    }
    else {
      var excelData = [];
      // let str = {

      //   "Sales Final BILL": "\\n"

      // };
      // excelData.push(str);

      // let str1 = {
      //   "Bill NO -": "\\n",
      //   "": el.SalesId
      // };
      // excelData.push(str1);

      var a = 1;
      for (var i = 0; i < this.reportPrintObjList.length; i++) {
        this.TotalAmt = (parseFloat(this.reportPrintObjList[i]["TotalAmount"]) + parseFloat(this.TotalAmt)).toFixed(2);

        let singleEntry = {
          "": "",
          "Sr No": a + i,
          "HSN": this.reportPrintObjList[i]["HSNcode"] ? this.reportPrintObjList[i]["HSNcode"] : "N/A",
          "ItemName ": this.reportPrintObjList[i]["ItemName"] ? this.reportPrintObjList[i]["ItemName"] : "N/A",
          "BatchNo": this.reportPrintObjList[i]["BatchNo"] ? this.reportPrintObjList[i]["BatchNo"] : "N/A",
          "BatchExpDate": this.datePipe.transform(this.reportPrintObjList[i]["BatchExpDate"], 'dd/m/yyy') ? this.datePipe.transform(this.reportPrintObjList[i]["BatchExpDate"], 'dd/m/yyy') : "N/A",
          "Qty": this.reportPrintObjList[i]["Qty"] ? this.reportPrintObjList[i]["Qty"] : "N/A",
          "UnitMRP": this.reportPrintObjList[i]["UnitMRP"] ? this.reportPrintObjList[i]["UnitMRP"] : "N/A",
          "TotalAmount": this.reportPrintObjList[i]["TotalAmount"] ? this.reportPrintObjList[i]["TotalAmount"] : "N/A"

        };
        excelData.push(singleEntry);
      }
      excelData.concat('/n');

      let singleEntry1 = {

        "": this.TotalAmt ? this.TotalAmt : "N/A"

      };
      excelData.push(singleEntry1);

      var fileName = "Sales Bill " + el.SalesId + ".xlsx";
      if (exprtType == "Excel") {
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
        var wscols = [];
        if (excelData.length > 0) {
          var columnsIn = excelData[0];
          console.log(columnsIn);
          for (var key in columnsIn) {
            let headerLength = { wch: (key.length + 1) };
            let columnLength = headerLength;
            try {
              columnLength = { wch: Math.max(...excelData.map(o => o[key].length), 0) + 1 };
            }
            catch {
              columnLength = headerLength;
            }
            if (headerLength["wch"] <= columnLength["wch"]) {
              wscols.push(columnLength)
            }
            else {
              wscols.push(headerLength)
            }
          }
        }
        ws['!cols'] = wscols;
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, fileName);
      }
      else {
        let doc = new jsPDF('p', 'pt', 'a4');
        doc.page = 0;
        var col = [];
        for (var k in excelData[0]) col.push(k);
        console.log(col.length)
        var rows = [];
        excelData.forEach(obj => {
          console.log(obj)
          let arr = [];
          col.forEach(col => {
            arr.push(obj[col]);
          });
          rows.push(arr);
        });

        doc.autoTable(col, rows, {
          margin: { left: 20, right: 20, top: 50 },
          theme: "grid",
          styles: { fillColor: [205, 110, 210] },
          columnStyles: { 0: { halign: 'center', fillColor: [0, 255, 0] } }, // Cells in first column centered and green

          // styles: {
          //   fontSize: 3,
          //   textColor:20
          // }
        });
        doc.setFontSize(3);
        // doc.save("Indoor-Patient-List.pdf");
        window.open(URL.createObjectURL(doc.output("blob")))
      }
    }
  }

  WhatsSalesRetPdf(el) {

  }
}

export class SaleList {
  Date: number;
  SalesNo: number;
  RegNo: number;
  PatientName: string;
  BalAmt: number;
  PaidAmt: number;
  PaidType: number;
  IPNo: any;


  constructor(SaleList) {
    {
      this.Date = SaleList.Date || 0;
      this.SalesNo = SaleList.SalesNo || 0;
      this.RegNo = SaleList.RegNo || 0;
      this.PatientName = SaleList.PatientName || '';
      this.BalAmt = SaleList.BalAmt || 0;
      this.PaidAmt = SaleList.PaidAmt || 0;
      this.PaidType = SaleList.PaidType || 0;
      this.IPNo = SaleList.IPNo || 0;
    }
  }
}

export class SalesDetList {

  ItemName: string;
  BatchNo: number;
  Expdate: number;
  Qty: string;
  MRP: number;
  TotalMRP: number;
  GST: number;
  CGST: any;
  SGST: any;
  IGST: any;

  constructor(SalesDetList) {
    {
      this.ItemName = SalesDetList.ItemName || '';
      this.BatchNo = SalesDetList.BatchNo || 0;
      this.Expdate = SalesDetList.Expdate || 0;
      this.Qty = SalesDetList.Qty || 0;
      this.MRP = SalesDetList.MRP || 0;
      this.TotalMRP = SalesDetList.TotalMRP || 0;
      this.GST = SalesDetList.GST || 0;
      this.CGST = SalesDetList.CGST || 0;
      this.SGST = SalesDetList.SGST || 0;
      this.IGST = SalesDetList.IGST || 0;
    }
  }
}

export class SalesReturnList {
  SalesDate: number;
  SalesNo: number;
  RegNo: number;
  PatientName: string;
  BalAmt: number;
  PaidAmt: number;
  Type: number;



  constructor(SalesReturnList) {
    {
      this.SalesDate = SalesReturnList.SalesDate || 0;
      this.SalesNo = SalesReturnList.SalesNo || 0;
      this.RegNo = SalesReturnList.RegNo || 0;
      this.PatientName = SalesReturnList.PatientName || '';
      this.BalAmt = SalesReturnList.BalAmt || 0;
      this.PaidAmt = SalesReturnList.PaidAmt || 0;
      this.Type = SalesReturnList.Type || 0;

    }
  }

}
export class SalesReturnDetList {

  ItemName: string;
  BatchNo: number;
  Expdate: number;
  Qty: string;
  MRP: number;
  TotalMRP: number;
  GSTAmount: number;
  CGST: any;
  SGST: any;
  IGST: any;

  constructor(SalesReturnDetList) {
    {
      this.ItemName = SalesReturnDetList.ItemName || '';
      this.BatchNo = SalesReturnDetList.BatchNo || 0;
      this.Expdate = SalesReturnDetList.Expdate || 0;
      this.Qty = SalesReturnDetList.Qty || 0;
      this.MRP = SalesReturnDetList.MRP || 0;
      this.TotalMRP = SalesReturnDetList.TotalMRP || 0;
      this.GSTAmount = SalesReturnDetList.GSTAmount || 0;
      this.CGST = SalesReturnDetList.CGST || 0;
      this.SGST = SalesReturnDetList.SGST || 0;
      this.IGST = SalesReturnDetList.IGST || 0;
    }
  }

}
