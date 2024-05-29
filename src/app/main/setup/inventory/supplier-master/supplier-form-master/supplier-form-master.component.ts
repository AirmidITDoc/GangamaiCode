import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { map, startWith, takeUntil } from "rxjs/operators";
import { SupplierMaster, SupplierMasterComponent } from "../supplier-master.component";
import { SupplierMasterService } from "../supplier-master.service";
import { FormControl } from "@angular/forms";
import { Observable, ReplaySubject, Subject } from "rxjs";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { fuseAnimations } from "@fuse/animations";
import { MatSelect } from "@angular/material/select";
import { size } from "lodash";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
    selector: "app-supplier-form-master",
    templateUrl: "./supplier-form-master.component.html",
    styleUrls: ["./supplier-form-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SupplierFormMasterComponent implements OnInit {
    submitted = false;
    CountrycmbList: any = [];
    StatecmbList: any = [];
    CitycmbList: any = [];
    StorecmbList: any = [];
    VendercmbList: any = [];
    BankNameList1: any = [];
    registerObj = new SupplierMaster({});

    SuppliertypecmbList: any = [];
    PaymentmodecmbList: any = [];
    PaymenttermcmbList: any = [];

    selectedState = "";
    selectedStateID: any;
    selectedCountry: any;
    selectedCountryID: any;

    optionsSubCompany: any[] = [];
    optionsStore: any[] = [];
    optionsVender: any[] = [];
    optionsModeofpayment: any[] = [];
    optionsTermofpayment: any[] = [];
    optionsSuppliertype: any[] = [];
    optionsBank1: any[] = [];

    
    filteredOptionsBank1: Observable<string[]>;
    filteredOptionsModeofpayment: Observable<string[]>;
    filteredOptionsCity: Observable<string[]>;
     filteredOptionsStore: Observable<string[]>;
     filteredOptionsVender: Observable<string[]>;
     filteredOptionsSuppliertype: Observable<string[]>;
     filteredOptionsTermofpayment: Observable<string[]>;

    isCitySelected: boolean = false;
    isBank1elected : boolean = false;
    isTermofpaymentSelected : boolean = false;
    isSuppliertypeSelected: boolean = false;
    isMdeofpaymentSelected: boolean = false;
    isStoreSelected: boolean = false;
    isvenderselected: boolean = false;


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
    private _onDestroy = new Subject<void>();

    constructor(
        public _supplierService: SupplierMasterService,
        public toastr : ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _loggedService: AuthenticationService,
        public dialogRef: MatDialogRef<SupplierMasterComponent>
    ) {
      // this.getSupplierTypeMasterList();
      // this.getModeofpaymentCombobox();
      // this.getTermofpaymentCombobox();
      // this.getCountryNameCombobox();
      // this.getBankNameList1();
      // // this.getCityNameCombobox();
      // this.getStoreNameCombobox();
    }

  ngOnInit(): void {
    this.getSupplierTypeMasterList();
    this.getModeofpaymentCombobox();
    this.getTermofpaymentCombobox();
    this.getCountryNameCombobox();
    this.getBankNameList1();
    this.getCityNameCombobox();
    this.getStoreNameCombobox();
    this.getVenderNameCombobox();


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
      this.vMobile= this.data.registerObj.Mobile.trim();
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

      
      
      // this.setDropdownObjs1();
    }
    
    this.filteredOptionsCity = this._supplierService.myform.get('CityId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterCity(value)),
      
    );

    // this.filteredOptionsSuppliertype = this._supplierService.myform.get('SupplierType').valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterSupplierType(value)),
    // );

    this.filteredOptionsModeofpayment = this._supplierService.myform.get('ModeOfPayment').valueChanges.pipe(
      startWith(''),
      map(value => this._filterModeofpayment(value)),
    );

    this.filteredOptionsTermofpayment = this._supplierService.myform.get('TermOfPayment').valueChanges.pipe(
      startWith(''),
      map(value => this._filterTermofpayment(value)),
    );

    this.filteredOptionsBank1 = this._supplierService.myform.get('BankName').valueChanges.pipe(
      startWith(''),
      map(value => this._filterBank(value)),
    );

  
    this.filteredOptionsStore = this._supplierService.myform.get('StoreId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterStore(value)),
      
    );

    this.filteredOptionsVender = this._supplierService.myform.get('VenderTypeId').valueChanges.pipe(
      startWith(''),
      map(value => this._filtervender(value)),
      
    );


  }


    get f() {
        return this._supplierService.myform.controls;
    }

    getCountryNameCombobox() {
        this._supplierService
            .getCountryMasterCombo()
            .subscribe((data) => (this.CountrycmbList = data));
    }

  
    getBankNameList1() {
        this._supplierService.getBankMasterCombo().subscribe(data => {
          this.BankNameList1 = data;
          console.log(this.BankNameList1 )
          if (this.data) {
            const ddValue = this.BankNameList1.filter(c => c.BankId == this.data.registerObj.BankId);
            this._supplierService.myform.get('BankName').setValue(ddValue[0]);
            this._supplierService.myform.updateValueAndValidity();
            return;
          } 
          
        });
      }

      // getBankNameList1() {
      
      //   this._supplierService.getBankMasterCombo().subscribe(data => {
      //     this.BankNameList1 = data;
      //     if (this.data) {
      //       const ddValue = this.BankNameList1.filter(c => c.BankId == this.data.registerObj.BankId);
      //       this._supplierService.myform.get('BankName').setValue(ddValue[0]);
      //      this._supplierService.myform.updateValueAndValidity();
      //       return;
      //     } 
      //   });
        
      // }
     

      getOptionTextBank1(option){
        return option && option.BankName ? option.BankName : '';
      }
    
      private _filterBank(value: any): string[] {
        if (value) {
          const filterValue = value && value.BankName ? value.BankName.toLowerCase() : value.toLowerCase();
    
          return this.BankNameList1.filter(option => option.BankName.toLowerCase().includes(filterValue));
        }
    
      }
      

    getCityNameCombobox() {
      
    this._supplierService.getCityMasterCombo().subscribe(data => {
      this.CitycmbList = data;
      if (this.data) {
        const ddValue = this.CitycmbList.filter(c => c.CityId == this.data.registerObj.CityId);
        this._supplierService.myform.get('CityId').setValue(ddValue[0]);
        this.onChangeCityList(ddValue[0])
        this._supplierService.myform.updateValueAndValidity();
        return;
      } 
    });
    
  }
 
  
  private _filterCity(value: any): string[] {
    if (value) {
      const filterValue = value && value.CityName ? value.CityName.toLowerCase() : value.toLowerCase();

      return this.CitycmbList.filter(option => option.CityName.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextCity(option) {
    return option && option.CityName ? option.CityName : '';

  }

  getSupplierTypeMasterList() {
var m = {
        "ConstanyType":"SUPPLIER_TYPE"
    }
    this._supplierService.getSuppliertypeList(m).subscribe(data => {
      this.SuppliertypecmbList = data;
      this.optionsSuppliertype= this.SuppliertypecmbList.slice();
      this.filteredOptionsSuppliertype = this._supplierService.myform.get('SupplierType').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplierType(value) : this.SuppliertypecmbList.slice()),
      );

    });

  }

  
  // getSupplierTypeMasterList() {
  //   var m = {
  //     "ConstanyType":"SUPPLIER_TYPE"
  // }
  // this._supplierService.getSuppliertypeList(m).subscribe(data => {
  //   this.SuppliertypecmbList = data;
  //     if (this.data) {
  //       const ddValue = this.SuppliertypecmbList.filter(c => c.ConstantId == this.data.registerObj.SupplierType);
  //       this._supplierService.myform.get('SupplierType').setValue(ddValue[0]);
  //       // this.onChangeCityList(this.data.registerObj.CityId)
  //       this._supplierService.myform.updateValueAndValidity();
  //       return;
  //     } 
  //   });
    
  // }
  
  private _filterSupplierType(value: any): string[] {
    if (value) {
      const filterValue = value && value.Name ? value.Name.toLowerCase() : value.toLowerCase();

      return this.optionsSuppliertype.filter(option => option.Name.toLowerCase().includes(filterValue));
    }

  }

  

  getOptionTextSuppliertype(option) {

    return option && option.Name ? option.Name : '';

  }


  // getModeofpaymentCombobox() {

  //   this._supplierService.getModeofpaymentMasterCombo().subscribe(data => {
  //     this.PaymentmodecmbList = data;
  //     this.optionsModeofpayment= this.PaymentmodecmbList.slice();
  //     this.filteredOptionsModeofpayment = this._supplierService.myform.get('ModeOfPayment').valueChanges.pipe(
  //       startWith(''),
  //       map(value => value ? this._filterModeofpayment(value) : this.PaymentmodecmbList.slice()),
  //     );

  //   });

  // }

  getModeofpaymentCombobox() {
      
    this._supplierService.getModeofpaymentMasterCombo().subscribe(data => {
      this.PaymentmodecmbList = data;
      if (this.data) {
        const ddValue = this.PaymentmodecmbList.filter(c => c.id == this.data.registerObj.ModeOfPayment);
        this._supplierService.myform.get('ModeOfPayment').setValue(ddValue[0]);
       this._supplierService.myform.updateValueAndValidity();
        return;
      } 
    });
    
  }
 

  
  private _filterModeofpayment(value: any): string[] {
    if (value) {
      const filterValue = value && value.ModeOfPayment ? value.ModeOfPayment.toLowerCase() : value.toLowerCase();

      return this.PaymentmodecmbList.filter(option => option.ModeOfPayment.toLowerCase().includes(filterValue));
    }

  }

  
  getOptionTextModeopayment(option) {
    return option && option.ModeOfPayment ? option.ModeOfPayment : '';
    
  }


  // getTermofpaymentCombobox() {

  //   this._supplierService.getTermofpaymentMasterCombo().subscribe(data => {
  //     this.PaymenttermcmbList = data;
  //     this.optionsTermofpayment= this.PaymenttermcmbList.slice();
  //     this.filteredOptionsTermofpayment = this._supplierService.myform.get('TermOfPayment').valueChanges.pipe(
  //       startWith(''),
  //       map(value => value ? this._filterTermofpayment(value) : this.PaymenttermcmbList.slice()),
  //     );

  //   });

  // }

  getTermofpaymentCombobox() {
      
    this._supplierService.getTermofpaymentMasterCombo().subscribe(data => {
      this.PaymenttermcmbList = data;
      if (this.data) {
        const ddValue = this.PaymenttermcmbList.filter(c => c.Id == this.data.registerObj.TermOfPayment);
        this._supplierService.myform.get('TermOfPayment').setValue(ddValue[0]);
       this._supplierService.myform.updateValueAndValidity();
        return;
      } 
    });
    
  }
 
  
  private _filterTermofpayment(value: any): string[] {
    if (value) {
      const filterValue = value && value.TermsOFPayment ? value.TermsOFPayment.toLowerCase() : value.toLowerCase();

      return this.PaymenttermcmbList.filter(option => option.TermsOFPayment.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextTermofpayment(option) {

    return option && option.TermsOFPayment ? option.TermsOFPayment : '';

  }

     
    
  private _filterStore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();

      return this.StorecmbList.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }

  }
 
  private _filtervender(value: any): string[] {
    if (value) {
      const filterValue = value && value.VenderTypeName ? value.VenderTypeName.toLowerCase() : value.toLowerCase();

      return this.VendercmbList.filter(option => option.VenderTypeName.toLowerCase().includes(filterValue));
    }

  }

     


    // getStoreNameCombobox() {

    //     this._supplierService.getStoreMasterCombo().subscribe(data => {
    //         this.StorecmbList = data;
    //         this.StorecmbList = this.StorecmbList.slice();
    //         this.filteredOptionsStore = this._supplierService.myform.get('StoreId').valueChanges.pipe(
    //             startWith(''),
    //             map(value => value ? this._filterStore(value) : this.StorecmbList.slice()),
    //         );

    //     });

    // }


    getStoreNameCombobox() {
      
      this._supplierService.getStoreMasterCombo().subscribe(data => {
        this.StorecmbList = data;
        // this.optionsStore = this.StorecmbList.slice();
        if (this.data) {
          debugger
          this.data.registerObj.StoreId=this._loggedService.currentUserValue.user.storeId
          const ddValue = this.StorecmbList.filter(c => c.StoreId == this.data.registerObj.StoreId);
          this._supplierService.myform.get('StoreId').setValue(ddValue[0]);
         this._supplierService.myform.updateValueAndValidity();
          return;
        } 
        
      });
    }

    getOptionTextStore(option) {

      return option && option.StoreName ? option.StoreName : '';

  }

    getVenderNameCombobox() {

      this._supplierService.getVenderMasterCombo().subscribe(data => {
          this.VendercmbList = data;
          console.log(this.VendercmbList)
          // this.optionsVender = this.VendercmbList.slice();
          if (this.data) {
            const ddValue = this.VendercmbList.filter(c => c.VenderTypeId == this.data.registerObj.VenderTypeId);
            this._supplierService.myform.get('VenderTypeId').setValue(ddValue[0]);
           this._supplierService.myform.updateValueAndValidity();
            return;
          } 
      });

  }
  getOptionTextVendertype(option) {

    return option && option.VenderTypeName ? option.VenderTypeName : '';

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
      if ((this.vSupplierName == undefined || this.vSupplierName == undefined || this.vSupplierName == undefined)) {
        this.toastr.warning('Please enter SupplierName.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
    }
    if ((this.vAddress == undefined || this.vAddress == undefined || this.vAddress == undefined)) {
        this.toastr.warning('Please enter Address.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
    }
    if ((this.vMobile == undefined || this.vMobile == undefined || this.vMobile == undefined)) {
        this.toastr.warning('Please enter Mobile..', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
    }
    if (( this._supplierService.myform.get("CityId").value.CityId == undefined ||
     this._supplierService.myform.get("CityId").value.CityId == undefined ||
       this._supplierService.myform.get("CityId").value.CityId == undefined)) {
        this.toastr.warning('Please select  City.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
    }
    if ((this.vEmail == undefined || this.vEmail == undefined || this.vEmail == undefined)) {
      this.toastr.warning('Please enter Email..', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
  }
  if ((this.vModeofpay == undefined || this.vModeofpay == undefined || this.vModeofpay == undefined)) {
      this.toastr.warning('Please select Modeofpay.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
  }
  if ((this.vStoreId == undefined || this.vStoreId == undefined || this.vStoreId == undefined)) {
    this.toastr.warning('Please select Store.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
}

    let termsofPayment = 0;
    if (this._supplierService.myform.get("TermOfPayment").value)
      termsofPayment =this._supplierService.myform.get("TermOfPayment").value.Id;

    let BankId = 0;
    if (this._supplierService.myform.get("BankName").value)
      BankId =this._supplierService.myform.get("BankName").value.BankId;

    let bankname = '';
    if (this._supplierService.myform.get("BankName").value)
      bankname = this._supplierService.myform.get("BankName").value.BankName;

    let venderTypeId = 0;
    if (this._supplierService.myform.get("VenderTypeId").value)
      venderTypeId = this._supplierService.myform.get("VenderTypeId").value.VenderTypeId ;


            if (!this._supplierService.myform.get("SupplierId").value) {
              this.Savebtn=true;
                var data2 = [];
                // for (var val of this._supplierService.myform.get("StoreId")
                //     .value) {
                  debugger
                    var data = {
                        storeId: this._supplierService.myform.get("StoreId").value.storeId, 
                        supplierId: 0,
                    };
                    data2.push(data);
                // }
                console.log(data2);
                debugger
                var m_data = {
                 
                    insertSupplierMaster: {
                      supplierName: this._supplierService.myform.get("SupplierName").value,
                      contactPerson:this._supplierService.myform.get("ContactPerson").value || "%",
                      address:this._supplierService.myform.get("Address").value || "%",
                      cityId: this._supplierService.myform.get("CityId").value.CityId,
                      stateId:this._supplierService.myform.get("StateId").value.StateId,
                      countryId:this._supplierService.myform.get("CountryId").value.CountryId,
                      creditPeriod:this._supplierService.myform.get("CreditPeriod").value || "0",
                      mobile:this._supplierService.myform.get("Mobile").value || "0",
                      phone:this._supplierService.myform.get("Phone").value || "0",
                      fax:this._supplierService.myform.get("Fax").value || "0",
                      email:this._supplierService.myform.get("Email").value || "%",
                      modeofPayment:this._supplierService.myform.get("ModeOfPayment").value.id || "0",
                      termsofPayment:termsofPayment || "0",
                      currencyId:this._supplierService.myform.get("CurrencyId").value || "0",
                      octroi:0,
                      freight:this._supplierService.myform.get("Freight").value ||"0",
                      isDeleted: Boolean(JSON.parse(this._supplierService.myform.get("IsDeleted").value)),
                      addedby:this._loggedService.currentUserValue.user.id || 0,
                      gstNo: this._supplierService.myform.get("GSTNo").value || 0,
                      supplierId:this._supplierService.myform.get("SupplierId").value || 0,
                      panNo: this._supplierService.myform.get("PanNo").value || 0
                        // pinCode:this._supplierService.myform.get("Pincode").value || "0",
                        // taluka:this._supplierService.myform.get("Taluka").value || "0",
                        // licNo:this._supplierService.myform.get("LicNo").value || "0",
                        // expDate: this.registerObj.ExpDate,//this._supplierService.myform.get("ExpDate").value.ExpDate || "",
                        // dlNo:this._supplierService.myform.get("DlNo").value || "0",
                        // BankId:BankId || "0",
                        // bankname:bankname|| " ",
                        // branch:this._supplierService.myform.get("BankBranch").value || "0",
                        // bankNo:this._supplierService.myform.get("BankNo").value || "0",
                        // ifsccode:this._supplierService.myform.get("IFSCcode").value || "0",
                        // venderTypeId:venderTypeId || "0",
                        // openingBalance:this._supplierService.myform.get("OpeningBal").value || "0",
                        // TaxNature:this._supplierService.myform.get("TaxNature").value || "0",
                    },
                    insertAssignSupplierToStore: data2,
                };
                console.log(m_data);
                this._supplierService
                    .insertSupplierMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });   
                              this.Savebtn=false;
                        } else {
                            this.toastr.error('Supplier-from Master Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                    },error => {
                        this.toastr.error('Supplier-from not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var data3 = [];
                this.Savebtn=true;
                // for (var val of this._supplierService.myform.get("StoreId")
                //     .value) {
                    var data4 = {
                      storeId:  this._supplierService.myform.get("StoreId").value.storeId, 
                      supplierId: this._supplierService.myform.get("SupplierId").value || 0,
                    };
                    data3.push(data4);
                // }
                console.log(data3);
                var m_dataUpdate = {
                    updateSupplierMaster: {
                        supplierID:this._supplierService.myform.get("SupplierId").value || 0,
                        supplierName: this._supplierService.myform.get("SupplierName").value,
                        contactPerson:this._supplierService.myform.get("ContactPerson").value || "%",
                        address:this._supplierService.myform.get("Address").value || "%",
                        cityId: this._supplierService.myform.get("CityId").value.CityId,
                        stateID:this._supplierService.myform.get("StateId").value.StateId,
                        countryId:this._supplierService.myform.get("CountryId").value.CountryId,
                        creditPeriod:this._supplierService.myform.get("CreditPeriod").value || "0",
                        mobile:this._supplierService.myform.get("Mobile").value || "0",
                        phone:this._supplierService.myform.get("Phone").value || "0",
                        fax:this._supplierService.myform.get("Fax").value || "0",
                        email:this._supplierService.myform.get("Email").value || "%",
                        modeofPayment:this._supplierService.myform.get("ModeOfPayment").value.id || "0",
                        termsofPayment:termsofPayment || "0",
                        currencyId:this._supplierService.myform.get("CurrencyId").value || "0",
                        octroi:0,
                        freight:this._supplierService.myform.get("Freight").value ||"0",
                        isDeleted: Boolean(JSON.parse(this._supplierService.myform.get("IsDeleted").value)),
                        updatedBy:this._loggedService.currentUserValue.user.id || 0,
                        gstNo: this._supplierService.myform.get("GSTNo").value || 0, 
                        panNo: this._supplierService.myform.get("PanNo").value || 0
                        // pinCode:this._supplierService.myform.get("Pincode").value || "0",
                        // taluka:this._supplierService.myform.get("Taluka").value || "0",
                        // licNo:this._supplierService.myform.get("LicNo").value || "0",
                        // expDate:this._supplierService.myform.get("ExpDate").value || "0",
                        // dlNo:this._supplierService.myform.get("DlNo").value || "0",
                        // BankId:BankId || "0",
                        // bankname:bankname|| " ",
                        // branch:this._supplierService.myform.get("BankBranch").value || "0",
                        // bankNo:this._supplierService.myform.get("BankNo").value || "0",
                        // ifsccode:this._supplierService.myform.get("IFSCcode").value || "0",
                        // venderTypeId:venderTypeId || "0",
                        // openingBalance:this._supplierService.myform.get("OpeningBal").value || "0"
                    },
                    deleteAssignSupplierToStore: {
                        supplierId:
                            this._supplierService.myform.get("SupplierId").value,
                    },
                    insertAssignSupplierToStore: data3,
                };
                console.log(m_dataUpdate);
                this._supplierService
                    .updateSupplierMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });  
                               this.Savebtn=false;
                        } else {
                            this.toastr.error('Supplier-from Master Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                    },error => {
                        this.toastr.error('Supplier-from not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClose();
        // }
    }


    // onChangeCityList(cityId) {
    //     if (cityId > 0) {
    //         this._supplierService.getStateList(cityId).subscribe((data) => {
    //             this.StatecmbList = data;
    //             this.selectedState = this.StatecmbList[0].StateName;
    //             this.selectedStateID = this.StatecmbList[0].StateId;

    //             this._supplierService.myform
    //                 .get("StateId")
    //                 .setValue(this.StatecmbList[0]);
    //             this.onChangeCountryList(this.selectedStateID);
    //         });
    //     } else {
    //         this.selectedState = null;
    //         this.selectedStateID = null;
    //         this.selectedCountry = null;
    //         this.selectedCountryID = null;
    //     }
    // }

    onChangeCityList(CityObj) {
        if (CityObj) {
          this._supplierService.getStateList(CityObj.CityId).subscribe((data: any) => {
            this.StatecmbList = data;
            this.selectedState = this.StatecmbList[0].StateName;
            // const stateListObj = this.stateList.find(s => s.StateId == this.selectedStateID);
            this._supplierService.myform.get('StateId').setValue(this.StatecmbList[0]);
            this.selectedStateID = this.StatecmbList[0].StateId;
            this.onChangeCountryList(this.selectedStateID);
          });
    
        }
      }

    onChangeCountryList(StateId) {
        if (StateId > 0) {
            this._supplierService.getCountryList(StateId).subscribe((data) => {
                this.CountrycmbList = data;
                this.selectedCountry = this.CountrycmbList[0].CountryName;
                this._supplierService.myform
                    .get("CountryId")
                    .setValue(this.CountrycmbList[0]);
                this._supplierService.myform.updateValueAndValidity();
            });
        }
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
  // @ViewChild('VenderTypeId') VenderTypeId: MatSelect;

  @ViewChild('VenderTypeId') VenderTypeId: ElementRef;
  @ViewChild('OpeningBal') OpeningBal: ElementRef;
  @ViewChild('addbutton') addbutton: ElementRef;

  public onEnterSuppliername(event): void {
    if (event.which === 13) {
      this.suppliertype.nativeElement.focus();
     
    }
  }
  public onEnterSuppliertype(event): void {
    
    if (event.which === 13) {
      this.Address.nativeElement.focus();
    }
  }

  public onEnterAddress(event): void {
    if (event.which === 13) {
       this.Pincode.nativeElement.focus();
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

  public onEntermobile(event): void {
    if (event.which === 13) {
      this.phone.nativeElement.focus();
    }
  }
  public onEnterphone(event): void {
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
    this.Pan.nativeElement.focus();
  }
}

public onEnterPan(event): void {
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
  this.Store.nativeElement.focus();
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
      // this.save=true;
      this.addbutton.nativeElement.focus();
      // if (this.Store) this.Store.focus();
      
    }
    }
save:boolean=false;
public onEnterStore(event): void {
  debugger
  if (event.which === 13) {
    //  this.MSM.nativeElement.focus();
    this.VenderTypeId.nativeElement.focus();
  }
  }
 
  // @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;

  // public onEnterIfsc(event): void {
  // if (event.which === 13) {
  //   if (event.which === 13) {
  //     this.save=true;
  // this.addbutton.focus();
  // }
  // }
  // }
  

   
    onClear() {
        this._supplierService.myform.reset();
    }
    onClose() {
        this._supplierService.myform.reset();
        this.dialogRef.close();
    }
}
