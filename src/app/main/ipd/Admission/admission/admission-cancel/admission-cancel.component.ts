import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { AdmissionService } from '../admission.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdmissionPersonlModel } from '../admission.component';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { AdmissionModule } from '../admission.module';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-admission-cancel',
    templateUrl: './admission-cancel.component.html',
    styleUrls: ['./admission-cancel.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AdmissionCancelComponent {
    AdmissionId: any
    AdmissionCancleTaskForm: FormGroup
    Personaldata = new AdmissionPersonlModel({});
    Reason: any
    dataSourceAdmission = new MatTableDataSource<AdmissionModule>();


    constructor(public _AdmissionService: AdmissionService,
        private formBuilder: UntypedFormBuilder,
        private accountService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<AdmissionCancelComponent>,

    ) { }


    ngOnInit(): void {
        console.log(this.data);
        this.AdmissionCancleTaskForm = this.CreateAdmissionCancleeForm()

        if (this.data) {
            this.Personaldata = this.data;
            this.AdmissionId = this.Personaldata.admissionId;
            this.GetAdmissionCancleStausData()
        }
    }

    CreateAdmissionCancleeForm() {
        return this.formBuilder.group({
            AdmissionDate: [(new Date()).toISOString(), Validators.required],
            Reason: ['', Validators.required]
        });
    }

    Response: any
    GetAdmissionCancleStausData() {

        const SelectQuery =
        {
            "searchFields": [
                {
                    "fieldName": "AdmissionId",
                    "fieldValue": String(this.AdmissionId),
                    "opType": "Equals"
                }
            ],
            "mode": "AdmissionCancleStaus"
        }

        console.log(SelectQuery);
        this._AdmissionService.getAdmissionDetailList(SelectQuery).subscribe(data => {
            console.log(data)
            this.Response = data[0].CancelStatus

            console.log(this.Response)
            Swal.fire(this.Response)

        });
    }
    AdmissionMsg = ''
    AdmissionCancle() {
        debugger
        if (this.Response == 'All Charges Clear') {
            if (!this.AdmissionCancleTaskForm.invalid) {
                Swal.fire({
                    title: 'Do you want to cancel the Admission ',
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Yes, Cancel it!"
                }).then((result) => {
                    if (result.isConfirmed) {

                        const SubmitDate = {
                            "admissionId": this.AdmissionId,
                            "isCancelledBy": this.accountService.currentUserValue.userId,
                            "isCancelledDateTime": this.datePipe.transform(this.AdmissionCancleTaskForm.get('AdmissionDate').value, "yyyy-MM-dd"),
                            "isCancelled": 1,
                            "isCancelComment": this.AdmissionCancleTaskForm.get('Reason').value || ''

                        }
                        console.log(SubmitDate)
                        this._AdmissionService.AdmissionCancel(SubmitDate).subscribe(response => {
                            this._matDialog.closeAll()
                        });
                    }
                })
            }
            else {
                const invalidFields = [];

                if (this.AdmissionCancleTaskForm.invalid) {
                    for (const controlName in this.AdmissionCancleTaskForm.controls) {
                        if (this.AdmissionCancleTaskForm.controls[controlName].invalid) {
                            invalidFields.push(`Admission Cancel Form: ${controlName}`);
                        }
                    }
                }
                if (invalidFields.length > 0) {
                    invalidFields.forEach(field => {
                        this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                        );
                    });
                }
            }

        }
        //  else if (this.Response == 1) {
        //     this.toastr.warning('Sorry, this admission cannot be cancelled...', 'warning !', {
        //         toastClass: 'tostr-tost custom-toast-success',
        //     });
        //     this.AdmissionMsg = 'Any advance amount paid by the patient will be adjusted or refunded first..'
        //     return;
        // } 
        else if (this.Response !== 'All Charges Clear') {
            this.toastr.warning('Sorry, this admission cannot be cancelled...', 'warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });

            this.AdmissionMsg = this.Response
          
            return;
        }
    }
    onClose() {
        this._matDialog.closeAll()
    }
}
