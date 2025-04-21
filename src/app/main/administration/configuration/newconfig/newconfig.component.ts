import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from '../configuration.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-newconfig',
    templateUrl: './newconfig.component.html',
    styleUrls: ['./newconfig.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewconfigComponent implements OnInit {

    myform: FormGroup;
    isActive:boolean=true;
    isPatientSelected: boolean = false;
    autocompleteModeItem: string = "PatientType";
    autocompleteModeCashcounter: string = "CashCounter";
    autocompleteModeDepartment : String = "Department";
    autocompleteModedoctorty: string = "ConDoctor";
    
    itemId = 0;

    
    constructor(
        public _ConfigurationService: ConfigurationService,
        public dialogRef: MatDialogRef<NewconfigComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
    
    ngOnInit(): void {
        this.myform = this._ConfigurationService.createConfigForm();
        if((this.data?.currencyId??0) > 0)
        {
            this.isActive=this.data.isActive
            this.myform.patchValue(this.data);
        }
    }
    
    onSubmit() {
        if (!this.myform.invalid) 
        {
            console.log("Currency JSON :-",this.myform.value);

            this._ConfigurationService.ConfigSave(this.myform.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
                }, (error) => {
                this.toastr.error(error.message);
                });
        }
        else
        {
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
        }
    }

    getValidationMessages() {
        return {
            registrationNo:[],
            ipNo:[],
            opNo:[],
            patientType:[],

        };
    }

    selectChangeItem(obj: any){
        console.log(obj);
        this.itemId=obj
    }

    getOptionTextPatient(option) {
        return option && option.PatientType ? option.PatientType : '';
    }

    onClear(val: boolean) {
        this.myform.reset();
        this.dialogRef.close(val);
    }

}
