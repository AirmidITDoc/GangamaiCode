import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { CompanyMasterService } from "../company-master.service";
import { CompanyMasterComponent } from "../company-master.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { map, startWith, takeUntil } from "rxjs/operators";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "app/core/services/authentication.service";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-company-master-list",
  templateUrl: "./company-master-list.component.html",
  styleUrls: ["./company-master-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CompanyMasterListComponent implements OnInit {


  vCompanyName: any;
  vAddress: any;
  vCity: any;
  vPinNo: any;
  vMobileNo: any;
  vCompTypeId: any;
  vTariffId: any;
  vPhoneNo: any;
  vFaxNo: any;
  isCompTypeIdSelected: boolean = false;
  isTariffIdSelected: boolean = false;
  filteredcompType: Observable<string[]>;
  filteredTarrifname: Observable<string[]>;
  submitted = false;
  CompanytypecmbList: any = [];
  TariffcmbList: any = [];
  isLoading = true;
  registerObj: any;



  constructor(
    public _companyService: CompanyMasterService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CompanyMasterComponent>,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.registerObj = this.data.Obj
      console.log(this.registerObj)
      this.vCompanyName = this.registerObj.CompanyName
      this.vAddress = this.registerObj.Address
      this.vCity = this.registerObj.City
      this.vMobileNo = this.registerObj.MobileNo
      this.vPhoneNo = this.registerObj.PhoneNo
      this.vPinNo = this.registerObj.PinNo
      this.vFaxNo = this.registerObj.FaxNo
      if(this.registerObj.IsActive){
        this._companyService.myform.get('IsDeleted').setValue(this.registerObj.IsActive)
      }
    }

    this.getTariffNameCombobox();
    this.geCompanytypeNameCombobox();
  }

  getTariffNameCombobox() {
    this._companyService.getTariffMasterCombo().subscribe(data => {
      this.TariffcmbList = data;
      this.filteredTarrifname = this._companyService.myform.get('TariffId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterTariff(value) : this.TariffcmbList.slice()),
      );
      if (this.data) {
        const ddValue = this.TariffcmbList.filter(c => c.TariffId == this.registerObj.TraiffId);
        this._companyService.myform.get('TariffId').setValue(ddValue[0]);
        return;
      }
    });
  }
  geCompanytypeNameCombobox() {
    this._companyService.getCompanytypeMasterCombo().subscribe((data) => {
      this.CompanytypecmbList = data;

      this.filteredcompType = this._companyService.myform.get('CompTypeId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCompType(value) : this.CompanytypecmbList.slice()),
      );
      if (this.data) {
        const ddValue = this.CompanytypecmbList.filter(c => c.CompanyTypeId == this.registerObj.CompTypeId);
        this._companyService.myform.get('CompTypeId').setValue(ddValue[0]);
        return;
      }
    });
  }

  //filters
  private _filterTariff(value: any): string[] {
    if (value) {
      const filterValue = value && value.TariffName ? value.TariffName.toLowerCase() : value.toLowerCase();
      return this.TariffcmbList.filter(option => option.TariffName.toLowerCase().includes(filterValue));
    }
  }
  private _filterCompType(value: any): string[] {
    if (value) {
      const filterValue = value && value.TypeName ? value.TypeName.toLowerCase() : value.toLowerCase();
      return this.CompanytypecmbList.filter(option => option.TypeName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextTariff(option) {
    return option && option.TariffName ? option.TariffName : '';
  }
  getOptionTextCompType(option) {
    return option && option.TypeName ? option.TypeName : '';
  }






  onSubmit() {
    debugger


    if ((this.vCompanyName == '' || this.vCompanyName == undefined || this.vCompanyName == null)) {
      this.toastr.warning('Please enter Company Name.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if ((this.vCompTypeId == '' || this.vCompTypeId == undefined || this.vCompTypeId == null)) {
      this.toastr.warning('Please select Company Type.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._companyService.myform.get('CompTypeId').value) {
      if (!this.CompanytypecmbList.some(item => item.TypeName === this._companyService.myform.get('CompTypeId').value.TypeName)) {
        this.toastr.warning('Please Select valid Company Type', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if ((this.vTariffId == '' || this.vTariffId == undefined || this.vTariffId == null)) {
      this.toastr.warning('Please select Tariff Name.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._companyService.myform.get('TariffId').value) {
      if (!this.TariffcmbList.some(item => item.TariffId === this._companyService.myform.get('TariffId').value.TariffId)) {
        this.toastr.warning('Please Select valid Tariff Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if ((this.vAddress == '' || this.vAddress == undefined || this.vAddress == null)) {
      this.toastr.warning('Please enter Address', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vCity == '' || this.vCity == undefined || this.vCity == null)) {
      this.toastr.warning('Please enter Address', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vMobileNo == '' || this.vMobileNo == undefined || this.vMobileNo == null)) {
      this.toastr.warning('Please enter Mobile No', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (!this._companyService.myform.get("CompanyId").value) {
      var m_data = {
        companyMasterInsert: {
          compTypeId: this._companyService.myform.get("CompTypeId").value.CompanyTypeId || 0,
          companyName: this._companyService.myform.get("CompanyName").value || '',
          address: this._companyService.myform.get("Address").value || '',
          city: this._companyService.myform.get("City").value || '',
          pinNo: this._companyService.myform.get("PinNo").value || 0,
          phoneNo: this._companyService.myform.get("PhoneNo").value || 0,
          mobileNo: this._companyService.myform.get("MobileNo").value || 0,
          faxNo: this._companyService.myform.get("FaxNo").value || 0,
          traiffId: this._companyService.myform.get("TariffId").value.TariffId || 0,
          isActive: Boolean(JSON.parse(this._companyService.myform.get("IsDeleted").value)),
          addedBy: this._loggedService.currentUserValue.user.id || 0,
          updatedBy: 0,
          isCancelled: false,
          isCancelledBy: 0,
          isCancelledDate: "01/01/1900",
        },
      };
      debugger
      console.log(m_data);
      this._companyService.companyMasterInsert(m_data).subscribe((data) => {
        if (data) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose();
        } else {
          this.toastr.error('Company Master Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
          this.onClose();
        }
      }, error => {
        this.toastr.error('Company Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    } else {
      var m_dataUpdate = {
        companyMasterUpdate: {
          companyId: this._companyService.myform.get("CompanyId").value || 0,
          compTypeId: this._companyService.myform.get("CompTypeId").value.CompanyTypeId || 0,
          companyName: this._companyService.myform.get("CompanyName").value || '',
          address: this._companyService.myform.get("Address").value || '',
          city: this._companyService.myform.get("City").value || '',
          pinNo: this._companyService.myform.get("PinNo").value || 0,
          phoneNo: this._companyService.myform.get("PhoneNo").value || 0,
          mobileNo: this._companyService.myform.get("MobileNo").value || 0,
          faxNo: this._companyService.myform.get("FaxNo").value || 0,
          traiffId: this._companyService.myform.get("TariffId").value.TariffId || 0,
          isActive: Boolean(JSON.parse(this._companyService.myform.get("IsDeleted").value)),
          addedBy: 0,
          updatedBy: this._loggedService.currentUserValue.user.id || 0,
          isCancelled: false,
          isCancelledBy: 0,
          isCancelledDate: "01/01/1900",
        },
      };

      this._companyService.companyMasterUpdate(m_dataUpdate).subscribe((data) => {
        if (data) {
          this.toastr.success('Record updated Successfully.', 'updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onClose();
        } else {
          this.toastr.error('Company Master Data not updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
        this.onClose();
      }, error => {
        this.toastr.error('Company Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }
  }

  onClose() {
    this._companyService.myform.reset();
    this.dialogRef.close();
  }

  @ViewChild('CompTypeId') CompTypeId: ElementRef;
  @ViewChild('TariffId') TariffId: ElementRef;
  @ViewChild('address') address: ElementRef;
  @ViewChild('City') City: ElementRef;
  @ViewChild('PinNo') PinNo: ElementRef;
  @ViewChild('PhoneNo') PhoneNo: ElementRef;
  @ViewChild('MobileNo') MobileNo: ElementRef;
  @ViewChild('FaxNo') FaxNo: ElementRef;

  public onEnterCompanyName(event): void {
    if (event.which === 13) {
      this.CompTypeId.nativeElement.focus();
    }
  }
  public onEntergrpname(event): void {
    if (event.which === 13) {
      this.TariffId.nativeElement.focus();
    }
  }

  public onEntertariff(event): void {
    if (event.which === 13) {
      this.address.nativeElement.focus();
    }
  }
  public onEnteraddress(event): void {
    if (event.which === 13) {
      this.City.nativeElement.focus();
    }
  }
  public onEnterCity(event): void {
    if (event.which === 13) {
      this.PinNo.nativeElement.focus();
    }
  }
  public onEnterPinNo(event): void {
    if (event.which === 13) {
      this.PhoneNo.nativeElement.focus();
    }
  }

  public onEnterPhoneNo(event): void {
    if (event.which === 13) {
      this.MobileNo.nativeElement.focus();
    }
  }
  public onEnterMobileNo(event): void {
    if (event.which === 13) {
      this.FaxNo.nativeElement.focus();
    }
  }

  get f() {
    return this._companyService.myform.controls;
  }
  keyPressCharater(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/^[a-zA-Z]*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
}
