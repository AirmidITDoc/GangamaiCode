import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDrawer } from '@angular/material/sidenav';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { result } from 'lodash';

import { permissionCodes } from 'app/main/shared/model/permission.model';
import { NewAssessmentComponent } from './new-assessment/new-assessment.component';
import { DietAssessmentService } from './diet-assessment.service';
import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs';

@Component({
    selector: 'app-patient-dieassessment',
    templateUrl: './patient-dieassessment.component.html',
    styleUrls: ['./patient-dieassessment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PatientDieassessmentComponent {


    myFilterform: FormGroup;
    autocompleteModedeptdoc: string = "ConDoctor";
    fromDate = this.datePipe.transform(new Date().toISOString(), 'yyyy-MM-dd');
    toDate = this.datePipe.transform(new Date().toISOString(), 'yyyy-MM-dd');
    AssessbyId = '0';
    isUserSelected: boolean = false;
    f_name = ''
    l_name = ''
    // User autocomplete
    UserList: any[] = [];
    filteredOptionsUser: Observable<any[]>;

    @ViewChild('grid', { static: false }) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    allcolumns = [
        { heading: 'Assessment Date', key: 'assessmentDate', sort: true, align: 'left', emptySign: 'NA', type: 6, width: 110 },
        { heading: 'DOA', key: 'admissionTime', sort: true, align: 'left', emptySign: 'NA', type: 8, width: 160 },

        // { heading: 'UHID', key: 'regNo', sort: true, align: 'left', emptySign: 'NA', width: 90 },
        // { heading: 'OPIPID', key: 'opipId', sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: 'Patient Name', key: 'patientName', sort: true, align: 'left', emptySign: 'NA', width: 500 },
        { heading: 'Height(cm)', key: 'height', sort: true, align: 'left', emptySign: 'NA', width: 180 },
        // { heading: 'Weight(kg)', key: 'weight', sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: 'Allergies', key: 'allergies', sort: true, align: 'left', emptySign: 'NA', width: 200 },
        // { heading: 'NutritionStatus', key: 'nutritionStatusName', sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: 'Special Instructions', key: 'specialInstructions', sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: 'Dietition Notes', key: 'dietitionNotes', sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: 'Assess By', key: 'assessByName', sort: true, align: 'left', emptySign: 'NA', width: 80 },
        {
            heading: 'Action', key: 'action', align: 'right', type: gridColumnTypes.template, width: 150,
            template: this.actionButtonTemplate
        }
    ];

    gridConfig: gridModel = {
        apiUrl: 'DietAssessmentInfo/List',
        columnsList: this.allcolumns,
        sortField: 'DietAssessmentId',
        sortOrder: 1,
        filters: [
            { fieldName: 'From_Dt', fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: 'To_Date', fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: 'DietAssessmentId', fieldValue: '0', opType: OperatorComparer.Equals },
            { fieldName: 'AssessbyId', fieldValue: '0', opType: OperatorComparer.Equals },
            { fieldName: "FirstName", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
            { fieldName: "LastName", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },

        ],
        row: 25
    };

    constructor(
        public _DietAssessmentService: DietAssessmentService,
        public _matDialog: MatDialog,
        private _loggedService: AuthenticationService,
        public toastr: ToastrService,
        public datePipe: DatePipe,
    ) { }

    ngOnInit(): void {
        this.myFilterform = this._DietAssessmentService.filterForm();
        // this.GetUserList();
        // this.filteredOptionsUser = this.myFilterform.get('DietAssessmentId').valueChanges.pipe(
        //     startWith(''),
        //     map(value => this._filterUser(value)),

        // );

    }

    ngAfterViewInit(): void {
        const action = this.gridConfig.columnsList.find(col => col.key === 'action');
        if (action) {
            action.template = this.actionButtonTemplate;
        }
    }

    // ===== User autocomplete =====

    GetUserList(): void {
        const data = {
            StoreId: this._loggedService.currentUserValue.storeId
        };
        this._DietAssessmentService.getUserdetailList(data).subscribe((res: any) => {
            console.log('user list response', res);   // remove once working

            const rows = Array.isArray(res) ? res : (res?.data ?? []);

            // normalise keys so the rest of the code can rely on UserId / UserName
            this.UserList = rows.map((r: any) => ({
                UserId: r.UserId ?? r.userId ?? r.UserID,
                UserName: r.UserName ?? r.userName ?? r.userLoginName
            }));

            this.setupUserFilter();
        });
    }

    private setupUserFilter(): void {
        this.filteredOptionsUser = this.myFilterform.get('DietAssessmentId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterUser(value))
        );
    }

    private _filterUser(value: any): any[] {
        const text = (typeof value === 'string' ? value : value?.UserName || '').toLowerCase();
        return text
            ? this.UserList.filter(o => (o.UserName || '').toLowerCase().includes(text))
            : this.UserList.slice();
    }

    getOptionTextUser(option: any): string {
        return option && option.UserName ? option.UserName : '';
    }

    getSelectedObj(obj: any): void {
        this.isUserSelected = true;
        this.AssessbyId = obj?.UserId ? String(obj.UserId) : '0';
        this.getfilterdata();
    }

    clearUser(): void {
        this.myFilterform.get('DietAssessmentId').setValue('');
        this.AssessbyId = '0';
        this.isUserSelected = false;
        this.getfilterdata();
    }

    // ===== Filters =====

    onDateChange(): void {
        const { fromDate, enddate } = this.myFilterform.value;
        if (!fromDate || !enddate) {
            return;
        }
        this.getfilterdata();
    }
    onChangeFirst(): void {
        this.getfilterdata();
    }

    getfilterdata(): void {
        const f = this.myFilterform.value;

        // use whichever date controls your form actually has
        const from = f.start ?? f.fromDate;
        const to = f.end ?? f.enddate;

        this.fromDate = this.datePipe.transform(from, 'yyyy-MM-dd') || this.fromDate;
        this.toDate = this.datePipe.transform(to, 'yyyy-MM-dd') || this.toDate;
        this.f_name = (f.FirstName ?? '').trim() + '%';
        this.l_name = (f.LastName ?? '').trim() + '%';

        this.gridConfig = {
            ...this.gridConfig,
            filters: [
                { fieldName: 'From_Dt', fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: 'To_Date', fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: 'DietAssessmentId', fieldValue: '0', opType: OperatorComparer.Equals },
                { fieldName: 'AssessbyId', fieldValue: this.AssessbyId, opType: OperatorComparer.Equals },
                { fieldName: 'FirstName', fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
                { fieldName: 'LastName', fieldValue: this.l_name, opType: OperatorComparer.StartsWith }
            ]
        };

        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    // ===== Dialogs / actions =====

    NewDietPlanAessessment(): void {
        (document.activeElement as HTMLElement)?.blur();

        const dialogRef = this._matDialog.open(NewAssessmentComponent, {
            width: '90%',
            height: '90vh',
            autoFocus: false
        });
        dialogRef.afterClosed().subscribe(() => {
            this.grid.bindGridData();
        });
    }

    Edit(element: any): void {
        (document.activeElement as HTMLElement)?.blur();

        const dialogRef = this._matDialog.open(NewAssessmentComponent, {
            width: '90%',
            height: '90vh',
            autoFocus: false,
            data: element
        });
        dialogRef.afterClosed().subscribe(() => {
            this.grid.bindGridData();
        });
    }

    AssessmentCancel(element: any): void {
        Swal.fire({
            icon: 'question',
            title: 'Do you want to Cancel Assessment',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancel it!'
        }).then((flag) => {
            if (flag.isConfirmed) {
                // match these field names to your API
                const submitData = {
                    dietAssessmentId: element.dietAssessmentId,
                    isCancelledBy: this._loggedService.currentUserValue.userId
                };
                this._DietAssessmentService.assessmentcancle(submitData).subscribe(
                    () => {
                        this.grid.bindGridData();
                    },
                    (error) => {
                        this.toastr.error(error.message);
                    }
                );
            }
        });
    }


    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterform.get('LastName').setValue("")

        this.onChangeFirst();
    }

    onClose(): void {
        this._matDialog.closeAll();
    }

    getValidationMessages() {
        return {
            DietAssessmentId: [
                { name: 'required', Message: 'DietAssessment Name is required' }
            ],
            assessedBy: [
                { name: 'required', Message: 'assessedBy Name is required' }
            ]
        };
    }
}
