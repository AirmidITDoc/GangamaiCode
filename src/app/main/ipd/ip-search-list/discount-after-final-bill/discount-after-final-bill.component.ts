import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { IPSearchListService } from '../ip-search-list.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-discount-after-final-bill',
  templateUrl: './discount-after-final-bill.component.html',
  styleUrls: ['./discount-after-final-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
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

  constructor(
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<DiscountAfterFinalBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    private formBuilder: FormBuilder,
    public _IpSearchListService: IPSearchListService,
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.selectedAdvanceObj = this.data
      console.log(this.selectedAdvanceObj)
      this.vDiscAmount = Math.round(this.selectedAdvanceObj.ConcessionAmt);
      this.vTotalAmount =  Math.round(this.selectedAdvanceObj.TotalAmt);
      this.vFinalNetAmt =  Math.round(this.selectedAdvanceObj.NetPayableAmt)
      this.vNetamount =  Math.round(this.selectedAdvanceObj.NetPayableAmt)
      this.vFinalDiscAmt =  Math.round(this.selectedAdvanceObj.ConcessionAmt);
    }
    this.CreateMyForm();
    this.getConcessionReasonList();

  }
  CreateMyForm(){
    this.MyFrom = this.formBuilder.group({
      NetAmount:[''],
      TotalAmount:[''],
      DiscAmount:[''],
      DiscountPer2:[''],
      DiscAmount2:[''],
      FinalDiscAmt:[''],
      FinalNetAmt:[''],
      CompanyDiscper:[''],
      CompanyDiscAmt:[''],
      ConcessionId:['']
    });
  }

  CalcDiscPer(){
    //debugger
    let DiscAmt2;
    let CompanyDiscAmt ;
    let DiscPer2 = this.MyFrom.get('DiscountPer2').value || 0;
    let CompanyDiscPer = this.MyFrom.get('CompanyDiscper').value || 0;

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

    if(CompanyDiscPer){
      if(CompanyDiscPer > 100){
        this.toastr.warning('Please enter discount % less than 100 and greater than 0', 'warning !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        return  this.vCompanyDiscper = '';
      }
      else{
        this.vCompanyDiscAmt = ((parseFloat(this.vFinalNetAmt) * parseFloat(this.vCompanyDiscper)) / 100).toFixed(2) || 0;
        CompanyDiscAmt =   this.vCompanyDiscAmt;
      } 
    }
    else{
       if(CompanyDiscPer == 0 || CompanyDiscPer == '' || CompanyDiscPer == null || CompanyDiscPer == undefined){ 
        this.vCompanyDiscAmt = '';
        CompanyDiscAmt = 0;
      }
    }
    this.vFinalDiscAmt = Math.round(parseFloat(DiscAmt2) + parseFloat(CompanyDiscAmt) + parseFloat(this.vDiscAmount));
    this.vNetamount = Math.round(parseFloat(this.vTotalAmount) - (parseFloat( this.vFinalDiscAmt))).toFixed(2);
  }
 
  getConcessionReasonList() { 
    this._IpSearchListService.getConcessionCombo().subscribe(data => {
      this.ConcessionReasonList = data;
    })
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

    // let billDiscountAfterUpdateObj = {};

    // billDiscountAfterUpdateObj['billNo'] =  this.selectedAdvanceObj.BillNo || 0;
    // billDiscountAfterUpdateObj['netPayableAmt'] = this.MyFrom.get('FinalNetAmt').value || 0;
    // billDiscountAfterUpdateObj['concessionAmt'] = this.MyFrom.get('DiscAmount2').value || 0;
    // billDiscountAfterUpdateObj['compDiscAmt'] =this.MyFrom.get('CompanyDiscAmt').value || 0;
    // billDiscountAfterUpdateObj['balanceAmt'] =this.selectedAdvanceObj.BalanceAmt || 0;
    // billDiscountAfterUpdateObj['concessionReasonId'] = this.MyFrom.get('ConcessionId').value.ConcessionId || 0;

    // let submitData={
    //   'billDiscountAfterUpdate': billDiscountAfterUpdateObj
    // }

    var m_data1 = {
      "billDiscountAfterUpdate": {
        "billNo": this.selectedAdvanceObj.BillNo || 0,
        "netPayableAmt": this.MyFrom.get('NetAmount').value || 0,
        "concessionAmt":this.MyFrom.get('DiscAmount2').value || 0,
        "compDiscAmt": this.MyFrom.get('CompanyDiscAmt').value || 0,
        "balanceAmt": this.selectedAdvanceObj.BalanceAmt || 0,
        "concessionReasonId": this.MyFrom.get('ConcessionId').value.ConcessionId || 0
      }
    }
    console.log(m_data1)
     this._IpSearchListService.BillDiscountAfter(m_data1).subscribe(response =>{
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

    // this._IpSearchListService.BillDiscountAfter(m_data1).subscribe(response => {
    //   if (response == 'true') {
    //     Swal.fire('Congratulations !', 'Discount After Final Bill data saved Successfully !', 'success').then((result) => {
    //       if (result.isConfirmed) {
    //         this._matDialog.closeAll();
    //         this.onClose(); 
    //       }
    //     });
    //   }
    //   else {
    //     Swal.fire('Error !', 'Discount After Final Bill data not saved', 'error');
    //   }
      
    // });
   
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
