import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { OttablemasterService } from '../ottablemaster.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-ottablemaster',
  templateUrl: './new-ottablemaster.component.html',
  styleUrls: ['./new-ottablemaster.component.scss'],
    encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class NewOTTablemasterComponent implements OnInit {
 myForm: FormGroup;
    isActive:boolean=true;

     constructor(
            public _OttablemasterService: OttablemasterService,
            public dialogRef: MatDialogRef<NewOTTablemasterComponent>,
            @Inject(MAT_DIALOG_DATA) public data: any,
            public toastr: ToastrService
        ) { }
        
        autocompleteModetaluka: string = "Taluka";
    
        talukaId = 0;
        
        ngOnInit(): void {
            this.myForm = this._OttablemasterService.createVillageForm();
            
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
                  this._OttablemasterService.stateMasterSave(this.myForm.value).subscribe((response) => {
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
