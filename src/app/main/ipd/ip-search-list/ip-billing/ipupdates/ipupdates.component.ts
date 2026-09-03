import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { IPSearchListService } from '../../ip-search-list.service';

@Component({
    selector: 'app-ipupdates',
    templateUrl: './ipupdates.component.html',
    styleUrls: ['./ipupdates.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class IPUpdatesComponent implements OnInit {


    autocompleteModeClass: string = "Class";
    autocompleteModetariff: string = "Tariff";
    IpUpdateForm: FormGroup;
    IpClassChangeForm: FormGroup;
    FormName: any = '';
    registerObj: any;


    constructor(
        public _IpSearchListService: IPSearchListService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        private accountService: AuthenticationService,
        public dialogRef: MatDialogRef<IPUpdatesComponent>,
        private formBuilder: UntypedFormBuilder,
        public _FormvalidationserviceService: FormvalidationserviceService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.IpUpdateForm = this.createIPUpdateForm()
        this.IpClassChangeForm = this.ClassChangeForm();
        if (this.data) {
            this.FormName = this.data?.FormName
            this.registerObj = this.data?.PatientHeaderObj
            console.log(this.registerObj)
        }
    }
    createIPUpdateForm() {
        return this.formBuilder.group({
            NewclassId: [''],
            OldClassId: [''],
            OldTariffId: [''],
            NewTariffId: [''],
            fromDate: [new Date()],
            enddate: [new Date()]
        })
    }
    ClassChangeForm() {
        return this.formBuilder.group({
            ClassChangeForm: this.formBuilder.group({
                classId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                tariffId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                opdIpdId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                newClassId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            }),
            TariffChangeForm: this.formBuilder.group({
                classId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                tariffId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                opdIpdId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                newClassId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                newTariffId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
            }),
        })
    }



    onSave() {
        debugger
        const FormValue = this.IpUpdateForm.value
        if (!FormValue.NewclassId) {
            this.toastr.warning('Selecte New Class Name  !', 'warning', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        if (this.data?.FormName == 'Update_Class') {
            Swal.fire({
                title: 'Do you want to change Class Name',
                text: "Do you want to change the all the rate or not!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Change it!"
            }).then((flag) => {
                if (flag.isConfirmed) {

                    this.IpClassChangeForm.get('ClassChangeForm.classId').setValue(this.registerObj?.classId)
                    this.IpClassChangeForm.get('ClassChangeForm.tariffId').setValue(this.registerObj?.tariffId)
                    this.IpClassChangeForm.get('ClassChangeForm.opdIpdId').setValue(this.registerObj?.admissionId)
                    this.IpClassChangeForm.get('ClassChangeForm.newClassId').setValue(FormValue?.NewclassId)
                    console.log(this.IpClassChangeForm.value.ClassChangeForm)
                    this._IpSearchListService.UpdateIpClassName(this.IpClassChangeForm.value.ClassChangeForm).subscribe(response => {
                        this.onClose();
                    })
                }
            })
        } else if (this.data?.FormName == 'Update_Tariff') {
            if (!FormValue.NewTariffId) {
                this.toastr.warning('Selecte New Tariff Name !', 'warning', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return
            }
            Swal.fire({
                title: 'Do you want to change Tariff Name',
                text: "Do you want to change the all the rate or not!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Change it!"
            }).then((flag) => {
                if (flag.isConfirmed) {
                    this.IpClassChangeForm.get('TariffChangeForm.classId').setValue(this.registerObj?.classId)
                    this.IpClassChangeForm.get('TariffChangeForm.tariffId').setValue(this.registerObj?.tariffId)
                    this.IpClassChangeForm.get('TariffChangeForm.opdIpdId').setValue(this.registerObj?.admissionId)
                    this.IpClassChangeForm.get('TariffChangeForm.newClassId').setValue(FormValue?.NewclassId)
                    this.IpClassChangeForm.get('TariffChangeForm.newTariffId').setValue(FormValue?.NewTariffId)
                    console.log(this.IpClassChangeForm.value.TariffChangeForm)
                    this._IpSearchListService.UpdateIpTariffName(this.IpClassChangeForm.value.TariffChangeForm).subscribe(response => {
                        this.onClose();
                    })
                }
            })
        }
    }
    onClose() {
        this.IpUpdateForm.reset();
        this._matDialog.closeAll()
    }
    getValidationMessages() {
        return {
            NewclassId: [
                { name: "required", Message: "Class Name is required" },
            ],
            OldClassId: [
                { name: "required", Message: "Old Class Name is required" },
            ],
            OldTariffId: [
                { name: "required", Message: "Old Tariff Name is required" },
            ],
            NewTariffId: [
                { name: "required", Message: " Tariff Name is required" },
            ]
        }
    }
}
