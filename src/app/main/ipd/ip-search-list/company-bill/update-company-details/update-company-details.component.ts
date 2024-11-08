import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { IPSearchListService } from '../../ip-search-list.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-update-company-details',
  templateUrl: './update-company-details.component.html',
  styleUrls: ['./update-company-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdateCompanyDetailsComponent implements OnInit {


  screenFromString = 'compnay-update';
  Myform: FormGroup;

  constructor(
    public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService, 
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<UpdateCompanyDetailsComponent>,  
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder
  ) 
  { }

  ngOnInit(): void {
    this.Myform = this.CreateMyForm();

  }
  CreateMyForm(){
    return this._formBuilder.group({

    });
  }

  onSave(){
    
  }
  onClose() {
    this.dialogRef.close();  
  }
}
