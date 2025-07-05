import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { SubTpaCompanyMaster } from '../subtpa-company-master.component';
import { SubtpaCompanyMasterService } from '../subtpa-company-master.service';

@Component({
    selector: 'app-new-subtap',
    templateUrl: './new-subtap.component.html',
    styleUrls: ['./new-subtap.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewSubtapComponent implements OnInit {

    subTpaForm: FormGroup;
    isActive:boolean=true;

    autocompleteModetypeName:string="CompanyType";
    autocompleteModecity:string="City";

   

    constructor(
        public _subTpaServiceMaster: SubtpaCompanyMasterService,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any, 
        public dialogRef: MatDialogRef<NewSubtapComponent>,
       
    ) { }

   ngOnInit(): void {
   
    this.subTpaForm = this._subTpaServiceMaster.createsubtpacompanyForm();
    this.subTpaForm.markAllAsTouched();

    if ((this.data?.subCompanyId ?? 0) > 0) {
        console.log(this.data);
        this.isActive = this.data.isActive;

        if (this.data.city) {
            this.data.city = this.data.city.trim();
        }

        this.subTpaForm.patchValue({
            
            compTypeId: this.data.compTypeId,
            companyName: this.data.companyName,
            city: this.data.city,
            mobileNo: this.data.mobileNo,
            phoneNo: this.data.phoneNo,
             pinNo: this.data.pinNo,
              address: this.data.address,
           
        });

        
    }
}


    onSubmit(){
        
        if(!this.subTpaForm.invalid)
        {
     
        console.log("SubTpa Json:", this.subTpaForm.value);
  
        this._subTpaServiceMaster.subTpaCompanyMasterInsert(this.subTpaForm.value).subscribe((response)=>{
         
          this.onClear(true);
        }, (error)=>{
          this.toastr.error(error.message);
        });
      } 
      else
      {
        this.toastr.warning('please check form is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }


  onClear(val: boolean) {
    this.subTpaForm.reset();
    this.dialogRef.close(val);
  }
  // new api
  typeId=0;
  cityId=0;
  cityName='';

  selectChangetypeName(obj:any){
      this.typeId=obj.value;
  }

  selectChangecity(obj: any){
     
      this.cityId=obj.value
      this.cityName=obj.text
    }

    onClose(){
      this.subTpaForm.reset();
      this.dialogRef.close();
    }

    getValidationMessages()
    {
        return{
            companyName:[
                { name: "required", Message: "Company Name is required" },
                { name: "maxlength", Message: "Company Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            compTypeId:[
                { name: "required", Message: "Company Type Name is required" },
            ],
            city:[
                { name: "required", Message: "City Name is required" },
            ],
            address:[
                { name: "required", Message: "Address is required" },
                { name: "maxlength", Message: "Address must be between 1 and 100 characters." },
                { name: "pattern", Message: "Secial Char allowed." }
            ],
            pinNo:[
                { name: "required", Message: "PinCode is required" },
                { name: "maxlength", Message: "Pincode must be 6. digits" },
                { name: "pattern", Message: "Only Digits allowed." }
            ],
            phoneNo:[
                { name: "required", Message: "Phone Number is required" },
                { name: "pattern", Message: "Only Digits allowed." }
            ],
            mobileNo:[
                { name: "required", Message: "Mobile Number is required" },
                { name: "pattern", Message: "Only Digits allowed." }
            ]
        }
    }


}
