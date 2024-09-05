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
import { AdmissionModule } from 'app/main/ipd/Admission/admission/admission.module';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';

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
Currentdate:any;
  displayedColumns: string[] = [
    'select',
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
  dateTimeObj: any;
  // selectedAdvanceObj1:AdmissionPersonlModel;
  selectedAdvanceObj1:any; 

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
    console.log(new Date())
    
    let mydate= new Date()

    // this.date = mydate.toISOString().slice(0, 19).replace('T', ' ');
    
    this.date = (this.datePipe.transform(new Date(),"MM-dd-YYYY hh:mm tt"));

    //this.date= (this.datePipe.transform(new Date(),"MM-dd-YYYY hh:mm")).toString().slice(0, 16) || '01/01/1900',
    //this.date = new Date();

 
    console.log( this.date )


    var now = new Date();
now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
this.date = now.toISOString().slice(0,16);
  }



  ngOnInit(): void {

    if (this.advanceData) {
      this.selectedAdvanceObj = this.advanceData.regobj;
      this.selectedAdvanceObj1= this.advanceData.regobj;
      console.log(this.selectedAdvanceObj1);
    }

    this.getSampledetailList();
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
    if (this.selectedAdvanceObj1.LBL == "IP" || this.selectedAdvanceObj1.Lbl == "IP") {
      OPIP = 1;
    }
    else if (this.selectedAdvanceObj1.LBL == "OP" || this.selectedAdvanceObj1.Lbl == "OP"){
      OPIP = 0;
    } 
     
    var m_data = {
      "BillNo": this.selectedAdvanceObj1.BillNo,
      "BillDate": this.datePipe.transform(this.selectedAdvanceObj1.PathDate, "yyyy-MM-dd"),
      "OP_IP_Type": OPIP,
    }
     console.log(m_data);
    this._SampleService.getSampleDetailsList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as SampleList[];
      console.log( this.dataSource.data )
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = ''; 
    },
      error => {
        // this.sIsLoading = '';
      }); 
  }


  onSave() { 
    this.isLoading = 'save'; 
    if(this.selection.selected.length==0){
      Swal.fire('Error !', 'Please select sample data', 'error');
      return;
    }

    let updatesamcollection = []; 

   this.selection.selected.forEach((element) => {
      console.log(element);
      let UpdateAddSampleDetailsObj = {};
      UpdateAddSampleDetailsObj['PathReportID'] = element.PathReportID,
        UpdateAddSampleDetailsObj['SampleDateTime'] = this._SampleService.sampldetailform.get('SampleDateTime').value || '01/01/1900'
      UpdateAddSampleDetailsObj['IsSampleCollection'] = 1;// this.datePipe.transform(this._SampleService.sampldetailform.get('SampleDateTime').value, "MM-dd-yyyy"),//  
      UpdateAddSampleDetailsObj['No'] = element.SampleNo;
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
  VATime:Date;
  PathTestID: Number;
  ServiceName: String;
  IsSampleCollection: boolean;
  SampleCollectionTime: Date;
  PathReportID: any; 
  SampleNo:any;
  

  constructor(SampleList) {
    this.VADate = SampleList.VADate || '';
    this.VATime = SampleList.VATime || '';
    this.PathTestID = SampleList.PathTestID || 0;
    this.ServiceName = SampleList.ServiceName || '';
    this.IsSampleCollection = SampleList.IsSampleCollection || 0;
    this.SampleCollectionTime = SampleList.SampleCollectionTime || '';
    this.PathReportID = SampleList.PathReportID || 0; 
    this.SampleNo = SampleList.SampleNo || 0; 
  } 
}
