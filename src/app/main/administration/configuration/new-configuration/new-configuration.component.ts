import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfigSettingParams } from 'app/core/models/config';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdministrationService } from '../../administration.service';
import { ConfigurationService } from '../configuration.service';

@Component({
    selector: 'app-new-configuration',
    templateUrl: './new-configuration.component.html',
    styleUrls: ['./new-configuration.component.scss']
})
export class NewConfigurationComponent implements OnInit {

    myform: FormGroup;
    isActive: boolean = true;
    isPatientSelected: boolean = false;
    autocompleteModeItem: string = "PatientType";
    autocompleteModeCashcounter: string = "CashCounter";
    autocompleteModeDepartment: String = "Department";
    autocompleteModedoctorty: string = "ConDoctor";
    screenFromString = 'Common-form';
    autocompleteModeClass: string = "Class";
    autocompleteModeOpbillCashcounter: string = "CashCounter";
    autocompleteModeopreceiptCashcounter: string = "CashCounter";
    autocompleteModeoprefundCashcounter: string = "CashCounter";
    autocompleteModeoprefundreeiptCashcounter: string = "CashCounter";


    autocompleteModeIpbillCashcounter: string = "CashCounter";
    autocompleteModeIpreceiptCashcounter: string = "CashCounter";
    autocompleteModeIprefundCashcounter: string = "CashCounter";
    autocompleteModeIprefundreeiptCashcounter: string = "CashCounter";
    autocompleteModeIpAdvanceCashcounter: string = "CashCounter";


    itemId = 0;
    dateTimeObj: any;

    constructor(
        public _ConfigurationService: ConfigurationService,
        public dialogRef: MatDialogRef<NewConfigurationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.myform = this._ConfigurationService.createConfigForm();
        if ((this.data?.configId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.myform.patchValue(this.data);
        }
    }

    onSubmit() {
        if (!this.myform.invalid) {
            console.log("Currency JSON :-", this.myform.value);

            this._ConfigurationService.ConfigSave(this.myform.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
        else {
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
    }

    getValidationMessages() {
        return {
            registrationNo: [],
            ipNo: [],
            opNo: [],
            patientType: [],
            cashCounterId: [],
            IPPrintName: [],
            IPPaperName: [],

            OPSalesdisc: [],
            IPSalesdisc: [],
            ChargeClass: []

        };
    }
    classstatus = false
    onChangeClassEdit(event) {
        if (event.checked)
            this.classstatus = true
       else
            this.classstatus = false
    }
    ApiURL: any;
    getSelectedClassObj(event) {
        this.ApiURL = "VisitDetail/GetServiceListwithTraiff?TariffId=" + 1 + "&ClassId=" + 1 + "&ServiceName="
    }

    selectChangeItem(obj: any) {
        console.log(obj);
        this.itemId = obj
    }

    getOptionTextPatient(option) {
        return option && option.PatientType ? option.PatientType : '';
    }


    onChangePrintReg(event) {

    }
    onChangePrintAfterReg(event) {

    }
    onChangeIPDAdd(event) {

    }

    Isprint = false
    Isprint1 = false
    Isprint2 = false
    onChangeprint(event) {
        debugger
        if (event.checked)
            this.Isprint = true
        else
            this.Isprint = false
    }

    onChangeprintIp(event) {
        if (event.checked)
            this.Isprint1 = true
        else
            this.Isprint1 = false
    }
    onChangeprintphar(event) {
        if (event.checked)
            this.Isprint2 = true
        else
            this.Isprint2 = false
    }


    onReset() { }
    onClear(val: boolean) {
        this.myform.reset();
        this.dialogRef.close(val);
    }

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }


    onClose() {
        this.dialogRef.close();
    }
}