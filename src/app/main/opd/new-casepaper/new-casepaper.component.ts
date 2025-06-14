import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { map, Observable, startWith } from 'rxjs';
import { CasepaperService } from './casepaper.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import Swal from 'sweetalert2';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfigService } from 'app/core/services/config.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { DosemasterComponent } from 'app/main/setup/prescription/dosemaster/dosemaster.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { AddItemComponent } from './add-item/add-item.component';
import { PrePresciptionListComponent } from './pre-presciption-list/pre-presciption-list.component';
import { PrescriptionTemplateComponent } from './prescription-template/prescription-template.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { LanguageOption, SpeechRecognitionService } from 'app/main/shared/services/speech-recognition.service';
import { setValue } from '@ngx-translate/core';

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

  selectedLang = 'en-US';
  languages: LanguageOption[] = [];

  displayedItemColumn: string[] = [
    'ItemName',
    'ItemGenericName',
    'DoseName',
    'Days',
    'Remark',
    'Action'
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
  screenFromString = 'OP-billing';
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
  vDays: any = 10;
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

  dsItemList = new MatTableDataSource<MedicineItemList>();
  dsCopyItemList = new MatTableDataSource<MedicineItemList>();

  autocompleteModeItem: string = "Item"; //ItemType
  autocompleteModeItemGeneric: string = "ItemGeneric";
  autocompleteModeDose: string = "DoseMaster";
  autocompleteModeTemplate: string = "PrescriptionTemplateMaster";
  autocompleteModeServcie: string = "Service"; //ServiceName
  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteModeDiagnosis: string = "CasepaperDignosis";

  vstoreId = this._loggedService.currentUserValue.user.storeId;

  @ViewChild('ddlDiagnosis') ddlDiagnosis: AirmidDropDownComponent;
  @ViewChild('ddlChiefComplaint') ddlChiefComplaint: AirmidDropDownComponent;
  @ViewChild('ddlExamination') ddlExamination: AirmidDropDownComponent;
  @ViewChild('ddlService') ddlService: AirmidDropDownComponent;

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
    public speechService: SpeechRecognitionService
  ) { }

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

    this.MedicineItemform();
    this.specificDate = new Date();
    this.dateStyle = 'Day'
    this.onDaysChange();

    if (this.data) {
      this.regObj = this.data
      console.log(this.regObj)
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
      this.getPrescription(this.regObj);
      this.getnewVisistListDemo(this.regObj);
      this.getRtrvTestServiceList(this.regObj);  //retrive list
      this.getRtrvCheifComplaintList(this.regObj); // retrive list
      // this.getCheifComplaintList();
    }

    setTimeout(() => {
      this._CasepaperService.getVisitById(this.VisitId).subscribe(data => {
        // this.patientDetail1 = data;
        // console.log(data)
        this.vHeight = data.height
        this.vWeight = data.pweight
        this.vBSL = data.bmi
        this.vBMI = data.bmi
        this.vBP = data.bp
        this.vTemp = data.temp
        this.vSpO2 = data.spO2
        this.vPulse = data.pulse
      });
    }, 500);
  }
  onLangChange() {
    // console.log(this.selectedLang);
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

  removedignosis(item) {
    let removedIndex = this.caseFormGroup.value.mAssignDiagnosis.findIndex(x => x.id === item.id);

    if (removedIndex !== -1) {
      this.caseFormGroup.value.mAssignDiagnosis.splice(removedIndex, 1);

      this.ddlDiagnosis.SetSelection(this.caseFormGroup.value.mAssignDiagnosis.map(x => x.id));

      this.addDiagnolist = this.caseFormGroup.value.mAssignDiagnosis.map(x => ({
        id: x.id,
        descriptionName: x.descriptionName
      }));

      // console.log("Updated addDiagnolist after removal:", this.addDiagnolist);
    }
  }

  removeChiefComplaint(item) {

    let removedIndex = this.caseFormGroup.value.mAssignChiefComplaint.findIndex(x => x.complaintId === item.complaintId);

    if (removedIndex !== -1) {
      this.caseFormGroup.value.mAssignChiefComplaint.splice(removedIndex, 1);

      this.ddlChiefComplaint.SetSelection(this.caseFormGroup.value.mAssignChiefComplaint.map(x => x.complaintId));

      this.addCheiflist = this.caseFormGroup.value.mAssignChiefComplaint.map(x => ({
        complaintId: x.complaintId,
        complaintDescr: x.complaintDescr
      }));

      // console.log("Updated addCheiflist after removal:", this.addCheiflist);
    }
  }

  removeExamination(item) {

    let removedIndex = this.caseFormGroup.value.mAssignExamination.findIndex(x => x.examinationId === item.examinationId);

    if (removedIndex !== -1) {
      this.caseFormGroup.value.mAssignExamination.splice(removedIndex, 1);

      this.ddlExamination.SetSelection(this.caseFormGroup.value.mAssignExamination.map(x => x.examinationId));

      this.addExaminlist = this.caseFormGroup.value.mAssignExamination.map(x => ({
        examinationId: x.examinationId,
        examinationDescr: x.examinationDescr
      }));

      // console.log("Updated addExaminlist after removal:", this.addExaminlist);
    }
  }

  removeService(item) {
    let removedIndex = this.caseFormGroup.value.mAssignService.findIndex(x => x.serviceId === item.serviceId);

    if (removedIndex !== -1) {
      this.caseFormGroup.value.mAssignService.splice(removedIndex, 1);

      this.ddlService.SetSelection(this.caseFormGroup.value.mAssignService.map(x => x.serviceId));

      this.selectedItems = this.caseFormGroup.value.mAssignService.map(x => ({ serviceId: x.serviceId }));

      // console.log("Updated selectedItems after removal:", this.selectedItems);
    }
  }

  onDaysChange() {
    const today = new Date();
    let followUp = new Date(today);

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
  createForm() {
    return this._formBuilder.group({
      LetteHeadRadio: ['NormalHead'],
      LangaugeRadio: ["true"],
      Height: ['', [Validators.required, Validators.maxLength(20),
      this._FormvalidationserviceService.allowEmptyStringValidator()]],
      Weight: ['', [Validators.required, Validators.maxLength(20),
      this._FormvalidationserviceService.allowEmptyStringValidator()]],
      BMI: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      BSL: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      SpO2: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      Pulse: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      BP: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      Temp: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      ChiefComplaint: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      serviceId: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      Diagnosis: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      Examination: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      ExaminationControl: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      DiagnosisControl: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      CheifComplaintControl: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      mAssignChiefComplaint: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
      mAssignDiagnosis: ['', [this._FormvalidationserviceService.allowEmptyStringValidator]],
      mAssignExamination: ['', [this._FormvalidationserviceService.allowEmptyStringValidator]],
      mAssignService: ['', [this._FormvalidationserviceService.allowEmptyStringValidator]],
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
      DoctorID: '',
      Departmentid: '',
      FollowupDays: '',
      start: [new Date()],
      Remark: ['', [Validators.maxLength(200)]],
      Days: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
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
          visitId: [null], 
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
      instruction: [element.Instruction ?? element.instructionDescription ?? ''],
      remark: [element.remark ?? ''],
      doseOption2: [0],
      daysOption2: [0],
      doseOption3: [0],
      daysOption3: [0],
      instructionId: [0],
      qtyPerDay: [element.QtyPerDay ?? element.qtyPerDay ?? 0],
      totalQty: [(element.QtyPerDay * element.Days) || (element.qtyPerDay * element.days) || 0,
      [this._FormvalidationserviceService.onlyNumberValidator()]],
      isClosed: true,
      isEnglishOrIsMarathi: [true],
      chiefComplaint: [element.chiefComplaint ?? ''],
      diagnosis: [element.diagnosis ?? ''],
      examination: [element.examination ?? ''],
      height: [element.pHeight ?? ''],
      pweight: [element.pWeight ?? ''],
      bmi: [element.bmi ?? ''],
      bsl: [element.bsl ?? ''],
      spO2: [element.spO2 ?? ''],
      temp: [element.temp ?? ''],
      pulse: [element.pulse ?? ''],
      bp: [element.bp ?? ''],
      storeId: [this._loggedService.currentUserValue.user.storeId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      patientReferDocId: [element.patientReferDocId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      advice: [element.advice ?? ''],
      isAddBy: [this._loggedService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]]
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
      descriptionName: [element.descriptionName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]]
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
          descriptionName: element.complaintDescr,
          descriptionType: "Complaint"
        });
      });
    }

    if (this.addDiagnolist.length > 0) {
      this.addDiagnolist.forEach(element => {
        this.AllTypeDescription.push({
          descriptionName: element.descriptionName,
          descriptionType: "Diagnosis"
        });
      });
    }

    if (this.addExaminlist.length > 0) {
      this.addExaminlist.forEach(element => {
        this.AllTypeDescription.push({
          descriptionName: element.examinationDescr,
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

    if (!this.caseFormGroup.invalid && !this.casePaperInsertForm.invalid) {
      this.tPrescriptionArray.clear();
      if (this.dsItemList.data.length === 0) {
        this.toastr.warning('Please add prescription!', 'Warning');
        return; // Stop further execution
      }
      this.dsItemList.data.forEach((item, index) => {
        const group = this.createtPrescription(item);
        group.get('advice').setValue(this.MedicineItemForm.get('Remark').value);
        group.get('remark').setValue(this.MedicineItemForm.get('Remark').value);
        group.get('isEnglishOrIsMarathi').setValue(JSON.parse(this.caseFormGroup.get('LangaugeRadio').value));
        group.get('chiefComplaint').setValue(this.caseFormGroup.get('ChiefComplaint').value);
        group.get('diagnosis').setValue(this.caseFormGroup.get('Diagnosis').value);
        group.get('examination').setValue(this.caseFormGroup.get('Examination').value);
        group.get('height').setValue(this.caseFormGroup.get('Height').value);
        group.get('pweight').setValue(this.caseFormGroup.get('Weight').value);
        group.get('bmi').setValue(String(this.caseFormGroup.get('BMI').value));
        group.get('bsl').setValue(this.caseFormGroup.get('BSL').value);
        group.get('spO2').setValue(this.caseFormGroup.get('SpO2').value);
        group.get('pulse').setValue(this.caseFormGroup.get('Pulse').value);
        group.get('bp').setValue(this.caseFormGroup.get('BP').value);
        group.get('temp').setValue(this.caseFormGroup.get('Temp').value);
        group.get('patientReferDocId').setValue(Number(ReferDocNameID));

        this.tPrescriptionArray.push(group);
      });

      // 2nd detail
      this.topRequestListArray.clear();
      if (this.selectedItems.length === 0) {
        const opRequestListFormGroup: FormGroup = this.createtopRequestList({ serviceId: 0 });
        this.topRequestListArray.push(opRequestListFormGroup);
      } else {
        this.selectedItems.forEach(element => {
          const opRequestListFormGroup: FormGroup = this.createtopRequestList(element);
          this.topRequestListArray.push(opRequestListFormGroup);
        });
      }

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
      console.log('form:', this.casePaperInsertForm.value);

      this._CasepaperService.onSaveCasepaper(this.casePaperInsertForm.value).subscribe(response => {

        if (this.caseFormGroup.get("LetteHeadRadio").value == 'LetterHead')
          this.OnViewReportWithHeaderPdf(this.VisitId)
        else
          this.OnViewReportWithoutHeaderPdf(this.VisitId)
        this.getWhatsappshareSales(this.vOPIPId, this.vMobileNo)
        this.onClear();
        this.onClose();
      });
    } else {
      let invalidFields: string[] = [];
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
      console.log(obj)
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
    // this.getVitalInfo(obj);
    this.getRtrvTestServiceList(obj); // retrive list
    this.getRtrvCheifComplaintList(obj); // retrive list
  }

  getPrescription(obj) {
    // debugger
    this.visitIdRefresh = obj.visitId;
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "VisitId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "VisitId",
          "fieldValue": String(obj.visitId),
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }
    console.log("VisitId:", m_data2)
    this._CasepaperService.RtrvPreviousprescriptionDetailsdemo(m_data2).subscribe(Visit => {
      this.dsItemList.data = Visit?.data as MedicineItemList[];
      if (this.dsItemList.data)

        console.log("bbbbbbbb:", this.dsItemList.data);
      this.Chargelist = this.dsItemList.data;

      if (this.dsItemList.data.length > 0) {
        for (let item of this.dsItemList.data) {
          this.caseFormGroup.patchValue({
            Height: item.pHeight,
            Weight: item.pWeight,
            BMI: item.bmi,
            BSL: item.bsl,
            SpO2: item.spO2,
            Pulse: item.pulse,
            BP: item.bp,
            Temp: item.temp
          });

          this.vChiefComplaint = item.chiefComplaint;
          this.vDiagnosis = item.diagnosis;
          this.vExamination = item.examination;
          this.PrefollowUpDate = this.datePipe.transform(item.followupDate, 'MM/dd/YYYY');
          // this.MedicineItemForm.get('start').setValue(new Date(this.PrefollowUpDate));
          this.MedicineItemForm.get('Remark').setValue(item.advice)
          this.RefDocName = item.doctorname
          this.vDrugName = item.drugName
          this.vDoseName = item.doseName
          this.vItemGN = item.genericName
          this.vDayys = item.days
          this.vInst = item.instruction
          this.MedicineItemForm.get("DoctorID").setValue(item.patientReferDocId)
        }
      }
    });

  }

  getRtrvCheifComplaintList(obj) {
    // debugger
    this.addCheiflist = [];
    this.addDiagnolist = [];
    this.addExaminlist = [];
    this.AllTypeDescription = [];

    const vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "VisitId",
      "sortOrder": 0,
      "filters": [
        { "fieldName": "VisitId", "fieldValue": String(obj.visitId), "opType": "Equals" }
      ],
      "Columns": [],
      "exportType": "JSON"
    };

    this._CasepaperService.getRtrvCheifComplaintList1(vdata).subscribe(response => {
      console.log("three response:", response);

      if (response && Array.isArray(response.data)) {
        debugger
        this.RtrvDescriptionList = response.data;
        let ChiefComplaint = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Complaint');
        this.addCheiflist = [];
        if (ChiefComplaint.length > 0) {
          ChiefComplaint.forEach(element => {
            this.addCheiflist.push(
              {
                complaintId: element.id,
                complaintDescr: element.descriptionName,
              }
            )
          })
          console.log('About to set addCheiflist:', this.addCheiflist);
          // setTimeout(() => {
            this.caseFormGroup.get('mAssignChiefComplaint').setValue(this.addCheiflist);
          // }, 100);
          // const currentValue = this.caseFormGroup.get('mAssignChiefComplaint')?.value;
          // this.caseFormGroup.get('mAssignChiefComplaint')?.setValue([...currentValue]);
        }
        console.log("demommmm:", this.caseFormGroup.get('mAssignChiefComplaint').value)
        // Process Diagnosis
        let Diagnosis = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Diagnosis');
        if (Diagnosis.length > 0) {
          Diagnosis.forEach(element => {
            this.addDiagnolist.push(
              {
                id: element.id,
                descriptionName: element.descriptionName
              }
            )
          })
          setTimeout(() => {
            this.caseFormGroup.get('mAssignDiagnosis').setValue(this.addDiagnolist);
          }, 100)
          // this.ddlDiagnosis.SetSelection(this.addDiagnolist);
        }
        // Process Examination
        let Examination = this.RtrvDescriptionList.filter(item => item.descriptionType === 'Examination');
        if (Examination.length > 0) {
          Examination.forEach(element => {
            this.addExaminlist.push(
              {
                examinationId: element.id,
                examinationDescr: element.descriptionName
              }
            )
          });
          // this.caseFormGroup.get('mAssignExamination').setValue(this.addExaminlist);
          setTimeout(() => {
            this.caseFormGroup.get('mAssignExamination').setValue(this.addExaminlist);
          }, 100)
          // this.ddlExamination.SetSelection(this.addExaminlist);
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
    }
  }

  selectChangeItemName(row) {
    // debugger
    console.log("itemData:", row)
    this.durgId = row.itemId
    this.durgName = row.itemName
    this.vdoseName = row.doseName
    this.vDay = row.doseDay
    this.vInstruction = row.instruction

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
          console.log("all data:", this.itemObjects)
          this.vItemGenericNameId = this.itemObjects.itemGenericNameId

          if ((this.vItemGenericNameId ?? 0) > 0) {
            setTimeout(() => {
              this._CasepaperService.getItemGenericById(this.vItemGenericNameId).subscribe((response) => {
                this.itemGeneric = response;
                this.vItemGenericName = this.itemGeneric.itemGenericName
              });
            }, 500);
          }
        });
      }, 500);
    }
  }

  selectChangeItemGenericName(row) {
    console.log("GenericName:", row)
    this.vItemGenericNameId = row.value
    this.vItemGenericName = row.text
  }

  editItem(index: number, data) {
    this.editingIndex1 = index;
    this.originalValue = data.genericName;
  }

  OnSaveEditGeneric(contact) {
    this.vPrescriptionId = contact.precriptionId || contact.PrecriptionId;
    if (this.vPrescriptionId) {
      var m_dataUpdate = {
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
    var m_data2 = {
      "first": 0,
      "rows": 10,
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
    console.log("VisitId:", m_data2)
    this._CasepaperService.RtrvPreviousprescriptionDetailsdemo(m_data2).subscribe(Visit => {
      // debugger
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
            Instruction: element.instruction,
            PrecriptionId: element.precriptionId || 0
          });
      })
      this.dsItemList.data = this.Chargelist
      console.log(this.dsItemList.data)
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
      var m_dataUpdate = {
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
    const selectedData = Array.isArray(row) ? row : [row]; // Convert single data to array

    this.selectedItems = selectedData.map(item => ({ serviceId: item.serviceId }));

    // console.log("Updated selectedItems:", this.selectedItems);
  }

  RtrvTestServiceList: any = [];
  getRtrvTestServiceList(obj) {
    // 
    var m_data2 = {
      "first": 0,
      "rows": 10,
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
      console.log("Extracted data array::", this.RtrvTestServiceList)
      if (Array.isArray(this.RtrvTestServiceList) && this.RtrvTestServiceList.length > 0) {
        this.RtrvTestServiceList.forEach(element => {
          this.selectedItems.push({
            serviceId: element.serviceId || 0,
            serviceName: element.serviceName || ''
          });
        });
        this.caseFormGroup.get('mAssignService').setValue(this.selectedItems);
        // console.log("sdsdssd:", this.selectedItems);
      }
    })
  }

  selectChangeDoctorName(row) {
  }
// 
  selectChangeChiefComplaint(row) {
    const selectedData = Array.isArray(row) ? row : [row];
    this.addCheiflist = selectedData.map(item => ({
      complaintId: item.complaintId,
      complaintDescr: item.complaintDescr
    }));
    console.log("Updated selectedItems:", this.addCheiflist);
  }

  selectChangeDiagnosis(row) {
    const selectedData = Array.isArray(row) ? row : [row];
    this.addDiagnolist = selectedData.map(item => ({
      id: item.id,
      descriptionName: item.descriptionName
    }));
    // console.log("Updated selectedItems:", this.addDiagnolist);
  }

  selectChangeExamination(row) {
    const selectedData = Array.isArray(row) ? row : [row];
    this.addExaminlist = selectedData.map(item => ({
      examinationId: item.examinationId,
      examinationDescr: item.examinationDescr
    }));
    // console.log("Updated selectedItems:", this.addExaminlist);
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
      Examination: []
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

  Day1: any = 0;
  Day2: any = 0;
  onAdd() {

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
    if ((this.vDay == '' || this.vDay == null || this.vDay == undefined)) {
      this.toastr.warning('Please enter a Day', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    // console.log('Before push, Chargelist:', this.Chargelist);
    // console.log('Is Chargelist an array?', Array.isArray(this.Chargelist));

    if (!Array.isArray(this.Chargelist)) {
      console.warn("Chargelist was not an array. Resetting...");
      this.Chargelist = [...this.dsItemList.data];
    }

    const iscekDuplicate = this.dsItemList.data.some(item => item.DrugId == this.durgId)
    if (!iscekDuplicate) {

      let Qty = this.DoseQtyPerDay || 0

      let newEntry = {
        DrugId: this.durgId || 0,
        DrugName: this.durgName || '',
        DoseId: this.doseId || 0,
        GenericName: this.vItemGenericName || '',
        GenericId: this.vItemGenericNameId || 1,
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
        Instruction: this.MedicineItemForm.get("Instruction").value || ''
      };
      this.Chargelist.push(newEntry);
      this.dsItemList.data = [...this.Chargelist];

      console.log(this.dsItemList.data);
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
  }

  deleteTableRow(event, element) {

    let index = this.Chargelist.indexOf(element);
    if (index >= 0) {
      this.Chargelist.splice(index, 1);
      this.dsItemList.data = [];
      this.dsItemList.data = this.Chargelist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  selectChangeTemplateName(row) {
    this.templateId = row.value
    this.templateName = row.text
  }
  itemObjects1: any[] = [];

  onTemplDetAdd() {
    // debugger
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
      var vdata = {
        "first": 0,
        "rows": 10,
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
      console.log(vdata)
      this._CasepaperService.getTempPrescriptionList(vdata).subscribe(data => {
        this.dsItemList.data = data.data as MedicineItemList[];
        this.Chargelist = data.data as MedicineItemList[];
        // console.log(this.dsItemList.data)
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

  onClose() {
    this.caseFormGroup.reset({ LangaugeRadio: ["true"] });
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
    this.vDays = 10
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
      var m_data = {
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
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  // ///[^a-zA-Z0-9]/
  keyPressOk(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^[0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  @ViewChild('ChiefComp') ChiefComp: ElementRef;
  @ViewChild('EHeight') EHeight: ElementRef;
  @ViewChild('EBSL') EBSL: ElementRef;
  @ViewChild('EWeight') EWeight: ElementRef;
  @ViewChild('ESpO2') ESpO2: ElementRef;
  @ViewChild('EPulse') EPulse: ElementRef;
  @ViewChild('EBMI') EBMI: ElementRef;
  @ViewChild('EBP') EBP: ElementRef;
  @ViewChild('ETemp') ETemp: ElementRef;
  @ViewChild('deptdoc') deptdoc: ElementRef;
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('dosename') dosename: ElementRef;
  @ViewChild('Day') Day: ElementRef;
  @ViewChild('Instruction') Instruction: ElementRef;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  public onEnterdept(event): void {
    if (event.which === 13) {
      this.deptdoc.nativeElement.focus();
    }
  }
  public onEnterHeight(event): void {
    if (event.which === 13) {
      this.EWeight.nativeElement.focus();
    }
  }
  public onEnterWeight(event): void {
    if (event.which === 13) {
      this.EBSL.nativeElement.focus();
    }
  }
  public onEnterBSL(event): void {
    if (event.which === 13) {
      this.ESpO2.nativeElement.focus();
    }
  }
  public onEnterSpO2(event): void {
    if (event.which === 13) {
      this.EPulse.nativeElement.focus();
    }
  }
  public onEnterPulse(event): void {
    if (event.which === 13) {
      this.EBP.nativeElement.focus();
    }
  }
  public onEnterBMI(event): void {
    if (event.which === 13) {
    }
  }
  public onEnterBP(event): void {
    if (event.which === 13) {
      this.ETemp.nativeElement.focus();
    }
  }
  onEnterTemp(event): void {
    if (event.which === 13) {
      this.ChiefComp.nativeElement.focus();
    }
  }

  public onEnterqty(event): void {
    if (event.which === 13) {
      this.Instruction.nativeElement.focus();
    }
  }
  public onEnterremark(event): void {
    if (event.which === 13) {
      this.addbutton.focus;
      this.add = true;
    }
  }
  public onEnterChiefComplaint(event): void {
    // if (event.which === 13) {
    //   this.addbutton.focus;
    //   this.add = true;
    // }
  }

  onChangeLangaugeRadio(event) {

  }
  LetterheadFilter(event) {

  }

  //datewise visit info and table data
  patients: any[] = []; // Using 'any' type for simplicity
  uniqueDates: string[] = [];
  displayedColumns: string[] = ['patientName', 'age', 'gender'];

  getnewVisistListDemo(obj) {
    // 
    var D_data = {
      "first": 0,
      "rows": 10,
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
    console.log(D_data);
    this._CasepaperService.getRtrvVisitedListdemo(D_data).subscribe(Visit => {
      this.patients = Visit?.data as MedicineItemList[];
      this.extractUniqueDates();
      // console.log("visitPatient info:", this.patients)
    });
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
        ;
        this.dsCopyItemList.data = result;
        // console.log("this.dsCopyItemList.data:", this.dsCopyItemList.data);

        if (!this.dsItemList.data) {
          this.dsItemList.data = [];
        }

        this.Chargelist = [...this.dsItemList.data];

        this.dsCopyItemList.data.forEach(element => {

          const chkitem = this.dsItemList.data.find(item =>
            item.DrugId === element.drugId || item.drugId === element.drugId
          );

          // console.log("this.dsItemList.data before insert:", this.dsItemList.data);

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
              Instruction: element.instruction,
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
          } else {
            this.toastr.warning('This Drug is already added', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
          }
        });

        // console.log("Final dsItemList.data:", this.dsItemList.data);
      }

    });
  }

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
          Obj: this.dsItemList.data
        }
      });
    dialogRef.afterClosed().subscribe(result => {
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
    });
  }
  getDosemaster() {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this._matDialog.open(DosemasterComponent,
      {
        maxWidth: "85vw",
        height: '85%',
        width: '70%',
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //  that.grid.bindGridData();
      }
    });
  }

  //Cheifcomplaint
  addCheif(event: any): void {
    const input = event.input;
    const value = event.value;
    // Add cheif
    if ((value || '').trim()) {
      this.addCheiflist.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }
  selectedobjCheif1(obj): void {
    const value = obj.ChiefComplaint;
    if ((value || '').trim()) {
      this.addCheiflist.push(value.trim());
    }
  }
  //Diagnosis
  addDiagnos(event: any): void {
    const input = event.input;
    const value = event.value;
    // Add cheif
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

  MAssignService: ServiceDet[];

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
  }


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
      this.genericid = MedicineItemList.genericid
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

