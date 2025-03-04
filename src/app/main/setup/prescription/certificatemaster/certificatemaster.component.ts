import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CertificateserviceService } from './certificateservice.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { NewCertificateComponent } from './new-certificate/new-certificate.component';

@Component({
    selector: 'app-certificatemaster',
    templateUrl: './certificatemaster.component.html',
    styleUrls: ['./certificatemaster.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CertificatemasterComponent implements OnInit {
    
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "RadiologyTemplate/List",
        columnsList: [
            { heading: "TemplateCode", key: "templateId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TemplateName", key: "templateName", width: 200, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TemplateDesc", key: "templateDesc", width: 300, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CertificateserviceService.deactivateTheStatus(data.templateId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "TemplateName",
        sortOrder: 0,
        filters: [
            { fieldName: "templateName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    constructor(
        public _CertificateserviceService: CertificateserviceService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,

    ) { }

    ngOnInit(): void { }
    
    onSave(row: any = null) {
        
        let that = this;
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
