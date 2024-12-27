import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { PatientDischargeClearanceService } from '../patient-discharge-clearance.service';
import { MatTableDataSource } from '@angular/material/table';
import { ClearanceList } from '../patient-discharge-clearance.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-patient-clearance-option',
  templateUrl: './patient-clearance-option.component.html',
  styleUrls: ['./patient-clearance-option.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PatientClearanceOptionComponent implements OnInit {
  displayedColumns: string[] = [
    'DepartmentName',
    'IsApproved',
    'ApprovedBy',
    'ApprovedBYDate',
    'IsNoDues',
    'Comments' 
  ] 

  InitateDiscId:any;
  DepartmentId:any;
  registerObj:any;
  myForm:FormGroup;
  dateTimeObj:any;
  screenFromString:'approved-date'

  dsApprovedlist=new MatTableDataSource<ClearanceList>();

  constructor(
        public _PatientDischargeClearanceService: PatientDischargeClearanceService,
        private accountService: AuthenticationService,  
        public datePipe: DatePipe, 
        public toastr: ToastrService, 
        public _matDialog: MatDialog, 
            public dialogRef: MatDialogRef<PatientClearanceOptionComponent>, 
            @Inject(MAT_DIALOG_DATA) public data: any, 
            public _formbuilder:FormBuilder
  ) { }

  ngOnInit(): void {
    this.myForm = this.CreatemyForm();
    if(this.data){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.getapprovelist(this.registerObj);
    }
  }
  CreatemyForm(){
    return this._formbuilder.group({
      Comment:[''],
      NoDues:[true]
    })
  }
  NoDues:any;
  onChangeDues(){
    if(this.myForm.get('NoDues').value == true){
      this.NoDues = 0
    }else{
      this.NoDues = 1
    }
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
//Approvved popup
getapprovelist(Obj){
  var vdata={
    "DepartmentId": this.accountService.currentUserValue.user.id || 0,
    "AdmId": Obj.AdmID
  }
  console.log(vdata)
  setTimeout(() => {
    this._PatientDischargeClearanceService.getapprovelist(vdata).subscribe(data =>{
      this.dsApprovedlist.data =data as ClearanceList[];
      this.InitateDiscId = this.dsApprovedlist.data[0].InitateDiscId,
      this.DepartmentId = this.dsApprovedlist.data[0].DepartmentID,
      console.log(this.dsApprovedlist.data)
    }) 
  }, 1000);
}
onSave(){
  const currentDate = new Date();
  const datePipe = new DatePipe('en-US');
  const formattedTime = datePipe.transform(currentDate, 'shortTime');
  const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd hh:mm'); 


  if ((!this.dsApprovedlist.data.length)) {
    this.toastr.warning('list is blank add department Name in list ', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  } 
    let updateDischargeInitiateApprovalParamObj = {
      "admId": this.registerObj.AdmissionID|| 0,
      "departmentID":  this.DepartmentId || 0,
      "initateDiscId": this.InitateDiscId  || 0,
      "isApproved": 1,
      "approvedBy":this.accountService.currentUserValue.user.id || 0,
      "approvedDatetime": formattedDate,
      "isNoDues": this.NoDues || 0,
      "comments": this.myForm.get('Comment').value || ''
    }  
 
  let submitData = {
    "updateDischargeInitiateApprovalParam": updateDischargeInitiateApprovalParamObj 
  }
  
  console.log(submitData)
  this._PatientDischargeClearanceService.UpdateDischargeInitiate(submitData).subscribe(response => {
    if (response) {
      this.toastr.success('Record Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      this.onClose()
    }
    else {
      this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    }
  }, error => {
    this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
  });

}
  onClose(){
    this.dialogRef.close();
  }
}
