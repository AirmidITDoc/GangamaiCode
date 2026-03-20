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

  dateTimeObj: any;
  BillNo: any;
  AdvanceDetailId: any;
  RefundId: any;
  SalesId: any;
  PaymentId: any;
  SalesDate: any;
  refundDate: any;
  screenFromString = 'billform-form';

  constructor(
    public _CancellationService: CancellationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<BillDateUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    debugger
    if (this.data.data) {
      console.log(this.data)
      
      this.BillNo = this.data.data.billNo || this.data.data.BillNo;

      this.AdvanceDetailId = this.data.data.advanceDetailID
      this.RefundId = this.data.data.refundId
      this.SalesId = this.data.data.salesId
      this.PaymentId = this.data.data.paymentId
      this.SalesDate = this.data.data.date
      this.refundDate = this.data.data.refundDate
      // console.log(this.BillNo)
      // console.log(this.AdvanceDetailId)
      // console.log(this.RefundId)
      // console.log(this.SalesId)
      // console.log(this.PaymentId)
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
debugger
        if (this.BillNo) {
          const data = {
            'billNo': this.BillNo,
            'billDate': this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            'billTime': formattedDate + this.dateTimeObj.time
          }
          console.log(data);
          this._CancellationService.getDateTimeChangeBill(data).subscribe(response => {
            this._matDialog.closeAll();
          });

        } else if (this.AdvanceDetailId) {
          const data1 = {
            "date": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            "time": formattedDate + this.dateTimeObj.time,
            "advanceDetailId": this.AdvanceDetailId
          }
          console.log(data1);
          this._CancellationService.getDateTimeChangeAdvanceDetId(data1).subscribe(response => {
            this._matDialog.closeAll();
          });

        } else if (this.RefundId) {
          const d1 = new Date(this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd")!);
          const d2 = new Date(this.refundDate);
          if (d1 < d2) {
            Swal.fire("Enter Payment Date After Return Date :" + this.datePipe.transform(this.refundDate, "yyyy-MM-dd"))
            return;
          } else {
            const data2 = {
              "refundDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
              "refundTime": formattedDate + this.dateTimeObj.time,
              "refundId": this.RefundId
            }
            console.log(data2);
            this._CancellationService.getDateTimeChangeRefundId(data2).subscribe(response => {
              this._matDialog.closeAll();
            });
          }
        } else if (this.SalesId && this.data.Id == 1) {
          var data3 = {
            "date": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            "time": formattedDate + this.dateTimeObj.time,
            "salesId": this.SalesId
          }
          console.log(data3);
          this._CancellationService.getDateTimeChangeSalesId(data3).subscribe(response => {
            this._matDialog.closeAll();
          });

        } else if (this.SalesId && this.data.Id == 4) {//tpayBilledit
          var data3 = {
            "date": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            "time": formattedDate + this.dateTimeObj.time,
            "salesId": this.SalesId
          }
          console.log(data3);
          this._CancellationService.getDateTimeChangeSalesId(data3).subscribe(response => {
            this._matDialog.closeAll();
          });

        } else if (this.PaymentId && this.data.Id == 2) {

          const d1 = new Date(this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd")!);
          const d2 = new Date(this.SalesDate);
          if (d1 < d2) {
            Swal.fire("Enter Payment Date After Bill Date :" + this.datePipe.transform(this.SalesDate, "yyyy-MM-dd"))
            return;
          } else {
            var data4 = {
              "paymentDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
              "paymentTime":  formattedDate + this.dateTimeObj.time,
              "paymentId": this.PaymentId
            }
            console.log(data4);
            this._CancellationService.PaymentDateTimeChange(data4).subscribe(response => {
              this._matDialog.closeAll();
            });
          }
        }else if (this.PaymentId && this.data.Id == 1) {

          const d1 = new Date(this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd")!);
          const d2 = new Date(this.SalesDate);
          if (d1 < d2) {
            Swal.fire("Enter Payment Date After Bill Date :" + this.datePipe.transform(this.SalesDate, "yyyy-MM-dd"))
            return;
          } else {
            var data4 = {
              "paymentDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
              "paymentTime":  formattedDate + this.dateTimeObj.time,
              "paymentId": this.PaymentId
            }
            console.log(data4);
            this._CancellationService.ChangeBillPaymentdate(data4).subscribe(response => {
              this._matDialog.closeAll();
            });
          }
        }else if (this.PaymentId && this.data.Id == 4) {

          const d1 = new Date(this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd")!);
          const d2 = new Date(this.SalesDate);
          if (d1 < d2) {
            Swal.fire("Enter Payment Date After Bill Date :" + this.datePipe.transform(this.SalesDate, "yyyy-MM-dd"))
            return;
          } else {
            const data5 = {
              "paymentDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
              "paymentTime":  formattedDate + this.dateTimeObj.time,
              "paymentId": this.PaymentId
            }
            console.log(data5);
            this._CancellationService.TPaymentPharmacyDateTimeChange(data5).subscribe(response => {
              this._matDialog.closeAll();
            });
          }
        }
      }
    });

  }
  onClose() {
    this._matDialog.closeAll();
  }
}
