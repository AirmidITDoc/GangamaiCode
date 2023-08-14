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

  PathDoctorList:any=[];
  PathDepartmentList:any=[];
  SalesReceiptList:any=[];
  PatientTypeList: any = [];
  SalesReturnList:any=[];
  SalesList:any=[]
  OPDBillingList: any = [];
  IPDBillingList:any=[];
  OPDReceiptCounterList :any =[];
  OPDRefundOfBillCounterList :any =[];
  IPDRefundOfBillCounterList :any =[];
  IPDRefundOfAdvanceCounterList :any =[];
  IPDAdvanceCounterList:any=[];
  IPDReceiptCounterList :any =[];
  configFormGroup: FormGroup;
  configObj = new ConfigSettingParams({});
  isLoading: string = '';
  Charges:any=false;
  PopPayBill:any=false;
  GenerateOPBill:any=false;
  PrintAdm:any=false;
  PrintOPDVisit:any=false;
  PrintReg:any=false;
  FirstName:any=false;
  MiddleName:any=false;
  LastName:any=false;
  PhoneNo:any=false;
  Address:any=false;
  City:any=false;
  Age:any=false;
  ClassEdit:any=false;


  public oPDBillingFilterCtrl: FormControl = new FormControl();
  public filteredOPDCounter: ReplaySubject<any> = new ReplaySubject<any>(1);

//OPD REFUND OF BILL filter
public opdRefundOfBillFilterCtrl: FormControl = new FormControl();
public filteredOpdRefundBill: ReplaySubject<any> = new ReplaySubject<any>(1);


//OPD Receipt Counterfilter
public oPDReceiptFilterCtrl: FormControl = new FormControl();
public filteredReceipt: ReplaySubject<any> = new ReplaySubject<any>(1);

//IPD Advance Counterfilter
public iPDAdvanceFilterCtrl: FormControl = new FormControl();
public filteredIPDAdvance: ReplaySubject<any> = new ReplaySubject<any>(1);

//IPD Billing Counterfilter
public iPDBillingFilterCtrl: FormControl = new FormControl();
public filteredIPDBilling: ReplaySubject<any> = new ReplaySubject<any>(1);

//IPD Receipt Counterfilter
public iPDReceiptFilterCtrl: FormControl = new FormControl();
public filteredIPDReceipt: ReplaySubject<any> = new ReplaySubject<any>(1);
 
//IPD REFUND OF BILL filter
public ipdRefundOfBillFilterCtrl: FormControl = new FormControl();
public filteredIpdRefundBill: ReplaySubject<any> = new ReplaySubject<any>(1);

//IPD REFUND OF Advance filter
public ipdRefundOfAdvanceFilterCtrl: FormControl = new FormControl();
public filteredIpdRefundOfAdvance: ReplaySubject<any> = new ReplaySubject<any>(1);
//Sales filter
public pharmacySalesFilterCtrl: FormControl = new FormControl();
public filteredPharmacySales: ReplaySubject<any> = new ReplaySubject<any>(1);

//Sales Return filter
public pharmacySalesReturnFilterCtrl: FormControl = new FormControl();
public filteredPharmacySalesReturn: ReplaySubject<any> = new ReplaySubject<any>(1);

public pharmacySalesReceiptFilterCtrl: FormControl = new FormControl();
public filteredPharmacySalesReceipt: ReplaySubject<any> = new ReplaySubject<any>(1);

public pathDepartmentFilterCtrl: FormControl = new FormControl();
public filteredPathDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

public pathDoctorFilterCtrl: FormControl = new FormControl();
public filteredPathDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();
  constructor(   public _matDialog: MatDialog,
    public _AdministrationService: AdministrationService,
    public dialogRef: MatDialogRef<NewConfigurationComponent>,
    private formBuilder: FormBuilder,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.configFormGroup = this.createconfigForm();
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
    this.getPathDoctorList();


    this.opdRefundOfBillFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterOpdRefundOfBill();
    });


    this.oPDBillingFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterOCounter();
      });

      //OPD Receipt Counterfilter
      this.oPDReceiptFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterReceiptCounter();
      });

      //IPD Advance 
      this.iPDAdvanceFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterIPDAdvanceCounter();
      });

      //IPD Billing
      this.iPDBillingFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterIPDBillingCounter();
      });

       //IPD Receipt
       this.iPDReceiptFilterCtrl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
         this.filterIPDReceiptCounter();
       });

       this.ipdRefundOfBillFilterCtrl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
         this.filteripdRefundOfBill();
       });
       
       //IPD refund Of Advance

       this.ipdRefundOfAdvanceFilterCtrl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
         this.filteripdRefundOfAdvance();
       });

       this.pharmacySalesFilterCtrl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
         this.filterpharmacySales();
       });

       this.pharmacySalesReturnFilterCtrl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
         this.filterpharmacySalesReturn();
       });

       this.pharmacySalesReceiptFilterCtrl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
         this.filterpharmacySalesReceipt();
       });

       this.pathDepartmentFilterCtrl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
         this.filterpathDepartment();
       });

       this.pathDoctorFilterCtrl.valueChanges
       .pipe(takeUntil(this._onDestroy))
       .subscribe(() => {
         this.filterpathDoctor();
       });

       if (this.data) {
        this.configObj = this.data.configObj;
        console.log( this.configObj);
        //  this.setDropdownObjs();
      }
      


      if(this.configObj.OTCharges){
      this.configFormGroup.get('Charges').setValue(true);     
     }else{
      this.configFormGroup.get('Charges').setValue(false); 
     }


     if(this.configObj.PopPayAfterOPBill){
      this.configFormGroup.get('PopPayBill').setValue(true);     
     }else{
      this.configFormGroup.get('PopPayBill').setValue(false); 
     }

     
     if(this.configObj.GenerateOPBillInCashOption){
      this.configFormGroup.get('GenerateOPBill').setValue(true);     
     }else{
      this.configFormGroup.get('GenerateOPBill').setValue(false); 
     }

     if(this.configObj.PrintRegAfterReg){
      this.configFormGroup.get('PrintReg').setValue(true);     
     }else{
      this.configFormGroup.get('PrintReg').setValue(false); 
     }

     if(this.configObj.PrintOPDCaseAfterVisit){
      this.configFormGroup.get('PrintOPDVisit').setValue(true);     
     }else{
      this.configFormGroup.get('PrintOPDVisit').setValue(false); 
     }

     if(this.configObj.PrintIPDAfterAdm){
      this.configFormGroup.get('PrintAdm').setValue(true);     
     }else{
      this.configFormGroup.get('PrintAdm').setValue(false); 
     }



     if(this.configObj.MandatoryFirstName){
      this.configFormGroup.get('FirstName').setValue(true);     
     }else{
      this.configFormGroup.get('FirstName').setValue(false); 
     }


     if(this.configObj.MandatoryMiddleName){
      this.configFormGroup.get('MiddleName').setValue(true);     
     }else{
      this.configFormGroup.get('MiddleName').setValue(false); 
     }


     if(this.configObj.MandatoryLastName){
      this.configFormGroup.get('LastName').setValue(true);     
     }else{
      this.configFormGroup.get('LastName').setValue(false); 
     }


     if(this.configObj.MandatoryAddress){
      this.configFormGroup.get('Address').setValue(true);     
     }else{
      this.configFormGroup.get('Address').setValue(false); 
     }


     if(this.configObj.MandatoryCity){
      this.configFormGroup.get('City').setValue(true);     
     }else{
      this.configFormGroup.get('City').setValue(false); 
     }

     if(this.configObj.MandatoryPhoneNo){
      this.configFormGroup.get('PhoneNo').setValue(true);     
     }else{
      this.configFormGroup.get('PhoneNo').setValue(false); 
     }

     if(this.configObj.MandatoryAge){
      this.configFormGroup.get('Age').setValue(true);     
     }else{
      this.configFormGroup.get('Age').setValue(false); 
     }

     if(this.configObj.ClassForEdit){
      this.configFormGroup.get('ClassEdit').setValue(true);     
     }else{
      this.configFormGroup.get('ClassEdit').setValue(false); 
     }
   
     
     setTimeout(function(){
      let element:HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
      element.click();
    }, 1000);
    
  }

  private filterOCounter() {

    if (!this.OPDBillingList) {
      return;
    }
    // get the search keyword
    let search = this.oPDBillingFilterCtrl.value;
    if (!search) {
      this.filteredOPDCounter.next(this.OPDBillingList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredOPDCounter.next(
      this.OPDBillingList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
    );

  }
  
  private filterOpdRefundOfBill() {

    if (!this.OPDRefundOfBillCounterList) {
      return;
    }
    // get the search keyword
    let search = this.opdRefundOfBillFilterCtrl.value;
    if (!search) {
      this.filteredOpdRefundBill.next(this.OPDRefundOfBillCounterList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredOpdRefundBill.next(
      this.OPDRefundOfBillCounterList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
    );

  }

//OPD Receipt Counterfilter
  private filterReceiptCounter() {

    if (!this.OPDReceiptCounterList) {
      return;
    }
    // get the search keyword
    let search = this.oPDReceiptFilterCtrl.value;
    if (!search) {
      this.filteredReceipt.next(this.OPDReceiptCounterList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredReceipt.next(
      this.OPDReceiptCounterList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
    );

  }
  
  //IPD Advance 
  private filterIPDAdvanceCounter() {

    if (!this.IPDAdvanceCounterList) {
      return;
    }
    // get the search keyword
    let search = this.iPDAdvanceFilterCtrl.value;
    if (!search) {
      this.filteredIPDAdvance.next(this.IPDAdvanceCounterList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredIPDAdvance.next(
      this.IPDAdvanceCounterList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
    );

  }

//IPD Billing
private filterIPDBillingCounter() {

  if (!this.IPDBillingList) {
    return;
  }
  // get the search keyword
  let search = this.iPDBillingFilterCtrl.value;
  if (!search) {
    this.filteredIPDBilling.next(this.IPDBillingList.slice());
    return;
  }
  else {
    search = search.toLowerCase();
  }
  // filter
  this.filteredIPDBilling.next(
    this.IPDBillingList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
  );

}


//IPD Receipt
private filterIPDReceiptCounter() {

  if (!this.IPDReceiptCounterList) {
    return;
  }
  // get the search keyword
  let search = this.iPDReceiptFilterCtrl.value;
  if (!search) {
    this.filteredIPDReceipt.next(this.IPDReceiptCounterList.slice());
    return;
  }
  else {
    search = search.toLowerCase();
  }
  // filter
  this.filteredIPDReceipt.next(
    this.IPDReceiptCounterList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
  );

}


private filteripdRefundOfBill() {

  if (!this.IPDRefundOfBillCounterList) {
    return;
  }
  // get the search keyword
  let search = this.ipdRefundOfBillFilterCtrl.value;
  if (!search) {
    this.filteredIpdRefundBill.next(this.IPDRefundOfBillCounterList.slice());
    return;
  }
  else {
    search = search.toLowerCase();
  }
  // filter
  this.filteredIpdRefundBill.next(
    this.IPDRefundOfBillCounterList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
  );

}



private filteripdRefundOfAdvance() {

  if (!this.IPDRefundOfAdvanceCounterList) {
    return;
  }
  // get the search keyword
  let search = this.ipdRefundOfBillFilterCtrl.value;
  if (!search) {
    this.filteredIpdRefundOfAdvance.next(this.IPDRefundOfAdvanceCounterList.slice());
    return;
  }
  else {
    search = search.toLowerCase();
  }
  // filter
  this.filteredIpdRefundOfAdvance.next(
    this.IPDRefundOfAdvanceCounterList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
  );

}

private filterpharmacySales() {

  if (!this.SalesList) {
    return;
  }
  // get the search keyword
  let search = this.pharmacySalesFilterCtrl.value;
  if (!search) {
    this.filteredPharmacySales.next(this.SalesList.slice());
    return;
  }
  else {
    search = search.toLowerCase();
  }
  // filter
  this.filteredPharmacySales.next(
    this.SalesList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
  );

}
private filterpharmacySalesReturn() {

  if (!this.SalesReturnList) {
    return;
  }
  // get the search keyword
  let search = this.pharmacySalesReturnFilterCtrl.value;
  if (!search) {
    this.filteredPharmacySalesReturn.next(this.SalesReturnList.slice());
    return;
  }
  else {
    search = search.toLowerCase();
  }
  // filter
  this.filteredPharmacySalesReturn.next(
    this.SalesReturnList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
  );

}


private filterpharmacySalesReceipt() {

  if (!this.SalesReceiptList) {
    return;
  }
  // get the search keyword
  let search = this.pharmacySalesReceiptFilterCtrl.value;
  if (!search) {
    this.filteredPharmacySalesReceipt.next(this.SalesReceiptList.slice());
    return;
  }
  else {
    search = search.toLowerCase();
  }
  // filter
  this.filteredPharmacySalesReceipt.next(
    this.SalesReceiptList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
  );

}


private filterpathDepartment() {

  if (!this.PathDepartmentList) {
    return;
  }
  // get the search keyword
  let search = this.pathDepartmentFilterCtrl.value;
  if (!search) {
    this.filteredPathDepartment.next(this.PathDepartmentList.slice());
    return;
  }
  else {
    search = search.toLowerCase();
  }
  // filter
  this.filteredPathDepartment.next(
    this.PathDepartmentList.filter(bank => bank.CashCounterName.toLowerCase().indexOf(search) > -1)
  );

}
private filterpathDoctor() {

  if (!this.PathDoctorList) {
    return;
  }
  // get the search keyword
  let search = this.pathDoctorFilterCtrl.value;
  if (!search) {
    this.filteredPathDoctor.next(this.PathDoctorList.slice());
    return;
  }
  else {
    search = search.toLowerCase();
  }
  // filter
  this.filteredPathDoctor.next(
    this.PathDoctorList.filter(bank => bank.Doctorname.toLowerCase().indexOf(search) > -1)
  );

}

  createconfigForm() {
    return this.formBuilder.group({
      Charges:0,
      PopPayBill:0,
      GenerateOPBill:0,
      PrintAdm:0,
      PrintOPDVisit:0,
      PrintReg:0,
      FirstName:0,
      MiddleName:0,
      LastName:0,
      PhoneNo:0,
      Address:0,
      City:0,
      Age:0,
      ClassEdit:0,
      OPD_Billing_Counter:'',

      ConfigId:'',
      PrintRegAfterReg:'',
      PDPrefix:'',
      OTCharges: '',
      PrintOPDCaseAfterVisit: '',
      PrintIPDAfterAdm:'',
      PopOPBillAfterVisit: '',
      PopPayAfterOPBill: '',
      GenerateOPBillInCashOption: '',
      MandatoryFirstName:'',
      MandatoryMiddleName: '',
      MandatoryLastName: '',
      MandatoryAddress: '',
      MandatoryCity:'',
      MandatoryAge: '',
      MandatoryPhoneNo: '',
      CashCounterId:'',
      OPBillCounter: '',
      OPReceiptCounter:'',
      OPRefundOfBillCounter: '',
      IPAdvanceCounter: '',
      IPBillCounter: '',
      IPReceiptCounter:'',
      IPRefundBillCounter: '',
      IPRefofAdvCounter:'',
      RegPrefix:'',
      RegNo: '',
      IPPrefix: '',
      IPNo: '',
      OPPrefix: '',
      OPNo:'',
      PathDepartment:'',
      IsPathologistDr: '',
      OPD_Billing_CounterId:'',
      OPD_Receipt_CounterId: '',
      OPD_Refund_Bill_CounterId:'',
      OPD_Advance_CounterId: '',
      OPD_Refund_Advance_CounterId: '',
      IPD_Advance_CounterId:'',
      IPD_Billing_CounterId: '',
      IPD_Receipt_CounterId: '',
      IPD_Refund_of_Bill_CounterId: '',
      IPD_Refund_of_Advance_CounterId: '',
      PatientTypeSelf: '',
      ClassForEdit: '',
      PatientTypeId: '',
      PharmacySales_CounterId: '',
      PharmacySalesReturn_CounterId:'',
      PharmacyReceipt_CounterId:'',
      ChkPharmacyDue:'',
      G_IsPharmacyPaperSetting:'',
      PharmacyPrintName:'',
      G_PharmacyPaperName:'',
      G_IsOPPaperSetting:'',
      G_PharmacyPrintName: '',
      G_OPPaperName: '',
      DepartmentId: '',
      DoctorId: '',
      G_IsIPPaperSetting:'',
      G_IPPaperName: '',
      G_OPPrintName:'',
      IsOPSaleDisPer:'',
      OPSaleDisPer: '',
      IsIPSaleDisPer: '',
      IPSaleDisPer:'',
      PatientTypeID:'',
     
    });
  }

  onClose() {
  
    this.dialogRef.close();
  }




  




  onSubmit() {
    let reg = this.configObj.ConfigId;
    this.isLoading = 'submit';
    if(this.configFormGroup.get('PrintReg').value)
    var pr=1; else pr=0;

    if(this.configFormGroup.get('OTCharges').value)
    var otc=1; else otc=0;

    if(this.configFormGroup.get('PrintOPDVisit').value)
    var pov=1; else pov=0;
    if(this.configFormGroup.get('PrintAdm').value)
    var pa=1; else pa=0;
    if(this.configFormGroup.get('PopPayBill').value)
    var ppb=1; else ppb=0;
    if(this.configFormGroup.get('GenerateOPBill').value)
    var gpb=1; else gpb=0;
    if(this.configFormGroup.get('FirstName').value)
    var fn=1; else fn=0;
    if(this.configFormGroup.get('MiddleName').value)
    var mn=1; else mn=0;

    if(this.configFormGroup.get('LastName').value)
    var ln=1; else ln=0;

    if(this.configFormGroup.get('Address').value)
    var ad=1; else ad=0;
    if(this.configFormGroup.get('City').value)
    var c=1; else c=0;
    if(this.configFormGroup.get('Age').value)
    var ag=1; else ag=0;

    if(this.configFormGroup.get('PhoneNo').value)
    var ph=1; else ph=0;



    debugger;
      var m_data = {

        "configsettingupdate": {
          "ConfigId": this.configObj.ConfigId,// this._registerService.mySaveForm.get("RegId").value || 0,
          "PrintRegAfterReg": pr,// this.configFormGroup.get('PrintReg').value,
          "ipdPrefix": this.configFormGroup.get('IPPrefix').value || "",
          "OTCharges":otc,// this.configFormGroup.get('OTCharges').value|| "",
          "printOPDCaseAfterVisit":pov,//  this.configFormGroup.get('PrintOPDVisit').value || 0,
          "printIPDAfterAdm": pa,//this.configFormGroup.get('PrintAdm').value || 0,
          "popOPBillAfterVisit":1,// this.configFormGroup.get('PopPayBill').value || 0,
          "popPayAfterOPBill": ppb,// this.configFormGroup.get('PrintRegAfterReg').value || 0,
          "generateOPBillInCashOption":gpb,//  this.configFormGroup.get('GenerateOPBill').value || 0,
          "MandatoryFirstName":fn,// this.configFormGroup.get('FirstName').value || '',
          "MandatoryLastName":ln,//  this.configFormGroup.get('LastName').value || '',
          "MandatoryMiddleName":mn,// this.configFormGroup.get('MiddleName').value || '',
          "MandatoryAddress":ad,//  this.configFormGroup.get('Address').value,
          "MandatoryCity": c,// this.configFormGroup.get('City').value,
          "MandatoryAge":ag,// this.configFormGroup.get('Age').value,
          "MandatoryPhoneNo": ph,//this.pharmacySalesFilterCtrl,// this.configFormGroup.get('PhoneNo').value,

          "opD_Billing_CounterId": this.configFormGroup.get('OPD_Billing_CounterId').value.CashCounterId ,
          "opD_Receipt_CounterId":this.configFormGroup.get('OPD_Receipt_CounterId').value.CashCounterId ,
          "opD_Refund_Bill_CounterId": this.configFormGroup.get('OPD_Refund_Bill_CounterId').value.CashCounterId,
          "opD_Advance_CounterId":this.configObj.OPD_Advance_CounterId,
          "opD_Refund_Advance_CounterId": 0,
          "ipD_Advance_CounterId":this.configFormGroup.get('IPD_Advance_CounterId').value.CashCounterId || 0,
          "ipD_Billing_CounterId":this.configFormGroup.get('IPD_Billing_CounterId').value.CashCounterId || 0,
          "ipD_Receipt_CounterId":this.configFormGroup.get('IPD_Receipt_CounterId').value.CashCounterId || 0,
          "ipD_Refund_of_Bill_CounterId": this.configFormGroup.get('IPD_Refund_of_Bill_CounterId').value.CashCounterId || 0,
          "ipD_Refund_of_Advance_CounterId":this.configFormGroup.get('IPD_Refund_of_Advance_CounterId').value.CashCounterId || 0,

          "regPrefix": this.configObj.RegPrefix || "",
          "ipPrefix":this.configFormGroup.get('IPPrefix').value || "",
          "opPrefix":this.configFormGroup.get('OPPrefix').value || "",
          "pathDepartment": this.configFormGroup.get('DepartmentId').value.DepartmentId,
          "isPathologistDr":  this.configObj.IsPathologistDr,// this.configFormGroup.get('isPathologistDr').value,
          "patientTypeSelf":this.configFormGroup.get('PatientTypeID').value.PatientTypeId ,
          "salesCounterId": this.configFormGroup.get('PharmacySales_CounterId').value.CashCounterId,
          "salesReturnCounterId": this.configFormGroup.get('PharmacySalesReturn_CounterId').value.CashCounterId || 0,
          "salesReceiptCounterID": this.configFormGroup.get('PharmacyReceipt_CounterId').value.CashCounterId || 0,
          "classForEdit": this.configObj.ClassForEdit || 0,

        }
      }
      console.log(m_data);
      this._AdministrationService.ConfigUpdate(m_data).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'Configuration Data Updated Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
            }
          });
        } else {
          Swal.fire('Error !', 'Configuration Data  not saved', 'error');
        }

      });
    
  }


setDropdownObjs() {
debugger;
    const toSelect = this.OPDBillingList.find(c => c.CashCounterId == this.configObj.OPD_Billing_CounterId);
    this.configFormGroup.get('OPD_Billing_CounterId').setValue(toSelect);

    const toSelect1 = this.OPDReceiptCounterList.find(c => c.CashCounterId == this.configObj.OPD_Receipt_CounterId);
    this.configFormGroup.get('OPD_Receipt_CounterId').setValue(toSelect1);

    const toSelect2= this.OPDRefundOfBillCounterList.find(c => c.CashCounterId == this.configObj.OPD_Refund_Bill_CounterId);
    this.configFormGroup.get('OPD_Refund_Bill_CounterId').setValue(toSelect2);

    const toSelect3 = this.IPDAdvanceCounterList.find(c => c.CashCounterId == this.configObj.IPD_Advance_CounterId);
    this.configFormGroup.get('IPD_Advance_CounterId').setValue(toSelect3);

    const toSelect4 = this.IPDBillingList.find(c => c.CashCounterId == this.configObj.IPD_Billing_CounterId);
    this.configFormGroup.get('IPD_Billing_CounterId').setValue(toSelect4);

    const toSelect5 = this.IPDReceiptCounterList.find(c => c.CashCounterId == this.configObj.IPD_Receipt_CounterId);
    this.configFormGroup.get('IPD_Receipt_CounterId').setValue(toSelect5);

    const toSelect7 = this.IPDRefundOfBillCounterList.find(c => c.CashCounterId == this.configObj.IPD_Refund_of_Bill_CounterId);
    this.configFormGroup.get('IPD_Refund_of_Bill_CounterId').setValue(toSelect7);

    const toSelect8 = this.IPDRefundOfAdvanceCounterList.find(c => c.CashCounterId == this.configObj.IPD_Refund_of_Advance_CounterId);
    this.configFormGroup.get('IPD_Refund_of_Advance_CounterId').setValue(toSelect8);

    const toSelect9 = this.PathDepartmentList.find(c => c.DepartmentId == this.configObj.PathDepartment);
    this.configFormGroup.get('DepartmentId').setValue(toSelect9);

    const toSelect10 = this.PathDoctorList.find(c => c.DoctorId == this.configObj.DoctorId);
    this.configFormGroup.get('DoctorId').setValue(toSelect10);


    const toSelect11 = this.SalesList.find(c => c.CashCounterId == this.configObj.PharmacySales_CounterId);
    this.configFormGroup.get('PharmacySales_CounterId').setValue(toSelect11);

    const toSelect12 = this.SalesReturnList.find(c => c.CashCounterId == this.configObj.PharmacySalesReturn_CounterId);
    this.configFormGroup.get('PharmacySalesReturn_CounterId').setValue(toSelect12);

    const toSelect13 = this.SalesReceiptList.find(c => c.CashCounterId == this.configObj.PharmacySalesReturn_CounterId);
    this.configFormGroup.get('PharmacyReceipt_CounterId').setValue(toSelect13);

    const toSelect14 = this.PatientTypeList.find(c => c.PatientTypeId == this.configObj.PatientTypeSelf);
    this.configFormGroup.get('PatientTypeID').setValue(toSelect14);

    // this.configFormGroup.updateValueAndValidity();
  }
 
   getOPDBillingList() {
    this._AdministrationService.getOPDBillingCombo().subscribe(data => { this.OPDBillingList = data; 
      this.filteredOPDCounter.next(this.OPDBillingList.slice());
    })
  }

  getOPDRefundOfBillCounterList() {
    this._AdministrationService.getOPDBillingCombo().subscribe(data => { this.OPDRefundOfBillCounterList = data; 
      this.filteredOpdRefundBill.next(this.OPDRefundOfBillCounterList.slice());
    })
  }
  getIPDAdvanceCounterList(){
    this._AdministrationService.getOPDBillingCombo().subscribe(data => { this.IPDAdvanceCounterList = data; 
      this.filteredIPDAdvance.next(this.IPDAdvanceCounterList.slice());
    })
  }

  getOPDReceiptCounterList(){
    this._AdministrationService.getOPDBillingCombo().subscribe(data => { this.OPDReceiptCounterList = data; 
      this.filteredReceipt.next(this.OPDReceiptCounterList.slice());
    })
  }

  getIPDBillingCounterList(){
    this._AdministrationService.getOPDBillingCombo().subscribe(data => { this.IPDBillingList = data; 
      this.filteredIPDBilling.next(this.IPDBillingList.slice());
    })
  }

  getIPDReceiptCounterList(){
    this._AdministrationService.getOPDBillingCombo().subscribe(data => { this.IPDReceiptCounterList = data; 
      this.filteredIPDReceipt.next(this.IPDReceiptCounterList.slice());
    })
  }

  getIPDRefundOfAdvanceCounterList(){
    this._AdministrationService.getOPDBillingCombo().subscribe(data => { this.IPDRefundOfAdvanceCounterList = data; 
      this.filteredIpdRefundOfAdvance.next(this.IPDRefundOfAdvanceCounterList.slice());
    })
  }
  
 
 
  getPatientTypeList() {
    this._AdministrationService.getPatientTypeCombo().subscribe(data => {
      this.PatientTypeList = data;
      this.configFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
    })
  }

  getIPDRefundOfBillCounterList() {
    this._AdministrationService.getOPDBillingCombo().subscribe(data => { this.IPDRefundOfBillCounterList = data; 
      this.filteredIpdRefundBill.next(this.IPDRefundOfBillCounterList.slice());
    })
  }

  
  getPharmacySalesCounterList() {
    this._AdministrationService.getOPDBillingCombo().subscribe(data => { this.SalesList = data; 
      this.filteredPharmacySales.next(this.SalesList.slice());
    })
  }

  getPharmacySalesReturnCounterList()
  {
    this._AdministrationService.getOPDBillingCombo().subscribe(data => { this.SalesReturnList = data; 
      this.filteredPharmacySalesReturn.next(this.SalesReturnList.slice());
    })
  }

  getPharmacySalesReceiptCounterList()
  {
    this._AdministrationService.getOPDBillingCombo().subscribe(data => { this.SalesReceiptList = data; 
      this.filteredPharmacySalesReceipt.next(this.SalesReceiptList.slice());
    })
  }

  getPathDepartmentList()
  {
    this._AdministrationService.getPathDepartmentCombo().subscribe(data => { this.PathDepartmentList = data; 
      this.filteredPathDepartment.next(this.PathDepartmentList.slice());
    })
  }

  getPathDoctorList()
  {
    this._AdministrationService.getPathologistDoctorCombo().subscribe(data => { this.PathDoctorList = data; 
      this.filteredPathDoctor.next(this.PathDoctorList.slice());
    })
  }


}
