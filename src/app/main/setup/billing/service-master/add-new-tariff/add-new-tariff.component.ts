import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ServiceMasterService } from '../service-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { fuseAnimations } from '@fuse/animations';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-add-new-tariff',
  templateUrl: './add-new-tariff.component.html',
  styleUrls: ['./add-new-tariff.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AddNewTariffComponent implements OnInit {

  AddTariff: FormGroup;
  TariffcmbList: any = [];
  NewTariffcmbList: any = [];
  isTariffIdSelected: boolean = false;
  NewisTariffIdSelected: boolean = false;
  filteredTariff: Observable<string[]>
  NewfilteredTariff: Observable<string[]>
  vNewTariff:any;
  vOldTariff:any;


  constructor(
    public _serviceMasterService: ServiceMasterService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddNewTariffComponent>,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.AddTariff = this.CreateAddTariff();
    this.getTariffNameCombobox();
    this.getNewTariffNameCombobox();
  }
  CreateAddTariff() {
    return this.formBuilder.group({
      TariffId: [''],
      NewTariffId: ['']
    })
  }
  getTariffNameCombobox() {
    this._serviceMasterService.getTariffMasterCombo().subscribe(data => {
      this.TariffcmbList = data;
      this.filteredTariff = this.AddTariff.get('TariffId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterTariff(value) : this.TariffcmbList.slice()),
      );
    });
  }
  getNewTariffNameCombobox() {
    this._serviceMasterService.getTariffMasterCombo().subscribe(data => {
      this.NewTariffcmbList = data;
      this.NewfilteredTariff = this.AddTariff.get('NewTariffId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._NewfilterTariff(value) : this.NewTariffcmbList.slice()),
      );
    });
  }
  private _filterTariff(value: any): string[] {
    if (value) {
      const filterValue = value && value.TariffName ? value.TariffName.toLowerCase() : value.toLowerCase();
      return this.TariffcmbList.filter(option => option.TariffName.toLowerCase().includes(filterValue));
    }
  }
  private _NewfilterTariff(value: any): string[] {
    if (value) {
      const filterValue = value && value.TariffName ? value.TariffName.toLowerCase() : value.toLowerCase();
      return this.NewTariffcmbList.filter(option => option.TariffName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextTariff(option) {
    return option && option.TariffName ? option.TariffName : '';
  }
  getOptionTextNewTariff(option) {
    return option && option.TariffName ? option.TariffName : '';
  }

  onSave() {

    if (this.vOldTariff == '' || this.vOldTariff == null || this.vOldTariff == undefined) {
      this.toastr.warning('Please select old Tariff Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.AddTariff.get('TariffId').value) {
      if (!this.TariffcmbList.some(item => item.TariffId == this.AddTariff.get('TariffId').value.TariffId)) {
        this.toastr.warning('Pleasse select valid old tariff Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.vNewTariff == '' || this.vNewTariff == null || this.vNewTariff == undefined) {
      this.toastr.warning('Please select new Tariff Name', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.AddTariff.get('NewTariffId').value) {
      if (!this.NewTariffcmbList.some(item => item.TariffId == this.AddTariff.get('NewTariffId').value.TariffId)) {
        this.toastr.warning('Pleasse select valid new tariff Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (this.AddTariff.get('TariffId').value) {
      if (this.AddTariff.get('NewTariffId').value) {
        if (this.TariffcmbList.some(item => item.TariffId == this.AddTariff.get('NewTariffId').value.TariffId)) {
          this.toastr.warning('same tariff name cannot be save,Please select different tariff name ', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      }
    }
    let saveServiceTarriffParams = {
      "old_TariffId": this.AddTariff.get('TariffId').value.TariffId || 0,
      "new_TariffId": this.AddTariff.get('NewTariffId').value.TariffId || 0
    }

    let submitData = {
      "saveServiceTarriffParams": saveServiceTarriffParams,
    }

    console.log(submitData)
    this._serviceMasterService.SavePackagedet(submitData).subscribe(reponse => {
      if (reponse) {
        this.toastr.success('Record Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.onClose();
      } else {
        this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
        this.onClose();
      }
    }, error => {
      this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  }
  onClose() {
    this.AddTariff.reset();
    this.dialogRef.close();
  }
}
