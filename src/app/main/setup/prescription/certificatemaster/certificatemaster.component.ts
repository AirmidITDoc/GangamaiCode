import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { CertificateserviceService } from './certificateservice.service';
import { NewCertificateComponent } from './new-certificate/new-certificate.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';

@Component({
    selector: 'app-certificatemaster',
    templateUrl: './certificatemaster.component.html',
    styleUrls: ['./certificatemaster.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CertificatemasterComponent implements OnInit {

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    TemplateName: any = "";
    searchFormGroup: FormGroup;

    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.CertificateTemplateMaster, permissionType.Add);

    allColumn = [
        { heading: "TemplateCode", key: "certificateId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "TemplateName", key: "certificateName", width: 200, sort: true, align: 'left', emptySign: 'NA' },
        { heading: "TemplateDesc", key: "certificateDesc", width: 300, sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.CertificateTemplateMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                },
                {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.CertificateTemplateMaster, permissionType.Delete), callback: (data: any) => {
                        this._CertificateserviceService.deactivateTheStatus(data.certificateId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]
    allFilters = [
        // { fieldName: "CertificateName", fieldValue: "%", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.CertificateTemplateMaster,
        apiUrl: "PrescriptionCertificateMaster/List",
        columnsList: this.allColumn,
        sortField: "CertificateId",
        sortOrder: 0,
        filters: this.allFilters
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'TemplateNameSearch')
            this.searchFormGroup.get('TemplateNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.TemplateName = this.searchFormGroup.get('TemplateNameSearch').value + "%"
        this.getfilterdata();
    }

    getfilterdata() {
        this.gridConfig = {
            apiUrl: "PrescriptionCertificateMaster/List",
            columnsList: this.allColumn,
            sortField: "CertificateId",
            sortOrder: 0,
            filters: [
                // { fieldName: "CertificateName", fieldValue: this.TemplateName , opType: OperatorComparer.Contains }
            ]
        }
        console.log(this.gridConfig)
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    constructor(
        public _CertificateserviceService: CertificateserviceService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        public permissionService: PagePermissionService
    ) { }

    ngOnInit(): void {
        this.searchFormGroup = this._CertificateserviceService.createSearchForm();
    }

    onSave(row: any = null) {

        const that = this;
        const dialogRef = this._matDialog.open(NewCertificateComponent,
            {
                maxWidth: "95vw",
                maxHeight: '95vh',
                width: '95%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}
