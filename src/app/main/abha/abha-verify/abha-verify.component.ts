import { Component } from '@angular/core';
import { getMethodMeta, VERIFY_METHODS, VerifyMethod } from '../abha-verify.model';
import { AbhaProfile } from '../abha-model';

@Component({
    selector: 'app-abha-verify',
    templateUrl: './abha-verify.component.html',
    styleUrls: ['./abha-verify.component.scss']
})
export class AbhaVerifyComponent {
    readonly methods = VERIFY_METHODS;

    /** Currently active method (null = method picker shown). */
    activeMethod: VerifyMethod | null = null;

    /** Profile returned by verification (set when flow completes). */
    verifiedProfile: AbhaProfile | null = null;

    /** Banner subtitle for the verified-profile-card */
    bannerSubtitle = '';

    pickMethod(id: VerifyMethod): void {
        this.activeMethod = id;
        this.verifiedProfile = null;
    }

    backToPicker(): void {
        this.activeMethod = null;
        this.verifiedProfile = null;
    }

    onVerified(profile: AbhaProfile): void {
        this.verifiedProfile = profile;
        if (this.activeMethod) {
            const meta = getMethodMeta(this.activeMethod);
            this.bannerSubtitle = `Verified using ${meta.title}.`;
        }
    }

    onResetFromProfile(): void {
        this.activeMethod = null;
        this.verifiedProfile = null;
    }
}
