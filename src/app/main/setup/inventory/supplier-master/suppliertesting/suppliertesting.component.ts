import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SupplierMaster } from '../supplier-master.component';
import { AirmidAutocompleteComponent } from 'app/main/shared/componets/airmid-autocomplete/airmid-autocomplete.component';
import { SupplierMasterService } from '../supplier-master.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-suppliertesting',
  templateUrl: './suppliertesting.component.html',
  styleUrls: ['./suppliertesting.component.scss']
})
export class SuppliertestingComponent implements OnInit {

  supplierForm: FormGroup;
  @ViewChild('ddlStore') ddlStore: AirmidAutocompleteComponent;
  submitted = false;
  registerObj = new SupplierMaster({});
  msg: any;
  msmflag: boolean = false;
  CityId: any;
  SupplierId: any = 0;
  screenFromString = 'OP-billing';
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
    public dialogRef: MatDialogRef<SuppliertestingComponent>
  ) {

  }

  ngOnInit(): void {
    this.supplierForm = this._supplierService.createSuppliermasterForm();


    if (this.data.supplierId > 0) {

      this._supplierService.getsupplierId(this.data.supplierId).subscribe((response) => {
        this.registerObj = response;
        this.SupplierId = this.registerObj.supplierId
        console.log(this.registerObj)
        this.ddlStore.SetSelection(this.registerObj.mAssignSupplierToStores);

      }, (error) => {
        this.toastr.error(error.message);
      });
    } else {
      this.supplierForm.reset();
    }
  }

  removestore(item) {
    let removedIndex = this.supplierForm.value.mAssignSupplierToStores.findIndex(x => x.storeId == item.storeId);
    this.supplierForm.value.mAssignSupplierToStores.splice(removedIndex, 1);
    this.ddlStore.SetSelection(this.supplierForm.value.mAssignSupplierToStores.map(x => x.storeId));
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


  Savebtn: boolean = false;
  onSubmit() {


    console.log(this.supplierForm.value);
    // if (this.supplierForm.valid) {
      this._supplierService.SupplierSave(this.supplierForm.value).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear();
      }, (error) => {
        this.toastr.error(error.message);
      });
    // } else {
    //   this.toastr.warning('please check from is invalid', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    this.onClose();

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
      cityId: [
        { name: "required", Message: "City Name is required" }
      ],
      stateId: [
        { name: "required", Message: "State Name is required" }
      ],
      countryId: [
        { name: "required", Message: "Country Name is required" }
      ],
      SupplierType: [
        { name: "required", Message: "SupplierType is required" }
      ],
      BankName: [
        { name: "required", Message: "BankName is required" }
      ],
      storeId: [
        { name: "required", Message: "StoreName is required" }
      ],
      modeofPayment: [
        { name: "required", Message: "ModeOfPayment is required" }
      ],
      termofPayment: [
        { name: "required", Message: "TermOfPayment is required" }
      ],
      supplierName: [
        { name: "required", Message: "SupplierName is required" },
        { name: "pattern", Message: "only char allowed." }
      ],
      mobile: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Mobile No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      phone: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Phone No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      address: [
        { name: "required", Message: "address is required" }
      ],
      gstNo: [
        { name: "required", Message: "GSTNo is required" },
        { name: "minLength", Message: "15 digit required." },
        { name: "maxLength", Message: "More than 15 digits not allowed."}

      ],
      creditPeriod: [
        { name: "required", Message: "TermOfPayment is required" }
      ],
      freight: [
        { name: "required", Message: "SupplierName is required" },
        { name: "pattern", Message: "Only numbers allowed" },
      ],
      email: [
        { name: "required", Message: "SupplierName is required" },
        { name: "pattern", Message: "Mail Format allowed" }
      ]
      ,
      fax: [
        { name: "required", Message: "Fax is required" }
      ],
      panNo: [
        { name: "required", Message: "PanNo is required" }
      ],
      contactPerson: [
        { name: "required", Message: "contactPerson is required" }
      ]
    }
  }



  onChangeMsm(event) {

    if (event.checked == true)
      this.msmflag = true;
    else
      this.msmflag = false;
  }

  onChangeMode(event) {

  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  onClear() {
    this.supplierForm.reset();
  }
  onClose() {
    this.supplierForm.reset();
    this.dialogRef.close();
  }


}