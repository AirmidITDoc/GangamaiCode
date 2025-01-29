import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ReportConfigurationService } from '../report-configuration.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReportConfigurationComponent } from '../report-configuration.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-report-configuration',
    templateUrl: './new-report-configuration.component.html',
    styleUrls: ['./new-report-configuration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewReportConfigurationComponent implements OnInit{
    myform: FormGroup;
    isActive:boolean=true;

    constructor(
        public _ReportConfigurationService: ReportConfigurationService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ReportConfigurationComponent>
    ) { }
    
    ngOnInit(): void {
        this.myform = this._ReportConfigurationService.createForm();
        if((this.data?.reportId??0) > 0)
        {
            this.isActive=this.data.isActive
            this.myform.patchValue(this.data);
        }
    }

    onSubmit() {
        if (!this.myform.invalid) 
        {
            console.log("Report-Config JSON :-", this.myform.value);
            debugger
            this._ReportConfigurationService.insertReportConfig(this.myform.value).subscribe((data) => {
            this.toastr.success(data.message);
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
            reportSection: [],
            reportName:[],
            parentid:[],
            reportTitle:[],
            reportHeader:[],
            reportColumn:[],
            reportHeaderFile:[],
            reportBodyFile:[],
            reportFolderName: [],
            reportFileName:[],
            reportSPName:[],
            reportPageOrientation:[],
            reportPageSize:[],
        };
    }

    onClear(val: boolean) 
    {
        this.dialogRef.close(val);
    }


}
