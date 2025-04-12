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
import { FormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CreateUserComponent implements OnInit {
  myuserform: FormGroup;

  constructor(public _CreateUserService: CreateUserService, private _formBuilder: UntypedFormBuilder,
    public _matDialog: MatDialog, public toastr: ToastrService) { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  allcolumns = [
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
      UserName: []
    });
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'UserName')
      this.myuserform.get('UserName').setValue("")

    this.onChangeFirst();
  }
  UserName: any
  onChangeFirst() {
    this.UserName = this.myuserform.get('UserName').value + '%'
    this.getfilterdata();
  }

  getfilterdata() {
debugger
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
    const dialogRef = this._matDialog.open(NUserComponent,
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
            if (response) {
              this.toastr.success('Password Updated Successfully.', 'Success!', {
                toastClass: 'tostr-tost custom-toast-success',
              });
            } else {
              this.toastr.error('Password not Updated! Please check API error..', 'Error!', {
                toastClass: 'tostr-tost custom-toast-error',
              });
            }

            this.grid.bindGridData();
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
