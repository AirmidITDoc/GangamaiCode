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

    reportPageOrientation: string[] = ["Portrait (Vertical)", "Landscape (Horizontal)"];
    reportPageSize: string[] = ["A1", "A2", "A3", "A4", "C4", "C5", "C6"];

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
            reportSection: [
                { name: "required", Message: "Report Section is required" },
                { name: "maxlength", Message: "Report Section should not be greater than 30 char." },
                { name: "pattern", Message: "Only Characters and Spaces Allowed." }
            ],
            reportName:[
                { name: "required", Message: "Report Name is required" },
                { name: "maxlength", Message: "Report Name should not be greater than 30 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            parentid:[
                { name: "required", Message: "Parent ID is required" },
                { name: "maxlength", Message: "Parent ID should not be greater than 10 Numbers." },
                { name: "pattern", Message: "Only Numbers Allowed." }
            ],
            reportMode:[
                { name: "required", Message: "Report Name is required" },
                { name: "maxlength", Message: "Report Name should not be greater than 30 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            reportTitle:[
                { name: "required", Message: "Report Title is required" },
                { name: "maxlength", Message: "Report Title should not be greater than 30 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            reportHeader:[
                { name: "required", Message: "Report Header is required" },
                { name: "maxlength", Message: "Report Header should not be greater than 100 char." },
            ],
            reportColumn:[
                { name: "required", Message: "Report column is required" },
                { name: "maxlength", Message: "Report Column should not be greater than 100 char." },
            ],
            reportHeaderFile:[
                { name: "required", Message: "Report Header File is required" },
                { name: "maxlength", Message: "Report Header File should not be greater than 30 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            reportBodyFile:[
                { name: "required", Message: "Report Body File is required" },
                { name: "maxlength", Message: "Report Body File should not be greater than 30 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            reportFolderName: [
                { name: "required", Message: "Report Folder Name is required" },
                { name: "maxlength", Message: "Report Folder Name should not be greater than 30 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            reportFileName:[
                { name: "required", Message: "Report File Name is required" },
                { name: "maxlength", Message: "Report File Name should not be greater than 30 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            reportSpname:[
                { name: "required", Message: "Report SP Name is required" },
                { name: "maxlength", Message: "Report SP Name should not be greater than 30 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            reportPageOrientation:[
                { name: "required", Message: "Report Page Orientation is required" },
            ],
            reportPageSize:[
                { name: "required", Message: "Report Page Size is required" },
            ],
            reportFilter:[
                { name: "required", Message: "Report Filter is required" },
                { name: "maxlength", Message: "Report Filter should not be greater than 30 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
        };
    }

    onClear(val: boolean) 
    {
        this.dialogRef.close(val);
    }


}
