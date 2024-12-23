import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DosemasterService } from '../dosemaster.service';

@Component({
  selector: 'app-new-dose-master',
  templateUrl: './new-dose-master.component.html',
  styleUrls: ['./new-dose-master.component.scss']
})
export class NewDoseMasterComponent implements OnInit {

    doseForm:FormGroup;
    isActive:boolean=true;

    constructor(
        public _doseMasterService: DosemasterService,
        public dialogRef: MatDialogRef<NewDoseMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.doseForm=this._doseMasterService.createDoseForm();
        if(this.data){
            this.isActive=this.data.isActive
            this.doseForm.patchValue(this.data);
        }
    }


    saveflag : boolean = false
    onSubmit() {
    this.saveflag = true

    debugger
    if(!this.doseForm.get("doseId").value){
      var mdata=
      {
        "doseId": 0,
        "doseName": this.doseForm.get("doseName").value || "",
        "doseNameInEnglish": this.doseForm.get("doseNameInEnglish").value,
        "doseNameInMarathi": this.doseForm.get("doseNameInMarathi").value,
        "doseQtyPerDay": parseInt(this.doseForm.get("doseQtyPerDay").value )     
      }
      console.log("dose json:", mdata);

      this._doseMasterService.doseMasterInsert(this.doseForm.value).subscribe((response)=>{
        this.toastr.success(response.message);
        this.onClear(true);
      }, (error)=>{
        this.toastr.error(error.message);
      });
    } else{
      //update
    }
}
    onClear(val: boolean) {
        this.doseForm.reset();
        this.dialogRef.close(val);
    }

}
