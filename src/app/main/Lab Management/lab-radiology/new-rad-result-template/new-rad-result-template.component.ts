import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { LabRadiologyService } from '../lab-radiology.service';
// import { Editor } from 'ngx-editor';

@Component({
    selector: 'app-new-rad-result-template',
    templateUrl: './new-rad-result-template.component.html',
    styleUrls: ['./new-rad-result-template.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewRadResultTemplateComponent {
    Tempdesc: any;
    isSelected: boolean = false;

    filteredrefdr: Observable<string[]>;
    optionsDoc1: any[] = [];
    msg: any;
    selectedAdvanceObj: RadiologyPrint;
    public iframe: object = { enable: true };
    public height: number = 410;
    reportPrintObj: RadiologyPrint;
    regobj: RadiologyPatienInsert;
    vTemplateDesc: any = "";
    screenFromString = 'ExternalLab-form';
    isresultdrSelected: boolean = false;
    templatelist: any = [];
    Doctorlist: any = [];
    currentDate = new Date();
    ResultEntry: any;
    SuggestionNotes: any;
    vsuggestionNotes: any;
    DoctorId: any;
    printTemplate: any;
    subscriptionArr: Subscription[] = [];
    TemplateList: any = [];
    optionsTemplate: any[] = [];

    isTemplateNameSelected: boolean = false;
    filteredOptionsisTemplate: Observable<string[]>;
    vTemplateName: any = 0;
    TemplateId: any = 0;

    regObj: any;
    PatientName: any;
    MobileNo: any;
    DepartmentName: any;
    AgeMonth: any;
    AgeDay: any;
    GenderName: any;
    RefDocName: any;
    RegNo: any;
    vOPIPId: any;
    VisitId: any;
    RegId: any;
    Doctorname: any;
    vOPDIPdNo: any;
    AgeYear: any;
    PatientType: any;
    CompanyName: any;
    vClassId: any;
    Lbl: any;
    DOA: any;
    DOT: any;
    autocompleteModeDoctor: string = "ConDoctor";
    autocompleteModeTemplate: string = "RadioTemplate";
    RaioInsertForm: FormGroup;
    verifyCheck: boolean;

    private _onDestroy = new Subject<void>();
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    dataSource = new MatTableDataSource<RadiologyPatienInsert>();

    constructor(
        public _radiologytemplateService: LabRadiologyService,
        private accountService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        private advanceDataStored: AdvanceDataStored,
        private formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public dialogRef: MatDialogRef<NewRadResultTemplateComponent>,
    ) {

        if (this.advanceDataStored.storage) {
            this.selectedAdvanceObj = this.advanceDataStored.storage;
            this.TemplateId == this.selectedAdvanceObj.TemplateId;

            console.log(this.selectedAdvanceObj)
        }
    }

    ngOnInit(): void {
        this.RaioInsertForm = this.createradioInsert();

        if (this.data) {
            this.verifyCheck = this.data.verifyCheck
            this.regObj = this.data.data
            console.log(this.regObj)
            this.RegNo = this.regObj.regNo
            this.vOPIPId = this.regObj.visitId
            this.VisitId = this.regObj.visitId
            this.RegId = this.regObj.regId
            this.PatientName = this.regObj.patientName
            this.Doctorname = this.regObj.consultantDoctor || this.regObj.doctorName
            this.vOPDIPdNo = this.regObj.oP_IP_Number
            this.AgeYear = this.regObj.ageYear
            this.AgeMonth = this.regObj.ageMonth
            this.AgeDay = this.regObj.ageDay
            // this.GenderName = this.regObj.genderName.split('|')[1]
            this.DepartmentName = this.regObj.departmentName
            this.PatientType = this.regObj.patientType
            this.CompanyName = this.regObj.companyName
            this.RefDocName = this.regObj.refDocName || this.regObj.refDoctor
            this.vClassId = this.regObj.classId
            this.Lbl = this.regObj.lbl
            this.DOA = this.regObj.doa
            this.DOT = this.regObj.dot
            this._radiologytemplateService.myform.get("TemplateName").setValue(this.TemplateId)
        }
        if (this.data.data.isCompleted == true) {
            this.getTemplateList(this.regObj);
        }
    }

    createradioInsert(item: any = {}): FormGroup {
        return this.formBuilder.group({
            radReportId: [item.radReportId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            reportDate: [new Date(), [this._FormvalidationserviceService.onlyNumberValidator()]],
            reportTime: [new Date(), [this._FormvalidationserviceService.onlyNumberValidator()]],
            isCompleted: true,
            isPrinted: true,
            radResultDr1: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            radResultDr2: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            radResultDr3: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            suggestionNotes: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            admVisitDoctorId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refDoctorId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            resultEntry: ['', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],

        });
    }


    selectChangeTemplateName(row) {
        console.log("Template:", row)
        this.Tempdesc = row.templateDesc
        if (row.templateId)
            this.isSelected = true
    }

    onAddTemplate(e) {
        this.vTemplateDesc = this.Tempdesc
    }

    onEditorValueChange(content: string) {
        this._radiologytemplateService.myform.get('ResultEntry')?.setValue(content);
    }

    onVerify(row) {
        Swal.fire({
            title: 'Confirm Verify Report ',
            text: 'Are you sure you want to Verify Report?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3bd96dff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Verify!'

        }).then((flag) => {
            // debugger
            if (flag.isConfirmed) {

                const submitData = {

                    "radReportId": this.data.data.radReportId,
                    "isVerifyId": this.accountService.currentUserValue.userId,
                    "isVerifySign": true,
                    "isVerifyedDate": new Date().toISOString()
                };
                console.log(submitData);
                this._radiologytemplateService.RadioReportverifyMaster(submitData).subscribe(response => {
                    this.onClose();
                });
            }
        });
        this.grid.bindGridData();
    }

    RadReportId = 0
    templateObj: any;
    getTemplateList(row) {
        // debugger
        console.log("data:", row)
        this.RadReportId = row.radReportId
        if ((this.RadReportId ?? 0) > 0) {
            setTimeout(() => {
                this._radiologytemplateService.getRadTemplateById(this.RadReportId).subscribe((response) => {
                    this.templateObj = response;
                    console.log("all data:", this.templateObj)
                    if (this.templateObj.isCompleted) {
                        this.vTemplateDesc = this.templateObj.resultEntry
                        this.vsuggestionNotes = this.templateObj.suggestionNotes
                        this._radiologytemplateService.myform.get("DoctorId").setValue(this.templateObj.refDoctorId)
                    } else {
                        this.isSelected = true
                    }
                });
            }, 500);
        }
    }

    VpathResultDr1 = 0
    selectChangeDoctorName(row) {
        this.VpathResultDr1 = row.value
    }

    onSubmit() {
        console.log(this._radiologytemplateService.myform.value)

        // debugger
        if (this._radiologytemplateService.myform.get("ResultEntry")?.value == '' || this._radiologytemplateService.myform.get("ResultEntry")?.value == undefined) {
            this.toastr.warning('Please Enter Result Entry ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if (this._radiologytemplateService.myform.get("DoctorId")?.value == '' || this._radiologytemplateService.myform.get("DoctorId")?.value == undefined) {
            this.toastr.warning('Please Select Doctor', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if (this.regObj.radReportId) {

            this.RaioInsertForm.get("radReportId").setValue(this.regObj.radReportId || 0)
            this.RaioInsertForm.get("radResultDr1").setValue(this._radiologytemplateService.myform.get("DoctorId").value || 10)
            this.RaioInsertForm.get("suggestionNotes").setValue(this._radiologytemplateService.myform.get("suggestionNotes").value || '')
            this.RaioInsertForm.get("refDoctorId").setValue(this._radiologytemplateService.myform.get("DoctorId").value || 0)
            this.RaioInsertForm.get("resultEntry").setValue(this._radiologytemplateService.myform.get("ResultEntry")?.value || '')
            this.RaioInsertForm.get("reportDate").setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
            this.RaioInsertForm.get("reportTime").setValue(this.dateTimeObj.time)

            console.log(this.RaioInsertForm.value);
            this._radiologytemplateService.RadiologyUpdate(this.RaioInsertForm.value).subscribe(data => {
                this.onClear();
                // this.viewgetRadioloyTemplateReportPdf(this.regObj);
            });
        } else {
            const invalidFields = [];

            if (this.RaioInsertForm.invalid) {
                for (const controlName in this.RaioInsertForm.controls) {
                    if (this.RaioInsertForm.controls[controlName].invalid) {
                        invalidFields.push(`RadioInsertForm Form: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                    );
                });
            }

        }

    }

    onEdit(row) {
        this._radiologytemplateService.populateForm(row);
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    onClear() {
        // this._radiologytemplateService.myform.get("ResultEntry")?.setValue('')
        // this._radiologytemplateService.myform.get("DoctorId")?.setValue('')
        this._radiologytemplateService.myform.reset();
        this.dialogRef.close();
    }

    onClose() {
        this._radiologytemplateService.myform.reset();
        this.dialogRef.close();
    }
}

export class RadiologyPatienInsert {
    RadReportID: number;
    ReportDate: Date;
    ReportTime: Date;
    IsCompleted: boolean;
    IsPrinted: boolean;
    RadResultDr1: number;
    RadResultDr2: number;
    RadResultDr3: number;
    SuggestionNotes: string;
    AdmVisitDoctorID: number;
    RefDoctorID: number;
    ResultEntry: string;



    constructor(RadiologyPatienInsert) {

        this.RadReportID = RadiologyPatienInsert.RadReportID || '';
        this.ReportDate = RadiologyPatienInsert.ReportDate;
        this.ReportTime = RadiologyPatienInsert.ReportTime || '';
        this.IsCompleted = RadiologyPatienInsert.IsCompleted;
        this.IsPrinted = RadiologyPatienInsert.IsPrinted;
        this.RadResultDr1 = RadiologyPatienInsert.RadResultDr1;
        this.RadResultDr2 = RadiologyPatienInsert.RadResultDr2;
        this.RadResultDr3 = RadiologyPatienInsert.RadResultDr3 || '0';
        this.SuggestionNotes = RadiologyPatienInsert.SuggestionNotes || '';
        this.AdmVisitDoctorID = RadiologyPatienInsert.AdmVisitDoctorID || '0';
        this.RefDoctorID = RadiologyPatienInsert.RefDoctorID || '';
        this.ResultEntry = RadiologyPatienInsert.ResultEntry;

    }
}

export class RadiologyPrint {
    RegNo: number;
    AdmissionID: number;
    PatientName: string;
    Doctorname: string;
    AdmDateTime: string;
    AgeYear: number;
    RadReportId: number;
    RadTestID: string;
    RadDate: Date;
    RadTime: Date;
    PatientType: any;
    TestName: string;
    ConsultantDoctor: any;
    CategoryName: string;
    GenderName: string;
    PBillNo: number;
    AdmissionDate: Date;
    VisitDate: Date;
    VisitTime: Date;
    OPDNo: number;
    IPDNo: number;
    ReportDate: Date;
    ReportTime: Date;
    ResultEntry: string;
    RadiologyDocName: string;
    RefDoctorName: any;
    SuggestionNotes: string;
    UserName: string;
    PrintTestName: string;
    Education: string;
    AgeDay: any;
    ChargeId: number;
    ServiceName: string;
    OP_IP_Type: any;
    OP_IP_Number: any;
    CompanyName: any;
    DepartmentName: any;
    AgeMonth: any;
    ServiceId: any;
    TemplateId: any;
    OPD_IPD_Type: any;

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
        this.TemplateId = RadiologyPrint.TemplateId || 0;
        this.AdmissionID = RadiologyPrint.AdmissionID || '';

        this.Doctorname = RadiologyPrint.Doctorname || '';
        this.AdmDateTime = RadiologyPrint.AdmDateTime || '';

        this.RadTestID = RadiologyPrint.RadTestID || '';
        this.ServiceId = RadiologyPrint.ServiceId || 0;
        this.OPD_IPD_Type = RadiologyPrint.OPD_IPD_Type || 0;
    }

}
