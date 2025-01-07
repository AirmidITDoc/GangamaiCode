import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoleTemplateService } from '../role-template-master/role-template.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from "@fuse/animations";
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

export class FileNode {
    children?: FileNode[];
    title: string;
    url?: any;
    isView?: boolean;
    isAdd?: boolean;
    isEdit?: boolean;
    isDelete?: boolean;
    menuId?: number;
    id?: string;
    translate?: string;
    type?: string;
    icon?: string;
}
export class ExampleFlatNode {
    expandable: boolean;
    level?: number;
    children?:FileNode[];
}
@Component({
    selector: 'app-role-permission',
    templateUrl: './role-permission.component.html',
    styleUrls: ['./role-permission.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RolePermissionComponent implements OnInit {
    roleId:number=0;
    displayedColumns: string[] = ['name', 'count'];

    private transformer = (node: FileNode, level: number) => {
        return {
            expandable: !!node.children && node.children.length > 0,
            title: node.title,
            url: node.url,
            isView: node.isView,
            isAdd: node.isAdd,
            isEdit: node.isEdit,
            isDelete: node.isDelete,
            menuId: node.id,
            id: node.id,
            translate: node.translate,
            type: node.type,
            icon: node.icon,
            level: level,
            children: node.children
        };
    };

    // ------------------------------------------------------------------------------------------------
    // Added by nikunj
    public treeControl = new FlatTreeControl<ExampleFlatNode>(node => node.level, node => node.expandable);

    public treeFlattener = new MatTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);

    public dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

    // ------------------------------------------------------------------------------------------------


    nestedTreeControl: NestedTreeControl<FileNode>;
    nestedDataSource: FileNode[];

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
        this._RoleService.getPermissionList(this.data.RoleId).subscribe((Menu) => {
            this.dataSource.data = Menu as FileNode[];
        });
    }

    hasNestedChild = (_: number, nodeData: FileNode) => nodeData.children;

    ngOnInit(): void {
        if (this.data) {
            this.roleId=this.data.RoleId;
        }
    }
    updatePermission(obj, type, $event) {
        let proptype = "";
        if (type == 'view') proptype = "isView";
        else if (type == 'add') proptype = "isAdd";
        else if (type == 'edit') proptype = "isEdit";
        else if (type == 'delete') proptype = "isDelete";
        const descendants = this.treeControl.getDescendants(obj);
        for (let i = 0; i < descendants.length; i++) {
            //this.chkunchk(obj.children[i], type, proptype, $event);
            descendants[i][proptype] = $event.checked;
            if ((descendants[i].children ?? []).length > 0) {
                for (let j = 0; j < descendants[i].children.length; j++) {
                    // var objNode=this.dataSource._flattenedData.value.find(x=>x["menuId"]==descendants[i].children[j].menuId);
                    var objNode=this.treeControl.dataNodes.find(x=>x["menuId"]==descendants[i].children[j].menuId);
                    if(objNode)
                        objNode[proptype] = $event.checked;
                    descendants[i].children[j][proptype] = $event.checked;
                }
            }
        }
        // var objNode=this.dataSource._flattenedData.value.find(x=>x["menuId"]==obj.menuId);
        var objNode=this.treeControl.dataNodes.find(x=>x["menuId"]==obj.menuId);
        if(objNode)
            objNode[proptype] = $event.checked;
    }


    onClose() {
        this.dialogRef.close();
    }
      
    onSubmit() {
        // var data=this.dataSource._flattenedData.value.map(obj => ({ ...obj, RoleId: this.roleId }));
        var data=this.treeControl.dataNodes.map(obj => ({ ...obj, RoleId: this.roleId }));
        this._RoleService.savePermission(data).subscribe((Menu) => {
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

function observableOf(children: FileNode[]) {
    throw new Error('Function not implemented.');
}
