import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Row } from 'jspdf-autotable';
import { CategoryMasterService } from './category-master.service';
import { NewCategoryMasterComponent } from './new-category-master/new-category-master.component';

@Component({
  selector: 'app-category-master',
  templateUrl: './category-master.component.html',
  styleUrls: ['./category-master.component.scss']
})
export class CategoryMasterComponent implements OnInit {
  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  dataSource = new MatTableDataSource<CategoryMasterList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [
    'SystemId',
    'SystemName',
    'IsActive',
  ];

  constructor(public _categoryMasterService: CategoryMasterService,
    private accountService: AuthenticationService,
    public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
  ) { }

  ngOnInit(): void {
    this.getCategoryList();
  }

  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._categoryMasterService.myformSearch.controls; }

  getCategoryList(){

  }

  newCategory(){
    const dialogRef = this._matDialog.open(NewCategoryMasterComponent,
      {
        maxWidth: "60%",
        width: "45%",
        height: "35%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCategoryList();
    });
  }
  
  OnEdit(obj){

  }

  onClear() {
    this._categoryMasterService.myformSearch.reset({
      TemplateNameSearch: "",
    });
    this.getCategoryList();
  }

}
export class CategoryMasterList {
  SystemId:number;
  SystemName:string;
  IsDeleted:String;
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(CategoryMasterList) {
    {
      this.SystemId = CategoryMasterList.SystemId || '';
      this.SystemName = CategoryMasterList.SystemName || '';
      this.IsDeleted = CategoryMasterList.IsDeleted;
    }
  }
}