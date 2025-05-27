import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AirmidDropDownComponent } from "app/main/shared/componets/airmid-dropdown/airmid-dropdown.component";
import { ToastrService } from "ngx-toastr";
import { SupplierMaster, SupplierMasterComponent } from "../supplier-master.component";
import { SupplierMasterService } from "../supplier-master.service";

@Component({
  selector: "app-supplier-form-master",
  templateUrl: "./supplier-form-master.component.html",
  styleUrls: ["./supplier-form-master.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SupplierFormMasterComponent implements OnInit {

  supplierForm: FormGroup;
  @ViewChild('ddlStore') ddlStore: AirmidDropDownComponent;
  submitted = false;
  registerObj = new SupplierMaster({});


  msg: any;
  msmflag: boolean = false;
  CityId: any;


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
    this.supplierForm.markAllAsTouched();

    // setTimeout(() => {
    //   this.supplierForm = this._supplierService.createSuppliermasterForm();
    // }, 0)


    // if (this.data) {
      // this.registerObj = this.data.registerObj;
      // console.log(this.registerObj);

      if (this.data.supplierId > 0) {

        this._supplierService.getsupplierId(this.data.supplierId).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)
          this.ddlStore.SetSelection(this.registerObj.mAssignSupplierToStores);

        }, (error) => {
          this.toastr.error(error.message);
        });
      }   else {
        this.supplierForm.reset();
        // this.supplierForm.get('isActive').setValue(1);
        
    }
    }
  // }
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

    this._supplierService.SupplierSave(this.supplierForm.value).subscribe((response) => {
      this.toastr.success(response.message);
      this.onClear();
    }, (error) => {
      this.toastr.error(error.message);
    });
    
    this.onClose();
    
  }




  onChangeMsm(event) {

    if (event.checked == true)
      this.msmflag = true;
    else
      this.msmflag = false;
  }

  onChangeMode(event) {

  }


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
}