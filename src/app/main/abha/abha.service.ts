import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiCaller } from 'app/core/services/apiCaller';
import {
    AadhaarGenerateOtpRequest,
    AadhaarGenerateOtpResponse,
    AadhaarVerifyOtpRequest,
    AadhaarVerifyOtpResponse,
    AbhaOtp,
    AbhaOtpVerify,
    AbhaProfile,
    AbhaVerifyOtp,
    CreateAbhaResult,
    MobileOtpVerifyRequest,
    VerifyUser,
    VerifyUserResponse
} from './abha-model';

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

    // ---------------- Verify / Login existing ABHA ----------------

    requestAbhaOtp(body: AbhaOtp): Observable<AadhaarGenerateOtpResponse> {
        return this.http.PostData('Abha/existing/request-abha-otp', body);
    }
    requestAadharOtp(body: AadhaarGenerateOtpRequest): Observable<AadhaarGenerateOtpResponse> {
        return this.http.PostData('Abha/existing/request-aadhar-otp', body);
    }
    requestMobileOtp(body: AadhaarGenerateOtpRequest): Observable<AadhaarGenerateOtpResponse> {
        return this.http.PostData('Abha/existing/mobile-otp', body);
    }

    verifyAbhaOtp(body: AbhaVerifyOtp): Observable<AbhaOtpVerify> {
        return this.http.PostData('Abha/existing/verify-abha-otp', body);
    }
    verifyAadharOtp(body: MobileOtpVerifyRequest): Observable<AbhaOtpVerify> {
        return this.http.PostData('Abha/existing/verify-aadhar-otp', body);
    }
    verifyMobileOtp(body: MobileOtpVerifyRequest): Observable<AbhaOtpVerify> {
        return this.http.PostData('Abha/existing/verify-mobile-otp', body);
    }
    verifyUser(body: VerifyUser): Observable<VerifyUserResponse> {
        return this.http.PostData('Abha/existing/verify-mobile-otp', body);
    }

    // ---------------- Profile, QR, Card ----------------

    getProfile(token: string, isAddress: boolean): Observable<AbhaProfile> {
        return this.http.PostData('Abha/aadhaar/profile', { token: token, isAddress: isAddress });
    }

    /** Returns base64 PNG of the QR code */
    getQr(token: string,isAddress: boolean): Observable<string> {
        return this.http.PostData('Abha/aadhaar/qr', { token: token, isAddress: isAddress });
    }

    /** Returns a PDF blob of the ABHA card */
    downloadCard(token: string): Observable<Blob> {
        return this.http.downloadFile('Abha/aadhaar/card', { token: token }, 1, "abha-card.png", true);
    }
    addressSuggesions(txnid: string) {
        return this.http.GetData('Abha/address/suggestions/' + txnid);
    }
    createAbha(data) {
        return this.http.PostData('Abha/address/create', data);
    }
}
