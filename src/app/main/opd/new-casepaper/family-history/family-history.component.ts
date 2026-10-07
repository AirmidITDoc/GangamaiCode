import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AppointmentlistService } from '../../appointment-list/appointmentlist.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { VisitMaster1 } from '../../appointment-list/appointment-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { CasepaperService } from '../casepaper.service';

@Component({
  selector: 'app-family-history',
  templateUrl: './family-history.component.html',
  styleUrls: ['./family-history.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class FamilyHistoryComponent {

  MyFormGroup: FormGroup
  autocompleteModerelationship: string = "Relationship";
  autocompleteward: string = "Room";
  autocompleteModegender: string = "Gender";

  VisitId: any;
  Tarrifname: any;
  relationshipName: any;
  genderName: any;
  vDoctorName: any;
  vRefDocName: any;
  vRegId: any;


  patientDetail: any = {};

  Chargelist: any[] = [];
  dsFamilyHistoryList = new MatTableDataSource<FamilyHistoryList>();

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
    public _OpAppointmentService: AppointmentlistService,
    private _CasepaperService: CasepaperService,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<FamilyHistoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  ngOnInit(): void {

    this.MyFormGroup = this.createMyForm();
    this.MyFormGroup.markAllAsTouched();

    this.getVisitById(this.data.visitId)
    this.getpatientDet(this.data.regId);

  }


  createMyForm(element: any = {}): FormGroup {
    return this._formBuilder.group({
      fhistId: [0],
      ipEmrId: [0],
      regId: [this.vRegId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      opIpType: [0],
      admissionId: [this.VisitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator]],
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

  getVisitById(visitId: any): void {
    this._OpAppointmentService.getVisitById(visitId).subscribe(data => {
  
      this.patientDetail = this.data
      this.vDoctorName = this.data.doctorname;
      this.vRefDocName = this.data.refDocName
      this.vRegId = this.data.regId ?? 0
      this.VisitId = this.data.visitId?? 0
    });
  }

  getpatientDet(regId: any): void {
    const data = {
      "first": 0,
      "rows": 10,
      "sortField": "FhistId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "RegId",
          "fieldValue": String(regId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }
    this._CasepaperService.getFamilyHistoryByRegId(data).subscribe((res: any) => {
      const history = res.data || [];

      this.Chargelist = history.map((item: any) => ({
        fhistId: item.fhistId ?? 0,
        relationshipId: item.relationshipId ?? 0,
        relationshipName: item.relationshipName ?? '',
        memberName: item.memberName ?? '',
        age: item.age ?? '',
        clinicalHistory: item.clinicalHistory ?? '',
        duration: item.duration ?? '',
        genderId: item.genderId ?? 0,
        genderName: item.genderName ?? '',
        summary: item.summary ?? '',
        status: item.status ?? true
      }));

      this.dsFamilyHistoryList.data = [...this.Chargelist];
    });
  }

  selectChangeRelation(obj: any) {
    this.relationshipName = obj.text
  }

  selectChangeGender(obj: any) {
    this.genderName = obj.text
  }

  addFamilyHistory(): void {

    const f = this.MyFormGroup.value;
   
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
      this.MyFormGroup.markAllAsTouched();
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

    this.MyFormGroup.reset({
      fhistId: 0,
      ipEmrId: 0,
      regId: '',
      opIpType: 0,
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
  
  onSave() {
    if (this.Chargelist.length === 0) {
      this.toastr.warning('Please add at least one family medical history record.');
      return;
    }

    const formValue = this.Chargelist.map((item: any) => ({
      fhistId: item.fhistId ?? 0,
      ipEmrId: 0,
      regId: this.vRegId,
      opIpType: 0,
      admissionId: this.VisitId,

      relationshipId: item.relationshipId,
      memberName: item.memberName,
      age: item.age,
      clinicalHistory: item.clinicalHistory,
      duration: item.duration,
      genderId: item.genderId,
      summary: item.summary,
      status: item.status ?? true
    }));



    this._CasepaperService.saveFamilyHistory(formValue).subscribe({
      next: (res: any) => {
        this.toastr.success('Family medical history saved successfully.', 'Success');
        this.dialogRef.close(res);
      },
      error: (error: any) => {
        console.error('Family History Save Error:', error);
        this.toastr.error('Failed to save family medical history.', 'Error');
      }
    });
  }

  onClose() {
    this.MyFormGroup.reset();
    this._matDialog.closeAll();
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
