import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { AirmidSignatureComponent } from 'app/main/shared/componets/airmid-signature/airmid-signature.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { HospitalService } from './hospital.service';
import { NewHospitalComponent } from './new-hospital/new-hospital.component';

@Component({
    selector: 'app-hospital-master',
    templateUrl: './hospital-master.component.html',
    styleUrls: ['./hospital-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class HospitalMasterComponent implements OnInit {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.Hospital, permissionType.Add);

    myformSearch: FormGroup;
    msg: any;
    cityId = "0";
    phoneNo = "";
    hospitalname = '';
    active: any;
    autocompletecity: string = "City";
    logo: PageNames = PageNames.HOSPITAL_LOGO;
    nabh: PageNames = PageNames.NABH
    // signature: PageNames = PageNames.HOSPITAL_LOGO;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(public _HospitalService: HospitalService,
        public _matDialog: MatDialog, public toastr: ToastrService, public permissionService: PagePermissionService,
    ) { }
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    allcolumns = [
        { heading: "Hospital Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', Width: 300 },
        { heading: "Short Name", key: "hospitalShortName", sort: true, align: 'left', emptySign: 'NA', Width: 150 },
        { heading: "Hospital Address", key: "hospitalAddress", sort: true, align: 'left', emptySign: 'NA', Width: 500 },
        { heading: "City", key: "city", sort: true, align: 'left', emptySign: 'NA', Width: 100 },
        { heading: "Pin", key: "pin", sort: true, align: 'left', emptySign: 'NA', Width: 100 },
        { heading: "Phone", key: "phone", sort: true, align: 'left', emptySign: 'NA', Width: 100 },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Files", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.Hospital,
        apiUrl: "HospitalMaster/HospitalMasterList",
        columnsList: this.allcolumns,
        sortField: "HospitalId",
        sortOrder: 1,
        filters: [{ fieldName: "HospitalName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "CityId", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PhoneNo", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "IsActive", fieldValue: "2", opType: OperatorComparer.Contains }
        ]
    }


    ngOnInit(): void {
        this.myformSearch = this._HospitalService.createSearchForm();
    }

    selectChangecity(obj: any) {
        console.log(obj)
        if (obj.value !== 0)
            this.cityId = obj.value
        else
            this.cityId = "0"
        this.onChangeFirst(obj);
    }

    onChangeFirst(event) {
        debugger
        this.hospitalname = this.myformSearch.get('NameSearch').value + "%"
        this.phoneNo = this.myformSearch.get('phoneNo').value + "%"
        this.active = this.myformSearch.get('IsActive').value
        this.cityId = this.myformSearch.get('cityId').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "HospitalMaster/HospitalMasterList",
            columnsList: this.allcolumns,
            sortField: "HospitalId",
            sortOrder: 0,
            filters: [
                { fieldName: "HospitalName", fieldValue: this.hospitalname, opType: OperatorComparer.StartsWith },
                { fieldName: "CityId", fieldValue: this.cityId, opType: OperatorComparer.Equals },
                { fieldName: "PhoneNo", fieldValue: this.phoneNo, opType: OperatorComparer.Contains },
                { fieldName: "IsActive", fieldValue: this.active, opType: OperatorComparer.Contains }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }


    Clearfilter(event) {
        console.log(event)
        if (event == 'Hospital')
            this.myformSearch.get('NameSearch').setValue("")
        if (event == 'phoneNo')
            this.myformSearch.get('phoneNo').setValue("")

        this.onChangeFirst(event);
    }


    onAdd() {
        const dialogRef = this._matDialog.open(NewHospitalComponent, {
            maxWidth: "95vw",
            maxHeight: "95vh",
            width: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.grid.bindGridData();
        });
    }

    onSave(obj) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        console.log(obj)
        const dialogRef = this._matDialog.open(NewHospitalComponent,
            {
                maxWidth: "95vw",
                maxHeight: "100vh",
                width: "100%",
                height: "95%",
                data: obj
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();

        });
    }

    // nabh logo
    onFiles(element) {
        const dialogRef = this._matDialog.open(
            AirmidSignatureComponent,
            {
                maxWidth: "50vw",
                maxHeight: "70vh",
                width: "100%",
                data: { refId: element.hospitalId, refType: 'nabh', multiple: 'true', docName: 'NABHLogo' }
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            // this.onCloseDialog.emit(result);
        });
    }

    // img upload
    onFiles1(element) {
        const dialogRef = this._matDialog.open(
            AirmidSignatureComponent,
            {
                maxWidth: "50vw",
                maxHeight: "70vh",
                width: "100%",
                data: { refId: element.hospitalId, refType: 'Img_Upload', multiple: 'true', docName: 'Img_Upload' }
            }
        );

        dialogRef.afterClosed().subscribe((result) => {
            // this.onCloseDialog.emit(result);
        });
    }
}


export class HospitalMaster {
    hospitalId: any;
    hospitalName: any;
    hospitalAddress: any;
    city: any;
    cityId: any;
    pin: any;
    phone: any;
    emailId: any;
    webSiteInfo: any;
    header: any;
    isActive: any;
    opdBillingCounterId: any;
    opdReceiptCounterId: any;
    opdRefundBillCounterId: any;
    opdRefundBillReceiptCounterId: any;
    opdAdvanceCounterId: any;
    opdRefundAdvanceCounterId: any;
    ipdAdvanceCounterId: any;
    ipdBillingCounterId: any;
    ipdReceiptCounterId: any;
    ipdRefundOfBillCounterId: any;
    ipdRefundOfBillReceiptCounterId: any;
    ipdRefundOfAdvanceCounterId: any;
    hospitalHeaderLine: any;
    ipdAdvanceReceiptCounterId: any;
    ipdRefundOfAdvanceReceiptCounterId: any;
    hospitalShortName: any;
    /**
     * Constructor
     *
     * @param HospitalMaster
     */
    constructor(HospitalMaster) {
        {
            this.hospitalId = HospitalMaster.hospitalId || 0;
            this.hospitalName = HospitalMaster.hospitalName || "";
            this.hospitalAddress = HospitalMaster.hospitalAddress || "";
            this.city = HospitalMaster.city || "";
            this.cityId = HospitalMaster.cityId || 0;
            this.pin = HospitalMaster.pin || "";
            this.phone = HospitalMaster.phone || "";
            this.emailId = HospitalMaster.emailId || "";
            this.webSiteInfo = HospitalMaster.webSiteInfo || "";
            this.header = HospitalMaster.header || "";
            this.isActive = HospitalMaster.isActive || true;
            this.opdBillingCounterId = HospitalMaster.header || 0;
            this.opdReceiptCounterId = HospitalMaster.opdReceiptCounterId || 0;
            this.opdRefundBillCounterId = HospitalMaster.opdRefundBillCounterId || 0;
            this.opdRefundBillReceiptCounterId = HospitalMaster.opdRefundBillReceiptCounterId || 0;
            this.opdAdvanceCounterId = HospitalMaster.opdAdvanceCounterId || 0;
            this.opdRefundAdvanceCounterId = HospitalMaster.opdRefundAdvanceCounterId || 0;
            this.ipdAdvanceCounterId = HospitalMaster.ipdAdvanceCounterId || 0;
            this.ipdBillingCounterId = HospitalMaster.ipdBillingCounterId || 0;
            this.ipdReceiptCounterId = HospitalMaster.ipdReceiptCounterId || 0;
            this.ipdRefundOfBillCounterId = HospitalMaster.ipdRefundOfBillCounterId || 0;
            this.ipdRefundOfBillReceiptCounterId = HospitalMaster.ipdRefundOfBillReceiptCounterId || 0;
            this.ipdRefundOfAdvanceCounterId = HospitalMaster.ipdRefundOfAdvanceCounterId || 0;
            this.hospitalHeaderLine = HospitalMaster.hospitalHeaderLine || '';
            this.ipdAdvanceReceiptCounterId = HospitalMaster.ipdAdvanceReceiptCounterId || 0;
            this.ipdRefundOfAdvanceReceiptCounterId = HospitalMaster.ipdRefundOfAdvanceReceiptCounterId || 0;
            this.hospitalShortName = HospitalMaster.hospitalShortName || ''
        }
    }
}