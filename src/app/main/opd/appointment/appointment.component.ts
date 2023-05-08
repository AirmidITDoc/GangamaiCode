import { Component, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject } from 'rxjs';
import { RegistrationService } from '../registration/registration.service';
import { DatePipe, Time } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AppointmentSreviceService } from './appointment-srevice.service';

// import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { fuseAnimations } from '@fuse/animations';
import { NewRegistrationComponent } from '../registration/new-registration/new-registration.component';
import { EditConsultantDoctorComponent } from './edit-consultant-doctor/edit-consultant-doctor.component';
import { EditRefraneDoctorComponent } from './edit-refrane-doctor/edit-refrane-doctor.component';
import { EditRegistrationComponent } from '../registration/edit-registration/edit-registration.component';
// const jsPDF = require('jspdf');



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


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  displayedColumns = [

    // "PatientOldNew",
    // "MPbillNo",
    'RegNoWithPrefix',
    'PatientName',
    'DVisitDate',
    'VisitTime',
    'OPDNo',
    'Doctorname',
    'RefDocName',
    'PatientType',
    // 'HospitalName',
    'buttons',

  ];
  dataSource = new MatTableDataSource<VisitMaster>();
  menuActions: Array<string> = [];
  //datePipe: any;

  constructor( public _AppointmentSreviceService: AppointmentSreviceService,
        private _ActRoute: Router,
        private _fuseSidebarService: FuseSidebarService,
        public _registrationService: RegistrationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    // private advanceDataStored: AdvanceDataStored
  ) {
    this.getVisitList();
  }

  ngOnInit(): void {
    
    if (this._ActRoute.url == '/opd/appointment') {
      // this.menuActions.push('One');
      this.menuActions.push('Update Registration');
      this.menuActions.push('Update Consultant Doctor');
      this.menuActions.push('Update Referred Doctor');
      this.menuActions.push('Upload Documents');
      this.menuActions.push('Capture Photo');
      this.menuActions.push('Generate Patient Barcode');

    }
   

    this.getVisitList();
    // this.dataSource.data.refresh();

  }

  // VisitList 

  getVisitList() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._AppointmentSreviceService.myFilterform.get("FirstName").value.trim() + '%' || '%',
      "L_Name": this._AppointmentSreviceService.myFilterform.get("LastName").value.trim() + '%' || '%',
      "Reg_No": this._AppointmentSreviceService.myFilterform.get("RegNo").value || 0,
      "Doctor_Id": this._AppointmentSreviceService.myFilterform.get("DoctorId").value || 0,
      "From_Dt": this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "IsMark": this._AppointmentSreviceService.myFilterform.get("IsMark").value || 0,
    }
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      console.log(D_data);
      this._AppointmentSreviceService.getAppointmentList(D_data).subscribe(Visit => {
        this.dataSource.data = Visit as VisitMaster[];
        console.log(this.dataSource.data);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.sIsLoading = '';
        console.log(this.dataSource.data)
      },
        error => {
          this.sIsLoading = '';
        });
    }, 1000);

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
    this.dataSource.data = changes.dataArray.currentValue as VisitMaster[];
    this.isLoading = false;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    // this.isLoading = false;
  }

  getRecord(contact, m): void {
    debugger;
  //   if (m == "Upload Documents") {
  //     var m_data1 = {
  //       "RegId": contact.RegId,
  //       "PatientName": contact.PatientName,
  //       "VisitId": contact.VisitId,
  //       "OPD_IPD_Id": contact.OPD_IPD_Id,
  //       "DoctorId": contact.DoctorId
  //     }
  //     const dialogRef = this._matDialog.open(UploadFilesComponent,
  //       {
  //         maxWidth: "85vw",
  //         height: '70%',
  //         width: '100%',
  //         data: m_data1
  //       });
  //     dialogRef.afterClosed().subscribe(result => {
  //       console.log('The dialog was closed - Insert Action', result);
  //       //  this.getRadiologytemplateMasterList();
  //     });
  //   }
    if (m == "Update Registration") {
      console.log(contact);
debugger;
      var D_data= {
     
        "RegId": contact.RegId,
      } 
       console.log(D_data);
       
      this._AppointmentSreviceService.getregisterListByRegId(D_data).subscribe(reg=> {
          this.dataArray = reg;
          console.log( this.dataArray);
          
       


      var m_data = {
        "RegNo":this.dataArray[0].RegNo,
        "RegId":this.dataArray[0].RegId,
        "PrefixID":this.dataArray[0].PrefixId,
        "PrefixName":this.dataArray[0].PrefixName,
        "FirstName":this.dataArray[0].FirstName,
        "MiddleName":this.dataArray[0].MiddleName,
        "LastName":this.dataArray[0].LastName,
        "PatientName":this.dataArray[0].PatientName,
        "DateofBirth":this.dataArray[0].DateofBirth,
        "MaritalStatusId":this.dataArray[0].MaritalStatusId,
        "AadharCardNo":this.dataArray[0].AadharCardNo || 0,
        "Age":this.dataArray[0].Age.trim(),
        "AgeDay":this.dataArray[0].AgeDay,
        "AgeMonth":this.dataArray[0].AgeMonth,
        "AgeYear":this.dataArray[0].AgeYear,
        "Address":this.dataArray[0].Address,
        "AreaId":this.dataArray[0].AreaId,
        "City":this.dataArray[0].City,
        "CityId":this.dataArray[0].CityId,
        "StateId":this.dataArray[0].StateId,
        "CountryId":this.dataArray[0].CountryId,
        "PhoneNo":this.dataArray[0].PhoneNo,
        "MobileNo":this.dataArray[0].MobileNo,
        "GenderId":this.dataArray[0].GenderId,
        "GenderName":this.dataArray[0].GenderName,
        "ReligionId":this.dataArray[0].ReligionId,
        "IsCharity":0,
        "PinNo":this.dataArray[0].PinNo,
        "RegDate":this.dataArray[0].RegDate,
        "RegNoWithPrefix":this.dataArray[0].RegNoWithPrefix,
        "RegTime":this.dataArray[0].RegTime
      }


      console.log(m_data);
      this._registrationService.populateFormpersonal(m_data);

      const dialogRef = this._matDialog.open(EditRegistrationComponent,
        {
          maxWidth: "85vw",
          height: '550px',
          width: '100%',
          data: {
            registerObj: m_data,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this. getVisitList();
      });


    },
    error => {
      this.sIsLoading = '';
    });
    }
    else if (m == "Update Consultant Doctor") {
      // console.log(contact);
      var m_data2 = {

        "RegId": contact.RegId,
        "PatientName": contact.PatientName,
        "VisitId": contact.VisitId,
        "OPD_IPD_Id": contact.OPD_IPD_Id,
        "DoctorId": contact.DoctorId,
        "DoctorName": contact.Doctorname
      }
      this._registrationService.populateFormpersonal(m_data2);
      const dialogRef = this._matDialog.open(EditConsultantDoctorComponent,
        {
          maxWidth: "70vw",
          height: '410px',
          width: '70%',
          data: {
            registerObj: m_data2,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);

      });
    }
    else if (m == "Update Referred Doctor") {
      console.log(contact);
      var m_data3 = {

        "RegId": contact.RegId,
        "PatientName": contact.PatientName,
        "VisitId": contact.VisitId,
        "OPD_IPD_Id": contact.OPD_IPD_Id,
        "RefDoctorId": contact.RefDocId,
        "RefDocName": contact.RefDocName
      }
      console.log(m_data3);
      this._registrationService.populateFormpersonal(m_data3);
      const dialogRef = this._matDialog.open(EditRefraneDoctorComponent,
        {
          maxWidth: "70vw",
          height: '410px',
          width: '70%',
          data: {
            registerObj: m_data3,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);

      });
    }
  //   else if (m == "Refund of Bill") {
  //     console.log(" This is for refund of Bill pop : " + m);
  //   }
  //   else if (m == "Case Paper") {
  //     console.log("Case Paper : " + m);
  //   }
  //   //   const act?ionType: string = response[0];
  //   //   this.selectedID =  contact.VisitId
  //   //   this._ActRoute.navigate(['opd/appointment/op_bill'])
  //   //   this._ActRoute.navigate(['opd/appointment/op_bill'], {queryParams:{id:this.selectedID}})

  }

  newappointment() {
    const dialogRef = this._matDialog.open(NewAppointmentComponent,
      {
        maxWidth: "85vw",
        height: '660px',
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed - Insert Action', result);
      this.getVisitList();
    });
  }

  // newappointmentwithBill() {
  //   const dialogRef = this._matDialog.open(AppointmentWithBillComponent,
  //     {
  //       maxWidth: "95vw",
  //       maxHeight: "95vh", width: '100%', height: "100%"
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed - Insert Action', result);
  //     //  this.getRadiologytemplateMasterList();
  //   });
  // }


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




}


export class VisitMaster {
  VisitId: Number;
  PrefixId:number;
  RegNoWithPrefix: number;
  PatientName: string;
  VisitDate: Date;
  VisitTime: Time;
  HospitalID:number;
  HospitalName: string;
  PatientTypeID:number;
  PatientTypeId:number;
  PatientType: string;
  CompanyId:number;
  OPDNo: string;
  TariffId:number;
  TariffName: string;
  ConsultantDocId:number;
  RefDocId:number;
  Doctorname: string; 
  RefDocName: string;
  DepartmentId:number;
  appPurposeId:number;
  patientOldNew:Boolean;
  isMark: boolean;
  isXray: boolean;
  AddedBy:number;
  MPbillNo:number;
  RegNo:any;
  /**
   * Constructor
   *
   * @param VisitMaster
   */
  constructor(VisitMaster) {
      {
          this.VisitId = VisitMaster.VisitId || '';
          this.PrefixId =VisitMaster.PrefixId || '',
          this.RegNoWithPrefix = VisitMaster.RegNoWithPrefix || '';
          this.PatientName = VisitMaster.PatientName || '';
          this.VisitDate = VisitMaster.VisitDate || '';
          this.VisitTime = VisitMaster.VisitTime || '';
          this.HospitalID= VisitMaster.HospitalID || '';
          this.HospitalName = VisitMaster.HospitalName || '';
          this.PatientTypeID=VisitMaster.PatientTypeID || '';
          this.PatientTypeId=VisitMaster.PatientTypeId || '';
          this.PatientType = VisitMaster.PatientType || '';
          this.CompanyId=VisitMaster.CompanyId || '';
          this.TariffId= VisitMaster.TariffId || '';
          this.OPDNo = VisitMaster.OPDNo || '';
          this.ConsultantDocId= VisitMaster.ConsultantDocId || '';
          this.Doctorname = VisitMaster.Doctorname || '';
          this.RefDocId = VisitMaster.VisitTime || '';
          this.RefDocName = VisitMaster.RefDocName || '';
          this.DepartmentId=VisitMaster.DepartmentId || '';
          this.patientOldNew=VisitMaster.patientOldNew || '';
          this.isXray=VisitMaster.isXray || '';
          this.AddedBy=VisitMaster.AddedBy || '';
          this.MPbillNo=VisitMaster.MPbillNo || '';
          this.RegNo=VisitMaster.RegNo || '';
      }
  }
}

export class RegInsert
{
  RegId : Number;
  RegDate : Date;
  RegTime : Time; 
  PrefixId : number;
  PrefixID : number;
  FirstName : string;
  MiddleName : string;
  LastName : string;
  Address : string;
  City :string;
  PinNo : string;
  RegNo:string;
  DateofBirth : Date;
  Age: any;
  GenderId : Number;
  PhoneNo: string; 
  MobileNo: string; 
  AddedBy: number;
  AgeYear: any;
  AgeMonth : any;
  AgeDay : any;
  CountryId : number;
  StateId: number;
  CityId: number;
  MaritalStatusId : number;
  IsCharity : Boolean;
  ReligionId : number;
  AreaId : number;
  VillageId : number;
  TalukaId : number;
  PatientWeight: number;
  AreaName : string;
  AadharCardNo: string;
  PanCardNo : string;
  currentDate = new Date();
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
          this.PhoneNo= RegInsert.PhoneNo || '';
          this.MobileNo= RegInsert.MobileNo || '';
          this.AddedBy= RegInsert.AddedBy || '';
          this.AgeYear= RegInsert.AgeYear || '';
          this.AgeMonth = RegInsert.AgeMonth || '';
          this.AgeDay = RegInsert.AgeDay || '';
          this.CountryId = RegInsert.CountryId || '';
          this.StateId= RegInsert.StateId || '';
          this.CityId= RegInsert.CityId || '';
          this.MaritalStatusId = RegInsert.MaritalStatusId || '';
          this.IsCharity = RegInsert.IsCharity || '';
          this.ReligionId = RegInsert.ReligionId || '';
          this.AreaId = RegInsert.AreaId || '';
          this.VillageId = RegInsert.VillageId || '';
          this.TalukaId = RegInsert.TalukaId || '';
          this.PatientWeight= RegInsert.PatientWeight || '';
          this.AreaName = RegInsert.AreaName || '';
          this.AadharCardNo= RegInsert.AadharCardNo || '';
          this.PanCardNo = RegInsert.PanCardNo || '';
      }
  }
}




export class AdvanceDetailObj {
  RegNo: Number;
  RegId:number;
  AdmissionID: Number;
  PatientName: string;
  Doctorname: string;
  DoctorName:string;
  AdmDateTime: string;
  AgeYear: number;
  ClassId: number;
  TariffName: String;
  TariffId: number;
  opD_IPD_Type:number;
  VisitId:number;
  storage: any;
  IPDNo:any;
  RefDoctorId:any;
  DoctorId:any;
  OPD_IPD_ID:any;
  RefDocName:any;
  WardName:any;
  BedName:any;
  /**
  * Constructor
  *
  * @param AdvanceDetailObj
  */
  constructor(AdvanceDetailObj) {
      {
          this.RegNo = AdvanceDetailObj.RegNo || '';
          this.RegId = AdvanceDetailObj.RegId || '';
          this.VisitId = AdvanceDetailObj.VisitId || '';
          this.AdmissionID = AdvanceDetailObj.AdmissionID || '';
          this.PatientName = AdvanceDetailObj.PatientName || '';
          this.Doctorname = AdvanceDetailObj.Doctorname || '';
          this.DoctorName=AdvanceDetailObj.DoctorName ||''
          this.AdmDateTime = AdvanceDetailObj.AdmDateTime || '';
          this.AgeYear = AdvanceDetailObj.AgeYear || '';
          this.ClassId = AdvanceDetailObj.ClassId || '';
          this.TariffName = AdvanceDetailObj.TariffName || '';
          this.TariffId = AdvanceDetailObj.TariffId || '';
          this.opD_IPD_Type  = AdvanceDetailObj.opD_IPD_Type || 0;
          this.IPDNo = AdvanceDetailObj.IPDNo || '';
          this.RefDoctorId =AdvanceDetailObj.RefDoctorId || 0;
          this.DoctorId = AdvanceDetailObj.DoctorId || 0;
          this.OPD_IPD_ID=AdvanceDetailObj.OPD_IPD_ID || 0;
          this.RefDocName =AdvanceDetailObj.RefDocName || '';
          this.WardName =AdvanceDetailObj.WardName || '';
          this.BedName =AdvanceDetailObj.BedName || '';

      }
  }
}