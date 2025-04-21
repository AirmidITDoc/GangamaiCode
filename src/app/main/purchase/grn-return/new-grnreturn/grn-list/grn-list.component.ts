import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GrnReturnService } from '../../grn-return.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { fuseAnimations } from '@fuse/animations';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-grn-list',
  templateUrl: './grn-list.component.html',
  styleUrls: ['./grn-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class GrnListComponent implements OnInit {
  displayedColumns2 = [
    'Action',
    "GRNNO",
    "GRNDate",
    "SupplierName",
    'TotalAmount',
    'GrandTotal',
  ];
  dateTimeObj:any;
  SupplierList:any=[];
  isSupplierSelected:boolean=false;
  filteredoptionsSupplier: Observable<string[]>;
  optionsSupplier:any;
  sIsLoading: string;
  Onsave:boolean = true;
  autocompleteSupplier:string="SupplierMaster"
  vSupplier=0;

  dsGRNList = new MatTableDataSource<GRNList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  constructor(
    public _GRNReturnHeaderList: GrnReturnService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    public _dialogRef: MatDialogRef<GrnListComponent>,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getGRNList();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  selectChangeSupplier(row:any){
    console.log(row)
    this.vSupplier=row.value
  }

  getGRNList() {
    // debugger;
    const fromDate = this._GRNReturnHeaderList.GRNListFrom.get('start').value;
    const toDate = this._GRNReturnHeaderList.GRNListFrom.get('end').value;
  
    const Param = {
      first: 0,
      rows: 10,
      sortField: "GRNID",
      sortOrder: 0,
      filters: [
        {
          fieldName: "SupplierId",
          fieldValue: String(this.vSupplier),
          opType: "Equals"
        },
        {
          fieldName: "From_Dt",
          fieldValue: fromDate,
          opType: "Equals"
        },
        {
          fieldName: "To_Dt",
          fieldValue: toDate,
          opType: "Equals"
        },
        {
          fieldName: "StoreId",
          fieldValue: "2",
          opType: "Equals"
        }
      ],
      exportType: "JSON",
      columns: []
    };
  
    console.log(Param);
  
    this._GRNReturnHeaderList.getGRNList(Param).subscribe(data => {
      this.dsGRNList.data = data.data as GRNList[];
      console.log(this.dsGRNList.data)
      this.dsGRNList.sort = this.sort;
      this.dsGRNList.paginator = this.paginator;
      this.sIsLoading = '';
    }, error => {
      this.sIsLoading = '';
    });
  }

  parseDate(dateStr: string): Date | null {
    
    const parts = dateStr.split(' ');
    const dateParts = parts[0].split('-'); // ["31", "07", "2026"]
    const time = parts[1] || '00:00:00';
  
    if (dateParts.length === 3) {
      const formatted = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${time}`;
      return new Date(formatted);
    }
  
    return null;
  }  
  
  SelectedArray: any = [];
  tableElementChecked(event, element) {
    // debugger
    if (event.checked) {
      this.SelectedArray.push(element);
    }
    console.log(this.SelectedArray)
    this.Onsave=false;
  }

  onClear(){
    this._GRNReturnHeaderList.GRNListFrom.reset();
  }

  onClose(){
    this._matDialog.closeAll();
    // this._GRNReturnHeaderList.GRNListFrom.reset();
  }

  OnReset(){
   // this._GRNReturnHeaderList.GRNListFrom.reset();
    this.dsGRNList.data = []; 
    this.onClose();
  }

  OnselectGRNList(){
    
    if ((!this.dsGRNList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    
    this._dialogRef.close(this.SelectedArray);
    this._GRNReturnHeaderList.GRNListFrom.get("start").setValue((new Date()).toISOString())
    this._GRNReturnHeaderList.GRNListFrom.get("start").setValue((new Date()).toISOString())
  }
}
export class GRNList{
  GRNNO:any;
  GRNDate:number;
  SupplierName:string;
  TotalAmount:number;
  GrandTotal:number;

  constructor(GRNList){
    {
      this.GRNNO = GRNList.GRNNO || 0;
      this.GRNDate = GRNList.GRNDate || 0;
      this.SupplierName = GRNList.SupplierName || '';
      this.TotalAmount = GRNList.TotalAmount || 0;
      this.GrandTotal = GRNList.GrandTotal || 0;
    }
  }
}
