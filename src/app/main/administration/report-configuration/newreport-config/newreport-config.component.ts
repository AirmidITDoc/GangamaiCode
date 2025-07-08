import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ReportConfigurationService } from '../report-configuration.service';
import { MatTableDataSource } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { element } from 'protractor';


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
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _ReportConfigurationService: ReportConfigurationService,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<NewreportConfigComponent>
  ) { }

  ngOnInit(): void {
    this.myform = this.createReportForm();
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

    this.reportDetailsArray.push(this.createReportDetail());
  }

  createReportForm(): FormGroup {
          return this.formBuilder.group({
          reportSectionId: [0,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
  
              reportId: [0],
              reportSection: ["",[]],

              reportName: ["", [Validators.required,Validators.maxLength(500),
                      Validators.pattern("^[A-Za-z @#&]+$")]],

              parentid: ["",[Validators.required,Validators.maxLength(10), 
                  Validators.pattern('^[0-9]*$')]],

              reportMode: ["",[Validators.required,Validators.maxLength(500),
                      Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")]],

              reportTitle: ["",[Validators.required,Validators.maxLength(500),
                      Validators.pattern("^[A-Za-z @#&]+$")]],

              reportHeader: ["",[]],

              reportColumn: ["",[]],
  
              reportTotalField: [""],

              reportGroupByLabel: [""],

              summaryLabel:[""],

              reportHeaderFile: ["",[Validators.required,Validators.maxLength(500),
                      Validators.pattern("^[A-Za-z .,@$&]+$") ]],

              reportBodyFile: ["MultiTotalReportFormat.html",[Validators.required,Validators.maxLength(500)]],

              reportFolderName: ["",[Validators.required,Validators.maxLength(500)]],

              reportFileName: ["",[Validators.required,Validators.maxLength(500)]],
              
              reportSpname: ["",[Validators.required,Validators.maxLength(500)]],

              reportPageOrientation: ["", [Validators.required]],

              reportPageSize: ["", [Validators.required]],

              reportColumnWidths: [""],

              reportFilter: ["",[ Validators.maxLength(500)]],

              isActive:[true,[Validators.required]],

              menuId: [0,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],

              mReportConfigDetails:this.formBuilder.array([]),

          });
      }

  createReportDetail(item: any = {}): FormGroup {
    return this.formBuilder.group({
      reportColId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      reportId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isDisplayColumn: [item.isDisplay ?? false],
      reportHeader: [item.reportHeader ?? ''],
      reportColumn: [item.ReportColumn ?? ''],
      reportColumnWidth: [item.reportColumnWidth ?? ''],
      reportColumnAligment: [item.reportAlign ?? ''],
      reportTotalField: [item.reportTotalField ?? '0'],
      reportGroupByLabel: [item.reportGroupByLabel ?? '0'],
      summaryLabel: [item.summaryLabel ?? ''],
      sequenceNo: [item.sequence ?? 0],
      procedureName: [item.procedureName ?? '']
    });
  }

   get reportDetailsArray(): FormArray {
      return this.myform.get('mReportConfigDetails') as FormArray;
    }
      
  getData() {
    // debugger
    if(!this.myform.get('reportSpname').value){
      this.toastr.warning('Enter Procedure to Retrive List')
    }
    let Procedure = this.myform.get('reportSpname').value
    console.log(Procedure)
    var SelectQuery = {
      "searchFields": [
        {
          "fieldName": "ProcedureName",
          "fieldValue": String(Procedure), //"ps_rptListofRegistration", //"ps_rptopappointmentlistreport",
          "opType": "Equals"
        }
      ],
      "mode": "GetProcedureReportcol"
    }
    console.log(SelectQuery);
    this._ReportConfigurationService.getReportList(SelectQuery).subscribe(Visit => {
      this.dsReportList.data = Visit as ReportList[];
      console.log(this.dsReportList.data)
      this.dsReportList.sort = this.sort;
      this.dsReportList.paginator = this.paginator;
    });
  }

onIsDisplayChange(row,event){
  console.log(row)
  console.log(event)
  console.log(this.dsReportList.data)
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

  changefunction(element){
    console.log(element)
  }

  ReportColumnWidthfunction(element){
    console.log(element)
  }

  onSubmit() {
    for (let i = 0; i < this.dsReportList.data.length; i++) {
  const row = this.dsReportList.data[i];

  if (row.IsDisplayColumn === true) {
    if (
      row.ReportHeaderName === "" ||
      row.ReportColumnWidth === 0 //||
      // row.ReportColumnAligment === ""
    ) {
      this.toastr.warning(
        `Row ${i + 1}: Please fill Report Header, Report Column Width, and Report Alignment`
      );
      return;
    }
  }
}

    if (!this.myform.invalid) {
      this.myform.get('reportSection')?.setValue(this.reportName)
      this.myform.removeControl('reportSectionId')
debugger
      this.reportDetailsArray.clear();
      this.dsReportList.data.forEach(item => {
        this.reportDetailsArray.push(this.createReportDetail(item));
      });

      console.log("Report-Config JSON :-", this.myform.value);
      this._ReportConfigurationService.insertNewReportConfig(this.myform.value).subscribe((data) => {
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

  onAlignChange(element: any) {
    console.log('Alignment changed to:', element.reportAlign);
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

   keyPressCharater(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
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
  FieldColumnName:any;
  ValueColumnName:any;
IsDisplayColumn:any;
ReportHeaderName:any;
ReportColumnWidth:any;
ReportColumnAligment:any;

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
      this.FieldColumnName = ReportList.FieldColumnName || ''
      this.ValueColumnName = ReportList.ValueColumnName || ''
      this.IsDisplayColumn = ReportList.IsDisplayColumn || ''
      this.ReportHeaderName = ReportList.ReportHeaderName || ''
      this.ReportColumnWidth = ReportList.ReportColumnWidth || ''
      this.ReportColumnAligment = ReportList.ReportColumnAligment || ''
    }
  }
}
