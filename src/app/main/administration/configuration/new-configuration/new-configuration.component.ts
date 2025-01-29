import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ConfigSettingParams } from 'app/core/models/config';
import { ReplaySubject, Subject } from 'rxjs';
import { AdministrationService } from '../../administration.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-configuration',
  templateUrl: './new-configuration.component.html',
  styleUrls: ['./new-configuration.component.scss']
})
export class NewConfigurationComponent implements OnInit {

    PathDoctorList: any = [];
    PathDepartmentList: any = [];
    SalesReceiptList: any = [];
    PatientTypeList: any = [];
    SalesReturnList: any = [];
    SalesList: any = []
    OPDBillingList: any = [];
    IPDBillingList: any = [];
    OPDReceiptCounterList: any = [];
    OPDRefundOfBillCounterList: any = [];
    IPDRefundOfBillCounterList: any = [];
    IPDRefundOfAdvanceCounterList: any = [];
    IPDAdvanceCounterList: any = [];
    IPDReceiptCounterList: any = [];
    configFormGroup: FormGroup;
    configObj = new ConfigSettingParams({});
    isLoading: string = '';
    Charges: any = false;
    PopPayBill: any = false;
    GenerateOPBill: any = false;
    PrintAdm: any = false;
    PrintOPDVisit: any = false;
    PrintReg: any = false;
    FirstName: any = false;
    MiddleName: any = false;
    LastName: any = false;
    PhoneNo: any = false;
    Address: any = false;
    City: any = false;
    Age: any = false;
    ClassEdit: any = false;
    selectedPatienttype: any;
    isPatientSelected: boolean = false;
  
    //Sales filter
    public pharmacySalesFilterCtrl: FormControl = new FormControl();
    public filteredPharmacySales: ReplaySubject<any> = new ReplaySubject<any>(1);
  
    //Sales Return filter
    public pharmacySalesReturnFilterCtrl: FormControl = new FormControl();
    public filteredPharmacySalesReturn: ReplaySubject<any> = new ReplaySubject<any>(1);
  
    public pharmacySalesReceiptFilterCtrl: FormControl = new FormControl();
    public filteredPharmacySalesReceipt: ReplaySubject<any> = new ReplaySubject<any>(1);
  
    private _onDestroy = new Subject<void>();
    constructor(public _matDialog: MatDialog,
      public _AdministrationService: AdministrationService,
      public _configurationService: ConfigurationService,
      public dialogRef: MatDialogRef<NewConfigurationComponent>,
      private formBuilder: FormBuilder,
      public datePipe: DatePipe,
      public toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
  
    ngOnInit(): void {
      this.configFormGroup = this._configurationService.createconfigForm();
      this.getPatientTypeList();
      this.getOPDBillingList();
      this.getOPDReceiptCounterList();
      this.getOPDRefundOfBillCounterList();
      this.getIPDAdvanceCounterList();
      this.getIPDBillingCounterList();
      this.getIPDReceiptCounterList();
      this.getIPDRefundOfBillCounterList();
      this.getIPDRefundOfAdvanceCounterList();
      this.getPharmacySalesCounterList();
      this.getPharmacySalesReturnCounterList();
      this.getPharmacySalesReceiptCounterList();
      this.getPathDepartmentList();
      // this.getPathDoctorList();
  
  
      // this.pharmacySalesFilterCtrl.valueChanges
      //   .pipe(takeUntil(this._onDestroy))
      //   .subscribe(() => {
      //     this.filterpharmacySales();
      //   });
  
      // this.pharmacySalesReturnFilterCtrl.valueChanges
      //   .pipe(takeUntil(this._onDestroy))
      //   .subscribe(() => {
      //     this.filterpharmacySalesReturn();
      //   });
  
      // this.pharmacySalesReceiptFilterCtrl.valueChanges
      //   .pipe(takeUntil(this._onDestroy))
      //   .subscribe(() => {
      //     this.filterpharmacySalesReceipt();
      //   });
  
      if (this.data) {
        this.configObj = this.data.configObj;
        console.log(this.configObj);
        //  this.setDropdownObjs();
      }
  
      if (this.configObj.OTCharges) {
        this.configFormGroup.get('Charges').setValue(true);
      } else {
        this.configFormGroup.get('Charges').setValue(false);
      }
  
      if (this.configObj.PopPayAfterOPBill) {
        this.configFormGroup.get('PopPayBill').setValue(true);
      } else {
        this.configFormGroup.get('PopPayBill').setValue(false);
      }
  
      if (this.configObj.GenerateOPBillInCashOption) {
        this.configFormGroup.get('GenerateOPBill').setValue(true);
      } else {
        this.configFormGroup.get('GenerateOPBill').setValue(false);
      }
  
      if (this.configObj.PrintRegAfterReg) {
        this.configFormGroup.get('PrintReg').setValue(true);
      } else {
        this.configFormGroup.get('PrintReg').setValue(false);
      }
  
      if (this.configObj.PrintOPDCaseAfterVisit) {
        this.configFormGroup.get('PrintOPDVisit').setValue(true);
      } else {
        this.configFormGroup.get('PrintOPDVisit').setValue(false);
      }
  
      if (this.configObj.PrintIPDAfterAdm) {
        this.configFormGroup.get('PrintAdm').setValue(true);
      } else {
        this.configFormGroup.get('PrintAdm').setValue(false);
      }
  
      if (this.configObj.MandatoryFirstName) {
        this.configFormGroup.get('FirstName').setValue(true);
      } else {
        this.configFormGroup.get('FirstName').setValue(false);
      }
  
  
      if (this.configObj.MandatoryMiddleName) {
        this.configFormGroup.get('MiddleName').setValue(true);
      } else {
        this.configFormGroup.get('MiddleName').setValue(false);
      }
  
  
      if (this.configObj.MandatoryLastName) {
        this.configFormGroup.get('LastName').setValue(true);
      } else {
        this.configFormGroup.get('LastName').setValue(false);
      }
  
  
      if (this.configObj.MandatoryAddress) {
        this.configFormGroup.get('Address').setValue(true);
      } else {
        this.configFormGroup.get('Address').setValue(false);
      }
  
  
      if (this.configObj.MandatoryCity) {
        this.configFormGroup.get('City').setValue(true);
      } else {
        this.configFormGroup.get('City').setValue(false);
      }
  
      if (this.configObj.MandatoryPhoneNo) {
        this.configFormGroup.get('PhoneNo').setValue(true);
      } else {
        this.configFormGroup.get('PhoneNo').setValue(false);
      }
  
      if (this.configObj.MandatoryAge) {
        this.configFormGroup.get('Age').setValue(true);
      } else {
        this.configFormGroup.get('Age').setValue(false);
      }
  
      if (this.configObj.ClassForEdit) {
        this.configFormGroup.get('ClassEdit').setValue(true);
      } else {
        this.configFormGroup.get('ClassEdit').setValue(false);
      }
  
  
      setTimeout(function () {
        let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
        element.click();
      }, 1000);
  
    }
  
    // private filterpharmacySales() {
  
    //   if (!this.SalesList) {
    //     return;
    //   }
    //   // get the search keyword
    //   let search = this.pharmacySalesFilterCtrl.value;
    //   if (!search) {
    //     this.filteredPharmacySales.next(this.SalesList.slice());
    //     return;
    //   }
    //   else {
    //     search = search.toLowerCase();
    //   }
    //   // filter
    //   this.filteredPharmacySales.next(
    //     this.SalesList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
    //   );
  
    // }
  
    // private filterpharmacySalesReturn() {
  
    //   if (!this.SalesReturnList) {
    //     return;
    //   }
    //   // get the search keyword
    //   let search = this.pharmacySalesReturnFilterCtrl.value;
    //   if (!search) {
    //     this.filteredPharmacySalesReturn.next(this.SalesReturnList.slice());
    //     return;
    //   }
    //   else {
    //     search = search.toLowerCase();
    //   }
    //   // filter
    //   this.filteredPharmacySalesReturn.next(
    //     this.SalesReturnList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
    //   );
  
    // }
  
    // private filterpharmacySalesReceipt() {
  
    //   if (!this.SalesReceiptList) {
    //     return;
    //   }
    //   // get the search keyword
    //   let search = this.pharmacySalesReceiptFilterCtrl.value;
    //   if (!search) {
    //     this.filteredPharmacySalesReceipt.next(this.SalesReceiptList.slice());
    //     return;
    //   }
    //   else {
    //     search = search.toLowerCase();
    //   }
    //   // filter
    //   this.filteredPharmacySalesReceipt.next(
    //     this.SalesReceiptList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
    //   );
  
    // }
  
    onClose() {
      // this.configFormGroup.reset();
      this.dialogRef.close();
    }
  
    onSubmit() {
      let reg = this.configObj.ConfigId;
      this.isLoading = 'submit';
      if (this.configFormGroup.get('PrintReg').value)
        var pr = 1; else pr = 0;
  
      if (this.configFormGroup.get('OTCharges').value)
        var otc = 1; else otc = 0;
  
      if (this.configFormGroup.get('PrintOPDVisit').value)
        var pov = 1; else pov = 0;
      if (this.configFormGroup.get('PrintAdm').value)
        var pa = 1; else pa = 0;
      if (this.configFormGroup.get('PopPayBill').value)
        var ppb = 1; else ppb = 0;
      if (this.configFormGroup.get('GenerateOPBill').value)
        var gpb = 1; else gpb = 0;
      if (this.configFormGroup.get('FirstName').value)
        var fn = 1; else fn = 0;
      if (this.configFormGroup.get('MiddleName').value)
        var mn = 1; else mn = 0;
  
      if (this.configFormGroup.get('LastName').value)
        var ln = 1; else ln = 0;
  
      if (this.configFormGroup.get('Address').value)
        var ad = 1; else ad = 0;
      if (this.configFormGroup.get('City').value)
        var c = 1; else c = 0;
      if (this.configFormGroup.get('Age').value)
        var ag = 1; else ag = 0;
  
      if (this.configFormGroup.get('PhoneNo').value)
        var ph = 1; else ph = 0;
  
      debugger;
      var m_data = {
        "configsettingupdate": {
          "ConfigId": this.configObj.ConfigId,// this._registerService.mySaveForm.get("RegId").value || 0,
          "PrintRegAfterReg": pr,// this.configFormGroup.get('PrintReg').value,
          "ipdPrefix": this.configFormGroup.get('IPPrefix').value || "",
          "OTCharges": otc,// this.configFormGroup.get('OTCharges').value|| "",
          "printOPDCaseAfterVisit": pov,//  this.configFormGroup.get('PrintOPDVisit').value || 0,
          "printIPDAfterAdm": pa,//this.configFormGroup.get('PrintAdm').value || 0,
          "popOPBillAfterVisit": 1,// this.configFormGroup.get('PopPayBill').value || 0,
          "popPayAfterOPBill": ppb,// this.configFormGroup.get('PrintRegAfterReg').value || 0,
          "generateOPBillInCashOption": gpb,//  this.configFormGroup.get('GenerateOPBill').value || 0,
          "MandatoryFirstName": fn,// this.configFormGroup.get('FirstName').value || '',
          "MandatoryLastName": ln,//  this.configFormGroup.get('LastName').value || '',
          "MandatoryMiddleName": mn,// this.configFormGroup.get('MiddleName').value || '',
          "MandatoryAddress": ad,//  this.configFormGroup.get('Address').value,
          "MandatoryCity": c,// this.configFormGroup.get('City').value,
          "MandatoryAge": ag,// this.configFormGroup.get('Age').value,
          "MandatoryPhoneNo": ph,//this.pharmacySalesFilterCtrl,// this.configFormGroup.get('PhoneNo').value,
          "opD_Billing_CounterId": this.configFormGroup.get('OPD_Billing_CounterId').value.CashCounterId,
          "opD_Receipt_CounterId": this.configFormGroup.get('OPD_Receipt_CounterId').value.CashCounterId,
          "opD_Refund_Bill_CounterId": this.configFormGroup.get('OPD_Refund_Bill_CounterId').value.CashCounterId,
          "opD_Advance_CounterId": this.configObj.OPD_Advance_CounterId,
          "opD_Refund_Advance_CounterId": 0,
          "ipD_Advance_CounterId": this.configFormGroup.get('IPD_Advance_CounterId').value.CashCounterId || 0,
          "ipD_Billing_CounterId": this.configFormGroup.get('IPD_Billing_CounterId').value.CashCounterId || 0,
          "ipD_Receipt_CounterId": this.configFormGroup.get('IPD_Receipt_CounterId').value.CashCounterId || 0,
          "ipD_Refund_of_Bill_CounterId": this.configFormGroup.get('IPD_Refund_of_Bill_CounterId').value.CashCounterId || 0,
          "ipD_Refund_of_Advance_CounterId": this.configFormGroup.get('IPD_Refund_of_Advance_CounterId').value.CashCounterId || 0,
          "regPrefix": this.configObj.RegPrefix || "",
          "ipPrefix": this.configFormGroup.get('IPPrefix').value || "",
          "opPrefix": this.configFormGroup.get('OPPrefix').value || "",
          "pathDepartment": this.configFormGroup.get('DepartmentId').value.DepartmentId,
          "isPathologistDr": this.configObj.IsPathologistDr,// this.configFormGroup.get('isPathologistDr').value,
          "patientTypeSelf": this.configFormGroup.get('PatientTypeID').value.PatientTypeId,
          "salesCounterId": this.configFormGroup.get('PharmacySales_CounterId').value.CashCounterId,
          "salesReturnCounterId": this.configFormGroup.get('PharmacySalesReturn_CounterId').value.CashCounterId || 0,
          "salesReceiptCounterID": this.configFormGroup.get('PharmacyReceipt_CounterId').value.CashCounterId || 0,
          "classForEdit": this.configObj.ClassForEdit || 0,
        }
      }
  
      console.log("UpdateJson:", m_data);
  
      this._configurationService.ConfigUpdate(m_data).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose()
        } else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
  
  
    // setDropdownObjs() {
    //    ;
  
    //   // const toSelect2= this.OPDRefundOfBillCounterList.find(c => c.CashCounterId == this.configObj.OPD_Refund_Bill_CounterId);
    //   // this.configFormGroup.get('OPD_Refund_Bill_CounterId').setValue(toSelect2);
  
    //   // const toSelect3 = this.IPDAdvanceCounterList.find(c => c.CashCounterId == this.configObj.IPD_Advance_CounterId);
    //   // this.configFormGroup.get('IPD_Advance_CounterId').setValue(toSelect3);
  
    //   // const toSelect4 = this.IPDBillingList.find(c => c.CashCounterId == this.configObj.IPD_Billing_CounterId);
    //   // this.configFormGroup.get('IPD_Billing_CounterId').setValue(toSelect4);
  
    //   // const toSelect5 = this.IPDReceiptCounterList.find(c => c.CashCounterId == this.configObj.IPD_Receipt_CounterId);
    //   // this.configFormGroup.get('IPD_Receipt_CounterId').setValue(toSelect5);
  
    //   // const toSelect7 = this.IPDRefundOfBillCounterList.find(c => c.CashCounterId == this.configObj.IPD_Refund_of_Bill_CounterId);
    //   // this.configFormGroup.get('IPD_Refund_of_Bill_CounterId').setValue(toSelect7);
  
    //   // const toSelect8 = this.IPDRefundOfAdvanceCounterList.find(c => c.CashCounterId == this.configObj.IPD_Refund_of_Advance_CounterId);
    //   // this.configFormGroup.get('IPD_Refund_of_Advance_CounterId').setValue(toSelect8);
  
    //   // const toSelect9 = this.PathDepartmentList.find(c => c.DepartmentId == this.configObj.PathDepartment);
    //   // this.configFormGroup.get('DepartmentId').setValue(toSelect9);
  
    //   // const toSelect10 = this.PathDoctorList.find(c => c.DoctorId == this.configObj.DoctorId);
    //   // this.configFormGroup.get('DoctorId').setValue(toSelect10);
  
  
    //   // const toSelect11 = this.SalesList.find(c => c.CashCounterId == this.configObj.PharmacySales_CounterId);
    //   // this.configFormGroup.get('PharmacySales_CounterId').setValue(toSelect11);
  
    //   // const toSelect12 = this.SalesReturnList.find(c => c.CashCounterId == this.configObj.PharmacySalesReturn_CounterId);
    //   // this.configFormGroup.get('PharmacySalesReturn_CounterId').setValue(toSelect12);
  
    //   // const toSelect13 = this.SalesReceiptList.find(c => c.CashCounterId == this.configObj.PharmacySalesReturn_CounterId);
    //   // this.configFormGroup.get('PharmacyReceipt_CounterId').setValue(toSelect13);
  
    //   // this.configFormGroup.updateValueAndValidity();
    // }
  
    // IPD Advance Counter start
  
    optionsSearchIpdAdvCounter: any[] = [];
    filteredOptionsIpdAdvCounter: Observable<string[]>;
    selectedIpdAdvCounter: any;
    isIpdAdvCounterSelected: boolean = false;
  
    getOptionTextIpdAdvCounter(option) {
       
      return option && option.CashCounterName ? option.CashCounterName : '';
    }
    getIPDAdvanceCounterList() {
       
      this._AdministrationService.getOPDBillingCombo().subscribe(data => {
        this.IPDAdvanceCounterList = data;
        this.optionsSearchIpdAdvCounter = this.IPDAdvanceCounterList.slice();
        this.filteredOptionsIpdAdvCounter = this.configFormGroup.get('IPD_Advance_CounterId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filtersearchIPDAdvCounter(value) : this.IPDAdvanceCounterList.slice()),
        );
        if (this.data) {
           
          const DValue = this.IPDAdvanceCounterList.filter(item => item.CashCounterId == this.configObj.IPD_Advance_CounterId);
          console.log("IPD_Advance_CounterId:", DValue)
          this.configFormGroup.get('IPD_Advance_CounterId').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          return;
        }
      });
    }
    private _filtersearchIPDAdvCounter(value: any): string[] {
       
      if (value) {
        const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
        return this.IPDAdvanceCounterList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
      }
    }
    // IPD Advance Counter end
  
    // IPD Billing Counter start
  
    optionsSearchIpdBillCounter: any[] = [];
    filteredOptionsIpdBillCounter: Observable<string[]>;
    selectedIpdBillCounter: any;
    isIpdBillCounterSelected: boolean = false;
  
    getOptionTextIpdBillCounter(option) {
       
      return option && option.CashCounterName ? option.CashCounterName : '';
    }
    getIPDBillingCounterList() {
       
      this._AdministrationService.getOPDBillingCombo().subscribe(data => {
        this.IPDBillingList = data;
        this.optionsSearchIpdBillCounter = this.IPDBillingList.slice();
        this.filteredOptionsIpdBillCounter = this.configFormGroup.get('IPD_Billing_CounterId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filtersearchIPDBillCounter(value) : this.IPDBillingList.slice()),
        );
        if (this.data) {
           
          const DValue = this.IPDBillingList.filter(item => item.CashCounterId == this.configObj.IPD_Billing_CounterId);
          console.log("IPD_Billing_CounterId:", DValue)
          this.configFormGroup.get('IPD_Billing_CounterId').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          return;
        }
      });
    }
    private _filtersearchIPDBillCounter(value: any): string[] {
       
      if (value) {
        const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
        return this.IPDBillingList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
      }
    }
    // IPD Billing Counter end
  
    // IPD Receipt Counter start
  
    optionsSearchIpdReceiptCounter: any[] = [];
    filteredOptionsIpdReceiptCounter: Observable<string[]>;
    selectedIpdReceiptCounter: any;
    isIpdReceiptCounterSelected: boolean = false;
  
    getOptionTextIpdReceiptCounter(option) {
       
      return option && option.CashCounterName ? option.CashCounterName : '';
    }
    getIPDReceiptCounterList() {
       
      this._AdministrationService.getOPDBillingCombo().subscribe(data => {
        this.IPDReceiptCounterList = data;
        this.optionsSearchIpdReceiptCounter = this.IPDReceiptCounterList.slice();
        this.filteredOptionsIpdReceiptCounter = this.configFormGroup.get('IPD_Receipt_CounterId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filtersearchIPDReceiptCounter(value) : this.IPDReceiptCounterList.slice()),
        );
        if (this.data) {
           
          const DValue = this.IPDReceiptCounterList.filter(item => item.CashCounterId == this.configObj.IPD_Receipt_CounterId);
          console.log("IPD_Receipt_CounterId:", DValue)
          this.configFormGroup.get('IPD_Receipt_CounterId').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          return;
        }
      });
    }
    private _filtersearchIPDReceiptCounter(value: any): string[] {
       
      if (value) {
        const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
        return this.IPDReceiptCounterList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
      }
    }
    // IPD Receipt Counter end
  
    // IPD Refund Advance Counter start
  
    optionsSearchIPDRefundOfAdvanceCounter: any[] = [];
    filteredOptionsIPDRefundOfAdvanceCounter: Observable<string[]>;
    selectedIpdRefundOfAdvanceCounter: any;
    isIpdRefundOfAdvanceCounterSelected: boolean = false;
  
    getOptionTextIpdRefundOfAdvanceCounter(option) {
       
      return option && option.CashCounterName ? option.CashCounterName : '';
    }
    getIPDRefundOfAdvanceCounterList() {
       
      this._AdministrationService.getOPDBillingCombo().subscribe(data => {
        this.IPDRefundOfAdvanceCounterList = data;
        this.optionsSearchIPDRefundOfAdvanceCounter = this.IPDRefundOfAdvanceCounterList.slice();
        this.filteredOptionsIPDRefundOfAdvanceCounter = this.configFormGroup.get('IPD_Refund_of_Advance_CounterId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filtersearchIPDRefundOfAdvanceCounter(value) : this.IPDRefundOfAdvanceCounterList.slice()),
        );
        if (this.data) {
           
          const DValue = this.IPDRefundOfAdvanceCounterList.filter(item => item.CashCounterId == this.configObj.IPD_Refund_of_Advance_CounterId);
          console.log("IPD_Refund_of_Advance_CounterId:", DValue)
          this.configFormGroup.get('IPD_Refund_of_Advance_CounterId').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          return;
        }
      });
    }
    private _filtersearchIPDRefundOfAdvanceCounter(value: any): string[] {
       
      if (value) {
        const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
        return this.IPDRefundOfAdvanceCounterList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
      }
    }
    // IPD Refund Advance Counter end
  
    // patient type start
  
    optionsSearchgroup: any[] = [];
    filteredOptionsPatient: Observable<string[]>;
    selectedOpBilling: any;
    isOpBillingSelected: boolean = false;
    getOptionTextPatient(option) {
       
      return option && option.PatientType ? option.PatientType : '';
    }
    getPatientTypeList() {
       
      this._AdministrationService.getPatientTypeCombo().subscribe(data => {
        this.PatientTypeList = data;
        this.optionsSearchgroup = this.PatientTypeList.slice();
        this.filteredOptionsPatient = this.configFormGroup.get('PatientTypeID').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filtersearchPatient(value) : this.PatientTypeList.slice()),
        );
        if (this.data) {
           
          const DValue = this.PatientTypeList.filter(item => item.PatientTypeId == this.configObj.PatientTypeSelf);
          console.log("PatientType:", DValue)
          this.configFormGroup.get('PatientTypeID').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          return;
        }
      });
    }
    private _filtersearchPatient(value: any): string[] {
       
      if (value) {
        const filterValue = value && value.PatientType ? value.PatientType.toLowerCase() : value.toLowerCase();
        return this.PatientTypeList.filter(option => option.PatientType.toLowerCase().includes(filterValue));
      }
    }
    // patient type end
  
    // OPD_Billing_CounterId start
    optionsSearchOPBilling: any[] = [];
    filteredOptionsOpBilling: Observable<string[]>;
    getOptionTextOpBilling(option) {
       
      return option && option.CashCounterName ? option.CashCounterName : '';
    }
  
    getOPDBillingList() {
       
      this._AdministrationService.getOPDBillingCombo().subscribe(data => {
        this.OPDBillingList = data;
        this.optionsSearchOPBilling = this.OPDBillingList.slice();
        this.filteredOptionsOpBilling = this.configFormGroup.get('OPD_Billing_CounterId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filtersearchOpBilling(value) : this.OPDBillingList.slice()),
        );
        if (this.data) {
           
          const DValue = this.OPDBillingList.filter(item => item.CashCounterId == this.configObj.OPD_Billing_CounterId);
          console.log("OPD_Billing_CounterId:", DValue)
          this.configFormGroup.get('OPD_Billing_CounterId').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          return;
        }
      });
    }
  
    private _filtersearchOpBilling(value: any): string[] {
       
      if (value) {
        const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
        return this.OPDBillingList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
      }
    }
    // OPD_Billing_CounterId end
  
    // OPD_Receipt_Counter start
    optionsSearchOpdReceipt: any[] = [];
    selectedOpdReceipt: any;
    isOpdReceiptSelected: boolean = false;
    filteredOptionsOpdReceipt: Observable<string[]>;
  
    getOptionTextOpdReceipt(option) {
       
      return option && option.CashCounterName ? option.CashCounterName : '';
    }
  
    getOPDReceiptCounterList() {
       
      this._AdministrationService.getOPDBillingCombo().subscribe(data => {
        this.OPDReceiptCounterList = data;
        this.optionsSearchOpdReceipt = this.OPDReceiptCounterList.slice();
        this.filteredOptionsOpdReceipt = this.configFormGroup.get('OPD_Receipt_CounterId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filtersearchOpdReceipt(value) : this.OPDReceiptCounterList.slice()),
        );
        if (this.data) {
           
          const DValue = this.OPDReceiptCounterList.filter(item => item.CashCounterId == this.configObj.OPD_Receipt_CounterId);
          console.log("OPD_Receipt_CounterId:", DValue)
          this.configFormGroup.get('OPD_Receipt_CounterId').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          return;
        }
      });
    }
  
    private _filtersearchOpdReceipt(value: any): string[] {
       
      if (value) {
        const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
        return this.OPDReceiptCounterList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
      }
    }
    // OPD_Receipt_Counter end
  
    // OPD Refund Of Bill Counter start
  
    optionsSearchOpdRefund: any[] = [];
    selectedOpdRefund: any;
    isOpdRefundSelected: boolean = false;
    filteredOptionsOpdRefund: Observable<string[]>;
  
    getOptionTextOpdRefund(option) {
       
      return option && option.CashCounterName ? option.CashCounterName : '';
    }
  
    getOPDRefundOfBillCounterList() {
       
      this._AdministrationService.getOPDBillingCombo().subscribe(data => {
        this.OPDRefundOfBillCounterList = data;
        this.optionsSearchOpdRefund = this.OPDRefundOfBillCounterList.slice();
        this.filteredOptionsOpdRefund = this.configFormGroup.get('OPD_Refund_Bill_CounterId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filtersearchOpdRefund(value) : this.OPDRefundOfBillCounterList.slice()),
        );
        if (this.data) {
           
          const DValue = this.OPDRefundOfBillCounterList.filter(item => item.CashCounterId == this.configObj.OPD_Refund_Bill_CounterId);
          console.log("OPD_Refund_Bill_CounterId:", DValue)
          this.configFormGroup.get('OPD_Refund_Bill_CounterId').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          return;
        }
      });
    }
  
    private _filtersearchOpdRefund(value: any): string[] {
       
      if (value) {
        const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
        return this.OPDRefundOfBillCounterList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
      }
    }
    // OPD Refund Of Bill Counter end
  
    // IPD Refund Of Bill Counter start
  
    optionsSearchRefundOfBill: any[] = [];
    selectedIpdRefundOfBillCounter: any;
    isIpdRefundOfBillCounterSelected: boolean = false;
    filteredOptionsIpdRefundOfBillCounter: Observable<string[]>;
  
    getOptionTextIpdRefundOfBillCounter(option) {
       
      return option && option.CashCounterName ? option.CashCounterName : '';
    }
  
    getIPDRefundOfBillCounterList() {
       
      this._AdministrationService.getOPDBillingCombo().subscribe(data => {
        this.IPDRefundOfBillCounterList = data;
        this.optionsSearchRefundOfBill = this.IPDRefundOfBillCounterList.slice();
        this.filteredOptionsIpdRefundOfBillCounter = this.configFormGroup.get('IPD_Refund_of_Bill_CounterId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filtersearchIpdRefundOfBill(value) : this.IPDRefundOfBillCounterList.slice()),
        );
        if (this.data) {
           
          const DValue = this.IPDRefundOfBillCounterList.filter(item => item.CashCounterId == this.configObj.IPD_Refund_of_Bill_CounterId);
          console.log("IPD_Refund_of_Bill_CounterId:", DValue)
          this.configFormGroup.get('IPD_Refund_of_Bill_CounterId').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          return;
        }
      });
    }
  
    private _filtersearchIpdRefundOfBill(value: any): string[] {
       
      if (value) {
        const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
        return this.IPDRefundOfBillCounterList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
      }
    }
    // IPD Refund Of Bill Counter end
  
    // Sales Counter start
  
    optionsSearchSalesCounter: any[] = [];
    selectedSalesCounter: any;
    isSalesCounterSelected: boolean = false;
    filteredOptionsSalesCounter: Observable<string[]>;
  
    getOptionTextSalesCounter(option) {
       
      return option && option.CashCounterName ? option.CashCounterName : '';
    }
    getPharmacySalesCounterList() {
       
      this._AdministrationService.getOPDBillingCombo().subscribe(data => {
        this.SalesList = data;
        this.optionsSearchSalesCounter = this.SalesList.slice();
        this.filteredOptionsSalesCounter = this.configFormGroup.get('PharmacySales_CounterId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterSearchSalesCounter(value) : this.SalesList.slice()),
        );
        if (this.data) {
           
          const DValue = this.SalesList.filter(item => item.CashCounterId == this.configObj.PharmacySales_CounterId);
          console.log("PharmacySales_CounterId:", DValue)
          this.configFormGroup.get('PharmacySales_CounterId').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          return;
        }
      });
    }
    private _filterSearchSalesCounter(value: any): string[] {
       
      if (value) {
        const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
        return this.SalesList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
      }
    }
    // Sales Counter end
  
    // Sales Return Counter start
  
    optionsSearchSalesReturnCounter: any[] = [];
    selectedSalesReturnCounter: any;
    isSalesReturnCounterSelected: boolean = false;
    filteredOptionsSalesReturnCounter: Observable<string[]>;
  
    getOptionTextSalesReturnCounter(option) {
       
      return option && option.CashCounterName ? option.CashCounterName : '';
    }
    getPharmacySalesReturnCounterList() {
       
      this._AdministrationService.getOPDBillingCombo().subscribe(data => {
        this.SalesReturnList = data;
        this.optionsSearchSalesReturnCounter = this.SalesReturnList.slice();
        this.filteredOptionsSalesReturnCounter = this.configFormGroup.get('PharmacySalesReturn_CounterId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterSearchSalesReturnCounter(value) : this.SalesReturnList.slice()),
        );
        if (this.data) {
           
          const DValue = this.SalesReturnList.filter(item => item.CashCounterId == this.configObj.PharmacySalesReturn_CounterId);
          console.log("PharmacySalesReturn_CounterId:", DValue)
          this.configFormGroup.get('PharmacySalesReturn_CounterId').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          return;
        }
      });
    }
    private _filterSearchSalesReturnCounter(value: any): string[] {
       
      if (value) {
        const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
        return this.SalesReturnList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
      }
    }
    // Sales Return Counter end
  
    // Sales Receipt Counter start
  
    optionsSearchSalesReceiptCounter: any[] = [];
    selectedSalesReceiptCounter: any;
    isSalesReceiptCounterSelected: boolean = false;
    filteredOptionsSalesReceiptCounter: Observable<string[]>;
  
    getOptionTextSalesReceiptCounter(option) {
       
      return option && option.CashCounterName ? option.CashCounterName : '';
    }
    getPharmacySalesReceiptCounterList() {
       
      this._AdministrationService.getOPDBillingCombo().subscribe(data => {
        this.SalesReceiptList = data;
        this.optionsSearchSalesReceiptCounter = this.SalesReceiptList.slice();
        this.filteredOptionsSalesReceiptCounter = this.configFormGroup.get('PharmacyReceipt_CounterId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterSearchSalesReceiptCounter(value) : this.SalesReceiptList.slice()),
        );
        if (this.data) {
           
          const DValue = this.SalesReceiptList.filter(item => item.CashCounterId == this.configObj.PharmacyReceipt_CounterId);
          console.log("PharmacyReceipt_CounterId:", DValue)
          this.configFormGroup.get('PharmacyReceipt_CounterId').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          return;
        }
      });
    }
    private _filterSearchSalesReceiptCounter(value: any): string[] {
       
      if (value) {
        const filterValue = value && value.CashCounterName ? value.CashCounterName.toLowerCase() : value.toLowerCase();
        return this.SalesReceiptList.filter(option => option.CashCounterName.toLowerCase().includes(filterValue));
      }
    }
    // Sales Receipt Counter end
  
    // PathDepartment start
  
    optionsSearchDepartment: any[] = [];
    selectedDepartment: any;
    isDepartmentSelected: boolean = false;
    filteredOptionsDepartment: Observable<string[]>;
  
    onDepartmentSelected(event: MatAutocompleteSelectedEvent) {
        debugger
        const selectedDepartment = event.option.value;
        if (selectedDepartment) {
          this.OnChangePathDoctorList(selectedDepartment);
        }
      }
  
    getOptionTextDepartment(option) {
      debugger
      return option && option.DepartmentName ? option.DepartmentName : '';
    }
    getPathDepartmentList() {
      debugger
      const DepControl = this.configFormGroup.get('DepartmentId');
      DepControl.setValue('');
      const templateControl = this.configFormGroup.get('DoctorId');
      templateControl.setValue('');
      this.PathDoctorList = [];
      this.filteredOptionsDoctor = null;
  
      this._AdministrationService.getPathDepartmentCombo().subscribe(data => {
        this.PathDepartmentList = data;
        this.optionsSearchDepartment = this.PathDepartmentList.slice();
        this.filteredOptionsDepartment = this.configFormGroup.get('DepartmentId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterSearchDepartment(value) : this.PathDepartmentList.slice()),
        );
        if (this.data) {
          debugger
          const DValue = this.PathDepartmentList.filter(item => item.DepartmentId == this.configObj.PathDepartment);
          console.log("DepartmentId:", DValue)
          this.configFormGroup.get('DepartmentId').setValue(DValue[0]);
          this.configFormGroup.updateValueAndValidity();
          this.OnChangePathDoctorList(DValue[0]);
          return;
        }
      });
    }
    private _filterSearchDepartment(value: any): string[] {
      debugger
      if (value) {
        const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
        return this.PathDepartmentList.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
      }
    }
    // PathDepartment end
  
    // PathDoctor start
  
    optionsSearchDoctor: any[] = [];
    selectedDoctor: any;
    isDoctorSelected: boolean = false;
    filteredOptionsDoctor: Observable<string[]>;
    selectedDoctorOption: any;
  
    onDoctorSelect(option: any) {
      debugger
      console.log("selectedDoctorOption:", option)
    }
  
    getOptionTextDoctor(option) {
      debugger
      return option && option.Doctorname ? option.Doctorname : '';
    }
  
    // getPathDoctorList() {
    //   debugger
    //   this._AdministrationService.getPathologistDoctorCombo().subscribe(data => {
    //     this.PathDoctorList = data;
    //     this.optionsSearchDoctor = this.PathDoctorList.slice();
    //     this.filteredOptionsDoctor = this.configFormGroup.get('DoctorId').valueChanges.pipe(
    //       startWith(''),
    //       map(value => value ? this._filterSearchDoctor(value) : this.PathDoctorList.slice()),
    //     );
    //     if (this.data) {
    //       debugger
    //       const DValue = this.PathDoctorList.filter(item => item.DoctorId == this.configObj.IsPathologistDr);
    //       console.log("DoctorId:", DValue)
    //       this.configFormGroup.get('DoctorId').setValue(DValue[0]);
    //       this.configFormGroup.updateValueAndValidity();
    //       return;
    //     }
    //   });
    // }
  
    OnChangePathDoctorList(departmentObj) {
      debugger
      console.log(departmentObj)
  
      const templateControl = this.configFormGroup.get('DoctorId');
  
      templateControl.setValue('');
      this.PathDoctorList = [];
      this.filteredOptionsDoctor = null;
      this.isDepartmentSelected = true;
  
      var vdata = {
        "Id": departmentObj.DepartmentId
      }
  
      this.isDepartmentSelected = true;
      this._AdministrationService.getPathologistDoctorCombo(vdata).subscribe(
        data => {
          this.PathDoctorList = data;
          console.log(this.PathDoctorList)
          this.optionsSearchDoctor = this.PathDoctorList.slice();
          this.filteredOptionsDoctor = this.configFormGroup.get('DoctorId').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterSearchDoctor(value) : this.PathDoctorList.slice()),
          );
          if (this.configObj) {
            debugger
            const dVaule = this.PathDoctorList.filter(item => item.DoctorId == this.configObj.IsPathologistDr)
            this.configFormGroup.get('DoctorId').setValue(dVaule[0])
          }
          console.log("doctor ndfkdf:", this.configFormGroup.get('DoctorId').value)
        })
    }
  
    private _filterSearchDoctor(value: any): string[] {
      debugger
      if (value) {
        const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
        return this.PathDoctorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
      }
    }
    // PathDoctor end
  
  
  }
  