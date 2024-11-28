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
    vPincode:any;
    vPhone:any;    
    vMobile:any;
    vFaxNo:any;
    vCompanyName:any; 

    // new Api
    autocompleteModetypeName:string="CompanyType";
    autocompleteModetariff: string = "Tariff";
        autocompleteModecity:string="City";

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
            this.vPincode = this.data.registerObj.PinCode;
            // this.vFaxNo=this.data.registerObj.Fax;
        }
    }
    Savebtn:boolean=false;
    onSubmit() {  
        debugger       
        if(!this.companyForm.get("companyId").value){
            debugger
        var m_data =
            {
                "companyId": 0,
                "compTypeId": this.typeId || 0,
                "companyName":this.companyForm.get("CompanyName").value || " ",
                "address": this.companyForm.get("Address").value || " ",
                "city": this.cityName || "ABC",
                "pinNo": this.companyForm.get("PinNo").value || "",
                "phoneNo": this.companyForm.get("Phone").value.toString() || "0"
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
        this.typeId=obj;
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

    getValidationtariffessages() {
      return {
        TariffId: [
              { name: "required", Message: "Tariff Name is required" }
          ]
      };
  }

      onClose(){
        this.companyForm.reset();
        this.dialogRef.close();
      }

    @ViewChild('pin') pin: ElementRef;
    @ViewChild('phone') phone: ElementRef;
    @ViewChild('address') address: ElementRef;
    @ViewChild('company') company: ElementRef;

    public onEnterAddress(event): void {
        if (event.which === 13) {
           this.address.nativeElement.focus();
        }
      }
  
      public onEnterPin(event): void {
        if (event.which === 13) {
           this.pin.nativeElement.focus();
        }
      }
  
      public onEnterPhone(event): void {
        if (event.which === 13) {
           this.phone.nativeElement.focus();
        }
      }

      public onEnterCompany(event): void {
        if (event.which === 13) {
           this.company.nativeElement.focus();
        }
      }
  }
  