import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidChipautocompleteComponent } from 'app/main/shared/componets/airmid-chipautocomplete/airmid-chipautocomplete.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { IpdEmrService } from './ipd-emr.service';
import { MatTableDataSource } from '@angular/material/table';
import { PatientList } from '../clinical-care-chart/clinical-care-chart.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { RegInsert } from 'app/main/opd/registration/registration.component';

@Component({
  selector: 'app-ipd-emr',
  templateUrl: './ipd-emr.component.html',
  styleUrls: ['./ipd-emr.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IpdEMRComponent implements OnInit {

  BloodGroupNames: string[] = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Not Available"];
  autocompleteModerelationship: string = "Relationship";
  autocompleteward: string = "Room";

  isLoading: string = '';
  sIsLoading: string = "";
  WardList: any = [];
  isRegIdSelected: boolean = false;
  //screenFromString:'fromdate-form';
  screenFromString1 = 'admission-form';
  screenFromString = 'admission-form';
  dateTimeObj: any;
  isWardNameSelected: boolean = false;
  wardListfilteredOptions: Observable<string[]>;
  vWardId: any;
  checkDailyWeight: boolean = false;
  vDepartmentName: any;
  vpatientName: any;
  vDoctorname: any;
  vAgeYear: any;
  vAgeDay: any;
  vAgeMonth: any;
  vRegNo: any;
  vDailyWeight: any;
  painLevel: any;
  additionalNotes: any;
  painLocation: any;

  isShowDetailTable: boolean = false;
  isShowDetailTable2: boolean = false;

  // registerObj: any;
  registerObj = new RegInsert({});
  vAdmissionId: any;
  vipdNo: any;
  vRegId: any;
  isShowPrintButtons: boolean = false;
  mAssignProDiagnosis: any[];
  mAssignChiefComplaint: any[];
  mAssignExamination: any[];
  mAssignFinalDiagnosis: any[];
  addCheiflist: any[] = [];
  addProDiagnolist: any = [];
  addExaminlist: any[] = [];
  addFinalDiagnolist: any = [];
  vHeight: any;
  vWeight: any;
  vBSL: any;
  vBMI: any;
  vBP: any;
  VisitId: any;
  vTemp: any;
  vSpO2: any;
  vPulse: any;

  @ViewChild('chiefComplaintInput') chiefComplaintInput: AirmidChipautocompleteComponent;

  autocompleteModebloodGroup: string = "BloodGroupTypes";

  dsFamilyHistoryList = new MatTableDataSource<FamilyHistoryList>();
  dsClinicalcarePatient = new MatTableDataSource<PatientList>();
  Chargelist: any[] = [];
  relationshipName: any;

  MyForm!: FormGroup;
  familyHistoryForm!: FormGroup;
  vitalsForm: FormGroup;
  emrForm!: FormGroup;
  AllCompExmDescription: any = []
  AllProFinalDiagnosisDescription: any = []

  displayedColumns: string[] = [
    'MemberName',
    'RelationshipId',
    'Age',
    'ClinicalHistory',
    'Duration',
    'Action'
  ]


  constructor(
    public _IpdEmrService: IpdEmrService,
    public toastr: ToastrService,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  ngOnInit(): void {
    this.getPatientListwardWise();
    this.MyForm = this.createMyForm()

    this.createEMRForm();

    this.familyHistoryForm = this.createFamilyMedicalHistory();

    this.vitalsForm = this.createVitalsForm();
  }

  createMyForm(): FormGroup {
    return this._formbuilder.group({
      WardName: [''],
      RegID: [''],
      PatientName: [''],
      BloodGroup: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(3)]],
      mAssignChiefComplaint: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
      mAssignProDiagnosis: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
      mAssignFinalDiagnosis: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
      mAssignExamination: [[], [this._FormvalidationserviceService.allowEmptyStringValidator]],
    });
  }


  createEMRForm() {
    this.emrForm = this._formbuilder.group({
      // Main EMR fields
      ipdEmrId: [0],
      opipid: [0],
      opiptype: [1],
      socialHabits: [''],
      bloodGroup: [''],
      medicalHistory: [''],
      familyMedicalHistory: [''],
      provisional: [''],
      finalDiagnosis: [''],
      chiefComplaints: [''],
      examination: [''],
      currentMedications: [''],
      normalAllergy: [''],
      drugAllergy: [''],
      allergyRemark: [''],

      // Diagnosis Information
      tIpEmrdiagnosisInfos: this._formbuilder.array([]),

      // Diagnosis History
      tIpEmrdignosisHistories: this._formbuilder.array([]),

      // Family Medical History
      tIpEmrfamilyMedicalHistories: this._formbuilder.array([]),

      // Vitals
      tIpEmrVitals: this._formbuilder.array([])

    });
  }


  /////////////////////////////////Diagnosis Information FormArray////////////////////////////
  get diagnosisInfosArray(): FormArray {
    return this.emrForm.get('tIpEmrdiagnosisInfos') as FormArray;
  }

  createDiagnosisInfo(element: any = {}): FormGroup {
    return this._formbuilder.group({
      ipemrdiagnId: [0],
      ipemrid: [0],
      admId: [this.vAdmissionId],
      diagnosis: [element.diagnosisName ?? ''],
      icdcode: [element.icdcode ?? ''],
      diagnosisinformation: [element.descriptionName ?? ''],
      flagCode: [element.descriptionType]
    });
  }

  // addDiagnosisInfo(): void {
  //   this.diagnosisInfos.push(this.createDiagnosisInfo());
  // }

  // removeDiagnosisInfo(index: number): void {
  //   this.diagnosisInfos.removeAt(index);
  // }
  /////////////////////////////////End Of Diagnosis Information FormArray////////////////////////////

  /////////////////////////////////Diagnosis History FormArray////////////////////////////
  get diagnosisHistoriesArray(): FormArray {
    return this.emrForm.get('tIpEmrdignosisHistories') as FormArray;
  }

  // pass here complaint & examination
  createDiagnosisHistory(element: any = {}): FormGroup {
    return this._formbuilder.group({
      emrdignId: [0],
      ipemrid: [0],
      admissionId: [this.vAdmissionId],
      descriptionType: [element.descriptionType ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      descriptionName: [element.descriptionName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      icdcode: [element.icdcode ?? ''],
      diagnosisName: [element.diagnosisName ?? ''],
      diagnosisInfo: ['']
    });
  }

  // addDiagnosisHistory(): void {
  //   this.diagnosisHistories.push(this.createDiagnosisHistory());
  // }

  // removeDiagnosisHistory(index: number): void {
  //   this.diagnosisHistories.removeAt(index);
  // }
  /////////////////////////////////End Of Diagnosis History FormArray////////////////////////////

  /////////////////////////////////Family Medical History FormArray////////////////////////////
  get familyMedicalHistoriesArray(): FormArray {
    return this.emrForm.get('tIpEmrfamilyMedicalHistories') as FormArray;
  }

  createFamilyMedicalHistory(element: any = {}): FormGroup {
    return this._formbuilder.group({
      fhistId: [0],
      ipEmrId: [0],
      regId: [this.vRegId ?? 0],
      opIpType: [1],
      admissionId: [this.vAdmissionId],
      relationshipId: [element.relationshipId ?? 0],
      memberName: [element.memberName ?? ''],
      age: [element.age ?? 0],
      clinicalHistory: [element.clinicalHistory ?? ''],
      duration: [element.duration ?? 0],
      genderId: [element.genderId ?? 0],
      summary: [element.summary ?? ''],
      status: [true]
    });
  }

  // addFamilyMedicalHistory(): void {
  //   this.familyMedicalHistories.push(this.createFamilyMedicalHistory());
  // }

  // removeFamilyMedicalHistory(index: number): void {
  //   this.familyMedicalHistories.removeAt(index);
  // }
  /////////////////////////////////End Of Family Medical History FormArray////////////////////////////

  /////////////////////////////////Vitals FormArray////////////////////////////
  get vitalsArray(): FormArray {
    return this.emrForm.get('tIpEmrVitals') as FormArray;
  }

  createVitalsForm(element: any = {}): FormGroup {
    return this._formbuilder.group({
      ipemrVitalId: [0],
      ipemrId: [0],
      opiptype: [1],
      opipid: [this.vAdmissionId],
      height: [element.height ?? '', [Validators.maxLength(20)]],
      weight: [element.weight ?? '', [Validators.maxLength(20)]],
      bmi: [element.bmi ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      bsl: [element.bsl ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      spo2: [element.spo2 ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
      temp: [element.temp ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      pulse: [element.pulse ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
      bp: [element.bp ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(10)]],
    });
  }

  /////////////////////////////////End Of Vitals FormArray////////////////////////////

  //////////////////////////////////////// main patient list ////////////////////////////////////////
  @ViewChild('grid5') grid5: AirmidTableComponent;
  gridConfig5: gridModel = new gridModel();
  pname = "%"
  wardid = '0'
  doctorid = '0'
  getPatientListwardWise() {
    this.gridConfig5 = {
      apiUrl: "ClinicalCare/AdmisionListNursingList",
      columnsList: [
        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ward Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Bed", key: "bedName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
      ],
      sortField: "RegNo",
      sortOrder: 0,
      filters: [
        { fieldName: "PatientName", fieldValue: this.pname, opType: OperatorComparer.Equals },
        { fieldName: "WardId", fieldValue: this.wardid, opType: OperatorComparer.Equals },
        { fieldName: "DoctorId", fieldValue: this.doctorid, opType: OperatorComparer.Equals }
      ]
    }
    setTimeout(() => {
      if (this.grid5) {
        this.grid5.gridConfig = this.gridConfig5;
        this.grid5.bindGridData();
      }
    });
  }

  onChangeFirst() {
    this.pname = (this.MyForm.get('PatientName')?.value || '') + '%'
    this.wardid = this.MyForm.get('WardName')?.value || '0'

    if (!this.wardid) {
      this.wardid = "0";
    }
    this.getPatientListwardWise();
  }

  getSelectedObjward(value: any): void {
    if (value.value !== 0)
      this.wardid = value.value
    else
      this.wardid = "0"
    this.onChangeFirst();
  }

  Clearfilter(event: string): void {
    if (event == 'PatientName')
      this.MyForm.get('PatientName').setValue("")
    this.onChangeFirst();
  }

  getpatientDet(obj: any): void {
    console.log(obj)

    this.isShowPrintButtons = true
    this.painLevel = 0

    this.registerObj = obj;
    this.vpatientName = obj.patientName;
    this.vDoctorname = obj.doctorName;
    this.vAgeYear = obj.ageYear;
    this.vDepartmentName = obj.departmentName
    this.vAgeMonth = obj.ageMonth;
    this.vAgeDay = obj.ageDay;
    this.vRegNo = obj.regNo;
    this.vAdmissionId = this.registerObj.admissionID
    this.vipdNo = this.registerObj.ipdNo
    this.vRegId = this.registerObj.regId ?? 0
  }
  //////////////////////////////////////// main patient list end ////////////////////////////////////////
  onClose() {

  }
  onSave() {

    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }

    if (this.addCheiflist.length > 0) {
      this.addCheiflist.forEach(element => {
        this.AllCompExmDescription.push({
          descriptionName: element.descriptionName,
          descriptionType: "Complaint"
        });
      });
    }

    if (this.addExaminlist.length > 0) {
      this.addExaminlist.forEach(element => {
        this.AllCompExmDescription.push({
          descriptionName: element.descriptionName,
          descriptionType: "Examination"
        });
      });
    }

    if (this.addProDiagnolist.length > 0) {
      this.addProDiagnolist.forEach(element => {

        this.AllProFinalDiagnosisDescription.push({
          descriptionName: element.descriptionName || element.icdCodeWithDignosis,
          descriptionType: "ProDiagnosis",
          icdcode: element.icdcode || '',
          diagnosisName: element.diagnosisName,
        });
      });
    }

    if (this.addFinalDiagnolist.length > 0) {
      this.addFinalDiagnolist.forEach(element => {

        this.AllProFinalDiagnosisDescription.push({
          descriptionName: element.descriptionName || element.icdCodeWithDignosis,
          descriptionType: "FinalDiagnosis",
          icdcode: element.icdcode || '',
          diagnosisName: element.diagnosisName,
        });
      });
    }

    this.diagnosisHistoriesArray.clear();
    this.AllCompExmDescription.forEach(element => {
      const chipComplaintExamination: FormGroup = this.createDiagnosisHistory(element);
      this.diagnosisHistoriesArray.push(chipComplaintExamination);
    });

    this.diagnosisInfosArray.clear();
    this.AllProFinalDiagnosisDescription.forEach(element => {
      const chiProFinalDiagnosis: FormGroup = this.createDiagnosisInfo(element);
      this.diagnosisInfosArray.push(chiProFinalDiagnosis);
    });

    this.familyMedicalHistoriesArray.clear();
    this.dsFamilyHistoryList.data.forEach(item => {
      this.familyMedicalHistoriesArray.push(this.createFamilyMedicalHistory(item));
    });

    this.vitalsArray.clear();
    const vitals = {
      height: this.vitalsForm.get('height')?.value,
      weight: this.vitalsForm.get('weight')?.value,
      bmi: String(this.vitalsForm.get('bmi')?.value),
      bsl: this.vitalsForm.get('bsl')?.value,
      spo2: this.vitalsForm.get('spo2')?.value,
      temp: this.vitalsForm.get('temp')?.value,
      pulse: this.vitalsForm.get('pulse')?.value,
      bp: this.vitalsForm.get('bp')?.value,
    };
    this.vitalsArray.push(this.createVitalsForm(vitals));


    this.emrForm.patchValue({
      opipid: this.vAdmissionId,
      chiefComplaints: this.addCheiflist.map(x => x.descriptionName).join(', '),
      examination: this.addExaminlist.map(x => x.descriptionName).join(', '),
      provisional: this.addProDiagnolist.map(x => x.diagnosisName).join(', '),
      finalDiagnosis: this.addFinalDiagnolist.map(x => x.diagnosisName).join(', ')
    });

    console.log('Save form:', this.emrForm.value)

    if (!this.emrForm.invalid) {
      
      this._IpdEmrService.onSaveCasepaper(this.emrForm.value).subscribe(response => {
        this.resetEMRForm();
      });

    } else {
      const invalidFields = this.collectErrors(this.emrForm);
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
        });
        return;
      }
    }
  }

  collectErrors(formGroup: FormGroup | FormArray, parentKey: string = ''): string[] {
    let errors: string[] = [];
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      if (control instanceof FormGroup || control instanceof FormArray) {
        // go deeper
        errors = errors.concat(this.collectErrors(control, newKey));
      } else {
        if (control?.invalid) {
          errors.push(newKey);
        }
      }
    });
    return errors;
  }

  resetEMRForm() {
    // 1. Remove all rows from the FormArrays
    // (this.emrForm.get('tIpEmrdiagnosisInfos') as FormArray).clear();
    // (this.emrForm.get('tIpEmrdignosisHistories') as FormArray).clear();
    // (this.emrForm.get('tIpEmrfamilyMedicalHistories') as FormArray).clear();
    // (this.emrForm.get('tIpEmrVitals') as FormArray).clear();

    // 2. Reset the normal fields to their defaults
    this.emrForm.reset({
      ipdEmrId: 0,
      opipid: 0,
      opiptype: 1,
      socialHabits: '',
      bloodGroup: '',
      medicalHistory: '',
      familyMedicalHistory: '',
      provisional: '',
      finalDiagnosis: '',
      chiefComplaints: '',
      examination: '',
      currentMedications: '',
      normalAllergy: '',
      drugAllergy: '',
      allergyRemark: ''
    });
    this.addCheiflist = [];
    this.addProDiagnolist = [];
    this.addFinalDiagnolist = [];
    this.addExaminlist = [];
    this.dsFamilyHistoryList.data = [];

    this.MyForm.reset({
      mAssignChiefComplaint: [],
      mAssignProDiagnosis: [],
      mAssignFinalDiagnosis: [],
      mAssignExamination: [],
    });
    this.registerObj = new RegInsert({});
    this.vitalsForm.reset();
  }

  selectChangeRelation(obj: any) {
    this.relationshipName = obj.text
  }

  addFamilyHistory(): void {

    const newEntry = {
      relationshipId: this.familyHistoryForm.get('relationshipId').value,
      relationshipName: this.relationshipName,
      memberName: this.familyHistoryForm.get('memberName').value,
      age: this.familyHistoryForm.get('age').value,
      clinicalHistory: this.familyHistoryForm.get('clinicalHistory').value,
      duration: this.familyHistoryForm.get('duration').value,
      genderId: 0,
      summary: '',
      status: true
    };

    this.Chargelist.push(newEntry);
    this.dsFamilyHistoryList.data = [...this.Chargelist];

    this.familyHistoryForm.reset({
      fhistId: 0,
      ipEmrId: 0,
      regId: '',
      opIpType: 1,
      admissionId: 0,
      relationshipId: 0,
      memberName: '',
      age: '',
      clinicalHistory: '',
      duration: '',
      genderId: '',
      summary: '',
      status: true
    });
  }

  // addFamilyHistory(): void {
  //   if (this.familyHistoryForm.invalid) {
  //     this.familyHistoryForm.markAllAsTouched();

  //     Object.keys(this.familyHistoryForm.controls).forEach(controlName => {
  //       const control = this.familyHistoryForm.get(controlName);

  //       if (control?.invalid) {
  //         this.toastr.warning(`Field "${controlName}" is invalid.`, 'Warning');
  //       }
  //     });

  //     return;
  //   }

  //   const value = this.familyHistoryForm.getRawValue();

  //   const familyHistory = new FamilyHistoryList({
  //     MemberName: value.memberName,
  //     RelationshipId: value.relationshipId,
  //     Age: value.age,
  //     ClinicalHistory: value.clinicalHistory,
  //     Duration: value.duration
  //   });

  //   this.dsFamilyHistoryList.data = [
  //     ...this.dsFamilyHistoryList.data,
  //     familyHistory
  //   ];

  //   this.familyHistoryForm.reset({
  //     fhistId: 0,
  //     ipEmrId: 0,
  //     regId: '',
  //     opIpType: 1,
  //     admissionId: 0,
  //     relationshipId: null,
  //     memberName: '',
  //     age: '',
  //     clinicalHistory: '',
  //     duration: '',
  //     genderId: '',
  //     summary: '',
  //     status: true
  //   });
  // }

  deleteTableRow(event: MouseEvent, row: FamilyHistoryList): void {

    event.stopPropagation();

    const index = this.dsFamilyHistoryList.data.indexOf(row);

    if (index !== -1) {

      const data = [...this.dsFamilyHistoryList.data];

      data.splice(index, 1);

      this.dsFamilyHistoryList.data = data;

      this.toastr.success('Deleted successfully', 'Success');
    }
  }

  selectChangeChiefComplaint(selectedChips: string[]) {
    this.addCheiflist = selectedChips;
    this.MyForm.get('mAssignChiefComplaint')?.setValue(this.addCheiflist);

    // this.emrForm.patchValue({
    //   chiefComplaints: this.addCheiflist.map(x => x.descriptionName).join(', ')
    // });

  }

  selectChangeDiagnosis(selectedChips: string[]) {
    console.log(selectedChips)
    this.addProDiagnolist = selectedChips;
    this.MyForm.get('mAssignProDiagnosis')?.setValue(this.addProDiagnolist);

    // this.emrForm.patchValue({
    //   provisional: this.addProDiagnolist.map(x => x.descriptionName).join(', '),
    // });
  }

  selectChangeFinalDiagnosis(selectedChips: string[]) {
    console.log(selectedChips)
    this.addFinalDiagnolist = selectedChips;
    this.MyForm.get('mAssignFinalDiagnosis')?.setValue(this.addFinalDiagnolist);

    // this.emrForm.patchValue({
    //   provisional: this.addProDiagnolist.map(x => x.descriptionName).join(', '),
    //   finalDiagnosis: this.addFinalDiagnolist.map(x => x.descriptionName).join(', '),
    // });
  }

  selectChangeExamination(selectedChips: string[]) {
    this.addExaminlist = selectedChips;
    this.MyForm.get('mAssignExamination')?.setValue(this.addExaminlist);

    // this.emrForm.patchValue({
    //   examination: this.addExaminlist.map(x => x.descriptionName).join(', ')
    // });
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

  getBMIcalculation() {
    const height = this.vitalsForm.get('height')?.value;
    const weight = this.vitalsForm.get('weight')?.value;

    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      this.vitalsForm.get('bmi')?.setValue(Math.round(bmi));

    } else {
      this.vitalsForm.get('bmi')?.setValue(0);
      // this.toastr.warning('Please enter valid height (above 30 cm) and weight.');
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

  keyPressDigitDecimalOnly(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressOk(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/^[0-9!@#$%^&*()_+\-=\[\]{};:"\\|,.<>\/?]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

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
}
export class FamilyHistoryList {
  fhistId = 0;
  MemberName = '';
  RelationshipId: any = null;
  Age: number | string = '';
  ClinicalHistory = '';
  Duration = '';

  constructor(data: Partial<FamilyHistoryList> = {}) {
    this.fhistId = data.fhistId ?? 0;
    this.MemberName = data.MemberName ?? '';
    this.RelationshipId = data.RelationshipId ?? null;
    this.Age = data.Age ?? '';
    this.ClinicalHistory = data.ClinicalHistory ?? '';
    this.Duration = data.Duration ?? '';
  }
}
