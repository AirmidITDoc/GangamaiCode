import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormGroup, FormBuilder } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BrowsSalesBillService } from '../../brows-sales-bill/brows-sales-bill.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalesReturnBillSettlementService } from '../sales-return-bill-settlement.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import Swal from 'sweetalert2';
import { UserDetail } from 'app/main/administration/create-user/nuser/nuser.component';

@Component({
  selector: 'app-discount-after-final-bill',
  templateUrl: './discount-after-final-bill.component.html',
  styleUrls: ['./discount-after-final-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DiscountAfterFinalBillComponent implements OnInit {

  MyFrom:FormGroup; 
   saveform:FormGroup; 
  selectedAdvanceObj:any
  vNetamount:any;
  vTotalAmount:any;
  vDiscAmount:any;
  vDiscountPer2:any;
  vDiscAmount2:any;
  vFinalDiscAmt:any;
  vFinalNetAmt:any;  
  PatientObj:any;
  patientName:any;
  
  autocompleteModeConcession: string = "Concession";

  constructor(
   private formBuilder: FormBuilder,  
   public _formvalidationservice : FormvalidationserviceService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,
    public toastr: ToastrService,  
    public dialogRef: MatDialogRef<DiscountAfterFinalBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public _SelseSettelmentservice: SalesReturnBillSettlementService, 
  ) { }   
  ngOnInit(): void { 
    if(this.data){
      this.selectedAdvanceObj = this.data.Obj
      this.PatientObj = this.data.PatientObj
      console.log(this.selectedAdvanceObj)
      this.patientName  = this.PatientObj.firstName+' '+this.PatientObj.middleName+' '+this.PatientObj.lastName
      this.vDiscAmount = Math.round(this.selectedAdvanceObj.discAmount);
      this.vTotalAmount =  Math.round(this.selectedAdvanceObj.totalAmount);
      this.vFinalNetAmt =  Math.round(this.selectedAdvanceObj.netAmount)
      this.vNetamount =  Math.round(this.selectedAdvanceObj.netAmount)
      this.vFinalDiscAmt =  Math.round(this.selectedAdvanceObj.discAmount); 
    } 
     this.MyFrom = this.CreateMyForm();
     this.saveform = this.CreatesaveMyForm();  
     this.getAccessDetail();
  }
  CreateMyForm():FormGroup{
    return this.formBuilder.group({
      NetAmount:[''],
      TotalAmount:[''],
      DiscAmount:[''],
      DiscountPer2:[''],
      DiscAmount2:[''],
      FinalDiscAmt:[''],
      FinalNetAmt:[''], 
      ConcessionId:[''] 
    });
  }  
    CreatesaveMyForm(): FormGroup { 
      return this.formBuilder.group({  
       salesId:[0,[this._formvalidationservice.notEmptyOrZeroValidator()]],
      netAmount:[0,[this._formvalidationservice.AllowDecimalNumberValidator(),this._formvalidationservice.notEmptyOrZeroValidator()]],
      discAmount:[0,[this._formvalidationservice.AllowDecimalNumberValidator()]],
       balanceAmount:[ 0,[this._formvalidationservice.AllowDecimalNumberValidator()]],
      concessionReasonId:[0,[this._formvalidationservice.notEmptyOrZeroValidator()]] 
      });
    }  
  CalcDiscPer(){  
    debugger
    let DiscAmt2; 
    let DiscPer2 = this.MyFrom.get('DiscountPer2').value || 0; 

    if(DiscPer2){
          if (this.UserDicPerLimit > 0) {
            const discper = this.MyFrom.get("DiscountPer2")?.value;
            if (+discper > +this.UserDicPerLimit) {
              Swal.fire({
                icon: 'warning',
                title: 'Discount Limit Exceeded',
                text: `Maximum allowed discount is ${this.UserDicPerLimit}%`,
                confirmButtonColor: '#d33'
              });
              this.MyFrom.get("DiscountPer2").setValue(this.UserDicPerLimit);
              DiscPer2 = this.MyFrom.get('DiscountPer2').value || 0; 
            }
          }  

      if(DiscPer2 > 100){
        this.toastr.warning('Please enter discount % less than 100 and greater than 0', 'warning !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        return  this.vDiscountPer2 = '';
      }
      else{
        this.vDiscAmount2 = ((parseFloat(this.vFinalNetAmt) * parseFloat(DiscPer2)) / 100).toFixed(2) || 0; 
        DiscAmt2 = this.vDiscAmount2;
      } 
    }else{
      if(DiscPer2 == 0 || DiscPer2 == '' || DiscPer2 == null || DiscPer2 == undefined){ 
        this.vDiscAmount2 = ''; 
        DiscAmt2 = 0;
      }
    }

  
    this.vFinalDiscAmt = Math.round(parseFloat(DiscAmt2)  + parseFloat(this.vDiscAmount));
    this.vNetamount = Math.round(parseFloat(this.vTotalAmount) - parseFloat( this.vFinalDiscAmt)).toFixed(2);
  }
  CalcDiscAmt() {
    debugger
    let DiscAmt2 = this.MyFrom.get('DiscAmount2').value || 0; 
    let DiscPer2; 

    if (DiscAmt2) {
      if (DiscAmt2 > this.vFinalNetAmt) {
        this.toastr.warning('Please enter discount amount less than net Amount and greater than 0', 'warning !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        return this.vDiscAmount2 = '';
      }
      else {
        this.vDiscountPer2 = ((parseFloat(DiscAmt2) / parseFloat(this.vFinalNetAmt)) * 100).toFixed(2) || 0;
        DiscPer2 = this.vDiscountPer2;
      }
    } else {
      if (DiscAmt2 == 0 || DiscAmt2 == '' || DiscAmt2 == null || DiscAmt2 == undefined) {
        this.vDiscountPer2 = '';
        DiscPer2 = 0;
      }
    }

    
    this.vFinalDiscAmt = Math.round(parseFloat(DiscAmt2) + parseFloat(this.vDiscAmount));
    this.vNetamount = Math.round(parseFloat(this.vTotalAmount) - parseFloat(this.vFinalDiscAmt)).toFixed(2);
  }  
  OnSave() {
    const formvalues = this.MyFrom.value
    if (formvalues.DiscAmount2 > 0) {
      if (!this.MyFrom.get('ConcessionId').value) {
        this.toastr.warning('Please select Concession Reason ', 'warning !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        return
      }
    }
    if (formvalues.NetAmount == 0 || formvalues.NetAmount == '' || formvalues.NetAmount == undefined || formvalues.NetAmount == null) {
      this.toastr.warning('Please check final netamount is zero', 'warning !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
      return
    } 

    let BalAmt = this.selectedAdvanceObj?.balanceAmount
    if(formvalues?.DiscAmount2 > 0){
      BalAmt = formvalues?.NetAmount   
    } 

    this.saveform.get('salesId').setValue( this.selectedAdvanceObj?.salesId)
    this.saveform.get('netAmount').setValue(formvalues?.NetAmount)
    this.saveform.get('discAmount').setValue(formvalues?.FinalDiscAmt) 
    this.saveform.get('balanceAmount').setValue(BalAmt)
    this.saveform.get('concessionReasonId').setValue(formvalues?.ConcessionId) 

    if (this.saveform.valid) {
      console.log(this.saveform.value)
      this._SelseSettelmentservice.BillDiscountAfter(this.saveform.value).subscribe(response => {
        if (response) {
          this._matDialog.closeAll();
          this.onClose();
        }
      },);
    } else {
      let invalidFields = [];
      if (this.saveform.invalid) {
        for (const controlName in this.saveform.controls) {
          if (this.saveform.controls[controlName].invalid) {
            invalidFields.push(`${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
          );
        });
        return
      }
    }
  }
  onClose(){
    this.dialogRef.close();
    this.MyFrom.reset();
  }
  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  } 

          UserDicPerLimit: any = 0;
        getAccessDetail() {
            // debugger
            var SelectQuery = {
                "first": 0,
                "rows": 999,
                "sortField": "AccessValueId",
                "sortOrder": 0,
                "filters": [
                    {
                        "fieldName": "LoginId",
                        "fieldValue": String(this._loggedService.currentUserValue.userId), //"30091",
                        "opType": "Equals"
                    }
                ],
                "exportType": "JSON",
                "columns": []
            }
            this._SelseSettelmentservice.getAccessDetailList(SelectQuery).subscribe(response => {
                const getUserAccesDetList = response.data as UserDetail[];
                console.log("get Access data:", getUserAccesDetList)
    
                const discountData = response.data.find(x => x.accessValueName === 'IsDiscount');
                console.log(discountData)
                if (discountData?.accessValue) {
                    this.UserDicPerLimit = discountData?.accessInputValue || 0
                }
            });
        }
  getValidationMessages() {
    return {
      TotalAmount: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      FinalDiscAmt: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      FinalCompanyDiscAmt: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      NetAmount: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      DiscAmount: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      DiscountPer2: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      DiscAmount2: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      CompanyDiscper: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      CompanyDiscAmt: [{ name: "pattern", Message: "only Number allowed." }],
      ConcessionId: [],
    }
  }
}

