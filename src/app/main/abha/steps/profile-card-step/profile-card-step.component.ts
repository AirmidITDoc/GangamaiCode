import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbhaProfile } from '../../abha-model';
import { AbhaService } from '../../abha.service';


@Component({
    selector: 'app-profile-card-step',
    templateUrl: './profile-card-step.component.html',
    styleUrls: ['./profile-card-step.component.scss']
})
export class ProfileCardStepComponent implements OnInit {
    @Output() reset = new EventEmitter<void>();
    @Input() token = "";
    profile?: AbhaProfile;

    // Fields that are locked (non-editable in HIMS)
    lockedFields = new Set(['name', 'abhaNumber', 'abhaAddress', 'dob', 'gender']);

    constructor(private abhaService: AbhaService) { }

    ngOnInit(): void {
        this.abhaService.getProfile(this.token).subscribe((r: AbhaProfile) => {
            this.profile = r;
        });
    }

    isLocked(key: string): boolean {
        return this.lockedFields.has(key);
    }

    onDownload(): void {
        if (!this.profile) return;
        const content = `
AYUSHMAN BHARAT HEALTH ACCOUNT (ABHA)
=====================================

Name:         ${this.profile.firstName} ${this.profile.middleName} ${this.profile.lastName}
ABHA Number:  ${this.profile.ABHANumber}
ABHA Address: ${this.profile.address}
DOB:          ${this.profile.dayOfBirth}
Gender:       ${this.profile.gender}
Mobile:       ${this.profile.mobile}
Address:      ${this.profile.preferredAbhaAddress}
State:        ${this.profile.stateName}
District:     ${this.profile.districtName}
Pincode:      ${this.profile.pincode}
`;
        const blob = new Blob([content.trim()], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `abha-card-${this.profile.ABHANumber}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    onReset(): void {
        this.reset.emit();
    }
}
