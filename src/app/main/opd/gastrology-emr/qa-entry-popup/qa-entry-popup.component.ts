import { DatePipe } from '@angular/common';
import { Component, HostListener, Inject, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
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
    clinicalForm: FormGroup;

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

        console.log("Question data:", this.data.row)

        this.clinicalForm = this.clinicalQuesForm()
        this.clinicalForm.markAllAsTouched()

        this.clinicalQuesArray.push(this.createclinicalDetailFormInsert());

        if (this.data.row.clinicalQuesHeaderId) {
            this.editTableRow(this.data.row)
        } else {
            this.getResultList1(this.data.row)
        }
    }

    clinicalQuesForm(): FormGroup {
        return this.formBuilder.group({
            clinicalQuesHeaderId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            clinicalQuesDate: [(new Date()).toISOString().split('T')[0]],
            clinicalQuesTime: [(new Date()).toISOString()],
            opipid: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            opiptype: 0,
            questionId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            questionName: ['', [Validators.required]],
            clinicalQuesDetails: this.formBuilder.array([]),
        })
    }

    createclinicalDetailFormInsert(element: any = {}): FormGroup {
        return this.formBuilder.group({
            clinicalQuesDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            clinicalQuesHeaderId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            subQuesId: [element.SubQuestionId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            subQuesName: [element.SubQuestionName],
            resultEntry: [element.ResultValue ?? ''],
            seqNo: [this.clinicalQuesArray.length + 1]
        });
    }

    get clinicalQuesArray(): FormArray {
        return this.clinicalForm.get('clinicalQuesDetails') as FormArray;
    }

    editTableRow(row) {
        const SelectQuery =
        {
            "searchFields": [
                {
                    "fieldName": "ClinicalQuesHeaderId",
                    "fieldValue": String(row.clinicalQuesHeaderId),
                    "opType": "Equals"
                }
            ],
            "mode": "ClinicalQuesDetail"
        }

        console.log(SelectQuery);

        this._CasepaperService.geteditList(SelectQuery).subscribe(Visit => {

            this.dataSource.data = Visit.map(item => ({
                ...item,
                SubQuestionId: item.SubQuesId,
                SubQuestionName: item.SubQuesName,
                ResultValue: item.ResultEntry
            })) as QuesResult[];

            // this.dataSource.data = Visit as QuesResult[];

            console.log(this.dataSource.data)
        });
    }

    getResultList1(data) {

        const SelectQuery =
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
        this.clinicalForm.get("clinicalQuesHeaderId").setValue(this.data.row.clinicalQuesHeaderId ?? 0)
        this.clinicalForm.get("opipid").setValue(this.data.opipid)
        this.clinicalForm.get("questionId").setValue(this.data.row.questionId)
        this.clinicalForm.get("questionName").setValue(this.data.row.questionName)
        debugger

        if (this.dataSource.data.length === 0) {
            this.toastr.warning('Please add at least one clinical question');
            return;
        }
        if (!this.clinicalForm.invalid) {

            this.clinicalQuesArray.clear();
            this.dataSource.data.forEach(item => {
                console.log(item)
                this.clinicalQuesArray.push(this.createclinicalDetailFormInsert(item));
            });

            console.log(this.clinicalForm.value)

            this._CasepaperService.clinicalQuesSave(this.clinicalForm.value).subscribe(response => {
                debugger
                if (response) {
                    // this.onClose(response)
                    this.dialogRef.close(response);
                }
            });
        } else {
            const invalidFields = this.collectErrors(this.clinicalForm);
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
                });
                return;
            }
        }
    }

    collectErrors(formGroup: FormGroup | FormArray, parentKey: string = ''): string[] {
        let errors: string[] = [];
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            const newKey = parentKey ? `${parentKey}.${key}` : key;
            if (control instanceof FormGroup || control instanceof FormArray) {
                // go deeper
                errors = errors.concat(this.collectErrors(control, newKey));
            } else {
                if (control?.invalid) {
                    errors.push(newKey);
                }
            }
        });
        return errors;
    }

    onClose() {
        this.dialogRef.close(this.data.opipid);
    }

    @HostListener('document:click')
    closeList() {
        this.showList = false;
    }
}

export class QuesResult {
    SubQuestionName: string;
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
