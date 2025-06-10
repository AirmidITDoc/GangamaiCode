import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ReportConfigurationComponent } from '../report-configuration.component';
import { ReportConfigurationService } from '../report-configuration.service';

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

    reportPageOrientation: string[] = ["Portrait", "Landscape"];
    reportPageSize: string[] = ["A4", "C5"];
    reportBodyFile: string[] = ["SimpleReportFormat.html", "SimpleTotalReportFormat.html","MultiTotalReportFormat.html"];

    constructor(
        public _ReportConfigurationService: ReportConfigurationService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ReportConfigurationComponent>
    ) { }
    
    ngOnInit(): void {
        this.myform = this._ReportConfigurationService.createForm();
        this.myform.markAllAsTouched();
        if((this.data?.reportId??0) > 0)
        {
            this.isActive=this.data.isActive
            this.myform.patchValue(this.data);
        }

        // Listen to changes on 'reportSection' and update other fields
        this.myform.get('reportName')?.valueChanges.subscribe(value => {
            const noSpacesValue = value.replace(/\s+/g, '');
            this.myform.patchValue({
                reportMode: noSpacesValue,
                reportTitle: noSpacesValue,
                reportFolderName: noSpacesValue,
                reportFileName: noSpacesValue
                // Add any other fields you want to auto-fill
            }, { emitEvent: false }); // Avoid infinite loop
        });
    }

    onSubmit() {
        console.log("Report-Config JSON :-", this.myform.value);
        if (!this.myform.invalid) 
        {
            console.log("Report-Config JSON :-", this.myform.value);
            this._ReportConfigurationService.insertReportConfig(this.myform.value).subscribe((data) => {
                this.onClear(true);
            });
        } 
       else {
            let invalidFields = [];
            if (this.myform.invalid) {
                for (const controlName in this.myform.controls) {
                    if (this.myform.controls[controlName].invalid) { invalidFields.push(`Report Form: ${controlName}`); }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
            }

        }
    }

    getValidationMessages() {
        return {
            reportSection: [
                { name: "required", Message: "Report Section is required" },
                { name: "maxlength", Message: "Report Section should not be greater than 50 char." },
                { name: "pattern", Message: "Only Characters and Spaces Allowed." }
            ],
            reportName:[
                { name: "required", Message: "Report Name is required" },
                { name: "maxlength", Message: "Report Name should not be greater than 200 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            parentid:[
                { name: "required", Message: "Parent ID is required" },
                { name: "maxlength", Message: "Parent ID should not be greater than 10 Numbers." },
                { name: "pattern", Message: "Only Numbers Allowed." }
            ],
            reportMode:[
                { name: "required", Message: "Report Name is required" },
                { name: "maxlength", Message: "Report Name should not be greater than 200 char." },
                // { name: "pattern", Message: "Only Characters Allowed." }
            ],
            reportTitle:[
                { name: "required", Message: "Report Title is required" },
                { name: "maxlength", Message: "Report Title should not be greater than 500 char." },
                // { name: "pattern", Message: "Only Characters Allowed." }
            ],
            reportHeader:[
                { name: "required", Message: "Report Header is required" },
                { name: "maxlength", Message: "Report Header should not be greater than 1000 char." },
            ],
            reportTotalField:[
                // { name: "required", Message: "Report column is required" },
                // { name: "maxlength", Message: "Report Column should not be greater than 100 char." },
            ],
             summaryLabel:[
                { name: "maxlength", Message: "Report Column should not be greater than 1000 char." },
            ],
            reportColumn:[
                { name: "required", Message: "Report column is required" },
                { name: "maxlength", Message: "Report Column should not be greater than 1000 char." },
            ],
            reportGroupByLabel:[
                // { name: "required", Message: "Report column is required" },
                // { name: "maxlength", Message: "Report Column should not be greater than 100 char." },
            ],
            reportHeaderFile:[
                { name: "required", Message: "Report Header File is required" },
                { name: "maxlength", Message: "Report Header File should not be greater than 100 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            reportBodyFile:[
                { name: "required", Message: "Report Body File is required" },
                { name: "maxlength", Message: "Report Body File should not be greater than 200 char." },
            ],
            reportFolderName: [
                { name: "required", Message: "Report Folder Name is required" },
                { name: "maxlength", Message: "Report Folder Name should not be greater than 200 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ],
            reportFileName:[
                { name: "required", Message: "Report File Name is required" },
                { name: "maxlength", Message: "Report File Name should not be greater than 200 char." },
            ],
            reportSpname:[
                { name: "required", Message: "Report SP Name is required" },
                { name: "maxlength", Message: "Report SP Name should not be greater than 500 char." },
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
