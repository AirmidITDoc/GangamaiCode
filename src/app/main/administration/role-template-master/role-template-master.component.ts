import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { RoleTemplateService } from "./role-template.service";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { RolePermissionComponent } from "../role-permission/role-permission.component";
import {SchdulerComponent } from "../scheduler/scheduler.component";

@Component({
  selector: 'app-role-template-master',
  templateUrl: './role-template-master.component.html',
  styleUrls: ['./role-template-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class RoleTemplateMasterComponent implements OnInit {
  msg: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  DialogRef: MatDialogRef<RolePermissionComponent>;
  displayedColumns: string[] = [
    "RoleId",
    "RoleName",
    "action"
  ];

  isLoading: String = '';
  sIsLoading: string = "";

  dsRoleMasterList = new MatTableDataSource<RoleMaster>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public _RoleService: RoleTemplateService,
    public toastr: ToastrService, public _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getRoleMasterList();
  }

  onSearch() {
    this.getRoleMasterList();
  }

  onSearchClear() {
    this._RoleService.myformSearch.reset({
      RoleNameSearch: ""
    });
    this.getRoleMasterList();
  }
  getRoleMasterList() {
    this._RoleService.getRoleMasterList((this._RoleService.myformSearch.get("RoleNameSearch")?.value??"")).subscribe((Menu) => {
      this.dsRoleMasterList.data = Menu as unknown as RoleMaster[];
      this.dsRoleMasterList.sort = this.sort;
      this.dsRoleMasterList.paginator = this.paginator;
    });
  }

  onSubmit() {
    if (this._RoleService.myform.valid) {
      if (!this._RoleService.myform.get("RoleId").value) {
        var m_data = {
          RoleName: this._RoleService.myform.get("RoleName").value.trim(),
          RoleId: this._RoleService.myform.get("RoleId").value | 0
        };
        this._RoleService.insertRoleMaster(m_data).subscribe((data) => {
          this.msg = data;
          if (data) {
            this.toastr.success('Record Saved Successfully.', 'Saved !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
          } else {
            this.toastr.error('Role not saved !, Please check API error..', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
          this.getRoleMasterList();
        }, error => {
          this.toastr.error('Role not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }

        );
      } else {
        var m_dataUpdate = {
          RoleId: this._RoleService.myform.get("RoleId").value,
          RoleName: this._RoleService.myform.get("RoleName").value.trim()
        };
        // console.log(m_dataUpdate);
        this._RoleService.insertRoleMaster(m_dataUpdate).subscribe((data) => {
          this.msg = data;
          if (data) {
            this.toastr.success('Record updated Successfully.', 'updated !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            this.getRoleMasterList();
          } else {
            error => {
              this.toastr.error('Role not updated !, Please check  error..', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
              });
            }
          }
          this.getRoleMasterList();
        }, error => {
          this.toastr.error('Role not updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        });
      }

      this.onClear();
    }
  }
  onClear() {
    this._RoleService.myform.reset({ IsActive: "true" });
    this._RoleService.initializeFormGroup();
  }
  onPermission(RoleId){
    const dialogRef = this._matDialog.open(RolePermissionComponent,
      {
        maxWidth: "50vw",
          height: '80vh',
          maxHeight:'790vh',
          width: '100%',
          data : {
            RoleId : RoleId,
          }
      });
    dialogRef.afterClosed().subscribe(result => {
    //this. getregistrationList();
    });
    // this.DialogRef = this._matDialog.open(
    //   RolePermissionComponent,
    //   {
    //     disableClose: false,
    //   }
    // );
    
  }

  // newSchduler(){
  //   const dialogRef = this._matDialog.open(NewSchdulerComponent,
  //     {
  //       maxWidth: "70vw",
  //       height: "510px",
  //       width: "90%",
         
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
    
  //   });
   
  // }


  onDeactive(RoleId) {
    this.confirmDialogRef = this._matDialog.open(
      FuseConfirmDialogComponent,
      {
        disableClose: false,
      }
    );
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to deactive?";
    this.confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let Query = "Update RoleMaster set IsActive=0 where RoleId=" + RoleId;
        this._RoleService.deactivateTheStatus(Query).subscribe((data) => (this.msg = data));
        this.getRoleMasterList();
      }
      this.confirmDialogRef = null;
    });
  }
  onEdit(row) {
    var m_data = {
      RoleId: row.roleId,
      RoleName: row.roleName
    };
    this._RoleService.populateForm(m_data);
  }
}

export class RoleMaster {
  RoleId: number;
  RoleName: string;
  constructor(RoleMaster) {
    {
      this.RoleId = RoleMaster.RoleId || 0;
      this.RoleName = RoleMaster.RoleName || "";
    }
  }

}
