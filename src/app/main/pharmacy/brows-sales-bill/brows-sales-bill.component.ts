import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'app-brows-sales-bill',
  templateUrl: './brows-sales-bill.component.html',
  styleUrls: ['./brows-sales-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowsSalesBillComponent implements OnInit { 

  @ViewChild('billTemplate') billTemplate:ElementRef;
  @ViewChild('billTemplate2') billTemplate2:ElementRef;
  @ViewChild('billSalesReturn') billSalesReturn:ElementRef;
  
  reportPrintObjList: Printsal[] = [];
  printTemplate: any;
  reportPrintObj: Printsal;
  reportPrintObjTax: Printsal;
  subscriptionArr: Subscription[] = [];
  currentDate =new Date();
  CustomerName:any="";
  CustomerId:any="";
  CustAddress:any="";
  ExMobile:any="";
  TotalCashpay:any=0;
  TotalCardpay:any=0;
  TotalChequepay:any=0;
  TotalNeftpay:any=0;
  TotalPatTmpay:any=0;
  TotalBalancepay:any=0;

  displayedColumns: string[] = [
    'action2',
     'action',
    'payment',
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
    'GST',
    'CGST',
    'SGST',
    'IGST'
  ]
  displayedColumns3: string[] = [
    'action',
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
  StoreList:any = [];
  Store1List:any = [];
  hasSelectedContacts: boolean;
   
  
  dssaleList1 = new MatTableDataSource<SaleList>();
  dssalesList2 = new MatTableDataSource<SalesDetList>();

  dssalesReturnList = new MatTableDataSource<SalesReturnList>();
  dssalesReturnList1 = new MatTableDataSource<SalesReturnDetList>();

  

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _BrowsSalesBillService:BrowsSalesBillService,
    public _BrowsSalesService :SalesService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
     
    
  ) { }

  ngOnInit(): void {
    //this.getSalesList();
    this.getSalesReturnList()
    this.gePharStoreList();
    this.gePharStoreList1();
  }
  gePharStoreList() {
    var vdata={
      Id : this._loggedService.currentUserValue.user.storeId
    }
    this._BrowsSalesBillService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._BrowsSalesBillService.userForm.get('StoreId').setValue(this.StoreList[0]);
      
    });
  }
  gePharStoreList1() {
    var vdata={
      Id : this._loggedService.currentUserValue.user.storeId
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

  getSalesList(){

    var vdata={
      F_Name:this._BrowsSalesBillService.userForm.get('F_Name').value || '%' ,                                            
      L_Name: this._BrowsSalesBillService.userForm.get('L_Name').value || '%'  ,                                     
      From_Dt: this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                      
      To_Dt :  this.datePipe.transform(this._BrowsSalesBillService.userForm.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                 
      Reg_No :this._BrowsSalesBillService.userForm.get('RegNo').value || 0  ,                  
      SalesNo :this._BrowsSalesBillService.userForm.get('SalesNo').value || 0  , 
      OP_IP_Type:this._BrowsSalesBillService.userForm.get('OP_IP_Type').value, 
      StoreId :this._BrowsSalesBillService.userForm.get('StoreId').value.storeid || 0  ,
       IPNo :this._BrowsSalesBillService.userForm.get('IPNo').value || 0
      
    }
  //  console.log(vdata);
    this._BrowsSalesBillService.getSalesList(vdata).subscribe(data=>{
      this.dssaleList1.data= data as SaleList[];
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
      
      if (result.IsSubmitFlag == true) {

            let updateBillobj = {};
            updateBillobj['BillNo'] = SelectedValue.SalesId;
            updateBillobj['BillBalAmount'] =0// result.submitDataPay.ipPaymentInsert.balanceAmountController //result.BalAmt;

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
            CreditPaymentobj['neftPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.neftPayAmount) || 0;
            CreditPaymentobj['neftNo'] = result.submitDataPay.ipPaymentInsert.neftNo || '';
            CreditPaymentobj['neftBankMaster'] = result.submitDataPay.ipPaymentInsert.neftBankMaster || '';
            CreditPaymentobj['neftDate'] = result.submitDataPay.ipPaymentInsert.neftDate || '01/01/1900';
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
                Swal.fire('Sales Credit Settlement!', 'Sales Credit Payment Successfully !', 'success').then((result) => {
                  if (result.isConfirmed) {
                    // let m = response;
                    // this.getpaymentPrint(response);
                    this._matDialog.closeAll();
                  }
                });
              }
              else {
                Swal.fire('Error !', 'Sales  Payment not saved', 'error');
              }

            });

          }
          // else {
          //   // Swal.fire('Payment not Done.....');
          // }
        });
         
    }

  getSalesDetList(Parama){
    var vdata={
      SalesID: Parama.SalesId,                  
      OP_IP_Type:Parama.OP_IP_Type
    }
    this._BrowsSalesBillService.getSalesDetList(vdata).subscribe(data=>{
      this.dssalesList2.data = data as SalesDetList[];
      // this.dssalesList2.sort = this.sort;
      // this.dssalesList2.paginator = this.paginator;
      // console.log( this.dssalesList2.data);
    })
  }

  onSelect(Parama){
    //console.log(Parama);
   this.getSalesDetList(Parama)
 }

  getSalesReturnList(){
    var vdata={
      F_Name : this._BrowsSalesBillService.formReturn.get('F_Name').value || '%'  ,                            
      L_Name : this._BrowsSalesBillService.formReturn.get('L_Name').value || '%'  ,                            
      From_Dt :this.datePipe.transform(this._BrowsSalesBillService.formReturn.get('startdate1').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                      
      To_Dt :  this.datePipe.transform(this._BrowsSalesBillService.formReturn.get('enddate1').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                 
      Reg_No :this._BrowsSalesBillService.formReturn.get('RegNo').value || 0  ,                                                                           
      SalesNo :  this._BrowsSalesBillService.formReturn.get('SalesNo').value || 0  ,
      OP_IP_Type : this._BrowsSalesBillService.formReturn.get('OP_IP_Types').value || 0  ,
      StoreId   :this._BrowsSalesBillService.formReturn.get('StoreId').value.storeid || 0  ,
    }
    console.log(vdata);
    this._BrowsSalesBillService.getSalesReturnList(vdata).subscribe(data =>{
      this.dssalesReturnList.data = data as SalesReturnList[];
      this.dssalesReturnList.sort = this.sort;
      this.dssalesReturnList.paginator = this.paginator;
       console.log(this.dssalesReturnList.data);
    })
  }
  getSalesReturnDetList(Parama)
  { var vdata={
    SalesReturnId:Parama.SalesReturnId
  
  }
 
  this._BrowsSalesBillService.getSalesReturnDetList(vdata).subscribe(data =>{
    this.dssalesReturnList1.data = data as SalesReturnDetList[];
    // this.dssalesReturnList1.sort = this.sort;
    // this.dssalesReturnList1.paginator = this.paginator;
    // console.log(this.dssalesReturnList1.data);
  })
  }
  onSelect1(Parama){
    // console.log(Parama);
   this.getSalesReturnDetList(Parama)
 }


 

 getPrint(el) {


console.log(event);
  var D_data = {
    "SalesID":el.SalesId,// 
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
  getPrint2(el) {
    
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
        setTimeout(() => {
          this.print3();
        }, 1000);
        // this.getTemplateTax();

        // this.CustomerName=this.reportPrintObj.PatientName;
        // this.CustomerId=this.reportPrintObj.RegNo;
        // this.CustAddress= " " //this.reportPrintObj.Address;
        // this.ExMobile=this.reportPrintObj.ExtMobileNo;
      })
    );
  }
  viewPdf(el){
    
    this._BrowsSalesBillService.getPdfSales(el.SalesId,el.OP_IP_Type).subscribe(res=>{
    const dialogRef = this._matDialog.open(PdfviewerComponent, 
      {   maxWidth: "85vw",
          height: '750px',
          width: '100%',
           data : {
          base64 : res["base64"] as string,
          title:"Pharma sales bill viewer"
        }
    });
    });
  }

getPrintsalescollection(el){

    
    var D_data = {

      "FromDate":'11/01/2023',// this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                           
      "ToDate":'11/30/2023',// this.datePipe.transform(this._BrowsSalesBillService.userForm.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',                                              
      "StoreId": 10016,//this._BrowsSalesBillService.formReturn.get('StoreId').value.storeid || 0  ,
      "AddedById": 0//this._loggedService.currentUserValue.user.id,
      
    }

    let printContents;
    this.subscriptionArr.push(
      this._BrowsSalesBillService.getSalesCollectionPrint(D_data).subscribe(res => {

        this.reportPrintObjList = res as Printsal[];
        console.log(this.reportPrintObjList);

        this.reportPrintObj = res[0] as Printsal;
        console.log(this.reportPrintObj);
        this.getTemplatesalescollection();

    
      })
    );
}
 getTemplatesalescollection() {
    
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=38';
    this._BrowsSalesService.getTemplate(query).subscribe((resData: any) => {
  
      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo','StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName','HTotalAmount','ExtMobileNo'];
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
        console.log(objreportPrint)
        
      this.TotalCashpay= (parseFloat(this.TotalCashpay) +  parseFloat(objreportPrint.CashPayAmount)).toFixed(4);
      this.TotalCardpay= (parseFloat(this.TotalCardpay) +  parseFloat(objreportPrint.CardPayAmount)).toFixed(4);
      this.TotalChequepay= (parseFloat(this.TotalChequepay) +  parseFloat(objreportPrint.ChequePayAmount)).toFixed(4);
      this.TotalNeftpay= (parseFloat(this.TotalNeftpay) +  parseFloat(objreportPrint.NEFTPayAmount)).toFixed(4);
      this.TotalPatTmpay= (parseFloat(this.TotalPatTmpay) +  parseFloat(objreportPrint.PayTMAmount)).toFixed(4);
      this.TotalBalancepay = (parseFloat(this.TotalPatTmpay) +  parseFloat(objreportPrint.BalanceAmount)).toFixed(4);

      console.log( this.TotalCashpay,this.TotalCardpay,this.TotalChequepay,this.TotalNeftpay,this.TotalPatTmpay)

        // <div style="display:flex;width:60px;margin-left:20px;">
        //     <div>`+ i + `</div> 
        // </div>
  
        // <div style="display:flex;width:300px;margin-left:10px;">
        // <div>`+ this.datePipe.transform(objreportPrint.Date, 'dd/MM/yyyy') + `</div>
        // </div>
        var strabc = `
        <hr style="border-color:white" >
        <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:50px;margin-left:20px;">
            <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
        <div style="display:flex;width:100px;text-align:center;">
        <div>`+  this.datePipe.transform(objreportPrint.Date, 'dd/MM/yyyy') + `</div> 
        </div>
        <div style="display:flex;width:110px;text-align:left;">
        <div>`+objreportPrint.SalesNo + `</div> 
        </div>
         <div style="display:flex;width:260px;text-align:left;">
            <div>`+ objreportPrint.PatientName + `</div> 
        </div>
        <div style="display:flex;width:120px;text-align:left;">
        <div>`+ objreportPrint.CashPayAmount + `</div> 
         </div>
        <div style="display:flex;width:120px;text-align:left;">
        <div>`+objreportPrint.CardPayAmount + `</div> 
        </div>
        <div style="display:flex;width:120px;text-align:left;">
        <div>`+ objreportPrint.ChequePayAmount + `</div> 
        </div>
          <div style="display:flex;width:120px;text-align:left;">
        <div>`+ objreportPrint.NEFTPayAmount + `</div> 
        </div>
          <div style="display:flex;width:120px;text-align:left;">
        <div>`+ objreportPrint.PayTMAmount + `</div> 
        </div>
          <div style="display:flex;width:120px;text-align:left;">
        <div>`+ objreportPrint.AdvanceUsedAmount + `</div> 
        </div>
        <div style="display:flex;width:120px;margin-left:10px;text-align:left;">
            <div>`+ '₹' + objreportPrint.BalanceAmount.toFixed(2) + `</div> 
        </div>
        </div>`;
        strrowslist += strabc;
      }

     
      var objPrintWordInfo = this.reportPrintObjList[0];
  
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.NetAmount));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);

      this.printTemplate = this.printTemplate.replace('SetTotalCashpay', this.TotalCashpay);
      this.printTemplate = this.printTemplate.replace('SetTotalCardpay', this.TotalCardpay);
      this.printTemplate = this.printTemplate.replace('SetTotalChequepay', this.TotalChequepay);
      this.printTemplate = this.printTemplate.replace('SetTotalNeftpay', this.TotalNeftpay);
      this.printTemplate = this.printTemplate.replace('SetTotalPatTmpay', this.TotalPatTmpay);
      this.printTemplate = this.printTemplate.replace('SetTotalBalancepay', this.TotalBalancepay);


      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate);
  
      setTimeout(() => {
         this.print();
      }, 1000);
    });
  
  
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
      let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo','StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName','HTotalAmount','ExtMobileNo'];
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
        <div>`+objreportPrint.ManufShortName + `</div> 
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
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
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
      let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo','StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName','HTotalAmount','ExtMobileNo'];
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
        <div>`+objreportPrint.ManufShortName + `</div> 
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
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
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
      let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo','StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName','HTotalAmount','ExtMobileNo'];
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
        <div>`+objreportPrint.ManufShortName + `</div> 
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
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
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
    let keysArray = ['PatientName', 'RegNo', 'IP_OP_Number', 'DoctorName', 'SalesNo', 'Date', 'Time', 'ItemName', 'OP_IP_Type', 'GenderName', 'AgeYear', 'BatchNo', 'BatchExpDate', 'UnitMRP', 'Qty', 'TotalAmount', 'GrossAmount', 'NetAmount', 'VatPer', 'VatAmount', 'DiscAmount', 'ConcessionReason', 'PaidAmount', 'BalanceAmount', 'UserName', 'HSNCode', 'CashPayAmount', 'CardPayAMount', 'ChequePayAmount', 'PayTMAmount', 'NEFTPayAmount', 'GSTPer', 'GSTAmt', 'CGSTAmt', 'CGSTPer', 'SGSTPer', 'SGSTAmt', 'IGSTPer', 'IGSTAmt', 'ManufShortName', 'StoreNo','StoreName', 'DL_NO', 'GSTIN', 'CreditReason', 'CompanyName','HTotalAmount','ExtMobileNo'];
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
      <div>`+objreportPrint.ManufShortName + `</div> 
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
    this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform2(objPrintWordInfo.Time));
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

getSalesRetPrint(el){
  
  var D_data = {
    "SalesID": el.SalesReturnId, 
    "OP_IP_Type": el.OP_IP_Type,
    "IsPrescriptionFlag": 0//el.IsPrescriptionFlag
  }
  let printContents;
  this.subscriptionArr.push(
    this._BrowsSalesService.getSalesReturnPrint(D_data).subscribe(res => {
      this.reportPrintObjList = res as Printsal[];
      console.log(this.reportPrintObjList);
      // this.reportPrintObj = res[0] as Printsal;
      this.getTemplateSalesReturn();
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
}

export class SaleList {
  Date:number;
  SalesNo:number;
  RegNo:number;
  PatientName:string;
  BalAmt:number;
  PaidAmt:number;
  PaidType:number;
  IPNo:any;

   
  constructor(SaleList) {
    {
      this.Date = SaleList.Date || 0;
      this.SalesNo = SaleList.SalesNo || 0;
      this.RegNo = SaleList.RegNo || 0;
      this.PatientName = SaleList.PatientName|| '';
      this.BalAmt = SaleList.BalAmt || 0;
      this.PaidAmt =SaleList.PaidAmt || 0;
      this.PaidType =SaleList.PaidType || 0;
       this.IPNo =SaleList.IPNo || 0;
    }
  }
} 

export class SalesDetList{
   
  ItemName:string;
  BatchNo:number;
  Expdate:number;
  Qty:string;
  MRP:number;
  TotalMRP:number;
  GST:number;
  CGST:any;
  SGST:any;
  IGST: any;

  constructor(SalesDetList) {
    {
      this.ItemName = SalesDetList.ItemName || '';
      this.BatchNo = SalesDetList.BatchNo || 0;
      this.Expdate = SalesDetList.Expdate || 0;
      this.Qty = SalesDetList.Qty|| 0;
      this.MRP = SalesDetList.MRP || 0;
      this.TotalMRP =SalesDetList.TotalMRP || 0;
      this.GST =SalesDetList.GST || 0;
      this.CGST =SalesDetList.CGST || 0;
      this.SGST =SalesDetList.SGST || 0;
      this.IGST =SalesDetList.IGST || 0;
    }
  }
}

export class SalesReturnList{
  SalesDate:number;
  SalesNo:number;
  RegNo:number;
  PatientName:string;
  BalAmt:number;
  PaidAmt:number;
  Type:number;
 

   
  constructor(SalesReturnList) {
    {
      this.SalesDate = SalesReturnList.SalesDate || 0;
      this.SalesNo = SalesReturnList.SalesNo || 0;
      this.RegNo = SalesReturnList.RegNo || 0;
      this.PatientName = SalesReturnList.PatientName|| '';
      this.BalAmt = SalesReturnList.BalAmt || 0;
      this.PaidAmt =SalesReturnList.PaidAmt || 0;
      this.Type =SalesReturnList.Type || 0;
      
    }
  }

}
export class SalesReturnDetList{

  ItemName:string;
  BatchNo:number;
  Expdate:number;
  Qty:string;
  MRP:number;
  TotalMRP:number;
  GSTAmount:number;
  CGST:any;
  SGST:any;
  IGST: any;

  constructor(SalesReturnDetList) {
    {
      this.ItemName = SalesReturnDetList.ItemName || '';
      this.BatchNo = SalesReturnDetList.BatchNo || 0;
      this.Expdate = SalesReturnDetList.Expdate || 0;
      this.Qty = SalesReturnDetList.Qty|| 0;
      this.MRP = SalesReturnDetList.MRP || 0;
      this.TotalMRP =SalesReturnDetList.TotalMRP || 0;
      this.GSTAmount =SalesReturnDetList.GSTAmount || 0;
      this.CGST =SalesReturnDetList.CGST || 0;
      this.SGST =SalesReturnDetList.SGST || 0;
      this.IGST =SalesReturnDetList.IGST || 0;
    }
  }

}
