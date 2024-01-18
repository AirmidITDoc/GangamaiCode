import { Component, Inject, OnInit, ViewChild, ViewEncapsulation, Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoleTemplateService } from '../role-template-master/role-template.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from "@fuse/animations";
import { FormBuilder, FormGroup } from '@angular/forms';
import { NestedTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, of as observableOf } from 'rxjs';

export class FileNode {
  children?: FileNode[];
  title: string;
  url?: any;
  isView?:boolean;
  isAdd?:boolean;
  isEdit?:boolean;
  isDelete?:boolean;
  menuId?:number;
  id?:number;
}

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RolePermissionComponent implements OnInit {
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: FileNode[];
  displayedColumns: string[] = [
    "Id",
    "LinkName", "IsView",
    "IsAdd", "IsEdit", "IsDelete"
  ];

  isLoading: String = '';
  sIsLoading: string = "";

  dsPermissionList = new MatTableDataSource<MenuMaster>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public _RoleService: RoleTemplateService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RolePermissionComponent>,
  ) {
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    //this.nestedDataSource = TREE_DATA;
    this._RoleService.getmenus(1).subscribe((Menu) => {
      this.nestedDataSource=Menu as FileNode[];
    });
  }

  hasNestedChild = (_: number, nodeData: FileNode) => nodeData.children;

  private _getChildren = (node: FileNode) => observableOf(node.children);

  ngOnInit(): void {
    if (this.data) {
      this.getPermissionList(this.data.RoleId);
      setTimeout(() => {
        
      this.nestedTreeControl.expandAll();
      }, 2000);
    }
  }
  getPermissionList(RoleId: number) {
    this._RoleService.getPermissionList(RoleId).subscribe((Menu) => {
      this.dsPermissionList = new MatTableDataSource<MenuMaster>(Menu as MenuMaster[]);
      this.dsPermissionList.sort = this.sort;
      this.dsPermissionList.paginator = this.paginator;
    });
  }
  valueChange(obj, type, $event) {
    let lstItem = this.dsPermissionList.data.find(x => x.menuId == obj.menuId);
    if (type == 'view') {
      lstItem.isView = $event.checked;
    }
    else if (type == 'add') {
      lstItem.isAdd = $event.checked;
    }
    else if (type == 'edit') {
      lstItem.isEdit = $event.checked;
    }
    else if (type == 'delete') {
      lstItem.isDelete = $event.checked;
    }
  }
  updatePermission(obj,type,$event){
    let lstItem = this.nestedDataSource.find(x => x.id == obj.id);
    if (type == 'view') {
      lstItem.isView = $event.checked;
      if((lstItem?.children?.length??0)>0){
        for(let i=0;i<lstItem.children.length;i++)
        lstItem.children[i].isView=$event.checked;
      }
    }
    else if (type == 'add') {
      lstItem.isAdd = $event.checked;
      if((lstItem?.children?.length??0)>0){
        for(let i=0;i<lstItem.children.length;i++)
        lstItem.children[i].isAdd=$event.checked;
      }
    }
    else if (type == 'edit') {
      lstItem.isEdit = $event.checked;
      if((lstItem?.children?.length??0)>0){
        for(let i=0;i<lstItem.children.length;i++)
        lstItem.children[i].isEdit=$event.checked;
      }
    }
    else if (type == 'delete') {
      lstItem.isDelete = $event.checked;
      if((lstItem?.children?.length??0)>0){
        for(let i=0;i<lstItem.children.length;i++)
        lstItem.children[i].isDelete=$event.checked;
      }
    }
  }


  onClose() {
    this.dialogRef.close();
  }
  onSubmit() {
    this._RoleService.savePermission(this.dsPermissionList.data).subscribe((Menu) => {
      this.toastr.success('Permission updated Successfully.', 'updated !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    });
  }

}
export class MenuMaster {
  menuId: number;
  linkName: string;
  parent: string;
  roleId: number;
  isView: boolean;
  isAdd: boolean;
  isEdit: boolean;
  isDelete: boolean;
  /**
   * Constructor
   *
   * @param PrefixMaster
   */
  constructor(MenuMaster) {
    {
      this.menuId = MenuMaster.menuId || 0;
      this.linkName = MenuMaster.linkName || "";
      this.parent = MenuMaster.parent || "";
      this.roleId = MenuMaster.roleId || 0;
      this.isView = MenuMaster.isView || false;
      this.isAdd = MenuMaster.isAdd || false;
      this.isEdit = MenuMaster.isEdit || false;
      this.isDelete = MenuMaster.isDelete || false;

    }
  }

}