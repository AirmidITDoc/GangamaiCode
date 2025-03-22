import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { SampleCollectionService } from '../sample-collection.service';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { AdmissionModule } from 'app/main/ipd/Admission/admission/admission.module';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { debug } from 'console';

@Component({
  selector: 'app-sampledetailtwo',
  templateUrl: './sampledetailtwo.component.html',
  styleUrls: ['./sampledetailtwo.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SampledetailtwoComponent implements OnInit {

  interimArray: any = [];
  samplelist: any = [];
  msg: any;
  date: any;
  isLoading: String = '';
  Currentdate: any;
  displayedColumns: string[] = [
    'select',
    'ServiceName',
    'SampleCollectionTime',
  ];

  selectedAdvanceObj: AdvanceDetailObj;
  hasSelectedContacts: boolean;
  screenFromString = 'OP-billing';
  advanceData: any;
  VADate: Date;
  PathTestID: Number;
  ServiceName: String;
  IsSampleCollection: boolean;
  SampleCollectionTime: Date;
  PathReportID: any;
  dateTimeObj: any;
  // selectedAdvanceObj1:AdmissionPersonlModel;
  selectedAdvanceObj1: any;

  regObj: any;
  PatientName: any;
  MobileNo: any;
  DepartmentName: any;
  AgeMonth: any;
  AgeDay: any;
  GenderName: any;
  RefDocName: any;
  WardName: any;
  RegNo: any;
  vOPIPId: any;
  VisitId: any;
  RegId: any;
  Doctorname: any;
  vOPDIPdNo: any;
  AgeYear: any;
  PatientType: any;
  Tarrifname: any;
  CompanyName: any;
  vClassId: any;
  Lbl:any;
  DOA:any;
  DOT:any;

  dataSource = new MatTableDataSource<SampleList>();
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private formBuilder: UntypedFormBuilder,
    public _SampleService: SampleCollectionService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SampledetailtwoComponent>,
    public dialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private _fuseSidebarService: FuseSidebarService,


  ) {
    dialogRef.disableClose = true;
    this.advanceData = data;
    console.log(this.advanceData);
    console.log(new Date())

    let mydate = new Date()

    // this.date = mydate.toISOString().slice(0, 19).replace('T', ' ');

    this.date = (this.datePipe.transform(new Date(), "MM-dd-YYYY hh:mm tt"));

    //this.date= (this.datePipe.transform(new Date(),"MM-dd-YYYY hh:mm")).toString().slice(0, 16) || '01/01/1900',
    //this.date = new Date();


    console.log(this.date)


    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);
  }

  ngOnInit(): void {

    if (this.data) {
      this.regObj = this.data
      console.log(this.regObj)
      this.RegNo = this.regObj.regNo
      this.vOPIPId = this.regObj.visitId
      this.VisitId = this.regObj.visitId
      this.RegId = this.regObj.regId
      this.PatientName = this.regObj.patientName
      this.Doctorname = this.regObj.doctorName
      this.vOPDIPdNo = this.regObj.oP_IP_No
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
      this.Lbl = this.regObj.lbl
      this.DOA = this.regObj.doa
      this.DOT = this.regObj.dot
      this.WardName=this.regObj.wardName
    }

    // if (this.advanceData) {
    //   this.selectedAdvanceObj = this.advanceData.regobj;
    //   this.selectedAdvanceObj1 = this.advanceData.regobj;
    //   console.log(this.selectedAdvanceObj1);
    // }

    this.getSampledetailList();
    this.getSampledetailList1(this.regObj);
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
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
  getSampledetailList() {

    let OPIP
    if (this.regObj.lbl == "IP" || this.regObj.lbl == "IP") {
      OPIP = 1;
    }
    else if (this.regObj.lbl == "OP" || this.regObj.lbl == "OP") {
      OPIP = 0;
    }

    var m_data = {
      "BillNo": this.regObj.billNo,
      "BillDate": this.datePipe.transform(this.regObj.pathDate, "yyyy-MM-dd"),
      "OP_IP_Type": OPIP,
    }
    console.log(m_data);
    this._SampleService.getSampleDetailsList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as SampleList[];
      console.log(this.dataSource.data)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        // this.sIsLoading = '';
      });
  }

  getSampledetailList1(row) {
debugger
    let OPIP: string;
    if (row.lbl == "IP" || row.patientType == "IP") {
      OPIP = "1";
    }
    else if (row.lbl == "OP" || row.patientType == "OP") {
      OPIP = "0";
    }

    let inputDate = row.vaDate;
    let parts = inputDate.split(' ')[0].split('-');
    let date = `${parts[2]}-${parts[1]}-${parts[0]}`;

    // let OPIP = row.lbl === 'OP' ? 0 : 1;

    var m_data = {
      "first": 0,
      "rows": 10,
      "sortField": "BillNo",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "BillNo",
          "fieldValue": String(row.billNo),
          "opType": "Equals"
        },
        {
          "fieldName": "BillDate",
          "fieldValue": date,
          "opType": "Equals"
        },
        {
          "fieldName": "OP_IP_Type",
          "fieldValue": OPIP,
          "opType": "Equals"
        }
      ],
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

  onSave() {
    
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    if (this.selection.selected.length == 0) {
      Swal.fire('Error !', 'Please select sample data', 'error');
      return;
    }
    let updatesamcollection = [];

      this.selection.selected.forEach((element) => {
        console.log(element);
        let UpdateAddSampleDetailsObj = {
          "PathReportId": element.pathReportID || 1,
          "sampleCollectionTime": this._SampleService.sampldetailform.get('SampleDateTime').value || '01/01/1900',
          "IsSampleCollection": true, //String(element.isSampleCollection) === "True" ? true : false,
          "SampleNo": String(element.sampleNo || 0)
        }
        updatesamcollection.push(UpdateAddSampleDetailsObj);
      });

      let submitData={
        "pathlogySampleCollection":updatesamcollection
      }

    console.log(submitData);
    this._SampleService.UpdateSampleCollection(submitData).subscribe(data => {
      this.msg = data;
      if (data) {
        Swal.fire('Congratulations !', 'Pathology Sample collection data updated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Pathology Sample collection data not update', 'error');
      }
    });
    this.isLoading = '';
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
  isSampleCollection:boolean;
  SampleCollectionTime: Date;
  PathReportID: any;
  SampleNo: any;
  RegNo: any;
  pathReportID:any;
  sampleNo:any;

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
