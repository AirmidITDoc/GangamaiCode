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
import { SampleCollectionService } from '../sample-collection.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { EditSampledateComponent } from '../edit-sampledate/edit-sampledate.component';

@Component({
  selector: 'app-samplecollection-page',
  templateUrl: './samplecollection-page.component.html',
  styleUrls: ['./samplecollection-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SamplecollectionPageComponent {

  interimArray: any = [];
  samplelist: any = [];
  date: any;

  Currentdate: any;
  displayedColumns: string[] = [
    'select',
    'ServiceName',
    'SampleCollectionTime',
    'editSampleCollectionTime',
  ];

  selectedAdvanceObj: AdvanceDetailObj;
  hasSelectedContacts: boolean;
  screenFromString = 'OP-billing';

  dateTimeObj: any;
  selectedAdvanceObj1: any;

  regObj: any;

  dataSource = new MatTableDataSource<SampleList>();
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private formBuilder: UntypedFormBuilder,
    public _SampleService: SampleCollectionService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SamplecollectionPageComponent>,
    public dialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private _fuseSidebarService: FuseSidebarService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,

  ) {
    dialogRef.disableClose = true;

    let mydate = new Date()
    this.date = (this.datePipe.transform(new Date(), "MM-dd-YYYY hh:mm tt"));

    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);
  }
  vSampleCollFormGroup: FormGroup
  ngOnInit(): void {
    this.vSampleCollFormGroup = this.vSamplecollFormInsert();
    if (this.data)
      this.regObj = this.data
    this.getSampledetailList1(this.regObj);
  }



  tableElementChecked(event, element) {

    if (event) {
      if (event.checked) {
        this.interimArray.push(element);
      } else if (this.interimArray.length > 0) {
        let index = this.interimArray.indexOf(element);
        if (index !== -1) {
          this.interimArray.splice(index, 1);
        }
      }
      this.samplelist.push(element);
      console.log();
    }

  }

  getSampledetailList1(row) {
    // debugger
    let OPIP: string;
    if (row.lbl == "IP" || row.patientType == "IP") {
      OPIP = "1";
    }
    else if (row.lbl == "OP" || row.patientType == "OP") {
      OPIP = "0";
    }
    else if (row.lbl == "Lab" || row.opdipdtype == 4) {
      OPIP = "4";
    }

    let rawDate = row.pathDate;
    let day = rawDate.split("T")[0];
    let rest = rawDate.split("T")[1].split("-");
    let month = rest[0];
    let year = rest[1];

    let formattedDate = `${day}`

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
          "fieldValue": OPIP,
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }

    console.log(m_data);
    this._SampleService.getSampleDetailsList1(m_data).subscribe(Visit => {
      this.dataSource.data = Visit.data as SampleList[];
      console.log(this.dataSource.data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        // this.sIsLoading = '';
      });
  }



  vSamplecollFormInsert(): FormGroup {
    return this.formBuilder.group({
      pathlogySampleCollection: this.formBuilder.array([])// FormArray for details

    });
  }

  // 2. FormArray Group for Refund Detail
  createSampleDetail(item: any = {}): FormGroup {
    return this.formBuilder.group({
      PathReportId: [item.pathReportID, [this._FormvalidationserviceService.onlyNumberValidator()]],
      sampleCollectionTime: [this._SampleService.sampldetailform.get('SampleDateTime').value || '01/01/1900', [Validators.required]],
      IsSampleCollection: [true],
      SampleNo: [item.sampleNo || 0, [this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      sampleCollectedBy: this.accountService.currentUserValue.userId
    });
  }

  get refundDetailsArray(): FormArray {
    return this.vSampleCollFormGroup.get('pathlogySampleCollection') as FormArray;
  }

  // onSave() {

  // if (this.selection.selected.length == 0) {
  //     Swal.fire('Error !', 'Please select sample data', 'error');
  //     return;
  //   }
  //     this.refundDetailsArray.clear();
  //     this.selection.selected.forEach(item => {
  //       this.refundDetailsArray.push(this.createSampleDetail(item));
  //     });


  //   console.log(this.vSampleCollFormGroup.value);
  //   this._SampleService.UpdateSampleCollection(this.vSampleCollFormGroup.value).subscribe(data => {
  //    this._matDialog.closeAll()
  //   });

  // }

  onSave() {

    if (this.selection.selected.length === 0) {
      Swal.fire('Error!', 'Please select sample data', 'error');
      return;
    }

         this.refundDetailsArray.clear();
      this.selection.selected.forEach(item => {
        this.refundDetailsArray.push(this.createSampleDetail(item));
      });

      console.log(this.vSampleCollFormGroup.value);

      this._SampleService
        .UpdateSampleCollection(this.vSampleCollFormGroup.value)
        .subscribe(() => {
          this._matDialog.closeAll();
        });
    };

    if (isSampleCollected) {
      Swal.fire({
        title: 'Confirm Update',
        text: 'Are you sure you want to update Sample Collection?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#41ea76ff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
      }).then(result => {
        if (result.isConfirmed) {
          proceedUpdate();
        }
      });
    } else {
      proceedUpdate();
    }
  }

  selection = new SelectionModel<SampleList>(true, []);
  masterToggle() {
    // if there is a selection then clear that selection
    if (this.isSomeSelected()) {
      this.selection.clear();
    } else {
      this.isAllSelected()
        ? this.selection.clear()
        : this.dataSource.data.forEach(row => this.selection.select(row));
    }
    console.log(this.selection)
    this.samplelist.push(this.selection);
  }

  isSomeSelected() {
    return this.selection.selected.length > 0;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    return numSelected === numRows;

  }

   EditSampleDate(contact) {
          console.log(contact)
          const dialogRef = this._matDialog.open(EditSampledateComponent,
              {
                  maxWidth: "100%",
                  height: '40%',
                  width: '40%',
                  data: {
                      Obj: contact,
                  }
              });
          dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed - Insert Action', result);
            this.getSampledetailList1(this.regObj);
          });
      }


 toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    this.dialogRef.close();
  }
}
export class SampleList {
  VADate: Date;
  VATime: Date;
  PathTestID: Number;
  ServiceName: String;
  IsSampleCollection: boolean;
  isSampleCollection: any;
  SampleCollectionTime: Date;
  PathReportID: any;
  SampleNo: any;
  RegNo: any;
  pathReportID: any;
  sampleNo: any;

  constructor(SampleList) {
    this.VADate = SampleList.VADate || '';
    this.VATime = SampleList.VATime || '';
    this.PathTestID = SampleList.PathTestID || 0;
    this.ServiceName = SampleList.ServiceName || '';
    this.IsSampleCollection = SampleList.IsSampleCollection || 0;
    this.isSampleCollection = SampleList.isSampleCollection || 0;
    this.SampleCollectionTime = SampleList.SampleCollectionTime || '';
    this.PathReportID = SampleList.PathReportID || 0;
    this.SampleNo = SampleList.SampleNo || 0;
    this.RegNo = SampleList.RegNo || 0;
    this.pathReportID = SampleList.pathReportID || 0;
    this.sampleNo = SampleList.sampleNo || 0;
  }
}

