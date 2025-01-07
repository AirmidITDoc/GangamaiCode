import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { SupplierMaster, SupplierMasterComponent } from '../supplier-master.component';
import { FormGroup } from '@angular/forms';
import { SupplierMasterService } from '../supplier-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidAutocompleteComponent } from 'app/main/shared/componets/airmid-autocomplete/airmid-autocomplete.component';

@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html',
  styleUrls: ['./new-supplier.component.scss']
})
export class NewSupplierComponent implements OnInit {

  supplierForm: FormGroup;
  
    submitted = false;
  
    registerObj = new SupplierMaster({});
  
  
    msg: any;
    msmflag: boolean = false;
    CityId: any;
    vchkactive: any = true;
  
  
    vSupplierName: any;
    vSupplierType: any;
    vAddress: any;
    vPincode: any;
    vMobile: any;
    vCity: any;
    vEmail: any;
    vModeofpay: any;
    vTermOfPayment: any;
    vGSTNo: any;
    vDlNo: any;
    vBankName: any;
    vBankbranch: any;
    vBankNo: any;
    vIfscNo: any;
    vStoreId: any;
    vVenderTypeId: any;
    vTaxNature: any;
    vPanNo: any;
    vLicNo: any;
    vFreight: any;
    vIfsccode: any;
    vOpeningBal: any;
    VsupplierId: any = 0;
    vCreditPeriod: any;
    private _onDestroy = new Subject<void>();
  
    // new API
  
    autocompleteModecity: string = "City";
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "Country";
    // autocompleteModecountry: string = "CountryByState";
    autocompleteModeofpayment: string = "PaymentMode";
    autocompleteModetermofpayment: string = "TermofPayment";
    autocompleteModebankName: string = "Bank";
    autocompleteModestoreName: string = "StoreName";
    autocompleteModeSupplierType: string = "SupplierType"
  
    constructor(
      public _supplierService: SupplierMasterService,
      public toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _loggedService: AuthenticationService,
      public dialogRef: MatDialogRef<SupplierMasterComponent>
    ) {
  
    }
  
    ngOnInit(): void {
      this.supplierForm = this._supplierService.createSuppliermasterForm();
  
      if (this.data) {
        this.registerObj = this.data.registerObj;
        console.log(this.registerObj);
  
      if (this.data.supplierId > 0) {
        debugger
        this._supplierService.getstoreById(this.data.supplierId).subscribe((response) => {
            this.registerObj = response;
            console.log(this.registerObj )
            this.ddlStore.SetSelection(this.registerObj.mAssignSupplierToStores);
          
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
    }
    }
  
  
    @ViewChild('ddlStore') ddlStore: AirmidAutocompleteComponent;
  
    removestore(item) {
      let removedIndex = this.supplierForm.value.MAssignSupplierToStores.findIndex(x => x.storeId == item.storeId);
      this.supplierForm.value.MAssignSupplierToStores.splice(removedIndex, 1);
      this.ddlStore.SetSelection(this.supplierForm.value.MAssignSupplierToStores.map(x => x.storeId));
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
  
    getOptionTextStore(option) {
  
      return option && option.StoreName ? option.StoreName : '';
  
    }
  
  
    Savebtn: boolean = false;
    onSubmit() {
      debugger
      // if (this.supplierForm.invalid) {
      //   this.toastr.warning('please check from is invalid', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   })
      //   return;
      // } else {
      //   if (!this.supplierForm.get("SupplierId").value) {
  
  
          debugger
          // var mdata =
          // {
  
          //   "supplierId": 0,
          //   "supplierName": this.supplierForm.get("SupplierName").value,
          //   "contactPerson": "abc",// this.supplierForm.get("Mobile").value || " ",
          //   "address": this.supplierForm.get("Address").value || " ",
          //   "cityId": parseInt(this.supplierForm.get("CityId").value),
          //   "stateId": parseInt(this.supplierForm.get("StateId").value),
          //   "countryId": this.supplierForm.get("CountryId").value.value || 0,
          //   "creditPeriod": this.supplierForm.get("CreditPeriod").value || "0",
          //   "mobile": this.supplierForm.get("Mobile").value.toString() || "",
          //   "phone": this.supplierForm.get("Phone").value.toString() || "",
          //   "fax": this.supplierForm.get("Fax").value || "0",
          //   "email": this.supplierForm.get("Email").value || "%",
          //   "modeofPayment": parseInt(this.supplierForm.get("ModeOfPayment").value),
          //   "termofPayment": parseInt(this.supplierForm.get("TermOfPayment").value),
          //   "currencyId": parseInt(this.supplierForm.get("CurrencyId").value) || 0,
          //   "octroi": 0,
          //   "freight": parseInt(this.supplierForm.get("Freight").value),
          //   "gstNo": this.supplierForm.get("GSTNo").value || 0,
          //   "panNo": this.supplierForm.get("PanNo").value || 0,
          //   "supplierTime": "10:00:00 AM",//this.supplierForm.get("SupplierType").value || 0,
          //   "mAssignSupplierToStores": data2
          // }
          // console.log("Insert mdata:", mdata);
  
  
          console.log(this.supplierForm.value);
  
          this._supplierService.SupplierSave(this.supplierForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear();
          }, (error) => {
            this.toastr.error(error.message);
          });
        // }
        
      // }
      this.onClose();
      // }
    }
  
  
  
  
    onChangeMsm(event) {
      debugger
      if (event.checked == true)
        this.msmflag = true;
      else
        this.msmflag = false;
    }
  
    onChangeMode(event) {
  
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
    save: boolean = false;
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
  
    cityId = 0;
    cityName = '';
    stateId = 0;
    countryId = 0;
    modeOfPaymentId = 0;
    termOfPaymentId = 0;
    bankId = 0;
    storeId = 0;
    supplierId = 0;
  
    selectChangecity(obj: any) {
      console.log(obj);
      this.cityId = obj.value
      this.cityName = obj.text
    }
    selectChangestate(obj: any) {
      console.log(obj);
      this.stateId = obj
    }
  
    selectChangecountry(obj: any) {
      console.log(obj);
      this.countryId = obj
    }
    selectChangemodeofpayment(obj: any) {
      this.modeOfPaymentId = obj.value;
    }
    selectChangetermofpayment(obj: any) {
      this.termOfPaymentId = obj.value;
    }
    selectChangebankName(obj: any) {
      this.bankId = obj.value;
    }
    selectChangestoreName(obj: any) {
      this.storeId = obj.value;
    }
    selectChangeSupplierType(obj: any) {
      this.supplierId = obj.value;
    }
  
    getValidationMessages() {
      return {
        CityId: [
          { name: "required", Message: "City Name is required" }
        ],
        StateId: [
          { name: "required", Message: "State Name is required" }
        ],
        CountryId: [
          { name: "required", Message: "Country Name is required" }
        ],
        SupplierType: [
          { name: "required", Message: "SupplierType is required" }
        ],
        BankName: [
          { name: "required", Message: "BankName is required" }
        ], StoreId: [
          { name: "required", Message: "StoreName is required" }
        ],
        ModeOfPayment: [
          { name: "required", Message: "ModeOfPayment is required" }
        ], TermOfPayment: [
          { name: "required", Message: "TermOfPayment is required" }
        ], 
        // StoreId: [
        //   { name: "required", Message: "Store is required" }
        // ]
  
  
      }
    }
  
  }