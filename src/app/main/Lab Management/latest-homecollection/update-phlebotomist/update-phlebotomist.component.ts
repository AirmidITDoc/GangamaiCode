import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { HomeCollectionService } from '../../home-collection/home-collection.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-update-phlebotomist',
  templateUrl: './update-phlebotomist.component.html',
  styleUrls: ['./update-phlebotomist.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdatePhlebotomistComponent {
  phlebotomists: Phlebotomist[] = [];
  selectedPhlebotomist: Phlebotomist | null = null;
  fromDate: any;
  toDate: any;
  patientName: any = '';
  regObj: any = ''
  phlebotomistForm: FormGroup;

  displayedColumns: string[] = [
    'srNo',
    'dateTime',
    'unit',
    'patientName',
    'mobileNo',
    'phlebotomist',
    'status'
  ];

  dataSource = new MatTableDataSource<any>([]);

  constructor(public _homeCollectionService: HomeCollectionService,public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any, public datePipe: DatePipe, private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    if (this.data.row) {
      this.regObj = this.data.row
      console.log(this.regObj)
      this.fromDate = this.regObj.collectionDate
      this.toDate = this.regObj.collectionDate
      this.patientName = this.regObj.firstName
    }
    this.loadPhlebotomists();
    this.phlebotomistForm = this._homeCollectionService.CreatePhleForm();
    // this.loadUnassigned();
  }

  // 1. Load all phlebotomists with their total assigned patient count
  loadPhlebotomists(): void {
    this._homeCollectionService.getPhlebotomistList().subscribe((res: any[]) => {
      // debugger
      this.phlebotomists = (res || []).map(x => ({
        id: x.phlebotomistId,
        name: x.phlebotomistName,
        initials: this.getInitials(x.phlebotomistName),
        totalPatients: x.totalPatients
      }));

      // select the first card by default
      if (this.phlebotomists.length) {
        this.selectPhlebotomist(this.phlebotomists[0]);
      }
    });
  }

  // 2. Card click: mark selected and load that phlebotomist's patients into the table
  selectPhlebotomist(p: Phlebotomist): void {
    this.selectedPhlebotomist = p;
    this.loadPatients(p);
  }

  loadPatients(p: Phlebotomist): void {
    const fromDateControl = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
    const toDateControl = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
    const filters: any[] = [];
    filters.push(
      {
        "fieldName": "FromDate",
        "fieldValue": fromDateControl,
        "opType": "StartsWith"
      },
      {
        "fieldName": "ToDate",
        "fieldValue": toDateControl,
        "opType": "StartsWith"
      },
      {
        "fieldName": "PatientName",
        "fieldValue": '%', //String(this.patientName),
        "opType": "StartsWith"
      },
      {
        "fieldName": "PhlebotomistId",
        "fieldValue": String(p.id),
        "opType": "Equals"
      },
      {
        "fieldName": "Status",
        "fieldValue": "0",
        "opType": "Equals"
      }
    );

    const data = {
      "first": 0,
      "rows": 999999,
      "sortField": "HomeCollectionId",
      "sortOrder": 0,
      "filters": filters,
      "exportType": "JSON",
      "columns": []
    };
    this._homeCollectionService.getHomeCollectionlist(data).subscribe((res) => {
      this.dataSource.data = (res.data || []).map(r => ({
        dateTime: r.collectionTime,
        patientName: r.firstName,
        mobileNo: r.mobileNo,
        unitName: r.hospitalName,
        phlebotomist: r.phlebotomist,
        status: this.getStatusText(r.status)  // need to change later 
      }));
    });
  }

  private getStatusText(s: any): 'Pending' | 'Completed' {
    return Number(s) === 1 ? 'Completed' : 'Pending';
  }

  private getInitials(name: string): string {
    return (name || '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w.charAt(0).toUpperCase())
      .join('');
  }

  // ---- 2. class properties ----
  // unassignedColumns: string[] = ['select', 'srNo', 'dateTime', 'patientName', 'mobileNo', 'unit', 'phlebotomist'];
  // unassignedSource = new MatTableDataSource<UnassignedPatient>([]);
  // selection = new SelectionModel<UnassignedPatient>(true, []);
  // saving = false;

  // loadUnassigned(): void {
  //   const fromDateControl = this.datePipe.transform(this.fromDate, "yyyy-MM-dd");
  //   const toDateControl = this.datePipe.transform(this.toDate, "yyyy-MM-dd");
  //   const filters: any[] = [];
  //   filters.push(
  //     {
  //       "fieldName": "FromDate",
  //       "fieldValue": fromDateControl,
  //       "opType": "StartsWith"
  //     },
  //     {
  //       "fieldName": "ToDate",
  //       "fieldValue": toDateControl,
  //       "opType": "StartsWith"
  //     },
  //     {
  //       "fieldName": "PatientName",
  //       "fieldValue": String(this.patientName),
  //       "opType": "StartsWith"
  //     },
  //     {
  //       "fieldName": "PhlebotomistId",
  //       "fieldValue": "0",
  //       "opType": "Equals"
  //     },
  //   );

  //   const data = {
  //     "first": 0,
  //     "rows": 999999,
  //     "sortField": "HomeCollectionId",
  //     "sortOrder": 0,
  //     "filters": filters,
  //     "exportType": "JSON",
  //     "columns": []
  //   };
  //   this._homeCollectionService.getHomeCollectionlist(data).subscribe((res) => {
  //     this.unassignedSource.data = (res.data || []).map(r => ({
  //       homeCollectionId: r.homeCollectionId,
  //       dateTime: r.collectionTime,
  //       patientName: r.firstName,
  //       mobileNo: r.mobileNo,
  //       unitName: r.unitName
  //     }));
  //     this.selection.clear();
  //   });
  // }

  // // true when any ticked patient already has a phlebotomist
  // get isReassign(): boolean {
  //   return this.selection.selected.some(x => !!x.phlebotomist);
  // }

  // // block saving if every ticked patient already has the chosen phlebotomist
  // get canSave(): boolean {
  //   return this.selection.hasValue()
  //     && !!this.selectedPhlebotomist
  //     && !this.saving
  //     && this.selection.selected.some(x => x.phlebotomist !== this.selectedPhlebotomist!.name);
  // }

  // isAllSelected(): boolean {
  //   return this.unassignedSource.data.length > 0 &&
  //     this.selection.selected.length === this.unassignedSource.data.length;
  // }

  // toggleAll(): void {
  //   this.isAllSelected()
  //     ? this.selection.clear()
  //     : this.selection.select(...this.unassignedSource.data);
  // }

  // onAssign(): void {
  //   // if (!this.canSave) { return; }

  //   // const payload = {
  //   //   phlebotomistId: this.selectedPhlebotomist!.id,
  //   //   homeCollectionIds: this.selection.selected.map(x => x.homeCollectionId)
  //   // };

  //   // this.saving = true;
  //   // this._homeCollectionService.assignPhlebotomist(payload).subscribe({
  //   //   next: () => {
  //   //     this.saving = false;
  //   //     this._snackBar.open('Phlebotomist assigned', 'OK', { duration: 3000 });
  //   //     this.loadPhlebotomists();   // refresh counts + assigned table
  //   //     this.loadUnassigned();      // assigned patients leave the pending list
  //   //   },
  //   //   error: () => {
  //   //     this.saving = false;
  //   //     this._snackBar.open('Could not assign. Please try again.', 'OK', { duration: 4000 });
  //   //   }
  //   // });
  // }

  onSave() {
    if (!this.selectedPhlebotomist) { return; }

    this.phlebotomistForm.get('homeCollectionId').setValue(this.regObj.homeCollectionId)
    this.phlebotomistForm.get('phlebotomist').setValue(this.selectedPhlebotomist.id)
    if (!this.phlebotomistForm.invalid) {
      console.log(this.phlebotomistForm.value)
      this._homeCollectionService.statusUpdate(this.phlebotomistForm.value).subscribe((response) => {
        this.loadPatients(this.selectedPhlebotomist); 
      });
    } {
      const invalidFields = [];
      if (this.phlebotomistForm.invalid) {
        for (const controlName in this.phlebotomistForm.controls) {
          if (this.phlebotomistForm.controls[controlName].invalid) {
            invalidFields.push(`Form: ${controlName}`);
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

}

export interface Phlebotomist {
  id: number;
  name: string;
  initials: string;
  totalPatients: number;
}

export interface UnassignedPatient {
  homeCollectionId: number;
  dateTime: string | Date;
  patientName: string;
  mobileNo: string;
  unitName: string;
  phlebotomistId?: number | null;
  phlebotomist?: string | null;   // empty = not assigned yet
}