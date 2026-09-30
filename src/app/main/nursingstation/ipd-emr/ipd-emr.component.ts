import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidChipautocompleteComponent } from 'app/main/shared/componets/airmid-chipautocomplete/airmid-chipautocomplete.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { finalize, Observable } from 'rxjs';
import { IpdEmrService } from './ipd-emr.service';
import { MatTableDataSource } from '@angular/material/table';
import { PatientList } from '../clinical-care-chart/clinical-care-chart.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

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
  autocompleteModegender: string = "Gender";

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
  ipdEmrId: any;
  genderName: any;

  isShowDetailTable: boolean = false;
  isShowDetailTable2: boolean = false;

  // registerObj: any;
  registerObj = new emrInsert({});
  UpdateRegObj = new emrInsert({});
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
  ProdiagnosisMentionItems: Array<{ id: string | number; text: string }> = [];
  FinaldiagnosisMentionItems: Array<{ id: string | number; text: string }> = [];
  isSaving = false;

  @ViewChild('chiefComplaintInput') chiefComplaintInput: AirmidChipautocompleteComponent;

  autocompleteModebloodGroup: string = "BloodGroupTypes";

  dsFamilyHistoryList = new MatTableDataSource<FamilyHistoryList>();
  dsClinicalcarePatient = new MatTableDataSource<PatientList>();
  Chargelist: any[] = [];
  relationshipName: any;
  relationshipList = new MatTableDataSource<FamilyHistoryList>();
  genderList = new MatTableDataSource<FamilyHistoryList>();
  MyForm!: FormGroup;
  familyHistoryForm!: FormGroup;
  vitalsForm: FormGroup;
  emrForm!: FormGroup;
  AllCompExmDescription: any = []
  AllProFinalDiagnosisDescription: any = []
  UpdateRtrvDescriptionList: any = [];

  displayedColumns: string[] = [
    'MemberName',
    'gender',
    'RelationshipId',
    'Age',
    'ClinicalHistory',
    'summary',
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
    this.emrForm.markAllAsTouched();

    this.familyHistoryForm = this.createFamilyMedicalHistory();
    this.familyHistoryForm.markAllAsTouched();

    this.vitalsForm = this.createVitalsForm();
    this.vitalsForm.markAllAsTouched();

    this.getRelationshipList();
    this.getGenderList();
    this.getBMIcalculation();
  }

  createMyForm(): FormGroup {
    return this._formbuilder.group({
      WardName: [''],
      RegID: [''],
      PatientName: [''],
      BloodGroup: [0, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(3)]],
      mAssignChiefComplaint: [[], [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator]],
      mAssignProDiagnosis: [[], [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator]],
      mAssignFinalDiagnosis: [[], [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator]],
      mAssignExamination: [[], [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator]],
    });
  }


  createEMRForm() {
    this.emrForm = this._formbuilder.group({
      // Main EMR fields
      ipdEmrId: [0],
      opipid: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      opiptype: [1],
      socialHabits: [''],
      bloodGroup: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator]],
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

  // Pro & Final Diagnosis
  createDiagnosisInfo(element: any = {}): FormGroup {
    return this._formbuilder.group({
      ipemrdiagnId: [0],
      ipemrid: [this.ipdEmrId ?? 0],
      admId: [this.vAdmissionId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      diagnosis: [element.diagnosisName ?? ''],
      icdcode: [element.icdcode ?? ''],
      diagnosisinformation: [element.descriptionName ?? ''],
      flagCode: [element.descriptionType]
    });
  }

  /////////////////////////////////End Of Diagnosis Information FormArray////////////////////////////

  /////////////////////////////////Diagnosis History FormArray////////////////////////////
  get diagnosisHistoriesArray(): FormArray {
    return this.emrForm.get('tIpEmrdignosisHistories') as FormArray;
  }

  // pass here complaint & examination
  createDiagnosisHistory(element: any = {}): FormGroup {
    return this._formbuilder.group({
      emrdignId: [0],
      ipemrid: [this.ipdEmrId ?? 0],
      admissionId: [this.vAdmissionId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      descriptionType: [element.descriptionType ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      descriptionName: [element.descriptionName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      icdcode: [element.icdcode ?? ''],
      diagnosisName: [element.diagnosisName ?? ''],
      diagnosisInfo: ['']
    });
  }

  /////////////////////////////////End Of Diagnosis History FormArray////////////////////////////

  /////////////////////////////////Family Medical History FormArray////////////////////////////
  get familyMedicalHistoriesArray(): FormArray {
    return this.emrForm.get('tIpEmrfamilyMedicalHistories') as FormArray;
  }

  createFamilyMedicalHistory(element: any = {}): FormGroup {
    return this._formbuilder.group({
      fhistId: [0],
      ipEmrId: [this.ipdEmrId ?? 0],
      regId: [this.vRegId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      opIpType: [1],
      admissionId: [this.vAdmissionId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator]],
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

  /////////////////////////////////End Of Family Medical History FormArray////////////////////////////

  /////////////////////////////////Vitals FormArray////////////////////////////
  get vitalsArray(): FormArray {
    return this.emrForm.get('tIpEmrVitals') as FormArray;
  }

  createVitalsForm(element: any = {}): FormGroup {
    return this._formbuilder.group({
      ipemrVitalId: [0],
      ipemrId: [this.ipdEmrId ?? 0],
      opiptype: [1],
      opipid: [this.vAdmissionId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      height: [element.height ?? '', [Validators.required, Validators.maxLength(20)]],
      weight: [element.weight ?? '', [Validators.required, Validators.maxLength(20)]],
      bmi: [element.bmi ?? '0', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly, Validators.maxLength(20)]],
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

  getRelationshipList(): void {

    const data = {
      "first": 0,
      "rows": 9999,
      "sortField": "relationshipId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "relationshipName",
          "fieldValue": "",
          "opType": "StartsWith"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }
    this._IpdEmrService.getRelationshipCombo(data).subscribe((res: any) => {
      this.relationshipList = res;
    });
  }

  getGenderList(): void {

    const data = {
      "first": 0,
      "rows": 9999,
      "sortField": "genderId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "genderName",
          "fieldValue": "",
          "opType": "StartsWith"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }
    this._IpdEmrService.getGenderCombo(data).subscribe((res: any) => {
      this.genderList = res;
    });
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

    this.ClearEMRForm();
    if (this.registerObj.ipdEmrId) {
      this._IpdEmrService.getEmrId(this.registerObj.ipdEmrId).subscribe((res) => {
        this.UpdateRegObj = res
        this.ipdEmrId = res.ipdEmrId
        console.log(this.UpdateRegObj)
        this.emrForm.patchValue(this.UpdateRegObj)

        /////////// vitals data retrive ////////////////
        this.vitalsForm.patchValue(res.tIpEmrVitals[0])

        /////////// vitals data retrive end ////////////////

        /////////// All 4 dropdowns retrive////////////////

        this.addCheiflist = [];
        this.addProDiagnolist = [];
        this.addFinalDiagnolist = [];
        this.addExaminlist = [];
        this.AllCompExmDescription = []
        this.AllProFinalDiagnosisDescription = []

        if (res && Array.isArray(res.tIpEmrdignosisHistories)) {
          this.UpdateRtrvDescriptionList = res.tIpEmrdignosisHistories

          // ChiefComplaint
          const ChiefComplaint = this.UpdateRtrvDescriptionList.filter(item => item.descriptionType === 'Complaint');
          this.addCheiflist = [];
          if (ChiefComplaint.length > 0) {
            ChiefComplaint.forEach(element => {
              this.addCheiflist.push(
                {
                  id: element.emrdignId,
                  descriptionName: element.descriptionName,
                }
              )
            })
            this.MyForm.get('mAssignChiefComplaint').setValue(this.addCheiflist);
          }

          // Examination
          const Examination = this.UpdateRtrvDescriptionList.filter(item => item.descriptionType === 'Examination');
          if (Examination.length > 0) {
            Examination.forEach(element => {
              this.addExaminlist.push(
                {
                  id: element.emrdignId,
                  descriptionName: element.descriptionName
                }
              )
            });
            this.MyForm.get('mAssignExamination').setValue(this.addExaminlist);
          }
        }

        if (res && Array.isArray(res.tIpEmrdiagnosisInfos)) {
          this.UpdateRtrvDescriptionList = res.tIpEmrdiagnosisInfos

          // Pro Diagnosis
          const ProDiagnosis = this.UpdateRtrvDescriptionList.filter(item => item.flagCode === 'ProDiagnosis');
          if (ProDiagnosis.length > 0) {
            ProDiagnosis.forEach(element => {
              this.addProDiagnolist.push(
                {
                  id: element.ipemrdiagnId,
                  descriptionName: element.diagnosisinformation,
                  icdcode: element.icdcode || '',
                  diagnosisName: element.diagnosis,
                  icdCodeWithDignosis: element.diagnosisinformation
                }
              )
            })
            this.ProdiagnosisMentionItems = this.addProDiagnolist
              .filter(item => item.descriptionName)
              .map(item => ({
                id: item.id,
                text: item.descriptionName
              }));
            this.MyForm.get('mAssignProDiagnosis').setValue(this.addProDiagnolist);
          }

          // Final Diagnosis
          const FinalDiagnosis = this.UpdateRtrvDescriptionList.filter(item => item.flagCode === 'FinalDiagnosis');
          if (FinalDiagnosis.length > 0) {
            FinalDiagnosis.forEach(element => {
              this.addFinalDiagnolist.push(
                {
                  id: element.ipemrdiagnId,
                  descriptionName: element.diagnosisinformation,
                  icdcode: element.icdcode || '',
                  diagnosisName: element.diagnosis,
                  icdCodeWithDignosis: element.diagnosisinformation
                }
              )
            })
            this.FinaldiagnosisMentionItems = this.addFinalDiagnolist
              .filter(item => item.descriptionName)
              .map(item => ({
                id: item.id,
                text: item.descriptionName
              }));
            this.MyForm.get('mAssignFinalDiagnosis').setValue(this.addFinalDiagnolist);
          }
        }
        /////////// All 4 dropdowns retrive end////////////////

        /////////// family table data retrive ////////////////
        const history = res.tIpEmrfamilyMedicalHistories || [];

        this.Chargelist = history.map((item: any) => ({
          fhistId: item.fhistId,
          relationshipId: item.relationshipId,
          relationshipName: this.relationshipList.data.find(r => r.relationshipId === item.relationshipId)?.relationshipName ?? '',
          memberName: item.memberName,
          age: item.age,
          clinicalHistory: item.clinicalHistory,
          duration: item.duration,
          genderId: item.genderId ?? 0,
          genderName: this.genderList.data.find(r => r.genderId === item.genderId)?.genderName ?? '',
          summary: item.summary ?? '',
          status: true
        }));

        this.dsFamilyHistoryList.data = [...this.Chargelist];
        /////////// family table data retrive end ////////////////

      })
    }
  }
  //////////////////////////////////////// main patient list end ////////////////////////////////////////

  onSave() {

    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }

    const hasValue = (v: any) =>
      v !== null && v !== undefined && String(v).trim() !== '';

    const drugAllergy = this.emrForm.get('drugAllergy').value;
    const normalAllergy = this.emrForm.get('normalAllergy').value;
    const allergyRemark = this.emrForm.get('allergyRemark').value;

    if ((hasValue(drugAllergy) || hasValue(normalAllergy)) && !hasValue(allergyRemark)) {
      // replace with your toastr / snackbar
      this.toastr.warning('Allergy Remark is required when Drug Allergy or Normal Allergy is entered');
      this.emrForm.get('allergyRemark').markAsTouched();
      return;
    }

    const fields = ['mAssignChiefComplaint', 'mAssignProDiagnosis', 'mAssignFinalDiagnosis', 'mAssignExamination'];

    const hasError = fields.some(name => {
      const c = this.MyForm.get(name);
      c.markAsTouched();
      c.updateValueAndValidity();
      return c.invalid;
    });

    if (hasError) {
      this.toastr.warning('Chief Complaint, Provisional Diagnosis, Final Diagnosis and Examination are required');
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
      bmi: String(this.vitalsForm.get('bmi')?.value) ?? '0',
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

      if (this.isSaving) return;      // blocks a second click or Enter key press
      this.isSaving = true;

      this._IpdEmrService.onSaveCasepaper(this.emrForm.value).subscribe(response => {
        this.resetEMRForm();
        this.getPatientListwardWise();
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

  ClearEMRForm() {

    // 2. Reset the normal fields to their defaults
    this.emrForm.reset({
      ipdEmrId: 0,
      opipid: 0,
      opiptype: 1,
      socialHabits: '',
      bloodGroup: 0,
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
    this.Chargelist = []

    this.MyForm.reset({
      mAssignChiefComplaint: [],
      mAssignProDiagnosis: [],
      mAssignFinalDiagnosis: [],
      mAssignExamination: [],
    });
    this.vitalsForm.reset();
  }

  resetEMRForm() {
  this.isSaving = false;
    // 2. Reset the normal fields to their defaults
    this.emrForm.reset({
      ipdEmrId: 0,
      opipid: 0,
      opiptype: 1,
      socialHabits: '',
      bloodGroup: 0,
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
    this.Chargelist = []

    this.MyForm.reset({
      mAssignChiefComplaint: [],
      mAssignProDiagnosis: [],
      mAssignFinalDiagnosis: [],
      mAssignExamination: [],
    });
    this.registerObj = new emrInsert({});
    this.vitalsForm.reset();
  }

  selectChangeRelation(obj: any) {
    this.relationshipName = obj.text
  }

  selectChangeGender(obj: any) {
    this.genderName = obj.text
  }

  addFamilyHistory(): void {

    const f = this.familyHistoryForm.value;

    const isEmpty = (v: any) =>
      v === null || v === undefined || String(v).trim() === '' || v === 0;

    // No member name -> do nothing, no validation
    if (isEmpty(f.memberName)) {
      return;
    }

    // Member name present -> all other fields are required
    const missing: string[] = [];
    if (!f.relationshipId || f.relationshipId === 0) missing.push('Relationship');
    if (isEmpty(f.age)) missing.push('Age');
    if (isEmpty(f.clinicalHistory)) missing.push('Clinical History');
    if (isEmpty(f.duration)) missing.push('Duration');
    if (isEmpty(f.genderId)) missing.push('Gender');
    if (isEmpty(f.summary)) missing.push('Summary');

    if (missing.length > 0) {
      // replace with your toastr / snackbar
      this.toastr.warning(`Please fill: ${missing.join(', ')}`);
      this.familyHistoryForm.markAllAsTouched();
      return;
    }

    const newEntry = {
      relationshipId: f.relationshipId,
      relationshipName: this.relationshipName,
      memberName: f.memberName.trim(),
      age: f.age,
      clinicalHistory: f.clinicalHistory,
      duration: f.duration,
      genderId: f.genderId,
      genderName: this.genderName,
      summary: f.summary,
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

  deleteTableRow(event: MouseEvent, row: FamilyHistoryList): void {
    event.stopPropagation();

    const index = this.Chargelist.indexOf(row);

    if (index !== -1) {
      this.Chargelist.splice(index, 1);
      this.dsFamilyHistoryList.data = [...this.Chargelist];

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

  // getBMIcalculation() {
  //   const height = this.vitalsForm.get('height')?.value;
  //   const weight = this.vitalsForm.get('weight')?.value;

  //   if (height > 0 && weight > 0) {
  //     const heightInMeters = height / 100;
  //     const bmi = weight / (heightInMeters * heightInMeters);
  //     this.vitalsForm.get('bmi')?.setValue(Math.round(bmi));

  //   } else {
  //     this.vitalsForm.get('bmi')?.setValue(0);
  //     // this.toastr.warning('Please enter valid height (above 30 cm) and weight.');
  //   }
  // }
  getBMIcalculation(): void {
    const height = Number(this.vitalsForm.get('height')?.value);
    const weight = Number(this.vitalsForm.get('weight')?.value);

    let bmi: number | string = '';   // use 0 here if the backend needs a number

    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      bmi = Math.round(weight / (heightInMeters * heightInMeters));
    }

    this.vitalsForm.get('bmi')?.setValue(bmi);
    this.vBMI = bmi;   // keeps the [(ngModel)]="vBMI" in your HTML in sync
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
  relationshipId: any;
  relationshipName: any;
  genderId: any;
  genderName: any;

  constructor(data: Partial<FamilyHistoryList> = {}) {
    this.fhistId = data.fhistId ?? 0;
    this.MemberName = data.MemberName ?? '';
    this.RelationshipId = data.RelationshipId ?? null;
    this.Age = data.Age ?? '';
    this.ClinicalHistory = data.ClinicalHistory ?? '';
    this.Duration = data.Duration ?? '';
    this.relationshipId = data.relationshipId ?? 0;
    this.relationshipName = data.relationshipName ?? '';
    this.genderId = data.genderId ?? 0;
    this.genderName = data.genderName ?? '';
  }
}

export class emrInsert {
  RegId: number;
  regId: number;
  emailId: string;
  RegID: number;
  RegDate: Date;
  regDate: Date;
  PatientName: string;
  patientName: string;
  // RegTime: Time;
  prefixId: number;
  PrefixId: number;
  PrefixID: number;
  firstName: string;
  middleName: string;
  lastName: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Address: string;
  address: string;
  City: string;
  city: string;
  PinNo: string;
  regNo: string;
  RegNo: string;
  dateOfBirth: Date;
  dateofBirth: Date;
  DateofBirth: Date;
  Age: any;
  age: any;
  GenderId: number;
  genderId: any;
  PhoneNo: string;
  phoneNo: string;
  MobileNo: string;
  mobileNo: string;
  AddedBy: number;
  AgeYear: any;
  AgeMonth: any;
  AgeDay: any;
  ageYear: any;
  ageMonth: any;
  ageDay: any;
  CountryId: number;
  countryId: number;
  StateId: number;
  stateId: number;
  CityId: number;
  cityId: number;
  MaritalStatusId: number;
  maritalStatusId: number;
  IsCharity: boolean;
  ReligionId: number;
  religionId: number;
  AreaId: number;
  areaId: number;
  VillageId: number;
  TalukaId: number;
  PatientWeight: number;
  AreaName: string;
  AadharCardNo: string;
  aadharCardNo: string;
  PanCardNo: string;
  currentDate = new Date();
  AdmissionID: any;
  VisitId: any;
  isSeniorCitizen: boolean
  doctorName: any;
  departmentName: any;
  UnitId: any;
  billNo: any;
  departmentId: any;
  doctorId: any;
  campId: any;
  emgContactPersonName: any;
  emgRelationshipId: any;
  emgMobileNo: any;
  emgLandlineNo: any;
  engAddress: any;
  emgAadharCardNo: any;
  emgDrivingLicenceNo: any;
  medTourismNationalityId: any;
  medTourismPassportNo: any;
  medTourismVisaIssueDate: Date;
  medTourismCitizenship: any;
  medTourismPortOfEntry: any;
  medTourismResidentialAddress: any;
  medTourismOfficeWorkAddress: any;
  medTourismVisaValidityDate: Date;
  medTourismDateOfEntry: Date;
  emgId: any
  ipdNo: any;
  ipdno: any;
  genderName: any;
  traiffId: any;
  companyId: any;
  PBillNo: any;
  BillNo: any;
  BillTime: any;
  PatientType: any;
  adharCardNo: any;
  admissionID: any;
  tariffName: any;
  panCardNo: any;
  pinNo: any;
  regTime: any;
  husbandDob: Date;
  wifeDob: Date;
  ipdEmrId: any;
  /**
   * Constructor
   *
   * @param emrInsert
   */

  constructor(emrInsert) {
    {
      this.RegId = emrInsert.RegId || 0;
      this.regId = emrInsert.regId || 0;
      this.RegID = emrInsert.RegID || 0;
      this.RegDate = emrInsert.RegDate || this.currentDate;
      this.regDate = emrInsert.regDate || this.currentDate;
      this.patientName = emrInsert.patientName;
      // this.RegTime = emrInsert.RegTime || this.currentDate;
      this.regTime = emrInsert.regTime || this.currentDate;
      this.prefixId = emrInsert.prefixId || 0;
      this.PrefixId = emrInsert.PrefixId || 0;
      this.PrefixID = emrInsert.PrefixID || 0;
      this.PrefixID = emrInsert.PrefixID || 0;
      this.firstName = emrInsert.firstName || '';
      this.middleName = emrInsert.middleName || '';
      this.lastName = emrInsert.lastName || '';
      this.FirstName = emrInsert.FirstName || '';
      this.MiddleName = emrInsert.MiddleName || '';
      this.LastName = emrInsert.LastName || '';
      this.Address = emrInsert.Address || '';
      this.RegNo = emrInsert.RegNo || '';
      this.pinNo = emrInsert.pinNo || '';
      this.panCardNo = emrInsert.panCardNo || '';
      this.regNo = emrInsert.regNo || '';
      this.City = emrInsert.City || '';
      this.PinNo = emrInsert.PinNo || '';
      this.dateOfBirth = emrInsert.dateOfBirth || this.currentDate;
      this.dateofBirth = emrInsert.dateofBirth || this.currentDate;
      this.DateofBirth = emrInsert.DateofBirth || this.currentDate;
      this.Age = emrInsert.Age || '';
      this.GenderId = emrInsert.GenderId || 0;
      this.genderId = emrInsert.genderId || 0;
      this.PhoneNo = emrInsert.PhoneNo || '';
      this.phoneNo = emrInsert.phoneNo || '';
      this.MobileNo = emrInsert.MobileNo || '';
      this.mobileNo = emrInsert.mobileNo || '';
      this.AddedBy = emrInsert.AddedBy || '';
      this.AgeYear = emrInsert.AgeYear || '0';
      this.AgeMonth = emrInsert.AgeMonth || '0';
      this.AgeDay = emrInsert.AgeDay || '0';
      this.ageYear = emrInsert.ageYear || '0';
      this.ageMonth = emrInsert.ageMonth || '0';
      this.ageDay = emrInsert.ageDay || '0';
      this.CountryId = emrInsert.CountryId || 0;
      this.countryId = emrInsert.countryId || 0;
      this.StateId = emrInsert.StateId || 0;
      this.stateId = emrInsert.stateId || 0;
      this.CityId = emrInsert.CityId || 0;
      this.cityId = emrInsert.cityId || 0;
      this.MaritalStatusId = emrInsert.MaritalStatusId || 0;

      this.IsCharity = emrInsert.IsCharity || false;
      this.ReligionId = emrInsert.ReligionId || 0;
      this.religionId = emrInsert.religionId || 0;
      this.AreaId = emrInsert.AreaId || 0;
      this.areaId = emrInsert.areaId || 0;
      this.VillageId = emrInsert.VillageId || '';
      this.TalukaId = emrInsert.TalukaId || '';
      this.PatientWeight = emrInsert.PatientWeight || '';
      this.AreaName = emrInsert.AreaName || '';
      this.AadharCardNo = emrInsert.AadharCardNo || '';
      this.aadharCardNo = emrInsert.aadharCardNo || '';
      this.PanCardNo = emrInsert.PanCardNo || '';
      this.AdmissionID = emrInsert.AdmissionID || '';
      this.VisitId = emrInsert.VisitId || 0;
      this.isSeniorCitizen = emrInsert.isSeniorCitizen || 0
      this.maritalStatusId = emrInsert.maritalStatusId || 0;
      this.doctorName = emrInsert.doctorName || "";
      this.departmentName = emrInsert.departmentName || "";
      this.UnitId = emrInsert.UnitId || 0;
      this.billNo = emrInsert.billNo || 0;
      this.departmentId = emrInsert.departmentId || 0;
      this.doctorId = emrInsert.doctorId || 0;
      this.campId = emrInsert.campId || 0;
      this.emgContactPersonName = emrInsert.emgContactPersonName || "";
      this.emgRelationshipId = emrInsert.emgRelationshipId || 0;
      this.emgMobileNo = emrInsert.emgMobileNo || 0;
      this.emgLandlineNo = emrInsert.emgLandlineNo || 0;
      this.engAddress = emrInsert.engAddress || '';
      this.emgAadharCardNo = emrInsert.emgAadharCardNo || 0;
      this.emgDrivingLicenceNo = emrInsert.emgDrivingLicenceNo || 0;
      this.medTourismPassportNo = emrInsert.medTourismPassportNo || 0;
      this.medTourismNationalityId = emrInsert.medTourismNationalityId || 0;
      this.medTourismVisaIssueDate = emrInsert.medTourismVisaIssueDate || '1900-01-01';
      this.medTourismCitizenship = emrInsert.medTourismCitizenship || ''
      this.medTourismPortOfEntry = emrInsert.medTourismPortOfEntry || ''
      this.medTourismResidentialAddress = emrInsert.medTourismResidentialAddress || ''
      this.medTourismOfficeWorkAddress = emrInsert.medTourismOfficeWorkAddress || ''
      this.medTourismVisaValidityDate = emrInsert.medTourismVisaValidityDate || '1900-01-01';
      this.medTourismDateOfEntry = emrInsert.medTourismDateOfEntry || '1900-01-01';
      this.emgId = emrInsert.emgId || 0
      this.ipdNo = emrInsert.ipdNo || 0
      this.ipdno = emrInsert.ipdno || 0
      this.genderName = emrInsert.genderName || ''
      this.traiffId = emrInsert.traiffId || 0
      this.companyId = emrInsert.companyId || 0
      this.PBillNo = emrInsert.PBillNo || 0
      this.BillNo = emrInsert.BillNo || 0
      this.BillTime = emrInsert.BillTime || ''
      this.PatientType = emrInsert.PatientType || ''
      this.adharCardNo = emrInsert.adharCardNo || ''
      this.address = emrInsert.address || ''
      this.admissionID = emrInsert.admissionID || ''
      this.tariffName = emrInsert.tariffName || ''
      this.husbandDob = emrInsert.husbandDob || ''
      this.wifeDob = emrInsert.wifeDob || ''
      this.ipdEmrId = emrInsert.ipdEmrId || 0
    }
  }
}

