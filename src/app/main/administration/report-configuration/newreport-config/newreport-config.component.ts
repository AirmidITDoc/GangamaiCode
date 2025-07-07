import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ReportConfigurationService } from '../report-configuration.service';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-newreport-config',
  templateUrl: './newreport-config.component.html',
  styleUrls: ['./newreport-config.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewreportConfigComponent {
  myform: FormGroup;
  isActive: boolean = true;
  autocompleteModedReport: string = "ReportConfig";
  autocompleteModedMenu: string = "MenuMaster";

  reportPageOrientation: string[] = ["Portrait", "Landscape"];
  reportPageSize: string[] = ["A4", "C5"];
  reportBodyFile: string[] = ["MultiTotalReportFormat.html"];
  reportName = ''
  reportId = 0
  menuName = ''
  menuId = 0;
  displayedColumn: string[] = [
    'isDisplay',
    'ReportHeader',
    'ReportColumn',
    'ReportColumnWidth',
    'ReportAlign',
    'ReporttotalField',
    'ReportgroupByLabel',
    'summaryLabel',
    'sequence'
  ]
  dsReportList = new MatTableDataSource<ReportList>();

  constructor(
    public _ReportConfigurationService: ReportConfigurationService,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewreportConfigComponent>
  ) { }

  ngOnInit(): void {
    this.myform = this._ReportConfigurationService.createForm();
    this.myform.markAllAsTouched();
    if ((this.data?.reportId ?? 0) > 0) {
      this.myform.get('reportSectionId').setValue(this.data.parentid)
      this.reportName = this.data.reportSection
      this.isActive = this.data.isActive
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

  getData() {

  }

  drop(event: CdkDragDrop<any[]>) {
    const data = this.dsReportList.data; // Extract raw array from MatTableDataSource
    moveItemInArray(data, event.previousIndex, event.currentIndex);
    this.dsReportList.data = data; // Update table with reordered data
  }

  ListView(obj: any) {
    console.log(obj)
    this.reportId = obj.value
    this.reportName = obj.text
    this.myform.get('parentid')?.setValue(this.reportId)
  }

  ListView1(obj: any) {
    console.log(obj)
    this.menuId = obj.value
    this.menuName = obj.text
    this.myform.get('menuId')?.setValue(this.menuId)
  }

  onSubmit() {
    if (!this.myform.invalid) {
      this.myform.get('reportSection')?.setValue(this.reportName)
      this.myform.removeControl('reportSectionId')
      console.log("Report-Config JSON :-", this.myform.value);
      // this._ReportConfigurationService.insertReportConfig(this.myform.value).subscribe((data) => {
      //     this.onClear(true);
      // });
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

  onAlignChange(element: any) {
    console.log('Alignment changed to:', element.ReportAlign);
    // Optionally update backend or perform other actions
  }

  getValidationMessages() {
    return {
      reportSection: [
        { name: "required", Message: "Report Section is required" },
        { name: "maxlength", Message: "Report Section should not be greater than 50 char." },
        { name: "pattern", Message: "Only Characters and Spaces Allowed." }
      ],
      reportName: [
        { name: "required", Message: "Report Name is required" },
        { name: "maxlength", Message: "Report Name should not be greater than 200 char." },
        { name: "pattern", Message: "Only Characters Allowed." }
      ],
      parentid: [
        { name: "required", Message: "Parent ID is required" },
        { name: "maxlength", Message: "Parent ID should not be greater than 10 Numbers." },
        { name: "pattern", Message: "Only Numbers Allowed." }
      ],
      reportMode: [
        { name: "required", Message: "Report Name is required" },
        { name: "maxlength", Message: "Report Name should not be greater than 200 char." },
        // { name: "pattern", Message: "Only Characters Allowed." }
      ],
      reportTitle: [
        { name: "required", Message: "Report Title is required" },
        { name: "maxlength", Message: "Report Title should not be greater than 500 char." },
        // { name: "pattern", Message: "Only Characters Allowed." }
      ],
      reportHeader: [
        { name: "required", Message: "Report Header is required" },
        { name: "maxlength", Message: "Report Header should not be greater than 1000 char." },
      ],
      reportTotalField: [
        // { name: "required", Message: "Report column is required" },
        // { name: "maxlength", Message: "Report Column should not be greater than 100 char." },
      ],
      summaryLabel: [
        { name: "maxlength", Message: "Report Column should not be greater than 2000 char." },
      ],
      reportColumnWidths: [
        { name: "required", Message: "Report Column Widths is required" },
        { name: "maxlength", Message: "Report Column Widths should not be greater than 2000 char." },
      ],
      reportColumn: [
        { name: "required", Message: "Report column is required" },
        { name: "maxlength", Message: "Report Column should not be greater than 2000 char." },
      ],
      reportGroupByLabel: [
        // { name: "required", Message: "Report column is required" },
        // { name: "maxlength", Message: "Report Column should not be greater than 100 char." },
      ],
      reportHeaderFile: [
        { name: "required", Message: "Report Header File is required" },
        { name: "maxlength", Message: "Report Header File should not be greater than 100 char." },
        { name: "pattern", Message: "Only Characters Allowed." }
      ],
      reportBodyFile: [
        { name: "required", Message: "Report Body File is required" },
        { name: "maxlength", Message: "Report Body File should not be greater than 200 char." },
      ],
      reportFolderName: [
        { name: "required", Message: "Report Folder Name is required" },
        { name: "maxlength", Message: "Report Folder Name should not be greater than 200 char." },
        { name: "pattern", Message: "Only Characters Allowed." }
      ],
      reportFileName: [
        { name: "required", Message: "Report File Name is required" },
        { name: "maxlength", Message: "Report File Name should not be greater than 200 char." },
      ],
      reportSpname: [
        { name: "required", Message: "Report SP Name is required" },
        { name: "maxlength", Message: "Report SP Name should not be greater than 500 char." },
      ],
      reportPageOrientation: [
        { name: "required", Message: "Report Page Orientation is required" },
      ],
      reportPageSize: [
        { name: "required", Message: "Report Page Size is required" },
      ],
      reportFilter: [
        { name: "required", Message: "Report Filter is required" },
        { name: "maxlength", Message: "Report Filter should not be greater than 30 char." },
        { name: "pattern", Message: "Only Characters Allowed." }
      ],
    };
  }

  onClear(val: boolean) {
    this.dialogRef.close(val);
  }
}

export class ReportList {
  isDisplay: any
  ReportHeader: any;
  ReportColumn: any;
  ReportWidth: any;
  ReportAlign: any;
  totalField: any;
  groupBy: any;
  summery: any;
  sequence: any;


  /**
  * Constructor
  *
  * @param ReportList
  */
  constructor(ReportList) {
    {
      this.isDisplay = ReportList.isDisplay || 0
      this.ReportHeader = ReportList.ReportHeader || 0
      this.ReportColumn = ReportList.ReportColumn || 0
      this.ReportWidth = ReportList.ReportWidth || 0
      this.ReportAlign = ReportList.ReportAlign || 0
      this.totalField = ReportList.totalField || 0
      this.groupBy = ReportList.groupBy || 0
      this.summery = ReportList.summery || 0
      this.sequence = ReportList.sequence || 0
    }
  }
}
