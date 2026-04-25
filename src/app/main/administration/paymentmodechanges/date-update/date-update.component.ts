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
    BillDate: any;
    screenFromString = 'Paymentform-form';

    constructor(
        public _PaymentmodechangesService: PaymentmodechangesService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<DateUpdateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
    FormId = 0
    ngOnInit(): void {
        debugger
        if (this.data) {
            debugger
            console.log(this.data.registerObj)
            this.PaymentId = this.data.registerObj.paymentId;
            this.BillDate = this.data.registerObj.BillDate
            this.FormId = this.data.FromName

            console.log(this.PaymentId)
        }
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
        console.log(this.dateTimeObj)
    }


    PaymentDate() {
        debugger
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
            debugger
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                debugger
                const d1 = new Date(this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd")!);
                const d2 = new Date(this.BillDate);

                if (d1 < d2) {
                    Swal.fire("Enter Payment Date After Bill Date :" + this.datePipe.transform(this.BillDate, "yyyy-MM-dd"))
                    return;
                } else {
                    if (this.FormId == 1) {
                        const data = {
                            'paymentId': this.PaymentId,
                            'paymentDate': this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
                            'paymentTime': formattedDate + this.dateTimeObj.time
                        }
                        console.log(data);
                        this._PaymentmodechangesService.getDateTimeChange(data).subscribe(response => {
                            this.toastr.success(response);
                            this._matDialog.closeAll();
                        }, (error) => {
                            this.toastr.error(error.message);
                        });

                    } else if (this.FormId == 3) {
                        var data1 = {
                            'paymentId': this.PaymentId,
                            'paymentDate': this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
                            'paymentTime': formattedDate + this.dateTimeObj.time
                        }
                        console.log(data1);
                        this._PaymentmodechangesService.getDateTimeChange1(data1).subscribe(response => {
                            this.toastr.success(response);
                            this._matDialog.closeAll();
                        }, (error) => {
                            this.toastr.error(error.message);
                        });

                    } else if (this.FormId == 4) {
                        var data2 = {
                            'paymentId': this.PaymentId,
                            'paymentDate': this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
                            'paymentTime': this.dateTimeObj.time
                        }
                        console.log(data2);
                        this._PaymentmodechangesService.PharDateTimeChange(data2).subscribe(response => {
                            this.toastr.success(response);
                            this._matDialog.closeAll();
                        }, (error) => {
                            this.toastr.error(error.message);
                        });

                    }

                }
            }
        });

    }

    tPaymentDate() {
        debugger
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
            debugger
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                debugger
                const d1 = new Date(this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd")!);
                const d2 = new Date(this.BillDate);

                if (d1 < d2) {
                    Swal.fire("Enter Payment Date After Bill Date :" + this.datePipe.transform(this.BillDate, "yyyy-MM-dd"))
                    return;
                } else {
                    const data = {
                        'paymentId': this.PaymentId,
                        'paymentDate': this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
                        'paymentTime': formattedDate + this.dateTimeObj.time
                    }
                    console.log(data);
                    this._PaymentmodechangesService.getDateTimeChange(data).subscribe(response => {
                        this.toastr.success(response);
                        this._matDialog.closeAll();
                    }, (error) => {
                        this.toastr.error(error.message);
                    });
                }
            }
        });

    }
    onClose() {
        this._matDialog.closeAll();
    }
}
