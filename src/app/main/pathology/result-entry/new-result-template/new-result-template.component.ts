import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { Observable } from 'rxjs';
import { ResultEntryService } from '../result-entry.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { fuseAnimations } from '@fuse/animations';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-result-template',
  templateUrl: './new-result-template.component.html',
  styleUrls: ['./new-result-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewResultTemplateComponent {

  TemplateForm: FormGroup
  PathReportTemplateForm: FormGroup
  PathReportHeaderForm: FormGroup

  @ViewChild('PathResultDoctorId') PathResultDoctorId: ElementRef;
  currentDate: Date = new Date();
  dataSource: any = { data: [] };
  VpathResultDr1 = 0
  vTemplateName: any = 0;
  vPathResultDoctorId: any = 0;
  isLoading: string = '';
  msg: any;

  screenFromString = 'opd-casepaper';
  printTemplate: any;
  PathReportID: any;
  PathTestId: any
  TemplateList: any = [];
  optionsTemplate: any[] = [];
  optionsDoc3: any[] = [];
  PathologyDoctorList: any = [];
  sIsLoading: string = '';
  isTemplateNameSelected: boolean = false;
  isresultdrSelected: boolean = false;
  PathReportId = 0
  templateObj: any;
  TemplateDesc: any;
  otherForm: FormGroup;
  reportIdData: any;
  TemplateId: any = 0;
  vTemplateDesc: any = "";
  OP_IPType: any;
  PathResultDr1: any;
  vsuggestionNotes: any = '';
  ApiURL: any = '';
  filteredOptionsisTemplate: Observable<string[]>;
  filteredresultdr: Observable<string[]>;
  selectedAdvanceObj1: AdmissionPersonlModel;

  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteModeTemplate: string = "RadioTemplate";
  serviceId = 0
  verifyCheck: boolean;

  constructor(
    public _SampleService: ResultEntryService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewResultTemplateComponent>,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) {
    dialogRef.disableClose = true;

    if (this.data) {
      this.verifyCheck = data.verifyCheck
      this.selectedAdvanceObj1 = this.data.data;
      this.serviceId = this.selectedAdvanceObj1.serviceId
      console.log(this.selectedAdvanceObj1)
      this.OP_IPType = this.selectedAdvanceObj1.patientType === 'OP' ? '0' : '1';
      this.reportIdData = this.selectedAdvanceObj1.pathReportID ?? this.selectedAdvanceObj1.pathReportId
      this.PathResultDr1 = this.selectedAdvanceObj1.adm_Visit_docId //PathResultDr1 ask to sir
      //  this.TemplateId = row.templateId

      this.getTemplatedetail(this.selectedAdvanceObj1);
    }
    this.otherForm = this.formBuilder.group({
      TemplateName: [0],
      ResultEntry: ['', Validators.required],
      TemplateId: [0],
      suggestionNotes: [''],
      PathResultDoctorId: ['', Validators.required]
    });

    this.selectChangeService()
    //  this.ApiURL = "Pathology/search-GetServicewiseTemplate?ServiceId=" + this.selectedAdvanceObj1.serviceId;

  }

  @ViewChild('itemAutocomplete', { read: ElementRef }) itemAutocomplete: ElementRef;
  ngOnInit(): void {
    this.TemplateForm = this.vResultTemplateFormInsert()
    console.log(this.selectedAdvanceObj1)

    this.PathReportTemplateForm = this.createTemplateform();
    this.PathReportHeaderForm = this.createTemplateHeader();

    // this.ApiURL = "Pathology/search-GetServicewiseTemplate?ServiceId=" +this.selectedAdvanceObj1.serviceId;
    console.log(this.ApiURL)
  }

  onVerify() {
    Swal.fire({
      title: 'Confirm Verify Report ',
      text: 'Are you sure you want to Verify Report?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#41ea76ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Verify!'

    }).then((flag) => {
      // debugger
      if (flag.isConfirmed) {

        let submitData = {
          "pathReportId": this.reportIdData,
          "isVerifyid": this.accountService.currentUserValue.userId,
          "isVerifySign": true,
          "isVerifyedDate": new Date().toISOString()
        };
        console.log(submitData);
        this._SampleService.PathReportverifyMaster(submitData).subscribe(response => {
          this._matDialog.closeAll();
        });
      }
    });
    // this.onEdit(row);
  }

  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
    throw new Error('Method not implemented.');
  }

  vResultTemplateFormInsert(): FormGroup {
    return this.formBuilder.group({

      pathologyReportTemplate: [''],
      pathologyReportHeader: ['']

    });
  }

  createTemplateform(): FormGroup {
    return this.formBuilder.group({
      pathReportId: [this.reportIdData || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      pathTemplateId: [this.TemplateId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      pathTemplateDetailsResult: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      templateResultInHTML: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      testId: [this.selectedAdvanceObj1.pathTestID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      suggestionNotes: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      pathResultDr1: [this.VpathResultDr1 || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }


  createTemplateHeader(): FormGroup {
    return this.formBuilder.group({
      pathReportID: [this.reportIdData || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      reportDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      reportTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      isCompleted: true,
      isPrinted: true,
      pathResultDr1: [this.VpathResultDr1 || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      pathResultDr2: 0,
      pathResultDr3: 0,
      isTemplateTest: 1,
      suggestionNotes: ["", [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      admVisitDoctorID: [this.selectedAdvanceObj1.adm_Visit_docId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      refDoctorID: 0,
      addedBy: [this.accountService.currentUserValue.userId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }


  public onEnterSugg(event): void {
    if (event.which === 13) {
      this.PathResultDoctorId.nativeElement.focus();
    }
  }


  getTemplatedetail(row) {
    // debugger
    console.log("data:", row)
    this.PathReportId = row.pathReportId ?? row.pathReportID
    if ((this.PathReportId ?? 0) > 0) {
      setTimeout(() => {
        this._SampleService.getPathTemplateById(this.PathReportId).subscribe((response) => {
          this.templateObj = response;
          console.log("all data:", this.templateObj)
          this.vTemplateDesc = this.templateObj.templateResultInHTML
          this.vsuggestionNotes = this.templateObj.suggestionNotes
          this.otherForm.get("PathResultDoctorId").setValue(this.templateObj.pathResultDr1)
        });
      }, 500);
    }
  }

  selectChangeDoctorName(row) {
    console.log(row)
    this.VpathResultDr1 = row.doctorId
  }

  onSubmit() {

    const currentDate = new Date();

    const datePipe = new DatePipe('en-US');

    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    const formattedTime = datePipe.transform(currentDate, 'shortTime');

    if (this.otherForm.get("PathResultDoctorId")?.value == '') {

      this.toastr.warning('Please select valid Pathalogist', 'Warning !', {

        toastClass: 'tostr-tost custom-toast-warning',

      });

      return;

    }

    if (this.otherForm.get("ResultEntry")?.value == '' || this.otherForm.get("ResultEntry")?.value == undefined) {

      this.toastr.warning('Please Enter Result Entry ', 'Warning !', {

        toastClass: 'tostr-tost custom-toast-warning',

      });

      return;

    }

    this.PathReportTemplateForm.get("pathTemplateId").setValue(this.TemplateId)

    this.PathReportTemplateForm.get("pathTemplateDetailsResult").setValue(this.otherForm.get("ResultEntry").value)

    this.PathReportTemplateForm.get("templateResultInHTML").setValue(this.otherForm.get("ResultEntry").value)

    this.PathReportTemplateForm.get("testId").setValue(this.selectedAdvanceObj1.pathTestID)

    this.PathReportTemplateForm.get("suggestionNotes").setValue(this.otherForm.get("suggestionNotes").value)

    this.PathReportTemplateForm.get("pathResultDr1").setValue(this.VpathResultDr1)

    this.PathReportHeaderForm.get("pathResultDr1").setValue(this.VpathResultDr1)

    this.PathReportHeaderForm.get("suggestionNotes").setValue(this.otherForm.get("suggestionNotes").value)

    this.PathReportHeaderForm.get("reportTime").setValue(datePipe.transform(currentDate, 'shortTime'))

    this.TemplateForm.get("pathologyReportTemplate").setValue(this.PathReportTemplateForm.value)

    this.TemplateForm.get("pathologyReportHeader").setValue(this.PathReportHeaderForm.value)


    console.log(this.TemplateForm.value);

    if (!this.TemplateForm.invalid) {

      this._SampleService.PathTemplateResultentryInsert(this.TemplateForm.value).subscribe(response => {

        this.dialogRef.close();

        this.viewgetPathologyTemplateReportPdf(this.selectedAdvanceObj1);

      });

    }

  }



  viewgetPathologyTemplateReportPdf(contact) {
    // debugger
    setTimeout(() => {
      let param = {
        "searchFields": [
          {
            "fieldName": "PathReportId",
            "fieldValue": String(contact.pathReportId ?? contact.pathReportID),
            "opType": "Equals"
          },
          {
            "fieldName": "OP_IP_Type",
            "fieldValue": String(contact.opdipdtype ?? contact.opdIpdType),
            "opType": "Equals"
          }
        ],
        "mode": "PathologyReportTemplateWithHeader"
      }

      this._SampleService.getReportView(param).subscribe(res => {

        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Template Report" + " " + "Viewer"
            }
          });
        matDialog.afterClosed().subscribe(result => {
        });
      });
    }, 100);
  }

  onEdit(row) {
    var m_data = {
      "TemplateId": row.TemplateId,
      "TemplateName": row.TemplateName.trim(),
      "TemplateDesc": row.TemplateDesc.trim(),
      "IsDeleted": JSON.stringify(row.IsDeleted),
      "UpdatedBy": row.UpdatedBy,
    }
    this._SampleService.populateForm(m_data);
  }
  // @ViewChild('ddltemplate') ddltemplate: AirmidDropDownComponent;

  selectChangeService() {

    if (this.selectedAdvanceObj1.serviceId) {
      this._SampleService.gettemplatebyService(this.selectedAdvanceObj1.serviceId).subscribe((data: any) => {
        console.log(data)
        // this.ddltemplate.options = data;
        // this.ddltemplate.bindGridAutoComplete();
      });
    }

  }


  getValidationMessages() {

    return {
      RegId: [],
      TemplateName: [
      ]

    };
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClear() {
    this._SampleService.myform.reset();
  }

  onClose() {
    this._SampleService.myform.reset();
    this.dialogRef.close();
  }

  Tempdesc: any;
  isSelected: boolean = false;
  selectChangeTemplateName(row) {
    console.log("Template:", row)
    this.Tempdesc = row.templateDesc
    this.TemplateId = row.templateId
    if (row.templateId)
      this.isSelected = true
  }

  onAddTemplate() {
    this.vTemplateDesc = this.Tempdesc
  }

  public onEnterPathResultDoctorId(event, value): void {

    if (event.which === 13) {
      console.log(value)
      if (value == undefined) {
        this.toastr.warning('Please Enter Valid Pathology Doctor .', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
  }

}


export class PthologyresulUp {

  PathReportID: number;
  ReportDate: any;
  ReportTime: any;
  IsCompleted: boolean;
  IsPrinted: boolean;
  PathResultDr1: any;
  PathResultDr2: any;
  PathResultDr3: any;
  IsTemplateTest: any;
  SuggestionNotes: any;
  AdmVisitDoctorID: any;
  RefDoctorID: any;

  constructor(pathologyTemplateUpdateObj) {
    this.PathReportID = pathologyTemplateUpdateObj.PathReportID || 0;
    this.ReportDate = pathologyTemplateUpdateObj.ReportDate || '';
    this.ReportTime = pathologyTemplateUpdateObj.ReportTime || '';
    this.IsCompleted = pathologyTemplateUpdateObj.IsCompleted || 0;
    this.IsPrinted = pathologyTemplateUpdateObj.IsPrinted || 0;
    this.PathResultDr1 = pathologyTemplateUpdateObj.PathResultDr1 || 0;
    this.PathResultDr2 = pathologyTemplateUpdateObj.PathResultDr2 || 0;
    this.PathResultDr3 = pathologyTemplateUpdateObj.PathResultDr3 || 0;
    this.IsTemplateTest = pathologyTemplateUpdateObj.IsTemplateTest || 0;
    this.SuggestionNotes = pathologyTemplateUpdateObj.SuggestionNotes || '';
    this.AdmVisitDoctorID = pathologyTemplateUpdateObj.AdmVisitDoctorID || 0;
    this.RefDoctorID = pathologyTemplateUpdateObj.RefDoctorID || 0;
  }

}


export class PthologyresultInsert {

  PathReportId: number;
  PathTemplateId: number;
  PathTemplateDetailsResult: any;
  TestId: any;


  constructor(pathologyTemplateInsertObj) {

    this.PathReportId = pathologyTemplateInsertObj.PathReportId || 0;
    this.PathTemplateId = pathologyTemplateInsertObj.PathTemplateId || 0;
    this.PathTemplateDetailsResult = pathologyTemplateInsertObj.PathTemplateDetailsResult || 0;
    this.TestId = pathologyTemplateInsertObj.TestId || 0;

  }

}


export class PthologyresulDelt {

  pathReportId: number;

  constructor(pathologyTemplateDeleteObj) {
    this.pathReportId = pathologyTemplateDeleteObj.pathReportId || 0;

  }

}


