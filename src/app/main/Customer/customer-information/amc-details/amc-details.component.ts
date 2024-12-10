import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CustomerInformationService } from '../customer-information.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerInfoList } from '../customer-information.component';

@Component({
  selector: 'app-amc-details',
  templateUrl: './amc-details.component.html',
  styleUrls: ['./amc-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AMCDetailsComponent implements OnInit {
  displayedColumns:string[] =[
    'CustomerName',
    'AMCStartDate',
    'AMCDuration',
    'AMCEndDate',
    'AMCAmount',
    'AMCPaidDate',
    'PaymentId' 
  ]

  
  registerObj:any; 
  isLoading: String = '';
  sIsLoading: string = "";
  chargeslist:any=[];
  vDoctorName:any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dsAMCDetList = new MatTableDataSource<CustomerInfoList>();

  constructor(
    public _CustomerInfo: CustomerInformationService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private elementRef: ElementRef,
    public dialogRef: MatDialogRef<AMCDetailsComponent>,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.getAmcDetList(this.registerObj);
    }

  }

getAmcDetList(Obj){
  this.isLoading = 'loading-data'
  var vdata={
    "CustomerId":Obj.CustomerId
  }
  console.log(vdata)
  this._CustomerInfo.getAmcDetList(vdata).subscribe(data=>{
    this.dsAMCDetList.data = data as CustomerInfoList[];
    this.dsAMCDetList.sort = this.sort;
    this.dsAMCDetList.paginator = this.paginator
    console.log(this.dsAMCDetList)
  })
}

  onClose(){
    this._matDialog.closeAll();
  }
}
 