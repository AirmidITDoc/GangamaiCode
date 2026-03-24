import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import Swal from 'sweetalert2';
import { EditLabsampledateComponent } from '../edit-labsampledate/edit-labsampledate.component';
import { LabSampleCollectionService } from '../lab-sample-collection.service';

function formatDate(rawDate: string): string {
    if (!rawDate) return '';

    // Case 1: ISO format with T → 2026-01-15T00:00:00
    if (rawDate.includes('T')) {
        return rawDate.split('T')[0]; // 2026-01-15
    }

    // Case 2: Space format → 15-01-2026 00:00:00
    if (rawDate.includes(' ')) {
        const datePart = rawDate.split(' ')[0]; // 15-01-2026
        const [day, month, year] = datePart.split('-');
        return `${year}-${month}-${day}`; // 2026-01-15
    }

    return '';
}

@Component({
    selector: 'app-labsample-new-from',
    templateUrl: './labsample-new-from.component.html',
    styleUrls: ['./labsample-new-from.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LabsampleNewFromComponent {
    interimArray: any = [];
    samplelist: any = [];
    date: any;

    Currentdate: any;
    displayedColumns: string[] = [
        'select',
        'testName',
        'tat',
        'container',
        'SampleCollectionTime',
        'editSampleCollectionTime',
        'sampleNo',
        'action'
    ];

    selectedAdvanceObj: AdvanceDetailObj;
    hasSelectedContacts: boolean;
    screenFromString = 'OP-billing';

    dateTimeObj: any;
    selectedAdvanceObj1: any;

    regObj: any;
    type: string = '';

    dataSource = new MatTableDataSource<SampleList>();
    sIsLoading: string = '';
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    vSampleCollFormGroup: FormGroup

    constructor(private formBuilder: UntypedFormBuilder,
        public _SampleService: LabSampleCollectionService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<LabsampleNewFromComponent>,
        public dialog: MatDialog,
        private advanceDataStored: AdvanceDataStored,
        private _fuseSidebarService: FuseSidebarService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private accountService: AuthenticationService,

    ) {
        dialogRef.disableClose = true;
        this.type = data?.type;

        const mydate = new Date()
        this.date = (this.datePipe.transform(new Date(), "MM-dd-YYYY hh:mm tt"));

        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        this.date = now.toISOString().slice(0, 16);
    }

    minDateTime: string = '';
    ngOnInit(): void {
        this.vSampleCollFormGroup = this.vSamplecollFormInsert();

        this.minDateTime = this.getNow();
        if (this.data?.type) {
            this.regObj = this.data.row
            this.getSampledetailListLab(this.regObj);
            return;
        }
        else {
            this.regObj = this.data
            this.getSampledetailListLab(this.regObj);
        }
    }

    tableElementChecked(event, element) {

        if (event) {
            if (event.checked) {
                this.interimArray.push(element);
            } else if (this.interimArray.length > 0) {
                const index = this.interimArray.indexOf(element);
                if (index !== -1) {
                    this.interimArray.splice(index, 1);
                }
            }
            this.samplelist.push(element);
            console.log();
        }

    }

    vSamplecollFormInsert(): FormGroup {
        return this.formBuilder.group({
            pathlogySampleCollection: this.formBuilder.array([])// FormArray for details

        });
    }

    // 2. FormArray Group for Refund Detail
    createSampleDetail(item: any = {}): FormGroup {
        return this.formBuilder.group({
            PathReportId: [item.pathReportID, [this._FormvalidationserviceService.onlyNumberValidator()]],
            sampleCollectionTime: [item.sampleCollectionTime, [Validators.required]],
            // sampleCollectionTime: [this._SampleService.sampldetailform.get('SampleDateTime').value || new Date(), [Validators.required]],
            IsSampleCollection: [true],
            SampleNo: [item.sampleNo || 0, [this._FormvalidationserviceService.notEmptyOrZeroValidator]],
            sampleCollectedBy: this.accountService.currentUserValue.userId
        });
    }

    get refundDetailsArray(): FormArray {
        return this.vSampleCollFormGroup.get('pathlogySampleCollection') as FormArray;
    }


    onSave() {

        if (this.selection.selected.length === 0) {
            Swal.fire('Error!', 'Please select sample data', 'error');
            return;
        }

        const isSampleCollected = this.selection.selected.some(
            item => item.isSampleCollection === 'True'
        );

        const proceedUpdate = () => {
            this.refundDetailsArray.clear();
            this.selection.selected.forEach(item => {
                this.refundDetailsArray.push(this.createSampleDetail(item));
            });

            console.log(this.vSampleCollFormGroup.value);

            this._SampleService
                .UpdateSampleCollection(this.vSampleCollFormGroup.value)
                .subscribe(() => {
                    this._matDialog.closeAll();
                });
        };

        if (isSampleCollected) {
            Swal.fire({
                title: 'Confirm Update',
                text: 'Are you sure you want to update Sample Collection?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#41ea76ff',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes'
            }).then(result => {
                if (result.isConfirmed) {
                    proceedUpdate();
                }
            });
        } else {
            proceedUpdate();
        }
    }

    rowCheckboxChange(row: SampleList) {
        this.selection.toggle(row);
    }
    getSelectableRowsForTable(specimenColorName: string): SampleList[] {
        return this.getFirstPatientForDate(specimenColorName)
            .filter(row => !this.isCheckboxDisabled(row));
    }

    isCheckboxDisabled(row: any): boolean {
        return row.isSampleCollection === true;
    }
    areAllRowsDisabled(): boolean {
        return this.dataSource?.data?.length
            ? this.dataSource.data.every(row => this.isCheckboxDisabled(row))
            : true;
    }
    selection = new SelectionModel<SampleList>(true, []);
    masterToggle(specimenColorName: string) {
        const selectableRows = this.getSelectableRowsForTable(specimenColorName);

        if (this.isAllSelected(specimenColorName)) {
            selectableRows.forEach(row => this.selection.deselect(row));
        } else {
            selectableRows.forEach(row => this.selection.select(row));
        }
    }
    isAllSelected(specimenColorName: string): boolean {
        const selectableRows = this.getSelectableRowsForTable(specimenColorName);

        return selectableRows.length > 0 &&
            selectableRows.every(row => this.selection.isSelected(row));
    }
    isSomeSelected(specimenColorName: string): boolean {
        const selectableRows = this.getSelectableRowsForTable(specimenColorName);

        const selectedCount = selectableRows.filter(row =>
            this.selection.isSelected(row)
        ).length;

        return selectedCount > 0 && selectedCount < selectableRows.length;
    }

    EditSampleDate(contact) {
        console.log(contact)
        const dialogRef = this._matDialog.open(EditLabsampledateComponent,
            {
                maxWidth: "100%",
                height: '40%',
                width: '40%',
                data: {
                    Obj: contact,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed - Insert Action', result);
            this.getSampledetailListLab(this.regObj);
        });
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    onClose() {
        this.dialogRef.close();
    }

    ///////////// new method ////////////////
    uniqueSpecimen: any[] = [];
    getNow(): string {
        const now = new Date();

        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    normalizeDateTime(value: any): string {
        if (!value) return this.getNow();

        // Already correct
        if (typeof value === 'string' && value.includes('T')) {
            return value.slice(0, 16);
        }

        // Convert ANY other date string safely
        const d = new Date(value);
        if (isNaN(d.getTime())) return this.getNow();

        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const h = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');

        return `${y}-${m}-${day}T${h}:${min}`;
    }

    getSampledetailListLab(row) {
        // debugger

        const formattedDate = formatDate(row.pathDate);

        console.log(formattedDate);

        const m_data = {
            "first": 0,
            "rows": 9999,
            "sortField": "PathTestID",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "BillNo",
                    "fieldValue": String(row.billNo),
                    "opType": "Equals"
                },
                {
                    "fieldName": "BillDate",
                    "fieldValue": formattedDate,
                    "opType": "Equals"
                },
                {
                    "fieldName": "OP_IP_Type",
                    "fieldValue": "4",
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }

        console.log(m_data);
        this._SampleService.getSampleDetailsListLab(m_data).subscribe(Visit => {
            // this.dataSource.data = Visit.data as SampleList[];
            const now = this.getNow();
            this.dataSource.data = (Visit.data as SampleList[]).map(item => ({
                ...item,
                // sampleCollectionTime: item.sampleCollectionTime
                //   ? item.sampleCollectionTime.slice(0, 16)
                //   : this.getNow()
                // sampleCollectionTime: this.normalizeDateTime(item.sampleCollectionTime)
                sampleCollectionTime: item.sampleCollectionTime || now
            }));
            console.log(this.dataSource.data)

            this.extractUniqueSpecimen();
        });
    }

    extractUniqueSpecimen() {
        const uniqueMap = new Map();

        this.dataSource.data.forEach(patient => {
            if (!uniqueMap.has(patient.specimenColorName)) {
                uniqueMap.set(patient.specimenColorName, {
                    color: patient.specimenColorName?.replace(/\s+/g, '').toLowerCase(),// this is for color show 
                    type: patient.specimenTypeName,
                    noofContainer: patient.noofContainer,
                    specimenColor: patient.specimenColorName,
                });
            }
        });

        this.uniqueSpecimen = Array.from(uniqueMap.values());
    }
    getFirstPatientForDate(specimenColorName: string) {
        return this.dataSource.data.filter(patient => patient.specimenColorName === specimenColorName); //
    }
}


export class SampleList {
    VADate: Date;
    VATime: Date;
    PathTestID: number;
    ServiceName: string;
    IsSampleCollection: boolean;
    isSampleCollection: any;
    SampleCollectionTime: Date;
    PathReportID: any;
    SampleNo: any;
    RegNo: any;
    pathReportID: any;
    sampleNo: any;
    isApprovedByCamp: any;
    specimenColorName: any;
    specimenTypeName: any;
    noofContainer: any;
    specimenTypeId: any;
    sampleCollectionTime: any;
    isConsentRequired: any;
    tatday: any;
    tathour: any;
    tatmin: any;

    constructor(SampleList) {
        this.VADate = SampleList.VADate || '';
        this.VATime = SampleList.VATime || '';
        this.PathTestID = SampleList.PathTestID || 0;
        this.ServiceName = SampleList.ServiceName || '';
        this.IsSampleCollection = SampleList.IsSampleCollection || 0;
        this.isSampleCollection = SampleList.isSampleCollection || 0;
        this.SampleCollectionTime = SampleList.SampleCollectionTime || '';
        this.PathReportID = SampleList.PathReportID || 0;
        this.SampleNo = SampleList.SampleNo || 0;
        this.RegNo = SampleList.RegNo || 0;
        this.pathReportID = SampleList.pathReportID || 0;
        this.sampleNo = SampleList.sampleNo || 0;
        this.isApprovedByCamp = SampleList.isApprovedByCamp || 0;
        this.specimenColorName = SampleList.specimenColorName || '';
        this.specimenTypeName = SampleList.specimenTypeName || '';
        this.noofContainer = SampleList.noofContainer || 0
        this.specimenTypeId = SampleList.specimenTypeId || '';
        this.sampleCollectionTime = SampleList.sampleCollectionTime || ''
        this.isConsentRequired = SampleList.isConsentRequired || ''
        this.tatday = SampleList.tatday || '';
        this.tathour = SampleList.tathour || ''
        this.tatmin = SampleList.tatmin || ''
    }
}