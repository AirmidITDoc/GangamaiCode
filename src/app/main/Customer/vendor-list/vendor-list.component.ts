import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { NewVendorListComponent } from './new-vendor-list/new-vendor-list.component';
import { VendorListService } from './vendor-list.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { error } from 'console';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.scss']
})
export class VendorListComponent implements OnInit {

  displayedColumns: string[] = [
    'VendorId',
    'VendorName',
    'Address',
    'PinCode',
    'MobileNo',
    'VendorPersonName',
    'VendorPersonMobileNo',
    'DateTime',
    'Action'
  ];
  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;

  dsVendorInfo = new MatTableDataSource<VendorInfoList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _VendorList: VendorListService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getVendorList();
  }

  NewVendor(){
    const dialogRef = this._matDialog.open(NewVendorListComponent,
      {
        maxWidth: "75vw",
        height: '60%',
        width: '100%',
        
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getVendorList();
    });
  }

  getVendorList(){
    debugger
    this.sIsLoading='loading-data';
    var vdata={
      "VendorName":this._VendorList.SearchForm.get('VendorName').value + '%' || '%',
    }
    console.log("venderName:",vdata)
    this._VendorList.getVenderList(vdata).subscribe(data=>{
      this.dsVendorInfo.data=data as VendorInfoList[];
      console.log("data:",this.dsVendorInfo.data);
      this.dsVendorInfo.sort=this.sort;
      this.dsVendorInfo.paginator=this.paginator;
      this.sIsLoading='';
    },
  error=>{
    this.sIsLoading='';
  });

  }
  onClose(){
    this._matDialog.closeAll();
  }
  onClear(){
    this._VendorList.SearchForm.reset();
  }
  ChkAMCDet(contact){

  }
  OnEdit(contact){
    console.log(contact)
    const dialogRef = this._matDialog.open(NewVendorListComponent,
      {
        maxWidth: "75vw",
        height: '60%',
        width: '100%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getVendorList();
    });
  }

}
export class VendorInfoList {
  VendorName: any;
  VendorAddress: string;
  VendorPinCode: string;
  VendorMobileNo: any;
  VendorPersonName:string;
  VendorPersonMobileNo:any;
  VendorId :any;  
  CreatedBy:any;
  CreatedDatetime:any;
  ModifiedBy:any;
  ModifiedDateTime:any;

  constructor(VendorInfoList) {
    {
      this.VendorName = VendorInfoList.VendorName || '';
      this.VendorPersonName = VendorInfoList.VendorPersonName || '';
      this.VendorAddress = VendorInfoList.VendorAddress || '';
      this.VendorPinCode = VendorInfoList.VendorPinCode || 0;
      this.VendorMobileNo = VendorInfoList.VendorMobileNo || 0;
      this.VendorPersonMobileNo = VendorInfoList.VendorPersonMobileNo || 0;
      this.CreatedDatetime=VendorInfoList.CreatedDatetime || '';

    }
  }
}
