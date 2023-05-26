import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AdvanceDetailObj } from 'app/main/opd/appointment/appointment.component';
import { SampleCollectionService } from '../sample-collection.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-sample-detail',
  templateUrl: './sample-detail.component.html',
  styleUrls: ['./sample-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SampleDetailComponent implements OnInit {

  msg: any;
  displayedColumns: string[] = [
    'checkbox',
    // 'VADate',
    'ServiceName',
    // 'IsSampleCollection',
    'SampleCollectionTime',
    //'PathReportID',
    // 'action'
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
  isLoading: String = '';
  dateValue: any = new Date().toISOString();


  dataSource = new MatTableDataSource<SampleList>();
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private formBuilder: FormBuilder,
    public _SampleService: SampleCollectionService,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SampleDetailComponent>,
    public dialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private _fuseSidebarService: FuseSidebarService,) {
    dialogRef.disableClose = true;
    this.advanceData = data;
    console.log(this.advanceData);

  }

  ngOnInit(): void {

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;

    }

    this.getSampledetailList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  // onEdit(e,row) {
  //      debugger;
  //     console.log(row);
  //     this.dataSource.data=[];
  //     if(row.PatientType=="OP")
  //     {
  //       var m_data={
  //         "BillNo":5,//row.BillNo,
  //         "OP_IP_Type":0,//row.PatientType,
  //        }

  //     }else if(row.PatientType=="IP")
  //     {
  //       var m_data={
  //         "BillNo":5,//row.BillNo,
  //         "OP_IP_Type":1,//row.PatientType,
  //        }
  //     }



  //       console.log(m_data);
  //       this._SampleService.getSampleList(m_data).subscribe(Visit => {
  //       this.dataSource.data = Visit as SampleList[];
  //       this.dataSource.sort =this.sort;
  //       this.dataSource.paginator=this.paginator;
  //       console.log(this.dataSource.data);
  //     });

  //   }
  // this.datePipe.transform(row.DOA,'yyyy-MM-dd')

  getSampledetailList() {
    //  debugger;
    let OPIP
    if (this.advanceData.OP_IP_Type == "IP") {
      OPIP = 1;
    }
    else {
      OPIP = 0;
    }

    this.sIsLoading = 'loading-data';
    var m_data = {
      "BillNo": this.advanceData.BillNo,
      "BillDate": this.datePipe.transform(this.advanceData.From_dt, "yyyy-MM-dd"),
      "OP_IP_Type": OPIP,//this.advanceData.OP_IP_Type,
    }
    //  console.log(m_data);
    this._SampleService.getSampleDetailsList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as SampleList[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';

    },
      error => {
        this.sIsLoading = '';
      });
    console.log(this.dataSource.data);
  }






  onClose() {
    this.dialogRef.close();
  }

}



export class SampleList {
  VADate: Date;
  PathTestID: Number;
  ServiceName: String;
  IsSampleCollection: boolean;
  SampleCollectionTime: Date;
  PathReportID: any;


  constructor(SampleList) {
    this.VADate = SampleList.VADate || '';
    this.PathTestID = SampleList.PathTestID || 0;
    this.ServiceName = SampleList.ServiceName || '';
    this.IsSampleCollection = SampleList.IsSampleCollection || 0;
    this.SampleCollectionTime = SampleList.SampleCollectionTime || '';
    this.PathReportID = SampleList.PathReportID || 0;


  }

}
