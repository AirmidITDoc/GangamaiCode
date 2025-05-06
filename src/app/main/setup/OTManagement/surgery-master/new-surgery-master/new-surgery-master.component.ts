import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { SurgeryMasterService } from '../surgery-master.service';

@Component({
  selector: 'app-new-surgery-master',
  templateUrl: './new-surgery-master.component.html',
  styleUrls: ['./new-surgery-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
        animations: fuseAnimations,
})
export class NewSurgeryMasterComponent implements OnInit {
myForm: FormGroup;
    isActive:boolean=true;
      
    constructor(
                    public _SurgeryMasterService: SurgeryMasterService,
                    public dialogRef: MatDialogRef<NewSurgeryMasterComponent>,
                    @Inject(MAT_DIALOG_DATA) public data: any,
                    public toastr: ToastrService
                ) { }
    
    autocompleteModetaluka: string = "Taluka";

    talukaId = 0;
    
    ngOnInit(): void {
        this.myForm = this._SurgeryMasterService.createVillageForm();
        
        console.log(this.data)
        if ((this.data?.villageId??0) > 0) 
        {
            this.isActive=this.data.isActive
            this.myForm.patchValue(this.data);
        }   
    }
    
      
        onSubmit() {
        if(!this.myForm.invalid)
            {
            console.log(this.myForm.value);
              this._SurgeryMasterService.stateMasterSave(this.myForm.value).subscribe((response) => {
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
                talukaName: [
                    { name: "required", Message: "City Name is required" }
                ],
                villageName: [
                    { name: "required", Message: "Taluka Name is required" },
                    { name: "maxlength", Message: "Taluka Name should not be greater than 50 char." },
                    { name: "pattern", Message: "Only char allowed." }
                ]
            };
        }
    
    
        selectChangecountry(obj: any){
            console.log(obj);
            this.talukaId=obj.value
        }
    
        onClear(val: boolean) {
          this.myForm.reset();
          this.dialogRef.close(val);
        }
}
