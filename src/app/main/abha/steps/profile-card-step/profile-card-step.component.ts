import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbhaProfile, AUTH_METHOD_LABELS, GENDER_LABELS } from '../../abha-model';
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
    lockedFields = new Set(['name', 'ABHANumber', 'preferredAbhaAddress', 'dob', 'gender']);
    // Card-side toggle (front/back)
    cardSide: 'front' | 'back' = 'front';

    authMethodMeta = AUTH_METHOD_LABELS;
    genderLabels = GENDER_LABELS;
    qrUrl: string = '';


    constructor(private abhaService: AbhaService) { }

    ngOnInit(): void {
        this.abhaService.getProfile(this.token).subscribe((r: AbhaProfile) => {
            this.profile = r;
            this.loadQr();
        });
    }
    loadQr() {
        this.abhaService.getQr(this.token).subscribe((byteArray: string) => {
            this.qrUrl = `data:image/png;base64,${byteArray}`;
        });
    }

    arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        bytes.forEach(b => binary += String.fromCharCode(b));
        return window.btoa(binary);
    }
    isLocked(key: string): boolean {
        return this.lockedFields.has(key);
    }
    /** DOB in dd-MM-yyyy format (as shown on the official ABHA card). */
    get formattedDob(): string {
        if (!this.profile) return '';
        return `${this.profile.dayOfBirth}-${this.profile.monthOfBirth}-${this.profile.yearOfBirth}`;
    }

    get genderLabel(): string {
        if (!this.profile) return '';
        return this.genderLabels[this.profile.gender] || this.profile.gender;
    }

    /** Localized gender (e.g. पुरुष / स्त्री) — falls back to "" if not provided */
    get localizedGender(): string {
        return this.profile?.localizedDetails?.gender || '';
    }

    /** Profile photo data URL */
    get profilePhotoSrc(): string | null {
        if (!this.profile || !this.profile.profilePhoto) return null;
        return `data:image/jpeg;base64,${this.profile.profilePhoto}`;
    }

    get kycPhotoSrc(): string | null {
        if (!this.profile || !this.profile.kycPhoto) return null;
        return `data:image/jpeg;base64,${this.profile.kycPhoto}`;
    }

    /** Status badge color */
    statusColor(status: string): string {
        switch (status) {
            case 'ACTIVE':
                return 'green';
            case 'INACTIVE':
            case 'DEACTIVATED':
                return 'red';
            case 'SUSPENDED':
                return 'orange';
            default:
                return 'gray';
        }
    }

    setCardSide(side: 'front' | 'back'): void {
        this.cardSide = side;
    }

    flipCard(): void {
        this.cardSide = this.cardSide === 'front' ? 'back' : 'front';
    }


    onDownload(): void {
        if (!this.profile) return;
        this.abhaService.downloadCard(this.token).subscribe((r) => {
        });
    }

    onReset(): void {
        this.reset.emit();
    }
    copyToClipboard(text: string): void {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
    }

}
