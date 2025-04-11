import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { RoleTemplateService } from "./role-template.service";
import { MatDialog } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { NewRoletemplateComponent } from "./new-roletemplate/new-roletemplate.component";
import { RolePermissionComponent } from "../role-permission/role-permission.component";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-role-template-master',
  templateUrl: './role-template-master.component.html',
  styleUrls: ['./role-template-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class RoleTemplateMasterComponent implements OnInit {
    myformSearch: FormGroup;
    constructor(
        public _RoleTemplateService: RoleTemplateService, private _formBuilder: UntypedFormBuilder,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

     @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    

     allcolumns= [
        { heading: "Code", key: "roleId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Role Name", key: "roleName", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, 
                {
                    action: gridActions.delete, callback: (data: any) => {
                        this._RoleTemplateService.deactivateTheStatus(data.roleId).subscribe((response: any) => {
                            this.toastr.success(response.message);
                            this.grid.bindGridData();
                        });
                    }
                },
                {
                    action: gridActions.view, callback: (data: any) => {
                        this.onPermission(data.roleId);
                    }
                }, 
            ]
        } //Action 1-view, 2-Edit,3-delete
    ];

    gridConfig: gridModel = {
        apiUrl: "Administration/RoleMasterList",
        columnsList:this.allcolumns,
        sortField: "RoleId",
        sortOrder: 0,
        filters: [
            { fieldName: "RoleName", fieldValue: "%", opType: OperatorComparer.Contains }
        ]
    }
    
    ngOnInit(): void {
        this.myformSearch = this.filterForm();
    }
    

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewRoletemplateComponent,
            {
                maxWidth: "45vw",
                maxHeight: '30%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    onPermission(roleId){
            console.log(roleId)
            const dialogRef = this._matDialog.open(RolePermissionComponent,
            {
                maxWidth: "80vw",
                height: '100vh',
                maxHeight:'100vh',
                width: '100%',
                data : {
                    roleId : roleId,
                }
            });
            dialogRef.afterClosed().subscribe(result => {
                // this. getregistrationList();
            });
    }


    filterForm(): FormGroup {
        return this._formBuilder.group({
          RoleName: []              
        });
    }

Clearfilter(event) {
    console.log(event)
    if (event == 'Rolename')
        this.myformSearch.get('RoleName').setValue("")
   
    this.onChangeFirst();
  }
  Rolename:any
  onChangeFirst() {
    this.Rolename = this.myformSearch.get('RoleName').value
   
    this.getfilterdata();
}

getfilterdata(){
    debugger
this.gridConfig = {
    
    apiUrl: "Administration/RoleMasterList",
    columnsList:this.allcolumns,
    sortField: "RoleId",
    sortOrder: 0,
    filters:  [
        { fieldName: "RoleName", fieldValue: this.Rolename, opType: OperatorComparer.Contains }
    ]
}
this.grid.gridConfig = this.gridConfig;
this.grid.bindGridData(); 
}

}

