import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { UntypedFormGroup } from "@angular/forms";
import { CompanyMasterService } from "../company-master.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-company-master-list",
    templateUrl: "./company-master-list.component.html",
    styleUrls: ["./company-master-list.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyMasterListComponent implements OnInit {
  
    companyForm: UntypedFormGroup;
    isActive:boolean=true;
    saveflag : boolean = false;

    // new Api
    autocompleteModetypeName:string="CompanyType";
    autocompleteModetariff: string = "Tariff";
    autocompleteModecity: string = "City";

    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public dialogRef: MatDialogRef<CompanyMasterListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
   
    ngOnInit(): void {
        this.companyForm = this._CompanyMasterService.createCompanymasterForm();
        if(this.data){
            this.isActive=this.data.isActive
            this.companyForm.patchValue(this.data);
        }
    }
    
    onSubmit() {  
        debugger       
        if(!this.companyForm.invalid)
        {
            this.saveflag = true;

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

    // new api
    companyId=0;
    companyName='';
    typeId=0;
    tariffId=0;
    cityId=0;
    cityName='';

    
    selectChangetypeName(obj:any){
        this.typeId=obj;
    }

    selectChangetariff(obj: any){
        console.log(obj);
        this.tariffId=obj
    }

    selectChangecity(obj: any){
        console.log(obj);
        this.cityId=obj
        this.cityName=obj.text
        console.log("cityname:", obj.text)
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
  