import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SupplierMaster, SupplierMasterComponent } from "../supplier-master.component";
import { SupplierMasterService } from "../supplier-master.service";
import { FormGroup } from "@angular/forms";
import { Subject } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AirmidAutocompleteComponent } from "app/main/shared/componets/airmid-autocomplete/airmid-autocomplete.component";

@Component({
    selector: "app-supplier-form-master",
    templateUrl: "./supplier-form-master.component.html",
    styleUrls: ["./supplier-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SupplierFormMasterComponent implements OnInit {

  supplierForm:FormGroup;

    submitted = false;
    
    registerObj = new SupplierMaster({});

    

    msg: any;
    msmflag:boolean=false;
    CityId:any;
    vchkactive: any=true;

    
  vSupplierName:any;
  vSupplierType:any;
  vAddress:any;
  vPincode:any;
  vMobile:any;
  vCity:any;
  vEmail:any;
  vModeofpay:any;
  vTermOfPayment:any;
  vGSTNo:any;
  vDlNo:any;
  vBankName:any;
  vBankbranch:any;
  vBankNo:any;
  vIfscNo:any;
  vStoreId:any;
  vVenderTypeId:any;
  vTaxNature:any;
  vPanNo:any;
  vLicNo:any;
  vFreight:any;
  vIfsccode:any;
  vOpeningBal:any;
  VsupplierId:any=0;
  vCreditPeriod:any;
    private _onDestroy = new Subject<void>();

    // new API

    autocompleteModecity:string="City";   
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "CountryByState";
    autocompleteModeofpayment: string= "PaymentMode";
    autocompleteModetermofpayment: string= "TermofPayment";
    autocompleteModebankName: string="Bank";
    autocompleteModestoreName: string="Store";
    autocompleteModeSupplierType:string="SupplierType"

    constructor(
        public _supplierService: SupplierMasterService,
        public toastr : ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _loggedService: AuthenticationService,
        public dialogRef: MatDialogRef<SupplierMasterComponent>
    ) {
   
    }

  ngOnInit(): void {
    this.supplierForm=this._supplierService.createSuppliermasterForm();
        if (this.data) {
      this.registerObj = this.data.registerObj;
      console.log(this.registerObj);

      this.VsupplierId=this.data.registerObj.supplierId;
      this.vMobile= this.data.registerObj.Mobile.trim();
      this.registerObj.Phone = this.data.registerObj.Phone.trim();
      this.vchkactive = (this.registerObj.IsDeleted)
      this.vSupplierName= this.data.registerObj.SupplierName;
      this.vAddress = this.data.registerObj.Address;
      this.vPincode = (this.registerObj.PinCode)
      this.vEmail=this.data.registerObj.Email.trim();
      this.registerObj.Phone = this.data.registerObj.Phone.trim();
      this.vchkactive = (this.registerObj.IsDeleted)
      this.vGSTNo=this.data.registerObj.GSTNo1;
      this.vPanNo=this.data.registerObj.PanNo;
      this.vLicNo=this.data.registerObj.LicNo;
      this.vDlNo=this.data.registerObj.DlNo;


        this.vFreight=this.data.registerObj.Freight;
      this.vBankbranch=this.data.registerObj.Branch;
      this.vIfsccode=this.data.registerObj.Ifsccode;
      this.vOpeningBal=this.data.registerObj.OpeningBalance;

      this.vBankNo=this.data.registerObj.BankNo;
      this.vTaxNature=this.data.registerObj.TaxNature;
    
    }

    
  }

     @ViewChild('ddlstore') ddlstore: AirmidAutocompleteComponent;
   removestore(item) {
    let removedIndex = this.supplierForm.value.StoreId.findIndex(x => x.storeId == item.storeId);
    this.supplierForm.value.StoreId.splice(removedIndex, 1);
    this.ddlstore.SetSelection(this.supplierForm.value.StoreId.map(x=>x.storeId));
}

    get f() {
        return this.supplierForm.controls;
    }

    
  selectedItems = [];
  toggleSelection(item: any) {
      item.selected = !item.selected;
      if (item.selected) {
          this.selectedItems.push(item);
      } else {
          const i = this.selectedItems.findIndex(value => value.StorecmbList === item.StoreId);
          this.selectedItems.splice(i, 1);
      }

  }
  remove(e) {
      this.toggleSelection(e);
  }

    
  Savebtn:boolean=false;
    onSubmit() {
        debugger
    //   if ((this.vSupplierName == undefined || this.vSupplierType == undefined || this.vAddress == undefined || this.vPincode == undefined ||
    //     this.vMobile == undefined || this.vCity == undefined || this.vEmail == undefined || this.vModeofpay == undefined || this.vTermOfPayment == undefined
    //     ||  this.vGSTNo == undefined || this.vDlNo == undefined ||  this.vBankName == undefined || this.vBankbranch == undefined  || 
    //      this.vBankNo == undefined || this.vIfscNo == undefined || this.vStoreId == undefined || this.vVenderTypeId == undefined)) {
    //     this.toastr.warning('Please select All Data.', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    // }
    // else {

// validatio

//       if ((this.vSupplierName == undefined || this.vSupplierName == undefined || this.vSupplierName == undefined)) {
//         this.toastr.warning('Please enter SupplierName.', 'Warning !', {
//             toastClass: 'tostr-tost custom-toast-warning',
//         });
//         return;
//     }
//     if ((this.vAddress == undefined || this.vAddress == undefined || this.vAddress == undefined)) {
//         this.toastr.warning('Please enter Address.', 'Warning !', {
//             toastClass: 'tostr-tost custom-toast-warning',
//         });
//         return;
//     }
//     if ((this.vMobile == undefined || this.vMobile == undefined || this.vMobile == undefined)) {
//         this.toastr.warning('Please enter Mobile..', 'Warning !', {
//             toastClass: 'tostr-tost custom-toast-warning',
//         });
//         return;
//     }
//     if (( this.supplierForm.get("CityId").value.CityId == undefined ||
//      this.supplierForm.get("CityId").value.CityId == undefined ||
//        this.supplierForm.get("CityId").value.CityId == undefined)) {
//         this.toastr.warning('Please select  City.', 'Warning !', {
//             toastClass: 'tostr-tost custom-toast-warning',
//         });
//         return;
//     }
//     if ((this.vEmail == undefined || this.vEmail == undefined || this.vEmail == undefined)) {
//       this.toastr.warning('Please enter Email..', 'Warning !', {
//           toastClass: 'tostr-tost custom-toast-warning',
//       });
//       return;
//   }
//   if ((this.vModeofpay == undefined || this.vModeofpay == undefined || this.vModeofpay == undefined)) {
//       this.toastr.warning('Please select Modeofpay.', 'Warning !', {
//           toastClass: 'tostr-tost custom-toast-warning',
//       });
//       return;
//   }
//   if (this.selectedItems.length==0) {
//     this.toastr.warning('Please select Store.', 'Warning !', {
//         toastClass: 'tostr-tost custom-toast-warning',
//     });
//     return;
// }

    let termsofPayment = 0;
    if (this.supplierForm.get("TermOfPayment").value)
      termsofPayment =this.supplierForm.get("TermOfPayment").value.Id;

    let BankId = 0;
    if (this.supplierForm.get("BankName").value)
      BankId =this.supplierForm.get("BankName").value.BankId;

    let bankname = '';
    if (this.supplierForm.get("BankName").value)
      bankname = this.supplierForm.get("BankName").value.BankName;

    let venderTypeId = 0;
    if (this.supplierForm.get("VenderTypeId").value)
      venderTypeId = this.supplierForm.get("VenderTypeId").value.VenderTypeId ;


            if(this.supplierForm.invalid){
              this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass:'tostr-tost custom-toast-warning',
              })
              return;
            }else{
              if (!this.supplierForm.get("SupplierId").value) {
                var data2 = [];
                for (let i = 0; i < this.supplierForm.value.StoreId.length; i++)
                      data2.push({ "assignId": 0, "storeId": this.supplierForm.value.StoreId[i].value, "supplierId": 0 });
              
              
                console.log("Insert data2:",data2);


               debugger
                var mdata =
                {
                
                  "supplierId": 0,
                  "supplierName": this.supplierForm.get("SupplierName").value,
                  "contactPerson":"abc",// this.supplierForm.get("Mobile").value || " ",
                  "address": this.supplierForm.get("Address").value || " ",
                  "cityId" : parseInt(this.supplierForm.get("CityId").value),
                  "stateId": parseInt(this.supplierForm.get("StateId").value),
                  "countryId": this.supplierForm.get("CountryId").value.value || 0,
                  "creditPeriod": this.supplierForm.get("CreditPeriod").value || "0",
                  "mobile": this.supplierForm.get("Mobile").value.toString() || "",
                  "phone": this.supplierForm.get("Phone").value.toString() || "",
                  "fax": this.supplierForm.get("Fax").value || "0",
                  "email": this.supplierForm.get("Email").value || "%",
                  "modeofPayment": parseInt(this.supplierForm.get("ModeOfPayment").value),
                  "termofPayment": parseInt(this.supplierForm.get("TermOfPayment").value),
                  "currencyId": parseInt(this.supplierForm.get("CurrencyId").value) || 0,
                  "octroi": 0,
                  "freight": parseInt(this.supplierForm.get("Freight").value),
                  "gstNo": this.supplierForm.get("GSTNo").value || 0,
                  "panNo": this.supplierForm.get("PanNo").value || 0,
                  "supplierTime": "10:00:00 AM",//this.supplierForm.get("SupplierType").value || 0,
                  "mAssignSupplierToStores":data2
                }
                console.log("Insert mdata:",mdata);
                

                this._supplierService.SupplierSave(mdata).subscribe((response) => {
                  this.toastr.success(response.message);
                 // this.onClear(true);
                }, (error) => {
                  this.toastr.error(error.message);
                });
            } 
            // else {
              
            //     var data3 = [];
            //     this.selectedItems.forEach((element) => {
            //         let deptInsertObj = {};
            //         deptInsertObj['assignId'] = 1//element.StoreId
            //         deptInsertObj['StoreId'] = element.StoreId
            //         deptInsertObj['SupplierId'] = !this.supplierForm.get("SupplierId").value ? "0" : this.supplierForm.get("SupplierId").value || "0";
            //         data3.push(deptInsertObj);
            //     });

            //     console.log("update data3:",data3);

            //     // var m_dataUpdate = {
            //     //     updateSupplierMaster: {
            //     //         supplierID:this.supplierForm.get("SupplierId").value || 0,
            //     //         supplierName: this.supplierForm.get("SupplierName").value,
            //     //         contactPerson:this.supplierForm.get("ContactPerson").value || "%",
            //     //         address:this.supplierForm.get("Address").value || "%",
            //     //         cityId: this.supplierForm.get("CityId").value.CityId,
            //     //         stateID:this.supplierForm.get("StateId").value.StateId,
            //     //         countryId:this.supplierForm.get("CountryId").value.CountryId,
            //     //         creditPeriod:this.supplierForm.get("CreditPeriod").value || "0",
            //     //         mobile:this.supplierForm.get("Mobile").value || "0",
            //     //         phone:this.supplierForm.get("Phone").value || "0",
            //     //         fax:this.supplierForm.get("Fax").value || "0",
            //     //         email:this.supplierForm.get("Email").value || "%",
            //     //         modeofPayment:this.supplierForm.get("ModeOfPayment").value.id || "0",
            //     //         termsofPayment:termsofPayment || "0",
            //     //         currencyId:this.supplierForm.get("CurrencyId").value || "0",
            //     //         octroi:0,
            //     //         freight:this.supplierForm.get("Freight").value ||"0",
            //     //         isDeleted: Boolean(JSON.parse(this.supplierForm.get("IsDeleted").value)),
            //     //         updatedBy:this._loggedService.currentUserValue.userId || 0,
            //     //         gstNo: this.supplierForm.get("GSTNo").value || 0, 
            //     //         panNo: this.supplierForm.get("PanNo").value || 0
            //     //         // pinCode:this.supplierForm.get("Pincode").value || "0",
            //     //         // taluka:this.supplierForm.get("Taluka").value || "0",
            //     //         // licNo:this.supplierForm.get("LicNo").value || "0",
            //     //         // expDate:this.supplierForm.get("ExpDate").value || "0",
            //     //         // dlNo:this.supplierForm.get("DlNo").value || "0",
            //     //         // BankId:BankId || "0",
            //     //         // bankname:bankname|| " ",
            //     //         // branch:this.supplierForm.get("BankBranch").value || "0",
            //     //         // bankNo:this.supplierForm.get("BankNo").value || "0",
            //     //         // ifsccode:this.supplierForm.get("IFSCcode").value || "0",
            //     //         // venderTypeId:venderTypeId || "0",
            //     //         // openingBalance:this.supplierForm.get("OpeningBal").value || "0"
            //     //     },
            //     //     deleteAssignSupplierToStore: {
            //     //         supplierId:
            //     //             this.supplierForm.get("SupplierId").value,
            //     //     },
            //     //     insertAssignSupplierToStore: data3,
            //     // };

            //     var mdataUpdate={
            //       "supplierId": 0,
            //       "supplierName": this.supplierForm.get("SupplierName").value,
            //       "contactPerson": this.supplierForm.get("Mobile").value || "%",
            //       "address": this.supplierForm.get("Address").value || "%",
            //       "cityId": this.supplierForm.get("CityId").value.value,
            //       "stateId": this.supplierForm.get("StateId").value.value,
            //       "countryId": this.supplierForm.get("CountryId").value.value,
            //       "creditPeriod": this.supplierForm.get("CreditPeriod").value || "0",
            //       "mobile": this.supplierForm.get("Mobile").value || "0",
            //       "phone": this.supplierForm.get("Phone").value || "0",
            //       "fax": this.supplierForm.get("Fax").value || "0",
            //       "email": this.supplierForm.get("Email").value || "%",
            //       "modeofPayment": this.supplierForm.get("ModeOfPayment").value || "0",
            //       "termofPayment": this.supplierForm.get("TermOfPayment").value || "0",
            //       "currencyId": this.supplierForm.get("CurrencyId").value || "0",
            //       "octroi": 0,
            //       "freight": this.supplierForm.get("Freight").value ||"0",
            //       "gstNo": this.supplierForm.get("GSTNo").value || 0,
            //       "panNo": this.supplierForm.get("PanNo").value || 0,
            //       "supplierTime": this.supplierForm.get("SupplierType").value || 0,
            //       "mAssignSupplierToStores":data3
            //     }

            //     console.log(mdataUpdate);
            //     this._supplierService.updateSupplierMaster(mdataUpdate).subscribe((data) => {
            //             this.msg = data;
            //             if (data) {
            //                 this.toastr.success('Record updated Successfully.', 'updated !', {
            //                     toastClass: 'tostr-tost custom-toast-success',
            //                   });  
            //                    this.Savebtn=false;
            //             } else {
            //                 this.toastr.error('Supplier-from Master Master Data not updated !, Please check API error..', 'Error !', {
            //                     toastClass: 'tostr-tost custom-toast-error',
            //                   });
            //             }
            //         });
            // }
            }
            this.onClose();
        // }
    }

 

   
    onChangeMsm(event) {
      debugger
      if(event.checked==true)
      this.msmflag=true;
     else
     this.msmflag=false;
    }

    onChangeMode(event){

    }

    @ViewChild('suppliername') suppliername: ElementRef;
  @ViewChild('suppliertype') suppliertype: ElementRef;
  @ViewChild('Address') Address: ElementRef;
  @ViewChild('Pincode') Pincode: ElementRef;
  @ViewChild('Contactperson') Contactperson: ElementRef;
  @ViewChild('mobile') mobile: ElementRef;
 
  @ViewChild('phone') phone: ElementRef;
  @ViewChild('city') city: ElementRef;
  @ViewChild('Fax') Fax: ElementRef;
  @ViewChild('Email') Email: ElementRef;
  @ViewChild('Fright') Fright: ElementRef;
  @ViewChild('Modeofpay') Modeofpay: ElementRef;
  @ViewChild('Termofpay') Termofpay: ElementRef;
  @ViewChild('Tax') Tax: ElementRef;
  @ViewChild('Gst') Gst: ElementRef;
  @ViewChild('Pan') Pan: ElementRef;

  @ViewChild('Licno') Licno: ElementRef;
  @ViewChild('Expdate') Expdate: ElementRef;
  @ViewChild('Dlno') Dlno: ElementRef;
  @ViewChild('Bankname') Bankname: ElementRef;
  @ViewChild('Bankbranch') Bankbranch: ElementRef;
  @ViewChild('Bankno') Bankno: ElementRef;
  @ViewChild('IFSC') IFSC: ElementRef;
  // @ViewChild('Store') Store: MatSelect;
  @ViewChild('Store') Store: ElementRef;

  @ViewChild('MSM') MSM: ElementRef;
  @ViewChild('Taluka') Taluka: ElementRef;
  @ViewChild('creditp') creditp: ElementRef;

  @ViewChild('VenderTypeId') VenderTypeId: ElementRef;
  @ViewChild('OpeningBal') OpeningBal: ElementRef;

  @ViewChild('addbutton') addbutton: ElementRef;

  public onEnterSuppliertype(event): void {
    
    if (event.which === 13) {
      this.suppliername.nativeElement.focus();
    }
  }

  public onEnterSuppliername(event): void {
    if (event.which === 13) {
      this.mobile.nativeElement.focus();
     
    }
  }
  public onEntermobile(event): void {
    if (event.which === 13) {
      this.phone.nativeElement.focus();
    }
  }
  public onEnterphone(event): void {
    if (event.which === 13) {
      this.Address.nativeElement.focus();
    }
  }

  public onEnterAddress(event): void {
    if (event.which === 13) {
       this.Taluka.nativeElement.focus();
    }
  }

  
  public onEnterTaluka(event): void {
    if (event.which === 13) {
       this.city.nativeElement.focus();
    }
  }
  
  public onEnterCity(event): void {
    if (event.which === 13) {
      this.Pan.nativeElement.focus();
    }
  }

  public onEnterPan(event): void {
    if (event.which === 13) {
       this.Fax.nativeElement.focus();
    }
  }
  
  public onEnterfax(event): void {
    if (event.which === 13) {
       this.Email.nativeElement.focus();
    }
  }
  public onEnterEmail(event): void {
    if (event.which === 13) {
      this.Fright.nativeElement.focus();
    }
  }

  public onEnterFright(event): void {
    if (event.which === 13) {
       this.creditp.nativeElement.focus();
    }
  }
  
  public onEnterCreditPeriod(event): void {
    if (event.which === 13) {
       this.Modeofpay.nativeElement.focus();
    }
  }
  public onEnterModeofpay(event): void {
    if (event.which === 13) {
      this.Termofpay.nativeElement.focus();
    }
  }

  public onEnterTermofpay(event): void {
    if (event.which === 13) {
       this.Tax.nativeElement.focus();
    }
  }
  public onEnterTax(event): void {
    if (event.which === 13) {
      this.Gst.nativeElement.focus();
    }
  }

  public onEnterGst(event): void {
    if (event.which === 13) {
    this.Licno.nativeElement.focus();
  }
}


public onEnterLicno(event): void {
  if (event.which === 13) {
    this.Expdate.nativeElement.focus();
  }
}

public onEnterexpdate(event): void {
  if (event.which === 13) {
  this.Dlno.nativeElement.focus();
}
}

public onEnterDlno(event): void {
if (event.which === 13) {
   this.Bankname.nativeElement.focus();
}
}
public onEnterBankname(event): void {
if (event.which === 13) {
  this.Bankbranch.nativeElement.focus();
}
}


public onEnterBankbranch(event): void {
  if (event.which === 13) {
  this.Bankno.nativeElement.focus();
}
}

public onEnterBankno(event): void {
if (event.which === 13) {
   this.IFSC.nativeElement.focus();
}
}
public onEnterIfsc(event): void {
  debugger
if (event.which === 13) {
  this.OpeningBal.nativeElement.focus();
  // if (this.Store) this.Store.focus();

}
}

public onEnterVender(event): void {
  if (event.which === 13) {
    this.OpeningBal.nativeElement.focus();
  }
  }


  public onEnterOpeningBal(event): void {
    if (event.which === 13) {
      this.Store.nativeElement.focus();
    }
    }
save:boolean=false;
public onEnterStore(event): void {
  debugger
  if (event.which === 13) {
    // this.save=true;
    this.addbutton.nativeElement.focus();
    // if (this.Store) this.Store.focus();
    
  }
  }
 

  public onEnterPincode(event): void {
    if (event.which === 13) {
      this.Contactperson.nativeElement.focus();
    }
  }

  public onEnterContactperson(event): void {
    if (event.which === 13) {
      this.mobile.nativeElement.focus();
    }
  }

  // @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;

    
    onClear() {
        this.supplierForm.reset();
    }
    onClose() {
        this.supplierForm.reset();
        this.dialogRef.close();
    }

    // new API
    
  cityId=0;
  cityName='';  
  stateId=0;
  countryId=0;
  modeOfPaymentId=0;
  termOfPaymentId=0;
  bankId=0;
  storeId=0;
  supplierId=0;

  selectChangecity(obj: any){
    console.log(obj);
    this.cityId=obj.value
    this.cityName=obj.text
  }
  selectChangestate(obj: any) {
    console.log(obj);
    this.stateId = obj
}

selectChangecountry(obj: any) {
    console.log(obj);
    this.countryId = obj
}
  selectChangemodeofpayment(obj:any){
    this.modeOfPaymentId=obj.value;
  }
  selectChangetermofpayment(obj:any){
    this.termOfPaymentId=obj.value;
  }
  selectChangebankName(obj:any){
    this.bankId=obj.value;
  }
  selectChangestoreName(obj:any){
    this.storeId=obj.value;
  }
  selectChangeSupplierType(obj:any){
    this.supplierId=obj.value;
  }

  getValidationCityMessages(){
    return{
      CityId: [
        { name: "required", Message: "City Name is required" }
      ]
    }
  }
  getValidationStateMessages() {
    return {
        StateId: [
            { name: "required", Message: "State Name is required" }
        ]
    };
}
getValidationCountryMessages() {
  return {
      CountryId: [
          { name: "required", Message: "Country Name is required" }
      ]
  };
}
getValidationSupplierTypeMessages(){
    return {
      SupplierType: [
          { name: "required", Message: "SupplierType is required" }
      ]
  };
}
getValidationBankMessages(){
  return {
    BankName: [
        { name: "required", Message: "BankName is required" }
    ]
};
}
getValidationStoreMessages(){
  return {
    StoreId: [
        { name: "required", Message: "StoreName is required" }
    ]
};
}
getValidationModeOfPaymentMessages(){
  return {
    ModeOfPayment: [
        { name: "required", Message: "ModeOfPayment is required" }
    ]
};
}
getValidationTermOfPaymentMessages(){
  return {
    TermOfPayment: [
        { name: "required", Message: "TermOfPayment is required" }
    ]
};
}
}
