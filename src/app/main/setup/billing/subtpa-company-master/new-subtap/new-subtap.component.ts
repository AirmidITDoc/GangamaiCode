import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubtpaCompanyMasterService } from '../subtpa-company-master.service';
import { SubtpacompanyMaster } from '../subtpa-company-master.component';
import { error } from 'console';
@Component({
  selector: 'app-new-subtap',
  templateUrl: './new-subtap.component.html',
  styleUrls: ['./new-subtap.component.scss']
})
export class NewSubtapComponent implements OnInit {

  subTpaForm: FormGroup;

  registerObj = new SubtpacompanyMaster({});

  autocompleteModetypeName:string="CompanyType";
  autocompleteModecity:string="City";

  constructor(
    public _subTpaServiceMaster: SubtpaCompanyMasterService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public dialogRef: MatDialogRef<NewSubtapComponent>,
  ) { }

  ngOnInit(): void {
    this.subTpaForm=this._subTpaServiceMaster.createsubtpacompanyForm();
    if(this.data){
      this.registerObj = this.data.registerObj;
      console.log(this.registerObj);

      this.vCompany=this.data.registerObj.CompanyName;
      this.vAddress=this.data.registerObj.Address;
      this.vPinNo=this.data.registerObj.PinNo;
      this.vFaxNo=this.data.registerObj.FaxNo;
      this.vMobile= this.data.registerObj.Mobile.trim();
      this.vPhone= this.data.registerObj.Phone.trim();
      this.vCity=this.data.cityId;
    }
  }

  vCompany:any;
  vAddress:any;
  vMobile:any;
  vPhone:any;
  vPinNo:any;
  vFaxNo:any;
  vCity:any;
  vCompanyType:any;

  onSubmit(){
    debugger

    if(!this.subTpaForm.get("SubCompanyId").value){
      debugger
      var mdata={
          "subCompanyId": 0,
          "compTypeId": this.typeId || 0,
          "companyName": this.subTpaForm.get('CompanyName').value || "",
          "address": this.subTpaForm.get('Address').value || "",
          "city": this.subTpaForm.get('City').value || "0",
          "pinNo": this.subTpaForm.get('PinNo').value || "",
          "phoneNo": this.subTpaForm.get('Phone').value.toString() || "",
          "mobileNo": this.subTpaForm.get('Mobile').value.toString() || "",
          "faxNo": this.subTpaForm.get('FaxNo').value || ""        
      }
      console.log("SubTpa Json:", mdata);

      this._subTpaServiceMaster.subTpaCompanyMasterInsert(mdata).subscribe((response)=>{
        this.toastr.success(response.message);
        this.onClear(true);
      }, (error)=>{
        this.toastr.error(error.message);
      });
    } else{
      // update
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
      console.log(obj);
      this.cityId=obj.value
      this.cityName=obj.text
    }
    getValidationCompanyMessages(){
      return{
        CompTypeId: [
          { name: "required", Message: "Company Name is required" }
        ]
      }
    }
    getValidationCityMessages(){
      return{
        City: [
          { name: "required", Message: "City Name is required" }
        ]
      }
    }

    onClose(){
      this.subTpaForm.reset();
      this.dialogRef.close();
    }

    @ViewChild('company') company: ElementRef;
    @ViewChild('pin') pin: ElementRef;
    @ViewChild('phone') phone: ElementRef;
    @ViewChild('mobile') mobile: ElementRef;
    @ViewChild('address') address: ElementRef;
    @ViewChild('city') city: ElementRef;
    @ViewChild('fax') fax:ElementRef;
    
    public onEnterCompany(event): void {
      if (event.which === 13) {
         this.company.nativeElement.focus();
      }
    }

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

    public onEnterphone(event): void {
      if (event.which === 13) {
         this.phone.nativeElement.focus();
      }
    }

    public onEntermobile(event): void {
      if (event.which === 13) {
         this.mobile.nativeElement.focus();
      }
    }

    public onEnterfax(event): void {
      if (event.which === 13) {
         this.fax.nativeElement.focus();
      }
    }


}
