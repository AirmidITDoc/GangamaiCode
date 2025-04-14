import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { PaymentmodechangesService } from '../paymentmodechanges.service';

@Component({
  selector: 'app-date-update',
  templateUrl: './date-update.component.html',
  styleUrls: ['./date-update.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DateUpdateComponent implements OnInit {

  dateTimeObj: any;
  PaymentId: any;
  screenFromString = 'Paymentform-form';

  constructor(
    public _PaymentmodechangesService: PaymentmodechangesService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<DateUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      console.log(this.data)
      this.PaymentId = this.data.obj;
      console.log(this.PaymentId)
    }
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }
  PaymentDate() {
    const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
    const formattedTime = formattedDate + this.dateTimeObj.time;//this.datePipe.transform(this.dateTimeObj.date,"yyyy-MM-dd")+this.dateTimeObj.time;  

    Swal.fire({
      title: 'Do you want to Update Payment Date & Time ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!"
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var data = {
          'PaymentId': this.PaymentId,
          'PaymentDate': this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
          'PaymentTime': formattedDate + this.dateTimeObj.time

        }
        console.log(data);
        this._PaymentmodechangesService.getDateTimeChange(data).subscribe(response => {
          this.toastr.success(response);
        this._matDialog.closeAll();
        }, (error) => {
          this.toastr.error(error.message);
        });
      }
      });
  }
  onClose() {
    this._matDialog.closeAll();
  }
}
