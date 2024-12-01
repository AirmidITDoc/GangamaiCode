import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from './appointmentlist.service';
import { EditConsultantDoctorComponent } from './edit-consultant-doctor/edit-consultant-doctor.component';
import { CrossConsultationComponent } from './cross-consultation/cross-consultation.component';
import { fuseAnimations } from '@fuse/animations';
import { DischargeComponent } from 'app/main/ipd/ip-search-list/discharge/discharge.component';
import { BedTransferComponent } from 'app/main/ipd/ip-search-list/bed-transfer/bed-transfer.component';
import { NewOPBillingComponent } from '../OPBilling/new-opbilling/new-opbilling.component';
import { NewRegistrationComponent } from '../registration/new-registration/new-registration.component';
import { DatePipe } from '@angular/common';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { VisitMaster } from '../appointment/appointment.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { EditRefraneDoctorComponent } from '../appointment/edit-refrane-doctor/edit-refrane-doctor.component';
import { MatAccordion } from '@angular/material/expansion';
import { MatDrawer } from '@angular/material/sidenav';
import { EditRefranceDoctorComponent } from './edit-refrance-doctor/edit-refrance-doctor.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AppointmentListComponent implements OnInit {
  menuActions: Array<string> = [];
  myFilterform:FormGroup;
  resultsLength = 0;
  DoctorId=0;
  screenFromString = 'admission-form';
  hasSelectedContacts: boolean;
  autocompleteModedeptdoc: string = "ConDoctor";
  currentDate = new Date();
  displayedColumns = [
    "visitId",
    "regId",
    "prefixId",
    "patientName",
    // "CrossConsultation",
    "dateofBirth",
    "address",
    "vistDateTime",
    "patientType",
    'opdNo',
    'departmentId',
    'companyName',
    "tariffName",
    "buttons",
  ];

  dataSource = new MatTableDataSource<VisitMaster>();
  @ViewChild('drawer') public drawer: MatDrawer;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  paginator: any;
  sort: any;


  constructor(
    private formBuilder: FormBuilder,
    public _AppointmentlistService: AppointmentlistService,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
    private reportDownloadService: ExcelDownloadService,
  ) { }

  ngOnInit(): void {
    this.myFilterform = this.filterForm();
    this.getVisitList();
    debugger
    if (this._ActRoute.url == "/opd/appointment") {

      // this.menuActions.push("Update Registration");
      this.menuActions.push("Update Consultant Doctor");
      this.menuActions.push("Update Referred Doctor");
    }

  }

  filterForm(): FormGroup {
    return this.formBuilder.group({
      RegNo:'',
      FirstName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      DoctorId:'',
      DoctorName:'',
      IsMark: 2,
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
    });
  }
 

  fname="%"
  lname="%"
  fromdate="11/11/2022"
  todate="11/11/2024"
  RegNo=0
  Doctor=0
  getVisitList() {

this.fname=this.myFilterform.get("FirstName").value
this.lname=this.myFilterform.get("LastName").value
this.fromdate=this.myFilterform.get("startdate").value
this.todate=this.myFilterform.get("enddate").value
this.RegNo=this.myFilterform.get("RegNo").value
this.DoctorId=this.myFilterform.get("DoctorId").value
debugger
    var m_data = {
      "first": 0,
      "rows": 25,
      sortField: "VisitId",
      sortOrder: 0,
      filters: [
        { fieldName: "F_Name", fieldValue: this.fname, opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: this.lname, opType: OperatorComparer.Contains },
        { fieldName: "Reg_No", fieldValue: this.RegNo, opType: OperatorComparer.Equals },
        { fieldName: "Doctor_Id", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromdate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.todate, opType: OperatorComparer.Equals },
        { fieldName: "IsMark", fieldValue: "1", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "1", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals },

      ],
      "exportType": "JSON"

    }

    console.log(m_data);
    this._AppointmentlistService.getAppointmentList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit.data as VisitMaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(Visit.data);
      this.resultsLength =Visit.data.length();
    },
      error => {

      });

  }

  getValidationdoctorMessages() {
    return {
      DoctorId: [
            { name: "required", Message: "Doctor Name is required" }
        ]
    };
  }
  selectChangedeptdoc(obj: any){
    console.log(obj);
    
  }


  getRecord(contact, m): void {

    if (m == "Update Registration") {
      var D_data = {
        RegId: contact.RegId,
      };

      const dialogRef = this._matDialog.open(NewRegistrationComponent,
        {
          maxWidth: "85vw",
          height: "80%",
          width: "80%",
          data: contact
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        console.log(
          "The dialog was closed - Insert Action",
          result
        );
        this.getVisitList();
      });
    } else if (m == "Update Consultant Doctor") {

      const dialogRef = this._matDialog.open(EditConsultantDoctorComponent,
        {
          maxWidth: "70vw",
          height: "410px",
          width: "70%",
          data: contact
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        this.getVisitList();
      });
    } else if (m == "Update Referred Doctor") {


      const dialogRef = this._matDialog.open(EditRefranceDoctorComponent, {
        maxWidth: "70vw",
        height: "380px",
        width: "70%",
        data:contact
      
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed - Insert Action", result);
        this.getVisitList();
      });
    } else if (m == "Cancle Appointment") {

      this.AppointmentCancle(contact.VisitId);
    }
    this.getVisitList();
  }



  Vtotalcount = 0;
  VNewcount = 0;
  VFollowupcount = 0;
  VBillcount = 0;
  VCrossConscount = 0;
  Appointdetail(data) {
    this.Vtotalcount = 0;
    this.VNewcount = 0;
    this.VFollowupcount = 0;
    this.VBillcount = 0;
    this.VCrossConscount = 0;
    // console.log(data)
    this.Vtotalcount;

    for (var i = 0; i < data.length; i++) {
      if (data[i].PatientOldNew == 1) {
        this.VNewcount = this.VNewcount + 1;
      }
      else if (data[i].PatientOldNew == 2) {
        this.VFollowupcount = this.VFollowupcount + 1;
      }
      if (data[i].MPbillNo == 1 || data[i].MPbillNo == 2) {
        this.VBillcount = this.VBillcount + 1;
      }
      if (data[i].CrossConsulFlag == 1) {
        this.VCrossConscount = this.VCrossConscount + 1;
      }

      this.Vtotalcount = this.Vtotalcount + 1;
    }

  }

  NewCrossConsultation(contact) {
    const dialogRef = this._matDialog.open(CrossConsultationComponent, {
      maxWidth: "70vw",
      height: "380px",
      width: "70%",
      data: contact

    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed - Insert Action", result);
      this.getVisitList();
    });
  }

  onAppointment() {

    let that = this;
    const dialogRef = this._matDialog.open(NewAppointmentComponent,
      {
        maxWidth: "95vw",
        height: '95%',
        width: '90%',
        // data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        that.getVisitList();
      }
    });
  }

  viewgetPatientAppointmentReportPdf(obj, Pflag) {

    let VisitId;
    if (Pflag) {
      VisitId = obj.VisitId
    } else {
      VisitId = obj
    }

    // setTimeout(() => {

    //     this._AppointmentlistService.getAppointmentReport(
    //         VisitId
    //     ).subscribe(res => {
    //         const dialogRef = this._matDialog.open(PdfviewerComponent,
    //             {
    //                 maxWidth: "85vw",
    //                 height: '750px',
    //                 width: '100%',
    //                 data: {
    //                     base64: res["base64"] as string,
    //                     title: "Appointment  Viewer"
    //                 }
    //             });
    //         dialogRef.afterClosed().subscribe(result => {

    //         });
    //     });

    // }, 100);

  }


  viewgetPatientAppointmentTemplateReportPdf(obj) {

    setTimeout(() => {

      this._AppointmentlistService.getAppointmenttemplateReport(
        obj.VisitId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Appointment  Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {

        });
      });

    }, 100);

  }
  AppointmentCancle(contact) {
    Swal.fire({
        title: 'Do you want to Cancle Appointment',
        // showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'OK',

    }).then((flag) => {


        if (flag.isConfirmed) {
            let appointmentcancle = {};
            appointmentcancle['visitId'] = contact.VisitId;

            let submitData = {
                "appointmentcancle": appointmentcancle

            };
            console.log(submitData);
            this._AppointmentlistService.Appointmentcancle(submitData).subscribe(response => {
                if (response) {
                    Swal.fire('Appointment cancelled !', 'Appointment cancelled Successfully!', 'success').then((result) => {

                    });
                    this.getVisitList();
                } else {
                    Swal.fire('Error !', 'Appointment cancelled data not saved', 'error');
                }
             
            });
        }
    });
    this.getVisitList();
}

  objICard = {};
  QrCode = "";
  printIcard(row) {

      this.objICard = row;
      this.QrCode = row.RegId.toString();
      setTimeout(() => {
          this.OnPrint();
      }, 100);
  }
  OnPrint() {

      const printContents = document.getElementById("i-card").innerHTML;
      const pageContent = `<!DOCTYPE html><html><head></head><body onload="window.print()">${printContents}</html>`;
      let popupWindow: Window;
      if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
          popupWindow = window.open(
              '',
              '_blank',
              'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
          );
          popupWindow.window.focus();
          popupWindow.document.write(pageContent);
          popupWindow.document.close();
          popupWindow.onbeforeunload = event => {
              popupWindow.close();
          };
          popupWindow.onabort = event => {
              popupWindow.document.close();
              popupWindow.close();
          };
      } else {
          popupWindow = window.open('', '_blank', 'width=600,height=600');
          popupWindow.document.open();
          popupWindow.document.write(pageContent);
          popupWindow.document.close();
      }

  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  onClear() {

  }

  onClose() {
    //  this.dialogRef.close();
  }

}