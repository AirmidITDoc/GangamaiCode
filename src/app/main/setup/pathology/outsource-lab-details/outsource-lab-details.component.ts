import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { RequestforlabtestService } from 'app/main/nursingstation/requestforlabtest/requestforlabtest.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NewLabdetailsComponent } from './new-labdetails/new-labdetails.component';

@Component({
    selector: 'app-outsource-lab-details',
    templateUrl: './outsource-lab-details.component.html',
    styleUrls: ['./outsource-lab-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class OutsourceLabDetailsComponent {

    hasSelectedContacts: boolean;
    labname = ""
    mySearchForm: FormGroup;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.PathCategoryMaster, permissionType.Add);



    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }


    allColumns = [

        { heading: "OutSource LabName", key: "outSourceLabName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "ContactPerson Name", key: "contactPersonName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        // { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        { heading: "IsActive", key: "isActive", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.MOutSourcelabMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._RequestforlabtestService.deactivateTheStatus(data.outSourceId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        }

        // {
        //     heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
        //     template: this.actionButtonTemplate 
        // }
    ]
    allFilters = [

        { fieldName: "OutSourceLabName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "IsActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    // 
    gridConfig: gridModel = {
        permissionCode: permissionCodes.MOutSourcelabMaster,
        apiUrl: "OutSourcelabMaster/List",
        columnsList: this.allColumns,
        sortField: "outSourceId",
        sortOrder: 0,
        filters: this.allFilters
    }


    constructor(public _RequestforlabtestService: RequestforlabtestService, public _matDialog: MatDialog,
        public toastr: ToastrService, private commonService: PrintserviceService, private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService, public datePipe: DatePipe, public permissionService: PagePermissionService,) { }
    ngOnInit(): void {
        this.mySearchForm = this.cretatemySearchForm()
    }

    cretatemySearchForm() {
        return this._formBuilder.group({
            LabName: [""],
        });
    }

    onSave(row: any = null) {
        const dialogRef = this._matDialog.open(NewLabdetailsComponent,
            {
                maxHeight: '55vh',
                width: '60%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    // editLab(row) {
    //     const dialogRef = this._matDialog.open(NewLabdetailsComponent,
    //         {
    //             maxHeight: '55vh',
    //             width: '60%',
    //             data: row
    //         });
    //     dialogRef.afterClosed().subscribe(result => {
    //         this.grid.bindGridData();
    //     });
    // }
    Labrequestcancle(data) {
        debugger
        console.log(data)
        Swal.fire({
            title: 'Do you want to cancel the Lab?',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((flag) => {
            if (flag.isConfirmed) {
                this._RequestforlabtestService.labreqCancle(data.outSourceId).subscribe((response: any) => {
                    this.toastr.success(response.message);
                    this.grid.bindGridData();
                });
            }
        });
    }
}
