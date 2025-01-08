import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, } from "@angular/core";
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { RegistrationService } from "../registration/registration.service";
import { DatePipe, Time } from "@angular/common";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AppointmentSreviceService } from "./appointment-srevice.service";
import Swal from "sweetalert2";
import { fuseAnimations } from "@fuse/animations";
import { NewRegistrationComponent } from "../registration/new-registration/new-registration.component";
import { EditConsultantDoctorComponent } from "./edit-consultant-doctor/edit-consultant-doctor.component";
import { EditRefraneDoctorComponent } from "./edit-refrane-doctor/edit-refrane-doctor.component";
import { EditRegistrationComponent } from "../registration/edit-registration/edit-registration.component";
import { CasepaperVisitDetails } from "../op-search-list/op-casepaper/op-casepaper.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { PatientAppointmentComponent } from "./patient-appointment/patient-appointment.component";
import { ImageViewComponent } from "./image-view/image-view.component";
import { CameraComponent } from "./camera/camera.component";
import { map, startWith, takeUntil } from "rxjs/operators";
import { OPBillingComponent } from "../op-search-list/op-billing/op-billing.component";
import { ChargesList, SearchInforObj } from "../op-search-list/opd-search-list/opd-search-list.component";
import { AdvanceDataStored } from "app/main/ipd/advance";
import { OPIPPatientModel } from "../op-search-list/search-page/search-page.component";
import { MatStepper } from "@angular/material/stepper";
import { AuthenticationService } from "app/core/services/authentication.service";
import { HeaderComponent } from "app/main/shared/componets/header/header.component";
import { ExcelDownloadService } from "app/main/shared/services/excel-download.service";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatSelect } from "@angular/material/select";
import { AnyCnameRecord } from "dns";
import { PdfviewerComponent } from "app/main/pdfviewer/pdfviewer.component";
import { ImageCropComponent } from "app/main/shared/componets/image-crop/image-crop.component";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { VisitDetailsComponent } from "./visit-details/visit-details.component";
import { ConfigService } from "app/core/services/config.service";
import { MatDrawer } from "@angular/material/sidenav";
import { MatAccordion } from "@angular/material/expansion";
import { CrossConsultationComponent } from "./cross-consultation/cross-consultation.component";
import { ThisReceiver } from "@angular/compiler";
import { ToastrService } from "ngx-toastr";
import { NewOPBillingComponent } from "../OPBilling/new-opbilling/new-opbilling.component";
import { Table } from "jspdf-autotable";
import moment, { invalid } from "moment";
import { values } from "lodash";
import { WhatsAppEmailService } from "app/main/shared/services/whats-app-email.service";
import { PatientVitalInformationComponent } from "./patient-vital-information/patient-vital-information.component";
import { AppointmentlistService } from "../appointment-list/appointmentlist.service";
import { OperatorComparer } from "app/core/models/gridRequest";
import { NewAppointmentComponent } from "../appointment-list/new-appointment/new-appointment.component";
import { EditRefranceDoctorComponent } from "../appointment-list/edit-refrance-doctor/edit-refrance-doctor.component";

export class DocData {
    doc: any;
    type: string = '';
};


@Component({
    selector: "app-appointment",
    templateUrl: "./appointment.component.html",
    styleUrls: ["./appointment.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AppointmentComponent implements OnInit {
    menuActions: Array<string> = [];
    myFilterform:FormGroup;
    resultsLength = 0;
    DoctorId=0;
    screenFromString = 'admission-form';
    hasSelectedContacts: boolean;
    autocompleteModedeptdoc: string = "ConDoctor";
    currentDate = new Date();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;


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

  
  
    constructor(
      private formBuilder: UntypedFormBuilder,
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



export class DocumentUpload {
    DocumentName: any;
    DocumentPath: string;

    constructor(DocumentUpload) {
        {
            this.DocumentName = DocumentUpload.DocumentName || '';
            this.DocumentPath = DocumentUpload.DocumentPath || '';

        }
    }
}

export class PatientDocument {
    Id: string;
    OPD_IPD_ID: Number;
    OPD_IPD_Type: Number;
    FileName: string;
    DocFile: File;
    constructor(PatientDocument) {
        {
            this.Id = PatientDocument.Id || "";
            this.OPD_IPD_ID = PatientDocument.OPD_IPD_ID || 0;
            this.OPD_IPD_Type = PatientDocument.opD_IPD_Type || 0;
            this.FileName = PatientDocument.Filename || "";
            this.DocFile = PatientDocument.DocFile || null;
        }
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
    PhoneAppId: any;
    IsCancelled: any;
    /**
     * Constructor
     *
     * @param VisitMaster
     */
    constructor(VisitMaster) {
        {
            this.VisitId = VisitMaster.VisitId || "";
            (this.PrefixId = VisitMaster.PrefixId || ""),
                (this.RegNoWithPrefix = VisitMaster.RegNoWithPrefix || "");
            this.PatientName = VisitMaster.PatientName || "";
            this.VisitDate = VisitMaster.VisitDate || "";
            this.VisitTime = VisitMaster.VisitTime || "";
            this.HospitalID = VisitMaster.HospitalID || "";
            this.HospitalName = VisitMaster.HospitalName || "";
            this.PatientTypeID = VisitMaster.PatientTypeID || "";
            this.PatientTypeId = VisitMaster.PatientTypeId || "";
            this.PatientType = VisitMaster.PatientType || "";
            this.CompanyId = VisitMaster.CompanyId || "";
            this.TariffId = VisitMaster.TariffId || "";
            this.OPDNo = VisitMaster.OPDNo || "";
            this.ConsultantDocId = VisitMaster.ConsultantDocId || "";
            this.Doctorname = VisitMaster.Doctorname || "";
            this.RefDocId = VisitMaster.VisitTime || "";
            this.RefDocName = VisitMaster.RefDocName || "";
            this.DepartmentId = VisitMaster.DepartmentId || "";
            this.patientOldNew = VisitMaster.patientOldNew || "";
            this.isXray = VisitMaster.isXray || "";
            this.AddedBy = VisitMaster.AddedBy || "";
            this.MPbillNo = VisitMaster.MPbillNo || "";
            this.RegNo = VisitMaster.RegNo || "";
            this.PhoneAppId = VisitMaster.PhoneAppId || 0
            this.IsCancelled = VisitMaster.IsCancelled || 0
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
    firstName: string;
    middleName: string;
    lastName: string;
    
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
    AdmissionID: any;
    VisitId: any;
    WardId: any;
    BedId: any;
    /**
     * Constructor
     *
     * @param RegInsert
     */

    constructor(RegInsert) {
        {
            this.RegId = RegInsert.RegId || "";
            this.RegDate = RegInsert.RegDate || "";
            this.RegTime = RegInsert.RegTime || "";
            this.PrefixId = RegInsert.PrefixId || "";
            this.PrefixID = RegInsert.PrefixID || "";
            this.FirstName = RegInsert.FirstName || "";
            this.MiddleName = RegInsert.MiddleName || "";
            this.LastName = RegInsert.LastName || "";
            this.firstName = RegInsert.firstName || "";
            this.middleName = RegInsert.middleName || "";
            this.lastName = RegInsert.lastName || "";
            this.Address = RegInsert.Address || "";
            this.City = RegInsert.City || "";
            this.PinNo = RegInsert.PinNo || "";
            this.DateofBirth = RegInsert.DateofBirth || this.currentDate;
            this.Age = RegInsert.Age || "";
            this.GenderId = RegInsert.GenderId || "";
            this.PhoneNo = RegInsert.PhoneNo || "";
            this.MobileNo = RegInsert.MobileNo || "";
            this.AddedBy = RegInsert.AddedBy || "";
            this.AgeYear = RegInsert.AgeYear || "";
            this.AgeMonth = RegInsert.AgeMonth || "";
            this.AgeDay = RegInsert.AgeDay || "";
            this.CountryId = RegInsert.CountryId || "";
            this.StateId = RegInsert.StateId || "";
            this.CityId = RegInsert.CityId || "";
            this.MaritalStatusId = RegInsert.MaritalStatusId || "";
            this.IsCharity = RegInsert.IsCharity || "";
            this.ReligionId = RegInsert.ReligionId || "";
            this.AreaId = RegInsert.AreaId || "";
            this.VillageId = RegInsert.VillageId || "";
            this.TalukaId = RegInsert.TalukaId || "";
            this.PatientWeight = RegInsert.PatientWeight || "";
            this.AreaName = RegInsert.AreaName || "";
            this.AadharCardNo = RegInsert.AadharCardNo || "";
            this.PanCardNo = RegInsert.PanCardNo || '';
            this.AdmissionID = RegInsert.AdmissionID || 0;
            this.VisitId = RegInsert.VisitId || 0;
            this.WardId = RegInsert.WardId || 0;
            this.BedId = RegInsert.BedId || 0;
        }
    }
}

export class AdvanceDetailObj {
    RegNo: Number;
    RegId: number;
    AdmissionID: Number;
    PatientName: string;
    Doctorname: string;
    DoctorName: string;
    AdmDateTime: string;
    AgeYear: number;
    ClassId: number;
    TariffName: String;
    TariffId: number;
    opD_IPD_Type: number;
    VisitId: number;
    storage: any;
    IPDNo: any;
    RefDoctorId: any;
    DoctorId: any;
    OPD_IPD_ID: any;
    RefDocName: any;
    WardName: any;
    BedName: any;
    VisitDate: any;
    VisitTime: any;
    PatientTypeId: any;
    CompanyId: any;
    HospitalId: any;
    VistDateTime: any;
    AadharCardNo: any;
    DepartmentId: any;
    Departmentid: any;
    /**
     * Constructor
     *
     * @param AdvanceDetailObj
     */
    constructor(AdvanceDetailObj) {
        {
            this.RegNo = AdvanceDetailObj.RegNo || "";
            this.RegId = AdvanceDetailObj.RegId || "";
            this.VisitId = AdvanceDetailObj.VisitId || "";
            this.AdmissionID = AdvanceDetailObj.AdmissionID || "";
            this.PatientName = AdvanceDetailObj.PatientName || "";
            this.Doctorname = AdvanceDetailObj.Doctorname || "";
            this.DoctorName = AdvanceDetailObj.DoctorName || "";
            this.AdmDateTime = AdvanceDetailObj.AdmDateTime || "";
            this.AgeYear = AdvanceDetailObj.AgeYear || "";
            this.ClassId = AdvanceDetailObj.ClassId || "";
            this.TariffName = AdvanceDetailObj.TariffName || "";
            this.TariffId = AdvanceDetailObj.TariffId || "";
            this.opD_IPD_Type = AdvanceDetailObj.opD_IPD_Type || 0;
            this.IPDNo = AdvanceDetailObj.IPDNo || "";
            this.RefDoctorId = AdvanceDetailObj.RefDoctorId || 0;
            this.DoctorId = AdvanceDetailObj.DoctorId || 0;
            this.OPD_IPD_ID = AdvanceDetailObj.OPD_IPD_ID || 0;
            this.RefDocName = AdvanceDetailObj.RefDocName || "";
            this.WardName = AdvanceDetailObj.WardName || "";
            this.BedName = AdvanceDetailObj.BedName || "";
            this.VisitDate = AdvanceDetailObj.VisitDate || "";
            this.VisitTime = AdvanceDetailObj.VisitTime || "";
            this.PatientTypeId = AdvanceDetailObj.PatientTypeId || 0;
            this.CompanyId = AdvanceDetailObj.CompanyId || 0;
            this.HospitalId = AdvanceDetailObj.HospitalId || 0;
            this.VistDateTime = AdvanceDetailObj.VistDateTime || ''
            this.AadharCardNo = AdvanceDetailObj.AadharCardNo || 0;
            this.DepartmentId = AdvanceDetailObj.DepartmentId || 0;
            this.Departmentid = AdvanceDetailObj.Departmentid || 0;
        }
    }
}