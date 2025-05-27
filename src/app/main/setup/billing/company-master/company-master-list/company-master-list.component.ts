import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { CompanyMaster } from "../company-master.component";
import { CompanyMasterService } from "../company-master.service";

@Component({
    selector: "app-company-master-list",
    templateUrl: "./company-master-list.component.html",
    styleUrls: ["./company-master-list.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyMasterListComponent implements OnInit {
  
    companyForm: FormGroup;
    isActive:boolean=true;
    autocompleteModetypeName:string="CompanyType";
    autocompleteModetariff: string = "Tariff";
    autocompleteModecity: string = "City";
    registerObj = new CompanyMaster({});

    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public dialogRef: MatDialogRef<CompanyMasterListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
   
    ngOnInit(): void {
        
        this.companyForm = this._CompanyMasterService.createCompanymasterForm();
        this.companyForm.markAllAsTouched();

        if ((this.data?.companyId?? 0) > 0) {

            this.isActive=this.data.isActive
            if(this.data.city)
                this.data.city=this.data.city.trim();

            
            this.companyForm.get("city").setValue(this.data.city)
            this.companyForm.get("mobileNo").setValue(this.data.mobileNo)
          
            setTimeout(() => {
                this._CompanyMasterService.getCompanyById(this.data.companyId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)
                    
                    if(response){
                        
 
                        this.companyForm.get("traiffId").setValue(this.registerObj.traiffId)
                        this.companyForm.get("companyId").setValue(this.registerObj.companyId)
                    }
                   });
            }, 500);
        }
    }
    
    onSubmit() {  
               
        if(!this.companyForm.invalid)
        {

            console.log("Company Insert:-",this.companyForm.value);

            this._CompanyMasterService.companyMasterSave(this.companyForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
            }, (error) => {
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
        this.companyForm.reset();
        this.dialogRef.close(val);
    }

      onClose(){
        this.companyForm.reset();
        this.dialogRef.close();
      }


    getValidationMessages() {
        return {
                companyName: [
                    { name: "required", Message: "Company Name is required" },
                    { name: "maxlength", Message: "Company name should not be greater than 50 char." },
                    { name: "pattern", Message: "Special char not allowed." }
                ],
                traiffId: [
                    { name: "required", Message: "Tariff Name is required" }
                ],
                city: [
                    { name: "required", Message: "City Name is required" }
                ],
                mobileNo:[
                    { name: "required", Message: "Mobile Number is required" },
                    { name: "maxlength", Message: "Number be not be greater than 10 digits" },
                    { name: "pattern", Message: "Only Digits allowed." }
                ],
                phoneNo:[
                    { name: "required", Message: "Phone Number is required" },
                    { name: "maxlength", Message: "Number be not be greater than 10 digits" },
                    { name: "pattern", Message: "Only Digits allowed." }
                ],
                pinNo:[
                    { name: "required", Message: "Pin Code is required" },
                    { name: "maxlength", Message: "Pincode must be greater than 2 digits" },
                    { name: "pattern", Message: "Only Digits allowed." }
                ],
                address:[
                    { name: "required", Message: "Address is required" },
                    { name: "maxlength", Message: "Address must be between 1 and 100 characters." },
                    { name: "pattern", Message: "Secial Char allowed." }
                ],
                compTypeId:[
                    { name: "required", Message: "Company Type Name is required" }
                ],
        };
    }
}
  