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
    optionsCity: any[] = [];
    optionsModeofpayment: any[] = [];
    optionsTermofpayment: any[] = [];
    optionsSuppliertype: any[] = [];
    optionsBank1: any[] = [];

    
    filteredOptionsBank1: Observable<string[]>;
    filteredOptionsModeofpayment: Observable<string[]>;
    filteredOptionsCity: Observable<string[]>;
     filteredOptionsStore: Observable<string[]>;
     filteredOptionsSuppliertype: Observable<string[]>;
     filteredOptionsTermofpayment: Observable<string[]>;

    isCitySelected: boolean = false;
    isBank1elected : boolean = false;
    isTermofpaymentSelected : boolean = false;
    isSuppliertypeSelected: boolean = false;
    isMdeofpaymentSelected: boolean = false;
    msg: any;
    msmflag:boolean=false;
    CityId:any;


    private _onDestroy = new Subject<void>();

    constructor(
        public _supplierService: SupplierMasterService,
        public toastr : ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<SupplierMasterComponent>
    ) {
      
    }

    ngOnInit(): void {
        this.getSupplierTypeMasterList();
        this.getModeofpaymentCombobox();
        this.getTermofpaymentCombobox();
        this.getCountryNameCombobox();
        this.getBankNameList1();
        this.getCityNameCombobox();
        this.getStoreNameCombobox();

        if(this.data){
          debugger
            this.registerObj=this.data.registerObj;
            // this.RegId= this.registerObj.RegId;
            //   this.isDisabled=true
            //   this.Prefix=this.data.registerObj.PrefixID;
            
          this.registerObj.Mobile=this.data.registerObj.Mobile.trim();
          this.registerObj.Phone=this.data.registerObj.Phone.trim();
          this.CityId=this.data.registerObj.CityId;
          this.setDropdownObjs1();
          }

    }



    
  setDropdownObjs1() {
    debugger

   
    //  const toSelect = this.CitycmbList.find(c => c.CityId == this.registerObj.CityId);
     this._supplierService.myform.get('CityId').setValue(this.CityId);
 
    //  const toSelectSuup = this.SuppliertypecmbList.find(c => c.ConstantId == this.registerObj.Sup);
    //  this._supplierService.myform.get('SupplierType').setValue(toSelectSuup);
 
    //  const toSelectState = this.StatecmbList.find(c => c.StateId == this.registerObj.StateId);
    //  this._supplierService.myform.get('StateId').setValue(toSelectState);
 
    //  const toSelectCountry= this.CountrycmbList.find(c => c.CountryId == this.registerObj.CountryId);
    //  this._supplierService.myform.get('CountryId').setValue(toSelectCountry);
 
    //  const toSelectpaymode = this.PaymentmodecmbList.find(c => c.id == this.registerObj.ModeOfPayment);
    //  this._supplierService.myform.get('ModeOfPayment').setValue(toSelectpaymode);
 
   
   
    //  const toSelectBank = this.PaymenttermcmbList.find(c => c.Id == this.registerObj.TermOfPayment);
    //  this._supplierService.myform.get('TermOfPayment').setValue(toSelectBank);
 
    //  const toSelectBankname= this.BankNameList1.find(c => c.BankId == this.registerObj.BankId);
    //  this._supplierService.myform.get('BankName').setValue(toSelectBankname);
 
    //  const toSelectStore = this.PaymentmodecmbList.find(c => c.StoreId == this.registerObj.StoreId);
    //  this._supplierService.myform.get('StoreId').setValue(toSelectStore);
 
     
    //  this.onChangeCityList(this._supplierService.myform.get('CityId').value);
     
     this._supplierService.myform.updateValueAndValidity();
     this.dialogRef.close();
     
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
          this.optionsBank1 = this.BankNameList1.slice();
          this.filteredOptionsBank1 = this._supplierService.myform.get('BankName').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterBank1(value) : this.BankNameList1.slice()),
          );
          
        });
      }

      getOptionTextBank1(option){
        return option && option.BankName ? option.BankName : '';
      }
    
      private _filterBank1(value: any): string[] {
        if (value) {
          const filterValue = value && value.BankName ? value.BankName.toLowerCase() : value.toLowerCase();
           return this.optionsBank1.filter(option => option.BankName.toLowerCase().includes(filterValue));
        }
    
      }

      

    getCityNameCombobox() {

    this._supplierService.getCityMasterCombo().subscribe(data => {
      this.CitycmbList = data;
      this.optionsCity = this.CitycmbList.slice();
      this.filteredOptionsCity = this._supplierService.myform.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCity(value) : this.CitycmbList.slice()),
      );

    });
    // debugger
    // if (this.data) {
    //   const ddValue = this.CitycmbList.find(c => c.CityId == this.data.registerObj.CityId);
    //   this._supplierService.myform.get('CityId').setValue(ddValue);
    //   this.onChangeCityList(this.data.registerObj.CityId)
    // }

   

  }
 
  
  private _filterCity(value: any): string[] {
    if (value) {
      const filterValue = value && value.CityName ? value.CityName.toLowerCase() : value.toLowerCase();

      return this.optionsCity.filter(option => option.CityName.toLowerCase().includes(filterValue));
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

  
  private _filterSupplierType(value: any): string[] {
    if (value) {
      const filterValue = value && value.Name ? value.Name.toLowerCase() : value.toLowerCase();

      return this.optionsSuppliertype.filter(option => option.Name.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextSuppliertype(option) {

    return option && option.Name ? option.Name : '';

  }


  getModeofpaymentCombobox() {

    this._supplierService.getModeofpaymentMasterCombo().subscribe(data => {
      this.PaymentmodecmbList = data;
      this.optionsModeofpayment= this.PaymentmodecmbList.slice();
      this.filteredOptionsModeofpayment = this._supplierService.myform.get('ModeOfPayment').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterModeofpayment(value) : this.PaymentmodecmbList.slice()),
      );

    });

  }

  
  private _filterModeofpayment(value: any): string[] {
    if (value) {
      const filterValue = value && value.ModeOfPayment ? value.ModeOfPayment.toLowerCase() : value.toLowerCase();

      return this.optionsModeofpayment.filter(option => option.ModeOfPayment.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextModeopayment(option) {
    return option && option.ModeOfPayment ? option.ModeOfPayment : '';
    // return option && option.ModeOfPayment ? option.ModeOfPayment : '';

  }


  getTermofpaymentCombobox() {

    this._supplierService.getTermofpaymentMasterCombo().subscribe(data => {
      this.PaymenttermcmbList = data;
      this.optionsTermofpayment= this.PaymenttermcmbList.slice();
      this.filteredOptionsTermofpayment = this._supplierService.myform.get('TermOfPayment').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterTermofpayment(value) : this.PaymenttermcmbList.slice()),
      );

    });

  }

  
  private _filterTermofpayment(value: any): string[] {
    if (value) {
      const filterValue = value && value.TermsOFPayment ? value.TermsOFPayment.toLowerCase() : value.toLowerCase();

      return this.optionsTermofpayment.filter(option => option.TermsOFPayment.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextTermofpayment(option) {

    return option && option.TermsOFPayment ? option.TermsOFPayment : '';

  }

  getOptionTextRefDoc(option) {

    return option && option.DoctorName ? option.DoctorName : '';

  }


    private _filterStore(value: any): string[] {
        if (value) {
            const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
            //   this.isDoctorSelected = false;
            return this.optionsStore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
        }

    }
    
    getStoreNameCombobox() {

        this._supplierService.getStoreMasterCombo().subscribe(data => {
            this.StorecmbList = data;
            this.StorecmbList = this.StorecmbList.slice();
            this.filteredOptionsStore = this._supplierService.myform.get('StoreId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterStore(value) : this.StorecmbList.slice()),
            );

        });

    }
    getOptionTextStore(option) {

        return option && option.StoreName ? option.StoreName : '';

    }

  
    onSubmit() {
        if (this._supplierService.myform.valid) {
            if (!this._supplierService.myform.get("SupplierId").value) {
                var data2 = [];
                for (var val of this._supplierService.myform.get("StoreId")
                    .value) {
                    var data = {
                        storeId: val,
                        supplierId: 0,
                    };
                    data2.push(data);
                }
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
                        termsofPayment:this._supplierService.myform.get("TermOfPayment").value.Id || "0",
                        // taxNature:
                        //     this._supplierService.myform.get("TaxNature")
                        //         .value || "0",
                        currencyId:this._supplierService.myform.get("CurrencyId").value || "0",
                        octroi:0,
                        freight:this._supplierService.myform.get("Freight").value ||"0",
                        isDeleted: Boolean(JSON.parse(this._supplierService.myform.get("IsDeleted").value)),
                        addedBy: 1,
                        gstNo: this._supplierService.myform.get("GSTNo").value,
                        supplierId:this._supplierService.myform.get("SupplierId").value || "0",
                        panNo: this._supplierService.myform.get("PanNo").value,
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
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //     }
                            // });
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
                for (var val of this._supplierService.myform.get("StoreId")
                    .value) {
                    var data4 = {
                        storeId: val,
                        supplierId:
                            this._supplierService.myform.get("SupplierId")
                                .value,
                    };
                    data3.push(data4);
                }
                console.log(data3);
                var m_dataUpdate = {
                    updateSupplierMaster: {
                        supplierId:this._supplierService.myform.get("SupplierId").value,
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
                        termsofPayment:this._supplierService.myform.get("TermOfPayment").value.Id || "0",
                        // taxNature:
                        //     this._supplierService.myform.get("TaxNature")
                        //         .value || "0",
                        currencyId:this._supplierService.myform.get("CurrencyId").value || "0",
                        octroi:0,
                        freight:this._supplierService.myform.get("Freight").value ||"0",
                        isDeleted: Boolean(JSON.parse(this._supplierService.myform.get("IsDeleted").value)),
                        updatedBy: 1,
                        gstNo: this._supplierService.myform.get("GSTNo").value,
                        panNo: this._supplierService.myform.get("PanNo").value,
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
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //     }
                            // });
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
        }
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
          this._supplierService.getStateList(2).subscribe((data: any) => {
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
  @ViewChild('Store') Store: MatSelect;
  @ViewChild('MSM') MSM: ElementRef;
  @ViewChild('Taluka') Taluka: ElementRef;
 

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
if (event.which === 13) {
  
  if (this.Store) this.Store.focus();
}
}
save:boolean=false;
public onEnterStore(event): void {
  debugger
  if (event.which === 13) {
    //  this.MSM.nativeElement.focus();
     this.save=true;
  }
  }
 
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;

  // public onEnterIfsc(event): void {
  // if (event.which === 13) {
  //   if (event.which === 13) {
  //     this.save=true;
  // this.addbutton.focus();
  // }
  // }
  // }
  

    // onEdit(row) {
    //     var m_data = {
    //         SupplierId: row.SupplierId,
    //         SupplierName: row.SupplierName,
    //         ContactPerson: row.ContactPerson,
    //         Address: row.Address.trim(),
    //         CityId: row.CityId,
    //         StateId: row.StateId,
    //         CountryId: row.CountryId,
    //         CreditPeriod: row.CreditPeriod.trim(),
    //         Mobile: row.Mobile.trim(),
    //         Phone: row.Phone.trim(),
    //         Fax: row.Fax.trim(),
    //         Email: row.Email.trim(),
    //         ModeOfPayment: row.ModeOfPayment,
    //         TermOfPayment: row.TermOfPayment,
    //         TaxNature: row.TaxNature,
    //         CurrencyId: row.CurrencyId,
    //         Octroi: row.Octroi,
    //         Freight: row.Freight,
    //         IsDeleted: JSON.stringify(row.IsDeleted),
    //         GSTNo: row.GSTNo.trim(),
    //         PanNo: row.PanNo.trim(),
    //         UpdatedBy: row.UpdatedBy,
    //     };

    //     console.log(row);
    //     this._supplierService.populateForm(m_data);
    // }

    onClear() {
        this._supplierService.myform.reset();
    }
    onClose() {
        this._supplierService.myform.reset();
        this.dialogRef.close();
    }
}
