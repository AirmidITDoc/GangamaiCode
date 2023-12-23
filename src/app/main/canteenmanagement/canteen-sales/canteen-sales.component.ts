import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CanteenmanagementService } from '../canteenmanagement.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-canteen-sales',
  templateUrl: './canteen-sales.component.html',
  styleUrls: ['./canteen-sales.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class CanteenSalesComponent implements OnInit {
  displayedColumns = [
    'Code',
    'ItemName',
    'Price',
  ];
  displayedColumns1 = [
    'ItemName',
    'Price',
    'Qty',
    'Amount'
  ];
  displayedColumns2 = [
    'Date',
    'WardName',
  ];

  sIsLoading: string;
  isItemIdSelected:boolean=false;
  chargeslist: any;

  dsItemTable1= new MatTableDataSource<ItemTable1List>();
  dsItemDetTable2 = new MatTableDataSource<ItemDetTable2List>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
   
  constructor(
    public  _CanteenmanagementService:CanteenmanagementService,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this. getItemTable1List();
  }
  getItemTable1List() {
    this.sIsLoading = 'loading-data';
    var vdata = {   
      "ItemName":'%',
      "IsOtherOrIsEmployee": this._CanteenmanagementService.userFormGroup.get('Type').value 
    }
     console.log(vdata);
      this._CanteenmanagementService.getItemTable1List(vdata).subscribe(data => {
      this.dsItemTable1.data = data as ItemTable1List[];
     console.log(this.dsItemTable1.data)
      this.dsItemTable1.sort = this.sort;
      this.dsItemTable1.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  } 
  getItemDetailList(row) {
    this.sIsLoading = 'save';
    this.dsItemDetTable2.data = [];
    if (this.chargeslist && this.chargeslist.length > 0) {
      let duplicateItem = this.chargeslist.filter((ele, index) => ele.Id === row.ItemID);
      if (duplicateItem && duplicateItem.length == 0) {
        this.addChargList(row);
        return;
      }
      this.sIsLoading = '';
      this.dsItemDetTable2.data = this.chargeslist;
 
    } else if (this.chargeslist && this.chargeslist.length == 0) {
      this.addChargList(row);
    }
  }

  addChargList(row) {
    this.chargeslist.push(
      {
        ItemID: row.ItemID,
        ItemName: row.ItemName,
        price: row.price || 0
      });
    this.sIsLoading = '';
     console.log(this.chargeslist);
    this.dsItemDetTable2.data = this.chargeslist;
    
  }
}
export class ItemTable1List {
 
  ItemName:string;
  Code: Number;
  Price:number;
 
  constructor(ItemTable1List) {
    {
      this.Code = ItemTable1List.Code || 0;
      this.Price = ItemTable1List.Price || 0;
      this.ItemName = ItemTable1List.ItemName || "";
    }
  }
}
export class ItemDetTable2List {
 
  ItemName:string;
  Qty: Number;
  Price:number;
  Amount:number;
 
  constructor(ItemTable1List) {
    {
      this.Qty = ItemTable1List.Qty || 0;
      this.Amount = ItemTable1List.Amount || 0;
      this.Price = ItemTable1List.Price || 0;
      this.ItemName = ItemTable1List.ItemName || "";
    }
  }
}