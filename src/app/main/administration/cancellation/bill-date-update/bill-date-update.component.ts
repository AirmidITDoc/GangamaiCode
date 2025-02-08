import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { CancellationService } from '../cancellation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bill-date-update',
  templateUrl: './bill-date-update.component.html',
  styleUrls: ['./bill-date-update.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BillDateUpdateComponent implements OnInit {

  dateTimeObj:any;
  BillNo:any;
  RefundId:any;
  resigterObj:any;
  PaymentId:any;
  screenFromString = 'billform-form';

  constructor(
    public _CancellationService:CancellationService,
    public datePipe: DatePipe, 
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<BillDateUpdateComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data) {
  
      this.resigterObj =  this.data.obj;
      this.RefundId = this.resigterObj.RefundId;
      this.PaymentId = this.resigterObj.PaymentId;
      this.BillNo = this.resigterObj.BillNo;
      console.log(this.resigterObj) 
      console.log(this.RefundId) 
      console.log(this.BillNo) 
      console.log(this.PaymentId) 
    }
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj; 
    console.log(this.dateTimeObj)
  } 
  BillDate() { 
    const formattedDate = this.datePipe.transform(this.dateTimeObj.date,"yyyy-MM-dd");
    const formattedTime = formattedDate+this.dateTimeObj.time;//this.datePipe.transform(this.dateTimeObj.date,"yyyy-MM-dd")+this.dateTimeObj.time;  
    
    Swal.fire({
      title: 'Do you want to Update Bill Date & Time ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */ 
      if (result.isConfirmed) { 
        let Query
        if(this.BillNo){
          Query = "update bill set BillDate='"+formattedDate+"',BillTime='"+formattedTime+"'where BillNo=" +this.BillNo 
        }else if(this.RefundId){
          Query = "update refund set RefundDate='"+formattedDate+"',RefundTime='"+formattedTime+"'where RefundId=" +this.RefundId 
          if(this.PaymentId){
            let PayQuery = "update payment set PaymentDate='"+formattedDate+"',PaymentTime='"+formattedTime+"'where PaymentId=" +this.PaymentId 
            this._CancellationService.getDateTimeChangeReceipt(PayQuery).subscribe(response => {
              if (response) {
                this.toastr.success('Payment Receipt Date & Time Updated Successfuly', 'Updated !', {
                  toastClass: 'tostr-tost custom-toast-success',
                });  
              } else {
                this.toastr.error('API Error!', 'Error !', {
                  toastClass: 'tostr-tost custom-toast-error',
                }); 
              }
            });

          }
        }
         else if(this.resigterObj.AdvanceId){
          Query = "update advancedetail set Date='"+formattedDate+"',Time='"+formattedTime+"'where AdvanceDetailID=" +this.resigterObj.AdvanceDetailID 
          if(this.PaymentId){
            let PayQuery = "update payment set PaymentDate='"+formattedDate+"',PaymentTime='"+formattedTime+"'where PaymentId=" +this.PaymentId 
            this._CancellationService.getDateTimeChangeReceipt(PayQuery).subscribe(response => {
              if (response) {
                this.toastr.success('Payment Receipt Date & Time Updated Successfuly', 'Updated !', {
                  toastClass: 'tostr-tost custom-toast-success',
                });  
              } else {
                this.toastr.error('API Error!', 'Error !', {
                  toastClass: 'tostr-tost custom-toast-error',
                }); 
              }
            });

          }
        }

      console.log(Query);
        this._CancellationService.getDateTimeChange(Query).subscribe(response => {
          if (response) {
            this.toastr.success('Bill Date & Time Updated Successfuly', 'Updated !', {
              toastClass: 'tostr-tost custom-toast-success',
            }); 
            this.onClose();
          } else {
            this.toastr.error('API Error!', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
            this.onClose();
          }
        });
      }
    }); 
  }



  onClose(){
    this._matDialog.closeAll(); 
    this.RefundId = '';
    this.BillNo = '';
  }
}
