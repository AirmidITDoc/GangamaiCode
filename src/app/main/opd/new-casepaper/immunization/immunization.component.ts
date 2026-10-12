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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-immunization',
  templateUrl: './immunization.component.html',
  styleUrls: ['./immunization.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ImmunizationComponent {
  MyFormGroup: FormGroup
  autocompleteModevaccine: string = "Vaccineinformation";

  opipId: any;
  Tarrifname: any;
  vaccineName: any;
  vDoctorName: any;
  vRefDocName: any;
  vRegId: any;
  opiptype: any
  minDate: Date = new Date();
  minDate1: Date = new Date();
  minDate2: Date = new Date();

  patientDetail: any = {};
  Chargelist: any[] = [];
  dsImmunizationList = new MatTableDataSource<ImmunizationList>();

  displayedColumns: string[] = [
    'VaccineName',
    'lotNumber',
    'lotExpDate',
    'occuranceDate',
    'recommandationDate',
    'series',
    'doseNumber',
    'seriesDoses',
    'recommendedDate',
    'supportingImmunization',
    'description',
    'comment',
    'primarySource',
    'forecastStatus',
    'status',
    'Action'
  ]

  constructor(
    public _OpAppointmentService: AppointmentlistService,
    private _CasepaperService: CasepaperService,
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ImmunizationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private datePipe: DatePipe,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  ngOnInit(): void {

    this.MyFormGroup = this.createMyForm();
    this.MyFormGroup.markAllAsTouched();

    if (this.data) {
      this.opipId = this.data.visitId ?? this.data.admissionId;
      this.vRegId = this.data.regId;
      this.patientDetail = this.data;
      this.opiptype = this.data.visitId ? 0 : 1;
      console.log("this.data", this.patientDetail);
      this.getImmunizationDet(this.vRegId)
    }
  }

  createMyForm(element: any = {}): FormGroup {
    return this._formBuilder.group({
      immunizatoinId: [0],
      opipid: [this.opipId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      opIpType: [this.opiptype],
      regId: [this.vRegId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      vaccineId: [element.relationshipId ?? 0],
      lotNumber: [''],
      lotExpDate: [], //date
      occuranceDate: [], //date
      primarySource: [''],
      recommandationDate: [], //date
      forecastStatus: [false],
      series: [''],
      description: [''],
      doseNumber: [0],
      seriesDoses: [''],
      recommendedDate: [], //date
      comment: [''],
      supportingImmunization: [''],
      status: [true]
    });
  }

  getImmunizationDet(regId: any): void {
    const data = {
      "first": 0,
      "rows": 10,
      "sortField": "ImmunizatoinId",
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
    this._CasepaperService.getImmunizationByRegId(data).subscribe((res: any) => {
      const history = res.data || [];

      this.Chargelist = history.map((item: any) => ({
        vaccineId: item.vaccineId,
        vaccineName: item.vaccineName,
        lotNumber: item.lotNumber,
        lotExpDate: this.datePipe.transform(item.lotExpDate, 'yyyy-MM-dd'), //date
        occuranceDate: this.datePipe.transform(item.occuranceDate, 'yyyy-MM-dd'), //date
        primarySource: item.primarySource,
        recommandationDate: this.datePipe.transform(item.recommandationDate, 'yyyy-MM-dd'), //date
        forecastStatus: item.forecastStatus,
        series: item.series,
        description: item.description,
        doseNumber: item.doseNumber,
        seriesDoses: item.seriesDoses,
        recommendedDate: this.datePipe.transform(item.recommendedDate, 'yyyy-MM-dd'), //date
        comment: item.comment,
        supportingImmunization: item.supportingImmunization,
        status: item.status
      }));

      this.dsImmunizationList.data = [...this.Chargelist];
    });
  }

  selectChangeVaccine(obj: any) {
    this.vaccineName = obj.text

    this._CasepaperService.getVaccineById(obj.value).subscribe(data => {
      console.log(data)
      this.MyFormGroup.get('lotNumber').setValue(data.batchNo)
      this.MyFormGroup.get('lotExpDate').setValue(data.expiryDate)
      this.MyFormGroup.get('doseNumber').setValue(data.noofDoses)
    });
  }

  onADD(): void {

    const V = this.MyFormGroup.value;

    const newEntry = {
      vaccineId: V.vaccineId,
      vaccineName: this.vaccineName,
      lotNumber: V.lotNumber,
      lotExpDate: this.datePipe.transform(V.lotExpDate, 'yyyy-MM-dd'), //date
      occuranceDate: this.datePipe.transform(V.occuranceDate, 'yyyy-MM-dd'), //date
      primarySource: V.primarySource,
      recommandationDate: this.datePipe.transform(V.recommandationDate, 'yyyy-MM-dd'), //date
      forecastStatus: V.forecastStatus,
      series: V.series,
      description: V.description,
      doseNumber: V.doseNumber,
      seriesDoses: V.seriesDoses,
      recommendedDate: this.datePipe.transform(V.recommendedDate, 'yyyy-MM-dd'), //date
      comment: V.comment,
      supportingImmunization: V.supportingImmunization,
      status: V.status
    };
    console.log(newEntry)

    this.Chargelist.push(newEntry);
    this.dsImmunizationList.data = [...this.Chargelist];

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

  deleteTableRow(event: MouseEvent, row: ImmunizationList): void {
    event.stopPropagation();

    const index = this.Chargelist.indexOf(row);

    if (index !== -1) {
      this.Chargelist.splice(index, 1);
      this.dsImmunizationList.data = [...this.Chargelist];

      this.toastr.success('Deleted successfully', 'Success');
    }
  }

  onSave() {
    if (this.Chargelist.length === 0) {
      this.toastr.warning('Please Immunization record.');
      return;
    }

    const formValue = this.Chargelist.map((item: any) => ({
      immunizatoinId: item.immunizatoinId ?? 0,
      opipid: this.opipId,
      opIpType: this.opiptype,
      regId: this.vRegId,
      vaccineId: item.vaccineId,
      lotNumber: item.lotNumber,
      lotExpDate: item.lotExpDate, //date
      occuranceDate: item.occuranceDate, //date
      primarySource: item.primarySource == true ? '1' : '0',
      recommandationDate: item.recommandationDate, //date
      forecastStatus: item.forecastStatus == true ? 'Completed' : 'Recommended',
      series: item.series,
      description: item.description,
      doseNumber: item.doseNumber,
      seriesDoses: item.seriesDoses,
      recommendedDate: item.recommendedDate, //date
      comment: item.comment,
      supportingImmunization: item.supportingImmunization,
      status: item.status == true ? 'Active' : 'InActive'
    }));

    this._CasepaperService.saveImmunization(formValue).subscribe({
      next: (res: any) => {
        this.toastr.success('Immunization saved successfully.', 'Success');
        this.dialogRef.close(res);
      },
      error: (error: any) => {
        console.error('Immunization Save Error:', error);
        this.toastr.error('Failed to save Immunization.', 'Error');
      }
    });
  }

  onClose() {
    // this.MyFormGroup.reset();
    this._matDialog.closeAll();
  }
}

export class ImmunizationList {
  vaccineId = 0;
  lotNumber: any;
  lotExpDate: any;
  occuranceDate: any;
  primarySource: any;
  recommandationDate: any;
  forecastStatus: any;
  series: any;
  description: any;
  doseNumber: any;
  seriesDoses: any;
  recommendedDate: any;
  comment: any;
  supportingImmunization: any;
  status: any;

  constructor(data: Partial<ImmunizationList> = {}) {
    this.vaccineId = data.vaccineId ?? 0;
    this.lotNumber = data.lotNumber ?? '';
    this.lotExpDate = data.lotExpDate ?? null;
    this.occuranceDate = data.occuranceDate ?? '';
    this.primarySource = data.primarySource ?? '';
    this.recommandationDate = data.recommandationDate ?? '';
    this.forecastStatus = data.forecastStatus ?? 0;
    this.series = data.series ?? '';
    this.description = data.description ?? 0;
    this.doseNumber = data.doseNumber ?? '';
    this.seriesDoses = data.seriesDoses ?? '';
    this.recommendedDate = data.recommendedDate ?? '';
    this.comment = data.comment ?? '';
    this.supportingImmunization = data.supportingImmunization ?? '';
    this.status = data.status ?? '';
  }
}