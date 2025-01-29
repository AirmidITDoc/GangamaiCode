import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { DoctorShareService } from '../doctor-share.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-process-doctor-share',
  templateUrl: './process-doctor-share.component.html',
  styleUrls: ['./process-doctor-share.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ProcessDoctorShareComponent implements OnInit {

 
    constructor(
        public _DoctorShareService: DoctorShareService,
        public datePipe: DatePipe, 
        public _matDialog: MatDialog,
        public toastr: ToastrService,
      ) { }
    
      ngOnInit(): void {
      }
    
      OnSave(){   
        let processDoctorShareParamObj = {};
        processDoctorShareParamObj['fromDate'] = this.datePipe.transform(this._DoctorShareService.DocPrecessForm.get("startdate").value,"MM-dd-yyyy") || "01/01/1900",
        processDoctorShareParamObj['toDate'] = this.datePipe.transform(this._DoctorShareService.DocPrecessForm.get("enddate").value,"MM-dd-yyyy") || "01/01/1900"
       
        let submitData={
          'processDoctorShareParam':processDoctorShareParamObj
        }
        this._DoctorShareService.SaveProcessdocShare(submitData).subscribe((response)=>{
          if (response) {
            this.toastr.success('Process Doctor Share Saved Successfully', 'Save !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            this.onClose() 
          } else {
            this.toastr.error('API Error!', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        });
      }
      onClose(){
        this._matDialog.closeAll();
        this._DoctorShareService.DocPrecessForm.get("startdate").setValue(new Date());
        this._DoctorShareService.DocPrecessForm.get("enddate").setValue(new Date());
      }
    }
    