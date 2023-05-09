import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { AdvanceDataStored } from '../../advance';
import { DatePipe, Time } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AdmissionService } from './admission.service';
import Swal from 'sweetalert2';
import { AdvanceDetailObj } from 'app/main/opd/appointment/appointment.component';
import { NewAdmissionComponent } from './new-admission/new-admission.component';
import { EditAdmissionComponent } from './edit-admission/edit-admission.component';
import { fuseAnimations } from '@fuse/animations';
import { FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ViewAdmissionComponent } from './view-admission/view-admission.component';
import { SubCompanyTPAInfoComponent } from './sub-company-tpainfo/sub-company-tpainfo.component';
import { MLCInformationComponent } from './mlcinformation/mlcinformation.component';

@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AdmissionComponent implements OnInit {

  reportPrintObj: Admission;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: Admission[] = [];
  AdmittedPatientList: any;
  msg: any;
  sIsLoading: string = '';
  isLoading=true;
  doctorNameCmbList:any=[];
  hasSelectedContacts: boolean;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  @Output() sentCountsToParent = new EventEmitter<any>();

   // filter for doctor
   public doctorFilterCtrl: FormControl = new FormControl();
   public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);
   
 
   private _onDestroy = new Subject<void>();

  displayedColumns = [
    'RegNo',
    'PatientName',
    'DOA',
    'DOT',
    'Doctorname',
    'RefDocName',
    'IPNo',
    'PatientType',
    'WardName',
    'TariffName',
    'ClassName',
    'CompanyName',
    'RelativeName',
    // 'RelativePhoneNo',
    // 'HospitalName',
    'IsMLC',
    'buttons'
  ];
  dataSource = new MatTableDataSource<Admission>();
  menuActions: Array<string> = [];
  constructor(public _AdmissionService: AdmissionService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored) {
      this.getAdmittedPatientList();
  }

  ngOnInit(): void {

    this.getAdmittedDoctorCombo();

    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();

      });

      
    this.getAdmittedPatientList();

    if (this._ActRoute.url == '/ipd/admission') {

      this.menuActions.push('Edit Admission');
      this.menuActions.push('View Admission');
      this.menuActions.push('Update MLC Information');
      this.menuActions.push('Update TPA Company Information');
      this.menuActions.push('Print Patient Card');
      this.menuActions.push('Print Patient Sticker');
      this.menuActions.push('Prefix Demo');
      this.menuActions.push('Emergency');
    }
  }


  

  private filterDoctor() {
    // debugger;
    if (!this.doctorNameCmbList) {
      return;
    }
    // get the search keyword
    let search = this.doctorFilterCtrl.value;
    if (!search) {
      this.filtereddoctor.next(this.doctorNameCmbList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filtereddoctor.next(
      this.doctorNameCmbList.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }

  getAdmittedDoctorCombo() {
    debugger;
    this._AdmissionService.getAdmittedDoctorCombo().subscribe(data => {
      this.doctorNameCmbList = data;
      console.log(data);
      this.filtereddoctor.next(this.doctorNameCmbList.slice());
    });
  }
  

  ngOnChanges(changes: SimpleChanges) {

    this.dataSource.data = changes.dataArray.currentValue as Admission[];
    this.isLoading = false;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onExport(exprtType){
    // debugger;
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
    //       "Reg No" :this.dataSource.data[i]["RegNo"],
    //       "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"]:"N/A",
    //       "Date" :this.dataSource.data[i]["DOA"] ? this.dataSource.data[i]["DOA"] :"N/A",
    //       "Time" :this.dataSource.data[i]["DOT"] ? this.dataSource.data[i]["DOT"] : "N/A",
    //       "Doctor Name" :this.dataSource.data[i]["Doctorname"] ? this.dataSource.data[i]["Doctorname"]:"N/A",
    //       "Ref Doctor Name" :this.dataSource.data[i]["RefDocName"] ? this.dataSource.data[i]["RefDocName"]:"N/A",
    //       "IPD No" :this.dataSource.data[i]["IPDNo"] ? this.dataSource.data[i]["IPDNo"]:"N/A",
    //       "Patient Type" :this.dataSource.data[i]["PatientType"] ? this.dataSource.data[i]["PatientType"]:"N/A",
    //       "Ward Name" :this.dataSource.data[i]["RoomName"]+" - "+this.dataSource.data[i]["BedName"],
    //       "Tariff Name" :this.dataSource.data[i]["TariffName"]? this.dataSource.data[i]["TariffName"]:"N/A",
    //       // "Class Name" :this.dataSource.data[i]["ClassName"],
    //       "Company Name" :this.dataSource.data[i]["CompanyName"] ? this.dataSource.data[i]["CompanyName"]:"N/A",
    //       // "Relative Name" :this.dataSource.data[i]["RelativeName"],
    //       "Hospital Name" :this.dataSource.data[i]["HospitalName"]?this.dataSource.data[i]["HospitalName"]:"N/A"
    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "Indoor-Patient-List " + new Date() +".xlsx";
    //   if(exprtType =="Excel"){
    //     const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(excelData);
    //     var wscols = [];
    //     if(excelData.length > 0){ 
    //       var columnsIn = excelData[0]; 
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

  getAdmittedPatientList() {
    
    this.sIsLoading = 'loading-data';
    var D_data = {
     
      "F_Name": this._AdmissionService.myFilterform.get("FirstName").value +'%' || "%",
      "L_Name": this._AdmissionService.myFilterform.get("LastName").value +'%' || "%",
      "Reg_No": this._AdmissionService.myFilterform.get("RegNo").value || "0",
      "Doctor_Id": this._AdmissionService.myFilterform.get("DoctorId").value || "0",
      "From_Dt": this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900", 
      "Admtd_Dschrgd_All": "0", 
      "M_Name": this._AdmissionService.myFilterform.get("MiddleName").value +'%' || "%",
      "IPNo": this._AdmissionService.myFilterform.get("IPDNo").value +'%' || "%",
    }
    // console.log(D_data);

    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._AdmissionService.getAdmittedPatientList(D_data).subscribe(data =>  {
        this.dataSource.data = data as Admission[];

        console.log( this.dataSource.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        let x = {};
        // x['TodaysAdmCount'] = data[0].TodaysAdmCount;
        // x['TodaysDischargeCount'] = data[0].TodaysDischargeCount;
        // x['TotalAdmCount'] = data[0].TotalAdmCount;
        // x['TotalCompanyPatCount'] = data[0].TotalCompanyPatCount;
   
        this.sentCountsToParent.emit(x);
        this.sIsLoading = '';
        
      },
        error => {
          this.sIsLoading = '';
        });
    }, 200);

    // this._AdmissionService.getAdmittedPatientList(D_data).subscribe(data => {
    //   this.dataSource.data = data as Admission[];
    //   this.dataSource.sort = this.sort;
    //   this.dataSource.paginator = this.paginator;

    //   let x = {};
    //   x['TodaysAdmCount'] = data[0].TodaysAdmCount;
    //   x['TodaysDischargeCount'] = data[0].TodaysDischargeCount;
    //   x['TotalAdmCount'] = data[0].TotalAdmCount;
    //   x['TotalCompanyPatCount'] = data[0].TotalCompanyPatCount;
 
    //   this.sentCountsToParent.emit(x);
    //   this.sIsLoading = '';
    // },
    // error => {
    //   this.sIsLoading = '';
    // });
  }

  addNewAdmission() {
    const dialogRef = this._matDialog.open(NewAdmissionComponent,
      {
        maxWidth: "90vw",
        // maxHeight: "95vh", 
        height: '780px',
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed - Insert Action', result);
      this.getAdmittedPatientList();
    });
  }


  onClear() {
    this._AdmissionService.myFilterform.reset(
      {
        start: [],
        end: []
      }
    );
  }

  
  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._AdmissionService.myFilterform.controls; }

  getRecord(contact, m): void {
    console.log(contact);
    let PatInforObj = {};
    PatInforObj['PatientName'] = contact.PatientName,

    PatInforObj['AdmissionID'] = contact.AdmissionID,
    PatInforObj['AdmissionDate'] = contact.DOA,
    PatInforObj['HospitalId'] = contact.HospitalID,
    PatInforObj['TariffId'] = contact.TariffId,
    PatInforObj['CityId'] = contact.CityId,
    PatInforObj['PatientTypeID'] = contact.PatientTypeID,

    PatInforObj['Departmentid'] = contact.DepartmentId,
    PatInforObj['DoctorId'] = contact.DocNameID,
    PatInforObj['AdmittedDoctor1ID'] = contact.AdmittedDoctor1ID ,
    PatInforObj['AdmittedDoctor2ID'] = contact.AdmittedDoctor2ID,

    PatInforObj['CompanyId'] = contact.CompanyId,
    PatInforObj['SubCompanyId'] = contact.SubTpaComId,
    PatInforObj['IsMLC'] = contact.IsMLC,
    PatInforObj['RelativeName'] = contact.RelativeName,
    PatInforObj['RelativeAddress'] = contact.RelativeAddress,
    PatInforObj['RelationshipId'] = contact.RelationshipId,
    PatInforObj['RelatvieMobileNo'] = contact.MobileNo,
    PatInforObj['PatientType'] = contact.PatientType,
    PatInforObj ['TariffName'] = contact.TariffName
    

    console.log(PatInforObj);
    // this.advanceDataStored.storage = new Editdetail(PatInforObj);

    this.advanceDataStored.storage = new AdvanceDetailObj(PatInforObj);

    this._AdmissionService.populateForm2(PatInforObj);

    if (m == "Edit Admission") {
      const dialogRef = this._matDialog.open(EditAdmissionComponent,
        {
          maxWidth: '85vw',
      
          height: '580px',width: '100%', 
          data: {
            PatObj: PatInforObj 
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
    if (m == "View Admission") {
    this.getViewbAdmission(contact);
    }
    else if (m == "Update MLC Information") {
      let xx = {

        RegNo: contact.RegId,
        AdmissionID: contact.AdmissionID,
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
        IsMLC :contact.IsMLC
  
      };
      console.log(xx);

      this.advanceDataStored.storage = new AdvanceDetailObj(xx);
      this._AdmissionService.populateForm(xx);
      const dialogRef = this._matDialog.open(MLCInformationComponent,
        {
          maxWidth: '85vw',
      
          height: '400px',width: '100%', 
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
    else if (m == "Update TPA Company Information") {

       let xx = {

        RegNo: contact.RegId,
        AdmissionID: contact.AdmissionID,
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
        IsMLC :contact.IsMLC,
        SubCompanyId:contact.SubTpaComId
  
      };
      console.log(xx);

      this.advanceDataStored.storage = new AdvanceDetailObj(xx);
      this._AdmissionService.populateForm(xx);
      const dialogRef = this._matDialog.open(SubCompanyTPAInfoComponent,
        {
          maxWidth: '85vw',
      
          height: '600px',width: '100%', 
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
    // else if (m == "Prefix Demo") {

    //   const dialogRef = this._matDialog.open(PrifxComponent,
    //     {
    //       maxWidth: "120vw",
    //       maxHeight: "120vh", width: '100%', height: "100%"
    //     });

    // }
    // else if (m == "Emergency") {

    //   const dialogRef = this._matDialog.open(EmergencyComponent,
    //     {
    //       maxWidth: '95vw',
      
    //       height: '550px',width: '100%', 
    //     });

    // }
  }

  getViewbAdmission(contact) {
    console.log(contact);
    let xx = {

      RegNo: contact.RegId,
      AdmissionID: contact.AdmissionID,
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
    this.advanceDataStored.storage = new AdmissionPersonlModel(xx);
    const dialogRef = this._matDialog.open(ViewAdmissionComponent,
      {
        maxWidth: "90vw",
        maxHeight: "100vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }





  getTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=13';
    this._AdmissionService.getTemplate(query).subscribe((resData: any) => {
       this.printTemplate = resData[0].TempDesign;
       
      let keysArray = ['HospitalName','HospAddress','Phone','FirstName','MiddleName','LastName','AdmissionId','RegNo','PatientName','Age','AgeDay','AgeMonth','GenderName','MaritalStatusName','Address','MobileNo','IsMLC','PhoneNo', 'AdmissionTime' ,'IPDNo','CompanyName', 'DepartmentName' ,'AdmittedDoctorName','AdmittedDoctor1','BedName','AdmittedDoctor2',
       'RelationshipName','RefDoctorName','RelativePhoneNo','IsReimbursement','TariffName','RelativeName','Aadharcardno','RelativeAddress']; // resData[0].TempKeys;
      for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
        }
       /// this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(this.reportPrintObj.AdvanceAmount));
      //  this.printTemplate = this.printTemplate.replace('StrAdvanceAmount','₹' + (this.reportPrintObj.AdvanceAmount.toFixed(2)));
        this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.reportPrintObj.AdmissionDate));
        this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transform1(this.reportPrintObj.AdmissionDate));
       
        this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');

        setTimeout(() => {
          this.print();
        }, 1000);
    });
  }

  transform1(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd/MM/yyyy hh:mm a');
     return value;
  }
  
  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }
  
 
  getPrint(el) {
    console.log(el);
    debugger;
    var D_data = {
     // "AdmissionId": el.AdmissionID,
      "AdmissionId":el.AdmissionID
    }
    // console.log(D_data);
    let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
    this.subscriptionArr.push(
      this._AdmissionService.getAdmissionPrint(D_data).subscribe(res => {
        this.reportPrintObj = res[0] as Admission;
        this.getTemplate();
        console.log( this.reportPrintObj);
        
      })
    );
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














}



export class Admission {
  AdmissionID: Number;
  RegID: number;
  AdmissionDate: any;
  RegNo:number;
  AdmissionTime: any;
  PatientTypeID: number;
  HospitalID: number;
  Phone:number;
  DocNameID: number;
  RefDocNameID: number;
  RoomId: number;
  BedId: number;
  DischargeDate: Date;
  DischargeTime: Time;
  IsDischarged: number;
  IsBillGenerated: number;
  CompanyId: number;
  TariffId: number;
  ClassId: number;
  DepartmentId: number;
  RelativeName: string;
  RelativeAddress: string;
  RelativePhoneNo: string;
  PhoneNo: string;
  RelationshipId: number;
  AdmittedDoctor1: number;
  AdmittedDoctor2: number;
  SubTPAComp: number;
  IsReimbursement: boolean;
  MobileNo: number;
  PrefixID: number;
  PrefixName: string;
  AddedBy: number;
  PatientName: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DoctorId: number;
  DoctorName: string;
  IPDNo: number;
  DOA: Date;
  DOT: Time;
  IsMLC: boolean;
  MotherName: string;
  RefDocName: string;
  PatientType: string;
  HospitalName: string;
  RegNoWithPrefix: number;
  CompanyName:string;
  AdmittedDoctor1ID: number;
  // AdmittedDoctor1: string;
  // TariffId: number;
  TariffName: string;
  RelationshipName:string;
  RoomName: string;
  HospitalAddress:string;
  BedName: string;
  GenderId: number;
  GenderName: string;
  AdmDateTime:Date;
  ChargesAmount:number;
  AdvanceAmount:number;
  AdmittedPatientBalanceAmount:number;
  Age:number;
  AgeDay:number;
  AgeMonth:number;
  SubCompanyId:any;
  /**
* Constructor
*
* @param Admission
*/
  constructor(Admission) {
      {
          this.AdmissionID = Admission.AdmissionID || '';
          this.RegID = Admission.RegID || '';
          this.AdmissionDate = Admission.AdmissionDate || '';
          this.AdmissionTime = Admission.AdmissionTime || '';
          this.PatientTypeID = Admission.PatientTypeID || '';
          this.HospitalID = Admission.HospitalID || '';
          this.Phone=Admission.Phone||0;
          this.DocNameID = Admission.DocNameID || '';
          this.RefDocNameID = Admission.RefDocNameID || '';
          this.DischargeDate = Admission.DischargeDate || '';
          this.DischargeTime = Admission.DischargeTime || '';
          this.IsDischarged = Admission.IsDischarged || '';
          this.IsBillGenerated = Admission.IsBillGenerated || '';
          this.CompanyId = Admission.CompanyId || 0;
          this.ClassId = Admission.ClassId || 0;
          this.DepartmentId = Admission.DepartmentId || 0;
          this.RelativeName = Admission.RelativeName || '';
          this.RelativeAddress = Admission.RelativeAddress || '';
          this.RelativePhoneNo= Admission.RelativePhoneNo ||0;
          this.PhoneNo = Admission.PhoneNo || '';
          this.MobileNo = Admission.MobileNo || '';
          this.RelationshipId = Admission.RelationshipId || '';
          this.AddedBy = Admission.AddedBy || '';
          this.IsMLC = Admission.IsMLC || '';
          this.MotherName = Admission.MotherName || '';
          this.AdmittedDoctor1 = Admission.AdmittedDoctor1 || '';
          this.AdmittedDoctor2 = Admission.AdmittedDoctor2 || '';
          this.SubTPAComp = Admission.SubTPAComp || '';
          this.IsReimbursement = Admission.IsReimbursement || '';

          this.PrefixID = Admission.PrefixID || 0;
          this.PrefixName = Admission.PrefixName || '';
          this.PatientName = Admission.PatientName || '';
          this.FirstName = Admission.FirstName || '';
          this.MiddleName = Admission.MiddleName || '';
          this.LastName = Admission.LastName || '';
          this.DoctorId = Admission.DoctorId || '';
          this.DoctorName = Admission.DoctorName || '';
          this.IPDNo = Admission.IPDNo || '';

          this.GenderId = Admission.GenderId || '';
          this.GenderName = Admission.GenderName || '';
          
          this.DOA = Admission.DOA || '';
          this.DOT = Admission.DOT || '';
          // this.PatientTypeId = Admission.PatientTypeId || '';
          this.PatientType = Admission.PatientType || '';

          this.RefDocName = Admission.RefDocName || '';
          this.RegNoWithPrefix = Admission.RegNoWithPrefix || '';
          this.HospitalName = Admission.HospitalName || '';

          this.AdmittedDoctor1ID = Admission.AdmittedDoctor1ID || '';
          this.AdmittedDoctor1 = Admission.AdmittedDoctor1 || '';
          this.TariffId = Admission.TariffId || '';
          this.TariffName = Admission.TariffName || '';
          this.RoomId = Admission.WardId || '';
          this.RoomName = Admission.RoomName || '';
          this.BedId = Admission.BedId || '';
          this.BedName = Admission.BedName || '';
          this.AdmDateTime = Admission.AdmDateTime || '';
          this.CompanyName = Admission.CompanyName || '';
          this.RelationshipName = Admission.RelationshipName || '';
          this.HospitalAddress = Admission.HospitalAddress || '';
          this.ChargesAmount = Admission.ChargesAmount || '';
          this.AdvanceAmount = Admission.AdvanceAmount || '';
          this.AdmittedPatientBalanceAmount=Admission.AdmittedPatientBalanceAmount || '';
          this.RegNo = Admission.RegNo || '';
          this.Age = Admission.Age || '';
          this.AgeDay = Admission.AgeDay || '';
          this.AgeMonth = Admission.AgeMonth || '';
          this.SubCompanyId =Admission.SubCompanyId || 0;
      }
  }
}

export class RegInsert {
  RegId: Number;
  RegDate: Date;
  RegTime: Time;
  PrefixId: number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Address: string;
  City:string;
  CityName: string;
  PinNo: string;
  DateofBirth: Date;
  Age: string;
  GenderId: Number;
  PhoneNo: string;
  MobileNo: string;
  AddedBy: number;
  AgeYear: string;
  AgeMonth: string;
  AgeDay: string;
  CountryId: number;
  StateId: number;
  CityId: number;
  MaritalStatusId: number;
  IsCharity: Boolean;
  ReligionId: number;
  AreaId: number;
  VillageId: number;
  TalukaId: number;
  PatientWeight: number;
  AreaName: string;
  AadharCardNo: string;
  PanCardNo: string;
  
  /**
   * Constructor
   *
   * @param RegInsert
   */

  constructor(RegInsert) {
      {
          this.RegId = RegInsert.RegId || '';
          this.RegDate = RegInsert.RegDate || '';
          this.RegTime = RegInsert.RegTime || '';
          this.PrefixId = RegInsert.PrefixId || '';
          this.FirstName = RegInsert.FirstName || '';
          this.MiddleName = RegInsert.MiddleName || '';
          this.LastName = RegInsert.LastName || '';
          this.Address = RegInsert.Address || '';
          this.City = RegInsert.City || '';
          this.PinNo = RegInsert.PinNo || '';
          this.DateofBirth = RegInsert.DateofBirth || '';
          this.Age = RegInsert.Age || '';
          this.GenderId = RegInsert.GenderId || '';
          this.PhoneNo = RegInsert.PhoneNo || '';
          this.MobileNo = RegInsert.MobileNo || '';
          this.AddedBy = RegInsert.AddedBy || '';
          this.AgeYear = RegInsert.AgeYear || '';
          this.AgeMonth = RegInsert.AgeMonth || '';
          this.AgeDay = RegInsert.AgeDay || '';
          this.CountryId = RegInsert.CountryId || '';
          this.StateId = RegInsert.StateId || '';
          this.CityId = RegInsert.CityId || '';
          this.MaritalStatusId = RegInsert.MaritalStatusId || '';
          this.IsCharity = RegInsert.IsCharity || '';
          this.ReligionId = RegInsert.ReligionId || '';
          this.AreaId = RegInsert.AreaId || '';
          this.VillageId = RegInsert.VillageId || '';
          this.TalukaId = RegInsert.TalukaId || '';
          this.PatientWeight = RegInsert.PatientWeight || '';
          this.AreaName = RegInsert.AreaName || '';
          this.AadharCardNo = RegInsert.AadharCardNo || '';
          this.PanCardNo = RegInsert.PanCardNo || '';
      }
  }
}

export class Bed {
  BedId: Number;
  BedName: string;

  /**
   * Constructor
   *
   * @param Bed
   */
  constructor(Bed) {
      {
          this.BedId = Bed.BedId || '';
          this.BedName = Bed.BedName || '';
      }
  }
}

export class AdmissionPersonlModel {
  AadharCardNo: any;
  Address: any;
  Age: Number;
  AgeDay: any;
  AgeMonth: any;
  AgeYear: any;
  AreaId: Number;
  CityName: string;
  CityId: Number;
  CountryId: Number;
  DateofBirth: any;
  Expr1: any;
  FirstName: string;
  GenderId: Number;
  GenderName: string;
  IsCharity: any;
  LastName: String;
  MaritalStatusId: Number;
  MiddleName: string;
  MobileNo: string;
  PanCardNo: any;
  PatientName: string;
  PhoneNo: string;
  PinNo: string;
  PrefixID: number;
  PrefixName: string;
  RDate: any;
  RegDate: any;
  RegId: Number;
  RegNo: Number;
  RegNoWithPrefix: string;
  RegTime: string;
  RegTimeDate: string;
  ReligionId: Number;
  StateId: Number;
  TalukaId: Number;
  TalukaName: string;
  VillageId: Number;
  VillageName: string;
  Departmentid:any;
  currentDate = new Date();
  AdmittedDoctor1ID:any;
  AdmittedDoctor2ID:any;
  RelationshipId:any;
  AdmissionID:any;
  AdmissionDate:Date;
  AdmissionTime:Date;
  RelativeName:String;
  DoctorId:number;
  RelativePhoneNo:number;
  MaritalStatusName:string;
  IsMLC:any;
  CompanyName:any;
  RelationshipName:string;
  RefDoctorName :string;
  AdmittedDoctor2:any;
  AdmittedDoctor1:any;
  BedName:any;
  IPDNo:any;
  TariffName:any;
  DepartmentName:any;
  RefDoctorId:any;
  VisitId:any;
  CompanyId:any;
  HospitalId:any;
  PatientTypeID:any;
  PatientType:any;
  SubCompanyId:any;
  Aadharcardno:any;
  Pancardno:any;
  RefDocName:any;
  /**
* Constructor
*
* @param AdmissionPersonl
*/
  constructor(AdmissionPersonl) {
      {
          this.Departmentid=AdmissionPersonl.Departmentid ||'';
          this.AadharCardNo = AdmissionPersonl.AadharCardNo || '';
          this.Address = AdmissionPersonl.Address || '';
          this.Age = AdmissionPersonl.Age || '';
          this.AgeDay = AdmissionPersonl.AgeDay || 0;
          this.AgeMonth = AdmissionPersonl.AgeMonth || 0;
          this.AgeYear = AdmissionPersonl.AgeYear || 0;
          this.AreaId = AdmissionPersonl.AreaId || '';
          this.CityName = AdmissionPersonl.CityName || '';
          this.CityId = AdmissionPersonl.CityId || '';
          this.CountryId = AdmissionPersonl.CountryId || '';
          this.DateofBirth = AdmissionPersonl.DateOfBirth || this.currentDate;
          this.Expr1 = AdmissionPersonl.Expr1 || '';
          this.FirstName = AdmissionPersonl.FirstName || '';
          this.GenderId = AdmissionPersonl.GenderId || '';
          this.GenderName = AdmissionPersonl.GenderName || '';
          this.IsCharity = AdmissionPersonl.IsCharity || '';
          this.LastName = AdmissionPersonl.LastName || '';
          this.MaritalStatusId = AdmissionPersonl.MaritalStatusId || '';
          this.MiddleName = AdmissionPersonl.MiddleName || '';
          this.MobileNo = AdmissionPersonl.MobileNo || '';
          this.PanCardNo = AdmissionPersonl.PanCardNo || '';
          this.PatientName = AdmissionPersonl.PatientName || '';
          this.PhoneNo = AdmissionPersonl.PhoneNo || '';
          this.PinNo = AdmissionPersonl.PinNo || '';
          this.PrefixID = AdmissionPersonl.PrefixID || '';
          this.PrefixName = AdmissionPersonl.PrefixName || '';
          this.RDate = AdmissionPersonl.RDate || '';
          this.RegDate = AdmissionPersonl.RegDate || '';
          this.RegId = AdmissionPersonl.RegId || '';
          this.RegNo = AdmissionPersonl.RegNo || '';
          this.RegNoWithPrefix = AdmissionPersonl.RegNoWithPrefix || '';
          this.RegTime = AdmissionPersonl.RegTime || '';
          this.RegTimeDate = AdmissionPersonl.RegTimeDate || '';
          this.ReligionId = AdmissionPersonl.ReligionId || '';
          this.StateId = AdmissionPersonl.StateId || '';
          this.TalukaId = AdmissionPersonl.TalukaId || '';
          this.TalukaName = AdmissionPersonl.TalukaName || '';
          this.VillageId = AdmissionPersonl.VillageId || '';
          this.VillageName = AdmissionPersonl.VillageName || '';
          this.AdmittedDoctor1ID = AdmissionPersonl.AdmittedDoctor1ID || '';
          this.AdmittedDoctor2ID = AdmissionPersonl.AdmittedDoctor2ID || '';
          this.RelationshipId = AdmissionPersonl.RelationshipId || '';
          this.AdmissionID = AdmissionPersonl.AdmissionID || '';
          this.AdmissionDate=AdmissionPersonl.AdmissionDate || '';
          this.AdmissionTime = AdmissionPersonl.AdmissionTime || '';
          this.DoctorId=AdmissionPersonl.DoctorId || '';
          this.RelativePhoneNo = AdmissionPersonl.RelativePhoneNo || 0;
          this.MaritalStatusName = AdmissionPersonl.MaritalStatusName || '';
          this.IsMLC = AdmissionPersonl.IsMLC ||'';
          this.CompanyName = AdmissionPersonl.CompanyName || '';
          this.RelationshipName =AdmissionPersonl. RelationshipName || '';
          this.RefDoctorName = AdmissionPersonl.RefDoctorName || '';
          this.AdmittedDoctor2 =AdmissionPersonl.AdmittedDoctor2 ||'';
          this.AdmittedDoctor1 = AdmissionPersonl.AdmittedDoctor1 || '';
          this.BedName = AdmissionPersonl.BedName || '';
          this.IPDNo =AdmissionPersonl.IPDNo || ''; 
          this.TariffName =AdmissionPersonl.TariffName || '';
          this.DepartmentName = AdmissionPersonl.DepartmentName || '';
          this.RefDoctorId = AdmissionPersonl.RefDoctorId || 0;
          this.VisitId = AdmissionPersonl.VisitId || 0;
          this.HospitalId= AdmissionPersonl.HospitalId || 0;     
          this.CompanyId=AdmissionPersonl.CompanyId || 0;
          this.PatientTypeID = AdmissionPersonl.PatientTypeID || 0;
          this.PatientType = AdmissionPersonl.PatientType ||'';
          this.SubCompanyId =  AdmissionPersonl.SubCompanyId || 0;
          this.Aadharcardno=AdmissionPersonl.Aadharcardno || ''
          this.Pancardno=AdmissionPersonl.Pancardno || '';
          this.RefDocName=AdmissionPersonl.RefDocName || '';
         }
  }
}




export class Editdetail {
  Departmentid: Number;
  CityId: Number;
  PatientName: string;
  RegNo: any;
  AdmDateTime: string;
  AgeYear: number;
  ClassId: number;
  ClassName: String;
  TariffName: String;
  TariffId: number;
  IsDischarged: boolean;
  opD_IPD_Type: number;
  AdmissionDate:Date;
  OPD_IPD_ID:any;
  /**
  * Constructor
  *
  * @param Editdetail
  */
  constructor(Editdetail) {
    {
      this.Departmentid = Editdetail.Departmentid || '';
      this.CityId = Editdetail.CityId || '';
      this.TariffId = Editdetail.TariffId || '';
      this.AdmissionDate = Editdetail.AdmissionDate || '';
       this.RegNo = Editdetail.RegNo || '';
       this.OPD_IPD_ID = Editdetail.OPD_IPD_ID || '';
      //  this.AgeYear = AdvanceDetailObj.AgeYear || '';
      //  this.ClassId = AdvanceDetailObj.ClassId || '';
      //  this.ClassName = AdvanceDetailObj.ClassName || '';
      //  this.TariffName = AdvanceDetailObj.TariffName || '';
      //  this.TariffId = AdvanceDetailObj.TariffId || '';
      //  this.IsDischarged =AdvanceDetailObj.IsDischarged || 0 ;
      //  this.opD_IPD_Type = AdvanceDetailObj.opD_IPD_Type | 0;
    }
  }
}