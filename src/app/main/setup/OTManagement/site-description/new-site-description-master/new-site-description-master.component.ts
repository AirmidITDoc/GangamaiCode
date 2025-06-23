import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { SiteDescriptionService } from '../site-description.service';

@Component({
  selector: 'app-new-site-description-master',
  templateUrl: './new-site-description-master.component.html',
  styleUrls: ['./new-site-description-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
            animations: fuseAnimations,
})
export class NewSiteDescriptionMasterComponent {
myForm: FormGroup;
    isActive:boolean=true;
      
    constructor(
                    public _SiteDescriptionService: SiteDescriptionService,
                    public dialogRef: MatDialogRef<NewSiteDescriptionMasterComponent>,
                    @Inject(MAT_DIALOG_DATA) public data: any,
                    public toastr: ToastrService
                ) { }
    
    autocompleteModetaluka: string = "Taluka";

    surgeryCategoryId = 0;
    
    ngOnInit(): void {
        this.myForm = this._SiteDescriptionService.createSiteDescForm();
         this.myForm.markAllAsTouched();

        console.log(this.data)
        if ((this.data?.siteDescId??0) > 0) 
        {
            this.isActive=this.data.isActive
            this.myForm.patchValue(this.data);
        }   
    }
    
      
        onSubmit() {
        if(!this.myForm.invalid)
            {
            console.log(this.myForm.value);
              this._SiteDescriptionService.stateMasterSave(this.myForm.value).subscribe((response) => {
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
                surgeryCategoryId: [
                    { name: "required", Message: "surgeryCategory Name is required" }
                ],
                siteDescriptionName: [
                    { name: "required", Message: "siteDesc Name is required" },
                    { name: "maxlength", Message: "siteDesc Name should not be greater than 50 char." },
                    { name: "pattern", Message: "Only char allowed." }
                ]
            };
        }
    
    
        selectChangecountry(obj: any){
            console.log(obj);
            this.surgeryCategoryId=obj.value
        }
    
        onClear(val: boolean) {
          this.myForm.reset();
          this.dialogRef.close(val);
        }
}
