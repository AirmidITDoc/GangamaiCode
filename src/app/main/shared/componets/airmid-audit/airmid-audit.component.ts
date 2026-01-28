import { Component, Inject, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { RequestforlabtestService } from 'app/main/nursingstation/requestforlabtest/requestforlabtest.service';
import { environment } from 'environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { Subscription, interval } from 'rxjs';
import { OnlinePaymentService } from '../../services/online-payment.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { permissionCodes, permissionType } from '../../model/permission.model';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { PagePermissionService } from '../../services/page-permission.service';

@Component({
    selector: 'airmid-audit',
    templateUrl: './airmid-audit.component.html',
    styleUrls: ['./airmid-audit.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AirmidAuditComponent implements OnInit, OnDestroy {
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    constructor(
        public _RequestforlabtestService: RequestforlabtestService,
        private dialogRef: MatDialogRef<AirmidAuditComponent>,
        private onlinePaymentService: OnlinePaymentService,
        @Inject(MAT_DIALOG_DATA) public data: any, public permissionService: PagePermissionService,
        private toastrService: ToastrService
    ) { }
    gridConfig: gridModel = {
        columnsList: [],
        apiUrl: '',
        sortField: '',
        sortOrder: 0,
        filters: []
    }
    parseJson(value: string): any {
        debugger
        try {
            return JSON.parse(value);
        } catch {
            return value; // fallback if invalid JSON
        }
    }

    ngAfterViewInit() {
        if (this.gridConfig)
            this.gridConfig.columnsList.find(col => col.key === 'description')!.template = this.actionButtonTemplate;
    }
    ngOnInit(): void {
        this.gridConfig = {
            apiUrl: this.data?.ApiUrl ?? "",
            fileName: "AuditList",
            columnsList: [
                { heading: "EntityName", key: "entityName", sort: true, align: 'left', emptySign: 'NA' },
                {
                    heading: "Description", key: "description", align: "center", width: 230, sticky: true, type: gridColumnTypes.template,
                    template: this.actionButtonTemplate  // Assign ng-template to the column
                },
                // { heading: "Description", key: "description", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "CreatedOn", key: "createdOn", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "ActionByName", key: "actionByName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "EntityId", key: "entityId", sort: true, align: 'left', emptySign: 'NA' },

            ],
            sortField: "Id",
            sortOrder: 0,
            filters: [
                { fieldName: "EntityName", fieldValue: this.data?.EntityName, opType: OperatorComparer.Equals },
                { fieldName: "EntityId", fieldValue: this.data?.EntityId, opType: OperatorComparer.Equals }
            ]
        }
        if (this.data?.EntityName != '' && this.data?.EntityName.split('|').length == 1) {
            const index = this.gridConfig.columnsList.findIndex(x => x.heading === "EntityName");
            if (index !== -1) {
                this.gridConfig.columnsList.splice(index, 1);
            }
        }
        if (this.data?.EntityId != '' && this.data?.EntityId.split('|').length == 1) {
            const index = this.gridConfig.columnsList.findIndex(x => x.heading === "EntityId");
            if (index !== -1) {
                this.gridConfig.columnsList.splice(index, 1);
            }
        }
    }

    ngOnDestroy() {
    }

}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'safeJson',
  pure: true
})
export class SafeJsonPipe implements PipeTransform {
  transform(value: string): any {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
}

