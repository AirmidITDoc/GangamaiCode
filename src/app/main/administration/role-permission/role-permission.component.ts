import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RoleTemplateService } from '../role-template-master/role-template.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from "@fuse/animations";

@Component({
  selector: 'app-role-permission',
  templateUrl: './role-permission.component.html',
  styleUrls: ['./role-permission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RolePermissionComponent implements OnInit {
  displayedColumns: string[] = [
    "Id",
    "LinkName",
    "IsAdd","IsEdit","IsDelete","IsView"
  ];

  isLoading: String = '';
  sIsLoading: string = "";

  dsPermissionList = new MatTableDataSource<MenuMaster>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public _RoleService: RoleTemplateService,
    public toastr: ToastrService, public _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getPermissionList();
  }
  getPermissionList() {
    this._RoleService.getPermissionList().subscribe((Menu) => {
      debugger
      this.dsPermissionList = new MatTableDataSource<MenuMaster>(Menu as MenuMaster[]);
      this.dsPermissionList.sort = this.sort;
      this.dsPermissionList.paginator = this.paginator;
    });
  }

  onClose(){

}

}
export class MenuMaster {
  Id: number;
  LinkName: string;
  /**
   * Constructor
   *
   * @param PrefixMaster
   */
  constructor(MenuMaster) {
    {
      this.Id = MenuMaster.Id || 0;
      this.LinkName = MenuMaster.LinkName || "";
    }
  }

}