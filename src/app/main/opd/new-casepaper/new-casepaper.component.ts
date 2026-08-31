
import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { CasepaperService } from './casepaper.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ConfigService } from 'app/core/services/config.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { DosemasterComponent } from 'app/main/setup/prescription/dosemaster/dosemaster.component';
import { InstructionmasterComponent } from 'app/main/setup/prescription/instructionmaster/instructionmaster.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { LanguageOption, SpeechRecognitionService } from 'app/main/shared/services/speech-recognition.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { certificateTemp } from '../medicalrecord/patientcertificate/patientcertificate.component';
import { AddItemComponent } from './add-item/add-item.component';
import { MedicineTableNewComponent } from './medicine-table-new/medicine-table-new.component';
import { PrePresciptionListComponent } from './pre-presciption-list/pre-presciption-list.component';
import { PrescriptionTemplateComponent } from './prescription-template/prescription-template.component';
import { SelectionModel } from '@angular/cdk/collections';
import { SampleList } from 'app/main/pathology/result-entry/result-entry.component';
import { NewDoseMasterComponent } from 'app/main/setup/prescription/dosemaster/new-dose-master/new-dose-master.component';
import { NewInstructionMasterComponent } from 'app/main/setup/prescription/instructionmaster/new-instruction-master/new-instruction-master.component';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { AirmidChipautocompleteComponent } from 'app/main/shared/componets/airmid-chipautocomplete/airmid-chipautocomplete.component';
// import { LababnormalListComponent } from 'app/main/nursingstation/requestforlabtest/lababnormal-list/lababnormal-list.component';
// import { gridModel } from './grid.mod';
// interface Patient {
//   PHeight: string;
//   PWeight: number;
//   Pulse: string;
//   VisitDate: any; // Changed to visitDate for clarity
// }

@Component({
    selector: 'app-new-casepaper',
    templateUrl: './new-casepaper.component.html',
    styleUrls: ['./new-casepaper.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewCasepaperComponent implements OnInit {
    mycertificateForm: FormGroup;
    private recognition: any = null;
    isListening = false;
    selectedLang = 'en-US';
    languages: LanguageOption[] = [];

    displayedItemColumn: string[] = [
        'ItemName',
        'ItemGenericName',
        'DoseName',
        'Days',
        'Remark',
        'Action',
        'Add'
    ]
    displayedpreviousColumn: string[] = [
        'ItemName',
        'DoseName',
        'Days',
        'Remark'
    ]
    currentDate = new Date();
    caseFormGroup: FormGroup;
    searchFormGroup: FormGroup;
    casePaperInsertForm: FormGroup;
    MedicineItemForm: FormGroup;
    ItemForm: FormGroup;
    CompanyName: any;
    Tarrifname: any;
    Doctorname: any;
    vOPIPId: any = 0;
    vOPDNo: any = 0;
    vClassId: any = 0;
    CompanyId: any = 0;
    AgeYear: any = 0;
    RegNo: any = 0;
    RegId: any;
    PatientName: any;
    VisitDate: any;
    DepartmentName: any;
    AgeMonth: any;
    AgeDay: any;
    GenderName: any;
    RefDocName: any;
    add: boolean = false;
    ItemName: any;
    ItemId: any;
    vDay: any;
    vDayInput: any
    vInstruction: any;
    Chargelist: any[] = [];  // changed here for onAdd purpose
    PatientType: any;
    vHeight: any;
    vWeight: any;
    vBSL: any;
    vBMI: any;
    vBP: any;
    VisitId: any;
    vTemp: any;
    vSpO2: any;
    vPulse: any;
    screenFromString = 'OPDEMR';
    vChiefComplaint: any;
    vDiagnosis: any;
    vExamination: any;
    doseList: any = [];
    dateTimeObj: any;
    vMobileNo: any = 0;
    doseresults: any[] = [];
    patientDetail: any;
    patientDetail1: any;
    savebtn: boolean = true;
    regObj = new CasepaperVisitDetails({});
    vItemGenericName: any;
    vItemGenericNameId: any;
    selectable = true;
    removable = true;
    ConsultantDocId: any;
    PrefollowUpDate: string;
    RtrvDescriptionList: any = [];
    HistoryList: any = [];
    addCheiflist: any[] = [];
    addDiagnolist: any = [];
    addExaminlist: any = [];
    doseId = 0
    doseName = ""
    durgId = 0
    durgName = ""
    templateId = 0
    templateName = ""
    itemObjects: any;
    itemGeneric: any;
    vdoseName: any;
    AllTypeDescription: any = []
    filteredCheifComplaint: Observable<string[]>
    vDays: any = 0;
    followUpDate: string;
    specificDate: Date;
    dateStyle: string;
    vDrugName: any;
    vDoseName: any;
    vItemGN: any;
    vDayys: any;
    vInst: any;
    vPrescriptionId: any;
    visitIdRefresh: any;
    selectedOption: string = 'Day';
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    GenericNameEditable: boolean = false;
    editingIndex1: number | null = null;
    GenericoriginalValue: string | null = null;
    editingIndex: number | null = null;
    originalValue: string | null = null;
    attachments: any[] = [];
    selectedFile: File | null = null;
    previewUrl: string | null = null;
    vTariffId: any;
    vhistoryofillness: any;
    departmentId: any = 0;
    doctorId: any = 0
    departmentName = ''
    vIcdcode = ''
    displayedColumns: string[] = ['CertificateDate', 'CertificateName', 'CertificateText', 'Action'];

    displayedColumns1: string[] = [
        'CertificateDate',
        'CertificateName',
        'CertificateText',
        'doctorName',
        'Action',
    ]

    onBlur(e: any) {
        this.vcertificateText = e.target.innerHTML;
        throw new Error('Method not implemented.');
    }

    dsItemList = new MatTableDataSource<MedicineItemList>();
    dsCopyItemList = new MatTableDataSource<MedicineItemList>();
    public dsResultViewList = new MatTableDataSource<MedicineItemList>();
    public dsResultViewList1 = new MatTableDataSource<MedicineItemList>();

    autocompleteModeItem: string = "Item"; //ItemType
    autocompleteModeItemGeneric: string = "ItemGeneric";
    autocompleteModeDose: string = "DoseMaster";
    autocompleteModeInstr: string = "InstructionMaster";
    autocompleteModeTemplate: string = "PrescriptionTemplateMaster";
    autocompleteModeServcie: string = "Service"; //ServiceName
    autocompleteModeDoctor: string = "ConDoctor";
    autocompleteModeDiagnosis: string = "CasepaperDignosis";
    autocompletedepartment: string = "Department";
    vstoreId = this._loggedService.currentUserValue.user.storeId;

    @ViewChild('ddlDiagnosis') ddlDiagnosis: AirmidDropDownComponent;
    @ViewChild('ddlChiefComplaint') ddlChiefComplaint: AirmidDropDownComponent;
    @ViewChild('chiefComplaintInput') chiefComplaintInput: AirmidChipautocompleteComponent;
    @ViewChild('AssignDiagnosis') AssignDiagnosis: AirmidChipautocompleteComponent;
    @ViewChild('AssignExamination') AssignExamination: AirmidChipautocompleteComponent;
    @ViewChild('ddlExamination') ddlExamination: AirmidDropDownComponent;
    @ViewChild('ddlService') ddlService: AirmidDropDownComponent;
    @ViewChild('ddlService1') ddlService1: AirmidDropDownComponent;
    @ViewChild('ddlService2') ddlService2: AirmidDropDownComponent;
    @ViewChild('medicineTableRef') medicineTableRef: MedicineTableNewComponent;
    @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

   

    BloodGroupNames: string[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    constructor(
        private _CasepaperService: CasepaperService,
        private _formBuilder: UntypedFormBuilder,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        private _loggedService: AuthenticationService,
        public datePipe: DatePipe,
        public dialogRef: MatDialogRef<NewCasepaperComponent>,
        public _WhatsAppEmailService: WhatsAppEmailService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private commonService: PrintserviceService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public speechService: SpeechRecognitionService,
        public _ConfigService: ConfigService,
    ) {

        const rawValue = this?._ConfigService?.configParams?.FollowUpdateSet || "";
        const [id, FollowUpdateSet] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
        if (id == "1" && FollowUpdateSet) {
            this.vDayInput = FollowUpdateSet
            this.vDays = FollowUpdateSet
        }

        if (this.vDays == 0) {
            const access = this._ConfigService.userAccessParam.find(x => x.AccessValueName === 'FollowUpDateSet');

            this.vDayInput = access?.AccessInputValue || this.vDays
            this.vDays = access?.AccessInputValue || this.vDays

            console.log(this.vDays);

        }

    }

    ngOnInit(): void {
        //Common language list
        this.languages = this.speechService.supportedLanguages;

        this.searchFormGroup = this.createSearchForm();

        this.caseFormGroup = this.createForm();
        this.caseFormGroup.markAllAsTouched();

        this.casePaperInsertForm = this.createCasePaperForm();
        this.casePaperInsertForm.markAllAsTouched();

        // loop array defined
        this.tPrescriptionArray.push(this.createtPrescription());
        this.topRequestListArray.push(this.createtopRequestList());
        this.mopCasepaperDignosisArray.push(this.createmopCasepaperDignosis());

        this.mycertificateForm = this.CreatePatientCertiform();
        this.mycertificateForm.markAllAsTouched()

        this.MedicineItemform();
        this.specificDate = new Date();
        this.dateStyle = 'Day'
        this.onDaysChange();

        if (this.data) {
            this.regObj = this.data
            console.log(this.data)
            this.RegNo = this.regObj.regNoWithPrefix
            this.vOPIPId = this.regObj.visitId
            this.VisitId = this.regObj.visitId
            this.RegId = this.regObj.regId
            this.PatientName = this.regObj.patientName
            this.Doctorname = this.regObj.doctorname
            this.vOPDNo = this.regObj.opdNo
            this.AgeYear = this.regObj.ageYear
            this.AgeMonth = this.regObj.ageMonth
            this.AgeDay = this.regObj.ageDay
            this.GenderName = this.regObj.GenderName
            this.DepartmentName = this.regObj.departmentName
            this.PatientType = this.regObj.patientType
            this.Tarrifname = this.regObj.tariffName
            this.CompanyName = this.regObj.companyName
            this.RefDocName = this.regObj.refDocName
            this.vClassId = this.regObj.classId
            this.vTariffId = this.regObj.tariffId
            this.getPrescription(this.regObj);
            this.getnewVisistListDemo(this.regObj);
            this.getCertificateHistoryTab(this.regObj);
            this.getPrevVisitDiagnosisList(this.regObj);
            this.getRtrvTestServiceList(this.regObj);  //retrive list
            this.getRtrvCheifComplaintList(this.regObj); // retrive list
            // this.getCheifComplaintList();
            this.getCertificateList();
            // this.getLabdata();
            if (this.data.emrReady > 0) {
                this.calculateDays(this.regObj);
            }


        }
        debugger
        // if (this.data.emrReady == 0) {

        //     this.MedicineItemForm.get('departmentId').setValue(this.regObj.departmentId)
        //     if (this.regObj.departmentId) {
        //         this.departmentId = this.regObj.departmentId
        //         this.doctorId = this.regObj.doctorId
        //         setTimeout(() => {
        //             this._CasepaperService.getDoctorsByDepartment(this.regObj.departmentId).subscribe((data: any) => {
        //                 this.ddlDoctor.options = data;
        //                 console.log(data)

        //                 this.ddlDoctor.bindGridAutoComplete();

        //             });
        //         }, 500);
        //     }
        //     this.MedicineItemForm.get('DoctorID')?.setValue(this.regObj.doctorId);
        // }

        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.error('Speech recognition is not supported in this browser.');
            return;
        }

        this.recognition = new SpeechRecognition();

        this.recognition.continuous = true;
        this.recognition.interimResults = false;
        this.recognition.lang = this.selectedLang || 'en-US';

        // Microphone started
        this.recognition.onstart = () => {
            console.log('MIC ON');
            this.isListening = true;
        };

        // Speech result
        this.recognition.onresult = (event: any) => {

            let text = '';

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {
                if (event.results[i].isFinal) {
                    text += event.results[i][0].transcript;
                }
            }

            if (text.trim()) {

                const control = this.caseFormGroup.get('historyOfIllness');

                if (control) {
                    const currentText = control.value || '';

                    const updatedText = currentText
                        ? currentText + ' ' + text.trim()
                        : text.trim();

                    control.setValue(updatedText);
                }

                console.log('Recognized:', text);
            }
        };

        // Microphone stopped
        this.recognition.onend = () => {
            console.log('MIC OFF');
            this.isListening = false;
        };

        // Error
        this.recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
        };

        this.loadGridDataForVisit(this.VisitId);
    }
    calculateDays(regObj) {

        const today = new Date();

        const [day, month, year] = regObj.followupDate.split('/').map(Number);
        const followUp = new Date(year, month - 1, day);

        today.setHours(0, 0, 0, 0);
        followUp.setHours(0, 0, 0, 0);

        const diff = followUp.getTime() - today.getTime();

        this.vDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    }


    // showing color for vitals
    getVitalColorClass(vital: string, value: any): string {
        const num = parseFloat(value);
        switch (vital) {
            case 'BMI':
                if (num < 18.5) return 'orange'; // Yellow
                if (num <= 24.9) return 'green'; // Green
                return 'red'; // Red

            case 'SpO2':
                return num < 95 ? 'orange' : 'green';

            case 'Pulse':
                if (num < 60) return 'orange';
                if (num <= 100) return 'green';
                return 'red';

            case 'BP':
                if (!value || typeof value !== 'string' || !value.includes('/')) return '';
                const [sys, dia] = value.split('/').map(Number);
                if (sys < 90 || dia < 60) return 'orange';
                if (sys > 120 || dia > 80) return 'red';
                return 'green';

            case 'Temp':
                if (num < 97) return 'orange';
                if (num <= 99) return 'green';
                return 'red';

            default:
                return '';
        }
    }

    onLangChange() {
        if (this.speechService.isListening) {
            this.speechService.stopRecognition();
        }
    }
    onMicToggle() {
        // console.log(this.selectedLang);
        this.speechService.toggleRecognition(this.selectedLang, (text: string) => {
            const currentText = this.MedicineItemForm.get('Remark')?.value || '';
            const updated = currentText ? `${currentText} ${text}` : text;
            this.MedicineItemForm.get('Remark')?.setValue(updated);
        });
    }

    private initSpeechRecognition() {

        this.recognition.onstart = () => {
            this.isListening = true;
        };

        this.recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            this.isListening = false;
        };

        this.recognition.onend = () => {
            this.isListening = false;
        };
    }

    onMicToggle1() {

        if (!this.recognition) {
            console.error('Speech recognition not initialized');
            return;
        }

        if (this.isListening) {
            // OFF
            console.log('Stopping microphone...');
            this.recognition.stop();
        } else {
            // ON
            console.log('Starting microphone...');

            this.recognition.lang = this.selectedLang || 'en-US';

            try {
                this.recognition.start();
            } catch (error) {
                console.error('Could not start microphone:', error);
            }
        }

        this.speechService.toggleRecognition(this.selectedLang, (text: string) => {
            const currentText = this.caseFormGroup.get('historyOfIllness')?.value || '';
            const updated = currentText ? `${currentText} ${text}` : text;
            this.caseFormGroup.get('historyOfIllness')?.setValue(updated);
        });

        // if (this.isListening) {
        //     this.stopListening();
        // } else {
        //     this.startListening();
        // }
    }

    private startListening(): void {
        try {
            this.recognition.start();
            this.isListening = true;
        } catch (e) {
            console.warn(e);
        }
    }

    private stopListening(): void {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
        this.isListening = false;
    }


    onFileSelected(event: any) {
        this.selectedFile = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            this.previewUrl = reader.result as string;
        };
        reader.readAsDataURL(this.selectedFile!);
    }

    upload() {
        if (this.selectedFile) {
            this.attachments.push({ name: this.selectedFile.name, file: this.selectedFile });
            this.selectedFile = null;
            this.previewUrl = null;
        }
    }

    removeService(item) {
        const removedIndex = this.caseFormGroup.value.mAssignService.findIndex(x => x.serviceId === item.serviceId);
        if (removedIndex !== -1) {
            this.caseFormGroup.value.mAssignService.splice(removedIndex, 1);

            this.ddlService.SetSelection(this.caseFormGroup.value.mAssignService.map(x => x.serviceId));

            this.selectedItems = this.caseFormGroup.value.mAssignService.map(x => ({ serviceId: x.serviceId }));
        }
    }

    removeService1(item) {
        const removedIndex = this.caseFormGroup.value.mAssignService1.findIndex(x => x.serviceId === item.serviceId);
        if (removedIndex !== -1) {
            this.caseFormGroup.value.mAssignService1.splice(removedIndex, 1);

            this.ddlService1.SetSelection(this.caseFormGroup.value.mAssignService1.map(x => x.serviceId));

            this.selectedItems1 = this.caseFormGroup.value.mAssignService1.map(x => ({ serviceId: x.serviceId }));
        }
    }

    removeService2(item) {
        const removedIndex = this.caseFormGroup.value.mAssignService2.findIndex(x => x.serviceId === item.serviceId);
        if (removedIndex !== -1) {
            this.caseFormGroup.value.mAssignService2.splice(removedIndex, 1);

            this.ddlService2.SetSelection(this.caseFormGroup.value.mAssignService2.map(x => x.serviceId));

            this.selectedItems2 = this.caseFormGroup.value.mAssignService2.map(x => ({ serviceId: x.serviceId }));
        }
    }

    onDaysChange() {
        const today = new Date();
        const followUp = new Date(today);

        if (!this.vDays || isNaN(this.vDays) || parseInt(this.vDays) <= 0) {
            this.MedicineItemForm.get('start')?.setValue(today);
            return;
        }

        const value = parseInt(this.vDays);

        if (this.dateStyle === 'Day') {
            followUp.setDate(today.getDate() + value);
        } else if (this.dateStyle === 'Month') {
            followUp.setMonth(today.getMonth() + value);
        } else if (this.dateStyle === 'Year') {
            followUp.setFullYear(today.getFullYear() + value);
        }

        this.specificDate = followUp;
        this.MedicineItemForm.get('start')?.setValue(followUp);
    }

    OnChangeDobType(e) {
        this.dateStyle = e.value;
        this.onDaysChange();
    }

    CreatePatientCertiform() {
        return this._formBuilder.group({
            certificateId: [0],
            certificateDate: [new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).toISOString()],
            certificateTime: [(new Date()).toISOString()],
            visitId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            CertificateTemplateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            certificateName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            certificateText: ['', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
            Language: ['1'],
        })
    }

    createForm() {
        return this._formBuilder.group({
            LetteHeadRadio: ['NormalHead'],
            LangaugeRadio: ["true"],
            Height: ['', [Validators.maxLength(20)]],
            Weight: ['', [Validators.maxLength(20)]],
            BMI: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
            BSL: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
            SpO2: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
            Pulse: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
            BP: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
            Temp: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
            BloodGroup: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(3)]],
            Allergies: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(50)]],
            ChiefComplaint: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            serviceId: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            Diagnosis: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            Examination: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            ExaminationControl: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            DiagnosisControl: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            CheifComplaintControl: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            mAssignChiefComplaint: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
            mAssignDiagnosis: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
            mAssignExamination: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
            mAssignService: ['', [this._FormvalidationserviceService.allowEmptyStringValidator]],
            mAssignService1: ['', [this._FormvalidationserviceService.allowEmptyStringValidator]],
            mAssignService2: ['', [this._FormvalidationserviceService.allowEmptyStringValidator]],
            historyOfIllness: ['']
        });
    }

    MedicineItemform() {
        this.MedicineItemForm = this._formBuilder.group({
            ItemId: [0, [Validators.required]],
            DoseId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            DoseId1: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            Day: ['', [Validators.required, Validators.pattern("^^[1-9]+[0-9]*$")]],
            ItemGenericNameId: '',
            Instruction: ['', [Validators.maxLength(200)]],
            DoctorID: [this.doctorId],
            departmentId: [this.departmentId],
            FollowupDays: '',
            start: [new Date()],
            Remark: ['', [Validators.maxLength(200)]],
            Days: this.vDayInput,// [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: '',
            FollowupMonths: '',
            FollowupYears: '',
            dateStylebtn: ['Day'],
            TemplateId: ['']
        });
    }

    createCasePaperForm() {
        return this._formBuilder.group({
            tPrescription: this._formBuilder.array([]),
            visitDetails: this._formBuilder.group({
                visitId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                followupDate: ['']
            }),
            topRequestList: this._formBuilder.array([]),
            mopCasepaperDignosisMaster: this._formBuilder.array([]),
        });
    }

    createtPrescription(element: any = {}): FormGroup {
        return this._formBuilder.group({
            opdIpdIp: [this.vOPIPId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdIpdType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            date: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
            ptime: [this.datePipe.transform(new Date(), 'h:mm:ss a')],
            classId: [this.vClassId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            genericId: [element.GenericId ?? element.genericId ?? element.genericid ?? 0],
            drugId: [element.DrugId ?? element.drugId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            doseId: [Number(element.DoseId ?? element.doseId ?? 0), [this._FormvalidationserviceService.onlyNumberValidator()]],
            days: [element.Days ?? element.days ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            instruction: [element.instruction ?? element.instructionDescription ?? ''],
            remark: [element.remark ?? element.Remark ?? ''],
            doseOption2: [0],
            daysOption2: [0],
            doseOption3: [0],
            daysOption3: [0],
            instructionId: [element.instructionId || element.InstructionId || 0],
            qtyPerDay: [Math.round(element.QtyPerDay ?? element.qtyPerDay ?? 0)],
            totalQty: [element?.totalQty || element?.TotalQty || 0 //Math.round(element.QtyPerDay * element.Days) || Math.round(element.qtyPerDay * element.days) || 0,
            [this._FormvalidationserviceService.onlyNumberValidator()]],
            isClosed: false,
            isEnglishOrIsMarathi: [true],
            chiefComplaint: [element.chiefComplaint ?? element.ChiefComplaint ?? ''],
            diagnosis: [element.diagnosis ?? ''],
            examination: [element.examination ?? ''],
            height: [element.pHeight ?? element.PHeight ?? ''],
            pweight: [element.pWeight ?? element.PWeight ?? ''],
            bmi: [element.bmi ?? element.BMI ?? ''],
            bsl: [element.bsl ?? element.BSL ?? ''],
            spO2: [element.spO2 ?? element.SPO2 ?? ''],
            temp: [element.temp ?? element.PWeight ?? ''],
            pulse: [element.pulse ?? element.Pulse ?? ''],
            bp: [element.bp ?? element.BP ?? ''],
            storeId: [this._loggedService.currentUserValue.user.storeId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            patientReferDocId: [element.patientReferDocId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            departmentId: [element.departmentId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            advice: [element.advice ?? element.Remark ?? ''],
            isAddBy: [this._loggedService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            allergy: [element.allergy ?? ''],
            bloodGroup: [element.bloodGroup ?? ''],
            historyOfIllness: [element.historyOfIllness ?? '']
        });
    }

    createtopRequestList(element: any = {}): FormGroup {
        return this._formBuilder.group({
            opIpId: [this.vOPIPId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [element.serviceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }
    createmopCasepaperDignosis(element: any = {}): FormGroup {
        return this._formBuilder.group({
            visitId: [this.VisitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            descriptionType: [element.descriptionType ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            descriptionName: [element.descriptionName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            icdcode: [element.icdcode ?? ''],
            diagnosisName: [element.diagnosisName ?? '']
        });
    }
    // 5.FormArray Getters
    get tPrescriptionArray(): FormArray {
        return this.casePaperInsertForm.get('tPrescription') as FormArray;
    }

    get topRequestListArray(): FormArray {
        return this.casePaperInsertForm.get('topRequestList') as FormArray;
    }

    get mopCasepaperDignosisArray(): FormArray {
        return this.casePaperInsertForm.get('mopCasepaperDignosisMaster') as FormArray;
    }

    createSearchForm() {
        return this._formBuilder.group({
            regRadio: ['registration'],
            regRadio1: ['registration1'],
            RegId: [''],
        });
    }

    onSave() {

        if (this.addCheiflist.length > 0) {
            this.addCheiflist.forEach(element => {
                this.AllTypeDescription.push({
                    descriptionName: element.descriptionName,
                    descriptionType: "Complaint"
                });
            });
        }

        if (this.addDiagnolist.length > 0) {
            this.addDiagnolist.forEach(element => {

                debugger
                this.AllTypeDescription.push({
                    descriptionName: element.descriptionName || element.icdCodeWithDignosis,
                    descriptionType: "Diagnosis",
                    icdcode: element.icdcode || '',
                    diagnosisName: element.diagnosisName,
                });
            });
        }

        if (this.addExaminlist.length > 0) {
            this.addExaminlist.forEach(element => {
                this.AllTypeDescription.push({
                    descriptionName: element.descriptionName,
                    descriptionType: "Examination"
                });
            });
        }
        // console.log("Updated AllTypeDescription:", this.AllTypeDescription);

        let ReferDocNameID = 0;
        if (this.MedicineItemForm.get('DoctorID').value) {
            ReferDocNameID = this.MedicineItemForm.get('DoctorID').value;
        } else {
            ReferDocNameID = 0
        }
        // debugger

        if (!this.caseFormGroup.invalid && !this.casePaperInsertForm.invalid) {
            this.tPrescriptionArray.clear();

            // First group from caseFormGroup
            const caseFormData = {
                pHeight: this.caseFormGroup.get('Height')?.value,
                pWeight: this.caseFormGroup.get('Weight')?.value,
                bmi: String(this.caseFormGroup.get('BMI')?.value),
                bsl: this.caseFormGroup.get('BSL')?.value,
                spO2: this.caseFormGroup.get('SpO2')?.value,
                temp: this.caseFormGroup.get('Temp')?.value,
                pulse: this.caseFormGroup.get('Pulse')?.value,
                bp: this.caseFormGroup.get('BP')?.value,
                allergy: this.caseFormGroup.get('Allergies')?.value,
                bloodGroup: this.caseFormGroup.get('BloodGroup')?.value,
                remark: this.MedicineItemForm.get('Remark')?.value,
                chiefComplaint: this.caseFormGroup.get('ChiefComplaint')?.value,
                diagnosis: this.caseFormGroup.get('Diagnosis')?.value,
                examination: this.caseFormGroup.get('Examination')?.value,
                advice: this.MedicineItemForm.get('Remark')?.value,
                isEnglishOrIsMarathi: JSON.parse(this.caseFormGroup.get('LangaugeRadio')?.value),
                patientReferDocId: Number(ReferDocNameID),
                departmentId: this.departmentId,//this.MedicineItemForm.get('departmentId')?.value,
                historyOfIllness: this.caseFormGroup.get('historyOfIllness')?.value,
            };

            if (this.dsItemList.data.length === 0) {
                this.tPrescriptionArray.push(this.createtPrescription(caseFormData));
            } else {
                this.dsItemList.data.forEach(item => {
                    const combined = { ...item, ...caseFormData };
                    this.tPrescriptionArray.push(this.createtPrescription(combined));
                });
            }

            // 2nd detail
            this.topRequestListArray.clear();
            debugger
            const combinedItems = [...this.selectedItems, ...this.selectedItems1, ...this.selectedItems2];

            if (combinedItems.length === 0) {
                this.topRequestListArray.push(
                    this.createtopRequestList({ serviceId: 0 })
                );
            } else {
                combinedItems.forEach(item => {
                    this.topRequestListArray.push(
                        this.createtopRequestList(item)
                    );
                });
            }

            // this.topRequestListArray.clear();
            // if (this.selectedItems.length === 0) {
            //     const opRequestListFormGroup: FormGroup = this.createtopRequestList({ serviceId: 0 });
            //     this.topRequestListArray.push(opRequestListFormGroup);
            // } else {
            //     this.selectedItems.forEach(element => {
            //         const opRequestListFormGroup: FormGroup = this.createtopRequestList(element);
            //         this.topRequestListArray.push(opRequestListFormGroup);
            //     });
            // }

            // 3rd detail array
            this.mopCasepaperDignosisArray.clear();
            if (this.AllTypeDescription.length === 0) {
                const mopCasePaperFormGroup: FormGroup = this.createmopCasepaperDignosis({ visitId: 0 });
                this.mopCasepaperDignosisArray.push(mopCasePaperFormGroup);
            } else {
                this.AllTypeDescription.forEach(element => {
                    const mopCasePaperFormGroup: FormGroup = this.createmopCasepaperDignosis(element);
                    this.mopCasepaperDignosisArray.push(mopCasePaperFormGroup);
                });
            }
            this.casePaperInsertForm.get(['visitDetails', 'visitId'])?.setValue(this.vOPIPId);
            this.casePaperInsertForm.get(['visitDetails', 'followupDate'])?.setValue(this.MedicineItemForm.get('start')?.value);
            console.log('form:', this.casePaperInsertForm.value)
            this._CasepaperService.onSaveCasepaper(this.casePaperInsertForm.value).subscribe(response => {
                // if (this.caseFormGroup.get("LetteHeadRadio").value == 'LetterHead')
                //   this.commonService.Onprint("VisitId", this.VisitId, "OPPrescriptionA5");
                // else
                //   this.commonService.Onprint("VisitId", this.VisitId, "OPPrescriptionwithoutHeaderA5");


                // if (this.caseFormGroup.get("LetteHeadRadio").value == 'LetterHead')
                //   this.OnViewReportWithHeaderPdf(this.VisitId)
                // else
                //   this.OnViewReportWithoutHeaderPdf(this.VisitId)

                const [PrescriptionA5_Print, Prescription_Print] = this._ConfigService.configParams.OPEmrPrescriptionA5.split(":");
                if (response) {
                    if (PrescriptionA5_Print != 1) {
                        if (this.caseFormGroup.get("LetteHeadRadio").value == 'LetterHead')
                            this.OnViewReportWithHeaderPdf(this.VisitId)
                        else
                            this.OnViewReportWithoutHeaderPdf(this.VisitId)
                    } else {
                        if (this.caseFormGroup.get("LetteHeadRadio").value == 'LetterHead')
                            this.OnViewReportWithHeaderA5Pdf(this.VisitId)
                        else
                            this.OnViewReportWithoutHeaderA5Pdf(this.VisitId)
                    }
                } else {
                    this.toastr.warning("Please check your network connection and try again.");
                }

                this.getWhatsappshareSales(this.vOPIPId, this.vMobileNo)
                this.onClear();
                this.onClose();
            });
        } else {
            const invalidFields: string[] = [];
            if (this.caseFormGroup.invalid) {
                for (const controlName in this.caseFormGroup.controls) {
                    if (this.caseFormGroup.controls[controlName].invalid) {
                        invalidFields.push(`My Form: ${controlName}`);
                    }
                }
            }

            // checks nested error 
            if (this.casePaperInsertForm.invalid) {
                for (const controlName in this.casePaperInsertForm.controls) {
                    const control = this.casePaperInsertForm.get(controlName);

                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`Nested : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`MainForm: ${controlName}`);
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

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    getSelectedObj(obj) {
        this.onClear();
        if ((obj.regId ?? 0) > 0) {
            this.vOPIPId = obj.visitId
            this.RegNo = obj.visitId
            setTimeout(() => {
                this._CasepaperService.getRegistraionById(obj.regId).subscribe((response) => {
                    this.patientDetail = response;
                    this.savebtn = false
                    this.PatientName = this.patientDetail.firstName + " " + this.patientDetail.middleName + " " + this.patientDetail.lastName
                });
            }, 500);

            setTimeout(() => {
                this._CasepaperService.getVisitById(this.vOPIPId).subscribe(data => {
                    this.patientDetail1 = data;
                });
            }, 1000);
        }
        this.getPrescription(obj);
        this.getnewVisistListDemo(obj);
        this.getCertificateHistoryTab(obj);
        this.getPrevVisitDiagnosisList(obj);
        // this.getVitalInfo(obj);
        this.getRtrvTestServiceList(obj); // retrive list
        this.getRtrvCheifComplaintList(obj); // retrive list
    }

    getPrescription(obj) {
        this.visitIdRefresh = obj.visitId;

        const m_data2 = {
            first: 0,
            rows: 10,
            sortField: "VisitId",
            sortOrder: 0,
            filters: [
                {
                    fieldName: "VisitId",
                    fieldValue: String(obj.visitId),
                    opType: "Equals"
                }
            ],
            Columns: [],
            exportType: "JSON"
        };

        this._CasepaperService.RtrvPreviousprescriptionDetailsdemo(m_data2).subscribe(Visit => {
            const allItems = Visit?.data as MedicineItemList[] || [];
            console.log(allItems)
            // 
            if (allItems.length > 0 && allItems[0].precriptionId) {
                const firstItem = allItems[0];

                const current = this.caseFormGroup.value;
                this.caseFormGroup.patchValue({
                    Height: current.Height || firstItem.pHeight,
                    Weight: current.Weight || firstItem.pWeight,
                    BMI: current.BMI || firstItem.bmi,
                    BSL: current.BSL || firstItem.bsl,
                    SpO2: current.SpO2 || firstItem.spO2,
                    Pulse: current.Pulse || firstItem.pulse,
                    BP: current.BP || firstItem.bp,
                    Temp: current.Temp || firstItem.temp,
                    Allergies: current.Allergies || firstItem.allergy,
                    BloodGroup: current.BloodGroup || firstItem.bloodGroup,
                    historyOfIllness: current.historyOfIllness || firstItem.historyOfIllness
                });
                this.vhistoryofillness = firstItem.historyOfIllness
                this.vChiefComplaint = firstItem.chiefComplaint;
                this.vDiagnosis = firstItem.diagnosis;
                this.vExamination = firstItem.examination;
                this.PrefollowUpDate = this.datePipe.transform(firstItem.followupDate, 'MM/dd/YYYY');
                this.MedicineItemForm.get('start')?.setValue(new Date(this.PrefollowUpDate));
                this.MedicineItemForm.get('Remark')?.setValue(firstItem.advice);
                this.RefDocName = firstItem.doctorname;
                this.departmentId = firstItem.departmentId
                this.doctorId = firstItem.patientReferDocId
                this.MedicineItemForm.get('departmentId').setValue(firstItem.departmentId)
                if (firstItem.departmentId) {

                    setTimeout(() => {
                        this._CasepaperService.getDoctorsByDepartment(firstItem.departmentId).subscribe((data: any) => {
                            this.ddlDoctor.options = data;
                            console.log(data)
                            debugger
                            this.ddlDoctor.bindGridAutoComplete();

                        });
                    }, 500);
                }
                this.MedicineItemForm.get('DoctorID')?.setValue(firstItem.patientReferDocId);

                this.vDrugName = firstItem.drugName;
                this.vDoseName = firstItem.doseName;
                this.vItemGN = firstItem.genericName;
                this.vDayys = firstItem.days;
                this.vInst = firstItem.instruction;

                const filteredItems = allItems.filter(item => item.drugId !== 0);
                this.dsItemList.data = filteredItems;
                this.Chargelist = filteredItems;
                this.syncMedicineTableData();
            } else {
                this._CasepaperService.getVisitById(this.visitIdRefresh).subscribe(data => {
                    const current = this.caseFormGroup.value;
                    this.caseFormGroup.patchValue({
                        Height: current.Height || data.height,
                        Weight: current.Weight || data.pweight,
                        BMI: current.BMI || data.bmi,
                        BSL: current.BSL || data.bsl,
                        SpO2: current.SpO2 || data.spO2,
                        Pulse: current.Pulse || data.pulse,
                        BP: current.BP || data.bp,
                        Temp: current.Temp || data.temp,
                        Allergies: current.Allergies || data.allergy,
                        BloodGroup: current.BloodGroup || data.bloodGroup
                    });
                });
            }
        });
    }

    getRtrvCheifComplaintList(obj) {
        this.addCheiflist = [];
        this.addDiagnolist = [];
        this.addExaminlist = [];
        this.AllTypeDescription = [];

        const vdata = {
            "first": 0,
            "rows": 9999,
            "sortField": "VisitId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "VisitId", "fieldValue": String(obj.visitId), "opType": "Equals" }
            ],
            "Columns": [],
            "exportType": "JSON"
        };

        this._CasepaperService.getRtrvCheifComplaintList1(vdata).subscribe(response => {

            if (response && Array.isArray(response.data)) {
                this.RtrvDescriptionList = response.data;
                const ChiefComplaint = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Complaint');
                this.addCheiflist = [];
                if (ChiefComplaint.length > 0) {
                    ChiefComplaint.forEach(element => {
                        this.addCheiflist.push(
                            {
                                id: element.id,
                                descriptionName: element.descriptionName,
                            }
                        )
                    })
                    this.caseFormGroup.get('mAssignChiefComplaint').setValue(this.addCheiflist);
                }
                // Process Diagnosis
                const Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Diagnosis');
                if (Diagnosis.length > 0) {
                    Diagnosis.forEach(element => {
                        debugger
                        console.log(element)
                        this.addDiagnolist.push(
                            {
                                id: element.id,
                                descriptionName: element.descriptionName,
                                icdcode: element.icdcode || '',
                                diagnosisName: element.diagnosisName || element.descriptionName,
                                icdCodeWithDignosis: element.descriptionName

                            }
                        )
                    })
                    this.caseFormGroup.get('mAssignDiagnosis').setValue(this.addDiagnolist);
                }
                // Process Examination
                const Examination = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Examination');
                if (Examination.length > 0) {
                    Examination.forEach(element => {
                        this.addExaminlist.push(
                            {
                                id: element.id,
                                descriptionName: element.descriptionName
                            }
                        )
                    });
                    this.caseFormGroup.get('mAssignExamination').setValue(this.addExaminlist);
                }
            }
        }, error => {
            console.error("Error fetching Chief Complaints:", error);
        });

    }

    getBMIcalculation() {
        const height = this.caseFormGroup.get('Height')?.value;
        const weight = this.caseFormGroup.get('Weight')?.value;

        if (height > 0 && weight > 0) {
            const heightInMeters = height / 100;
            const bmi = weight / (heightInMeters * heightInMeters);
            this.caseFormGroup.get('BMI')?.setValue(Math.round(bmi));

        } else {
            this.caseFormGroup.get('BMI')?.setValue(0);
            // this.toastr.warning('Please enter valid height (above 30 cm) and weight.');
        }
    }

    @ViewChild('Day') dayField!: ElementRef;
    @ViewChild('doseDropdown', { read: ElementRef }) doseDropdown!: ElementRef;
    @ViewChild('Instruction') instructionField!: ElementRef;
    selectChangeItemName(row) {
        this.durgId = row.itemId
        this.durgName = row.itemName
        this.vdoseName = row.doseName
        const doseControl = this.vdoseName //used for focus purpose
        this.vDay = row.doseDay
        const dayControl = this.vDay //used for focus purpose
        this.vInstruction = row.instruction
        this.MedicineItemForm.get('DoseId').setValue(this.vdoseName)

        if (this.vdoseName) {
            const doseRow = {
                value: this.vdoseName,   // assuming doseName is used as ID
                text: this.vdoseName     // or whatever label you're using
            };
            this.selectChangeDoseName(doseRow);
        }
        if ((this.durgId ?? 0) > 0) {
            setTimeout(() => {
                this._CasepaperService.getItemMasterById(this.durgId).subscribe((response) => {
                    this.itemObjects = response;
                    this.vItemGenericNameId = this.itemObjects.itemGenericNameId
                    this.MedicineItemForm.get('ItemGenericNameId').setValue(this.vItemGenericNameId)

                    if ((this.vItemGenericNameId ?? 0) > 0) {
                        setTimeout(() => {
                            this._CasepaperService.getItemGenericById(this.vItemGenericNameId).subscribe((response) => {
                                this.itemGeneric = response;
                                this.vItemGenericName = this.itemGeneric.itemGenericName
                                console.log('genericName:', this.vItemGenericName)
                            });
                        }, 500);
                    }
                });
            }, 500);
        }

        setTimeout(() => {
            if (!doseControl) {
                const inputEl = this.doseDropdown.nativeElement.querySelector('input');
                if (inputEl) {
                    inputEl.focus();
                }
            } else if (!dayControl) {
                this.dayField.nativeElement.focus();
            } else {
                this.instructionField.nativeElement.focus();
            }
        }, 0);
    }

    ItemFromReset() {
        const form = this.MedicineItemForm;
        form.patchValue({
            ItemId: "",
            DoseId: "",
            vDay: "",
            Day: "",
            Instruction: ""
        });
    }

    selectChangeItemGenericName(row) {
        this.vItemGenericNameId = row.value
        this.vItemGenericName = row.text
        // if presId then save or else not then direct do setvalue & try to pass
        // dont hide edit & close icon then
    }

    editItem(index: number, data) {
        this.editingIndex1 = index;
        this.originalValue = data.genericName;
    }

    OnSaveEditGeneric(contact) {
        this.vPrescriptionId = contact.precriptionId || contact.PrecriptionId;
        if (this.vPrescriptionId) {
            const m_dataUpdate = {
                "precriptionId": this.vPrescriptionId,
                "genericId": this.vItemGenericNameId || '',
            }
            this._CasepaperService.genericNameUpdate(m_dataUpdate).subscribe(response => {
                if (response) {
                    this.toastr.success('Record Updated Successfully.', 'Updated !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                    this.editingIndex1 = null;
                    // this.onClose()
                    this.listrefresh(contact);
                } else {
                    this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            });
        }
    }

    FetchList: any = [];
    listrefresh(contact) {
        const m_data2 = {
            "first": 0,
            "rows": 9999,
            "sortField": "VisitId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "VisitId",
                    "fieldValue": String(this.visitIdRefresh),
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }

        this._CasepaperService.RtrvPreviousprescriptionDetailsdemo(m_data2).subscribe(Visit => {
            this.FetchList = Visit.data as MedicineItemList[];
            this.Chargelist = this.dsItemList.data.filter(item => item.OPD_IPD_IP != contact.OPD_IPD_IP)
            this.FetchList.forEach(element => {
                this.Chargelist.push(
                    {
                        DrugId: element.drugId,
                        DrugName: element.drugName,
                        DoseId: element.doseId,
                        GenericName: element.genericName,
                        GenericId: element.genericId,
                        DoseName: element.doseName,
                        Days: element.days,
                        QtyPerDay: element.qtyPerDay,
                        totalQty: (element.qtyPerDay * element.days) || 0,
                        DoseId1: element.DoseId1,
                        DoseName1: element.DoseName1,
                        Day1: element.Day1,
                        DoseId2: element.DoseId2,
                        DoseName2: element.DoseName2,
                        Day2: element.Day2,
                        instruction: element.instruction,
                        PrecriptionId: element.precriptionId || 0
                    });
            })
            this.dsItemList.data = this.Chargelist
        });

    }

    GenericdisableEditing(data) {

        if (this.GenericoriginalValue !== null) {
            this.MedicineItemForm.get('ItemGenericNameId').setValue(this.GenericoriginalValue);
        }
        this.editingIndex1 = null;
    }

    DoseObjects: any;
    DoseQtyPerDay: any;
    selectChangeDoseName(row) {
        this.doseId = row.value
        // this.doseName = row.text

        if ((this.doseId ?? 0) > 0) {
            setTimeout(() => {
                this._CasepaperService.getDoseMasterById(this.doseId).subscribe((response) => {
                    this.DoseObjects = response;
                    this.DoseQtyPerDay = this.DoseObjects.doseQtyPerDay
                    this.doseName = this.DoseObjects.doseName
                });
            }, 500);
        }
    }

    editDose(index: number, data) {
        this.editingIndex = index;
        this.originalValue = data.doseName;
    }

    OnSaveEditDose(element: any) {
        this.editingIndex = null;
        this.vPrescriptionId = element.precriptionId || element.PrecriptionId;

        if (this.vPrescriptionId) {
            const m_dataUpdate = {
                "precriptionId": this.vPrescriptionId,
                "doseId": this.doseId || '',
            }

            this._CasepaperService.doseNameUpdate(m_dataUpdate).subscribe(response => {
                if (response) {
                    this.toastr.success('Record Updated Successfully.', 'Updated !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                    // this.onClose()
                    this.listrefresh(element);
                } else {
                    this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            });
        }
    }

    DosedisableEditing(index: number) {

        if (this.originalValue !== null) {
            // Restore old value
            this.MedicineItemForm.get('DoseId').setValue(this.originalValue);
        }
        this.editingIndex = null;
    }

    selectedItems = [];

    selectChangeServiceName(row) {
        const selectedData = Array.isArray(row) ? row : [row];
        this.selectedItems = selectedData.map(item => ({ serviceId: item.serviceId }));

        this.MedicineItemForm.get('DoctorID')?.reset(null, { emitEvent: false });
    }

    selectedItems1 = [];

    selectChangeServiceName1(row) {
        const selectedData = Array.isArray(row) ? row : [row];
        this.selectedItems1 = selectedData.map(item => ({ serviceId: item.serviceId }));

        this.MedicineItemForm.get('DoctorID')?.reset(null, { emitEvent: false });
    }


    selectedItems2 = [];

    selectChangeServiceName2(row) {
        const selectedData = Array.isArray(row) ? row : [row];
        this.selectedItems2 = selectedData.map(item => ({ serviceId: item.serviceId }));

        this.MedicineItemForm.get('DoctorID')?.reset(null, { emitEvent: false });
    }

    RtrvTestServiceList: any = [];
    getRtrvTestServiceList(obj) {
        // 
        const m_data2 = {
            "first": 0,
            "rows": 9999,
            "sortField": "VisitId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "VisitId",
                    "fieldValue": String(obj.visitId),//"40773",	
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._CasepaperService.getRtrvTestService(m_data2).subscribe(response => {
            this.RtrvTestServiceList = response.data
            if (Array.isArray(this.RtrvTestServiceList) && this.RtrvTestServiceList.length > 0) {
                debugger
                this.RtrvTestServiceList.forEach(element => {
                    // this.selectedItems.push({
                    //     serviceId: element.serviceId || 0,
                    //     serviceName: element.serviceName || ''
                    // });
                    const item = {
                        serviceId: element.serviceId || 0,
                        serviceName: element.serviceName || ''
                    };

                    // Pathology
                    if (element.isPathology === 1) {
                        this.selectedItems.push(item);
                    }

                    // Radiology
                    if (element.isRadiology === 1) {
                        this.selectedItems1.push(item);
                    }

                    // Other
                    if (element.isPathology !== 1 && element.isRadiology !== 1) {
                        this.selectedItems2.push(item);
                    }
                });
                console.log('Radio & Path:', this.RtrvTestServiceList)
                this.caseFormGroup.get('mAssignService').setValue(this.selectedItems);
                this.caseFormGroup.get('mAssignService1').setValue(this.selectedItems1);

                this.caseFormGroup.get('mAssignService2').setValue(this.selectedItems2);

            }
        })
    }

    selectChangeDoctorName(row) {
    }


    selectChangeChiefComplaint(selectedChips: string[]) {
        debugger
        this.addCheiflist = selectedChips;
        this.caseFormGroup.get('mAssignChiefComplaint')?.setValue(this.addCheiflist);
    }

    selectChangeDiagnosis(selectedChips: string[]) {
        console.log(selectedChips)
        debugger
        this.addDiagnolist = selectedChips;
        this.caseFormGroup.get('mAssignDiagnosis')?.setValue(this.addDiagnolist);
    }

    selectChangeExamination(selectedChips: string[]) {
        this.addExaminlist = selectedChips;
        this.caseFormGroup.get('mAssignExamination')?.setValue(this.addExaminlist);
    }

    getValidationMessages() {
        return {
            ItemId: [],
            DoseId: [],
            TemplateId: [],
            serviceId: [],
            DoctorID: [],
            Diagnosis: [],
            ChiefComplaint: [],
            Examination: [],
            departmentId: []
        }
    }

    FilteredServicec: any;
    NooptionsService: any;

    getdoseDetailValue1(element, event) {
        element.DoseName1 = event
    }

    getdoseDetailValue2(element, event) {
        element.DoseName2 = event
    }
    getdosedetail() {
        if (this.doseList.length > 0) {
            this.doseList.forEach(element => {
                this.doseresults.push(element)
            });
        }
    }

    addNewRow() {
        const pendingRow = this.dsItemList.data.find(x => x.editable === true);

        if (pendingRow) {
            this.toastr.warning("Please confirm the current row before adding a new one!");
            return;
        }

        this.MedicineItemForm.get('ItemId').reset('');
        this.MedicineItemForm.get('ItemGenericNameId').reset('');
        this.MedicineItemForm.get('DoseId').reset('');
        this.MedicineItemForm.get('Day').reset('');
        this.vdoseName = ""
        const newRow = {
            DrugName: '',
            GenericName: '',
            DoseName: '',
            Days: '',
            Instruction: '',
            editable: true
        } as unknown as MedicineItemList;

        this.Chargelist.unshift(newRow);
        this.dsItemList.data = [...this.Chargelist];
    }

    confirmRow(row) {
        if (!this.MedicineItemForm.get("ItemId")?.value) {
            this.toastr.warning('Please select a Item Name', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.MedicineItemForm.get("DoseId")?.value) {
            this.toastr.warning('Please select a Dose Name', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.MedicineItemForm.get("Day")?.value) {
            this.toastr.warning('Please enter a Day', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        debugger

        const Qty = this.DoseQtyPerDay || 0
        row.DrugId = this.durgId || 0,
            row.DrugName = this.durgName || '',
            row.DoseId = this.doseId || 0,
            row.GenericName = this.vItemGenericName || '',
            row.GenericId = this.vItemGenericNameId || 0,
            row.DoseName = this.doseName || '',
            row.Days = this.MedicineItemForm.get('Day').value || this.vDay,
            row.QtyPerDay = this.DoseQtyPerDay || 0,
            row.totalQty = Qty * (this.DoseQtyPerDay || 0),
            row.DoseId1 = this.doseId || 0,
            row.DoseName1 = this.doseName || '',
            row.Day1 = this.Day1,
            row.DoseId2 = this.durgId || 0,
            row.DoseName2 = this.durgName || '',
            row.Day2 = this.Day1,
            row.instruction = this.MedicineItemForm.get("Instruction").value || ''

        row.editable = false;

        // Refresh table
        this.dsItemList.data = [...this.dsItemList.data];
        console.log("Confirm List", this.dsItemList.data)
    }

    enableEdit(row: any) {
        console.log("edit:", row)
        // only one edit will work
        this.dsItemList.data.forEach(r => (r.editable = false));
        row.editable = true;
        this.dsItemList.data = [...this.dsItemList.data];

        if (row.precriptionId ?? row.presId > 0) {
            this.MedicineItemForm.patchValue({
                ItemId: row.drugId || row.DrugId,
                Day: row.days || row.Days,
                Instruction: row.instruction || row.Instruction,
                ItemGenericNameId: row.genericId || row.genericid,
                DoseId: row.doseId
            });
        }
    }

    cancelEdit(contact: any) {
        contact.editable = false;
    }

    Day1: any = 0;
    Day2: any = 0;
    onAdd() {
        if (!Array.isArray(this.Chargelist)) {
            console.warn("Chargelist was not an array. Resetting...");
            this.Chargelist = [...this.dsItemList.data];
        }
        const iscekDuplicate = this.dsItemList.data.some(item => item.DrugId == this.durgId)
        if (!iscekDuplicate) {

            const Qty = this.DoseQtyPerDay || 0

            const newEntry = {
                DrugId: this.durgId || 0,
                DrugName: this.durgName || '',
                DoseId: this.doseId || 0,
                GenericName: this.vItemGenericName || '',
                GenericId: this.vItemGenericNameId || 0,
                DoseName: this.doseName || '',
                Days: this.MedicineItemForm.get('Day').value || this.vDay,
                QtyPerDay: this.DoseQtyPerDay || 0,
                totalQty: Qty * (this.DoseQtyPerDay || 0),
                DoseId1: this.doseId || 0,
                DoseName1: this.doseName || '',
                Day1: this.Day1,
                DoseId2: this.durgId || 0,
                DoseName2: this.durgName || '',
                Day2: this.Day1,
                instruction: this.MedicineItemForm.get("Instruction").value || ''
            };
            this.Chargelist.push(newEntry);
            this.dsItemList.data = [...this.Chargelist];
        } else {
            this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        this.getdosedetail();
        this.MedicineItemForm.get('ItemId').reset('');
        this.MedicineItemForm.get('DoseId').reset('');
        this.MedicineItemForm.get('Day').reset('');
        this.MedicineItemForm.get('Instruction').reset('');
        // this.itemid.nativeElement.focus();
        setTimeout(() => {
            const input = document.querySelector('airmid-autocomplete input') as HTMLInputElement;
            if (input) {
                input.focus();
            }
        }, 0);
    }

    deleteTableRow(event, element) {
        const index = this.Chargelist.indexOf(element);
        if (index >= 0) {
            this.Chargelist.splice(index, 1);
            this.dsItemList.data = [];
            this.dsItemList.data = this.Chargelist;
        }
        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }

    // Handle medicine data changes from the new MedicineTableComponent
    onMedicineDataChanged(data: MedicineItemList[]) {
        this.Chargelist = [...data];
        this.dsItemList.data = this.Chargelist;
    }

    // Sync data to medicine table component
    syncMedicineTableData() {
        if (this.medicineTableRef) {
            this.medicineTableRef.setData(this.dsItemList.data);
        }
    }

    selectChangeTemplateName(row) {
        this.templateId = row.presId
        this.templateName = row.presTemplateName
    }
    itemObjects1: any[] = [];

    onTemplDetAdd() {
        if ((this.vOPIPId == '' || this.vOPIPId == '0')) {
            this.toastr.warning('Please select Patient', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.MedicineItemForm.get("TemplateId")?.value) {
            this.toastr.warning('Please select a Template Name', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        const iscekDuplicate = this.dsItemList.data.some(item => item.Presid == this.MedicineItemForm.get('TemplateId').value)
        if (!iscekDuplicate) {
            const vdata = {
                "first": 0,
                "rows": 9999,
                "sortField": "Presid",
                "sortOrder": 0,
                "filters": [
                    {
                        "fieldName": "Presid",
                        "fieldValue": String(this.templateId),//"40773",	
                        "opType": "Equals"
                    }
                ],
                "Columns": [],
                "exportType": "JSON"
            }

            this._CasepaperService.getTempPrescriptionList(vdata).subscribe(data => {
                this.dsItemList.data = data.data as MedicineItemList[];
                console.log('Template data:', this.dsItemList.data)
                const validItems = this.dsItemList.data.filter(item => (item?.genericid ?? 0) > 0);

                validItems.forEach((item, index) => {
                    setTimeout(() => {
                        this._CasepaperService.getItemGenericById(item.genericid).subscribe((response) => {
                            item.genericName = response.itemGenericName;
                        });
                    }, 500 * (index + 1));
                });
                this.Chargelist = data.data as MedicineItemList[];
                this.syncMedicineTableData();
            });
        }
        else {
            this.toastr.warning('Selected Template Details already added in the list ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        this.MedicineItemForm.get('TemplateId').reset('');

    }

    OnViewReportWithHeaderPdf(element: any) {

        this.commonService.Onprint("VisitId", element, "OPPrescription");
    }
    OnViewReportWithoutHeaderPdf(element: any) {
        this.commonService.Onprint("VisitId", element, "OPPrescriptionwithoutHeader");
    }

    OnViewReportWithHeaderA5Pdf(element: any) {

        this.commonService.Onprint("VisitId", element, "OPPrescriptionA5");
    }
    OnViewReportWithoutHeaderA5Pdf(element: any) {
        this.commonService.Onprint("VisitId", element, "OPPrescriptionwithoutHeaderA5");
    }

    onClose() {
        this.caseFormGroup.reset({ LangaugeRadio: ["true"] });
        this.mycertificateForm.reset({ Language: '1' });
        // this.numericForm.reset();
        this.dialogRef.close();
    }

    onClear() {
        this.caseFormGroup.reset();
        this.searchFormGroup.get('RegId').reset();
        this.dsItemList.data = [];
        this.PatientName = " ";
        this.RegId = " ";
        this.Doctorname = " ";
        this.VisitDate = this.datePipe.transform(Date.now(), 'dd/MM/yyyy hh:mm a');
        this.CompanyName = " ";
        this.Tarrifname = " ";
        this.DepartmentName = " ";
        this.RegNo = " ";
        this.vOPIPId = " ";
        this.vOPDNo = " ";
        this.vClassId = " ";
        this.AgeYear = " ";
        this.AgeMonth = " ";
        this.AgeDay = " ";
        this.GenderName = " ";
        this.RefDocName = " ";
        this.PatientType = " ";
        this.caseFormGroup.get('LetteHeadRadio').setValue('NormalHead');
        this.caseFormGroup.get('LangaugeRadio').setValue("true");
        this.MedicineItemForm.get('Remark').setValue('');
        this.MedicineItemForm.get('DoctorID').setValue('');
        this.selectedItems = [];
        this.addCheiflist = [];
        this.addDiagnolist = [];
        this.addExaminlist = [];
        this.specificDate = new Date();
        this.vDays = this.vDayInput
    }
    SpinLoading: any = ""
    viewgetOpprescriptionReportwithheaderPdf() {

        setTimeout(() => {
            this.SpinLoading = true;
            //  this.AdList=true;
            this._CasepaperService.getOpPrescriptionview(
                this.VisitId
            ).subscribe(res => {
                const dialogRef = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "OP Prescription Viewer"
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    // this.AdList=false;
                    this.SpinLoading = false;
                });
                dialogRef.afterClosed().subscribe(result => {
                    // this.AdList=false;
                    this.SpinLoading = false;
                });
            });

        }, 100);
    }

    viewgetOpprescriptionReportwithoutheaderPdf() {

        setTimeout(() => {
            this.SpinLoading = true;
            //  this.AdList=true;
            this._CasepaperService.getOpPrescriptionwithoutheaderview(
                this.VisitId
            ).subscribe(res => {
                const dialogRef = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "OP Prescription Viewer"
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    // this.AdList=false;
                    this.SpinLoading = false;
                });
                dialogRef.afterClosed().subscribe(result => {
                    // this.AdList=false;
                    this.SpinLoading = false;
                });
            });

        }, 100);
    }

    getWhatsappshareSales(el, vmono) {

        if (vmono != '' && vmono != '0') {
            const m_data = {
                "insertWhatsappsmsInfo": {
                    "mobileNumber": vmono || 0,
                    "smsString": '',
                    "isSent": 0,
                    "smsType": 'OPPRESCRIPTIONT',
                    "smsFlag": 0,
                    "smsDate": this.currentDate,
                    "tranNo": el,
                    "PatientType": 1,//el.PatientType,
                    "templateId": 0,
                    "smSurl": "info@gmail.com",
                    "filePath": '',
                    "smsOutGoingID": 0
                }
            }
            this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
                if (response) {
                    this.toastr.success('Prescription Sent on WhatsApp Successfully.', 'Save !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                } else {
                    this.toastr.error('API Error!', 'Error WhatsApp!', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            });
        }
    }
    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    keyPressCharater(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    // ///[^a-zA-Z0-9]/
    keyPressOk(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/^[0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    onEnter(event: KeyboardEvent, nextInputId: string) {
        if (event.key === "Enter") {
            event.preventDefault();  // prevent form submit
            document.getElementById(nextInputId)?.focus();
        }
    }

    focusNext(nextId: string) {
        setTimeout(() => {
            document.getElementById(nextId)?.focus();
        }, 0);
    }


    @ViewChild('ChiefComp') ChiefComp: ElementRef;
    @ViewChild('deptdoc') deptdoc: ElementRef;
    @ViewChild('itemid') itemid: ElementRef;
    @ViewChild('dosename') dosename: ElementRef;
    @ViewChild('Day') Day: ElementRef;
    @ViewChild('Instruction') Instruction: ElementRef;
    // @ViewChild('itemAutocomplete') itemAutocomplete!: ElementRef;
    @ViewChild('addbutton') addbutton!: ElementRef<HTMLButtonElement>;
    public onEnterdept(event): void {
        if (event.which === 13) {
            this.deptdoc.nativeElement.focus();
        }
    }

    public onEnterqty(event): void {
        if (event.which === 13) {
            this.Instruction.nativeElement.focus();
        }
    }
    public onEnterremark(event): void {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.addbutton.nativeElement.focus();
            this.onAdd();
        }
    }

    onChangeLangaugeRadio(event) {

    }
    LetterheadFilter(event) {

    }

    //datewise visit info and table data
    patients: any[] = []; // Using 'any' type for simplicity
    uniqueDates: string[] = [];
    // displayedColumns: string[] = ['patientName', 'age', 'gender'];

    getnewVisistListDemo(obj) {
        const D_data = {
            "first": 0,
            "rows": 9999,
            "sortField": "VisitId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "RegID",
                    "fieldValue": String(obj.regId),//"40773",	
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._CasepaperService.getRtrvVisitedListdemo(D_data).subscribe(Visit => {
            this.patients = Visit?.data as MedicineItemList[];
            console.log("patients:", this.patients)
            this.extractUniqueDates();
        });
    }

    patientDiagnosis: any[] = [];
    complaints: any[] = [];
    diagnoses: any[] = [];
    examinations: any[] = [];

    // get prev visit complaint info
    groupedVisits: any[] = [];
    getPrevVisitDiagnosisList(obj) {
        const D_data = {
            "first": 0,
            "rows": 9999,
            "sortField": "RegID",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "RegID",
                    "fieldValue": String(obj.regId), //"100105"	
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._CasepaperService.getPrevVisitDiagnosisList(D_data).subscribe(Visit => {
            this.patientDiagnosis = Visit?.data || [];
            // Group by VisitId
            const grouped = {};

            for (const item of this.patientDiagnosis) {
                const visitId = item.visitId;

                if (!grouped[visitId]) {
                    grouped[visitId] = {
                        visitId: visitId,
                        complaints: [],
                        diagnoses: [],
                        examinations: []
                    };
                }
                debugger
                if (item.descriptionType === 'Complaint') grouped[visitId].complaints.push(item.descriptionName);
                else if (item.descriptionType === 'Diagnosis') grouped[visitId].diagnoses.push(item.descriptionName);
                else if (item.descriptionType === 'Examination') grouped[visitId].examinations.push(item.descriptionName);
            }

            // Convert grouped object to array for ngFor
            this.groupedVisits = Object.values(grouped);
            // console.log('Grouped Visits:', this.groupedVisits);
        });
    }

    getVisitDataById(visitId: number): any[] {
        return this.groupedVisits.filter(visit => visit.visitId === visitId);
    }

    extractUniqueDates() {
        const visitId = this.patients.map(patient => patient.visitId);
        this.uniqueDates = Array.from(new Set(visitId));
    }
    //datewise table data
    getFirstPatientForDate(visitId: string) {
        return this.patients.filter(patient => patient.visitId === visitId); //
    }
    //datewise visit info date
    getPatientsForDate(visitId: string) {
        // 
        const patientsForDate = this.patients.filter(patient => patient.visitId === visitId);
        return patientsForDate.length > 0 ? [patientsForDate[0]] : []; // 
    }

    SelectedObj: any;

    preHeight: any;
    preSPO: any;
    preWeight: any;
    preTemp: any;
    PreBMI: any;
    prePulse: any;
    preBSL: any;
    preBP: any;
    preCheifComplaint: any;
    preExamination: any;
    preDiagnosis: any;
    preFollowupDate: Date;

    getPreviousPrescriptionlist() {
        if ((this.RegId == '' || this.RegId == '0' || this.RegId == undefined)) {
            this.toastr.warning('Please select Patient', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        const dialogRef = this._matDialog.open(PrePresciptionListComponent,
            {
                maxWidth: "70vw",
                maxHeight: "72vh",
                width: '100%',
                height: "100%",
                data: {
                    Obj: this.RegId
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {

                this.dsCopyItemList.data = result;
                if (!this.dsItemList.data) {
                    this.dsItemList.data = [];
                }

                this.Chargelist = [...this.dsItemList.data];

                this.dsCopyItemList.data.forEach(element => {

                    const chkitem = this.dsItemList.data.find(item =>
                        item.DrugId === element.drugId || item.drugId === element.drugId
                    );
                    if (!chkitem) {
                        const newItem = {
                            PrecriptionId: element.precriptionId || 0,
                            OPD_IPD_IP: element.opD_IPD_IP || '',
                            ClassID: element.classID || 0,
                            ClassName: element.className,
                            GenericId: element.genericId,
                            GenericName: element.genericName || '',
                            DrugId: element.drugId || '',
                            DoseId: element.doseId || 0,
                            DoseName: element.doseName,
                            Days: element.days,
                            InstructionId: element.instructionId || 0,
                            InstructionDescription: element.instructionDescription || '',
                            Remark: element.remark || '',
                            DrugName: element.drugName,
                            instruction: element.instruction,
                            TotalQty: element.totalQty,
                            QtyPerDay: element.qtyPerDay,
                            PWeight: element.pWeight,
                            Pulse: element.pulse,
                            BP: element.bp,
                            BSL: element.bsl,
                            ChiefComplaint: element.chiefComplaint,
                            DoseOption2: element.doseOption2,
                            DoseNameOption2: element.doseNameOption2,
                            DaysOption2: element.daysOption2,
                            DoseOption3: element.doseOption3,
                            DoseNameOption3: element.doseNameOption3,
                            DaysOption3: element.daysOption3,
                        };

                        this.Chargelist.push(newItem);
                        this.dsItemList.data = [...this.Chargelist];
                        this.syncMedicineTableData();
                    } else {
                        this.toastr.warning('This Drug is already added', 'Warning !', {
                            toastClass: 'tostr-tost custom-toast-warning',
                        });
                    }
                });
            }
        });
    }

    showTemplateRefresh = true;
    SaveTemplate() {
        if (this.dsItemList.data.length == 0) {
            Swal.fire('Error !', 'Please add prescription in table', 'error');
            return
        }
        const dialogRef = this._matDialog.open(PrescriptionTemplateComponent,
            {
                maxWidth: "50vw",
                maxHeight: "35vh",
                width: '100%',
                // height: "100%",
                data: {
                    Obj: this.dsItemList.data,
                    category: 'CasePaperTemplate'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.showTemplateRefresh = false;
            setTimeout(() => {
                this.showTemplateRefresh = true;
            }, 100);
        });
    }

    filteredHistory: Observable<string[]>;

    getItemMaster() {
        const dialogRef = this._matDialog.open(AddItemComponent,
            {
                maxWidth: "60vw",
                maxHeight: "65vh",
                width: '100%',
                // height: "65%" 
            });
        dialogRef.afterClosed().subscribe(result => {
            // this.showDoseDropdownRefresh = false;
            // setTimeout(() => {
            //     this.showDoseDropdownRefresh = true;
            // }, 100);
            this.onRefrshClick()
        });
    }

    showDoseDropdownRefresh = true;

    getDosemaster() {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const dialogRef = this._matDialog.open(NewDoseMasterComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
            });
        // dialogRef.componentInstance.openedFromOPD = true;
        dialogRef.afterClosed().subscribe(result => {
            // this.showDoseDropdownRefresh = false;
            // setTimeout(() => {
            //     this.showDoseDropdownRefresh = true;
            // }, 100);
            this.onRefrshClick()
        });
    }
    showDoseDropdownRefresh1 = true;
    getInstrMaster() {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewInstructionMasterComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
            });
        // dialogRef.componentInstance.openedFromOPD = true;
        dialogRef.afterClosed().subscribe(result => {
            // this.showDoseDropdownRefresh = false;
            // setTimeout(() => {
            //     this.showDoseDropdownRefresh = true;
            // }, 100);

            this.onRefrshClick()
        });
    }

    onAddRecordClick(): void {
        if (this.medicineTableRef) {
            this.medicineTableRef.addNewRow();
        }
    }

    onRefrshClick(): void {

        if (this.medicineTableRef) {
            this.medicineTableRef.RefreshRow();
        }

    }
    //Diagnosis
    addDiagnos(event: any): void {
        const input = event.input;
        const value = event.value;
        console.log(event)
        if ((value || '').trim()) {
            this.addDiagnolist.push(value.trim());
        }
        // Reset the input value
        if (input) {
            input.value = '';
        }
    }
    removeDiagno(Diagno: string): void {
        const index = this.addDiagnolist.indexOf(Diagno);
        if (index >= 0) {
            this.addDiagnolist.splice(index, 1);
        }
    }
    selectedobjDiagno(obj): void {
        const value = obj.Diagnosis;
        if ((value || '').trim()) {
            this.addDiagnolist.push(value.trim());
        }
    }
    //Examination
    addExamina(event: any): void {
        const input = event.input;
        const value = event.value;
        // Add cheif
        if ((value || '').trim()) {
            this.addExaminlist.push(value.trim());
        }
        // Reset the input value
        if (input) {
            input.value = '';
        }
    }
    removeExamin(Examin: string): void {
        const index = this.addExaminlist.indexOf(Examin);
        if (index >= 0) {
            this.addExaminlist.splice(index, 1);
        }
    }
    selectedobjExamin(obj): void {
        const value = obj.Examination;
        if ((value || '').trim()) {
            this.addExaminlist.push(value.trim());
        }
    }

    // certificate part
    selectedTabIndex = 0;
    dsCertficateTemp = new MatTableDataSource<certificateTemp>();
    certiID = 0;
    vcertificateText: any;
    registerObjDet: any;
    isButtonDisabled: boolean = false;
    selectedTabIndexHide = 0;

    onTabChange(event: MatTabChangeEvent) {
        this.selectedTabIndexHide = event.index;
    }

    onEditorValueChange(content: string) {
        this.mycertificateForm.get('certificateText')?.setValue(content);
    }

    onCertificateSave() {
        if (!this.mycertificateForm.invalid) {
            this.mycertificateForm.get('visitId').setValue(this.VisitId)
            this.mycertificateForm.get('certificateId').setValue(this.certiID ?? 0);
            const payload = this.mycertificateForm.getRawValue();
            delete payload.Language;
            console.log(payload)
            this._CasepaperService.CertificateInsertUpdate(payload).subscribe((response) => {
                this.onSubList()
                this.onReset();
                this.viewgetCertificateReportPdf(response)
                this.mycertificateForm.patchValue(this.CreatePatientCertiform().value);
            });
        }
        else {
            const invalidFields: string[] = [];
            if (this.mycertificateForm.invalid) {
                for (const controlName in this.mycertificateForm.controls) {
                    if (this.mycertificateForm.controls[controlName].invalid) {
                        invalidFields.push(`My Form: ${controlName}`);
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
    viewgetCertificateReportPdf(element: any) {
        this.commonService.Onprint("CertificateId", element.certificateId, "CertificateInformationReport");
    }
    onSubList() {
        this.getCertificateList();
        this.certiID = 0
        this.mycertificateForm.reset({ Language: '1' });
    }

    onReset() {
        this.mycertificateForm.reset()
        this.mycertificateForm.reset({
            Language: '1',
            certificateDate: new Date(
                Date.UTC(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate()
                )
            ).toISOString(),
            certificateTime: (new Date()).toISOString(),
        });
        this.vcertificateText = ''
    }

    selectChangeTemplate(data) {
        this.registerObjDet = data.certificateDesc;
        this.mycertificateForm.get('certificateName').setValue(data.certificateName)
    }

    addTemplateDescription() {

        this.isButtonDisabled = false;
        if (!this.mycertificateForm.get('CertificateTemplateId').value) {
            this.toastr.warning('Please select Certificate Template ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this.registerObjDet) {
            this.vcertificateText = this.registerObjDet;
            this.mycertificateForm.get('certificateText')?.setValue(this.vcertificateText);
            this.registerObjDet = '';
        }
    }

    getCertificateList() {
        const D_data = {
            "first": 0,
            "rows": 9999,
            "sortField": "VisitedID",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "VisitedID",
                    "fieldValue": String(this.VisitId),
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": []
        }
        this._CasepaperService.getCertificateList(D_data).subscribe(Visit => {
            this.dsCertficateTemp.data = Visit.data as certificateTemp[];
            console.log("dfffddddddddddddddd:", this.dsCertficateTemp.data)
            this.dsCertficateTemp.sort = this.sort;
            this.dsCertficateTemp.paginator = this.paginator;
        })
    }

    OnEdit(row) {
        this.mycertificateForm.get('CertificateTemplateId').disable();
        this.isButtonDisabled = true

        this.certiID = row.certificateId
        this.mycertificateForm.get('certificateName').setValue(row.certificateName)
        this.mycertificateForm.patchValue({
            CertificateTemplateId: row.certificateTemplateId,
        });
        this.vcertificateText = row.certificateText
        this.mycertificateForm.get('certificateText').setValue(this.vcertificateText)
        this.selectedTabIndex = 1;
    }

    // image code
    selectedFiles: File[] = [];

    onImageFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;

        if (input.files && input.files.length > 0) {
            this.selectedFiles = Array.from(input.files);
            // this.uploadForm.patchValue({ imageFile: this.selectedFiles });
        }
    }

    onSubmitImgFiles(): void {
        if (this.selectedFiles.length === 0) {
            alert('Please select a file before uploading.');
            return;
        }

        const formData = new FormData();
        this.selectedFiles.forEach(file => {
            formData.append('files', file);
        });
        console.log('Files ready for upload:', this.selectedFiles);
    }

    // image code end

    // visit histor certificate tab

    dsVisitCertficateTemp = new MatTableDataSource<any>();
    certificateMap: { [visitId: string]: certificateTemp[] } = {};
    LabMap: { [visitId: string]: labRadList[] } = {};
    RadMap: { [visitId: string]: labRadList[] } = {};

    getCertificateHistoryTab(obj) {
        // debugger
        const D_data = {
            "first": 0,
            "rows": 9999,
            "sortField": "VisitId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "RegID",
                    "fieldValue": String(obj.regId),//"40773",	
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._CasepaperService.getRtrvVisitedListdemo(D_data).subscribe(Visit => {
            this.patients = Visit?.data as MedicineItemList[];
            console.log("patients:", this.patients);

            const uniqueVisitIds = [...new Set(this.patients.map(p => p.visitId))];

            uniqueVisitIds.forEach(visitId => {
                this.getCertificatesByVisitId(visitId);
                // this.getLabdata(visitId);
            });

            this.extractUniqueDates();
        });
    }

    getCertificatesByVisitId(visitId: string) {
        // 
        const D_data = {
            "first": 0,
            "rows": 9999,
            "sortField": "VisitedID",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "VisitedID",
                    "fieldValue": String(visitId),
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": []
        };

        this._CasepaperService.getCertificateList(D_data).subscribe(Visit => {
            //  to store certificate data for each visitId separately
            this.certificateMap[visitId] = Visit.data as certificateTemp[];

            if (this.dsVisitCertficateTemp && visitId === this.patients[0]?.visitId) {
                this.dsVisitCertficateTemp.data = this.certificateMap[visitId];
                this.dsVisitCertficateTemp.sort = this.sort;
                this.dsVisitCertficateTemp.paginator = this.paginator;
            }
        });
    }
    // 

    // lab tab code
    dsLab = new MatTableDataSource<labRadList>();
    dsRad = new MatTableDataSource<labRadList>();
    labDataLoaded = false;
    labDataLoadedMap: { [visitId: string]: boolean } = {};
    labColumns: string[] = [
        'Buttons',
        'labDate',
        'ServiceName',
        'BillNo',
        'PatientType',
        'Action'
    ]

    onTabChangeEvent(event: MatTabChangeEvent, visitId: string) {
        const index = event.index;
        if ((index === 1 || index === 2) && !this.labDataLoadedMap[visitId]) {
            this.getLabdata(visitId);
            this.labDataLoadedMap[visitId] = true;
        }
    }


    getLabdata(visitId: string) {
        const D_data = {
            first: 0,
            rows: 999,
            sortField: "VisitId",
            sortOrder: 0,
            filters: [
                {
                    fieldName: "OPIPId",
                    fieldValue: String(visitId),
                    opType: "Equals"
                }
            ],
            exportType: "JSON",
            columns: []
        };

        this._CasepaperService.getLabRadList(D_data).subscribe(Visit => {
            const allData = Visit.data as labRadList[];
            // 
            this.LabMap[visitId] = allData.filter(item => item.patientType === 'PathologyTestList');
            this.RadMap[visitId] = allData.filter(item => item.patientType === 'RadiologyTestList');

            this.dsLab.data = this.LabMap[visitId];
            this.dsRad.data = this.RadMap[visitId];

            this.dsLab.sort = this.sort;
            this.dsLab.paginator = this.paginator;

            this.dsRad.sort = this.sort;
            this.dsRad.paginator = this.paginator;

            console.log('Lab Data for', visitId, this.LabMap[visitId]);
            console.log('Radiology Data for', visitId, this.RadMap[visitId]);
        });
    }

    getLabPrint(contact) {

        console.log(contact)

        Swal.fire({
            title: 'Select Report Format',
            text: "Choose how you want to view the report:",
            icon: "warning",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            denyButtonColor: "#6c757d",
            cancelButtonColor: "#d33",
            confirmButtonText: "With Header",
            denyButtonText: "Without Header",
        }).then((result) => {

            if (result.isConfirmed) {
                this.Printresultentrywithheader(contact);
            } else if (result.isDenied) {
                this.Printresultentry(contact);
            }
        });
    }

    Printresultentry(row) {
        // 
        console.log("WithHeader", row);
        const pathologyDelete = [{
            pathReportId: row.pathReportID
        }];

        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };

        console.log(submitData);

        this._CasepaperService.PathPrintResultentryInsert(submitData).subscribe(res => {
            if (res) {
                this.viewgetPathologyTestReportPdf("0")
            }
        });
    }

    viewgetPathologyTestReportPdf(data) {
        this.commonService.Onprint("OP_IP_Type", data, "PathologyReportWithOutHeader");
    }

    Printresultentrywithheader(row: any) {

        console.log("WithHeader", row);
        const pathologyDelete = [{
            pathReportId: row.pathReportID
        }];

        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };

        console.log(submitData);

        this._CasepaperService.PathPrintResultentryInsert(submitData).subscribe(res => {
            if (res) {
                this.viewgetPathologyTestReportwithheaderPdf("0")
            }
        });
    }

    viewgetPathologyTestReportwithheaderPdf(data) {
        this.commonService.Onprint("OP_IP_Type", data, "PathologyReportWithHeader");
    }

    getRadPrint(contact) {

        console.log(contact)

        Swal.fire({
            title: 'Select Report Format',
            text: "Choose how you want to view the report:",
            icon: "warning",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            denyButtonColor: "#6c757d",
            cancelButtonColor: "#d33",
            confirmButtonText: "With Header",
            denyButtonText: "Without Header",
        }).then((result) => {

            if (result.isConfirmed) {
                this.viewgetRadioloyTemplateReportPdf(contact);
            } else if (result.isDenied) {
                this.viewgetRadioloyTemplateReportPdf1(contact);
            }
        });
    }

    viewgetRadioloyTemplateReportPdf(contact) {
        setTimeout(() => {
            const param = {
                "searchFields": [
                    {
                        "fieldName": "RadReportId",
                        "fieldValue": String(contact.pathReportID),
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "OP_IP_Type",
                        "fieldValue": "0",
                        "opType": "Equals"
                    }
                ],
                "mode": "RadiologyTemplateReportWithHeader"
            }

            this._CasepaperService.getReportView(param).subscribe(res => {

                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Radiology Template Report" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }

    viewgetRadioloyTemplateReportPdf1(contact) {
        setTimeout(() => {
            const param = {
                "searchFields": [
                    {
                        "fieldName": "RadReportId",
                        "fieldValue": String(contact.pathReportID),
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "OP_IP_Type",
                        "fieldValue": "0",
                        "opType": "Equals"
                    }
                ],
                "mode": "RadiologyTemplateReportWithoutHeader"
            }

            this._CasepaperService.getReportView(param).subscribe(res => {

                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Radiology Template Report" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }

    // lab code end

    // tryed
    @ViewChild('grid', { static: false }) grid: AirmidTableComponent;
    AllColumns = [
        { heading: "labDate", key: "pathDate", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PatientType", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "BillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                { action: gridActions.print, callback: (data: any) => { } }]
        }
    ]
    gridConfig: gridModel = {
        apiUrl: "OPDPrescriptionMedical/getlabifnormationList",
        columnsList: this.AllColumns,
        sortField: "VisitId",
        sortOrder: 0,
        filters: [
            { fieldName: "OPIPId", fieldValue: "0", opType: OperatorComparer.Equals }, //String(this.vAdmissionID)
        ],
        row: 25,
        localData: []
    }

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (event.key === 'F2') {
            Swal.fire("Call EMR Mark set funtion")
            this.SetEMRMark()
        }
    }

    SetEMRMark() {

    }


    loadGridDataForVisit(visitId: string) {
        this.gridConfig.localData = this.LabMap[visitId] || [];
        this.gridConfig.filters = [
            { fieldName: "OPIPId", fieldValue: String(visitId), opType: OperatorComparer.Equals }
        ];
    }

    // it allowed only Digit & decimal
    keyPressDigitDecimalOnly(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    CompletdFlag: any = 0;
    Printresultentrymulti(row: any) {

        const pathologyDelete = [];
        this.selectedItem = this.selection.selected[0];
        this.selection.selected.forEach((element) => {
            if (element?.isCompleted) {
                this.CompletdFlag = 1
                pathologyDelete.push({ pathReportId: element.pathReportID });
            }
            else {
                this.CompletdFlag = 0
            }
        });
        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };
        console.log(submitData);
        if (this.CompletdFlag) {
            if (row == true) {
                this._CasepaperService.PathPrintResultentryInsert(submitData).subscribe(res => {
                    if (res) {
                        this.viewgetPathologyTestReportPdf("0")
                    }
                });
            } else {
                this._CasepaperService.PathPrintResultentryInsert(submitData).subscribe(res => {
                    if (res) {
                        this.viewgetPathologyTestReportwithheaderPdf("0")
                    }
                });
            }
        } else {
            Swal.fire("Selcted test Not Completd for Print.....")
        }
    }


    Printresultentrymulti1(row: any) {

        const pathologyDelete = [];
        this.selectedItem = this.selection.selected[0];
        this.selection.selected.forEach((element) => {
            if (element?.isCompleted) {
                this.CompletdFlag = 1
                pathologyDelete.push({ pathReportId: element.pathReportID });
            }
            else {
                this.CompletdFlag = 0
            }
        });
        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };
        console.log(submitData);
        if (this.CompletdFlag) {
            if (row == true) {
                this._CasepaperService.PathPrintResultentryInsert(submitData).subscribe(res => {
                    if (res) {
                        this.viewgetPathologyTestReportPdf("0")
                    }
                });
            } else {
                this._CasepaperService.PathPrintResultentryInsert(submitData).subscribe(res => {
                    if (res) {
                        this.viewgetPathologyTestReportwithheaderPdf("0")
                    }
                });
            }
        } else {
            Swal.fire("Selcted test Not Completd for Print.....")
        }
    }
    selectedItem: any = [];
    selection = new SelectionModel<SampleList>(true, []);
    masterToggle() {
        const dsLabData: any = this.dsLab.data;

        if (this.isAllSelected()) {
            this.selection.clear();
            this.selectedItem = [];   // ✅ Clear list
        } else {
            this.selection.clear();
            this.selectedItem = [];   // ✅ Reset first

            dsLabData.forEach(row => {
                this.selection.select(row);
                this.selectedItem.push(row);   // ✅ Add all
            });
        }
    }
    isAllSelected() {
        let dsLabData: any = this.dsLab.data;
        const numSelected = this.selection.selected.length;
        const numRows = dsLabData.length;
        return numRows > 0 && numSelected === numRows;
    }
    isSomeSelected() {
        const selectableRows = this.dsLab.data
        return this.selection.selected.length > 0 &&
            this.selection.selected.length < selectableRows.length;
    }
    tableElementChecked(event, element) {
        if (event.checked) {
            this.selection.select(element);
            if (!this.selectedItem.includes(element)) {
                this.selectedItem.push(element);
            }
        } else {
            this.selection.deselect(element);
            // ✅ Remove from SelectedList
            const index = this.selectedItem.indexOf(element);
            if (index > -1) {
                this.selectedItem.splice(index, 1);
            }
        }
    }
    public displayedResultViewColumns =
        ['sequence', 'TestName', 'ParameterName', 'ResultValue', 'Flag', 'NormalRange'];
    @ViewChild('ResultViewTab') ResultViewTab!: TemplateRef<any>;
    @ViewChild('ResultViewTab1') ResultViewTab1!: TemplateRef<any>;
    // getLabResultview(row: any): void {
    //     this._matDialog.open(this.ResultViewTab, {
    //         width: '65%',
    //         height: '75%',
    //     })
    //     var param = {
    //         "searchFields": [
    //             {
    //                 "fieldName": "PathReportId",
    //                 "fieldValue": String(row.pathReportID), //"150598",  
    //                 "opType": "Equals"
    //             }
    //         ],
    //         "mode": "PathologyResultEntryOPCompleted"
    //     }
    //     //         {
    //     //     "TestId": 2,
    //     //     "TestName": "CBC",
    //     //     "PrintTestName": "COMPLETE BLOOD COUNT",
    //     //     "SubTestId": 0,
    //     //     "SubTestName": "CBC",
    //     //     "SubTestNamePrint": "COMPLETE BLOOD COUNT",
    //     //     "ParameterName": "HCT",
    //     //     "ParameterShortName": "HCT",
    //     //     "ParameterId": 19,
    //     //     "PrintParameterName": "HCT",
    //     //     "ResultValue": " 2323",
    //     //     "NormalRange": "33 - 50 %",
    //     //     "PrintOrder": 1,
    //     //     "PIsNumeric": 1,
    //     //     "PathReportId": 571684,
    //     //     "CategoryId": 20029,
    //     //     "CategoryName": "HEMATOLOGY",
    //     //     "PatientName": "Miss Raksha Rajesh Netalkar",
    //     //     "VisitDate": "2026-07-28T00:00:00",
    //     //     "VisitTime": "2026-07-28T11:48:41",
    //     //     "OPDNo": "OP/07/2026/140",
    //     //     "ConsultantDocName": "DEMO demo",
    //     //     "AgeYear": "25        ",
    //     //     "RegNo": "3242",
    //     //     "CompanyName": "",
    //     //     "PathResultDrName": "Kavita j",
    //     //     "PathResultDr1": 70403,
    //     //     "SuggestionNote": "askjal adsjlkjasd dsaaskjal adsjlkjasd dsa\naskjal adsjlkjasd dsa\naskjal adsjlkjasd dsa\naskjal adsjlkjasd dsa\naskjal adsjlkjasd dsa\naskjal adsjlkjasd dsa\naskjal adsjlkjasd dsa",
    //     //     "FootNote": "",
    //     //     "MachineName": "",
    //     //     "TechniqueName": "",
    //     //     "UnitId": 5,
    //     //     "MinValue": 33,
    //     //     "MaxValue": 50,
    //     //     "PathReportdetid": 255768,
    //     //     "Formula": "",
    //     //     "ParaBoldFlag": "B",
    //     //     "OPD_IPD_ID": 535955,
    //     //     "OPD_IPD_Type": 0
    //     // }
    //     this._CasepaperService.getLabResultView(param).subscribe((response) => {

    //         if (response) {
    //             this.dsResultViewList.data = response;
    //             console.log(this.dsResultViewList.data)
    //         }
    //     });
    // }
    abnormal: boolean = false


    OnipRequest() {

        Swal.fire({
            title: 'Do you want to convert OP to IP?',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((flag) => {
            if (flag.isConfirmed) {
                const Convert = {
                    "visitId": this.vOPIPId,
                    "isConvertRequestForIp": true
                }
                this._CasepaperService.converOPtoIP(Convert).subscribe((response: any) => {
                    this._matDialog.closeAll()
                    this.grid.bindGridData();
                });
            }
        });

    }

    selectChangedepartment(obj: any) {

        console.log(obj)
        this.departmentId = obj.value;
        this.departmentName = obj.text;

        if (obj.value) {
            this._CasepaperService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
                this.ddlDoctor.options = data;
                this.ddlDoctor.bindGridAutoComplete();
            });
        } else {
            this._CasepaperService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
                console.log(data)
                if (data) {

                    this.ddlDoctor.options = data;
                    this.ddlDoctor.bindGridAutoComplete();
                    const incomingDoctorId = obj.consultantDocId || obj.doctorId;
                    if (incomingDoctorId) {
                        const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
                        if (matchedDoctor) {
                            this.MedicineItemForm.get('DoctorID')?.setValue(matchedDoctor.value);
                        }
                    }
                }
            });
        }
    }
    getLabResultview(row: any): void {
        // this._matDialog.open(LababnormalListComponent, {
        //     maxWidth: "95vw",
        //     height: '95%',
        //     width: '90%',
        //     data: {
        //         row: row,
        //         vOPIPId: this.vOPIPId,
        //         opipType:0
        //     }
        // })
    }

    onMicToggleChiefComplaint() {
        this.speechService.toggleRecognition(this.selectedLang, (text: string) => {
            this.chiefComplaintInput?.addChip(text);
        });
    }
    onMicToggleAssignDiagnosis() {
        this.speechService.toggleRecognition(this.selectedLang, (text: string) => {
            this.AssignDiagnosis?.addChip(text);
        });
    }
    onMicToggleAssignExamination() {
        this.speechService.toggleRecognition(this.selectedLang, (text: string) => {
            this.AssignExamination?.addChip(text);
        });
    }
}


export interface gridModel {
    apiUrl?: string;
    columnsList: any[];
    sortField?: string;
    sortOrder?: number;
    filters?: any[];
    row?: number;
    localData?: any[];
}

export class CasepaperVisitDetails {
    ItemID: any;
    ItemName: any;
    DoseId: any;
    DoseName: any;
    Days: any;
    DoseId1: any;
    DoseName1: any;
    Day1: any;
    DoseId2: any;
    DoseName2: any;
    Day2: any;
    Instruction: any;
    BP: string;
    ConsultantDocName: string;
    BSL: string;
    CasePaperID: number;
    Complaint: string;
    Diagnosis: string;
    DocName: string;
    Finding: string;
    Height: string;
    Investigations: string;
    PastHistory: string;
    PatientName: string;
    PersonalDetails: string;
    Pluse: string;
    BMI: any;
    PresentHistory: string;
    RegID: number;
    SecondDocRef: number;
    SpO2: string;
    VisitDate: any;
    PreviousVisitDate: any;
    VisitId: any;
    VisitTime: any;
    Weight: string;
    DrugName: string;
    TotalQty: number;
    HospitalName: string;
    HospitalAddress: string;
    Phone: number;
    IPPreId: number;
    GenderName: string;
    PrecriptionId: number;
    TotalDayes: number;
    AgeYear: number;
    OPDNo: any;
    // _matDialog: any;
    RegNo: any;
    Temp: any;
    DepartmentName: any;
    Address: any;
    SecondRefDoctorName: any;
    VistDateTime: any;
    Qty: any;
    mAssignDiagnosis: any[];
    mAssignChiefComplaint: any[];
    mAssignExamination: any[];
    regNoWithPrefix: any;
    visitId: any;
    regId: any;
    patientName: any;
    doctorname: any;
    opdNo: any;
    ageYear: any;
    ageMonth: any;
    ageDay: any;
    departmentName: any;
    patientType: any;
    tariffName: any;
    companyName: any;
    refDocName: any;
    classId: any;
    bmi: any;
    spO2: any;
    temp: any;
    pulse: any;
    bsl: any;
    bp: any;
    chiefComplaint: any
    diagnosis: any
    examination: any
    followupDate: any
    advice: any
    patientReferDocId: any
    drugName: any;
    tariffId: any;
    departmentId: any;
    doctorId: any
    MAssignService: ServiceDet[];
    MAssignService1: ServiceDet[];

    constructor(casePaperDetails) {
        this.BP = casePaperDetails.BP || '';
        this.ConsultantDocName = casePaperDetails.ConsultantDocName || '';
        this.BSL = casePaperDetails.BSL || '';
        this.BMI = casePaperDetails.BMI || '';
        this.CasePaperID = casePaperDetails.CasePaperID || 0;
        this.Complaint = casePaperDetails.Complaint || '';
        this.Diagnosis = casePaperDetails.Diagnosis || '';
        this.DocName = casePaperDetails.DocName || '';
        this.Finding = casePaperDetails.Finding || '';
        this.Height = casePaperDetails.Height || '';
        this.Investigations = casePaperDetails.Investigations || '';
        this.PastHistory = casePaperDetails.PastHistory || '';
        this.PatientName = casePaperDetails.PatientName || '';
        this.PersonalDetails = casePaperDetails.PersonalDetails || '';
        this.Pluse = casePaperDetails.Pluse || '';
        this.PresentHistory = casePaperDetails.PresentHistory || '';
        this.RegID = casePaperDetails.RegID || 0;
        this.SecondDocRef = casePaperDetails.SecondDocRef || 0;
        this.SpO2 = casePaperDetails.SpO2 || '';
        this.VisitDate = casePaperDetails.VisitDate || '';
        this.VisitId = casePaperDetails.VisitId || 0;
        this.VisitTime = casePaperDetails.VisitTime || '';
        this.Weight = casePaperDetails.Weight || '';
        this.DrugName = casePaperDetails.DrugName || '';
        this.TotalQty = casePaperDetails.TotalQty || '';
        this.HospitalName = casePaperDetails.HospitalName || '';
        this.HospitalAddress = casePaperDetails.HospitalAddress || '';
        this.Phone = casePaperDetails.Phone || '';
        this.IPPreId = casePaperDetails.IPPreId || '';
        this.DoseName = casePaperDetails.DoseName || '';
        this.Days = casePaperDetails.Days || 0;
        this.TotalDayes = casePaperDetails.TotalDayes || 0;
        this.GenderName = casePaperDetails.GenderName || '';
        this.OPDNo = casePaperDetails.OPDNo || '';
        this.AgeYear = casePaperDetails.AgeYear || 0;
        this.RegNo = casePaperDetails.RegNo || 0;
        this.Temp = casePaperDetails.Temp || 0;
        this.DepartmentName = casePaperDetails.DepartmentName || '';
        this.Address = casePaperDetails.Address || '';
        this.SecondRefDoctorName = casePaperDetails.SecondRefDoctorName || '';
        this.VistDateTime = casePaperDetails.VistDateTime || '';
        this.PreviousVisitDate = casePaperDetails.PreviousVisitDate || '';
        this.mAssignDiagnosis = casePaperDetails.mAssignDiagnosis || [];
        this.mAssignChiefComplaint = casePaperDetails.mAssignChiefComplaint || [];
        this.mAssignExamination = casePaperDetails.mAssignExamination || [];
        this.regNoWithPrefix = casePaperDetails.regNoWithPrefix || '';
        this.visitId = casePaperDetails.visitId || '';
        this.regId = casePaperDetails.regId || '';
        this.patientName = casePaperDetails.patientName || '';
        this.doctorname = casePaperDetails.doctorname || '';
        this.opdNo = casePaperDetails.opdNo || '';
        this.ageYear = casePaperDetails.ageYear || '';
        this.ageMonth = casePaperDetails.ageMonth || '';
        this.ageDay = casePaperDetails.ageDay || '';
        this.departmentName = casePaperDetails.departmentName || '';
        this.patientType = casePaperDetails.patientType || '';
        this.tariffName = casePaperDetails.tariffName || '';
        this.companyName = casePaperDetails.companyName || '';
        this.refDocName = casePaperDetails.refDocName || '';
        this.classId = casePaperDetails.classId || '';
        this.bmi = casePaperDetails.bmi || '';
        this.spO2 = casePaperDetails.spO2 || '';
        this.temp = casePaperDetails.temp || '';
        this.pulse = casePaperDetails.pulse || '';
        this.bsl = casePaperDetails.bsl || '';
        this.bp = casePaperDetails.bp || '';
        this.chiefComplaint = casePaperDetails.chiefComplaint || '';
        this.diagnosis = casePaperDetails.diagnosis || '';
        this.examination = casePaperDetails.examination || '';
        this.followupDate = casePaperDetails.followupDate || '';
        this.advice = casePaperDetails.advice || '';
        this.patientReferDocId = casePaperDetails.patientReferDocId || '';
        this.MAssignService = casePaperDetails.MAssignService;
        this.MAssignService1 = casePaperDetails.MAssignService1;
        this.tariffId = casePaperDetails.tariffId;
        this.departmentId = casePaperDetails.departmentId || 0;
        this.doctorId = casePaperDetails.doctorId || 0;


    }

    //Mike

}

export class ServiceDet {
    serviceId: any;
    serviceName: any;

    constructor(ServiceDet) {
        {
            this.serviceId = ServiceDet.serviceId || "";
            this.serviceName = ServiceDet.serviceName || "";
        }
    }
}

export class MedicineItemList {
    ItemID: any;
    ItemId: any;
    ItemName: string;
    DoseName: any;
    Days: number;
    DoseName1: any;
    Day1: number;
    DoseName2: any;
    Day2: number;
    Instruction: any;
    DoseId: any;
    DoseId1: any;
    DoseId2: any;
    Day: any;
    DaysOption2: any;
    DaysOption3: any;
    DoseNameOption2: any;
    DoseNameOption3: any;
    pWeight: any;
    DoseOption3: any;
    DoseOption2: any;
    ChiefComplaint: any;
    Pulse: any;
    BSL: any;
    BP: any;
    DrugName: any;
    Remark: any;
    InstructionDescription: any;
    InstructionId: any;
    DrugId: any;
    GenericName: any;
    PrecriptionId: any;
    OPD_IPD_IP: any;
    ClassID: any;
    ClassName: any;
    GenericId: any;
    pHeight: any;
    Diagnosis: any;
    Examination: any;
    Temp: any;
    Advice: any;
    BMI: any;
    SpO2: any;
    Doctorname: any;
    FollowupDate: any;
    QtyPerDay: any;
    Presid: any;
    mAssignItemToStores: [];
    bmi: any;
    spO2: any;
    temp: any;
    pulse: any;
    bsl: any;
    bp: any;
    chiefComplaint: any
    diagnosis: any
    examination: any
    followupDate: any
    advice: any
    doctorname: any
    patientReferDocId: any
    drugName: any;
    doseName: any;
    genericName: any;
    days: any;
    instruction: any;
    storeId: any;
    storeName: any;
    precriptionId: any;
    opD_IPD_IP: any;
    classID: any;
    className: any;
    genericId: any;
    drugId: any;
    doseId: any;
    instructionId: any;
    instructionDescription: any;
    remark: any;
    totalQty: any;
    qtyPerDay: any;
    doseOption2: any;
    doseNameOption2: any;
    daysOption2: any;
    doseOption3: any;
    doseNameOption3: any;
    daysOption3: any;
    genericid: any;
    allergy: any;
    bloodGroup: any;
    editable: any;
    departmentId: any
    historyOfIllness: any
    /**
    * Constructor
    *
    * @param MedicineItemList
    */
    constructor(MedicineItemList) {
        {
            this.ItemId = MedicineItemList.ItemId || 0;
            this.ItemID = MedicineItemList.ItemID || 0;
            this.ItemName = MedicineItemList.ItemName || "";
            this.Instruction = MedicineItemList.Instruction || '';
            this.DoseName = MedicineItemList.DoseName || '';
            this.Days = MedicineItemList.Days || 0;
            this.DoseName1 = MedicineItemList.DoseName1 || '';
            this.Day1 = MedicineItemList.Day1 || 0;
            this.DoseName2 = MedicineItemList.DoseName2 || '';
            this.Day2 = MedicineItemList.Day2 || 0;
            this.DoseId1 = MedicineItemList.DoseId1 || '';
            this.DoseId2 = MedicineItemList.DoseId2 || 0;
            this.DaysOption2 = MedicineItemList.DaysOption2 || 0;
            this.DaysOption3 = MedicineItemList.DaysOption3 || 0;
            this.DoseNameOption2 = MedicineItemList.DoseNameOption2 || '';
            this.DoseNameOption3 = MedicineItemList.DoseNameOption3 || '';
            this.ClassName = MedicineItemList.ClassName || '';
            this.GenericId = MedicineItemList.GenericId || 0;
            this.GenericName = MedicineItemList.GenericName || '';
            this.ClassID = MedicineItemList.ClassID || 0;
            this.DrugId = MedicineItemList.DrugId || 0;
            this.OPD_IPD_IP = MedicineItemList.OPD_IPD_IP || 0;
            this.PrecriptionId = MedicineItemList.PrecriptionId || 0;
            this.InstructionId = MedicineItemList.InstructionId || 0;
            this.Remark = MedicineItemList.Remark || '';
            this.DrugName = MedicineItemList.DrugName || '';
            this.drugName = MedicineItemList.drugName || '';
            this.BP = MedicineItemList.BP || 0;
            this.BSL = MedicineItemList.BSL || 0;
            this.Pulse = MedicineItemList.Pulse || 0;
            this.ChiefComplaint = MedicineItemList.ChiefComplaint || 0;
            this.DoseOption2 = MedicineItemList.DoseOption2 || 0;
            this.DoseOption3 = MedicineItemList.DoseOption3 || 0;
            this.pWeight = MedicineItemList.pWeight || 0;
            this.QtyPerDay = MedicineItemList.QtyPerDay || 0;
            this.mAssignItemToStores = MedicineItemList.mAssignItemToStores || [];
            this.pHeight = MedicineItemList.pHeight || 0;
            this.bmi = MedicineItemList.bmi || '';
            this.spO2 = MedicineItemList.spO2 || '';
            this.temp = MedicineItemList.temp || '';
            this.pulse = MedicineItemList.pulse || '';
            this.bsl = MedicineItemList.bsl || '';
            this.bp = MedicineItemList.bp || '';
            this.chiefComplaint = MedicineItemList.chiefComplaint || 0;
            this.diagnosis = MedicineItemList.diagnosis || '';
            this.examination = MedicineItemList.examination || '';
            this.followupDate = MedicineItemList.followupDate || '';
            this.advice = MedicineItemList.advice || '';
            this.doctorname = MedicineItemList.doctorname || '';
            this.patientReferDocId = MedicineItemList.patientReferDocId || '';
            this.doseName = MedicineItemList.doseName || ''
            this.genericName = MedicineItemList.genericName || ''
            this.days = MedicineItemList.days || ''
            this.storeId = MedicineItemList.storeId || ''
            this.storeName = MedicineItemList.storeName || ''
            this.instruction = MedicineItemList.instruction || ''
            this.precriptionId = MedicineItemList.precriptionId || ''
            this.opD_IPD_IP = MedicineItemList.opD_IPD_IP || ''
            this.classID = MedicineItemList.classID || ''
            this.className = MedicineItemList.className || ''
            this.genericId = MedicineItemList.genericId || ''
            this.drugId = MedicineItemList.durgId || ''
            this.doseId = MedicineItemList.doseId
            this.instructionId = MedicineItemList.instructionId
            this.instructionDescription = MedicineItemList.instructionDescription
            this.remark = MedicineItemList.remark
            this.totalQty = MedicineItemList.totalQty
            this.qtyPerDay = MedicineItemList.qtyPerDay
            this.doseOption2 = MedicineItemList.doseOption2
            this.doseNameOption2 = MedicineItemList.doseNameOption2
            this.daysOption2 = MedicineItemList.daysOption2
            this.doseOption3 = MedicineItemList.doseOption3
            this.doseNameOption3 = MedicineItemList.doseNameOption3
            this.daysOption3 = MedicineItemList.daysOption3
            this.genericid = MedicineItemList.genericid || 0
            this.allergy = MedicineItemList.allergy || ''
            this.bloodGroup = MedicineItemList.bloodGroup || ''
            this.editable = MedicineItemList.editable || ''
            this.departmentId = MedicineItemList.departmentId || 0
            this.historyOfIllness = MedicineItemList.historyOfIllness || ''


        }
    }
}

export class StoreDetail {
    storeId: any;
    // departmentName: any;

    constructor(StoreDetail) {
        {
            this.storeId = StoreDetail.storeId || "";
            // this.departmentName = StoreDetail.departmentName || "";
        }
    }
}

export class PrescriptionList {
    RegNo: any;
    PatientName: string;
    Date: any;
    Vst_Adm_Date: any;
    StoreName: any;
    PreNo: any;
    OPD_IPD_IP: any;
    AgeYear: any;
    GenderName: any;
    VisitDate: any;
    ConsultantDocName: any;
    DrugName: any;
    PrecriptionId: any;
    TotalQty: any;
    PDate: any;
    IPPreId: any;
    WardName: any;
    CompanyName: any;


    constructor(PrescriptionList) {
        this.RegNo = PrescriptionList.RegNo || 0;
        this.PatientName = PrescriptionList.PatientName || '';
        this.Date = PrescriptionList.Date || '01/01/1900';
        this.Vst_Adm_Date = PrescriptionList.Vst_Adm_Date || '01/01/1900';
        this.StoreName = PrescriptionList.StoreName || '01/01/1900';
        this.PreNo = PrescriptionList.PreNo || '';
        this.CompanyName = PrescriptionList.CompanyName || '01/01/1900';

    }
}

export class PrescriptiondetList {
    ItemName: any;
    Qty: number;

    constructor(PrescriptiondetList) {
        this.ItemName = PrescriptiondetList.ItemName;
        this.Qty = PrescriptiondetList.Qty;
    }
}

export class labRadList {

    labDate: Date;
    ServiceName: any;
    PatientType: any;
    BillNo: any;
    patientType: any;
    PathologyTestList: any[];
    Buttons: any;


    constructor(labRadList) {

        this.labDate = labRadList.labDate || '';
        this.ServiceName = labRadList.ServiceName || '';
        this.PatientType = labRadList.PatientType || '';
        this.BillNo = labRadList.BillNo || '';
        this.patientType = labRadList.patientType || '';
        this.PathologyTestList = labRadList.PathologyTestList || '';
    }
}