import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
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
import { size, values } from "lodash";
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
    vPin:any;
    vPhone:any;    
    vMobile:any;
    vFax:any;
    vCompanyName:any; 

    // new Api
    autocompleteModetypeName:string="CompanyType";
    autocompleteModetariff: string = "Tariff";
    autocompleteModecity: string = "City";

    companyForm: FormGroup;

    constructor(
        public _CompanyMasterService: CompanyMasterService,
        public dialogRef: MatDialogRef<CompanyMasterListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
   
    ngOnInit(): void {
        this.companyForm = this._CompanyMasterService.createCompanymasterForm();
        if(this.data){
            this.registerObj=this.data.registerObj;

            this.vAddress=this.data.registerObj.Address;
            // this.vMobile= this.data.registerObj.Mobile.trim();
            this.vPhone=this.data.registerObj.Phone.trim();
            this.vPin = this.data.registerObj.Pin;
            // this.vFaxNo=this.data.registerObj.Fax;
        }
    }
    Savebtn:boolean=false;
    OnSubmit() {  
        debugger       
        if(this.companyForm.invalid){
            this.toastr.warning('please check from is invalid', 'Warning !', {
              toastClass:'tostr-tost custom-toast-warning',
          })
          return;
        } else{
          if(!this.companyForm.get("CompanyId").value){
            debugger
            var m_data =
                {
                    "companyId": 0,
                    "compTypeId": this.typeId || 0,
                    "companyName":this.companyForm.get("CompanyName").value || " ",
                    "address": this.companyForm.get("Address").value || " ",
                    "city": this.companyForm.get("City").value || "ABC",
                    "pinNo": this.companyForm.get("PinNo").value || "",
                    "phoneNo": this.companyForm.get("PhoneNo").value.toString() || "0",
                    "mobileNo": this.companyForm.get("MobileNo").value.toString() || "0",
                    "faxNo": this.companyForm.get("FaxNo").value || "0",
                    "traiffId": this.companyForm.get("TariffId").value
                  }

                  console.log("Company Insert:",m_data)

                this._CompanyMasterService.companyMasterSave(m_data).subscribe((response) => {
                this.toastr.success(response.message);
              this.onClear(true);
              }, (error) => {
                this.toastr.error(error.message);
              });
            } else{
                // update
            }
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

    
    onChangeMsm(event){}
    onChangeMode(event){}
    selectChangetypeName(obj:any){
      this.typeId=obj.value;
  }

    selectChangetariff(obj: any){
        console.log(obj);
        this.tariffId=obj
    }

    selectChangecity(obj: any){
        console.log(obj);
        this.cityId=obj
        // this.cityName=obj.text
        // console.log("cityname:", obj.text)
      }

      getValidationCityMessages() {
        return {
          City: [
                { name: "required", Message: "City Name is required" }
            ]
        };
    }

    getValidationtariffMessages() {
      return {
        TariffId: [
              { name: "required", Message: "Tariff Name is required" }
          ]
      };
  }
  getValidationCompanyMessages(){
    return{
      CompTypeId: [
        { name: "required", Message: "Company Name is required" }
      ]
    }
  }

      onClose(){
        this.companyForm.reset();
        this.dialogRef.close();
      }

    @ViewChild('pin') pin: ElementRef;
    @ViewChild('phone') phone: ElementRef;
    @ViewChild('address') address: ElementRef;
    @ViewChild('mobile') mobile: ElementRef;
    @ViewChild('fax') fax: ElementRef;
    @ViewChild('companyN') companyN:ElementRef;

    public onEnterCompany(event): void {
      if (event.which === 13) {
         this.address.nativeElement.focus();
      }
    }
    public onEnterAddress(event): void {
        if (event.which === 13) {
           this.pin.nativeElement.focus();
        }
      }
  
      public onEnterPin(event): void {
        if (event.which === 13) {
           this.phone.nativeElement.focus();
        }
      }
  
      public onEnterPhone(event): void {
        if (event.which === 13) {
           this.mobile.nativeElement.focus();
        }
      }
      public onEntermobile(event): void{
        if (event.which === 13) {
          this.fax.nativeElement.focus();
       }
      }
      public onEnterfax(event): void{
        if (event.which === 13) {
          this.phone.nativeElement.focus();
       }
      }
  }
  