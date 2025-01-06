import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { TariffMasterService } from '../tariff-master.service';
import { UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-tariff',
    templateUrl: './new-tariff.component.html',
    styleUrls: ['./new-tariff.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewTariffComponent implements OnInit {

    tariffForm: UntypedFormGroup;
    isActive:boolean=true;
    saveflag : boolean = false;

    constructor(
        public _TariffMasterService: TariffMasterService,
        public dialogRef: MatDialogRef<NewTariffComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.tariffForm=this._TariffMasterService.createTariffForm();
        if(this.data){
            this.isActive=this.data.isActive
            this.tariffForm.patchValue(this.data);
        }
    }

    onSubmit(){
        debugger
        if(!this.tariffForm.invalid)
        {
            this.saveflag = true;
        
            console.log("insert tariff:", this.tariffForm.value);
            
            this._TariffMasterService.tariffMasterSave(this.tariffForm.value).subscribe((response)=>{
            this.toastr.success(response.message);
            this.onClear(true);
            }, (error)=>{
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

    onClear(val: boolean) {
        this.tariffForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages(){
        return{
            tariffName: [
                { name: "required", Message: "Tariff Name is required" },
                { name: "maxlength", Message: "Tariff Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        }
    }
}
