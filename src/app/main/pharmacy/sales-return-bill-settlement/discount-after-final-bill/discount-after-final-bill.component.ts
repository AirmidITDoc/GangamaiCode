import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { BrowsSalesBillService } from '../../brows-sales-bill/brows-sales-bill.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SalesReturnBillSettlementService } from '../sales-return-bill-settlement.service';

@Component({
  selector: 'app-discount-after-final-bill',
  templateUrl: './discount-after-final-bill.component.html',
  styleUrls: ['./discount-after-final-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DiscountAfterFinalBillComponent implements OnInit {

  MyFrom:FormGroup;
  selectedAdvanceObj:any
  vNetamount:any;
  vTotalAmount:any;
  vDiscAmount:any;
  vDiscountPer2:any;
  vDiscAmount2:any;
  vFinalDiscAmt:any;
  vFinalNetAmt:any;
  vCompanyDiscAmt:any;
  vCompanyDiscper:any;
  ConcessionReasonList:any=[];
  vFinalCompanyDiscAmt:any;
  CompanyName:any = '';
  registerObj:any;

  constructor(
    public _formbuilder:FormBuilder,  
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
      this.selectedAdvanceObj = this.data.PatientInfo
      console.log(this.selectedAdvanceObj)
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.vDiscAmount = Math.round(this.registerObj.DiscAmount);
      this.vTotalAmount =  Math.round(this.registerObj.TotalAmount);
      this.vFinalNetAmt =  Math.round(this.registerObj.NetAmount)
      this.vNetamount =  Math.round(this.registerObj.NetAmount)
      this.vFinalDiscAmt =  Math.round(this.registerObj.DiscAmount);  
    }
    this.CreateMyForm();
    this.getConcessionReasonList();
  }
  CreateMyForm(){
    this.MyFrom = this._formbuilder.group({
      NetAmount:[''],
      TotalAmount:[''],
      DiscAmount:[''],
      DiscountPer2:[''],
      DiscAmount2:[''],
      FinalDiscAmt:[''],
      FinalNetAmt:[''],
      CompanyDiscper:[''],
      CompanyDiscAmt:[''],
      ConcessionId:[''],
      FinalCompanyDiscAmt:['']
    });
  }
  getConcessionReasonList() { 
    this._SelseSettelmentservice.getConcessionCombo().subscribe(data => {
      this.ConcessionReasonList = data;
    })
  }
  CalcDiscPer(){ 
    let DiscAmt2; 
    let DiscPer2 = this.MyFrom.get('DiscountPer2').value || 0; 

    if(DiscPer2){
      if(DiscPer2 > 100){
        this.toastr.warning('Please enter discount % less than 100 and greater than 0', 'warning !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        return  this.vDiscountPer2 = '';
      }
      else{
        this.vDiscAmount2 = ((parseFloat(this.vFinalNetAmt) * parseFloat(this.vDiscountPer2)) / 100).toFixed(2) || 0;
        DiscAmt2 = this.vDiscAmount2;
      } 
    }else{
      if(DiscPer2 == 0 || DiscPer2 == '' || DiscPer2 == null || DiscPer2 == undefined){ 
        this.vDiscAmount2 = ''; 
        DiscAmt2 = 0;
      }
    } 
    this.vFinalDiscAmt = Math.round(parseFloat(DiscAmt2) + parseFloat(this.vDiscAmount)).toFixed(2);
    this.vNetamount = Math.round((parseFloat(this.vTotalAmount) - parseFloat( this.vFinalDiscAmt))).toFixed(2);
  }
  CalcDiscAmt() {
    let DiscAmt2 = this.MyFrom.get('DiscAmount2').value || 0; 
    let DiscPer2; 

    if (DiscAmt2) {
      if (DiscAmt2 > this.vFinalNetAmt) {
        this.toastr.warning('Please enter discount amount less than netanoubt and greater than 0', 'warning !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        return this.vDiscAmount2 = '';
      }
      else {
        this.vDiscountPer2 = ((parseFloat(this.vDiscAmount2) / parseFloat(this.vFinalNetAmt)) * 100).toFixed(2) || 0;
        DiscPer2 = this.vDiscountPer2;
      }
    } else {
      if (DiscAmt2 == 0 || DiscAmt2 == '' || DiscAmt2 == null || DiscAmt2 == undefined) {
        this.vDiscountPer2 = '';
        DiscPer2 = 0;
      }
    } 
    this.vFinalDiscAmt = Math.round(parseFloat(DiscAmt2) + parseFloat(this.vDiscAmount)).toFixed(2);
    this.vNetamount = Math.round((parseFloat(this.vTotalAmount) - parseFloat(this.vFinalDiscAmt))).toFixed(2);
  } 

  OnSave(){
    debugger
    if(this.vDiscAmount2 > 0 || this.vCompanyDiscAmt > 0){
      if(!this.MyFrom.get('ConcessionId').value){
        this.toastr.warning('Please select Concession Reason ', 'warning !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        return
      }
    }
    if(this.vFinalDiscAmt == 0 || this.vFinalDiscAmt == '' || this.vFinalDiscAmt == undefined || this.vFinalDiscAmt == null){
      this.toastr.warning('Please check final DiscAmount is zero', 'warning !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
      return
    }
    if(this.vNetamount == 0 || this.vNetamount == '' || this.vNetamount == undefined || this.vNetamount == null){
      this.toastr.warning('Please check final netamount is zero', 'warning !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
      return
    } 
    let balanceAmount = 0
    balanceAmount = this.registerObj.BalanceAmount - this.MyFrom.get('DiscAmount2').value
    var m_data1 = {
      "phBillDiscountAfterUpdate": {
        "salesId": this.registerObj.SalesId || 0,
        "netPayableAmt": this.MyFrom.get('NetAmount').value || 0,
        "concessionAmt":this.MyFrom.get('DiscAmount2').value || 0, 
        "balanceAmt": balanceAmount || 0,
        "concessionReasonId": this.MyFrom.get('ConcessionId').value.ConcessionId || 0
      }
    } 
    console.log(m_data1)
     this._SelseSettelmentservice.BillDiscountAfter(m_data1).subscribe(response =>{
      if (response) {
        this.toastr.success('Record  Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        }); 
        this._matDialog.closeAll();
        this.onClose(); 
      
      } else {
        this.toastr.error(' Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      } 
    }, error => {
      this.toastr.error('Discount After Bill Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });  
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
  @ViewChild('save') save: ElementRef;
  @ViewChild('FinalDiscPer') FinalDiscPer: ElementRef;
  @ViewChild('FinalDiscAmt') FinalDiscAmt: ElementRef;

  public onEnterFinalDisc(event): void { 
    if (event.which === 13) {
      this.FinalDiscAmt.nativeElement.focus(); 
    }
  }
  public onEnterFinalDiscAmt(event): void { 
    if (event.which === 13) {
      this.save.nativeElement.focus(); 
    }
  }
}
