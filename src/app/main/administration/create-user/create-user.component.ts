import { Component, HostBinding, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { AirmidCardViewComponent } from 'app/main/shared/componets/airmid-card-view/airmid-card-view.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CreateUserService } from './create-user.service';
import { NUserComponent } from './nuser/nuser.component';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CreateUserComponent implements OnInit {
  @HostBinding('style.display') display = 'flex';
  @HostBinding('style.flex') flex = '1 1 auto';
  @HostBinding('style.minHeight') minH = '0';
  @HostBinding('style.flexDirection') dir = 'column';
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.Login, permissionType.Add);
     
  myuserform: FormGroup;
  autocompleteModeStoreName: string = "Store";
  autocompleteModeWebRoleName: string = "WebRole";
  statusOptions = [
    { text: 'All', value: '' },
    { text: 'IsActive', value: '1' },
    { text: 'IsDeactive', value: '0' }
  ];

  // Add view mode and user data for card view
  viewMode: 'table' | 'card' = 'table';
  userList: any[] = [];

  // Card view config and pagination
  cardConfig = {
    fields: [
      { label: 'First Name', key: 'firstName' },
      { label: 'Last Name', key: 'lastName' },
      { label: 'Web Role', key: 'webRoleName' },
      { label: 'User Name', key: 'userLoginName' },
      { label: 'Unit Name', key: 'hospitalName' },
      { label: 'Store Name', key: 'storeName' },
      { label: 'Doctor Name', key: 'doctorName' },
      { label: 'Days', key: 'days' },
      { label: 'Is Active', key: 'isActive' }
    ],
    actions: [
      { icon: 'remove_red_eye', tooltip: 'View Password', action: 'viewPassword' },
      { icon: 'edit', tooltip: 'Edit', action: 'edit' },
      { icon: 'delete', tooltip: 'Delete', action: 'delete' }
    ]
  };
  pageSize = 25;
  resultsLength = 0;

  signature: PageNames = PageNames.USER_SIGNATURE;

  constructor(public _CreateUserService: CreateUserService, private _formBuilder: UntypedFormBuilder,public permissionService: PagePermissionService,
    public _matDialog: MatDialog, public toastr: ToastrService) { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild(AirmidCardViewComponent) cardView: AirmidCardViewComponent;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'doctorID')!.template = this.docIcon;
  }
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('docIcon') docIcon!: TemplateRef<any>;

  allcolumns = [
    { heading: "User", key: "doctorID", sort: true, align: 'left', type: gridColumnTypes.template },
    { heading: "First Name", key: "firstName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Last Name", key: "lastName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "User Name", key: "userLoginName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Web RoleName", key: "webRoleName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Unit Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Days", key: "days", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 60 },
    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ];

  gridConfig: gridModel = {
 permissionCode: permissionCodes.Login,
    apiUrl: "LoginManager/LoginList",
    columnsList: this.allcolumns,
    sortField: "UserId",
    sortOrder: 0,
    filters: [
      { fieldName: "UserName", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
      { fieldName: "MobileNo", fieldValue: "0", opType: OperatorComparer.StartsWith },
      { fieldName: "WebRoleId", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "StoreId", fieldValue: "0", opType: OperatorComparer.Equals },
      // { fieldName: "status", fieldValue: "%", opType: OperatorComparer.StartsWith },
    ]
  }

  ngOnInit(): void {
    this.myuserform = this.filterForm();
  }

  onAfterLoadData(data: any[]) {
    this.userList = data;
    this.resultsLength = data.length;
  }

  onCardAction(event: { action: string, item: any }) {
    if (event.action === 'viewPassword') {
      this.PasswordView(event.item);
    } else if (event.action === 'edit') {
      this.onEdit(event.item);
    } else if (event.action === 'delete') {
    }
  }
  onCardExport(type: string) {
  }
  onCardPage(event: any) {

  }
  filterForm(): FormGroup {
    return this._formBuilder.group({
      UserName: [''],
      FirstName: [''],
      LastName: [''],
      MobileNo: ["", [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      storeId: [],
      roleId: [],
      status: ['']
    });
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'UserName')
      this.myuserform.get('UserName').setValue("")
    if (event == 'FirstName')
      this.myuserform.get('FirstName').setValue("")
    if (event == 'LastName')
      this.myuserform.get('LastName').setValue("")
    if (event == 'MobileNo')
      this.myuserform.get('MobileNo').setValue("")

    this.onChangeFirst();
  }
  UserName: any;
  fName: any;
  lName: any;
  mNo: any;
  StoreId = "0";
  RoleId = "0";
  StatusValue = "";
  onChangeFirst() {
    this.UserName = this.myuserform.get('UserName').value + '%'
    this.fName = this.myuserform.get('FirstName').value + '%'
    this.lName = this.myuserform.get('LastName').value + '%'
    this.mNo = this.myuserform.get('MobileNo').value

    this.RoleId = this.myuserform.get('roleId').value ?? "0";
    this.StoreId = this.myuserform.get('storeId').value ?? "0";
    this.getfilterdata();
  }

  storeChange(value) {
    if (value.value !== 0) {
      this.StoreId = value.value
      this.RoleId = "0"
    }
    else
      this.StoreId = "0"
    this.onChangeFirst();
  }

  roleChange(value) {
    if (value.value !== 0) {
      this.RoleId = value.value
      this.StoreId = "0"
    }
    else
      this.RoleId = "0"
    this.onChangeFirst();
  }

  // statusChange(value) {
  //   const selected = value;
  //   this.myuserform.get('status').setValue(selected);
  //   this.StatusValue = selected?.value ?? "";
  //   // Optionally trigger filtering
  //   // this.onChangeFirst();
  // }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "LoginManager/LoginList",
      columnsList: this.allcolumns,
      sortField: "UserId",
      sortOrder: 0,
      filters: [
        { fieldName: "UserName", fieldValue: this.UserName, opType: OperatorComparer.StartsWith },
        { fieldName: "FirstName", fieldValue: this.fName, opType: OperatorComparer.StartsWith },
        { fieldName: "LastName", fieldValue: this.lName, opType: OperatorComparer.StartsWith },
        { fieldName: "MobileNo", fieldValue: this.mNo, opType: OperatorComparer.StartsWith },
        { fieldName: "WebRoleId", fieldValue: this.RoleId, opType: OperatorComparer.Equals },
        { fieldName: "StoreId", fieldValue: this.StoreId, opType: OperatorComparer.Equals },
      ]
    }

    // Update grid based on current view mode
    if (this.viewMode === 'table' && this.grid) {
      this.grid.gridConfig = this.gridConfig;
      this.grid.bindGridData();
    } else if (this.viewMode === 'card' && this.cardView) {
      this.cardView.gridConfig = this.gridConfig;
      this.cardView.bindGridData();
    }
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NUserComponent,
      {
        maxWidth: "95vw",
        maxHeight: '95vh',
        height: '95%',
        width: '90%',
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (that.viewMode === 'table' && that.grid) {
          that.grid.bindGridData();
        } else if (that.viewMode === 'card' && that.cardView) {
          that.cardView.bindGridData();
        }
      }
    });
  }

  onEdit(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement;
    buttonElement.blur();

    const that = this;
    const dialogRef = this._matDialog.open(NUserComponent,
      {
        maxWidth: "95vw",
        maxHeight: '95vh',
        height: '95%',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (that.viewMode === 'table' && that.grid) {
          that.grid.bindGridData();
        } else if (that.viewMode === 'card' && that.cardView) {
          that.cardView.bindGridData();
        }
      }
    });
  }


  Usercancle(data) {
    Swal.fire({
      title: 'Do you want to cancel the User?',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((flag) => {
      if (flag.isConfirmed) {
        console.log(data)
        debugger
        const data1 = {
          userId: data.userId
        }
        this._CreateUserService.deactivateTheStatus(data1).subscribe((response: any) => {
          this.grid.bindGridData();
        });
      }
    });
  }

  Password: string;

  PasswordView(contact) {

    const today = new Date();
    const Currentyear = today.getFullYear()
    this.Password = (contact.userLoginName + "@" + Currentyear)
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
        const submitData = {
          "userId": contact.userId,
          "userName": contact.userLoginName,
          "password": this.Password
        }
        console.log(submitData);

        this._CreateUserService.PasswordUpdate(submitData).subscribe(
          (response) => {
            this.toastr.success(response.message);
            if (this.viewMode === 'table' && this.grid) {
              this.grid.bindGridData();
            } else if (this.viewMode === 'card' && this.cardView) {
              this.cardView.bindGridData();
            }
          });
      }
    });
  }
}
