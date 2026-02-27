import { Component, EventEmitter, Inject, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { LabSampleCollectionService } from '../lab-sample-collection.service';
import { SampleList } from '../lab-sample-collection.component';

function formatDate(rawDate: string): string {
  if (!rawDate) return '';

  // Case 1: ISO format with T → 2026-01-15T00:00:00
  if (rawDate.includes('T')) {
    return rawDate.split('T')[0]; // 2026-01-15
  }

  // Case 2: Space format → 15-01-2026 00:00:00
  if (rawDate.includes(' ')) {
    const datePart = rawDate.split(' ')[0]; // 15-01-2026
    const [day, month, year] = datePart.split('-');
    return `${year}-${month}-${day}`; // 2026-01-15
  }

  return '';
}

@Component({
  selector: 'app-labsample-coll-form',
  templateUrl: './labsample-coll-form.component.html',
  styleUrls: ['./labsample-coll-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LabsampleCollFormComponent {
  regObj: any;
  dataSource = new MatTableDataSource<SampleList>();
  sampleList: SampleList[] = [];
  testSettingForm: FormGroup;
  minDate = new Date();

  autocompleteModeSpecimen: string = "PathSpecimenMaster"
  autocompleteModeSpecimenCon: string = "PathSpecimenConditionMaster"
  autocompleteModeSpecimenColor: string = "SpecimentColors"
  autocompleteModeSpecimenContainer: string = "PathSpecimenContainerMaster"
  autocompleteModeSpecimenCollection: string = "PathSpecimenCollectionMaster"
  autocompleteModeSpecimenPreser: string = "PathSpecimenPreservativeMaster"

  constructor(private formBuilder: UntypedFormBuilder,
    public _SampleService: LabSampleCollectionService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LabsampleCollFormComponent>,
    public dialog: MatDialog,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,

  ) { }

  vSampleCollFormGroup: FormGroup

  ngOnInit(): void {
    this.testSettingForm = this.createSettingForm();
    if (this.data) {
      console.log(this.data)
      this.regObj = this.data
      this.getSampledetailListLab(this.regObj);
      return;
    }
  }

  getCurrentTime(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  createSettingForm() {
    return this._formBuilder.group({
      specimenTypeId: [0],
      specimenColor: [0],
      specimenConditionId: [0],
      containerTypeId: [0],
      collectionMethod: [0],
      // specimenSource: [''],
      noofContainer: [''],
      preservationUsed: [0],
      // transportInstruction: [''],

      isConsentRequired: [false, [Validators.required]],
      // consentName: [''],
      consentDetail: [''],
      barcodeLabel: [''],

      disease: [0],
      diseasePrecautionNote: [''],
      isNotifiable: [false],
      isInfectious: [false],

      isFastingRequired: [false, [Validators.required]],
      // methodologyId: [0],
      // reported: [''],
      testInformationTemplate: ['', [Validators.required]],
      // unit:[],
      isApprovedRequired: [false],

      collectionDate: [new Date()],
      collectionTime: [this.getCurrentTime(), Validators.required],
    })
  }

  onChangeDate(value: any) {
    // debugger;
    if (value) {
      const inputDate = new Date(value);

      const dateOfReg = new Date(Date.UTC(
        inputDate.getFullYear(),
        inputDate.getMonth(),
        inputDate.getDate()
      ));

      // Optional: Emit localized date and time
      const [datePart, timePart] = dateOfReg
        .toLocaleString("en-US")
        .split(',')
        .map(part => part.trim());

      this.eventEmitForParent(datePart, timePart);

      const isoDateString = dateOfReg.toISOString();
      this.testSettingForm.get('collectionDate').setValue(isoDateString);
    }
  }

  collTime: any;
  onChangeTime(event: any) {
    let time = event.target.value;
    if (time && time.length >= 5) {
      time = time.substring(0, 5);
    }
    console.log("Time changed:", time); // "11:51"
    this.collTime = time
    this.testSettingForm.get('collectionTime')?.setValue(time, { emitEvent: false });
  }

  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }

  getSampledetailListLab(row) {
    // debugger

    let formattedDate = formatDate(row.pathDate);

    console.log(formattedDate);

    var m_data = {
      "first": 0,
      "rows": 10,
      "sortField": "PathTestID",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "BillNo",
          "fieldValue": String(row.billNo),
          "opType": "Equals"
        },
        {
          "fieldName": "BillDate",
          "fieldValue": formattedDate,
          "opType": "Equals"
        },
        {
          "fieldName": "OP_IP_Type",
          "fieldValue": "4",
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }

    console.log(m_data);
    this._SampleService.getSampleDetailsListLab(m_data).subscribe(res => {
      this.dataSource.data = res.data as SampleList[];
      this.sampleList = res.data as SampleList[];
      console.log(this.dataSource.data)
    });
  }

  getTubeIcon(specimen: string): string {
    switch (specimen) {
      case 'Blood':
        return 'assets/images/logos/tube-red.png';
      case 'Urine':
        return 'assets/images/logos/tube-yellow.png';
      case 'Plasma':
        return 'assets/images/logos/tube-blue.png';
      default:
        return 'assets/images/logos/tube-gray.png';
    }
  }

  onSubmit() {

  }

  OnReset() {
    this._matDialog.closeAll();
  }

  count = 0;

  increase() {
    this.count++;
  }

  decrease() {
    if (this.count > 0) {
      this.count--;
    }
  }

}
