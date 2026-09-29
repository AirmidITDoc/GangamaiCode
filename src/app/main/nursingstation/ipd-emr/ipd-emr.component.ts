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
  Chargelist: any = [];
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

  registerObj: any;
  vAdmission: any;
  vipdNo: any;
  isShowPrintButtons: boolean = false;

  @ViewChild('chiefComplaintInput') chiefComplaintInput: AirmidChipautocompleteComponent;


  dsFamilyHistoryList = new MatTableDataSource<FamilyHistoryList>();
  dsClinicalcarePatient = new MatTableDataSource<PatientList>();

  MyForm!: FormGroup;
  familyHistoryForm!: FormGroup;
  emrForm!: FormGroup;

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
    public _formbuilder: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
    this.getPatientListwardWise();
    this.MyForm = this.createMyForm()

    this.createEMRForm();

    this.familyHistoryForm = this.createFamilyMedicalHistory();
  }

  createMyForm(): FormGroup {
    return this._formbuilder.group({
      WardName: [''],
      RegID: [''],
      PatientName: ['']
    });
  }

  // createFamilyHistoryForm() {
  //   return this._formbuilder.group({
  //     fhistId: '',
  //     ipEmrId: '',
  //     regId: '',
  //     opIpType: '',
  //     admissionId: '',
  //     relationshipId: [0, [Validators.required]],
  //     memberName: ['', [Validators.required]],
  //     age: ['', [Validators.pattern(/^[0-9]+$/)]],
  //     clinicalHistory: "",
  //     duration: '',
  //     genderId: '',
  //     summary: "",
  //     status: true
  //   })
  // }



  createEMRForm() {
    this.emrForm = this._formbuilder.group({
      // Main EMR fields
      ipdEmrId: [0],
      opipid: [1],
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
      chiefComplaintsDuration: [''],
      presentHistory: [''],
      examinationDuration: [''],

      // Diagnosis Information
      tIpEmrdiagnosisInfos: this._formbuilder.array([]),

      // Diagnosis History
      tIpEmrdignosisHistories: this._formbuilder.array([]),

      // Family Medical History
      tIpEmrfamilyMedicalHistories: this._formbuilder.array([])
    });
  }


  /////////////////////////////////Diagnosis Information FormArray////////////////////////////
  get diagnosisInfos(): FormArray {
    return this.emrForm.get('tIpEmrdiagnosisInfos') as FormArray;
  }

  createDiagnosisInfo(): FormGroup {
    return this._formbuilder.group({
      ipemrdiagnId: [0],
      ipemrid: [0],
      admId: [0],
      diagnosis: [''],
      icdcode: [''],
      diagnosisinformation: [''],
      flagCode: ['']
    });
  }

  addDiagnosisInfo(): void {
    this.diagnosisInfos.push(this.createDiagnosisInfo());
  }

  removeDiagnosisInfo(index: number): void {
    this.diagnosisInfos.removeAt(index);
  }
  /////////////////////////////////End Of Diagnosis Information FormArray////////////////////////////

  /////////////////////////////////Diagnosis History FormArray////////////////////////////
  get diagnosisHistories(): FormArray {
    return this.emrForm.get('tIpEmrdignosisHistories') as FormArray;
  }

  createDiagnosisHistory(): FormGroup {
    return this._formbuilder.group({
      emrdignId: [0],
      ipemrid: [0],
      admissionId: [0],
      descriptionName: [''],
      descriptionType: [''],
      icdcode: [''],
      diagnosisName: [''],
      diagnosisInfo: ['']
    });
  }

  addDiagnosisHistory(): void {
    this.diagnosisHistories.push(this.createDiagnosisHistory());
  }

  removeDiagnosisHistory(index: number): void {
    this.diagnosisHistories.removeAt(index);
  }
  /////////////////////////////////End Of Diagnosis History FormArray////////////////////////////

  /////////////////////////////////Family Medical History FormArray////////////////////////////
  get familyMedicalHistories(): FormArray {
    return this.emrForm.get('tIpEmrfamilyMedicalHistories') as FormArray;
  }

  createFamilyMedicalHistory(): FormGroup {
    return this._formbuilder.group({
      fhistId: [0],
      ipEmrId: [0],
      regId: [''],
      opIpType: [1],
      admissionId: [0],
      relationshipId: [null, Validators.required],
      memberName: ['', Validators.required],
      age: ['', Validators.pattern(/^[0-9]+$/)],
      clinicalHistory: [''],
      duration: [''],
      genderId: [''],
      summary: [''],
      status: [true]
    });
  }

  addFamilyMedicalHistory(): void {
    this.familyMedicalHistories.push(this.createFamilyMedicalHistory());
  }

  removeFamilyMedicalHistory(index: number): void {
    this.familyMedicalHistories.removeAt(index);
  }
  /////////////////////////////////End Of Family Medical History FormArray////////////////////////////


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
    this.vAdmission = this.registerObj.admissionID
    this.vipdNo = this.registerObj.ipdNo
  }
  //////////////////////////////////////// main patient list end ////////////////////////////////////////
  onClose() {

  }
  onSave() {


  }

  addFamilyHistory(): void {
    if (this.familyHistoryForm.invalid) {
      this.familyHistoryForm.markAllAsTouched();

      Object.keys(this.familyHistoryForm.controls).forEach(controlName => {
        const control = this.familyHistoryForm.get(controlName);

        if (control?.invalid) {
          this.toastr.warning(`Field "${controlName}" is invalid.`, 'Warning');
        }
      });

      return;
    }

    const value = this.familyHistoryForm.getRawValue();

    const familyHistory = new FamilyHistoryList({
      MemberName: value.memberName,
      RelationshipId: value.relationshipId,
      Age: value.age,
      ClinicalHistory: value.clinicalHistory,
      Duration: value.duration
    });

    this.dsFamilyHistoryList.data = [
      ...this.dsFamilyHistoryList.data,
      familyHistory
    ];

    this.familyHistoryForm.reset({
      fhistId: 0,
      ipEmrId: 0,
      regId: '',
      opIpType: 1,
      admissionId: 0,
      relationshipId: null,
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

    const index = this.dsFamilyHistoryList.data.indexOf(row);

    if (index !== -1) {

      const data = [...this.dsFamilyHistoryList.data];

      data.splice(index, 1);

      this.dsFamilyHistoryList.data = data;

      this.toastr.success('Deleted successfully', 'Success');
    }
  }

  // addCheiflist: any[] = [];
  // selectChangeChiefComplaint(selectedChips: string[]) {
  //   debugger
  //   this.addCheiflist = selectedChips;
  //   this.emrForm.get('mAssignChiefComplaint')?.setValue(this.addCheiflist);
  // }

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
