import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { ReplaySubject, Subject, observable } from "rxjs";
import { CompanyMasterService } from "../company-master.service";
import { CompanyMaster, CompanyMasterComponent } from "../company-master.component";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { takeUntil } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

import { MatSelect } from "@angular/material/select";
import { size } from "lodash";
import { AuthenticationService } from "app/core/services/authentication.service";


@Component({
    selector: "app-company-master-list",
    templateUrl: "./company-master-list.component.html",
    styleUrls: ["./company-master-list.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CompanyMasterListComponent implements OnInit {
  
    registerObj = new CompanyMaster({});

    vAddress:any;
    vPincode:any;
    vPhone:any;    
    vMobile:any;
    vFaxNo:any; 

    // new Api
    autocompleteModetypeName:string="TypeName";
    autocompleteModetariff: string = "Tariff";
    autocompleteModeCompany: string = "Company";
    autocompleteModecity:string="City";

    companyForm: FormGroup;

    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public dialogRef: MatDialogRef<CompanyMasterListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
   
    ngOnInit(): void {
        // this.companyForm = this._CompanyMasterService.createCompanymasterForm();
        // var m_data = {
        //   itemCategoryId: this.data?.itemCategoryId,
        //   itemCategoryName: this.data?.itemCategoryName.trim(),
        //   itemTypeId: this.data?.itemTypeId,
        // //   isconsolidated: JSON.stringify(this.data?.isconsolidated),
        // //   isConsolidatedDR: JSON.stringify(this.data?.isConsolidatedDR),
        // // isDeleted: JSON.stringify(this.data?.isActive),
        // };
        // this.companyForm.patchValue(m_data);
        if(this.data){
            this.registerObj=this.data.registerObj;

            this.vAddress=this.data.registerObj.Address;
            this.vMobile= this.data.registerObj.Mobile.trim();
            this.vPhone=this.data.registerObj.Phone.trim();
            this.vPincode = (this.registerObj.PinCode);
            this.vFaxNo=this.data.registerObj.Fax;
        }
    }
    onSubmit() {
        // if (this.companyForm.valid) {
        //   debugger
        //     this._CompanyMasterService.companyMasterSave(this.companyForm.value).subscribe((response) => {
        //         this.toastr.success(response.message);
        //         this.onClear(true);
        //     }, (error) => {
        //         this.toastr.error(error.message);
        //     });
        // }

        this.companyForm = this._CompanyMasterService.createCompanymasterForm();
        var m_data = 
            {
                "companyId": 0,
                "compTypeId": 0,
                "companyName": "string",
                "address": "string",
                "city": "string",
                "pinNo": "string",
                "phoneNo": this._CompanyMasterService.myform.get("PhoneNo").value || ""
              }
              console.log(m_data)
        this.companyForm.patchValue(m_data);
    }
  
    onClear(val: boolean) {
        this.companyForm.reset();
        this.dialogRef.close(val);
    }

    // new api
    companyId=0;
    typeId=0;
    tariffId=0;
    cityId=0;
    cityName='';

    selectChangeCompany(obj: any){
        console.log(obj);
        this.companyId=obj.value
      }

    selectChangetypeName(obj:any){
        this.typeId=obj.value;
    }

    selectChangetariff(obj: any){
        console.log(obj);
        this.tariffId=obj.value
    }

    selectChangecity(obj: any){
        console.log(obj);
        this.cityId=obj.value
        this.cityName=obj.text
      }
  }
  