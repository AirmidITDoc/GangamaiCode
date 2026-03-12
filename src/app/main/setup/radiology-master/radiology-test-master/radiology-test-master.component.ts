import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { RadiologyTestMasterService } from './radiology-test-master.service';
import { UpdateradiologymasterComponent } from './updateradiologymaster/updateradiologymaster.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';


@Component({
    selector: 'app-radiology-test-master',
    templateUrl: './radiology-test-master.component.html',
    styleUrls: ['./radiology-test-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RadiologyTestMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    testName: any = "";
    searchFormGroup: FormGroup;
    CatId = "0"
    ServiceId = "0"
    UnitId = "0"
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.RadiologyTestMaster, permissionType.Add);

    autocompleteModeCategoryId: string = "RadioCategory";
    autocompleteModeServiceID: string = "RadiologyService";

    allColumns = [
        // { heading: "Code", key: "testId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Test Name", key: "testName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "PrintTest Name", key: "printTestName", width: 200, sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Category Name", key: "categoryName", width: 150, sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Service Name", key: "serviceName", width: 150, sort: true, align: 'left', emptySign: 'NA' },
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "IsActive", key: "isActive", width: 100, type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", width: 100, align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.RadiologyTestMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data) // EDIT Records
                    }
                },
                {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.RadiologyTestMaster, permissionType.Delete), callback: (data: any) => {
                        this._radiologytestService.deactivateTheStatus(data.testId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                },
            ]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allFilters = [
        { fieldName: "TestName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "CatId", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "ServiceId", fieldValue: "0", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.RadiologyTestMaster,
        apiUrl: "RadiologyTest/RadiologyTestList",
        columnsList: this.allColumns,
        sortField: "TestId",
        sortOrder: 0,
        filters: this.allFilters
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'TestNameSearch')
            this.searchFormGroup.get('TestNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        debugger
        this.testName = this.searchFormGroup.get('TestNameSearch').value + "%"
        this.CatId = this.searchFormGroup.get('CategoryId').value || "0"
        this.ServiceId = this.searchFormGroup.get('ServiceId').value || "0"
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "RadiologyTest/RadiologyTestList",
            columnsList: this.allColumns,
            sortField: "TestId",
            sortOrder: 0,
            filters: [
                { fieldName: "TestName", fieldValue: this.testName, opType: OperatorComparer.Contains },
                { fieldName: "CatId", fieldValue: String(this.CatId), opType: OperatorComparer.Contains },
                { fieldName: "ServiceId", fieldValue: String(this.ServiceId), opType: OperatorComparer.Contains }
            ]
        }
        console.log(this.gridConfig)
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    constructor(
        public _radiologytestService: RadiologyTestMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public permissionService: PagePermissionService
    ) { }

    ngOnInit(): void {
        this.searchFormGroup = this._radiologytestService.createSearchForm();
    }


    onSave(row: any = null) {
        const dialogRef = this._matDialog.open(UpdateradiologymasterComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData()
        });
    }

    onDeactive(testId) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this._radiologytestService.deactivateTheStatus(testId).subscribe((response: any) => {

                });
            }
            this.confirmDialogRef = null;
        });
    }

    onEdit(row) {

        row["IsDeleted"] = JSON.stringify(row.IsActive)
        console.log(row)
        this._radiologytestService.populateForm(row);
        const dialogRef = this._matDialog.open(UpdateradiologymasterComponent, {
            maxWidth: "80%",
            width: "95%",
            height: "85%",
            data: {
                Obj: row,
            }
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.grid.bindGridData()

        });
    }

    CategoryView(value) {

        if (value.value !== 0)
            this.UnitId = value.value
        else
            this.UnitId = "0"

        this.onChangeFirst();
    }

    ServiceView(value) {

        if (value.value !== 0)
            this.ServiceId = value.value
        else
            this.ServiceId = "0"

        this.onChangeFirst();
    }

}

export class TestList {
    testId: any;
    testName: any;
    printTestName: any;
    categoryId: number;
    serviceId: any;
    isActive: any;
    mRadiologyTemplateDetails: any;
    /**
     * Constructor
     *
     * @param TestList
     */
    constructor(TestList) {
        {
            this.testId = TestList.testId || "";
            this.testName = TestList.testName || '';
            this.printTestName = TestList.printTestName || '';
            this.categoryId = TestList.categoryId || "";
            this.serviceId = TestList.serviceId || 0;
            this.isActive = TestList.isActive || 0;
            this.mRadiologyTemplateDetails = TestList.mRadiologyTemplateDetails || 0;
        }
    }
}
export class RadiologytestMaster {
    TestId: number;
    TestName: string;
    PrintTestName: string;
    CategoryId: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    ServiceId: number;
    AddedByName: string;
    IsActive: any;
    /**
     * Constructor
     *
     * @param RadiologytestMaster
     */
    constructor(RadiologytestMaster) {
        {
            this.TestId = RadiologytestMaster.TestId || '';
            this.TestName = RadiologytestMaster.TestName || '';
            this.PrintTestName = RadiologytestMaster.PrintTestName || '';
            this.CategoryId = RadiologytestMaster.CategoryId || '';
            this.IsDeleted = RadiologytestMaster.IsDeleted || 'false';
            this.AddedBy = RadiologytestMaster.AddedBy || '';
            this.UpdatedBy = RadiologytestMaster.UpdatedBy || '';
            this.ServiceId = RadiologytestMaster.ServiceId || '';
            this.AddedByName = RadiologytestMaster.AddedByName || '';
            this.IsActive = RadiologytestMaster.IsActive || '';

        }
    }
}