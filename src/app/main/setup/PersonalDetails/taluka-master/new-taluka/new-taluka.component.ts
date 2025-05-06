import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { TalukaMasterService } from '../taluka-master.service';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-new-taluka',
    templateUrl: './new-taluka.component.html',
    styleUrls: ['./new-taluka.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewTalukaComponent implements OnInit {
    
    myForm: FormGroup;
    isActive:boolean=true;
      
    constructor(
        public _TalukaMasterService: TalukaMasterService,
        public dialogRef: MatDialogRef<NewTalukaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
    
    autocompleteModecity: string = "City";

    cityId = 0;
    
    ngOnInit(): void {
        this.myForm = this._TalukaMasterService.createTalukaForm();
        this.myForm.markAllAsTouched();
        
        console.log(this.data)
        if ((this.data?.talukaId??0) > 0) 
        {
            this.isActive=this.data.isActive
            this.myForm.patchValue(this.data);
        }   
    }
    
      
        onSubmit() {
        if(!this.myForm.invalid)
            {
            console.log(this.myForm.value);
              this._TalukaMasterService.stateMasterSave(this.myForm.value).subscribe((response) => {
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
                cityId: [
                    { name: "required", Message: "City Name is required" }
                ],
                talukaName: [
                    { name: "required", Message: "Taluka Name is required" },
                    { name: "maxlength", Message: "Taluka Name should not be greater than 50 char." },
                    { name: "pattern", Message: "Only char allowed." }
                ]
            };
        }
    
    
        selectChangecountry(obj: any){
            console.log(obj);
            this.cityId=obj.value
        }
    
        onClear(val: boolean) {
          this.myForm.reset();
          this.dialogRef.close(val);
        }

}
