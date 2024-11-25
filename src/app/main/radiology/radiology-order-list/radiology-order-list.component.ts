import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Subscription } from 'rxjs';
import { RadioloyOrderlistService } from './radioloy-orderlist.service';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import { RadiologyTemplateReportComponent } from './radiology-template-report/radiology-template-report.component';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { ToastrService } from 'ngx-toastr';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import {  MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
  selector: 'app-radiology-order-list',
  templateUrl: './radiology-order-list.component.html',
  styleUrls: ['./radiology-order-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RadiologyOrderListComponent implements OnInit {


  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  

  gridConfig: gridModel = {
      apiUrl: "PhoneAppointment2/PhoneAppList",
      columnsList: [
          { heading: "Code", key: "RadReportId", sort: true, align: 'left', emptySign: 'NA',width:50 },
          { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA',width:250 },
          { heading: "RadTime", key: "radTime", sort: true, align: 'left', emptySign: 'NA',width:150 },
          { heading: "Visit_Adm_ID", key: "visit_Adm_ID", type: gridColumnTypes.status, align: "center",width:50 },
         
          { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA',width:50 },
          { heading: "GenderName", key: "genderName", sort: true, align: 'left', emptySign: 'NA',width:50 },
          { heading: "PatientType", key: "patientType", type: gridColumnTypes.status, align: "center" ,width:50},
          { heading: "AgeYear", key: "ageYear", type: gridColumnTypes.status, align: "center",width:50 },
          { heading: "ConsultantDoctor", key: "consultantDoctor", type: gridColumnTypes.status, align: "center",width:150 },
          { heading: "VisitTime", key: "visitTime", sort: true, align: 'left', emptySign: 'NA',width:150 },
          { heading: "RadTestID", key: "radTestID", sort: true, align: 'left', emptySign: 'NA',width:50 },
          { heading: "TestName", key: "testName", type: gridColumnTypes.status, align: "center",width:250 },
          { heading: "OPD_IPD_Type", key: "oPD_IPD_Type", sort: true, align: 'left', emptySign: 'NA',width:50 },
          { heading: "PBillNo", key: "pBillNo", type: gridColumnTypes.status, align: "center",width:50 },
          { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA',width:150 },
          { heading: "OP_IP_Number", key: "oP_IP_Number", type: gridColumnTypes.status, align: "center",width:50 },
          { heading: "TestId", key: "testId", sort: true, align: 'left', emptySign: 'NA',width:50 },
          { heading: "ChargeId", key: "chargeId", type: gridColumnTypes.status, align: "center",width:50 },
          { heading: "CategoryName", key: "categoryName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
          { heading: "OPD_IPD_ID", key: "oPD_IPD_ID", type: gridColumnTypes.status, align: "center",width:50 },
         
          { heading: "IsCompleted", key: "isCompleted", type: gridColumnTypes.status, align: "center" ,width:50},
        
          {
              heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                  {
                      action: gridActions.edit, callback: (data: any) => {
                          this.onSave(data);
                      }
                  }, {
                      action: gridActions.delete, callback: (data: any) => {
                          this.confirmDialogRef = this._matDialog.open(
                              FuseConfirmDialogComponent,
                              {
                                  disableClose: false,
                              }
                          );
                          this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                          this.confirmDialogRef.afterClosed().subscribe((result) => {
                              if (result) {
                                  let that = this;
                                  this._RadioloyOrderlistService.deactivateTheStatus(data.radReportId).subscribe((response: any) => {
                                      this.toastr.success(response.message);
                                      that.grid.bindGridData();
                                  });
                              }
                              this.confirmDialogRef = null;
                          });
                      }
                  }]
          } //Action 1-view, 2-Edit,3-delete
      ],
      sortField: "RadReportId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Equals },
         { fieldName: "Reg_No", fieldValue: "30", opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
        { fieldName: "IsCompleted", fieldValue: "1", opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: "1", opType: OperatorComparer.Equals },
        { fieldName: "CategoryId", fieldValue: "1", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
      ],
      row: 25
  }
  constructor(
      public _RadioloyOrderlistService: RadioloyOrderlistService,
      public _matDialog: MatDialog,
     //private accountService: AuthenticationService,
      private _fuseSidebarService: FuseSidebarService,
      public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
      
  }

onSave(row: any = null) {
      
      let that = this;
      const dialogRef = this._matDialog.open(RadiologyTemplateReportComponent,
          {
              maxWidth: "75vw",
              height: '75%',
              width: '70%',
              data: row
          });
      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              that.grid.bindGridData();
          }
      });
  }
}


export class RadioPatientList {
  RadDate: Date;
  RadTime: Date;
  RegNo: any;
  PatientName: String;
  PatientType: number;
  TestName: String;
  ConsultantDoctor: any;
  CategoryName: String;
  AgeYear: number;
  GenderName: String;
  PBillNo: number;
  OPD_IPD_ID: any;
OP_Ip_Type: any;
IsCompleted: any;
DoctorName: any;
AgeGender: any;
ServiceId: any;
ServiceName: any;
MobileNo: any;
CompanyName: any;
RefDoctorName: any;
Doctorname:any;
IsActive:any;

  constructor(RadioPatientList) {
    this.RadDate = RadioPatientList.RadDate || '';
    this.RadTime = RadioPatientList.RadTime;
    this.RegNo = RadioPatientList.RegNo;
    this.PatientName = RadioPatientList.PatientName;
    this.PBillNo = RadioPatientList.PBillNo;
    this.PatientType = RadioPatientList.PatientType || '0';
    this.ConsultantDoctor = RadioPatientList.ConsultantDoctor || '';
    this.TestName = RadioPatientList.TestName || '0';
    this.CategoryName = RadioPatientList.CategoryName || '';
    this.AgeYear = RadioPatientList.AgeYear;
    this.GenderName = RadioPatientList.GenderName;
    this.OPD_IPD_ID = RadioPatientList.OPD_IPD_ID || '';

    this.OP_Ip_Type = RadioPatientList.OP_Ip_Type || '';
    this.IsCompleted = RadioPatientList.IsCompleted || '0';
    this.DoctorName = RadioPatientList.DoctorName || '';
    this.AgeGender = RadioPatientList.AgeGender;
    this.ServiceId = RadioPatientList.ServiceId || 0;
    this.ServiceName = RadioPatientList.ServiceName;
    this.MobileNo = RadioPatientList.MobileNo || '';
    this.CompanyName = RadioPatientList.CompanyName;
    this.RefDoctorName = RadioPatientList.RefDoctorName || '';
    this.Doctorname=RadioPatientList.Doctorname || ''
    this.IsActive=RadioPatientList.IsActive || '';
  }

}

export class Templateinfo {

  RegNo: Number;
  AdmissionID: Number;
  PatientName: string;
  Doctorname: string;
  AdmDateTime: string;
  AgeYear: number;
  RadReportId: number;
  RadTestID: String;


  /**
  * Constructor
  *
  * @param Templateinfo
  */
  constructor(Templateinfo) {
    {
      this.RegNo = Templateinfo.RegNo || '';
      this.AdmissionID = Templateinfo.AdmissionID || '';
      this.PatientName = Templateinfo.PatientName || '';
      this.Doctorname = Templateinfo.Doctorname || '';
      this.AdmDateTime = Templateinfo.AdmDateTime || '';
      this.AgeYear = Templateinfo.AgeYear || '';
      this.RadReportId = Templateinfo.RadReportId || '';
      this.RadTestID = Templateinfo.RadTestID || ''; 
    }
  }
}


export class RadiologyPrint {
  RegNo: Number;
  AdmissionID: Number;
  PatientName: string;
  Doctorname: string;
  AdmDateTime: string;
  AgeYear: number;
  RadReportId: number;
  RadTestID: String; 
  RadDate: Date;
  RadTime: Date; 
  PatientType: any;
  TestName: String;
  ConsultantDoctor: any;
  CategoryName: String; 
  GenderName: String;
  PBillNo: number;
  AdmissionDate: Date;
  VisitDate: Date;
  VisitTime: Date;
  OPDNo: number;
  IPDNo: number;
  ReportDate: Date;
  ReportTime: Date;
  ResultEntry: String;
  RadiologyDocName: string;
  RefDoctorName:any;
  SuggestionNotes: string;
  UserName: string;
  PrintTestName: string;
  Education: string;
  AgeDay: any;
  ChargeId: number;
  ServiceName: String;
  OP_IP_Type: any;
  OP_IP_Number:any;
  CompanyName:any;
  DepartmentName:any;
  AgeMonth:any;
  ServiceId:any;
  TemplateId:any;
  OPD_IPD_Type:any;

  constructor(RadiologyPrint) {
    this.RadDate = RadiologyPrint.RadDate || '';
    this.CompanyName = RadiologyPrint.CompanyName || '';
    this.DepartmentName = RadiologyPrint.DepartmentName || '';
    this.RefDoctorName = RadiologyPrint.RefDoctorName || '';
    this.RadTime = RadiologyPrint.RadTime;
    this.RegNo = RadiologyPrint.RegNo;
    this.OP_IP_Number = RadiologyPrint.OP_IP_Number || '';
    this.RadTime = RadiologyPrint.RadTime;
    this.PatientName = RadiologyPrint.PatientName;
    this.PBillNo = RadiologyPrint.PBillNo;
    this.PatientType = RadiologyPrint.PatientType || '0';
    this.ConsultantDoctor = RadiologyPrint.ConsultantDoctor || '';
    this.TestName = RadiologyPrint.TestName || '0';
    this.CategoryName = RadiologyPrint.CategoryName || '';
    this.AgeYear = RadiologyPrint.AgeYear;
    this.GenderName = RadiologyPrint.GenderName;
    this.AdmissionDate = RadiologyPrint.AdmissionDate || '';
    this.VisitDate = RadiologyPrint.VisitDate || '';
    this.VisitTime = RadiologyPrint.VisitTime;
    this.OPDNo = RadiologyPrint.OPDNo;
    this.IPDNo = RadiologyPrint.IPDNo;
    this.ReportDate = RadiologyPrint.ReportDate;
    this.ReportTime = RadiologyPrint.ReportTime || '';
    this.ResultEntry = RadiologyPrint.ResultEntry || '';
    this.RadiologyDocName = RadiologyPrint.RadiologyDocName || '0';
    this.AgeMonth = RadiologyPrint.AgeMonth || '0';
    this.SuggestionNotes = RadiologyPrint.SuggestionNotes || '';
    this.UserName = RadiologyPrint.UserName;
    this.RadReportId = RadiologyPrint.RadReportId;

    this.PrintTestName = RadiologyPrint.PrintTestName;
    this.ChargeId = RadiologyPrint.ChargeId;
    this.Education = RadiologyPrint.Education;
    this.AgeDay = RadiologyPrint.AgeDay;
    this.ServiceName = RadiologyPrint.ServiceName;
    this.OP_IP_Type = RadiologyPrint.OP_IP_Type;
    this.TemplateId=RadiologyPrint.TemplateId || 0;
    this.AdmissionID = RadiologyPrint.AdmissionID || '';

    this.Doctorname = RadiologyPrint.Doctorname || '';
    this.AdmDateTime = RadiologyPrint.AdmDateTime || '';

    this.RadTestID = RadiologyPrint.RadTestID || '';
    this.ServiceId = RadiologyPrint.ServiceId || 0;
    this.OPD_IPD_Type= RadiologyPrint.OPD_IPD_Type || 0;
  }

}