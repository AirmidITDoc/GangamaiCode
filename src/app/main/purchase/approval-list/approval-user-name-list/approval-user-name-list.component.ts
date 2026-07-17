import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ApprovalListService } from '../approval-list.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'app/core/services/config.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
    selector: 'app-approval-user-name-list',
    templateUrl: './approval-user-name-list.component.html',
    styleUrls: ['./approval-user-name-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ApprovalUserNameListComponent implements OnInit {
    displayedColumns = [
        // 'Status',
        'userName',
        'accessValueName',
        'button'
        // 'Action'
    ];

    UserForm: FormGroup;
    SendAppForm: FormGroup;
    registerObj: any = '';
    FormName: any = '';
    dateTimeObj: any;
    screenFromString = 'Common-form';
    autocompleteLoginAccess: string = "LoginAccessConfig";
    dsUserlist = new MatTableDataSource<UsernameList>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    constructor(
        public _ApprovalListService: ApprovalListService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public _ConfigService: ConfigService,
        private accountService: AuthenticationService,
        public toastr: ToastrService,
        public _formbuilder: FormBuilder,
        public _FormvalidationserviceService: FormvalidationserviceService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
        this.UserForm = this.CreateUserform();
        this.SendAppForm = this.CreateSendAppForm();

        if (this.data) {
            this.registerObj = this.data.Obj;
            this.FormName = this.data?.FormName || ''
        }
    }
    CreateUserform() {
        return this._formbuilder.group({
            AccessId: 0,
            Remark: ''
        })
    }
    selectChangeAccess(event) {
        this.getUserApprovalList(event?.value || 0)
    }
    getUserApprovalList(AccessValueId) {
        const data = {
            "first": 0,
            "rows": 999,
            "sortField": "UserId",
            "sortOrder": 0,
            "filters": [{ "fieldName": "AccessValueId", "fieldValue": String(AccessValueId), "opType": "Equals" }],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        }
        this._ApprovalListService.getApprovalUsernameList(data).subscribe(res => {
            console.log(data);
            this.dsUserlist.data = res.data
            this.dsUserlist.sort = this.sort
            this.dsUserlist.paginator = this.paginator
        });
    }

    CreateSendAppForm() {
        return this._formbuilder.group({
            approvalId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
            approvalNo: ['0', this._FormvalidationserviceService.allowEmptyStringValidator()],
            date: [new Date().toISOString],
            time: [new Date().toISOString],
            tranId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            transactionType: ['', this._FormvalidationserviceService.allowEmptyStringValidator()],
            approvalStatus: [0, this._FormvalidationserviceService.onlyNumberValidator()],
            authorizeBy: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            approvedDateTime: ['1900-01-01'],
            comment: ['', this._FormvalidationserviceService.allowEmptyStringValidatorOnly()],
        })
    }
//     {
//     "userId": 70203,
//     "userName": "SubhashSubhash",
//     "accessValueName": "IsPOVerify",
//     "accessValue": true
// }
    OnSendApproval(contact) {
        const formattedTime = this.datePipe.transform(new Date(), 'hh:mm a');
        const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        const FormattedDateTime = formattedDate + ' ' + formattedTime
debugger
        this.SendAppForm.patchValue({
            date:formattedDate || '',
            time:FormattedDateTime || '',
            tranId: this.registerObj?.purchaseID || 0,
            transactionType: this.FormName || '',
            comment: this.UserForm.get('Remark').value || '',
            authorizeBy:contact?.userId || 0
        })
        console.log("submitobj:", this.SendAppForm.value)
        if (this.SendAppForm.valid) {
            this._ApprovalListService.getInsertApproval(this.SendAppForm.value).subscribe(response => {
                if (response) {
                    this.onClose();
                }
            })
        } else {
            const invalidFields = [];
            if (this.SendAppForm.invalid) {
                for (const controlName in this.SendAppForm.controls) {
                    if (this.SendAppForm.controls[controlName].invalid) { invalidFields.push(`Purchase Form: ${controlName}`); }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
            }
        }

    } 
    onClose() {
        this.SendAppForm.reset();
        this.UserForm.reset();
        this.FormName = '';
        this.registerObj = '';
        this._matDialog.closeAll();
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

}

export class UsernameList {


    constructor() {

    }
}