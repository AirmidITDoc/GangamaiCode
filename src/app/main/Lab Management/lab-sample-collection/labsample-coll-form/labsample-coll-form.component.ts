import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
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

  constructor(private formBuilder: UntypedFormBuilder,
    public _SampleService: LabSampleCollectionService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LabsampleCollFormComponent>,
    public dialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private _fuseSidebarService: FuseSidebarService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,

  ) { }

  vSampleCollFormGroup: FormGroup

  ngOnInit(): void {
    if (this.data) {
      console.log(this.data)
      this.regObj = this.data
      this.getSampledetailListLab(this.regObj);
      return;
    }
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
