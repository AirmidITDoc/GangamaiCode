import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ReportConfigurationService } from '../report-configuration.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CdkDragDrop, CdkDragMove, moveItemInArray } from '@angular/cdk/drag-drop';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { element } from 'protractor';
import { ReportList } from '../report-configuration.component';
import _ from 'lodash';

@Component({
  selector: 'app-new-report-configuration',
  templateUrl: './new-report-configuration.component.html',
  styleUrls: ['./new-report-configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewReportConfigurationComponent implements OnInit {

  isReportSectionSelected: boolean = false;
  vreportSectionId: any;
  ReportSectioncmbList: any = [];
  menuList: any = [];
  vreportName: any;
  filteredOptionsMenu: Observable<string[]>;
  filteredOptionsreportSection: Observable<string[]>;
  isMenuSelected: boolean = false;
  noOptionFound: boolean = false;
  vreportMode: any;
  vreportHeaderFile: any;
  vreportTitle: any;
  vreportSpname: any;
  vreportFilter: any;
  vreportFolderName: any;
  vreportFileName: any;
  dsReportGetList = new MatTableDataSource<ReportGetList>();
  reportPageOrientation: string[] = ["Portrait", "Landscape"];
  reportPageSize: string[] = ["A4", "C5"];
  reportBodyFile: string[] = ["MultiTotalReportFormat.html"];
  optionsReportSection: any[] = [];
  menuSection: any[] = [];
  registerObj = new ReportList({});
  vReportId = 0;
  selectedPageOrientation: any;
  selectedPageSize: any;
  vmenuId:any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild(CdkScrollable, { static: true }) scrollable!: CdkScrollable;

  displayedGetColumn: string[] = [
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

  constructor(
    public _ReportService: ReportConfigurationService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewReportConfigurationComponent>
  ) { }

  ngOnInit(): void {
    this.getMenuNameCombobox();
    this.getreportSectionDDList();
    this._ReportService.MyForm.markAllAsTouched()

    if (this.data) {
      this.registerObj = this.data.obj
      console.log("retrivedData:", this.registerObj)
      this.vReportId = this.registerObj.ReportId
      // const matched1 = this.menuSection.find(x => x.ReportId === this.registerObj.Parentid);
      // if (matched1) {
      //   this._ReportService.MyForm.get('reportSectionId').setValue(matched1);
      // }
      // const matched2 = this.optionsReportSection.find(x => x.Id === this.registerObj.MenuId);
      // if (matched2) {
      //   this._ReportService.MyForm.get('menuId').setValue(matched2);
      // }
      this.vreportSectionId=this.registerObj.Parentid
      this.vmenuId=this.registerObj.MenuId
      this.vreportName = this.registerObj.ReportName
      this.vreportMode = this.registerObj.ReportMode
      this.vreportTitle = this.registerObj.ReportTitle
      this.vreportHeaderFile = this.registerObj.ReportHeader
      this.vreportSpname = this.registerObj.ReportSPName
      this.vreportFilter = this.registerObj.ReportFilter
      this.vreportFolderName = this.registerObj.ReportFolderName
      this.vreportFileName = this.registerObj.ReportFileName
      this.selectedPageOrientation = this.registerObj.ReportPageOrientation
      this.selectedPageSize = this.registerObj.ReportPageSize
    }

    this._ReportService.MyForm.get('reportName')?.valueChanges.subscribe(value => {
      if (typeof value === 'string') {
        const noSpacesValue = value.replace(/\s+/g, '');
        this._ReportService.MyForm.patchValue({
          reportMode: noSpacesValue,
          reportTitle: noSpacesValue,
          reportFolderName: noSpacesValue,
          reportFileName: noSpacesValue
        }, { emitEvent: false });
      }
    });

    this.retriveData(this.data.obj)
    this.getMenuNameCombobox()
    this.getreportSectionDDList()
  }

  getreportSectionDDList() {
    this._ReportService.getReportSectionCombo().subscribe((data) => {
      this.ReportSectioncmbList = data;
      this.optionsReportSection = this.ReportSectioncmbList.slice();
      this.filteredOptionsreportSection = this._ReportService.MyForm.get('reportSectionId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterRS(value) : this.ReportSectioncmbList.slice()),
      );

      if (this.vreportSectionId) {        
        const RSValue = this.ReportSectioncmbList.find(item => item.Parentid == this.registerObj.Parentid);
        if (RSValue) {
          this._ReportService.MyForm.get('reportSectionId').setValue(RSValue);
          console.log("RSId:",RSValue)
        }
        this._ReportService.MyForm.updateValueAndValidity();
        return;
      }
    });
  }

  private _filterRS(value: any): any[] {
  let filterValue = '';

  if (value && typeof value === 'object' && value.ReportSection) {
    filterValue = value.ReportSection.toLowerCase();
  } else if (typeof value === 'string') {
    filterValue = value.toLowerCase();
  }

  return this.optionsReportSection.filter(option =>
    option.ReportSection.toLowerCase().includes(filterValue)
  );
}

  getOptionTextReportSection(option) {
    return option && option.ReportSection ? option.ReportSection : '';
  }

  getMenuNameCombobox() {
    this._ReportService.getMenuMasterComboList().subscribe((data) => {
      this.menuList = data;
      this.menuSection = this.menuList.slice();
      this.filteredOptionsMenu = this._ReportService.MyForm.get('menuId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterMenu(value) : this.menuList.slice()),
      );

      if (this.vmenuId) {        
        const MValue = this.menuList.find(item => item.Id == this.registerObj.MenuId);
        if (MValue) {
          this._ReportService.MyForm.get('menuId').setValue(MValue);
          console.log("RSId:",MValue)
        }
        this._ReportService.MyForm.updateValueAndValidity();
        return;
      }
    });

  }
  
  private _filterMenu(value: any): any[] {
  let filterValue = '';

  if (value && typeof value === 'object' && value.LinkName) {
    filterValue = value.LinkName.toLowerCase();
  } else if (typeof value === 'string') {
    filterValue = value.toLowerCase();
  }

  return this.menuSection.filter(option =>
    option.LinkName.toLowerCase().includes(filterValue)
  );
}

  getOptionTextMenu(option) {
    return option && option.LinkName ? option.LinkName : '';
  }

  getData() {
    if (!this._ReportService.MyForm.get('reportSpname').value) {
      this.toastr.warning('Enter Procedure to Retrive List')
    }
    let Procedure = this._ReportService.MyForm.get('reportSpname').value
    var SelectQuery = {
      "@ProcedureName": Procedure
    }
    this._ReportService.getReportGetList(SelectQuery).subscribe(Visit => {
      this.dsReportGetList.data = Visit["Table"] ?? [] as ReportGetList[];
      this.dsReportGetList.sort = this.sort;
      this.dsReportGetList.paginator = this.paginator;
    });
  }

  retriveData(row) {
    var SelectQuery = {
       "@ReportId": row.ReportId
    }
    console.log(SelectQuery);
    this._ReportService.getReportRetriveList(SelectQuery).subscribe(Visit => {
       this.dsReportGetList.data = Visit["Table"] ?? [] as ReportGetList[];
      this.dsReportGetList.sort = this.sort;
      this.dsReportGetList.paginator = this.paginator;
    });
  }

  onIsDisplayChange(row, event) {
    console.log(row)
    console.log(event)
    console.log(this.dsReportGetList.data)
  }

  drop(event: CdkDragDrop<any[]>) {
    const data = this.dsReportGetList.data; // Extract raw array from MatTableDataSource
    moveItemInArray(data, event.previousIndex, event.currentIndex);
    this.dsReportGetList.data = data; // Update table with reordered data
  }

  onDisplayColumnChange(event: any, element: any) {
    if (!event.checked) {
      element.ReportColumnWidth = 0;
      element.ReportColumnAligment = "";
    }
  }

  ReportColumnWidthfunction(element) {
    console.log(element)
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

  onDragMoved(event: CdkDragMove) {
    const scrollContainer = this.scrollable.getElementRef().nativeElement;
    const scrollRect = scrollContainer.getBoundingClientRect();
    const pointerY = event.pointerPosition.y;

    const edgeMargin = 60; // px from top/bottom where scrolling starts
    const scrollSpeed = 40; // 🔥 increase for faster scrolling

    if (pointerY < scrollRect.top + edgeMargin) {
      scrollContainer.scrollTop -= scrollSpeed;
    } else if (pointerY > scrollRect.bottom - edgeMargin) {
      scrollContainer.scrollTop += scrollSpeed;
    }
  }

  onAlignChange(element: any) {
    console.log('Alignment changed to:', element.reportAlign);
    // Optionally update backend or perform other actions
  }

  onSave() {
    if (this._ReportService.MyForm.get('reportSectionId').value == '' || this._ReportService.MyForm.get('reportSectionId').value == null) {
      this.toastr.warning('Please Select Report Section  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._ReportService.MyForm.get('reportSectionId').value) {
      if (!this.ReportSectioncmbList.find(item => item.Parentid == this._ReportService.MyForm.get('reportSectionId').value.Parentid)) {
        this.toastr.warning('Please select Valid Report Section', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.vreportName == '' || this.vreportName == null || this.vreportName == undefined) {
      this.toastr.warning('Please enter Report Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._ReportService.MyForm.get('menuId').value == '' || this._ReportService.MyForm.get('menuId').value == null) {
      this.toastr.warning('Please Select Menu Name  ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._ReportService.MyForm.get('menuId').value) {
      if (!this.menuList.find(item => item.Id == this._ReportService.MyForm.get('menuId').value.Id)) {
        this.toastr.warning('Please select Valid Menu Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.vreportMode == '' || this.vreportMode == null || this.vreportMode == undefined) {
      this.toastr.warning('Please enter Report Mode ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vreportTitle == '' || this.vreportTitle == null || this.vreportTitle == undefined) {
      this.toastr.warning('Please enter Report Title ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vreportHeaderFile == '' || this.vreportHeaderFile == null || this.vreportHeaderFile == undefined) {
      this.toastr.warning('Please enter Report Header File ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vreportSpname == '' || this.vreportSpname == null || this.vreportSpname == undefined) {
      this.toastr.warning('Please enter Report Procedure Name ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vreportFolderName == '' || this.vreportFolderName == null || this.vreportFolderName == undefined) {
      this.toastr.warning('Please enter Report Folder Name ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vreportFileName == '' || this.vreportFileName == null || this.vreportFileName == undefined) {
      this.toastr.warning('Please enter Report File Name ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.selectedPageOrientation == '' || this.selectedPageOrientation == null || this.selectedPageOrientation == undefined) {
      this.toastr.warning('Please select Report Page Orientation ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.selectedPageSize == '' || this.selectedPageSize == null || this.selectedPageSize == undefined) {
      this.toastr.warning('Please select Report Page Size ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    for (let i = 0; i < this.dsReportGetList.data.length; i++) {
      const row = this.dsReportGetList.data[i];

      if (row.IsDisplayColumn === true) {
        if (
          row.ReportHeaderName === "" ||
          row.ReportColumnWidth === 0 ||
          row.ReportColumnAligment === ""
        ) {
          this.toastr.warning(
            `Row ${i + 1}: Please fill Report Header, Report Column Width, and Report Alignment`
          );
          return;
        }
      }
    }

    let reportDetailarray = [];
    this.dsReportGetList.data.forEach((item: any, index: number) => {
      let insertReportDet = {};
      insertReportDet["reportColId"] = 0,
        insertReportDet["reportId"] = 0,
        insertReportDet["isDisplayColumn"] = item.IsDisplayColumn,
        insertReportDet["reportHeader"] = item.ReportHeaderName ?? item.ReportHeader ?? "",
        insertReportDet["reportColumn"] = item.ReportColumn ?? '',
        insertReportDet["reportColumnWidth"] = String(item.ReportColumnWidth) ?? '',
        insertReportDet["reportColumnAligment"] = item.ReportColumnAligment ?? '',
        insertReportDet["reportTotalField"] = String(item.ReportTotalField) ?? '0',
        insertReportDet["reportGroupByLabel"] = String(item.ReportGroupByLabel) ?? '0',
        insertReportDet["summaryLabel"] = item.SummaryLabel ?? '',
        insertReportDet["sequenceNo"] = index + 1,
        insertReportDet["procedureName"] = item.procedureName ?? ''
      reportDetailarray.push(insertReportDet);
    })
    debugger

    if (this.vReportId === 0) {
      var m_insertdata = {
        "reportId": 0,
        "reportSection": this._ReportService.MyForm.get('reportSectionId').value.ReportSection,
        "reportName": this._ReportService.MyForm.get('reportName').value,
        "parentid": this._ReportService.MyForm.get('reportSectionId').value.Parentid,
        "reportMode": this._ReportService.MyForm.get('reportMode').value,
        "reportTitle": this._ReportService.MyForm.get('reportTitle').value,
        "reportHeader": this._ReportService.MyForm.get('reportHeader').value,
        "reportColumn": "string",
        "reportTotalField": "string",
        "reportGroupByLabel": "string",
        "summaryLabel": "string",
        "reportHeaderFile": this._ReportService.MyForm.get('reportHeaderFile').value,
        "reportBodyFile": this._ReportService.MyForm.get('reportBodyFile').value,
        "reportFolderName": this._ReportService.MyForm.get('reportFolderName').value,
        "reportFileName": this._ReportService.MyForm.get('reportFileName').value,
        "reportSPName": this._ReportService.MyForm.get('reportSpname').value,
        "reportPageOrientation": this._ReportService.MyForm.get('reportPageOrientation').value,
        "reportPageSize": this._ReportService.MyForm.get('reportPageSize').value,
        "reportColumnWidths": "string",
        "reportFilter": this._ReportService.MyForm.get('reportFilter').value || "string",
        "isActive": true,
        "createdBy": this._loggedService.currentUserValue.user.id,
        "updateBy": 0,
        "menuId": this._ReportService.MyForm.get('menuId').value.Id
      }

      let submitData = {
        "insertReportConfig": m_insertdata,
        "insertReportconfigDetails": reportDetailarray
      }
      console.log("Save payload:", submitData);
      this._ReportService.ReportInsert(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.OnReset()
        } else {
          this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }
    else {
      debugger

      var m_updatedata = {
        "reportId": this.vReportId,
        "reportSection": this._ReportService.MyForm.get('reportSectionId').value.ReportSection,
        "reportName": this._ReportService.MyForm.get('reportName').value,
        "parentid": this._ReportService.MyForm.get('reportSectionId').value.Parentid,
        "reportMode": this._ReportService.MyForm.get('reportMode').value,
        "reportTitle": this._ReportService.MyForm.get('reportTitle').value,
        "reportHeader": this._ReportService.MyForm.get('reportHeader').value,
        "reportColumn": "string",
        "reportTotalField": "string",
        "reportGroupByLabel": "string",
        "summaryLabel": "string",
        "reportHeaderFile": this._ReportService.MyForm.get('reportHeaderFile').value,
        "reportBodyFile": this._ReportService.MyForm.get('reportBodyFile').value,
        "reportFolderName": this._ReportService.MyForm.get('reportFolderName').value,
        "reportFileName": this._ReportService.MyForm.get('reportFileName').value,
        "reportSpname": this._ReportService.MyForm.get('reportSpname').value,
        "reportPageOrientation": this._ReportService.MyForm.get('reportPageOrientation').value,
        "reportPageSize": this._ReportService.MyForm.get('reportPageSize').value,
        "reportColumnWidths": "string",
        "reportFilter": this._ReportService.MyForm.get('reportFilter').value || "string",
        "isActive": true,
        "createdBy": 0,
        "updateBy": this._loggedService.currentUserValue.user.id,
        "menuId": this._ReportService.MyForm.get('menuId').value.Id
      }

      let updateData = {
        "updateReportConfig": m_updatedata,
        "insertReportconfigDetails": reportDetailarray
      }
      console.log("update Payload:", updateData)
      this._ReportService.ReportUpdate(updateData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.OnReset()
        }
        else {
          this.toastr.error('Record not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }

      });

    }

  }

  onClose() {
    this._matDialog.closeAll();
    this._ReportService.MyForm.get('menuId').setValue('')
    this._ReportService.MyForm.get('reportSectionId').setValue('')
  }

  OnReset() {
    this._ReportService.MyForm.reset();
    this._ReportService.MyForm.get('reportSectionId').setValue('')
    this._ReportService.MyForm.get('menuId').setValue('')
    this.dialogRef.close();
  }

  @ViewChild('RPname') RPname: ElementRef;
  @ViewChild('Mname') Mname: ElementRef;
  @ViewChild('RMname') RMname: ElementRef;
  @ViewChild('RTname') RTname: ElementRef;
  @ViewChild('RHFname') RHFname: ElementRef;
  @ViewChild('SPname') SPname: ElementRef;
  @ViewChild('RFname') RFname: ElementRef;
  @ViewChild('RFNname') RFNname: ElementRef;
  @ViewChild('RFiNname') RFiNname: ElementRef;

  public onEnterReportSection(event): void {
    if (event.which === 13) {
      this.RPname.nativeElement.focus();
    }
  }
  public onEnterRname(event): void {
    if (event.which === 13) {
      this.Mname.nativeElement.focus();
    }
  }
  public onEnterMname(event): void {
    if (event.which === 13) {
      this.RMname.nativeElement.focus();
    }
  }
  public onEnterRMname(event): void {
    if (event.which === 13) {
      this.RTname.nativeElement.focus();
    }
  }
  public onEnterRTname(event): void {
    if (event.which === 13) {
      this.RHFname.nativeElement.focus();
    }
  }
  public onEnterRHFname(event): void {
    if (event.which === 13) {
      this.SPname.nativeElement.focus();
    }
  }
  public onEnterSPname(event): void {
    if (event.which === 13) {
      this.RFname.nativeElement.focus();
    }
  }
  public onEnterRFame(event): void {
    if (event.which === 13) {
      this.RFNname.nativeElement.focus();
    }
  }
  public onEnterRFNname(event): void {
    if (event.which === 13) {
      this.RFiNname.nativeElement.focus();
    }
  }
  public onEnterRFiNname(event): void {
    if (event.which === 13) {
      this.RFiNname.nativeElement.focus();
    }
  }

}

export class ReportGetList {
  isDisplay: any
  ReportHeader: any;
  ReportColumn: any;
  ReportWidth: any;
  ReportAlign: any;
  totalField: any;
  groupBy: any;
  summery: any;
  sequence: any;
  FieldColumnName: any;
  ValueColumnName: any;
  IsDisplayColumn: any;
  ReportHeaderName: any;
  ReportColumnWidth: any;
  ReportColumnAligment: any;
  ReportTotalField: any;
  ReportGroupByLabel: any;


  constructor(ReportGetList) {
    {
      this.isDisplay = ReportGetList.isDisplay || 0
      this.ReportHeader = ReportGetList.ReportHeader || 0
      this.ReportColumn = ReportGetList.ReportColumn || 0
      this.ReportWidth = ReportGetList.ReportWidth || 0
      this.ReportAlign = ReportGetList.ReportAlign || 0
      this.totalField = ReportGetList.totalField || 0
      this.groupBy = ReportGetList.groupBy || 0
      this.summery = ReportGetList.summery || 0
      this.sequence = ReportGetList.sequence || 0
      this.FieldColumnName = ReportGetList.FieldColumnName || ''
      this.ValueColumnName = ReportGetList.ValueColumnName || ''
      this.IsDisplayColumn = ReportGetList.IsDisplayColumn || ''
      this.ReportHeaderName = ReportGetList.ReportHeaderName || ''
      this.ReportColumnWidth = ReportGetList.ReportColumnWidth || ''
      this.ReportColumnAligment = ReportGetList.ReportColumnAligment || ''
      this.ReportTotalField = ReportGetList.ReportTotalField || ''
      this.ReportGroupByLabel = ReportGetList.ReportGroupByLabel || ''
    }
  }
}
