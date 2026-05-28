import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    AadhaarGenerateOtpRequest,
    AadhaarGenerateOtpResponse,
    AadhaarVerifyOtpRequest,
    AadhaarVerifyOtpResponse,
    AbhaLoginOtpRequest,
    AbhaLoginOtpResponse,
    AbhaLoginVerifyRequest,
    AbhaProfile,
    CreateAbhaResult,
    MobileEnrolRequest,
    MobileGenerateOtpRequest,
    MobileGenerateOtpResponse,
    MobileOtpVerifyRequest,
} from './abha-model';
import { ApiCaller } from 'app/core/services/apiCaller';

/**
 * AbhaService
 * -----------
 * All endpoints below point to YOUR backend wrapper, not ABDM directly.
 * Adjust the path segments to match your wrapper's routes.
 *
 * environment.apiBaseUrl example: 'https://api.example.com'
 */
@Injectable({ providedIn: 'root' })
export class AbhaService {

    constructor(public http: ApiCaller) { }

    // ---------------- Create ABHA via Aadhaar ----------------

    /** Step 1 — generate OTP on Aadhaar-linked mobile */
    aadhaarGenerateOtp(body: AadhaarGenerateOtpRequest): Observable<AadhaarGenerateOtpResponse> {
        return this.http.PostData('Abha/aadhaar/request-otp', body);
    }

    /** Step 2 — verify Aadhaar OTP + supply primary mobile */
    aadhaarVerifyOtp(body: AadhaarVerifyOtpRequest): Observable<AadhaarVerifyOtpResponse> {
        return this.http.PostData('Abha/aadhaar/verify-otp', body);
    }

    /** Step 2a (conditional) — verify mobile OTP if primary mobile ≠ Aadhaar mobile */
    aadhaarVerifyMobileOtp(body: MobileOtpVerifyRequest): Observable<void> {
        return this.http.PostData('aadhaar/verify-mobile-otp', body);
    }

    /** Step 3 — create / enrol ABHA */
    aadhaarEnrol(txnId: string): Observable<CreateAbhaResult> {
        return this.http.PostData('aadhaar/enrol', { txnId });
    }

    // ---------------- Create ABHA via Mobile ----------------

    mobileGenerateOtp(body: MobileGenerateOtpRequest): Observable<MobileGenerateOtpResponse> {
        return this.http.PostData('mobile/generate-otp', body);
    }

    mobileEnrol(body: MobileEnrolRequest): Observable<CreateAbhaResult> {
        return this.http.PostData('mobile/enrol', body);
    }

    // ---------------- Verify / Login existing ABHA ----------------

    loginGenerateOtp(body: AbhaLoginOtpRequest): Observable<AbhaLoginOtpResponse> {
        return this.http.PostData('login/generate-otp', body);
    }

    loginVerifyOtp(body: AbhaLoginVerifyRequest): Observable<CreateAbhaResult> {
        return this.http.PostData('login/verify-otp', body);
    }

    // ---------------- Profile, QR, Card ----------------

    getProfile(token: string): Observable<AbhaProfile> {
        return this.http.PostData('Abha/aadhaar/profile', { token: token });
    }

    /** Returns base64 PNG of the QR code */
    getQr(token: string): Observable<string> {
        return this.http.PostData('Abha/aadhaar/qr', { token: token });
    }

    /** Returns a PDF blob of the ABHA card */
    downloadCard(token: string): Observable<Blob> {
        return this.http.downloadFile('Abha/aadhaar/card', { token: token }, 1, "abha.pdf", true);
    }
    addressSuggesions(txnid: string) {
        return this.http.GetData('Abha/address/suggestions/' + txnid);
    }
    createAbha(data) {
        return this.http.PostData('Abha/address/create', data);
    }
}
