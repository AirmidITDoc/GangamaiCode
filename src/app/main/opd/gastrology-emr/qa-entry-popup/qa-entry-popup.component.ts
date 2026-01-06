import { Component, ElementRef, HostListener, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatAccordion } from '@angular/material/expansion';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ConfigService } from 'app/core/services/config.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CasepaperService } from '../../new-casepaper/casepaper.service';

@Component({
  selector: 'app-qa-entry-popup',
  templateUrl: './qa-entry-popup.component.html',
  styleUrls: ['./qa-entry-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class QAEntryPopupComponent {

  dataSource = new MatTableDataSource<QuesResult>();
  // helpList = new MatTableDataSource<QuesResult>();

  displayedColumns: string[] = [
    'sequence',
    'question',
    'value',
  ];
  displayedColumns1: string[] = [
    'shortcut',
    'name',
  ];
  showList = false;
  selectedRow: any;

  constructor(private formBuilder: UntypedFormBuilder,
    public _CasepaperService: CasepaperService,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<QAEntryPopupComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private advanceDataStored: AdvanceDataStored,
    private configService: ConfigService,
    private commonService: PrintserviceService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private _fuseSidebarService: FuseSidebarService) { }

  ngOnInit(): void {

    console.log("Question data:", this.data)

    this.getResultList1(this.data)
  }

  getResultList1(data) {

    var SelectQuery =
    {
      "searchFields": [
        {
          "fieldName": "QuestionId",
          "fieldValue": String(data.questionId),
          "opType": "Equals"
        }
      ],
      "mode": "subQuestionList"
    }

    console.log(SelectQuery);

    this._CasepaperService.getSubquesByIdList(SelectQuery).subscribe(Visit => {

      this.dataSource.data = Visit as QuesResult[];
      // this.dataSource.mSubQuestionValuesMasters = Visit as QuesResult[];
      console.log(this.dataSource.data)
    });
  }

  helpList: QuesResult[] = [];
  filteredHelpList: QuesResult[] = [];

  openList(contact: any) {
    this.selectedRow = contact;
    this.helpList = [];
    this.filteredHelpList = [];
    const SelectQuery = {
      searchFields: [
        {
          fieldName: 'SubQuestionId',
          fieldValue: String(contact.SubQuestionId),
          opType: 'Equals'
        }
      ],
      mode: 'subQuestionValueList'
    };

    this._CasepaperService
      .getSubQuesValueByIdList(SelectQuery).subscribe((res: any) => {

        this.helpList = Array.isArray(res) ? res : [];
        this.filteredHelpList = [...this.helpList];
      });
  }

  onOptionSelected(event: any) {
    if (this.selectedRow) {
      this.selectedRow.ResultValue = event.option.value;
    }
  }

  filterList(value: string) {
    if (!value) {
      this.filteredHelpList = [...this.helpList];
      return;
    }

    const searchValue = value.toLowerCase();

    this.filteredHelpList = this.helpList.filter(item =>
      String(item.SubQuestionValName ?? '').toLowerCase().includes(searchValue) ||

      String(item.ShortcutValues ?? '').toLowerCase().includes(searchValue)
    );
  }

  onSave() {

  }

  onClose() {
    this.dialogRef.close();
  }

  @HostListener('document:click')
  closeList() {
    this.showList = false;
  }
}

export class QuesResult {
  SubQuestionName: String;
  ShortcutValues: boolean;
  SubQuestionValName: Date;
  NormalRange: any;
  Formula: any;
  ParameterShortName: any;
  ResultValue: any;

  constructor(QuesResult) {
    this.SubQuestionName = QuesResult.SubQuestionName || '';
    this.ShortcutValues = QuesResult.ShortcutValues || '';
    this.SubQuestionValName = QuesResult.SubQuestionValName || '';
    this.ParameterShortName = QuesResult.ParameterShortName || '';
    this.ResultValue = QuesResult.ResultValue || '';
  }

}
