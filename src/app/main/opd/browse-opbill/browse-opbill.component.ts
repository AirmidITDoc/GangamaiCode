import { Component, EventEmitter, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { BrowseOPBillService } from './browse-opbill.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ViewOPBillComponent } from './view-opbill/view-opbill.component';
import * as converter from 'number-to-words';
import { IpPaymentInsert, OPAdvancePaymentComponent, UpdateBill } from '../op-search-list/op-advance-payment/op-advance-payment.component';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OpPaymentNewComponent } from '../op-search-list/op-payment-new/op-payment-new.component';
@Component({
  selector: 'app-browse-opbill',
  templateUrl: './browse-opbill.component.html',
  styleUrls: ['./browse-opbill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowseOPBillComponent implements OnInit {

  @Output() showClicked = new EventEmitter();
  click: boolean = false;
  MouseEvent = true;
  hasSelectedContacts: boolean;
  isLoadingStr: string = '';
  dataArray = {};
  dataSource = new MatTableDataSource<BrowseOPDBill>();
  reportPrintObj: BrowseOPDBill;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: BrowseOPDBill[] = [];
  currentDate = new Date();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  selectedAdvanceObj: BrowseOPDBill;
  numberInWords!: string;
   value = 123;
  BrowseOPDBillsList: any;
  msg: any;

  isLoading = true;

  displayedColumns = [
    
    'chkBalanceAmt',
    "Bill",
    'BillDate',
    'BillNo',
    'RegNo',
    'PatientName',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'PaidAmount',
    'BalanceAmt',
    'action'
  ];


  showSpinner = false;
  tablehide = false;
  tableshow = true;




  constructor(private _fuseSidebarService: FuseSidebarService,
    public _BrowseOPDBillsService: BrowseOPBillService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,
    
  ) { }

  ngOnInit(): void {
    this.getBrowseOPDBillsList();
    this.onClear();
  }


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  NewBillpayment(SelectedRecordValue){
    console.log(SelectedRecordValue);
    // let PatientHeaderObj = {};
    // PatientHeaderObj['Date'] = contact.BillDate;
    // PatientHeaderObj['PatientName'] = contact.PatientName;
    // PatientHeaderObj['OPD_IPD_Id'] =contact.OPD_IPD_ID;
    // PatientHeaderObj['NetPayAmount'] =contact.NetPayableAmt;
    // PatientHeaderObj['BillId'] =contact.BillNo;

     const dialogRef = this._matDialog.open(OpPaymentNewComponent,
        {
          maxWidth: "90vw",
          height: '640px',
          width: '100%',
          data: {
            vPatientHeaderObj: SelectedRecordValue,
            FromName: "OP-Bill"
          }
        });

    dialogRef.afterClosed().subscribe(result => {

      let updateBillobj = {};
      updateBillobj['BillNo'] = SelectedRecordValue.BillNo;
      updateBillobj['BillBalAmount'] = 0;

      const updateBill = new UpdateBill(updateBillobj);
      let CreditPaymentobj = {};
      CreditPaymentobj['paymentId'] = 0;
      CreditPaymentobj['BillNo'] = SelectedRecordValue.BillNo;
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
      CreditPaymentobj['TransactionType'] = 0;
      CreditPaymentobj['Remark'] = result.submitDataPay.ipPaymentInsert.Remark || '';
      CreditPaymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
      CreditPaymentobj['IsCancelled'] = 0;
      CreditPaymentobj['IsCancelledBy'] = 0;
      CreditPaymentobj['IsCancelledDate'] = this.currentDate;
      // CreditPaymentobj['CashCounterId'] = 0;
      // CreditPaymentobj['IsSelfORCompany'] = 0;
      // CreditPaymentobj['CompanyId'] = 0;
      CreditPaymentobj['opD_IPD_Type'] = 0;
      CreditPaymentobj['neftPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.neftPayAmount) || 0;
      CreditPaymentobj['neftNo'] = result.submitDataPay.ipPaymentInsert.neftNo || '';
      CreditPaymentobj['neftBankMaster'] = result.submitDataPay.ipPaymentInsert.neftBankMaster || '';
      CreditPaymentobj['neftDate'] = result.submitDataPay.ipPaymentInsert.neftDate || '01/01/1900';
      CreditPaymentobj['PayTMAmount'] = result.submitDataPay.ipPaymentInsert.PayTMAmount || 0;
      CreditPaymentobj['PayTMTranNo'] = result.submitDataPay.ipPaymentInsert.paytmTransNo || '';
      CreditPaymentobj['PayTMDate'] = result.submitDataPay.ipPaymentInsert.PayTMDate || '01/01/1900'
      // CreditPaymentobj['PaidAmt'] = this.paymentForm.get('paidAmountController').value;
      // CreditPaymentobj['BalanceAmt'] = this.paymentForm.get('balanceAmountController').value;

      console.log(CreditPaymentobj)
      const ipPaymentInsert = new IpPaymentInsert(CreditPaymentobj);

        let Data = {
        "updateBill":updateBill,
        "paymentCreditUpdate": ipPaymentInsert
      }; 

    
      console.log(Data);

      this._BrowseOPDBillsService.InsertOPBillingsettlement(Data).subscribe(response => {
        if (response) {
          Swal.fire('OP Credit Bill With Payment!', 'Credit Bill Payment Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              // let m = response;
              // this.getPrint(m);
              this._matDialog.closeAll();
            }
          });
        } else {
          Swal.fire('Error !', 'OP Billing Payment not saved', 'error');
        }
        
      });
    });
  
}

  Billpayment(contact){
      let PatientHeaderObj = {};
      PatientHeaderObj['Date'] = contact.BillDate;
      PatientHeaderObj['PatientName'] = contact.PatientName;
      PatientHeaderObj['OPD_IPD_Id'] =contact.OPD_IPD_ID;
      PatientHeaderObj['NetPayAmount'] =contact.NetPayableAmt;
      PatientHeaderObj['BillId'] =contact.BillNo;
  
       const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
          {
            maxWidth: "90vw",
            height: '640px',
            width: '100%',
            data: {
              advanceObj: PatientHeaderObj,
              FromName: "OP-Bill"
            }
          });

      dialogRef.afterClosed().subscribe(result => {

        let updateBillobj = {};

        
        updateBillobj['BillNo'] = contact.BillNo;
        updateBillobj['BillBalAmount'] = 0;

        const updateBill = new UpdateBill(updateBillobj);
             
        debugger
        let CreditPaymentobj = {};
        CreditPaymentobj['paymentId'] = 0;
        CreditPaymentobj['BillNo'] = contact.BillNo;
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
        CreditPaymentobj['TransactionType'] = 0;
        CreditPaymentobj['Remark'] = result.submitDataPay.ipPaymentInsert.Remark || '';
        CreditPaymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
        CreditPaymentobj['IsCancelled'] = 0;
        CreditPaymentobj['IsCancelledBy'] = 0;
        CreditPaymentobj['IsCancelledDate'] = this.currentDate;
        // CreditPaymentobj['CashCounterId'] = 0;
        // CreditPaymentobj['IsSelfORCompany'] = 0;
        // CreditPaymentobj['CompanyId'] = 0;
        CreditPaymentobj['opD_IPD_Type'] = 0;
        CreditPaymentobj['neftPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.neftPayAmount) || 0;
        CreditPaymentobj['neftNo'] = result.submitDataPay.ipPaymentInsert.neftNo || '';
        CreditPaymentobj['neftBankMaster'] = result.submitDataPay.ipPaymentInsert.neftBankMaster || '';
        CreditPaymentobj['neftDate'] = result.submitDataPay.ipPaymentInsert.neftDate || '01/01/1900';
        CreditPaymentobj['PayTMAmount'] = result.submitDataPay.ipPaymentInsert.PayTMAmount || 0;
        CreditPaymentobj['PayTMTranNo'] = result.submitDataPay.ipPaymentInsert.paytmTransNo || '';
        CreditPaymentobj['PayTMDate'] = result.submitDataPay.ipPaymentInsert.PayTMDate || '01/01/1900'
        // CreditPaymentobj['PaidAmt'] = this.paymentForm.get('paidAmountController').value;
        // CreditPaymentobj['BalanceAmt'] = this.paymentForm.get('balanceAmountController').value;

        console.log(CreditPaymentobj)
        const ipPaymentInsert = new IpPaymentInsert(CreditPaymentobj);

          let Data = {
          "updateBill":updateBill,
          "paymentCreditUpdate": ipPaymentInsert
        }; 

      
        console.log(Data);

        this._BrowseOPDBillsService.InsertOPBillingsettlement(Data).subscribe(response => {
          if (response) {
            Swal.fire('OP Credit Bill With Payment!', 'Credit Bill Payment Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                // let m = response;
                // this.getPrint(m);
                this._matDialog.closeAll();
              }
            });
          } else {
            Swal.fire('Error !', 'OP Billing Payment not saved', 'error');
          }
          
        });
      });
    
  }
  onShow(event: MouseEvent) {
        this.click = !this.click;
    
    setTimeout(() => {
      {
        this.isLoadingStr = 'loading-data';

        this.getBrowseOPDBillsList();
      }

    }, 1000);
    this.MouseEvent = true;
    this.click = true;

  }



  onClear() {

    this._BrowseOPDBillsService.myFilterform.get('FirstName').reset('');
    this._BrowseOPDBillsService.myFilterform.get('LastName').reset('');
    this._BrowseOPDBillsService.myFilterform.get('RegNo').reset('');
    this._BrowseOPDBillsService.myFilterform.get('PBillNo').reset('');
  }



  getBrowseOPDBillsList() {
    this.isLoadingStr = 'loading';
    var D_data = {
      "F_Name": (this._BrowseOPDBillsService.myFilterform.get("FirstName").value).trim() + '%' || "%",
      "L_Name": (this._BrowseOPDBillsService.myFilterform.get("LastName").value).trim() + '%' || "%",
      "From_Dt": this.datePipe.transform(this._BrowseOPDBillsService.myFilterform.get("start").value, "MM-dd-yyyy"),
      "To_Dt": this.datePipe.transform(this._BrowseOPDBillsService.myFilterform.get("end").value, "MM-dd-yyyy"),
      "Reg_No": this._BrowseOPDBillsService.myFilterform.get("RegNo").value || 0,
      "PBillNo": this._BrowseOPDBillsService.myFilterform.get("PBillNo").value || 0,
    }
    setTimeout(() => {
      this.isLoadingStr = 'loading';
      this._BrowseOPDBillsService.getBrowseOPDBillsList(D_data).subscribe(Visit => {
        this.dataSource.data = Visit as BrowseOPDBill[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
      },
        error => {
          this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
        });
    }, 1000);

    // this.onClear();
  }



  onExport(exprtType) {
    // let columnList=[];
    // if(this.dataSource.data.length == 0){
    //   // this.toastr.error("No Data Found");
    //   Swal.fire('Error !', 'No Data Found', 'error');
    // }
    // else{
    //   var excelData = [];
    //   var a=1;
    //   for(var i=0;i<this.dataSource.data.length;i++){
    //     let singleEntry = {
    //       // "Sr No":a+i,
    //       "Bill Date" :this.dataSource.data[i]["BillDate"],
    //       "PBill No" :this.dataSource.data[i]["PBillNo"] ? this.dataSource.data[i]["PBillNo"]:"N/A",
    //       "RegNo " :this.dataSource.data[i]["RegNo"] ? this.dataSource.data[i]["RegNo"] :"N/A",
    //       "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"] : "N/A",
    //       "Total Amt" :this.dataSource.data[i]["TotalAmt"] ? this.dataSource.data[i]["TotalAmt"]:"N/A",
    //       "Concession Amt" :this.dataSource.data[i]["ConcessionAmt"] ? this.dataSource.data[i]["ConcessionAmt"]:"N/A",
    //       "NetPayable Amt" :this.dataSource.data[i]["NetPayableAmt"] ? this.dataSource.data[i]["NetPayableAmt"]:"N/A",
    //       "PaidAmount" :this.dataSource.data[i]["PaidAmount"] ? this.dataSource.data[i]["PaidAmount"]:"N/A",
    //       "BalanceAmt" :this.dataSource.data[i]["BalanceAmt"]?this.dataSource.data[i]["BalanceAmt"]:"N/A",
    //       "chkBalanceAmt" :this.dataSource.data[i]["chkBalanceAmt"]?this.dataSource.data[i]["chkBalanceAmt"]:"N/A"
    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "OutDoor-Bill-List " + new Date() +".xlsx";
    //   if(exprtType =="Excel"){
    //     const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(excelData);
    //     var wscols = [];
    //     if(excelData.length > 0){ 
    //       var columnsIn = excelData[0]; 
    //       console.log(columnsIn);
    //       for(var key in columnsIn){
    //         let headerLength = {wch:(key.length+1)};
    //         let columnLength = headerLength;
    //         try{
    //           columnLength = {wch: Math.max(...excelData.map(o => o[key].length), 0)+1}; 
    //         }
    //         catch{
    //           columnLength = headerLength;
    //         }
    //         if(headerLength["wch"] <= columnLength["wch"]){
    //           wscols.push(columnLength)
    //         }
    //         else{
    //           wscols.push(headerLength)
    //         }
    //       } 
    //     }
    //     ws['!cols'] = wscols;
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //     XLSX.writeFile(wb, fileName);
    //   }else{
    //     let doc = new jsPDF('p','pt', 'a4');
    //     doc.page = 0;
    //     var col=[];
    //     for (var k in excelData[0]) col.push(k);
    //       console.log(col.length)
    //     var rows = [];
    //     excelData.forEach(obj => {
    //       console.log(obj)
    //       let arr = [];
    //       col.forEach(col => {
    //         arr.push(obj[col]);
    //       });
    //       rows.push(arr);
    //     });

    //     doc.autoTable(col, rows,{
    //       margin:{left:5,right:5,top:5},
    //       theme:"grid",
    //       styles: {
    //         fontSize: 3
    //       }});
    //     doc.setFontSize(3);
    //     // doc.save("Indoor-Patient-List.pdf");
    //     window.open(URL.createObjectURL(doc.output("blob")))
    //   }
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
  
    this.dataSource.data = changes.dataArray.currentValue as BrowseOPDBill[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }




  getTemplate() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=2';
    this._BrowseOPDBillsService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName', 'HospitalAddress', 'Phone','EmailId', 'PhoneNo', 'RegNo', 'BillNo', 'AgeYear', 'AgeDay', 'AgeMonth', 'PBillNo', 'PatientName', 'BillDate', 'VisitDate', 'ConsultantDocName', 'DepartmentName', 'ServiceName', 'ChargesDoctorName', 'Price', 'Qty', 'ChargesTotalAmount', 'TotalBillAmount', 'NetPayableAmt', 'NetAmount', 'ConcessionAmt', 'PaidAmount', 'BalanceAmt', 'AddedByName','Address','MobileNo']; // resData[0].TempKeys;

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        var objreportPrint = this.reportPrintObjList[i - 1];

        console.log(objreportPrint);
        // Chargedocname
        let docname;
        if (objreportPrint.ChargesDoctorName)
          docname = objreportPrint.ChargesDoctorName;
        else
          docname = '';

          // <hr style="border-color:white" >
        var strabc = ` <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:60px;margin-left:20px;">
            <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
        <div style="display:flex;width:300px;margin-left:10px;text-align:left;">
            <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
        <div style="display:flex;width:300px;margin-left:10px;text-align:left;">
        <div>`+ docname + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
        <div style="display:flex;width:100px;text-align:left;justify-content: right;">
            <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
        </div>
        <div style="display:flex;width:60px;margin-left:40px;">
            <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
        </div>
        <div style="display:flex;width:80px;justify-content: right;">
            <div>`+ '₹' + objreportPrint.NetAmount.toFixed(2) + `</div> <!-- <div>450</div> -->
        </div>
        </div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];

      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.PaidAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
      
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      setTimeout(() => {
        this.print();
      }, 1000);
    });
  }

  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }
  transformBilld(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(this.reportPrintObj.BillDate, 'dd/MM/yyyy');
    return value;
  }
  convertToWord(e) {
    
    return converter.toWords(e);
  }
  // GET DATA FROM DATABASE 


  getPrint(el) {
    debugger;
    var D_data = {
      "BillNo": el.BillNo,
      
    }
  
    let printContents;
    this.subscriptionArr.push(
      this._BrowseOPDBillsService.getBillPrint(D_data).subscribe(res => {

        this.reportPrintObjList = res as BrowseOPDBill[];
        console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as BrowseOPDBill;

        this.getTemplate();


      })
    );
  }

  // PRINT 
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





  getViewbill(contact) {
    console.log(contact);
    let xx = {

      RegNo: contact.RegId,
      AdmissionID: contact.VisitId,
      PatientName: contact.PatientName,
      Doctorname: contact.Doctorname,
      AdmDateTime: contact.AdmDateTime,
      AgeYear: contact.AgeYear,
      ClassId: contact.ClassId,
      TariffName: contact.TariffName,
      TariffId: contact.TariffId,
      HospitalAddress: contact.HospitalAddress,
      BDate: contact.BDate,
      BalanceAmt: contact.BalanceAmt,
      TotalAmt: contact.TotalAmt,
      BillDate: contact.BillDate,
      BillNo: contact.BillNo,
      ConcessionAmt: contact.ConcessionAmt,
      HospitalName: contact.HospitalName,
      NetPayableAmt: contact.NetPayableAmt,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      OPD_IPD_Type: contact.OPD_IPD_Type,
      PBillNo: contact.PBillNo,
      PaidAmount: contact.PaidAmount,
      VisitDate: contact.VisitDate,
      TotalBillAmount: contact.TotalBillAmount,
      TransactionType: contact.TransactionType,
      ConsultantDocName: contact.ConsultantDocName,
      DepartmentName: contact.DepartmentName,
      AddedByName: contact.AddedByName,
      NetAmount: contact.NetAmount,
      ServiceName: contact.ServiceName,
      Price: contact.Price,
      Qty: contact.Qty,



    };
    this.advanceDataStored.storage = new BrowseOPDBill(xx);
    const dialogRef = this._matDialog.open(ViewOPBillComponent,
      {
        maxWidth: "80vw",
        maxHeight: "100vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }



  getRecord(el, i) {
    // console.log(el,i);
    // this._matDialog.open(SmsEmailTemplateComponent, {
    //   data: i,
    //   width: '40%',
    //   height: "fit-content",
    //   autoFocus: false
    // });

  }


}

export class ReportPrintObj {
  AdvanceNo: any;
  Address: any;
  HospitalName: any;
  RegNo: any;
  PatientName: any;
  IPDNo: any;
  Date: any;
  PatientType: any;
  AdvanceAmount: any;
}



export class BrowseOPDBill {
  BillNo: Number;
  
  RegId: number;
  RegNo: number;
  PatientName: string;
  FirstName: string;
  Middlename: string;
  LastName: string;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  BillDate: any;
  IPDNo: number;
  ServiceName: String;
  Price: number;
  Qty: number;
  ChargesTotalAmount: number;
  NetAmount: number;
  PaidAmount: number;
  HospitalName: string;
  HospitalAddress: string;
  Phone: number;
  EmailId:any;
  ChargesDoctorName: string;
  TotalBillAmount: number;
  ConsultantDocName: string;
  DepartmentName: string;
  IsCancelled: boolean;
  OPD_IPD_Type: number;
  PBillNo: string;
  BDate: Date;
  VisitDate: Date;
  BalanceAmt: number;
  AddedByName: string;
Department:any;
Address:any;
MobileNo:any;
  //PayTMAmount:number;
  //NEFTPayAmount:number;
  /**
   * Constructor
   *
   * @param BrowseOPDBill
   */
  constructor(BrowseOPDBill) {
    {
      this.BillNo = BrowseOPDBill.BillNo || '';
      this.RegId = BrowseOPDBill.RegId || '';
      this.RegNo = BrowseOPDBill.RegNo || '';
      this.PatientName = BrowseOPDBill.PatientName || '';
      this.FirstName = BrowseOPDBill.FirstName || '';
      this.Middlename = BrowseOPDBill.MiddleName || '';
      this.LastName = BrowseOPDBill.LastName || '';
      this.TotalAmt = BrowseOPDBill.TotalAmt || '';
      this.ConcessionAmt = BrowseOPDBill.ConcessionAmt || '';
      this.NetPayableAmt = BrowseOPDBill.NetPayableAmt || '';
      this.BillDate = BrowseOPDBill.BillDate || '';
      this.IPDNo = BrowseOPDBill.IPDNo || '';
      this.IsCancelled = BrowseOPDBill.IsCancelled || '';
      this.OPD_IPD_Type = BrowseOPDBill.OPD_IPD_Type || '';
      this.PBillNo = BrowseOPDBill.PBillNo || '';
      this.BDate = BrowseOPDBill.BDate || '';
      this.PaidAmount = BrowseOPDBill.PaidAmount || '';
      this.BalanceAmt = BrowseOPDBill.BalanceAmt || '';
      this.ServiceName = BrowseOPDBill.ServiceName || '';
      this.Price = BrowseOPDBill.Price || '';
      this.Qty = BrowseOPDBill.Qty || '';
      this.ChargesTotalAmount = BrowseOPDBill.ChargesTotalAmount || '';
      this.NetAmount = BrowseOPDBill.NetAmount || '';
      this.HospitalName = BrowseOPDBill.HospitalName || '';
      this.HospitalAddress = BrowseOPDBill.HospitalAddress || '';
      this.ChargesTotalAmount = BrowseOPDBill.ChargesTotalAmount || '';
      this.Phone = BrowseOPDBill.Phone || '';
      this.EmailId = BrowseOPDBill.EmailId || '';
      this.ConsultantDocName = BrowseOPDBill.ConsultantDocName || '';
      this.DepartmentName = BrowseOPDBill.DepartmentName || '';
      this.TotalBillAmount = BrowseOPDBill.TotalBillAmount || '';
      this.ChargesDoctorName = BrowseOPDBill.ChargesDoctorName || '';
      this.VisitDate = BrowseOPDBill.VisitDate || '';
      this.AddedByName = BrowseOPDBill.AddedByName || '';
      this.TotalAmt = BrowseOPDBill.TotalAmt || '';

      this.Address = BrowseOPDBill.Address || '';
      this.Department = BrowseOPDBill.Department || '';
      this.MobileNo=BrowseOPDBill.MobileNo || '';
    }
  }

}
