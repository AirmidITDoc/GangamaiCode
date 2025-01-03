import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { RegistrationService } from "../registration/registration.service";
import { DatePipe, Time } from "@angular/common";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { fuseAnimations } from "@fuse/animations";
import { NewRegistrationComponent } from "../registration/new-registration/new-registration.component";
import { ChargesList, SearchInforObj } from "../op-search-list/opd-search-list/opd-search-list.component";
import { AdvanceDataStored } from "app/main/ipd/advance";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ExcelDownloadService } from "app/main/shared/services/excel-download.service";
import { PdfviewerComponent } from "app/main/pdfviewer/pdfviewer.component";
import { ConfigService } from "app/core/services/config.service";
import { ToastrService } from "ngx-toastr";
import { NewOPBillingComponent } from "../OPBilling/new-opbilling/new-opbilling.component";
import { WhatsAppEmailService } from "app/main/shared/services/whats-app-email.service";
import { CompanyInformationComponent } from "app/main/ipd/company-information/company-information.component";
import { PatientVitalInformationComponent } from "../appointment/patient-vital-information/patient-vital-information.component";
import { CrossConsultationComponent } from "../appointment/cross-consultation/cross-consultation.component";
import { AdvanceDetailObj, RegInsert, VisitMaster } from "../appointment/appointment.component";
import { AppointmentSreviceService } from "../appointment/appointment-srevice.service";
import { UpdateRegisteredPatientInfoComponent } from "../appointment/update-registered-patient-info/update-registered-patient-info.component";
import { NewCasepaperComponent } from "../new-casepaper/new-casepaper.component";
import { AdmissionPersonlModel } from "app/main/ipd/Admission/admission/admission.component";

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AppointmentListComponent implements OnInit {

  displayedColumns = [
    "PatientOldNew",
    "RegNoWithPrefix",
    "PatientName",
    "DVisitDate",
    "OPDNo",
    'DepartmentName',
    "Doctorname",
    "RefDocName",
    "PatientType",
    'TariffName',
    "CompanyName",
    'MobileNo',
    "action",
  ];
  hasSelectedContacts: boolean;
  isLoadingStr: string = '';
  isLoading: String = '';
  registerObj = new RegInsert({});
  VisitFlagDisp: boolean = false;
  DoctorId: any;
  AdList: boolean = false;
  chkprint: boolean = false;
  currentDate = new Date();
  searchFormGroup: FormGroup;
  isRegIdSelected: boolean = false;
  isDoctorSelected: boolean = false;
  screenFromString = 'admission-form';

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<VisitMaster>();

  constructor(
    public _AppointmentSreviceService: AppointmentSreviceService,
    public _opappointmentService: AppointmentSreviceService,
    private accountService: AuthenticationService,
    public _registerService: RegistrationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private _ActRoute: Router,
    private configService: ConfigService,
    private _fuseSidebarService: FuseSidebarService,
    public _registrationService: RegistrationService,
    public matDialog: MatDialog,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    private reportDownloadService: ExcelDownloadService,
    private _Activatedroute: ActivatedRoute,
    private changeDetectorRefs: ChangeDetectorRef,
    public _WhatsAppEmailService: WhatsAppEmailService
  ) { }

  ngOnInit(): void {
    this.getVisitList1();
    this.searchFormGroup = this.createSearchForm();
  }
  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      regRadio1: ['registration1'],
      RegId: [''],
      PhoneRegId: ['']
    });
  }

  dateTimeObj: any;
  filteredOptionsDoctorsearch: any;
  PatientListfilteredOptions: any;
  noOptionFound: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  onClear() {
    this._AppointmentSreviceService.myFilterform.reset({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
    this._opappointmentService.mySaveForm.reset({ IsDeleted: 'false' });
    this._opappointmentService.initializeFormGroup();
  }
  getSearchList() {
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}`
    }
    this._opappointmentService.getRegistrationList(m_data).subscribe(data => {
      this.PatientListfilteredOptions = data;
      if (this.PatientListfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
  }
  getSelectedObjNew(obj) {
    this.updateRegisteredPatientInfo(obj);
  }
  getDoctorNameCombobox() {
    var vdata = {
      "@Keywords": `${this._AppointmentSreviceService.myFilterform.get('DoctorId').value}%`
    }
    console.log(vdata)
    this._AppointmentSreviceService.getDoctorMasterComboList(vdata).subscribe(data => {
      this.filteredOptionsDoctorsearch = data;
      console.log(this.filteredOptionsDoctorsearch)
      if (this.filteredOptionsDoctorsearch.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  getOptionTextDoctor(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }
  resultsLength = 0;
  getVisitList1() {
    var D_data = {
      F_Name: this._AppointmentSreviceService.myFilterform.get("FirstName").value.trim() + "%" || "%",
      L_Name: this._AppointmentSreviceService.myFilterform.get("LastName").value.trim() + "%" || "%",
      Reg_No: this._AppointmentSreviceService.myFilterform.get("RegNo").value || 0,
      Doctor_Id: this._AppointmentSreviceService.myFilterform.get("DoctorId").value.DoctorId || 0,
      From_Dt: this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("startdate").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900",
      To_Dt: this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("enddate").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900",
      IsMark: this._AppointmentSreviceService.myFilterform.get("IsMark").value || 0,
      Start: (this.paginator?.pageIndex ?? 0),
      Length: (this.paginator?.pageSize ?? 10),
      Sort: this.sort?.active ?? 'VisitId',
      Order: this.sort?.direction ?? 'desc'
    };
    console.log(D_data)
    setTimeout(() => {

      this._AppointmentSreviceService.getAppointmentList(D_data).subscribe(
        (Visit) => {
          this.dataSource.data = Visit["Table1"] ?? [] as VisitMaster[];
          console.log(this.dataSource.data)
          if (this.dataSource.data.length > 0) {
            this.Appointdetail(this.dataSource.data);
          }
          this.dataSource.sort = this.sort;
          this.resultsLength = Visit["Table"][0]["total_row"];
          // this.dataSource.paginator = this.paginator;
          this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
        },
        (error) => {
          // this.isLoading = 'list-loaded';
        }
      );
    }, 1000);

    console.log(this.dataSource.data)

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

  getOpCasePaper(contact) {
   this.advanceDataStored.storage = new AdmissionPersonlModel(contact);
    const dialogRef = this._matDialog.open(NewCasepaperComponent, {
      maxWidth: "90vw",
      height: "90vw",
       width: "90%",
      // data: {
      //   Obj: contact,
      //   FormName: "Medical Record"
      // },
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed - Insert Action", result);
      this.getVisitList1();
    });
  }

  NewCrossConsultation(contact) {

    const dialogRef = this._matDialog.open(CrossConsultationComponent,
      {
        maxWidth: '75vw',
        height: '400px', width: '100%',
        data: contact,

      });
    dialogRef.afterClosed().subscribe(result => {
      this.getVisitList1();
    });

  }
  getEditCompany(row) {
    this.advanceDataStored.storage = new VisitMaster(row);
    console.log(row)
    this._registrationService.populateFormpersonal(row);
    this.registerObj["RegId"] = row.RegID;
    this.registerObj["RegID"] = row.RegID;

    const dialogRef = this._matDialog.open(CompanyInformationComponent,
      {
        maxWidth: "70vw",
        height: '730px',
        width: '100%',
        data: {
          registerObj: row,
          Submitflag: true
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getVisitList1();
    });
  }

  EditRegistration(row) {
    this.registerObj = row;
    this.registerObj["RegId"] = row.RegId;
    this.registerObj["RegID"] = row.RegId;
    // this.registerObj["PrefixId"] = row.PrefixID;
    this.advanceDataStored.storage = new AdvanceDetailObj(row);
    console.log(row)

    this._registrationService.populateFormpersonal(row);

    const dialogRef = this._matDialog.open(NewRegistrationComponent,
      {
        maxWidth: "85vw",
        height: "450px",
        width: "100%",
        data: {
          registerObj: row,
          Submitflag: false
        },
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getVisitList1();
    });
  }

  viewgetPatientAppointmentTemplateReportPdf(obj, Pflag) {

    this.chkprint = true;
    let VisitId;
    if (Pflag) {
      VisitId = obj.VisitId
    } else {
      VisitId = obj
    }

    setTimeout(() => {
      this.AdList = true;
      this._opappointmentService.getAppointmenttemplateReport(
        VisitId
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
          this.AdList = false;
        });
      });

    }, 100);
    this.chkprint = false;
  }

  Billpayment(contact) {
    let xx = {
      RegId: contact.RegId,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      RegNo: contact.RegNoWithPrefix,
      VisitId: contact.VisitId,
      PatientName: contact.PatientName,
      Doctorname: contact.Doctorname,
      AdmDateTime: contact.AdmDateTime,
      AgeYear: contact.AgeYear,
      AgeMonth: contact.AgeMonth,
      AgeDay: contact.AgeDay,
      DepartmentName: contact.DepartmentName,
      ClassId: contact.ClassId,
      OPDNo: contact.OPDNo,
      PatientType: contact.PatientType,
      ClassName: contact.ClassName,
      TariffName: contact.TariffName,
      TariffId: contact.TariffId,
      CompanyId: contact.CompanyId,
      CompanyName: contact.CompanyName,
      RefDocName: contact.RefDocName,
      MobileNo: contact.MobileNo,
      Lbl: "AppointmentBill"
    };
    console.log(xx)
    //console.log(contact)
    this.advanceDataStored.storage = new SearchInforObj(xx);
    const dialogRef = this._matDialog.open(NewOPBillingComponent,
      {
        maxWidth: '90%',
        height: '95%',
        data: {
          registerObj: xx,
        },
      });

    dialogRef.afterClosed().subscribe(result => {
      this.getVisitList1();
    });

  }
  VitalInfo(contact) {
    let xx = {
      RegId: contact.RegId,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      RegNo: contact.RegNoWithPrefix,
      VisitId: contact.VisitId,
      PatientName: contact.PatientName,
      Doctorname: contact.Doctorname,
      AdmDateTime: contact.AdmDateTime,
      AgeYear: contact.AgeYear,
      AgeMonth: contact.AgeMonth,
      AgeDay: contact.AgeDay,
      DepartmentName: contact.DepartmentName,
      ClassId: contact.ClassId,
      OPDNo: contact.OPDNo,
      PatientType: contact.PatientType,
      ClassName: contact.ClassName,
      TariffName: contact.TariffName,
      TariffId: contact.TariffId,
      CompanyId: contact.CompanyId,
      CompanyName: contact.CompanyName,
      RefDocName: contact.RefDocName,
      MobileNo: contact.MobileNo,
      Lbl: "PatientVitalInfo"
    };
    console.log(xx)
    //console.log(contact)
    this.advanceDataStored.storage = new SearchInforObj(xx);
    const dialogRef = this._matDialog.open(PatientVitalInformationComponent,
      {
        maxWidth: '80%',
        height: '58%',
        data: {
          registerObj: xx,
        },
      });

    dialogRef.afterClosed().subscribe(result => {
      this.getVisitList1();
    });
  }
  updateRegisteredPatientInfo(obj) {
    const dialogRef = this._matDialog.open(UpdateRegisteredPatientInfoComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: {
          obj: obj
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getVisitList1();
      this.searchFormGroup.get('RegId').setValue('');
    });
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

  WhatsAppAppointmentSend(el, vmono) {
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": '',
        "isSent": 0,
        "smsType": 'Appointment',
        "smsFlag": 0,
        "smsDate": this.currentDate,
        "tranNo": el,
        "PatientType": 2,//el.PatientType,
        "templateId": 0,
        "smSurl": "info@gmail.com",
        "filePath": '',
        "smsOutGoingID": 0
      }
    }
    this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
      if (response) {
        this.toastr.success('Bill Sent on WhatsApp Successfully.', 'Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
      } else {
        this.toastr.error('API Error!', 'Error WhatsApp!', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    });
    // this.IsLoading = false;
  }
}
