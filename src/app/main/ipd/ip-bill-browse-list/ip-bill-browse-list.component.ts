import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { AdvanceDataStored } from '../advance';
import { IPBrowseBillService } from './ip-browse-bill.service';
import { DatePipe } from '@angular/common';
// import { PrintServiceService } from 'app/core/services/print-service.service';
import { DomSanitizer } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import { SmsEmailTemplateComponent } from 'app/main/shared/componets/sms-email-template/sms-email-template.component';
import { ViewIPBillComponent } from './view-ip-bill/view-ip-bill.component';

@Component({
  selector: 'app-ip-bill-browse-list',
  templateUrl: './ip-bill-browse-list.component.html',
  styleUrls: ['./ip-bill-browse-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPBillBrowseListComponent implements OnInit {

  click: boolean = false;
  MouseEvent = true;
  hasSelectedContacts: boolean;
  dataArray = {};
  currentDate = new Date();
  companyList: any = [];
  //Company filter
  @ViewChild('pdfTemplate') pdfTemplate: ElementRef;
  public companyFilterCtrl: FormControl = new FormControl();
  public filteredCompany: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();

  dataSource = new MatTableDataSource<IpBillBrowseList>();
  dataSource1 = new MatTableDataSource<ReportPrintObj>();

  @Output() showClicked = new EventEmitter();

  BrowseOPDBillsList: any;
  msg: any;
  sIsLoading: string = '';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  reportPrintObj: ReportPrintObj;
  reportPrintObjList: ReportPrintObj[] = [];
  subscriptionArr: Subscription[] = [];
  printTemplate: any;


  displayedColumns = [
    'SelfOrCompany',
    'InterimOrFinal',
    'BillDate',
    'PBillNo',
    'RegID',
    'PatientName',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'CashPay',
    'CardPay',
    'ChequePay',
    'NEFTPay',
    'PayTMPay',
    'AdvPay',
    'action',
  ];


  constructor(public _IpBillBrowseListService: IPBrowseBillService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private santitized:DomSanitizer,
    // private printService:PrintServiceService,
    private advanceDataStored: AdvanceDataStored,) {

  }

  ngOnInit(): void {
    this.getCompanyNameCombobox();

    this.companyFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCompany();
      });
    // TotalAmt: this.datePipe.transform(this._IpBillBrowseListService.myFilterform.get("start").value,"MM-dd-yyyy")  ||  "01/01/1900",

    this.onShow_IpdBrowse();
  }

  //  Filter for comapny combo  
  private filterCompany() {

    if (!this.companyList) {
      return;
    }
    // get the search keyword
    let search = this.companyFilterCtrl.value;
    if (!search) {
      this.filteredCompany.next(this.companyList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCompany.next(
      this.companyList.filter(bank => bank.CompanyName.toLowerCase().indexOf(search) > -1)
    );
  }

  // company combo list
  getCompanyNameCombobox() {
    // this._drugService.getClassMasterCombo().subscribe(data => this.ClassmbList =data);
    this._IpBillBrowseListService.getCompanyMasterCombo().subscribe(data => {
      this.companyList = data;
      this.filteredCompany.next(this.companyList.slice());

    })
  }


  getRecord(el, i) {
    // console.log(el,i);
    this._matDialog.open(SmsEmailTemplateComponent, {
      data: i,
      width: '40%',
      height: "fit-content",
      autoFocus: false
    });

  }


  //   transform(
  //     TotalAmt: number,
  //     currencyCode: string = 'INR',
  //     display:
  //         | 'code'
  //         | 'symbol'
  //         | 'symbol-narrow'
  //         | string
  //         | boolean = 'symbol',
  //     digitsInfo: string = '3.2-2',
  //     locale: string = 'TotalAmt',
  // ): string | null {
  //     return formatCurrency(
  //       TotalAmt,
  //       locale,
  //       getCurrencySymbol(currencyCode, 'wide'),
  //       currencyCode,
  //       digitsInfo,
  //     );
  // }

  onShow(event: MouseEvent) {
    //debugger;

    this.click = !this.click;
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';
        this.onShow_IpdBrowse();
      }
    }, 200);
    this.MouseEvent = true;
  }


  // onKey(event: KeyboardEvent) { 
  //   // if value is not empty the set click to false otherwise true
  //   this.click = (event.target as HTMLInputElement).value === '' ? true:false;
  // }


  onExport(exprtType){
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
    //       "Reg ID" :this.dataSource.data[i]["RegID"] ? this.dataSource.data[i]["RegID"] :"N/A",
    //       "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"] : "N/A",
    //       "Total Amt" :this.dataSource.data[i]["TotalAmt"] ? this.dataSource.data[i]["TotalAmt"]:"N/A",
    //       "Concession Amt" :this.dataSource.data[i]["ConcessionAmt"] ? this.dataSource.data[i]["ConcessionAmt"]:"N/A",
    //       "NetPayable Amt" :this.dataSource.data[i]["NetPayableAmt"] ? this.dataSource.data[i]["NetPayableAmt"]:"N/A",
    //       "Cash Pay" :this.dataSource.data[i]["CashPay"] ? this.dataSource.data[i]["CashPay"]:"N/A",
    //       "Card Pay" :this.dataSource.data[i]["CardPay"]+" - "+this.dataSource.data[i]["CardPay"],
    //       "Cheque Pay" :this.dataSource.data[i]["ChequePay"]? this.dataSource.data[i]["ChequePay"]:"N/A",
    //        "NEFT Pay" :this.dataSource.data[i]["NEFTPay"] ? this.dataSource.data[i]["NEFTPay"]:"N/A",
    //       "PayTM Pay" :this.dataSource.data[i]["PayTMPay"] ? this.dataSource.data[i]["PayTMPay"]:"N/A",
    //       "Adv Pay" :this.dataSource.data[i]["AdvPay"]?this.dataSource.data[i]["AdvPay"]:"N/A"
    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "Indoor-Bill-List " + new Date() +".xlsx";
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

  onClear() {

    this._IpBillBrowseListService.myFilterform.get('FirstName').reset();
    this._IpBillBrowseListService.myFilterform.get('LastName').reset();
    this._IpBillBrowseListService.myFilterform.get('RegNo').reset();
    this._IpBillBrowseListService.myFilterform.get('PBillNo').reset();
    this._IpBillBrowseListService.myFilterform.get('CompanyId').reset();
  }

  getViewbill(contact) {
    //console.log(contact);
    let xx = {
      RegNo: contact.RegNo,
      AdmissionID: contact.VisitId,
      PatientName: contact.PatientName,
      Doctorname: contact.Doctorname,
      AdmDateTime: contact.AdmDateTime,
      AgeYear: contact.AgeYear,
      ClassId: contact.ClassId,
      TariffName: contact.TariffName,
      TariffId: contact.TariffId,
      BillNo: contact.BillNo,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      BillDate: contact.BillDate,
      GenderName: contact.GenderName,
      RefDocName: contact.RefDocName,
      RoomName: contact.RoomName,
      BedName: contact.BedName,
      DischargeDate: contact.DischargeDate,
      PatientType: contact.PatientType,
      ServiceName: contact.ServiceName,
      Price: contact.Price,
      Qty: contact.Qty,
      NetAmount: contact.NetAmount,
      TotalAmt: contact.TotalAmt,
      AdvanceUsedAmount: contact.AdvanceUsedAmount,
      PaidAmount: contact.PaidAmount,
      PayTMPayAmount: contact.PayTMPayAmount,
      CashPayAmount: contact.CashPayAmount,
      ChequePayAmount: contact.ChequePayAmount,
      NEFTPayAmount: contact.NEFTPayAmount,
      TotalAdvanceAmount: contact.TotalAdvanceAmount,
      AdvanceBalAmount: contact.AdvanceBalAmount,
      AdvanceRefundAmount: contact.AdvanceRefundAmount,
      UserName: contact.UserName,
      IPDNo: contact.IPDNo,
      AdmissionDate: contact.AdmissionDate,
    };
    this.advanceDataStored.storage = new IpBillBrowseList(xx);

    const dialogRef = this._matDialog.open(ViewIPBillComponent,
      {
        maxWidth: "90vw",
        maxHeight: "130vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed - Insert Action', result);
      //  this.getRadiologytemplateMasterList();
    });
  }



  onShow_IpdBrowse() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._IpBillBrowseListService.myFilterform.get("FirstName").value + '%' || "%",
      "L_Name": this._IpBillBrowseListService.myFilterform.get("LastName").value + '%' || "%",
      "From_Dt": this.datePipe.transform(this._IpBillBrowseListService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._IpBillBrowseListService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "Reg_No": this._IpBillBrowseListService.myFilterform.get("RegNo").value || 0,
      "PBillNo": this._IpBillBrowseListService.myFilterform.get("PBillNo").value || 0,
      "IsInterimOrFinal": 2,//this._ipbillBrowseService.myFilterform.get("IsInterimOrFinal").value || "0",
      "CompanyId": this._IpBillBrowseListService.myFilterform.get("CompanyId").value || 0,
    }
     console.log(D_data);
    this._IpBillBrowseListService.getIpBillBrowseList(D_data).subscribe(data => {
      this.dataSource.data = data as IpBillBrowseList[];
      console.log( this.dataSource.data);                           
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;

    },
      error => {
        this.sIsLoading = '';
      });
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  ngOnChanges(changes: SimpleChanges) {

    this.dataSource.data = changes.dataArray.currentValue as IpBillBrowseList[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }


  ///// REPORT  TEMPOATE
  getTemplate() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=3';
    this._IpBillBrowseListService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName', 'HospitalAddress','EmailId', 'Phone','GroupName','BillNo', 'IPDNo', 'BillDate', 'PatientName', 'Age', 'GenderName', 'AdmissionDate', 'AdmissionTime', 'DischargeDate', 'DischargeTime', 'RefDocName', 'RoomName', 'BedName','RegNo',
        'PatientType', 'ServiceName', 'Price', 'Qty', 'ChargesTotalAmt', 'TotalAmt', 'AdvanceUsedAmount', 'PaidAmount', 'PayTMPayAmount', 'CashPayAmount', 'ChequePayAmount', 'NEFTPayAmount', 'TotalAdvanceAmount', 'AdvanceUsedAmount', 'AdvanceBalAmount', 'AdvanceRefundAmount', 'UserName']; // resData[0].TempKeys;

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        var objreportPrint = this.reportPrintObjList[i - 1];

        let docname;
        if(objreportPrint.ChargesDoctorName)
        docname=objreportPrint.ChargesDoctorName;
        else
        docname='';
        var strabc = ` 
<div style="display:flex;margin:8px 0">
    <div style="display:flex;width:80px;margin-left:20px;">
        <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
        <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
    <div>`+ docname + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:10px;">
    <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:10px;">
        <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
    </div>
    <div style="display:flex;width:150px;align-text:left;">
        <div>`+ '₹' + objreportPrint.ChargesTotalAmt.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
</div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];
     
      console.log(objPrintWordInfo);
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.TotalAmt));
      this.printTemplate = this.printTemplate.replace('StrBillDates', this.transform2(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transform1(objPrintWordInfo.AdmissionDate));
      this.printTemplate = this.printTemplate.replace('StrDischargeDate', this.transform1(objPrintWordInfo.DischargeDate));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('StrTotalAmt', '₹' + (objPrintWordInfo.TotalAmt.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrAdvanceUsedAmount', '₹' + (objPrintWordInfo.AdvanceUsedAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrPaiAmdount', '₹' + (objPrintWordInfo.PaidAmount.toFixed(2)));
      // this.printTemplate = this.printTemplate.replace('StrPayTMPayAmount', '₹' + (objPrintWordInfo.PayTMPayAmount.toFixed(2)));
      // this.printTemplate = this.printTemplate.replace('StrCashPayAmount', '₹' + (objPrintWordInfo.CashPayAmount.toFixed(2)));
      // this.printTemplate = this.printTemplate.replace('StrChequePayAmount', '₹' + (objPrintWordInfo.ChequePayAmount.toFixed(2)));
      // this.printTemplate = this.printTemplate.replace('StrNEFTPayAmount', '₹' + (objPrintWordInfo.NEFTPayAmount.toFixed(2)));
      // this.printTemplate = this.printTemplate.replace('StrTotalAdvanceAmount', '₹' + (objPrintWordInfo.TotalAdvanceAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrAdvanceUsedAmount', '₹' + (objPrintWordInfo.AdvanceUsedAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrAdvanceBalAmount', '₹' + (objPrintWordInfo.AdvanceBalAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrAdvanceRefundAmount', '₹' + (objPrintWordInfo.AdvanceRefundAmount.toFixed(2)));



      //console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
      console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      this.isShow=true;
      setTimeout(() => {
        this.print();
      }, 1000);
    });
  }

  transform(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd/MM/yyyy ');
    return value;
  }


  transform1(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd/MM/yyyy');
    return value;
  }

  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }



  convertToWord(e) {
    // this.numberInWords= converter.toWords(this.mynumber);
    // return converter.toWords(e);
  }

  // GET DATA FROM DATABASE 
  getPrint(el) {
    debugger;
    if (el.InterimOrFinal == 0) {
      var D_data = {
        "BillNo":  el.BillNo,
      }
      el.bgColor = 'red';

      let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
      this.subscriptionArr.push(
        this._IpBillBrowseListService.getIPBILLBrowsePrint(D_data).subscribe(res => {
          console.log(res);
          this.reportPrintObjList = res as ReportPrintObj[];
          this.reportPrintObj = res[0] as ReportPrintObj;

          console.log(this.reportPrintObj);
          this.getTemplate();
          // console.log(res);

        })
      );
    }
    else {

      this.getIPIntreimBillPrint(el);
    }
  }
   isShow=false;
  printTemplate1:any
  // PRINT 
   async print() {
    // HospitalName, HospitalAddress, AdvanceNo, PatientName
    let popupWin, printContents;
    // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;
    console.log(this.printTemplate);
    // this.printTemplate = this.printTemplate.replace("top:100px;","top:50px;");
    // var html = htmlToPdfmake(this.printTemplate);
    this.printTemplate=this.printTemplate;
    this.printTemplate1 = this.santitized.bypassSecurityTrustHtml(this.printTemplate);
    this.isShow=true;
    // const pdfPreviewCard = this.pdfTemplate.nativeElement;
    // var blob = new Blob([document.getElementById('canvas_div_pdf').innerHTML])
    // var docDefinition = {
    //   content: [blob]
    // }
    // pdfMake.createPdf(docDefinition).download("Slip.pdf")
    await new Promise(f => setTimeout(f, 100));     
    
    // var html = htmlToPdfmake(pdfPreviewCard.innerHTML);
    // var docDefinition = {
    //   content: [
    //   html
    //   ],
    //   pageBreakBefore: function(currentNode) {
    //     return currentNode.style && currentNode.style.indexOf('pdf-pagebreak-before') > -1;
    //   }
    // };
    // this.printService.exportPdf($(".canvas_div_pdf"),"IPBrowse");
    // pdfMake.createPdf(docDefinition).download("Slip.pdf");
  //   var HTML_Width = $(".canvas_div_pdf").width();
  //   var HTML_Height = $(".canvas_div_pdf").height();
  //   var top_left_margin = 15;
  //   var PDF_Width = HTML_Width+(top_left_margin*2);
  //   var PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
  //   var canvas_image_width = HTML_Width;
  //   var canvas_image_height = HTML_Height+5;
    
  //   var totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;  
  //   html2canvas($(".canvas_div_pdf")[0],{allowTaint:true,
  //               scale: 5
  //       //         ,onclone: function (clonedDoc) {
  //       // clonedDoc.getElementById('canvas_div_pdf').style.display = 'inline-block';}
  // }).then(function(canvas) {
  //     canvas.getContext('2d');
  //     console.log(canvas.height+"  "+canvas.width);
  //     var imgData = canvas.toDataURL("image/jpeg", 1.0);
  //     var pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
  //     pdf.internal.scaleFactor = 35;
  //     pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);
      
  //     for (var i = 1; i <= totalPDFPages; i++) { 
  //       pdf.addPage(PDF_Width, PDF_Height);
  //       pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
  //     }
        
  //     var datePipe = new DatePipe("en-US");
  //   var value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm:ss');
  //       pdf.save("HTML-Document"+value+".pdf");
  //       });
        this.isShow=false;
    
    // var data = document.getElementById('pdfTemplate');
    // html2canvas(data).then(canvas => {  
    //   // Few necessary setting options  
    //   console.log(canvas)
    //   let imgWidth = 208;   
    //   let pageHeight = 295;    
    //   let imgHeight = canvas.height * imgWidth / canvas.width;  
    //   let heightLeft = imgHeight;  

    //   const contentDataURL = canvas.toDataURL('image/png')  
    //   let pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF  
    //   let position = 0;  
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
    //   pdf.save('MYPdf.pdf'); // Generated PDF   
    // });  
    // var pdfDocGenerator = pdfMake.createPdf(docDefinition);
    // console.log(pdfDocGenerator)
    // popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    // // popupWin.document.open();
    // popupWin.document.write(` <html>
    // <head><style type="text/css">`);
    // popupWin.document.write(`
    //   </style>
    //       <title></title>
    //   </head>
    // `);
    // popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
    // </html>`);
    // popupWin.document.close();
  }


  getSummaryFinalBillPrint(el) {
    debugger;
    if (el.InterimOrFinal == 0) {
      var D_data = {
        "BillNo": el.BillNo,
      }
      el.bgColor = 'red';

      let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
      this.subscriptionArr.push(
        this._IpBillBrowseListService.getIPBILLBrowsePrint(D_data).subscribe(res => {
          console.log(res);
          this.reportPrintObjList = res as ReportPrintObj[];
          this.reportPrintObj = res[0] as ReportPrintObj;

          console.log(this.reportPrintObj);
          this.getSummaryFinalBillTemplate();
          // console.log(res);

        })
      );
    }
    else {

      this.getIPIntreimBillPrint(el);
    }
  }
  getSummaryFinalBillTemplate() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=18';
    this._IpBillBrowseListService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['HospitalName', 'HospitalAddress','EmailId', 'Phone','BillNo', 'IPDNo', 'BillDate', 'PatientName', 'Age', 'GenderName', 'AdmissionDate', 'AdmissionTime', 'DischargeDate', 'DischargeTime', 'RefDocName', 'RoomName', 'BedName',
        'PatientType', 'ServiceName', 'Price', 'Qty', 'ChargesTotalAmt', 'TotalAmt', 'AdvanceUsedAmount', 'PaidAmount', 'PayTMPayAmount', 'CashPayAmount', 'ChequePayAmount', 'NEFTPayAmount', 'TotalAdvanceAmount', 'AdvanceUsedAmount', 'AdvanceBalAmount', 'AdvanceRefundAmount', 'UserName']; // resData[0].TempKeys;

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        var objreportPrint = this.reportPrintObjList[i - 1];
        // var strabc = ` <hr >
        var strabc = ` 
<div style="display:flex;margin:8px 0">
    <div style="display:flex;width:80px;margin-left:30px;">
        <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:800px;margin-left:30px;">
        <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:100px;margin-left:30px;align-text:right;">
    <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:30px;align-text:right;">
        <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
    </div>
    <div style="display:flex;width:150px;margin-left:30px;align-text:left;margin-right:50px">
        <div>`+ '₹' + objreportPrint.ChargesTotalAmt.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
</div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.TotalAmt));
      this.printTemplate = this.printTemplate.replace('StrBillDates', this.transform2(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transform1(objPrintWordInfo.AdmissionDate));
      this.printTemplate = this.printTemplate.replace('StrDischargeDate', this.transform1(objPrintWordInfo.DischargeDate));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('StrTotalAmt', '₹' + (objPrintWordInfo.TotalAmt.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrAdvanceUsedAmount', '₹' + (objPrintWordInfo.AdvanceUsedAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrPaidAmount', '₹' + (objPrintWordInfo.PaidAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrPayTMPayAmount', '₹' + (objPrintWordInfo.PayTMPayAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrCashPayAmount', '₹' + (objPrintWordInfo.CashPayAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrChequePayAmount', '₹' + (objPrintWordInfo.ChequePayAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrNEFTPayAmount', '₹' + (objPrintWordInfo.NEFTPayAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrTotalAdvanceAmount', '₹' + (objPrintWordInfo.TotalAdvanceAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrAdvanceUsedAmount', '₹' + (objPrintWordInfo.AdvanceUsedAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrAdvanceBalAmount', '₹' + (objPrintWordInfo.AdvanceBalAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrAdvanceRefundAmount', '₹' + (objPrintWordInfo.AdvanceRefundAmount.toFixed(2)));



      //console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
      //console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      setTimeout(() => {
        this.print();
      }, 1000);
    });
  }

  //for Draft bill

  ///// REPORT  TEMPOATE
  getTemplateDraft() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=16';
    this._IpBillBrowseListService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['GroupName', "HospitalName", "HospitalAddress","EmailId", "Phone", "Pin", 'BillNo', 'IPDNo', 'BillDate', 'PatientName', 'Age', 'GenderName', 'AdmissionDate', 'AdmissionTime', 'DischargeDate', 'DischargeTime', 'RefDocName', 'RoomName', 'BedName', 'OPD_IPD_Type', 'TotalAmt', 'NetPayableAmt', 'PaidAmount', 'PBillNo', 'UserName']

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        var objreportPrint = this.reportPrintObjList[i - 1];
        // var strabc = ` <hr >
        var strabc = ` 
<div style="display:flex;margin:8px 0">
    <div style="display:flex;width:80px;margin-left:30px;">
        <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:400px;text-align: center;">
        <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:400px;text-align:center;">
    <div>`+ objreportPrint.ChargesDoctorName + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:70px;align-text:center;margin-left:40px;">
    <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:50px;align-text:center;margin-left:40px;">
        <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
    </div>
    <div style="display:flex;width:170px;align-text:center;margin-left:20px;">
        <div>`+ '₹' + objreportPrint.ChargesTotalAmt.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
</div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord1(objPrintWordInfo.TotalAmt));
      this.printTemplate = this.printTemplate.replace('StrBillDates', this.transformdraft2(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transformdraft(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transformdraft1(objPrintWordInfo.AdmissionDate));
      this.printTemplate = this.printTemplate.replace('StrDischargeDate', this.transformdraft1(objPrintWordInfo.DischargeDate));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('StrTotalAmt', '₹' + (objPrintWordInfo.TotalAmt.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrNetPayableAmt', '₹' + (objPrintWordInfo.NetPayableAmt.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrPaidAmount', '₹' + (objPrintWordInfo.PaidAmount.toFixed(2)));


      //console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
      //console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      setTimeout(() => {
        this.printDraft1();
      }, 1000);
    });
  }

  transformdraft(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd/MM/yyyy ');
    return value;
  }


  transformdraft1(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd/MM/yyyy');
    return value;
  }

  transformdraft2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }


  convertToWord1(e) {
    // this.numberInWords= converter.toWords(this.mynumber);
    // return converter.toWords(e);
  }

  // GET DATA FROM DATABASE 
  getIPIntreimBillPrint(el) {
    debugger;
    var D_data = {
      "BillNo": el.BillNo,
    }
    // el.bgColor = 'red';
    //console.log(el);
    let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
    this.subscriptionArr.push(
      this._IpBillBrowseListService.getIPIntriemBILLBrowsePrint(D_data).subscribe(res => {
        console.log(res);
        this.reportPrintObjList = res as ReportPrintObj[];
        this.reportPrintObj = res[0] as ReportPrintObj;


        console.log(this.reportPrintObj);
        this.getTemplateDraft();
        // console.log(res);

      })
    );
  }

  // PRINT 
  async printDraft() {
  this.printTemplate=this.printTemplate;
  console.log(this.printTemplate)
    this.printTemplate1 = this.santitized.bypassSecurityTrustHtml(this.printTemplate);
    this.isShow=true;
    await new Promise(f => setTimeout(f, 100));  
    // this.printService.exportPdf($(".canvas_div_pdf"),"IPBrowse");
    this.isShow=false;
  }

  async printDraft1() {
   

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

      

  getPrint1(el) {
    debugger;
    if (el.InterimOrFinal == 0) {
      var D_data = {
        "BillNo":  el.BillNo,
      }
      el.bgColor = 'red';

      let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
      this.subscriptionArr.push(
        this._IpBillBrowseListService.getIPBILLBrowsePrint(D_data).subscribe(res => {
          console.log(res);
          this.reportPrintObjList = res as ReportPrintObj[];
          this.reportPrintObj = res[0] as ReportPrintObj;

          console.log(this.reportPrintObj);
          this.getTemplate1();
          // console.log(res);

        })
      );
    }
    else {

      this.getIPIntreimBillPrint(el);
    }
  }

  getTemplate1() {
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=3';
    this._IpBillBrowseListService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray = ['GroupName','BillNo','HospitalName','Hospitaladdress','EmailId','Phone', 'IPDNo', 'BillDate', 'PatientName', 'Age','AgeDay', 'AgeMonth','GenderName', 'AdmissionDate', 'AdmissionTime', 'DischargeDate', 'DischargeTime', 'RefDocName', 'RoomName', 'BedName','RegNo',
        'PatientType', 'ServiceName', 'Price', 'Qty', 'ChargesTotalAmt', 'TotalAmt', 'AdvanceUsedAmount', 'PaidAmount', 'PayTMPayAmount', 'CashPayAmount', 'ChequePayAmount', 'NEFTPayAmount', 'TotalAdvanceAmount', 'AdvanceUsedAmount', 'AdvanceBalAmount', 'AdvanceRefundAmount', 'UserName']; // resData[0].TempKeys;

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      var strrowslist = "";
      for (let i = 1; i <= this.reportPrintObjList.length; i++) {
        var objreportPrint = this.reportPrintObjList[i - 1];

        let docname;
        if(objreportPrint.ChargesDoctorName)
        docname=objreportPrint.ChargesDoctorName;
        else
        docname='';
        var strabc = ` 
<div style="display:flex;margin:8px 0">
    <div style="display:flex;width:80px;margin-left:20px;">
        <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
        <div>`+ objreportPrint.ServiceName + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;">
    <div>`+ docname + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:10px;">
    <div>`+ '₹' + objreportPrint.Price.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:10px;">
        <div>`+ objreportPrint.Qty + `</div> <!-- <div>1</div> -->
    </div>
    <div style="display:flex;width:150px;align-text:left;">
        <div>`+ '₹' + objreportPrint.ChargesTotalAmt.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
</div>`;
        strrowslist += strabc;
      }
      var objPrintWordInfo = this.reportPrintObjList[0];
     
      console.log(objPrintWordInfo);
      this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.TotalAmt));
      this.printTemplate = this.printTemplate.replace('StrBillDates', this.transform2(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform(objPrintWordInfo.BillDate));
      this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transform1(objPrintWordInfo.AdmissionDate));
      this.printTemplate = this.printTemplate.replace('StrDischargeDate', this.transform1(objPrintWordInfo.DischargeDate));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('StrTotalAmt', '₹' + (objPrintWordInfo.TotalAmt.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrAdvanceUsedAmount', '₹' + (objPrintWordInfo.AdvanceUsedAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrPaiAmdount', '₹' + (objPrintWordInfo.PaidAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrPayTMPayAmount', '₹' + (objPrintWordInfo.PayTMPayAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrCashPayAmount', '₹' + (objPrintWordInfo.CashPayAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrChequePayAmount', '₹' + (objPrintWordInfo.ChequePayAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrNEFTPayAmount', '₹' + (objPrintWordInfo.NEFTPayAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrTotalAdvanceAmount', '₹' + (objPrintWordInfo.TotalAdvanceAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrAdvanceUsedAmount', '₹' + (objPrintWordInfo.AdvanceUsedAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrAdvanceBalAmount', '₹' + (objPrintWordInfo.AdvanceBalAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrAdvanceRefundAmount', '₹' + (objPrintWordInfo.AdvanceRefundAmount.toFixed(2)));



      //console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
      console.log(this.printTemplate);
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      this.isShow=true;
      setTimeout(() => {
        this.print1();
      }, 1000);
    });
  }

   // PRINT 
   print1() {
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

}

export class IpBillBrowseList {
  BillNo: Number;
  RegID: number;
  RegNo: number;
  PatientName: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  NEFTPay: number;
  PayTMPay: number;
  BillDate: Date;
  OPD_IPD_Type: number;
  IsDischarged: number;
  IsBillGenerated: number;
  IsCancelled: boolean;
  OPD_IPD_ID: number;
  PBillNo: string;
  BDate: Date;
  DischargeDoctorName: string;
  GenderName: string;
  RefDocName: string;
  RoomName: string;
  BedName: string;
  DischargeDate: Date;
  PatientType: string;
  ServiceName: string;
  Price: number;
  Qty: number;
  NetAmount: number;
  AdvanceUsedAmount: string;
  PayTMPayAmount: number;
  CashPayAmount: number;
  ChequePayAmount: number;
  NEFTPayAmount: number;
  TotalAdvanceAmount: number;
  AdvanceBalAmount: number;
  AdvanceRefundAmount: number;
  UserName: string;
  PaidAmount: string;
  IPDNo: number;
  AdmissionDate: Date;
  ChargesTotalAmt: number;
  GroupName: String;
  Hospitaladdress:any;
  HospitalName:any;
  InterimOrFinal: boolean;
  DoctorName:any;
  /**
   * Constructor
   *
   * @param IpBillBrowseList
   */
  constructor(IpBillBrowseList) {
    {
      this.BillNo = IpBillBrowseList.BillNo || '';
      this.RegID = IpBillBrowseList.RegID || '';
      this.RegNo = IpBillBrowseList.RegNo || '';
      this.PatientName = IpBillBrowseList.PatientName || '';
      this.FirstName = IpBillBrowseList.FirstName || '';
      this.MiddleName = IpBillBrowseList.MiddleName || '';
      this.LastName = IpBillBrowseList.LastName || '';
      this.TotalAmt = IpBillBrowseList.TotalAmt || '';
      this.ConcessionAmt = IpBillBrowseList.ConcessionAmt || '';
      this.NetPayableAmt = IpBillBrowseList.NetPayableAmt || '';
      this.NEFTPay = IpBillBrowseList.NEFTPay;
      this.PayTMPay = IpBillBrowseList.PayTMPay;
      this.BillDate = IpBillBrowseList.BillDate || '';
      this.OPD_IPD_Type = IpBillBrowseList.OPD_IPD_Type || '';
      this.IsDischarged = IpBillBrowseList.IsDischarged || '';
      this.IsBillGenerated = IpBillBrowseList.IsBillGenerated || '';
      this.IsCancelled = IpBillBrowseList.IsCancelled || '';
      this.OPD_IPD_ID = IpBillBrowseList.OPD_IPD_ID || '';
      this.PBillNo = IpBillBrowseList.PBillNo || '';
      this.BDate = IpBillBrowseList.BDate || '';
      this.DoctorName=IpBillBrowseList.DoctorName || '';
      this.DischargeDoctorName = IpBillBrowseList.DischargeDoctorName || '';
      this.GenderName = IpBillBrowseList.GenderName || '';
      this.RefDocName = IpBillBrowseList.RefDocName || '';
      this.RoomName = IpBillBrowseList.RoomName || '';
      this.BedName = IpBillBrowseList.BedName || '';
      this.DischargeDate = IpBillBrowseList.DischargeDate || '';
      this.PatientType = IpBillBrowseList.PatientType || '';
      this.ServiceName = IpBillBrowseList.ServiceName || '';
      this.Price = IpBillBrowseList.ServiceName || '';
      this.Qty = IpBillBrowseList.Qty || '';
      this.NetAmount = IpBillBrowseList.NetAmount || '';
      this.AdvanceUsedAmount = IpBillBrowseList.AdvanceUsedAmount || '';
      this.PayTMPayAmount = IpBillBrowseList.PayTMPayAmount || '';
      this.CashPayAmount = IpBillBrowseList.CashPayAmount || '';
      this.ChequePayAmount = IpBillBrowseList.ChequePayAmount || '';
      this.NEFTPayAmount = IpBillBrowseList.NEFTPayAmount || '';
      this.TotalAdvanceAmount = IpBillBrowseList.TotalAdvanceAmount || '';
      this.AdvanceBalAmount = IpBillBrowseList.AdvanceBalAmount || '';
      this.AdvanceRefundAmount = IpBillBrowseList.AdvanceRefundAmount || '';
      this.UserName = IpBillBrowseList.UserName || '';
      this.PaidAmount = IpBillBrowseList.PaidAmount || '';
      this.IPDNo = IpBillBrowseList.IPDNo || '';
      this.AdmissionDate = IpBillBrowseList.AdmissionDate || '';
      this.ChargesTotalAmt = IpBillBrowseList.ChargesTotalAmt || 0;
      this.InterimOrFinal = IpBillBrowseList.InterimOrFinal || 0;
      this.GroupName = IpBillBrowseList.GroupName || 0;
       this.Hospitaladdress=IpBillBrowseList.Hospitaladdress || ';'
      this.HospitalName = IpBillBrowseList.HospitalName || '';
    }
  }
}

export class ReportPrintObj {
  HospitalName: any;
  HospitalAddress: any;
  EmailId: any;
  Phone: any;
  IPDNo: any;
  Date:any;
  BillNo: any;
  PatientName: any;
  BillDate: any;
  Age: any;
  GenderName: any;
  AdmissionDate: any;
  AdmissionTime: any;
  DischargeDate: any;
  DischargeTime
  RefDocName: any;
  RoomName: any;
  BedName: any;
  PatientType: any;
  DepartmentName: any;
  ServiceName: any;
  Price: any;
  Qty: any;
  ChargesTotalAmt: any;
  TotalAmt: any;
  AdvanceUsedAmount: any;
  PaidAmount: any;
  PayTMPayAmount: any;
  CashPayAmount: any;
  ChequePayAmount: any;
  NEFTPayAmount: any;
  TotalAdvanceAmount: any;
  AdvanceBalAmount: any;
  AdvanceRefundAmount: any;
  AddedByName: any;
  NetAmount: any;
  GroupName: String;
  NetPayableAmt: any;
  AdvanceAmount:any;
  TotalBillAmt:any;
  ConcessionAmt:any;
  ChargesDoctorName:string;
  AdmittedDoctorName:String;
  BalanceAmt:any;
  AgeMonth:any;
  AgeDay:any;
  Hospitaladdress:any;
  PaymentDate:any;
  
}

