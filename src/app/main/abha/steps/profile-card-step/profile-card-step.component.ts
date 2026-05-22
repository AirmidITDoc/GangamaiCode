import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbhaProfile } from '../../abha-model';
import { AbhaService } from '../../abha.service';


@Component({
  selector: 'app-profile-card-step',
  templateUrl: './profile-card-step.component.html',
  styleUrls: ['./profile-card-step.component.scss']
})
export class ProfileCardStepComponent implements OnInit {
  @Output() reset = new EventEmitter<void>();

  profile?: AbhaProfile;

  // Fields that are locked (non-editable in HIMS)
  lockedFields = new Set(['name', 'abhaNumber', 'abhaAddress', 'dob', 'gender']);

  constructor(private abhaService: AbhaService) {}

  ngOnInit(): void {
    //this.profile = this.abhaService.getData().profile;
  }

  isLocked(key: string): boolean {
    return this.lockedFields.has(key);
  }

  onDownload(): void {
    if (!this.profile) return;
//     const content = `
// AYUSHMAN BHARAT HEALTH ACCOUNT (ABHA)
// =====================================

// Name:         ${this.profile.name}
// ABHA Number:  ${this.profile.abhaNumber}
// ABHA Address: ${this.profile.abhaAddress}
// DOB:          ${this.profile.dob}
// Gender:       ${this.profile.gender}
// Mobile:       ${this.profile.mobileNumber}
// Address:      ${this.profile.address}
// State:        ${this.profile.state}
// District:     ${this.profile.district}
// Pincode:      ${this.profile.pincode}
// HIMS ID:      ${this.profile.himsId}
// `;
//     const blob = new Blob([content.trim()], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `abha-card-${this.profile.abhaNumber}.txt`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     URL.revokeObjectURL(url);
  }

  onReset(): void {
    this.reset.emit();
  }
}
