import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { OTBillingTemplateService } from './otbilling-template.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { NewOTBillTemplateComponent } from './new-otbill-template/new-otbill-template.component';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-otbilling-template',
  templateUrl: './otbilling-template.component.html',
  styleUrls: ['./otbilling-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class OTBillingTemplateComponent implements OnInit {
  
    IsAdd: boolean = true //this.permissionService.getPermission(permissionCodes.SetupOtManagment, permissionType.Add);


    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    allColumns = [ 
        { heading: "Template Name", key: "otBillTemplateName", sort: true, align: 'left', emptySign: 'NA',width: 300 }, 
        //{ heading: "Percentage (%)", key: "percentage", sort: true, align: 'left', emptySign: 'NA', width: 120}, 
        { heading: "Create By", key: "createdByUserName", sort: true, align: 'left', emptySign: 'NA',width: 180 }, 
        { heading: "created DateTime", key: "createdDateTime", sort: true, align: 'left', emptySign: 'NA',type:9,width: 180  }, 
        { heading: "Modified By", key: "updatedByUserName", sort: true, align: 'left', emptySign: 'NA' }, 
        { heading: "Modified DateTime", key: "modifiedDateTime", sort: true, align: 'left', emptySign: 'NA',type:9 ,width: 180 },
        // { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" , width: 120},
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, 
                  //  visible: this.permissionService.getPermission(permissionCodes.SetupOtManagment, permissionType.Edit),
                     callback: (data: any) => {
                        this.onSave(data);
                    }
                 }
                //, {
                //     action: gridActions.delete, 
                //     //visible: this.permissionService.getPermission(permissionCodes.SetupOtManagment, permissionType.Delete),
                //      callback: (data: any) => {

                //         // this._OttablemasterService.deactivateTheStatus(data.ottableId).subscribe((response: any) => {
                //         //     this.grid.bindGridData();
                //         // });
                //     }
                // }
                ]
        } //Action 1-view, 2-Edit,3-delete
    ]
  permissionService: any;
// {
//     "otbTempId": 1,
//     "otBillTemplateName": "abc",
//     "createdBy": 0,
//     "createdDateTime": "2026-10-12T16:15:08.973",
//     "modifiedBy": 0,
//     "createdByUserName": "",
//     "updatedByUserName": ""
// }
    gridConfig: gridModel = {
        permissionCode: permissionCodes.SetupOtManagment,
        apiUrl: "BillTemplate/OtBillTemplateHeaderList",
        columnsList: this.allColumns,
        sortField: "OTBTempId",
        sortOrder: 0,
        filters: [
            { "fieldName": "OtBillTemplateName", "fieldValue": "%", "opType": OperatorComparer.StartsWith }
        ]
    }

    constructor(
        public _OTBillingTemplateService: OTBillingTemplateService,
       // public permissionService: PagePermissionService,
        public toastr: ToastrService,
         public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewOTBillTemplateComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {  
                that.grid.bindGridData();
        });
    }
      selectChangeServiceName(event: any): void { 
    if(event?.serviceId) {
       this.gridConfig.filters[0].fieldValue = String(event?.serviceId);
    } else{
           this.gridConfig.filters[0].fieldValue = String(0);
    }
  }
}
