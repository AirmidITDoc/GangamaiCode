import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { DoctorMasterService } from '../doctor-master.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { element } from 'protractor';
import { DoctorMaster } from '../doctor-master.component';

@Component({
  selector: 'app-doctor-merge',
  templateUrl: './doctor-merge.component.html',
  styleUrls: ['./doctor-merge.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DoctorMergeComponent implements OnInit {
  displayedColumns: string[] = [
    'DoctorName',
    'Action' 
    ] 
    displayedSelected: string[] = [
      'DoctorName', 
      'buttons'
    ]

  registerObj:any;
  MyDocMergeForm:FormGroup;
  isLoading: String = '';
  sIsLoading: string = "";
  chargeslist:any=[];
  vDoctorName:any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dsDocNameList = new MatTableDataSource<DocMergeList>();
  dsDocMergeList = new MatTableDataSource<DocMergeList>();

  constructor(
    public _doctorService: DoctorMasterService,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public _formbuilder:FormBuilder,
    public dialogRef: MatDialogRef<DoctorMergeComponent>
  ) { }

  ngOnInit(): void {
    this.MyDocMergeForm = this.createDocMergeForm();
    if(this.data){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.vDoctorName = this.registerObj.DoctorName
      this.getDoctorMasterList();
    }
  }
  createDocMergeForm(){
    return this._formbuilder.group({
      DoctorName:['']
    });
  } 
  resultsLength = 0;
  getDoctorMasterList() { 
    var vdata = {
        "F_Name":  "%",
        "L_Name":  "%",
        "FlagActive": 1,
        "ConsultantDoc_All": 0,
        "ReferDoc_All": 0,
        Start:(this.paginator?.pageIndex??1),
        Length:(this.paginator?.pageSize??30),
    }
    console.log(vdata)
    this._doctorService.getDoctorMasterList(vdata).subscribe((data) => {
        this.dsDocNameList.data = data["Table1"]??[] as DoctorMaster[];  
         this.resultsLength= data["Table"][0]["total_row"];
         this.sIsLoading = '';
    })
}
  onMergeDoc(row) { 
    console.log(row)
    if (this.chargeslist.length > 0) {
      let duplicateItem = this.chargeslist.filter((ele) => ele.DoctorId === row.DoctorId);
      if (duplicateItem && duplicateItem.length != 0) {
        this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    this.chargeslist.push(
      {
        DoctorId: row.DoctorId,
        DoctorName: row.DoctorName, 

      });
    this.isLoading = '';
    console.log(this.chargeslist);
    this.dsDocMergeList.data = this.chargeslist;
    this.dsDocMergeList.sort = this.sort;
    this.dsDocMergeList.paginator = this.paginator;
  }

  deleteTableRow(element) { 
      this.chargeslist= this.dsDocMergeList.data ;
      let index = this.chargeslist.indexOf(element);
      if (index >= 0) {
        this.chargeslist.splice(index, 1);
        this.dsDocMergeList.data = [];
        this.dsDocMergeList.data = this.chargeslist;
      }
      this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
        toastClass: 'tostr-tost custom-toast-success',
      });  
  }
  OnSave(){
    if(!this.dsDocMergeList.data.length){
      this.toastr.warning('add Doctor name fro merge', 'warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });  
      return
    } 
    let uptdateDocMergeParamsObj = [];
    this.dsDocMergeList.data.forEach(element =>{
      let docMerge={};
      docMerge['doctorId'] = this.registerObj.DoctorId || 0
      docMerge['docDupId'] = element.DoctorId || 0
      uptdateDocMergeParamsObj.push(docMerge)
    });
    let submitData={
      "uptdateDocMergeParams":uptdateDocMergeParamsObj
    }
    console.log(submitData)
    this._doctorService.SaveDotorcMerge(submitData).subscribe(reponse =>{
      if(reponse){
        this.toastr.success('Record Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.onClose();
      } else {
        this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        this.onClose();
      }
    }, error => {
      this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });  
  }
  onClose(){
    this.dsDocNameList.data = [];
    this.dsDocMergeList.data = [];
    this.dialogRef.close();
  }
}
export class DocMergeList {
  DoctorName: any; 
  DoctorId: any; 
  constructor(DocMergeList) {
    this.DoctorName = DocMergeList.DoctorName || ''; 
    this.DoctorId = DocMergeList.DoctorId || 0;
  }
}