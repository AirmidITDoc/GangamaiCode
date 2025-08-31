import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CreateUserService } from './create-user.service';
import { NUserComponent } from './nuser/nuser.component';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CreateUserComponent implements OnInit {
  myuserform: FormGroup;
  autocompleteModeStoreName: String = "Store";
  autocompleteModeWebRoleName: String = "WebRole";

  constructor(public _CreateUserService: CreateUserService, private _formBuilder: UntypedFormBuilder,
    public _matDialog: MatDialog, public toastr: ToastrService) { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'doctorID')!.template = this.docIcon;
  }
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('docIcon') docIcon!: TemplateRef<any>;

  allcolumns = [
    { heading: "-", key: "doctorID", sort: true, align: 'left', type: gridColumnTypes.template },
    { heading: "First Name", key: "firstName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Last Name", key: "lastName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "User Name", key: "userLoginName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Web RoleName", key: "webRoleName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Unit Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
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
    apiUrl: "LoginManager/LoginList",
    columnsList: this.allcolumns,
    sortField: "UserId",
    sortOrder: 0,
    filters: [
      { fieldName: "UserName", fieldValue: "%", opType: OperatorComparer.StartsWith }
    ]
  }

  ngOnInit(): void {
    this.myuserform = this.filterForm();
  }
  filterForm(): FormGroup {
    return this._formBuilder.group({
      UserName: [],
      FirstName: [''],
      LastName: [''],
      storeId: [],
      roleId: []
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

    this.onChangeFirst();
  }
  UserName: any
  fName: any;
  lName: any;
  StoreId = "0";
  RoleId = "0";
  onChangeFirst() {
    this.UserName = this.myuserform.get('UserName').value + '%'
    // this.fName = this.myuserform.get('FirstName').value + '%'
    // this.lName = this.myuserform.get('LastName').value + '%'
    this.getfilterdata();
  }

  storeChange(value) {
    if (value.value !== 0)
      this.StoreId = value.value
    else
      this.StoreId = "0"

    // this.onChangeFirst();
  }

  roleChange(value) {
    if (value.value !== 0)
      this.RoleId = value.value
    else
      this.RoleId = "0"

    // this.onChangeFirst();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "LoginManager/LoginList",
      columnsList: this.allcolumns,
      sortField: "UserId",
      sortOrder: 0,
      filters: [
        { fieldName: "UserName", fieldValue: this.UserName, opType: OperatorComparer.Contains }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    let that = this;
    const dialogRef = this._matDialog.open(NUserComponent,
      {
        maxWidth: "95vw",
        maxHeight: '95vh',
        height: '95%',
        width: '90%',
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
        that.grid.bindGridData();
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
        let submitData = {
          "userId": contact.userId,
          "userName": contact.userLoginName,
          "password": this.Password
        }
        console.log(submitData);

        this._CreateUserService.PasswordUpdate(submitData).subscribe(
          (response) => {
            this.toastr.success(response.message);
            this.grid.bindGridData();
          });
      }
    });
  }
}
