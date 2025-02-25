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

@Component({
  selector: 'app-role-template-master',
  templateUrl: './role-template-master.component.html',
  styleUrls: ['./role-template-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class RoleTemplateMasterComponent implements OnInit {

    constructor(
        public _RoleTemplateService: RoleTemplateService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

     @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    
    gridConfig: gridModel = {
        apiUrl: "Administration/RoleMasterList",
        columnsList: [
            { heading: "Code", key: "roleId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Role Name", key: "roleName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
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
        ],
        sortField: "RoleId",
        sortOrder: 0,
        filters: [
            { fieldName: "RoleName", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Start", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
        ],
        row: 10
    }
    
    ngOnInit(): void {
        // this.getRoleMasterList();
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

}


    // displayedColumns: string[] = [
    //   "RoleId",
    //   "RoleName",
    //   "action"
    // ];
  
    // isLoading: String = '';
    // sIsLoading: string = "";
  
    // dsRoleMasterList = new MatTableDataSource<RoleMaster>();
    // @ViewChild(MatSort) sort: MatSort;
    // @ViewChild(MatPaginator) paginator: MatPaginator;
  
    // constructor(public _RoleService: RoleTemplateService,
    //   public toastr: ToastrService, public _matDialog: MatDialog
    // ) { }
  
    // ngOnInit(): void {
    //   this.getRoleMasterList();
    // }
  
    // onSearch() {
    //   this.getRoleMasterList();
    // }
  
    // onSearchClear() {
    //   this._RoleService.myformSearch.reset({
    //     RoleNameSearch: ""
    //   });
    //   this.getRoleMasterList();
    // }
    // getRoleMasterList() {
    //   this._RoleService.getRoleMasterList((this._RoleService.myformSearch.get("RoleNameSearch")?.value??"")).subscribe((Menu) => {
    //     this.dsRoleMasterList.data = Menu as unknown as RoleMaster[];
    //     this.dsRoleMasterList.sort = this.sort;
    //     this.dsRoleMasterList.paginator = this.paginator;
    //   });
    // }
  
    // onSubmit() {
    //   if (this._RoleService.myform.valid) {
    //     if (!this._RoleService.myform.get("RoleId").value) {
    //       var m_data = {
    //         RoleName: this._RoleService.myform.get("RoleName").value.trim(),
    //         RoleId: this._RoleService.myform.get("RoleId").value | 0
    //       };
    //       this._RoleService.insertRoleMaster(m_data).subscribe((data) => {
    //         this.msg = data;
    //         if (data) {
    //           this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //             toastClass: 'tostr-tost custom-toast-success',
    //           });
    //         } else {
    //           this.toastr.error('Role not saved !, Please check API error..', 'Error !', {
    //             toastClass: 'tostr-tost custom-toast-error',
    //           });
    //         }
    //         this.getRoleMasterList();
    //       }, error => {
    //         this.toastr.error('Role not saved !, Please check API error..', 'Error !', {
    //           toastClass: 'tostr-tost custom-toast-error',
    //         });
    //       }
  
    //       );
    //     } else {
    //       var m_dataUpdate = {
    //         RoleId: this._RoleService.myform.get("RoleId").value,
    //         RoleName: this._RoleService.myform.get("RoleName").value.trim()
    //       };
    //       // console.log(m_dataUpdate);
    //       this._RoleService.insertRoleMaster(m_dataUpdate).subscribe((data) => {
    //         this.msg = data;
    //         if (data) {
    //           this.toastr.success('Record updated Successfully.', 'updated !', {
    //             toastClass: 'tostr-tost custom-toast-success',
    //           });
    //           this.getRoleMasterList();
    //         } else {
    //           error => {
    //             this.toastr.error('Role not updated !, Please check  error..', 'Error !', {
    //               toastClass: 'tostr-tost custom-toast-error',
    //             });
    //           }
    //         }
    //         this.getRoleMasterList();
    //       }, error => {
    //         this.toastr.error('Role not updated !, Please check API error..', 'Error !', {
    //           toastClass: 'tostr-tost custom-toast-error',
    //         });
    //       });
    //     }
  
    //     this.onClear();
    //   }
    // }
    // onClear() {
    //   this._RoleService.myform.reset({ IsActive: "true" });
    //   this._RoleService.initializeFormGroup();
    // }
    
  
    // // newSchduler(){
    // //   const dialogRef = this._matDialog.open(NewSchdulerComponent,
    // //     {
    // //       maxWidth: "70vw",
    // //       height: "510px",
    // //       width: "90%",
           
    // //     });
    // //   dialogRef.afterClosed().subscribe(result => {
      
    // //   });
     
    // // }
  
  
    // onDeactive(RoleId) {
    //   this.confirmDialogRef = this._matDialog.open(
    //     FuseConfirmDialogComponent,
    //     {
    //       disableClose: false,
    //     }
    //   );
    //   this.confirmDialogRef.componentInstance.confirmMessage =
    //     "Are you sure you want to deactive?";
    //   this.confirmDialogRef.afterClosed().subscribe((result) => {
    //     if (result) {
    //       let Query = "Update RoleMaster set IsActive=0 where RoleId=" + RoleId;
    //       this._RoleService.deactivateTheStatus(Query).subscribe((data) => (this.msg = data));
    //       this.getRoleMasterList();
    //     }
    //     this.confirmDialogRef = null;
    //   });
    // }
    // onEdit(row) {
    //   var m_data = {
    //     RoleId: row.roleId,
    //     RoleName: row.roleName
    //   };
    //   this._RoleService.populateForm(m_data);
    // }
//   }
  
//   export class RoleMaster {
//     RoleId: number;
//     RoleName: string;
//     constructor(RoleMaster) {
//       {
//         this.RoleId = RoleMaster.RoleId || 0;
//         this.RoleName = RoleMaster.RoleName || "";
//       }
//     }
  
//   }
  