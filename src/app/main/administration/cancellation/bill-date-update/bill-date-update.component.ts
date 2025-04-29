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
  AdvanceDetailId:any;
  RefundId:any;
  SalesId:any;
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
      this.BillNo = this.data.billNo;
      this.AdvanceDetailId=this.data.advanceDetailID
      this.RefundId=this.data.refundId
      this.SalesId=this.data.salesId
      this.PaymentId=this.data.paymentId
      console.log(this.BillNo) 
      console.log(this.AdvanceDetailId) 
      console.log(this.RefundId) 
      console.log(this.SalesId) 
      console.log(this.PaymentId)
    }
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj; 
    console.log(this.dateTimeObj)
  } 
  BillDate() {
    const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
    const formattedTime = formattedDate + this.dateTimeObj.time;//this.datePipe.transform(this.dateTimeObj.date,"yyyy-MM-dd")+this.dateTimeObj.time;  

    Swal.fire({
      title: 'Do you want to Update Bill Date & Time ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      debugger
      if (result.isConfirmed) {

        if (this.BillNo) {
          var data = {
            'billNo': this.BillNo,
            'billDate': this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            'billTime': formattedDate + this.dateTimeObj.time
          }
          console.log(data);
          this._CancellationService.getDateTimeChangeBill(data).subscribe(response => {
            this.toastr.success(response);
            this._matDialog.closeAll();
          }, (error) => {
            this.toastr.error(error.message);
          });

        } else if (this.AdvanceDetailId) {
          var data1 = {
            "date": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"), 
            "time": formattedDate + this.dateTimeObj.time,
            "advanceDetailId": this.AdvanceDetailId
          }
          console.log(data1);
          this._CancellationService.getDateTimeChangeAdvanceDetId(data1).subscribe(response => {
            this.toastr.success(response);
            this._matDialog.closeAll();
          }, (error) => {
            this.toastr.error(error.message);
          });

        } else if(this.RefundId){
          var data2 = {
            "refundDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            "refundTime": formattedDate + this.dateTimeObj.time,
            "refundId": this.RefundId
          }
          console.log(data2);
          this._CancellationService.getDateTimeChangeRefundId(data2).subscribe(response => {
            this.toastr.success(response);
            this._matDialog.closeAll();
          }, (error) => {
            this.toastr.error(error.message);
          });

        }else if(this.SalesId){
          var data3 = {
            "date": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            "time": formattedDate + this.dateTimeObj.time,
            "salesId": this.SalesId
          }
          console.log(data3);
          this._CancellationService.getDateTimeChangeSalesId(data3).subscribe(response => {
            this.toastr.success(response);
            this._matDialog.closeAll();
          }, (error) => {
            this.toastr.error(error.message);
          });

        }else if(this.PaymentId){
          var data4 = {
            "paymentDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            "paymentTime": formattedDate + this.dateTimeObj.time,
            "paymentId": this.PaymentId
          }
          console.log(data4);
          this._CancellationService.getDateTimeChangePaymentId(data4).subscribe(response => {
            this.toastr.success(response);
            this._matDialog.closeAll();
          }, (error) => {
            this.toastr.error(error.message);
          });
        }

      }
    });
  }
  onClose(){
    this._matDialog.closeAll(); 
  }
}
