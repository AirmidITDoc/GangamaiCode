import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AppointmentService } from './appointment.service';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe, Time } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { AdvanceDetailObj } from '../op-search-list/opd-search-list/opd-search-list.component';
import { AdvanceDataStored } from './advance';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AppointmentComponent implements OnInit {

  msg: any;
  sIsLoading: string = '';
  isLoading = true;
  isRateLimitReached = false;
  hasSelectedContacts: boolean;
  currentDate = new Date();
  subscriptions: Subscription[] = [];
  // reportPrintObj: CasepaperVisitDetails;
  printTemplate: any;
  // reportPrintObjList: CasepaperVisitDetails[] = [];
  subscriptionArr: Subscription[] = [];

  VisitID: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [
    'RegDate',
    'RegNo',
    'PatientName',
    'AgeYear',
    'GenderName',
    'PhoneNo',
    'MobileNo',
    'Address',
    'buttons',
    //  'buttons'
  ];
  dataSource = new MatTableDataSource<RegInsert>();
  menuActions: Array<string> = [];
  //datePipe: any;

  constructor(
    public _AppointmentSreviceService: AppointmentService,
    private _ActRoute: Router,
    private _fuseSidebarService: FuseSidebarService,
    private advanceDataStored: AdvanceDataStored,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    // private advanceDataStored: AdvanceDataStored
  ) {
    this.getregistrationList();
  }

  ngOnInit(): void {

    if (this._ActRoute.url == '/opd/appointment') {
      // this.menuActions.push('One');
      this.menuActions.push('Registration Print');
      this.menuActions.push('Update Registration');
      this.menuActions.push('New Schdule');
    }


    this.getregistrationList();
    // this.dataSource.data.refresh();

  }

  // get Registration list on Button click
  getregistrationList() {
    debugger;
    this.sIsLoading = 'loading';
    var D_data = {
      "F_Name": (this._AppointmentSreviceService.myFilterform.get("FirstName").value).trim() + '%' || '%',
      "L_Name": (this._AppointmentSreviceService.myFilterform.get("LastName").value).trim() + '%' || '%',
      "Reg_No": this._AppointmentSreviceService.myFilterform.get("RegNo").value || "0",
      "From_Dt": this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "MobileNo": this._AppointmentSreviceService.myFilterform.get("MobileNo").value || '%',
    }
    // console.log(D_data);
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._AppointmentSreviceService.getRegistrationList(D_data).subscribe(data => {
        this.dataSource.data = data as RegInsert[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.sIsLoading = '';
      },
        error => {
          this.sIsLoading = '';
        });
    }, 500);
  }
  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  onClear() {
    this._AppointmentSreviceService.myFilterform.reset(
      {
        start: [],
        end: []
      }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    // console.log(changes.dataArray.currentValue, 'new arrrrrrr');
    // this.isLoading = true;
    this.dataSource.data = changes.dataArray.currentValue as RegInsert[];
    this.isLoading = false;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // this.isLoading = false;
  }



  getRecord(contact, m): void {
    ;
console.log(contact);

    if (m == "Registration Print") {
      // this.getPrint();
    }
  
    else if(m == "Update Registration") {
        console.log(" This is for Registration pop : " + m);
        let xx = {
          "RegNo": contact.RegNo,
          "RegId": contact.RegId,
          "PrefixID": contact.PrefixID,
          "PrefixName": contact.PrefixName,
          "FirstName": contact.FirstName,
          "MiddleName": contact.MiddleName,
          "LastName": contact.LastName,
          "PatientName": contact.PatientName,
          "DateofBirth": contact.DateofBirth,
          "MaritalStatusId": contact.MaritalStatusId,
          "AadharCardNo": contact.AadharCardNo || 0,
          "Age": contact.Age.trim(),
          "AgeDay": contact.AgeDay,
          "AgeMonth": contact.AgeMonth,
          "AgeYear": contact.AgeYear,
          "Address": contact.Address,
          "AreaId": contact.AreaId,
          "City": contact.City,
          "CityId": contact.CityId,
          "StateId": contact.StateId,
          "CountryId": contact.CountryId,
          "PhoneNo": contact.PhoneNo,
          "MobileNo": contact.MobileNo,
          "GenderId": contact.GenderId,
          "GenderName": contact.GenderName,
          "ReligionId": contact.ReligionId,
          "IsCharity": 0,
          "PinNo": contact.PinNo,
          "RegDate": contact.RegDate,
          "RegNoWithPrefix": contact.RegNoWithPrefix,
          "RegTime": contact.RegTime
        };
        this.advanceDataStored.storage = new AdvanceDetailObj(xx);
        // console.log( this.advanceDataStored.storage);
         console.log(xx);
        debugger;
        // const dialogRef = this._matDialog.open(EditAppointmentComponent,
        //   {
        //     maxWidth: "95%",
        //     height: '70%',
        //     width: '100%',
        //     data: {
        //       registerObj: xx,
        //     }
        //   });
        // dialogRef.afterClosed().subscribe(result => {
        //   console.log('The dialog was closed - Insert Action', result);
        //   //  this.getRadiologytemplateMasterList();
        // });
      }
    
    if (m == "New Schdule") {

      console.log(" This is for New Schdule pop : " + m);
      let xx = {
        RegNo: contact.RegNo,
        RegId: contact.RegId,
        AdmissionID: contact.VisitId,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId,
        DoctorId: contact.DoctorId,

      };
      this.advanceDataStored.storage = new AdvanceDetailObj(xx);

      // this._ActRoute.navigate(['opd/new-OpdBilling']);
      // const dialogRef = this._matDialog.open(NewScheduledApppointmentComponent,
      //   {
      //     maxWidth: "85%",
      //     height: '760px',
      //     width: '100%',
      //   });
      // dialogRef.afterClosed().subscribe(result => {
      //   console.log('The dialog was closed - Insert Action', result);
      //   //  this.getRadiologytemplateMasterList();
      // });
    }

   
  }

  newappointment() {
    // const dialogRef = this._matDialog.open(NewAppointmentComponent,
    //   {
    //     maxWidth: "95vw",
    //     height: '800px',
    //     width: '100%',

    //     // height: "100%"
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log('The dialog was closed - Insert Action', result);
    //   this.getregistrationList();
    // });
  }




  onExport(exprtType) {
    // debugger;
    // let columnList = [];
    // if (this.dataSource.data.length == 0) {
    //   // this.toastr.error("No Data Found");
    //   Swal.fire('Error !', 'No Data Found', 'error');
    // }
    // else {
    //   var excelData = [];
    //   var a = 1;
    //   for (var i = 0; i < this.dataSource.data.length; i++) {
    //     let singleEntry = {
    //       // "Sr No":a+i,
    //       "Reg No": this.dataSource.data[i]["RegNoWithPrefix"],
    //       "PatientOldNew": this.dataSource.data[i]["PatientOldNew"] ? this.dataSource.data[i]["PatientOldNew"] : "N/A",
    //       "Patient Name": this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"] : "N/A",
    //       "VisitDate": this.dataSource.data[i]["DVisitDate"] ? this.dataSource.data[i]["DVisitDate"] : "N/A",
    //       "Visit Time": this.dataSource.data[i]["VisitTime"] ? this.dataSource.data[i]["VisitTime"] : "N/A",
    //       "OPDNo": this.dataSource.data[i]["OPDNo"] ? this.dataSource.data[i]["OPDNo"] : "N/A",
    //       "Doctorname": this.dataSource.data[i]["Doctorname"] ? this.dataSource.data[i]["Doctorname"] : "N/A",
    //       "RefDocName": this.dataSource.data[i]["RefDocName"] ? this.dataSource.data[i]["RefDocName"] : "N/A",
    //       "PatientType": this.dataSource.data[i]["PatientType"] ? this.dataSource.data[i]["PatientType"] : "N/A",


    //     };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "OutDoor-Appointment-Patient-List " + new Date() + ".xlsx";
    //   if (exprtType == "Excel") {
    //     const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    //     var wscols = [];
    //     if (excelData.length > 0) {
    //       var columnsIn = excelData[0];
    //       for (var key in columnsIn) {
    //         let headerLength = { wch: (key.length + 1) };
    //         let columnLength = headerLength;
    //         try {
    //           columnLength = { wch: Math.max(...excelData.map(o => o[key].length), 0) + 1 };
    //         }
    //         catch {
    //           columnLength = headerLength;
    //         }
    //         if (headerLength["wch"] <= columnLength["wch"]) {
    //           wscols.push(columnLength)
    //         }
    //         else {
    //           wscols.push(headerLength)
    //         }
    //       }
    //     }
    //     ws['!cols'] = wscols;
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //     XLSX.writeFile(wb, fileName);
    //   } else {
    //     let doc = new jsPDF('p', 'pt', 'a4');
    //     doc.page = 0;
    //     var col = [];
    //     for (var k in excelData[0]) col.push(k);
    //     console.log(col.length)
    //     var rows = [];
    //     excelData.forEach(obj => {
    //       console.log(obj)
    //       let arr = [];
    //       col.forEach(col => {
    //         arr.push(obj[col]);
    //       });
    //       rows.push(arr);
    //     });

    //     doc.autoTable(col, rows, {
    //       margin: { left: 5, right: 5, top: 5 },
    //       theme: "grid",
    //       styles: {
    //         fontSize: 3
    //       }
    //     });
    //     doc.setFontSize(3);
    //     // doc.save("Indoor-Patient-List.pdf");
    //     window.open(URL.createObjectURL(doc.output("blob")))
    //   }
    // }
  }

  // field validation 
  get f() { return this._AppointmentSreviceService.myFilterform.controls; }
  selectRow(row) {
    this.selectRow = row;
  }



  getTemplate() {
    debugger;



    let query = 'select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=12';
    console.log(query);
    this._AppointmentSreviceService.getTemplate(query).subscribe((resData: any) => {
      console.log(resData);
      this.printTemplate = resData[0].TempDesign;
      console.log(this.printTemplate);
      let keysArray = ['RegNo', 'PrecriptionId', 'PatientName', 'OPDNo', 'Diagnosis', 'PatientName', 'Weight', 'Pluse', 'BP', 'BSL', 'DoseName', 'Days', 'GenderName', 'AgeYear', 'DrugName', 'ConsultantDocName', 'SecondRefDoctorName', 'MobileNo', 'Address', 'VisitDate']; // resData[0].TempKeys;

      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        // this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }


      // this.printTemplate = this.printTemplate.replace('StrVisitDate', this.transform2(this.reportPrintObj.VisitDate));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.currentDate.toString()));
      // this.printTemplate = this.printTemplate.replace('StrConsultantDr', (this.reportPrintObj.ConsultantDocName));
      // this.printTemplate = this.printTemplate.replace('StrOPDDate', this.transform1(this.reportPrintObj.VisitDate));

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


  getPrint() {
    debugger;
    var D_data = {
      "VisitId": 82973,//this.selectedAdvanceObj.AdmissionID || 0,
      "PatientType": 0,//this.selectedAdvanceObj.PatientType || 0

    }
    // el.bgColor = 'red';
    console.log(D_data);
    let printContents;
    this.subscriptionArr.push(
      // this._AppointmentSreviceService.getOPDPrecriptionPrint(D_data).subscribe(res => {
      //   console.log(res);
      //   this.reportPrintObjList = res as CasepaperVisitDetails[];
      //   console.log(this.reportPrintObjList);
      //   this.reportPrintObj = res[0] as CasepaperVisitDetails;

      //   this.getTemplate();

      //   console.log(D_data);
      // })
    );
  }

  // PRINT 
  print() {

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
    popupWin.document.close();
  }



  newappointmentSchdule() {

    let xx = {
      // RegNo: contact.RegId,
      // AdmissionID: contact.VisitId,
      // PatientName: contact.PatientName,
      // Doctorname: contact.Doctorname,
      // AdmDateTime: contact.AdmDateTime,
      // AgeYear: contact.AgeYear,
      // ClassName: contact.ClassName,
      // WardName:contact.RoomName,
      // BedName:contact.BedName,
      // IPDNo:contact.IPDNo,
      // TariffName: contact.TariffName,
      // TariffId: contact.TariffId,
      // PatientType:contact.PatientType,
      // VisitId:contact.VisitId,
      // opD_IPD_Type :contact.opD_IPD_Type,
    };
    // this.advanceDataStored.storage = new RegInsert(xx);

    // const dialogRef = this._matDialog.open(NewScheduledApppointmentComponent,
    //   {
    //     maxWidth: "95vw",
    //     height: '700px',
    //     width: '100%',
    //     // height: "100%"
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   // console.log('The dialog was closed - Insert Action', result);
    //   this.getregistrationList();
    // });
  }
}

export class VisitMaster {
  VisitId: Number;
  PrefixId: number;
  RegNoWithPrefix: number;
  PatientName: string;
  VisitDate: Date;
  VisitTime: Time;
  HospitalID: number;
  HospitalName: string;
  PatientTypeID: number;
  PatientTypeId: number;
  PatientType: string;
  CompanyId: number;
  OPDNo: string;
  TariffId: number;
  TariffName: string;
  ConsultantDocId: number;
  RefDocId: number;
  Doctorname: string;
  RefDocName: string;
  DepartmentId: number;
  appPurposeId: number;
  patientOldNew: Boolean;
  isMark: boolean;
  isXray: boolean;
  AddedBy: number;
  MPbillNo: number;
  RegNo: any;

  IsMark: any;
  IsXray: any;
  Comments: any;
  Intime: any;
  OutTime: any;


  /**
   * Constructor
   *
   * @param VisitMaster
   */
  constructor(VisitMaster) {
    {
      this.VisitId = VisitMaster.VisitId || '';
      this.PrefixId = VisitMaster.PrefixId || '',
        this.RegNoWithPrefix = VisitMaster.RegNoWithPrefix || '';
      this.PatientName = VisitMaster.PatientName || '';
      this.VisitDate = VisitMaster.VisitDate || '';
      this.VisitTime = VisitMaster.VisitTime || '';
      this.HospitalID = VisitMaster.HospitalID || '';
      this.HospitalName = VisitMaster.HospitalName || '';
      this.PatientTypeID = VisitMaster.PatientTypeID || '';
      this.PatientTypeId = VisitMaster.PatientTypeId || '';
      this.PatientType = VisitMaster.PatientType || '';
      this.CompanyId = VisitMaster.CompanyId || '';
      this.TariffId = VisitMaster.TariffId || '';
      this.OPDNo = VisitMaster.OPDNo || '';
      this.ConsultantDocId = VisitMaster.ConsultantDocId || '';
      this.Doctorname = VisitMaster.Doctorname || '';
      this.RefDocId = VisitMaster.VisitTime || '';
      this.RefDocName = VisitMaster.RefDocName || '';
      this.DepartmentId = VisitMaster.DepartmentId || '';
      this.patientOldNew = VisitMaster.patientOldNew || '';
      this.isXray = VisitMaster.isXray || '';
      this.AddedBy = VisitMaster.AddedBy || '';
      this.MPbillNo = VisitMaster.MPbillNo || '';
      this.RegNo = VisitMaster.RegNo || '';
    }
  }
}

export class RegInsert {
  RegId: Number;
  RegDate: Date;
  RegTime: Time;
  PrefixId: number;
  PrefixID: number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Address: string;
  City: string;
  PinNo: string;
  RegNo: string;
  DateofBirth: Date;
  Age: any;
  GenderId: Number;
  PhoneNo: string;
  MobileNo: string;
  AddedBy: number;
  AgeYear: any;
  AgeMonth: any;
  AgeDay: any;
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
  currentDate = new Date();
  RationCardNo: any;
  IsMember: any;
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
      this.PrefixID = RegInsert.PrefixID || '';
      this.FirstName = RegInsert.FirstName || '';
      this.MiddleName = RegInsert.MiddleName || '';
      this.LastName = RegInsert.LastName || '';
      this.Address = RegInsert.Address || '';
      this.City = RegInsert.City || '';
      this.PinNo = RegInsert.PinNo || '';
      this.DateofBirth = RegInsert.DateofBirth || this.currentDate;
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
      this.RationCardNo = RegInsert.RationCardNo || '';
      this.IsMember = RegInsert.IsMember || 0;
    }
  }
}

