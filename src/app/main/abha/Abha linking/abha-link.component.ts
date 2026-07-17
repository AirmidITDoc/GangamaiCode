import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AbhaLinkService } from './abha-link.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-abha-link',
  templateUrl: './abha-link.component.html',
  styleUrls: ['./abha-link.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AbhaLinkComponent {

  abhaForm: FormGroup;
  isProfileData = false
  dateofBirth: any;

  constructor(
    public _abhaService: AbhaLinkService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datePipe: DatePipe,
    // public toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.abhaForm = this._abhaService.createAbhaform();
    this.abhaForm.markAllAsTouched();

    if ((this.data?.abhaTranId ?? 0) > 0) {
      this.isProfileData = true;
      setTimeout(() => {
        this._abhaService.getAbhaById(this.data.abhaTranId).subscribe((response) => {
          console.log('Get ABHA DATA', response)
          this.dateofBirth = response.yearOfBirth
          this.abhaForm.patchValue({
            abhaAddress: response.abhaAddress,
            abhaNumber: response.abhaNumber,
            abhaFullName: response.abhaFullName,
            gender: response.gender,
            // yearOfBirth: this.datePipe.transform(response.yearOfBirth, 'yyyy-MM-dd')
          });
        });
      }, 500);
    }
  }

  onSubmit(){
    
  }
}
