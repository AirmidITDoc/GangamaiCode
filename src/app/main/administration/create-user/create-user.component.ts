import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserService } from './create-user.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { NewcreateUserComponent } from './newcreate-user/newcreate-user.component';
import { NUserComponent } from './nuser/nuser.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CreateUserComponent implements OnInit {
    myuserform: any;

        constructor(public _CreateUserService: CreateUserService, 
            public _matDialog: MatDialog, public toastr: ToastrService)
            { }

        @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
         
            ngAfterViewInit() {
                this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
            }
            @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

        gridConfig: gridModel = {
            apiUrl: "LoginManager/LoginList",
            columnsList: [
                { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                { heading: "LoginName", key: "firstName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
                { heading: "RoleName", key: "roleName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                { heading: "StoreName", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
                { heading: "Days", key: "days", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 60 },
                {
                    heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
                    template: this.actionButtonTemplate  // Assign ng-template to the column
                }
                // {
                //     heading: "Action", key: "action" , width: 100, align: "right", type: gridColumnTypes.action, actions: [
                //         {
                //             action: gridActions.edit, callback: (data: any) => {
                //                 this.onSave(data);
                //             }
                //         }, {
                //             action: gridActions.delete, callback: (data: any) => {
                //                 this._CreateUserService.deactivateTheStatus(data.userId).subscribe((response: any) => {
                //                     this.toastr.success(response.message);
                //                     this.grid.bindGridData();
                //                 });
                //             }
                //         }]
                // } //Action 1-view, 2-Edit,3-delete
            ],
            sortField: "UserId",
            sortOrder: 0,
            filters: [
                { fieldName: "UserName", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
                { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
            ],
            row: 10
        }
    
        ngOnInit(): void { }
    
        onSave(row: any = null) {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button
    
            let that = this;
            const dialogRef = this._matDialog.open( NUserComponent, 
                {
                    maxHeight: '95vh',
                    width: '90%'
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }

        onEdit(row: any = null) {
          const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
          buttonElement.blur(); // Remove focus from the button
  
          let that = this;
          const dialogRef = this._matDialog.open( NUserComponent, 
              {
                  maxHeight: '95vh',
                  width: '90%',
                  data: row
              });
          dialogRef.afterClosed().subscribe(result => {
              if (result) {
                  that.grid.bindGridData();
              }
          });
      }

        Password:string;

  PasswordView(contact) {
    debugger
    const today = new Date();
    const Currentyear = today.getFullYear()
    this.Password = ( contact.userLoginName + "@" + Currentyear)
    Swal.fire({
        title: 'Your Password is ' + contact.password,
        text: "Do you want to reset Your Password",
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Reset Password" 
    }).then((flag) => {
      if (flag.isConfirmed) {
        let submitData = {
            "userId": contact.userId,
            "userName": contact.userLoginName,
            "password": this.Password
          }
  
        console.log(submitData);
  
        this._CreateUserService.PasswordUpdate(submitData).subscribe(
          (response) => {
            if (response) {
              this.toastr.success('Password Updated Successfully.', 'Success!', {
                toastClass: 'tostr-tost custom-toast-success',
              });
            } else {
              this.toastr.error('Password not Updated! Please check API error..', 'Error!', {
                toastClass: 'tostr-tost custom-toast-error',
              });
            }
          },
          (error) => {
            
            this.toastr.error('An error occurred while Updating the Password.', 'Error!', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        );
      } else {
      }
    });
  }
}
//   isLoading: boolean;
//   UserIdList: any = [];
//   @ViewChild(MatSort) sort: MatSort;
//   @ViewChild(MatPaginator) paginator: MatPaginator;
//   @ViewChild(MatAccordion) accordion: MatAccordion;
//   hasSelectedContacts: boolean;
//   click: boolean = false;

//   MouseEvent = true;
//   displayedColumns: string[] = [
//     'UserName',
//     'UserLoginName',
//     'RoleName',
//     'StoreName',
//     'DoctorName',
//     'IsDateIntervalDays',
//     // 'MailDomain',
//     // 'MailId' ,
//     'IsActive',
//     // 'AddChargeIsDelete',
//     // 'IsBedStatus',
//     // 'IsCollection',
//     // 'IsCurrentStk',
//     // 'IsDateInterval',
//     // 'IsDoctorType',
//     // 'IsGRNVerify',
//     // 'IsInchIndVfy',
//     // 'IsIndentVerify',
//     // 'IsPOVerify',
//     // 'IsPatientInfo',
//     'action'
//   ];
//   sIsLoading: string = '';
//   dataSource1 = new MatTableDataSource<UserList>();

//   dataSource = new MatTableDataSource<UserMaster>();

//   constructor(public _UserService: CreateUserService,
//     private accountService: AuthenticationService,
//     // public notification:NotificationServiceService,
//     public _matDialog: MatDialog,
//     private _fuseSidebarService: FuseSidebarService,
//     private advanceDataStored: AdvanceDataStored,
//     public _AdministrationService: AdministrationService,
//   ) { }


//   ngOnInit(): void {
//     this.getUserList();


//   }


//   onEdit(row) {
//     var m_data = {
//       "RollId": row.RollId,
//       "RollName": row.RollName,
//     }

//     console.log(m_data);
//     this._UserService.populateForm(m_data);
//   }

//   ChangePassword() {
//     const dialogRef = this._matDialog.open(PasswordChangeComponent,
//       {
//         maxWidth: "40vw",
//         maxHeight: "50vh", width: '100%', height: "100%"
//       });

//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed - Insert Action', result);
//       // this.getDoctorMasterList();
//     });
//   }
//   toggleSidebar(name): void {
//     this._fuseSidebarService.getSidebar(name).toggleOpen();
//   }

//   RoleTemp() {
//     const dialogRef = this._matDialog.open(RoleTemplateMasterComponent,
//       {
//         maxWidth: "80vw",
//         maxHeight: "300vh", width: '100%', height: "100%"
//       });
//     dialogRef.afterClosed().subscribe(result => {

//     });
//   }

//   onresultentry(c, m) {
//     console.log(m);
//     let xx = {
//       UserId: m.UserId,
//       FirstName: m.FirstName,
//       LastName: m.LastName,
//       UserLoginName: m.UserLoginName,
//       IsActive: m.IsActive,
//       AddedBy: m.AddedBy,
//       RoleName: m.RoleName,
//       RoleId: m.RoleId,
//       UserName: m.UserName,
//       StoreId: m.StoreId,
//       StoreName: m.StoreName,
//       IsDoctorType: m.IsDoctorType,
//       DoctorID: m.DoctorID,
//       DoctorName: m.DoctorName,
//       IsPOVerify: m.IsPOVerify,
//       IsGRNVerify: m.IsGRNVerify,
//       IsCollection: m.IsCollection,
//       IsBedStatus: m.IsBedStatus,
//       IsCurrentStk: m.IsCurrentStk,
//       IsPatientInfo: m.IsPatientInfo,
//       IsDateInterval: m.IsDateInterval,
//       IsDateIntervalDays: m.IsDateIntervalDays,
//       MailId: m.MailId,
//       MailDomain: m.MailDomain,
//       AddChargeIsDelete: m.AddChargeIsDelete,
//       IsIndentVerify: m.IsIndentVerify,
//       IsInchIndVfy: m.IsInchIndVfy,
//     };
//     this.advanceDataStored.storage = new UserList(xx);
//     const dialogRef = this._matDialog.open(UserDetailComponent,
//       {
//         maxWidth: "85vw",
//         height: "auto",
//         width: '100%',
//         data: {
//           registerObj: m,
//         }
//       });
//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed - Insert Action', result);
//       this.getUserList();
//     });
//   }

//   addUserDetails() {
//     const dialogRef = this._matDialog.open(UserDetailComponent,
//       {
//         maxWidth: "85vw",
//         height: "auto",
//         width: '100%',
//       });
//     dialogRef.afterClosed().subscribe(result => {
//       console.log('The dialog was closed - Insert Action', result);
//       this.getUserList();
//     });
//   }

//   onShow(event: MouseEvent) {
//     this.click = !this.click;
//     setTimeout(() => {
//       {
//         this.sIsLoading = 'loading-data';
//         this.getUserList();
//       }
//     }, 1000);
//     this.MouseEvent = true;
//     this.click = true;
//   }

//   onClear() {
//     this._UserService.myformSearch.get('UserName').reset();
//   }

//   getUserList() {
//     this.sIsLoading = 'loading-data';
//     var m_data = {
//       "UserName": (this._UserService.myformSearch.get("UserName").value).trim() || '%',
//     }
//     this._UserService.getUserList(m_data).subscribe(Visit => {
//       this.dataSource1.data = Visit as UserList[];
//       console.log(this.dataSource1.data)
//       this.dataSource1.sort = this.sort;
//       this.dataSource1.paginator = this.paginator;
//       this.sIsLoading = '';
//       this.click = false;
//     },
//       error => {
//         this.sIsLoading = '';
//       });
//   }



// export class UserList {
//   UserId: number;
//   FirstName: string;
//   LastName: string;
//   UserLoginName: string;
//   RoleName: string;
//   UserName: string;
//   StoreName: string;
//   DoctorName: string;
//   IsDateIntervalDays: number;
//   MailDomain: string;
//   MailId: string;
//   IsActive: boolean;
//   AddChargeIsDelete: boolean;
//   IsBedStatus: boolean;
//   IsCollection: boolean;
//   IsCurrentStk: boolean;
//   IsDateInterval: number;
//   IsDoctorType: boolean;
//   IsGRNVerify: boolean;
//   IsInchIndVfy: boolean;
//   IsIndentVerify: boolean;
//   IsPOVerify: boolean;
//   IsPatientInfo: boolean;
//   IsPurchaseRequestionVerify: boolean;
//   IsPathAuthorizationVerify: boolean;
//   IsCreditBillScroll: boolean;
//   IsCollectionInformation: boolean;
//   IsViewBrowseBill: boolean;
//   Indent: string;

//   constructor(UserList) {
//     this.UserId = UserList.UserId || 0;
//     this.FirstName = UserList.FirstName || '';
//     this.LastName = UserList.LastName || '';
//     this.UserLoginName = UserList.UserLoginName || '';
//     this.RoleName = UserList.RoleName || ''
//     this.UserName = UserList.UserName || '';
//     this.StoreName = UserList.StoreName || '';
//     this.DoctorName = UserList.DoctorName || '';
//     this.IsDateIntervalDays = UserList.IsDateIntervalDays || 0;
//     this.MailDomain = UserList.MailDomain || '';
//     this.MailId = UserList.MailId || '';
//     this.IsActive = UserList.IsActive || 0;
//     this.AddChargeIsDelete = UserList.AddChargeIsDelete || 0;
//     this.IsBedStatus = UserList.IsBedStatus || 0;
//     this.IsCollection = UserList.IsCollection || 0;
//     this.IsCurrentStk = UserList.IsCurrentStk || 0;
//     this.IsDateInterval = UserList.IsDateInterval || 0;
//     this.IsDoctorType = UserList.IsDoctorType || 0;
//     this.IsGRNVerify = UserList.IsGRNVerify || 0;
//     //this.IsGRNVerify= UserList.IsGRNVerify || 0;
//     this.IsInchIndVfy = UserList.IsInchIndVfy || 0;
//     this.IsIndentVerify = UserList.IsIndentVerify || 0;

//     // if(this. IsGRNVerify= true)
//     // this. IsGRNVerify= UserList.IsGRNVerify || 'YES';
//     // else(this. IsGRNVerify= false)
//     // this. IsGRNVerify= UserList.IsGRNVerify || 'NO';

//     this.IsPOVerify = UserList.IsPOVerify || 0;
//     this.IsPatientInfo = UserList.IsPatientInfo || 0;
//     this.IsPurchaseRequestionVerify = UserList.IsPurchaseRequestionVerify || 0;
//     this.IsPathAuthorizationVerify = UserList.IsPathAuthorizationVerify || 0;
//     this.IsCreditBillScroll = UserList.IsCreditBillScroll || 0;
//     this.IsCollectionInformation = UserList.IsCollectionInformation || 0;
//     this.IsViewBrowseBill = UserList.IsViewBrowseBill || 0;




//   }

// }

// export class UserMaster {

//   UserId: Number;
//   FirstName: String;
//   LastName: String;
//   LoginName: String;
//   Password: String;
//   RoleId: Number;
//   RoleName: String;
//   IsDoctor: Boolean;
//   DoctorName: String;
//   StoreId: Number;
//   StoreName: String;
//   MAilId: String;
//   MailDomain: String;
//   Status: boolean;
  /**
   * Constructor
   */
//   constructor(UserMaster) {
//     {
//       this.UserId = UserMaster.UserId || '';
//       this.FirstName = UserMaster.FirstName || '';
//       this.LastName = UserMaster.LastName || '';
//       this.LoginName = UserMaster.LoginName || '';
//       this.Password = UserMaster.Password || '';
//       this.RoleId = UserMaster.RoleId || '';
//       this.RoleName = UserMaster.RoleName || '';
//       this.IsDoctor = UserMaster.IsDoctor || '';
//       this.DoctorName = UserMaster.DoctorName || '';
//       this.StoreId = UserMaster.StoreId || '';
//       this.StoreName = UserMaster.StoreName || '';
//       this.MAilId = UserMaster.MAilId || '';
//       this.MailDomain = UserMaster.MailDomain || '';
//       this.Status = UserMaster.Status || '';

//     }
//   }
// }






