import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { OttableMasterService } from './ottable-master.service';
import { NewOttableMasterComponent } from './new-ottable-master/new-ottable-master.component';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-ottable-master',
  templateUrl: './ottable-master.component.html',
  styleUrls: ['./ottable-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class OttableMasterComponent implements OnInit {

  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  dataSource = new MatTableDataSource<OtTableMasterList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [
    // 'IsCancelled',
    'OtTableId',
    'OtRoomName',
    'LocationName',
    'CreatedBy',
    'IsActive',
    'action'
  ];

  constructor(public _otTableMasterService: OttableMasterService,
    private accountService: AuthenticationService,
    public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
  ) { }

  ngOnInit(): void {
    this.getotTableList();
  }

  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._otTableMasterService.myformSearch.controls; }

  getotTableList() {
    debugger;
    this.sIsLoading = 'loading-data';
  
    // Check if there is a valid search term
    const otRoomNameSearch = this._otTableMasterService.myformSearch.get("OtRoomNameSearch").value || '';
  
    const D_data = {
      "OTTableName": otRoomNameSearch.trim() ? otRoomNameSearch + '%' : '%', // Use '%' if search is empty
    };
  
    console.log("TableList:", D_data);
  
    this._otTableMasterService.getOTTableListlist(D_data).subscribe(
      Visit => {
        this.dataSource.data = Visit as OtTableMasterList[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.sIsLoading = '';
      },
      error => {
        console.error("Error loading table data:", error);
        this.sIsLoading = '';
      }
    );
  }
  

  newOtTable(){
    const dialogRef = this._matDialog.open(NewOttableMasterComponent,
      {
        maxWidth: "60%",
        width: "45%",
        height: "40%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getotTableList();
    });
  }
  
  OnEdit(contact){
    const dialogRef = this._matDialog.open(NewOttableMasterComponent,
      {
        maxWidth: "60%",
        width: "45%",
        height: "40%",
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getotTableList();
    });
  }

  
  isLoading = true;

  CancleOTBooking(contact) {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 
    
    debugger
    Swal.fire({
      title: 'Do you want to cancel the OT Table?',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((flag) => {
      if (flag.isConfirmed) {
        debugger
        let otTableCancel = {};
        otTableCancel['otTableId'] = contact.OTTableId;
        otTableCancel['isCancelled'] = 1;
        otTableCancel['isCancelledBy'] = this.accountService.currentUserValue.user.id;
        otTableCancel['isCancelledDateTime'] = formattedDate;
  
        let submitData = {
          "cancelOTTableMasterParam": otTableCancel,
        };

        console.log(submitData);
  
        this.isLoading = true;
  
        this._otTableMasterService.OtTableCancle(submitData).subscribe(
          (response) => {
            if (response) {
              this.toastr.success('Record Cancelled Successfully.', 'Cancelled!', {
                toastClass: 'tostr-tost custom-toast-success',
              });
            } else {
              this.toastr.error('Record Data not Cancelled! Please check API error..', 'Error!', {
                toastClass: 'tostr-tost custom-toast-error',
              });
            }
            this.getotTableList();
  
            this.isLoading = false;
          },
          (error) => {
            
            this.toastr.error('An error occurred while canceling the appointment.', 'Error!', {
              toastClass: 'tostr-tost custom-toast-error',
            });
            this.isLoading = false;
          }
        );
      } else {
        this.getotTableList();
      }
    });
  }

  onClear() {
    this._otTableMasterService.myformSearch.reset({
      TemplateNameSearch: "",
    });
    this.getotTableList();
  }

  onDeactive(OTTableId){
    debugger
    Swal.fire({
      title: 'Confirm Status',
      text: 'Are you sure you want to Change Status?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes,Change Status!'
  }).then((result) => {
    debugger

      if (result.isConfirmed) {
        let Query;
        const tableItem = this.dataSource.data.find(item => item.OTTableId === OTTableId);
        console.log("table:",tableItem)
    
        if (tableItem.IsActive) {
            Query = "Update M_OT_TableMaster set IsActive=0 where OTTableId=" + OTTableId;
        } else {
            Query = "Update M_OT_TableMaster set IsActive=1 where OTTableId=" + OTTableId;
        }
    
        console.log("query:", Query);
    
        this._otTableMasterService.deactivateTheStatus(Query)
            .subscribe(
                (data) => {
                    Swal.fire('Changed!', 'OTTable Status has been Changed.', 'success');
                    this.getotTableList();
                },
                (error) => {
                    Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                }
            );
    }
    
  });
  }

}
export class OtTableMasterList {
  OtTableId:number;
  OtRoomName:string;
  Floor:any;
  IsDeleted:String;
  LocationName:any;
  OTTableName:string;
  IsActive:string;
  CreatedBy:boolean;
  OTTableId:string;
  IsCancelled: boolean;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtTableMasterList) {
    {
      this.OtTableId = OtTableMasterList.OtTableId || '';
      this.OtRoomName = OtTableMasterList.OtRoomName || '';
      this.Floor = OtTableMasterList.Floor || '';
      this.IsDeleted = OtTableMasterList.IsDeleted;
      this.LocationName=OtTableMasterList.LocationName || '';
      this.OTTableName=OtTableMasterList.OTTableName || '';
      this.IsActive=OtTableMasterList.IsActive || '';
      this.OTTableId=OtTableMasterList.OTTableId || '';
      this.IsCancelled = OtTableMasterList.IsCancelled || '';
      this.CreatedBy=OtTableMasterList.CreatedBy || '';
    }
  }
}
