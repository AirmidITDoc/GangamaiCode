import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdvanceDetailObj } from 'app/main/opd/appointment/appointment.component';
import { SampleCollectionService } from '../sample-collection.service';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

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
  isLoading: String = '';

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

  dateValue: any = new Date().toISOString();


  dataSource = new MatTableDataSource<SampleList>();
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private formBuilder: FormBuilder,
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
  onSave() {
    debugger;
    this.isLoading = 'save';
    // this.dataSource.data.push(this.samplelist);
    let updatesamcollection = [];

    this.samplelist.forEach((element) => {
      console.log(element);
      let UpdateAddSampleDetailsObj = {};
      UpdateAddSampleDetailsObj['PathReportID'] = element.PathReportID,
        UpdateAddSampleDetailsObj['SampleDateTime'] = this._SampleService.sampldetailform.get('SampleDateTime').value || ''
      UpdateAddSampleDetailsObj['IsSampleCollection'] = 1;// this.datePipe.transform(this._SampleService.sampldetailform.get('SampleDateTime').value, "MM-dd-yyyy"),//  
      UpdateAddSampleDetailsObj['No'] = element.SampleNo || 0;
      updatesamcollection.push(UpdateAddSampleDetailsObj);
    });
    let submitData = {
      "updatepathologysamplecollection": updatesamcollection
    };
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
    // this.onClearServiceAddList();
    this.isLoading = '';

  }
  // tableElementChecked(event, element) {
  //   this.samplelist =[];
  //   if (event.checked) {
  //     this.interimArray.push(element);
  //   } else if (this.interimArray.length > 0) {
  //     let index = this.interimArray.indexOf(element);
  //     if (index !== -1) {
  //       this.interimArray.splice(index, 1);
  //       this.dataSource.data.push(this.interimArray);

  //     }

  //   this.samplelist.push(element);
  // }
  // console.log(this.samplelist);
  // }
  // tableElementChecked(event, element) {
  //   debugger;
  //   if(event){
  //  this.samplelist =[];
  //   if (event.checked) {
  //     this.interimArray.push(element);
  //   } else if (this.interimArray.length > 0) {
  //     let index = this.interimArray.indexOf(element);
  //     if (index !== -1) {
  //       this.interimArray.splice(index, 1);


  //     }
  //   }
  //   this.samplelist.push(element);
  //   }
  //   console.log(this.samplelist);
  // }

  tableElementChecked(event, element) {

    if (event) {
      //  this.samplelist =[];
      if (event.checked) {
        this.interimArray.push(element);
      } else if (this.interimArray.length > 0) {
        let index = this.interimArray.indexOf(element);
        if (index !== -1) {
          this.interimArray.splice(index, 1);
        }
      }
      this.samplelist.push(element);
    }
    // console.log(this.samplelist);
  }
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
