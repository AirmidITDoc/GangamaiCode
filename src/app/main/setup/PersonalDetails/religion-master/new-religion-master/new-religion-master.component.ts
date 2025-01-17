import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReligionMasterService } from '../religion-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-religion-master',
    templateUrl: './new-religion-master.component.html',
    styleUrls: ['./new-religion-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewReligionMasterComponent implements OnInit {
  religionForm: FormGroup;
  isActive:boolean=true;
  saveflag : boolean = false ;

    constructor(   public _ReligionMasterService: ReligionMasterService,
        public dialogRef: MatDialogRef<NewReligionMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService)
    { }

    ngOnInit(): void {
        this.religionForm = this._ReligionMasterService.CreateReligionForm();
        console.log(this.data)
        if ((this.data?.religionId??0) > 0) 
         this.religionForm.patchValue(this.data);
        
    }
 
  onSubmit() {
    
    if(this.religionForm.valid) 
    {
        this.saveflag = true;
        console.log("JSON :-",this.religionForm.value);

        this._ReligionMasterService.religionMasterSave(this.religionForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
    else
      {
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
      }

  }

    getValidationMessages() {
        return {
            religionName: [
                { name: "required", Message: "Religion Name is required" },
                { name: "maxlength", Message: "Religion name should not be greater than 50 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ]
        };
    }

    onClear(val: boolean) {
        this.religionForm.reset();
        this.dialogRef.close(val);
    }

}
