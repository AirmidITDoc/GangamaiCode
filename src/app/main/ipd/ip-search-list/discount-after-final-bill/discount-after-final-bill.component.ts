import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { IPSearchListService } from '../ip-search-list.service';

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
      this.vDiscAmount = this.selectedAdvanceObj.ConcessionAmt;
      this.vTotalAmount = this.selectedAdvanceObj.TotalAmt;
      this.vNetamount = this.selectedAdvanceObj.NetPayableAmt
    }
    this.CreateMyForm();

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
      ConcessionId:['']
    });
  }
  CalcDiscPer(){
    if(this.vDiscountPer2){
      if(this.vDiscountPer2 > 100){
        this.toastr.warning('Please enter discount % less than 100 and greater than 0', 'warning !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        return  this.vDiscountPer2 = '';
      }
      else if(this.vDiscountPer2 > 0){
        this.vDiscAmount2 = ((parseFloat(this.vNetamount) * parseFloat(this.vDiscountPer2)) / 100);
        this.vFinalNetAmt = (parseFloat(this.vNetamount) - parseFloat(this.vDiscAmount2)).toFixed(2);
      }
      else if(this.vDiscountPer2 == 0 || this.vDiscountPer2 == '' || this.vDiscountPer2 == null || this.vDiscountPer2 == undefined){
        this.vFinalNetAmt = this.vNetamount ;
        this.vDiscAmount2 = '';
      }
    }
  }
  getConcessionReasonList() { 
    this._IpSearchListService.getConcessionCombo().subscribe(data => {
      this.ConcessionReasonList = data;
    })
  }
  OnSave(){
    if(this.vFinalNetAmt == 0 || this.vFinalNetAmt == '' || this.vFinalNetAmt == undefined || this.vFinalNetAmt == null){
      this.toastr.warning('Please check final netamount is zero', 'warning !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
      return
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
