import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ItemCompanyMasteService } from './item-company-maste.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { NewItemCompanyComponent } from './new-item-company/new-item-company.component';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-item-company-master',
  templateUrl: './item-company-master.component.html',
  styleUrls: ['./item-company-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ItemCompanyMasterComponent implements OnInit {

  displayedColumns: string[] = [
    "ItemCompanyNameId",
    "ItemCompanyName",
    "AddedBy",
    "IsDeleted",
    "action",
];

  daCompanyList = new MatTableDataSource<CompanyList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    public _ItemCompanyMasteService : ItemCompanyMasteService,
    public toastr : ToastrService, 
    public _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getitemCompanyMasterList()
  }
  onSearch() {
    this.getitemCompanyMasterList();
}

onSearchClear() {
    this._ItemCompanyMasteService.myformSearch.reset({
        ItemCompanyNameSearch: "",
        IsDeletedSearch: "2",
    });
    this.getitemCompanyMasterList();
}
getitemCompanyMasterList() {
    var param = { 
      CompanyName: this._ItemCompanyMasteService.myformSearch
                .get("ItemCompanyNameSearch").value.trim() + "%" || "%",
    };
    console.log(param)
    this._ItemCompanyMasteService
        .getitemCompanyMasterList(param)
        .subscribe((Menu) => {
            this.daCompanyList.data = Menu as CompanyList[];
            console.log(this.daCompanyList.data)
            this.daCompanyList.sort = this.sort;
            this.daCompanyList.paginator = this.paginator;
        });
}

onEdit(row) {
  const dialogRef = this._matDialog.open(NewItemCompanyComponent,
    {
      maxWidth: "100%",
      height: '45%',
      width: '40%' ,
      data:{
        Obj:row
      }
    });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed - Insert Action', result);
    this.getitemCompanyMasterList();
  }); 
} 
 

newCompany(){
  const dialogRef = this._matDialog.open(NewItemCompanyComponent,
    {
      maxWidth: "100%",
      height: '45%',
      width: '40%' 
    });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed - Insert Action', result);
    this.getitemCompanyMasterList();
  }); 
}
}
export class CompanyList {
  ItemCompanyNameId: number;
  ItemCompanyName: string;
  IsDeleted: boolean;
  AddedBy: number;
  UpdatedBy: number;
 
  /**
   * Constructor
   *
   * @param CompanyList
   */
  constructor(CompanyList) {
      {
          this.ItemCompanyNameId = CompanyList.ItemCompanyNameId || "";
          this.ItemCompanyName = CompanyList.ItemCompanyName || "";
          this.IsDeleted = CompanyList.IsDeleted || "false";
          this.AddedBy = CompanyList.AddedBy || "";
          this.UpdatedBy = CompanyList.UpdatedBy || "";
      }
  }
}
