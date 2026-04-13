import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { LabResultListService } from '../lab-result-list.service';

@Component({
    selector: 'app-new-labtemplate',
    templateUrl: './new-labtemplate.component.html',
    styleUrls: ['./new-labtemplate.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewLabtemplateComponent {
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
        public _SampleService: LabResultListService,
        private accountService: AuthenticationService,
        public toastr: ToastrService,
        private advanceDataStored: AdvanceDataStored,
        private formBuilder: UntypedFormBuilder,
        public datePipe: DatePipe,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        public dialogRef: MatDialogRef<NewLabtemplateComponent>,
        private _FormvalidationserviceService: FormvalidationserviceService,
    ) {
        dialogRef.disableClose = true;

        if (this.data) {
            this.verifyCheck = data.verifyCheck
            this.selectedAdvanceObj1 = this.data.data;
            console.log(this.selectedAdvanceObj1);
            this.serviceId = this.selectedAdvanceObj1.serviceId
            this.OP_IPType = '4';
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
            PathResultDoctorId: ['', [Validators.required, _FormvalidationserviceService.notEmptyOrZeroValidator()]]
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

    getAgeString(obj: any): string {
        if (!obj) return '';

        return (obj.ageYear ? obj.ageYear + 'Y|' : '') +
            (obj.AgeMonth ? obj.AgeMonth + 'M|' : '') +
            (obj.AgeDay ? obj.AgeDay + 'D | ' : '') +
            (obj.genderName || '');
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

                const submitData = {
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

        if (this.otherForm.get("PathResultDoctorId")?.value == '' || this.otherForm.get("PathResultDoctorId")?.value == 0) {

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

                // this.viewgetPathologyTemplateReportPdf(this.selectedAdvanceObj1);

            });

        }

    }

    viewgetPathologyTemplateReportPdf(contact) {
        // debugger
        setTimeout(() => {
            const param = {
                "searchFields": [
                    {
                        "fieldName": "PathReportId",
                        "fieldValue": String(contact.pathReportId ?? contact.pathReportID),
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "OP_IP_Type",
                        "fieldValue": "4",
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
        const m_data = {
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

export class AdmissionPersonlModel {
    admissionId: any;
    AadharCardNo: any;
    Address: any;
    PrefixId: any;
    opD_IPD_Type: any;
    Age: number;
    AgeDay: any;
    AgeMonth: any;
    AgeYear: any;
    ageDay: any;
    ageMonth: any;
    ageYear: any;
    AreaId: number;
    CityName: string;
    CityId: number;
    CountryId: number;
    DateofBirth: any;
    Expr1: any;
    FirstName: string;
    GenderId: number;
    GenderName: string;
    IsCharity: any;
    LastName: string;
    MaritalStatusId: number;
    MiddleName: string;
    MobileNo: string;
    PanCardNo: any;
    PatientName: string;
    patientName: string;
    PhoneNo: string;
    phoneNo: string;
    PinNo: string;
    PrefixID: number;
    PrefixName: string;
    RDate: any;
    RegDate: any;
    RegId: number;
    RegNo: number;
    regNo: number;
    RegNoWithPrefix: string;
    RegTime: string;
    RegTimeDate: string;
    ReligionId: number;
    StateId: number;
    TalukaId: number;
    TalukaName: string;
    VillageId: number;
    VillageName: string;
    Departmentid: any;
    currentDate = new Date();
    AdmittedDoctor1ID: any;
    AdmittedDoctor2ID: any;
    RelationshipId: any;
    relationshipId: any;
    AdmissionID: any;
    AdmissionDate: Date;
    AdmissionTime: Date;
    RelativeName: string;
    relativeName: string;
    DoctorId: number;
    RelatvieMobileNo: any;
    MaritalStatusName: string;
    IsMLC: any;
    CompanyName: any;
    companyName: any;
    RelationshipName: string;
    RefDoctorName: string;
    AdmittedDoctor2: any;
    admittedDoctor2: any;
    AdmittedDoctor1: any;
    admittedDoctor1: any;
    RefDocName: any;
    refDocName: any;
    BedId: any;
    bedId: any;
    BedName: any;
    bedName: any;
    IPDNo: any;
    ipdno: any;
    TariffName: any;
    tariffName: any;
    DepartmentName: any;
    departmentName: any;
    RefDoctorId: any;
    VisitId: any;
    CompanyId: any;
    companyId: any;
    HospitalId: any;
    patientTypeID: any;
    PatientType: any;
    patientType: any;
    SubCompanyId: any;
    subCompanyId: any;
    Aadharcardno: any;
    Pancardno: any;
    RelativePhoneNo: any;
    DepartmentId: any;
    departmentId: any;
    IsOpToIPconv: any;
    ClassName: any;
    IsBillGenerated: any;
    RoomId: any;
    RoomName: any;
    roomName: any;
    Doctorname: any;
    doctorname: any;
    AdmDateTime: any;
    TariffId: any;
    tariffId: any;
    RefDocNameId: any;
    refDocNameId: any;
    RefDocNameID: any;
    DocNameID: any;
    RelativeAddress: any;
    relativeAddress: any;
    IsSeniorCitizen: any;
    RegID: any;
    ClassId: any;
    classId: any;
    WardId: any;
    wardId: any;
    doctorId: any;
    tariffid: any;
    PolicyNo: any;
    MemberNo: any;
    // WardName:any;
    AprovAmount
    CompDOD
    IsPharClearance
    IPNumber
    EstimatedAmount
    ApprovedAmount
    HosApreAmt
    PathApreAmt
    PharApreAmt
    RadiApreAmt
    PharDisc

    ClaimNo: any;
    CompBillNo: any;
    CompBillDate: any;
    CompDiscount: any;
    CompDisDate: any;
    C_BillNo: any;
    C_FinalBillAmt: any;
    C_DisallowedAmt: any;
    HDiscAmt: any;
    C_OutsideInvestAmt: any;
    RecoveredByPatient: any;
    H_ChargeAmt: any;
    H_AdvAmt: any;
    H_BillId: any;
    H_BillDate: any;
    H_BillNo: any;
    H_TotalAmt: any;
    H_DiscAmt: any;
    H_NetAmt: any;
    H_PaidAmt: any;
    H_BalAmt: any;
    DoctorName: any;
    vOPDNo: any;
    TarrifName: any
    OPDNo: any;
    WardName: any;
    Remark: any;
    DetailGiven: any;
    OP_IP_No: any;
    OPD_IPD_ID: any;
    OPD_IPD_Type: any;
    PathReportID: any;
    AdmDocId: any;
    PathResultDr1: any;
    ServiceId: any;
    PathTestID: any;
    Adm_Visit_docId: any;
    TemplateResultInHTML: any;
    DocNameId: any;
    regId: any;
    docNameId: any;
    mobileNo: any;
    admissionTime: any;
    dischargeTime: any;
    patientTypeId: any;
    genderId: any;
    oP_IP_No: any;
    doctorName: any;
    genderName: any;
    opD_IPD_ID: any;
    opdipdtype: any;
    opdipdid: any;
    pathReportId: any;
    adm_Visit_docId: any;
    visit_Adm_ID: any;
    pathTestID: any;
    sampleCollectionTime: any;
    isSampleCollection: any;
    isTemplateTest: any;
    isDischarge: any;
    HospitalID: any;
    hospitalID: any;
    emgId: any;
    isOpToIpconv: any;
    isDischarged: any;
    isBillGenerated: any;
    admissionType: any;
    emgTime: any;
    refDoctorName: any;

    admissionDate: any;
    motherName: any;
    refByTypeId: any;
    refByName: any;
    subTpaComId: any;
    policyNo: any;
    aprovAmount: any;
    refDoctorDept: any;
    dischargeDate: any;
    addedBy: any;
    compDod: any;
    isMlc: any;
    ischarity: any;
    converId: any;
    VisAdmTime: any;
    serviceId: any;
    pathReportID: any;
    ipdNo: any
    isReimbursement: any;
    labRequestNo: any;
    /**
  * Constructor
  *
  * @param AdmissionPersonl
  */
    constructor(AdmissionPersonl) {
        {
            this.PrefixId = AdmissionPersonl.PrefixId || 0;
            this.Departmentid = AdmissionPersonl.Departmentid || 0;
            this.AadharCardNo = AdmissionPersonl.AadharCardNo || '';
            this.opD_IPD_Type = AdmissionPersonl.opD_IPD_Type || 0
            this.Address = AdmissionPersonl.Address || '';
            this.Age = AdmissionPersonl.Age || '';
            this.AgeDay = AdmissionPersonl.AgeDay || '';
            this.AgeMonth = AdmissionPersonl.AgeMonth || '';
            this.AgeYear = AdmissionPersonl.AgeYear || '';
            this.ageDay = AdmissionPersonl.ageDay || '';
            this.ageMonth = AdmissionPersonl.ageMonth || '';
            this.ageYear = AdmissionPersonl.ageYear || '';
            this.AreaId = AdmissionPersonl.AreaId || '';
            this.CityName = AdmissionPersonl.CityName || '';
            this.CityId = AdmissionPersonl.CityId || 0;
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
            this.patientName = AdmissionPersonl.patientName || '';
            this.PhoneNo = AdmissionPersonl.PhoneNo || '';
            this.phoneNo = AdmissionPersonl.phoneNo || '';
            this.PinNo = AdmissionPersonl.PinNo || '';
            this.PrefixID = AdmissionPersonl.PrefixID || '';
            this.PrefixName = AdmissionPersonl.PrefixName || '';
            this.RDate = AdmissionPersonl.RDate || '';
            this.RegDate = AdmissionPersonl.RegDate || '';
            this.RegId = AdmissionPersonl.RegId || '';
            this.RegNo = AdmissionPersonl.RegNo || '';
            this.regNo = AdmissionPersonl.regNo || '';
            this.RegNoWithPrefix = AdmissionPersonl.RegNoWithPrefix || '';
            this.RegTime = AdmissionPersonl.RegTime || '';
            this.RegTimeDate = AdmissionPersonl.RegTimeDate || '';
            this.ReligionId = AdmissionPersonl.ReligionId || '';
            this.StateId = AdmissionPersonl.StateId || '';
            this.TalukaId = AdmissionPersonl.TalukaId || '';
            this.TalukaName = AdmissionPersonl.TalukaName || '';
            this.VillageId = AdmissionPersonl.VillageId || '';
            this.VillageName = AdmissionPersonl.VillageName || '';
            this.AdmittedDoctor1ID = AdmissionPersonl.AdmittedDoctor1ID || 0;
            this.AdmittedDoctor2ID = AdmissionPersonl.AdmittedDoctor2ID || 0;
            this.RefDocName = AdmissionPersonl.RefDocName || '';
            this.RelationshipId = AdmissionPersonl.RelationshipId || 0;
            this.relationshipId = AdmissionPersonl.relationshipId || 0;
            this.AdmissionID = AdmissionPersonl.AdmissionID || 0;
            this.AdmissionDate = AdmissionPersonl.AdmissionDate || '';
            this.AdmissionTime = AdmissionPersonl.AdmissionTime || '';
            this.admissionTime = AdmissionPersonl.admissionTime || '';
            this.DoctorId = AdmissionPersonl.DoctorId || 0;
            this.RelatvieMobileNo = AdmissionPersonl.RelatvieMobileNo || '';
            this.MaritalStatusName = AdmissionPersonl.MaritalStatusName || '';
            this.IsMLC = AdmissionPersonl.IsMLC || 0;
            this.CompanyName = AdmissionPersonl.CompanyName || '';
            this.companyName = AdmissionPersonl.companyName || '';
            this.RelationshipName = AdmissionPersonl.RelationshipName || '';

            this.RefDoctorName = AdmissionPersonl.RefDoctorName || '';
            this.refDoctorName = AdmissionPersonl.refDoctorName || '';
            this.AdmittedDoctor2 = AdmissionPersonl.AdmittedDoctor2 || 0;
            this.AdmittedDoctor1 = AdmissionPersonl.AdmittedDoctor1 || 0;
            this.BedName = AdmissionPersonl.BedName || '';
            this.bedName = AdmissionPersonl.bedName || '';
            this.IPDNo = AdmissionPersonl.IPDNo || '';
            this.ipdno = AdmissionPersonl.ipdno || '';
            this.TariffName = AdmissionPersonl.TariffName || '';
            this.tariffName = AdmissionPersonl.tariffName || '';
            this.DepartmentName = AdmissionPersonl.DepartmentName || '';
            this.departmentName = AdmissionPersonl.departmentName || '';
            this.RefDoctorId = AdmissionPersonl.RefDoctorId || 0;
            this.VisitId = AdmissionPersonl.VisitId || 0;
            this.HospitalId = AdmissionPersonl.HospitalId || 0;
            this.CompanyId = AdmissionPersonl.CompanyId || 0;
            this.companyId = AdmissionPersonl.companyId || 0;
            this.patientTypeID = AdmissionPersonl.patientTypeID || 0;
            this.PatientType = AdmissionPersonl.PatientType || '';
            this.patientType = AdmissionPersonl.patientType || '';
            this.SubCompanyId = AdmissionPersonl.SubCompanyId || 0;
            this.Aadharcardno = AdmissionPersonl.Aadharcardno || ''
            this.Pancardno = AdmissionPersonl.Pancardno || '';
            this.RefDocName = AdmissionPersonl.RefDocName || '';
            this.refDocName = AdmissionPersonl.refDocName || '';
            this.RelativePhoneNo = AdmissionPersonl.RelativePhoneNo || '';
            this.DepartmentId = AdmissionPersonl.DepartmentId || 0;
            this.departmentId = AdmissionPersonl.departmentId || 0;
            this.IsOpToIPconv = AdmissionPersonl.IsOpToIPconv || 0;
            this.RelativeName = AdmissionPersonl.RelativeName || '';
            this.RelativeAddress = AdmissionPersonl.RelativeAddress || ''
            this.relativeName = AdmissionPersonl.relativeName || '';
            this.relativeAddress = AdmissionPersonl.relativeAddress || ''
            this.ClassName = AdmissionPersonl.ClassName || ''
            this.IsBillGenerated = AdmissionPersonl.IsBillGenerated || 0
            this.RoomName = AdmissionPersonl.RoomName || ''
            this.roomName = AdmissionPersonl.roomName || ''
            this.Doctorname = AdmissionPersonl.Doctorname || ''
            this.DoctorName = AdmissionPersonl.DoctorName || ''
            this.doctorname = AdmissionPersonl.doctorname || ''
            this.AdmDateTime = AdmissionPersonl.AdmDateTime || ''
            this.TariffId = AdmissionPersonl.TariffId || 0;
            this.tariffId = AdmissionPersonl.tariffId || 0;
            this.RefDocNameId = AdmissionPersonl.RefDocNameId || 0
            this.refDocNameId = AdmissionPersonl.refDocNameId || 0
            this.RefDocNameID = AdmissionPersonl.RefDocNameID || 0
            this.DocNameID = AdmissionPersonl.DocNameID || 0
            this.docNameId = AdmissionPersonl.docNameId || 0
            this.IsSeniorCitizen = AdmissionPersonl.IsSeniorCitizen || 0
            this.BedId = AdmissionPersonl.BedId || 0;
            this.bedId = AdmissionPersonl.bedId || 0;
            this.RegID = AdmissionPersonl.RegID || 0;
            this.ClassId = AdmissionPersonl.ClassId || 0
            this.ClassId = AdmissionPersonl.classId || 0
            this.RoomId = AdmissionPersonl.RoomId || 0;
            this.WardId = AdmissionPersonl.WardId || 0;
            this.wardId = AdmissionPersonl.wardId || 0;
            this.PolicyNo = AdmissionPersonl.PolicyNo || '';
            this.MemberNo = AdmissionPersonl.MemberNo || '';
            this.isReimbursement = AdmissionPersonl.isReimbursement || 0;
            this.AprovAmount = AdmissionPersonl.AprovAmount || '';
            this.CompDOD = AdmissionPersonl.CompDOD || '';
            this.IsPharClearance = AdmissionPersonl.IsPharClearance || '';
            this.IPNumber = AdmissionPersonl.IPNumber || '';
            this.EstimatedAmount = AdmissionPersonl.EstimatedAmount || '';
            this.ApprovedAmount = AdmissionPersonl.ApprovedAmount || '';
            this.HosApreAmt = AdmissionPersonl.HosApreAmt || '';
            this.PathApreAmt = AdmissionPersonl.PathApreAmt || '';
            this.PharApreAmt = AdmissionPersonl.PharApreAmt || '';
            this.RadiApreAmt = AdmissionPersonl.RadiApreAmt || '';
            this.PharDisc = AdmissionPersonl.HDiscAmt || '';

            this.ClaimNo = AdmissionPersonl.ClaimNo || '';
            this.CompBillNo = AdmissionPersonl.CompBillNo || '';
            this.CompBillDate = AdmissionPersonl.CompBillDate || '';
            this.CompDiscount = AdmissionPersonl.CompDiscount || '';
            this.CompDisDate = AdmissionPersonl.CompDisDate || '';
            this.C_BillNo = AdmissionPersonl.C_BillNo || '';
            this.C_FinalBillAmt = AdmissionPersonl.C_FinalBillAmt || '';
            this.C_DisallowedAmt = AdmissionPersonl.C_DisallowedAmt || '';
            this.HDiscAmt = AdmissionPersonl.HDiscAmt || '';
            this.C_OutsideInvestAmt = AdmissionPersonl.C_OutsideInvestAmt || '';
            this.RecoveredByPatient = AdmissionPersonl.RecoveredByPatient || '';
            this.H_ChargeAmt = AdmissionPersonl.H_ChargeAmt || '';
            this.H_AdvAmt = AdmissionPersonl.H_AdvAmt || '';
            this.H_BillId = AdmissionPersonl.H_BillId || '';
            this.H_BillDate = AdmissionPersonl.H_BillDate || '';
            this.H_BillNo = AdmissionPersonl.H_BillNo || '';
            this.H_TotalAmt = AdmissionPersonl.H_TotalAmt || '';
            this.H_DiscAmt = AdmissionPersonl.H_DiscAmt || '';
            this.H_NetAmt = AdmissionPersonl.H_NetAmt || '';
            this.H_PaidAmt = AdmissionPersonl.H_PaidAmt || '';
            this.H_BalAmt = AdmissionPersonl.H_BalAmt || '';
            this.vOPDNo = AdmissionPersonl.vOPDNo || ''
            this.TarrifName = AdmissionPersonl.TarrifName || ''
            this.WardName = AdmissionPersonl.WardName || ''
            this.OPDNo = AdmissionPersonl.OPDNo || ''
            this.Remark = AdmissionPersonl.Remark || ''
            this.DetailGiven = AdmissionPersonl.DetailGiven || ''
            this.OP_IP_No = AdmissionPersonl.OP_IP_No || ''
            this.OPD_IPD_ID = AdmissionPersonl.OPD_IPD_ID || ''
            this.OPD_IPD_Type = AdmissionPersonl.OPD_IPD_Type || ''
            this.PathReportID = AdmissionPersonl.PathReportID || 0
            this.AdmDocId = AdmissionPersonl.AdmDocId || 0
            this.PathResultDr1 = AdmissionPersonl.PathResultDr1 || 0
            this.ServiceId = AdmissionPersonl.ServiceId || 0;
            this.PathTestID = AdmissionPersonl.PathTestID || 0
            this.Adm_Visit_docId = AdmissionPersonl.Adm_Visit_docId || 0;
            this.TemplateResultInHTML = AdmissionPersonl.TemplateResultInHTML || ''
            this.DocNameId = AdmissionPersonl.DocNameId || ''
            this.regId = AdmissionPersonl.regId || 0
            this.mobileNo = AdmissionPersonl.mobileNo || ''
            this.admissionId = AdmissionPersonl.admissionId || 0
            this.dischargeTime = AdmissionPersonl.dischargeTime || ''
            this.patientTypeId = AdmissionPersonl.patientTypeId || ''

            this.genderId = AdmissionPersonl.genderId || ''
            this.oP_IP_No = AdmissionPersonl.oP_IP_No || ''
            this.doctorName = AdmissionPersonl.doctorName || ''
            this.genderName = AdmissionPersonl.genderName || ''
            this.opD_IPD_ID = AdmissionPersonl.opD_IPD_ID || ''
            this.pathReportId = AdmissionPersonl.pathReportId || ''
            this.adm_Visit_docId = AdmissionPersonl.adm_Visit_docId || ''
            this.visit_Adm_ID = AdmissionPersonl.visit_Adm_ID || ''
            this.pathTestID = AdmissionPersonl.pathTestID || ''
            this.sampleCollectionTime = AdmissionPersonl.sampleCollectionTime || ''
            this.isSampleCollection = AdmissionPersonl.isSampleCollection || ''
            this.isTemplateTest = AdmissionPersonl.isTemplateTest || ''
            this.opdipdtype = AdmissionPersonl.opdipdtype || ''
            this.opdipdid = AdmissionPersonl.opdipdid || ''
            this.isDischarge = AdmissionPersonl.isDischarge
            this.HospitalID = AdmissionPersonl.HospitalID || 1
            this.hospitalID = AdmissionPersonl.hospitalID || 1
            this.doctorId = AdmissionPersonl.doctorId || 0
            this.tariffid = AdmissionPersonl.tariffid || 0
            this.emgId = AdmissionPersonl.emgId || 0
            this.isBillGenerated = AdmissionPersonl.isBillGenerated || 0
            this.isDischarged = AdmissionPersonl.isDischarged || 0
            this.isOpToIpconv = AdmissionPersonl.isOpToIpconv || 0
            this.admissionType = AdmissionPersonl.admissionType || 0
            this.emgTime = AdmissionPersonl.emgTime || ''
            this.labRequestNo = AdmissionPersonl.labRequestNo || ''


            this.admissionDate = AdmissionPersonl.admissionDate || ''
            this.motherName = AdmissionPersonl.motherName || ''
            this.refByTypeId = AdmissionPersonl.refByTypeId || 0
            this.refByName = AdmissionPersonl.refByName || ''
            this.subTpaComId = AdmissionPersonl.subTpaComId || 0
            this.policyNo = AdmissionPersonl.policyNo || ''
            this.aprovAmount = AdmissionPersonl.aprovAmount || ''
            this.refDoctorDept = AdmissionPersonl.refDoctorDept || ''
            this.dischargeDate = AdmissionPersonl.dischargeDate || ''
            this.addedBy = AdmissionPersonl.addedBy || 0
            this.compDod = AdmissionPersonl.compDod || ''
            this.isMlc = AdmissionPersonl.isMlc || 0
            this.ischarity = AdmissionPersonl.ischarity || 0
            this.converId = AdmissionPersonl.converId || 0
            this.serviceId = AdmissionPersonl.serviceId || 0
            this.pathReportID = AdmissionPersonl.pathReportID || 0
            this.ipdNo = AdmissionPersonl.ipdNo || ''
        }
    }
}
