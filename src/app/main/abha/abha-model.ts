// =====================================================================
// ABHA M1 (sandbox v1) — request / response models
// All payloads here match what your backend wrapper exposes.
// Your wrapper is expected to forward them to ABDM and return the
// ABDM response untouched (or with `data`/`error` envelope — adjust
// AbhaApiResponse<T> below if your wrapper wraps responses).
// =====================================================================

/** Generic envelope — change/remove if your wrapper returns raw ABDM payload */
export interface AbhaApiResponse<T> {
    success: boolean;
    data?: T;
    error?: { code: string; message: string };
}

// ---------- Create ABHA via Aadhaar ----------

export interface AadhaarGenerateOtpRequest {
    AadhaarNumber: string; // 12 digits — your backend should encrypt before sending to ABDM
}

export interface VerifyUser {
    ABHANumber: string;
    txnId: string;
}

export interface VerifyUserResponse {
    refreshExpiresIn: number,
    refreshToken: string,
    expiresIn: number,
    token: string
}

export interface AadhaarGenerateOtpResponse {
    txnId: string;
    message?: string; // masked last 4
}

export interface AadhaarVerifyOtpRequest {
    txnId: string;
    otp: string;
    mobile: string; // primary mobile the user wants to link
}

export interface AadhaarVerifyOtpResponse {
    txnId: string;
    tokens: AbhaTokens;
    abhaProfile: AbhaProfile;
    isNew: boolean;
    message: string;
}

export interface MobileOtpVerifyRequest {
    txnId: string;
    otp: string;
}

export interface AbhaOtpVerify {
    txnId: string
    authResult: string
    message: string
    token: string
    expiresIn: number
    refreshToken: string
    refreshExpiresIn: number
    accounts: Account[]
}

export interface Account {
    ABHANumber: string
    preferredAbhaAddress: string
    name: string
    status: string
}


// ---------- Create ABHA via Mobile ----------

export interface MobileGenerateOtpRequest {
    mobile: string; // 10 digits
}

export interface MobileGenerateOtpResponse {
    txnId: string;
}

export interface MobileEnrolRequest {
    txnId: string;
    otp: string;
    // Profile fields collected on the form (M1 mobile flow requires demographics)
    firstName: string;
    middleName?: string;
    lastName: string;
    dayOfBirth: string;   // dd
    monthOfBirth: string; // mm
    yearOfBirth: string;  // yyyy
    gender: 'M' | 'F' | 'O';
    email?: string;
    address?: string;
    pinCode?: string;
    stateCode?: string;
    districtCode?: string;
}

// ---------- Verify / Login existing ABHA ----------

export type AbhaLoginMethod = 'mobile' | 'aadhaar' | 'abha-number' | 'abha-address';

export interface AbhaLoginOtpRequest {
    value: string;       // mobile / aadhaar / ABHA number / ABHA address
    method: AbhaLoginMethod;
}

export interface AbhaLoginOtpResponse {
    txnId: string;
}

export interface AbhaLoginVerifyRequest {
    txnId: string;
    otp: string;
    method: AbhaLoginMethod;
}

// ---------- Shared: ABHA Profile & tokens ----------

export interface AbhaTokens {
    token: string;
    expiresIn: number;
    refreshToken: string;
    refreshExpiresIn: number;
}

export interface AbhaProfile {
    ABHANumber: string;
    preferredAbhaAddress: string;
    mobile: string;
    firstName: string;
    middleName: string;
    lastName: string;
    name: string;
    phrAddress: string[];
    yearOfBirth: string;
    dayOfBirth: string;
    monthOfBirth: string;
    gender: string;
    profilePhoto: string;
    status: string;
    stateCode: string;
    districtCode: string;
    pincode: string;
    address: string;
    kycPhoto: string;
    stateName: string;
    districtName: string;
    subdistrictName: string;
    authMethods: string[];
    kycVerified: boolean;
    verificationStatus: string;
    verificationType: string;
    localizedDetails: LocalizedDetails;
    createdDate: string;
}

export interface CreateAbhaResult {
    message: string;
    txnId: string;
    tokens: AbhaTokens;
    ABHAProfile: AbhaProfile;
}
export interface AbhaData {
    // Step 1: Aadhaar
    aadhaarNumber: string;
    beneficiaryName: string;
    consents: boolean[];

    // Step 2: OTP
    aadhaarOtp: string;

    // Step 3: Mobile
    mobileNumber: string;
    isAadhaarLinkedMobile: boolean;
    mobileOtp?: string;

    // Step 4: ABHA Address
    addressOption: 'existing' | 'default' | 'custom' | 'suggestion' | null;
    customAbhaAddress: string;
    selectedSuggestion: string;

    // Step 5: Profile (read-only after creation)
    profile?: AbhaProfile;
}

export const CONSENT_ITEMS: string[] = [
    'I am voluntarily sharing my Aadhaar number and demographic information for the sole purpose of creating an ABHA.',
    'I authorize NHA to use my Aadhaar number for issuing an ABHA, and authenticate my identity through Aadhaar Authentication system.',
    'I authorize the sharing of my demographic information with the Health Information Exchange Consent Manager.',
    'I want my ABHA to be linked with the Consent Manager.',
    'I understand that my ABHA can be used and shared for purposes as may be notified by ABDM from time to time.',
    'I consent to the collection, storage and use of my personal data by Dr. Anita Sharma.',
    'I, (beneficiary name), have been explained about the consent as stated above and hereby provide my consent for the aforementioned purposes.'
];

export interface LocalizedDetails {
    name: string;
    stateName: string;
    districtName: string;
    villageName: string;
    townName: string;
    gender: string;
    localizedLabels: LocalizedLabels;
}

export interface LocalizedLabels {
    name: string;
    abhaNumber: string;
    abhaAddress: string;
    gender: string;
    dob: string;
    mobile: string;
}
export const AUTH_METHOD_LABELS: Record<string, { label: string; icon: string }> = {
    MOBILE_OTP: { label: 'Mobile OTP', icon: 'sms' },
    AADHAAR_OTP: { label: 'Aadhaar OTP', icon: 'badge' },
    AADHAAR_BIO: { label: 'Aadhaar Bio', icon: 'fingerprint' },
    DEMOGRAPHICS: { label: 'Demographics', icon: 'description' },
    PASSWORD: { label: 'Password', icon: 'lock' }
};

export const GENDER_LABELS: Record<string, string> = {
    M: 'Male',
    F: 'Female',
    O: 'Other'
};