import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { ReportService } from './report.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { fuseAnimations } from '@fuse/animations';
import { takeUntil } from 'rxjs/operators';
import { AdvanceDetailObj } from '../opd/appointment/appointment.component';

@Component({
  selector: 'app-all-report',
  templateUrl: './all-report.component.html',
  styleUrls: ['./all-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ALLReportComponent implements OnInit {

  //  idArray = ["Doctor Wise Patient Count Report","Referance Doctor Wise Patient Count Report","Concession Report","Daily Collection Report","Daily Collection Summary Report","Group Wise Collectio Report"];

  users = [
    { Name: 'Doctor Wise Patient Count Report' },
    { Name: 'Referance Doctor Wise Patient Count Report' },
    { Name: 'Concession Report' },
    { Name: 'Daily Collection Report' },
    { Name: 'Daily Collection Summary Report' },

    { Name: 'Group Wise Collection Report' },
    { Name: 'Credit Report' },
    { Name: 'Patient Ledger Report' },
    { Name: 'Service Wise Report Without Bill' },
    { Name: 'Service Wise Report Bill' },

    { Name: 'Service Wise Report ' },
    { Name: 'Bill Summary With TCS Report' },
    { Name: 'Ref By Patient Report' },
    { Name: 'Cancle Charges List Report' },
    { Name: 'Doctor(Vist.Admitted) Group Wise Report' },

    { Name: 'Doctor And Department  Wise Monthly Collection Report' },
    { Name: 'Service Wise Report With Bill Report' },
    { Name: 'IP Company Wise Bill Report' },
    { Name: 'IP Company Wise Credit Report' },
    { Name: 'IP Discharge & Bill Generation Pending Report' },

    { Name: 'IP Bill Generation Pending Report' },
    { Name: 'Collection Summary Report' },
    { Name: ' Bill Summary Report For 2 Lakh Amount' },
    { Name: 'Day Wise Collection Summary Report' },
    { Name: 'Company Wise Bill Raise Report' }


  ];

  sIsLoading: string = '';
  isLoading = true;
  isRateLimitReached = false;
  D_data1: any;
  hasSelectedContacts: boolean;
  doctorNameCmbList: any = [];
  DepartmentList: any = [];
  Doctor1List: any = [];
  ServiceList: any = [];
  savedValue: number = null;
  isLoadings = false;
  selectedAdvanceObj: AdvanceDetailObj;
  options = [];
  filteredOptions: any;
  billingServiceList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  isOpen = false;
  reportPrintObjList: Docwisegrouprpt[] = [];
  reportPrintObjList3: DocwisePatientCount[] = [];
  reportPrintObj3:DocwisePatientCount;
  reportPrintObj1:BillWithTCS;

  reportPrintObj: Docwisegrouprpt;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;

  SelectedRow: String;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [
    'ReportName'

    //  'action',

  ];

  dataSource = new MatTableDataSource<ReportInsert>();
  menuActions: Array<string> = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();


  public departmentFilterCtrl: FormControl = new FormControl();
  public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

  // /doctorone filter
  public doctoroneFilterCtrl: FormControl = new FormControl();
  public filteredDoctorone: ReplaySubject<any> = new ReplaySubject<any>(1);

  // /doctorone filter
  public serviceFilterCtrl: FormControl = new FormControl();
  public filteredService: ReplaySubject<any> = new ReplaySubject<any>(1);


  constructor(
    public _registrationService: ReportService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    // get Registration list on page load
    this.getregistrationList();
    this.getDepartmentList();
    this.getDoctor1List();
    this.getServiceListCombobox();




    this.departmentFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(serviceData => {
        if (serviceData && this.isLoading) {
          this.filteredDepartment = serviceData.filteredDepartment === null ? [] : serviceData.filteredDepartment;
          this.isLoadings = false;
          if (this.filteredDepartment && this.filteredDepartment && this.savedValue !== null && this.filteredDepartment) {
            this.departmentFilterCtrl.setValue(this.savedValue);
          }
          if (serviceData.error) {
            this.departmentFilterCtrl.setValue(this.savedValue);
            this.departmentFilterCtrl.setErrors({ 'serviceFail': serviceData.error });

          }
        }
        this.filterDepartment();
      });


    this.doctoroneFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctorone();
      })

    this.serviceFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterService();
      })
  }

  private filterDepartment() {
    // debugger;

    if (!this.DepartmentList) {
      return;
    }
    // get the search keyword
    let search = this.departmentFilterCtrl.value;
    if (!search) {
      this.filteredDepartment.next(this.DepartmentList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDepartment.next(
      this.DepartmentList.filter(bank => bank.DepartmentName.toLowerCase().indexOf(search) > -1)
    );

  }


  getDepartmentList() {
    let cData = this._registrationService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }



  // doctorone filter code  
  private filterDoctorone() {

    if (!this.Doctor1List) {
      return;
    }
    // get the search keyword
    let search = this.doctoroneFilterCtrl.value;
    if (!search) {
      this.filteredDoctorone.next(this.Doctor1List.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctorone.next(
      this.Doctor1List.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }

  getDoctor1List() {
    this._registrationService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      console.log(this.Doctor1List);
      this.filteredDoctorone.next(this.Doctor1List.slice());
    })
  }


  // Service filter code  
  private filterService() {

    if (!this.ServiceList) {
      return;
    }
    // get the search keyword
    let search = this.serviceFilterCtrl.value;
    if (!search) {
      this.filteredService.next(this.ServiceList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredService.next(
      this.ServiceList.filter(bank => bank.ServiceName.toLowerCase().indexOf(search) > -1)
    );
  }

  getServiceListCombobox() {
    // debugger;
    // let tempObj;
    // var m_data = {
    //   SrvcName: `${this._registrationService.myFilterform.get('SrvcName').value}%`,
    //   TariffId: this.selectedAdvanceObj.TariffId,
    //   ClassId: this.selectedAdvanceObj.ClassId
    // };
    // if (this._registrationService.myFilterform.get('SrvcName').value.length >= 1) {
    //   this._registrationService.getBillingServiceList(m_data).subscribe(data => {
    //     console.log(data);
    //     this.filteredOptions = data;
    //     console.log(this.filteredOptions);
    //     if (this.filteredOptions.length == 0) {
    //       this.noOptionFound = true;
    //     } else {
    //       this.noOptionFound = false;
    //     }
    //   });
    //   // });
    // }

    this._registrationService.getServiceMaster1Combo().subscribe(data => {
      this.ServiceList = data;
      console.log(this.ServiceList);
      this.filteredService.next(this.ServiceList.slice());
    })


  }

  openChanged(event) {
    this.isOpen = event;
    this.isLoading = event;
    if (event) {
      this.savedValue = this.departmentFilterCtrl.value;
      this.options = [];
      this.departmentFilterCtrl.reset();
      this._registrationService.getDepartmentCombo();
    }
  }


  // getSelectedObj(obj) {
  //   // debugger;

  //   this.SrvcName = obj.ServiceName;
  //   this.b_price = obj.Price;
  //   this.b_totalAmount = obj.Price;
  //   this.b_netAmount = obj.Price;
  //   this.serviceId = obj.ServiceId;
  //   this.b_isPath = obj.IsPathology;
  //   this.b_isRad = obj.IsRadiology;


  //   if (obj.IsDocEditable) {
  //     this.registeredForm.get('DoctorID').reset();
  //     this.registeredForm.get('DoctorID').setValidators([Validators.required]);
  //     this.registeredForm.get('DoctorID').enable();
  //     // this.isDoctor = true;

  //   } else {
  //     this.registeredForm.get('DoctorID').reset();
  //     this.registeredForm.get('DoctorID').clearValidators();
  //     this.registeredForm.get('DoctorID').updateValueAndValidity();
  //     this.registeredForm.get('DoctorID').disable();
  //     // this.isDoctor = false;

  //   }
  // }



  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  // clear data from input field 
  onClear() {
    this._registrationService.myFilterform.reset(
      {
        start: [],
        end: []
      }
    );
  }
  // get Registration list on Button click
  getregistrationList() {
    // this.sIsLoading = 'loading';
    // var D_data = {
    //   "F_Name": (this._registrationService.myFilterform.get("FirstName").value).trim() || '%',
    //   "L_Name": (this._registrationService.myFilterform.get("LastName").value).trim() || '%',
    //   "Reg_No": this._registrationService.myFilterform.get("RegNo").value || "0",
    //   "From_Dt": this.datePipe.transform(this._registrationService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
    //   "To_Dt": this.datePipe.transform(this._registrationService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
    //   "MobileNo": this._registrationService.myFilterform.get("MobileNo").value || '%',
    // }
    // // console.log(D_data);
    // setTimeout(() => {
    //   this.sIsLoading = 'loading-data';
    //   this._registrationService.getRegistrationList(D_data).subscribe(data => {
    //     this.dataSource.data = data as ReportInsert[];
    //     this.dataSource.sort = this.sort;
    //     this.dataSource.paginator = this.paginator;
    //     this.sIsLoading = '';
    //   },
    //     error => {
    //       this.sIsLoading = '';
    //     });
    // }, 500);



  }

  onEdit(m) {
    console.log(m);
    this.SelectedRow = m;

  }

  getPrint() {

    debugger;
    if (this.SelectedRow == 'Doctor(Vist.Admitted) Group Wise Report') {

      var D_data = {

        "DoctorId": this._registrationService.myFilterform.get('DoctorID').value.DoctorID || 9,
        "FromDate" :'01/01/2021',// this.datePipe.transform(this._registrationService.myFilterform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
        "ToDate" :'01/01/2021',// this.datePipe.transform(this._registrationService.myFilterform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
      }
      console.log(D_data);
      let printContents; 
    
        this._registrationService.getDocwiseGrouprptPrint(D_data).subscribe(res => {
          this.reportPrintObjList = res as Docwisegrouprpt[];
        console.log(this.reportPrintObjList);
        this.reportPrintObj = res[0] as Docwisegrouprpt;

        this.getTemplateDocWiseGroup();
        })
      

    }
    else if(this.SelectedRow == 'Bill Summary With TCS Report'){

      var D_data1 = {
        "FromDate" :'01/01/2021',// this.datePipe.transform(this._registrationService.myFilterform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
        "ToDate" :'01/01/2021',// this.datePipe.transform(this._registrationService.myFilterform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
      }
      console.log(D_data1);
      let printContents; 
    
        this._registrationService.getBillSummaryWithTCSPrint(D_data1).subscribe(res => {
          if(res){
            this.reportPrintObj1 = res[0] as BillWithTCS;
         console.log(this.reportPrintObj1);
           this.getTemplateBillSummTCS();
          }

        
        })

    }
    else if(this.SelectedRow.toString() == 'Doctor Wise Patient Count Report'){

      var D_data2 = {
        "FromDate" :'01/01/2023',// this.datePipe.transform(this._registrationService.myFilterform.get("start").value,"MM-dd-yyyy") || "01/01/1900",
        "ToDate" :'01/01/2023',// this.datePipe.transform(this._registrationService.myFilterform.get("end").value,"MM-dd-yyyy") || "01/01/1900",
        "DoctorID": this._registrationService.myFilterform.get('DoctorID').value.DoctorID || 9,
      }
      console.log(D_data2);
      let printContents; 
    
        this._registrationService.getDocWisepatientcountrint(D_data2).subscribe(res => {
          if(res){
            this.reportPrintObj1 = res[0] as BillWithTCS;
         console.log(this.reportPrintObj1);
           this.getTemplateDocWisePatientcount();
          }

        
        })

    }
  }




  getTemplateDocWiseGroup() {
// 'HospitalName','HospAddress','Phone','EmailId',
    debugger;
    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=22';
    this._registrationService.getTemplate(query).subscribe((resData: any) => {

      this.printTemplate = resData[0].TempDesign;
      let keysArray =['GroupName','DoctorName','BillNo','BillDate','NetPayableAmt','OPD_IPD_Type'];
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

     
        var strabc = ` 
<div style="display:flex;margin:8px 0">
    <div style="display:flex;width:80px;margin-left:10px;">
        <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:400px;margin-right:10px;">
        <div>`+ objreportPrint.GroupName + `</div> <!-- <div>BLOOD UREA</div> -->
    </div>
    <div style="display:flex;width:300px;margin-left:10px;align-text:center;">
    <div>`+ objreportPrint.DoctorName + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:70px;margin-left:110px;align-text:center;">
    <div>`+ '₹' + objreportPrint.BillNo.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
    <div style="display:flex;width:50px;margin-left:40px;align-text:center;">
        <div>`+ objreportPrint.BillDate + `</div> <!-- <div>1</div> -->
    </div>
    <div style="display:flex;width:150px;margin-left:50px;align-text:center;">
        <div>`+ '₹' + objreportPrint.NetPayableAmt.toFixed(2) + `</div> <!-- <div>450</div> -->
    </div>
</div>`;
        strrowslist += strabc;
      }
    
      // this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.PaidAmount));
      // this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
     

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      setTimeout(() => {
        this.print();
      }, 1000);
    });
  }

  
  
  getTemplateDocWisePatientcount() {
    // 'HospitalName','HospAddress','Phone','EmailId',
        debugger;
        let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=24';
        this._registrationService.getTemplate(query).subscribe((resData: any) => {
    
          this.printTemplate = resData[0].TempDesign;
          let keysArray =['RegNo','PatientName','VisitDate','DoctorName','PatientType'];
          debugger;
          for (let i = 0; i < keysArray.length; i++) {
            let reString = "{{" + keysArray[i] + "}}";
            let re = new RegExp(reString, "g");
            this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj3[keysArray[i]]);
          }
          var strrowslist = "";
          for (let i = 1; i <= this.reportPrintObjList3.length; i++) {
            console.log(this.reportPrintObjList3);
            var objreportPrint = this.reportPrintObjList3[i - 1];
    
         
            var strabc = ` 
    <div style="display:flex;margin:8px 0">
        <div style="display:flex;width:80px;margin-left:10px;">
            <div>`+ i + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
        <div style="display:flex;width:400px;margin-right:10px;">
            <div>`+ objreportPrint.DoctorName + `</div> <!-- <div>BLOOD UREA</div> -->
        </div>
        <div style="display:flex;width:300px;margin-left:10px;align-text:center;">
        <div>`+ objreportPrint.PatientName + `</div> <!-- <div>450</div> -->
        </div>
        <div style="display:flex;width:70px;margin-left:110px;align-text:center;">
        <div>`+ '₹' + objreportPrint.RegNo.toFixed(2) + `</div> <!-- <div>450</div> -->
        </div>
        <div style="display:flex;width:50px;margin-left:40px;align-text:center;">
            <div>`+ objreportPrint.VisitDate + `</div> <!-- <div>1</div> -->
        </div>
        <div style="display:flex;width:150px;margin-left:50px;align-text:center;">
            <div>`+ '₹' + objreportPrint.PatientType.toFixed(2) + `</div> <!-- <div>450</div> -->
        </div>
    </div>`;
            strrowslist += strabc;
          }
        
          // this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.PaidAmount));
          // this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
          this.printTemplate = this.printTemplate.replace('SetMultipleRowsDesign', strrowslist);
         
    
          this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
          setTimeout(() => {
            this.print();
          }, 1000);
        });
      }
    

  getTemplateBillSummTCS(){
    
  let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=23';
  this._registrationService.getBillWithTCSTemplates(query).subscribe((resData: any) => {
    console.log(this.printTemplate = resData[0].TempDesign);
    this.printTemplate = resData[0].TempDesign;
    console.log(this.printTemplate)
  

    
   let keysArray = ['RegNo','PatientName','AdmissionDate','NetPayableAmt','SpeTaxPer','SpeTaxAmt','BillDate']; // resData[0].TempKeys;
    for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
   
     
      // this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      // this.printTemplate = this.printTemplate.replace('StrBillDate', this.transform1(this.reportPrintObj.BillDate));
      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');
      console.log(this.printTemplate.replace(/{{.*}}/g, ''));
      setTimeout(() => {
        this.print();
      }, 50);
  });
  }

  print() {
    // HospitalName, HospitalAddress, AdvanceNo, PatientName
    let popupWin, printContents;
    // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
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

  OnSubmit() { }

  onClose() { }
}


export class ReportInsert {
  ReportName: Number;
  // RegDate : Date;

  /**
   * Constructor
   *
   * @param ReportInsert
   */

  constructor(ReportInsert) {
    {
      this.ReportName = ReportInsert.ReportName || '';
      //  this.RegDate = ReportInsert.RegDate || '';

    }
  }
}



export class Docwisegrouprpt {
  GroupName: any;
  DoctorName : any;
  BillNo: any;
 BillDate : any;
 NetPayableAmt:any;
 OPD_IPD_Type:any;
  /**
   * Constructor
   *
   * @param Docwisegrouprpt
   */

  constructor(Docwisegrouprpt) {
    {
      this.GroupName = Docwisegrouprpt.GroupName || '';
       this.DoctorName = Docwisegrouprpt.DoctorName || '';
       this.BillNo = Docwisegrouprpt.BillNo || '';
       this.BillDate = Docwisegrouprpt.BillDate || '';
       this.NetPayableAmt = Docwisegrouprpt.NetPayableAmt || '';
      this.OPD_IPD_Type=Docwisegrouprpt.OPD_IPD_Type ||0;
    }
  }
}




export class BillWithTCS {
  RegNo: any;
  PatientName : any;
  AdmissionDate: any;
  NetPayableAmt : any;
  SpeTaxPer:any;
  SpeTaxAmt:any;
  BillDate:any;

  /**
   * Constructor
   *
   * @param BillWithTCS
   */

  constructor(BillWithTCS) {
    {
      this.RegNo = BillWithTCS.RegNo || '';
       this.PatientName = BillWithTCS.PatientName || '';
       this.AdmissionDate = BillWithTCS.AdmissionDate || '';
       this.NetPayableAmt = BillWithTCS.NetPayableAmt || '';
       this.SpeTaxPer = BillWithTCS.SpeTaxPer || '';
      this.SpeTaxAmt=BillWithTCS.SpeTaxAmt ||0;
      this.BillDate=BillWithTCS.BillDate||'';
    }
  }
}



export class DocwisePatientCount {
  RegNo: any;
  PatientName : any;
  VisitDate: any;
  DoctorName : any;
  PatientType:any;
 
  /**
   * Constructor
   *
   * @param DocwisePatientCount
   */

  constructor(DocwisePatientCount) {
    {
      this.RegNo = DocwisePatientCount.RegNo || '';
       this.PatientName = DocwisePatientCount.PatientName || '';
       this.VisitDate = DocwisePatientCount.VisitDate || '';
       this.DoctorName = DocwisePatientCount.DoctorName || '';
       this.PatientType = DocwisePatientCount.PatientType || '';
      
    }
  }
}