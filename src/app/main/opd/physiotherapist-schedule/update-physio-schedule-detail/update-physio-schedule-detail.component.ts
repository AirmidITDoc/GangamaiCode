import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PhysiotherapistScheduleService } from '../physiotherapist-schedule.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-physio-schedule-detail',
  templateUrl: './update-physio-schedule-detail.component.html',
  styleUrls: ['./update-physio-schedule-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class UpdatePhysioScheduleDetailComponent implements OnInit {

  updateForm: FormGroup;
  registerObj:any;

  constructor(
    public _PhysiotherapistScheduleService: PhysiotherapistScheduleService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdatePhysioScheduleDetailComponent>,
    private _loggedAcount: AuthenticationService,
    private _formbuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.CraateUpdateForm();
    if(this.data){
      this.registerObj = this.data
      console.log(this.registerObj)
    }
  }
  CraateUpdateForm() {
    this.updateForm = this._formbuilder.group({
      StartDate: [new Date(), Validators.required],
      EndDate: [new Date()],
      NoIntervals: ['', Validators.pattern("^[- +()]*[0-9][- +()0-9]*$")],
      NoSessions: ['', Validators.pattern("^[- +()]*[0-9][- +()0-9]*$")],
      Comment:[''],
      IsCompleted:['']
    })
  }



  UpdateSchedule() { 
    const formValue = this.updateForm.value 
    if (formValue.StartDate == '' || formValue.StartDate == 0 || formValue.StartDate == null || formValue.StartDate == undefined) {
      this.toastr.warning('Enter StartDate', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (formValue.NoIntervals == '' || formValue.NoIntervals == 0 || formValue.NoIntervals == null) {
      this.toastr.warning('Enter No of Intervals', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (formValue.NoSessions == '' || formValue.NoSessions == 0 || formValue.NoSessions == null) {
      this.toastr.warning('Enter No of no. sessions', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
     debugger
    let m_data = {
      "updatePhysiotherapyDetails": {
        "physioDetId":this.registerObj.PhysioDetId || 0,
        "physioId": this.registerObj.PhysioId || 0, 
        "sessionStartdate": this.datePipe.transform(formValue.StartDate, 'yyyy-MM-dd') || '1999-01-01',
        "interval": formValue.NoIntervals || 0,
        "noSession": formValue.NoSessions || 0,
        "sessionendDate": this.datePipe.transform(formValue.EndDate, 'yyyy-MM-dd') || '1999-01-01',
        "isCompleted": formValue.IsCompleted,
        "comments": formValue.Comment || '',
        "modifiedBy": this._loggedAcount.currentUserValue.user.id || 0,
        "modifiedDate": "2025-05-13T08:24:04.953Z"
      } 
    }
    console.log(m_data)
    this._PhysiotherapistScheduleService.UpdatePhysio(m_data).subscribe(response => {
      console.log(response)
      if (response) {
        this.toastr.success('Record Update Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.getReset(); 
      }
      else {
        this.toastr.error('Record Data not Update !, Please check error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }) 
  }
  getReset(){
    this.updateForm.reset();
    this.dialogRef.close();
  }


     
  onChangeIsactive(SiderOption) { ;
  //   if (SiderOption.checked == true) {
  //     this._IpSearchListService.myFilterform.get('IsDischarge').setValue(1); 
  //   }
  //   else {
  //     this._IpSearchListService.myFilterform.get('IsDischarge').setValue(0); 
  //   }
   }
}
