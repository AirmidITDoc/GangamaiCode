import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReorderlevelsummaryService } from './reorderlevelsummary.service';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IndentrequestComponent } from './indentrequest/indentrequest.component';

@Component({
  selector: 'app-reorderlevelsummary',
  templateUrl: './reorderlevelsummary.component.html',
  styleUrls: ['./reorderlevelsummary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ReorderlevelsummaryComponent implements OnInit {
  displayedColumns = [
    'Action',
    'ItemName',
    'Packing',
    'BalQty',
    'ReorderQty'
  ]
  dateTimeObj: any;
  sIsLoading:string ='';
  isLoadingStr: string = "";
  isLoading: String = '';
  RaisedIndentList:any=[];
  

  dsReorderlevelSummery = new MatTableDataSource<ReorderlvlList>();
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;  

  constructor(
    public _Reorderlevelsummery:ReorderlevelsummaryService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getReorderlvlList(){
    var vdata={
      'StoreID':this._loggedService.currentUserValue.user.storeId || 0,
      'ReOderQty':this._Reorderlevelsummery.SearchFrom.get('ReorderQty').value,
      'vType': this._Reorderlevelsummery.SearchFrom.get('Type').value
    }
    this.sIsLoading = 'loading-data';
     this._Reorderlevelsummery.getIssuTrackerList(vdata).subscribe(data => {
     this.dsReorderlevelSummery.data = data as ReorderlvlList[];
     this.dsReorderlevelSummery.sort = this.sort;
     this.dsReorderlevelSummery.paginator = this.paginator;
     this.sIsLoading = '';
   },
     error => {
       this.sIsLoading = '';
     });
  }
  tableElementChecked(event,element){
    if (event.checked) {
      this.RaisedIndentList.push(element);
    }
  }
  RaiseIndent() {
    const dialogRef = this._matDialog.open(IndentrequestComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: {
          Obj: this.RaisedIndentList,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getReorderlvlList();
      this.RaisedIndentList = [];
    });
  }
  OnClear(){
    this._Reorderlevelsummery.SearchFrom.reset();
  }
}
export class ReorderlvlList{
  ItemName:string;
  BalQty:any;
  ReorderQty:any;
  IndentQty: any;
  constructor(ReorderlvlList){
    {
      this.ItemName = ReorderlvlList.ItemName || '';
      this.BalQty = ReorderlvlList.BalQty || 0;
      this.ReorderQty = ReorderlvlList.ReorderQty || 0;
      this.IndentQty = ReorderlvlList.IndentQty || 0;
    }
  }
}
