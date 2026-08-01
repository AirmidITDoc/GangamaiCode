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

export interface FindABHA {
    mobile: string;
}

export interface ReqOtpFindABHA {
    txnId: string,
    aadhaarNumber: string,
    otpType: any
}

export interface AadhaarGenerateOtpRequest {
    aadhaarNumber: string; // 12 digits — your backend should encrypt before sending to ABDM
    // otpType: number;
}
export interface AbhaOtp {
    AadhaarNumber: string; // 12 digits — your backend should encrypt before sending to ABDM
    OtpType: number
}
export interface AbhaVerifyOtp {
    txnId: string;
    otp: string;
    OtpType: number;
    mobile:string
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
    healthIdNumber?: any;
    authMethods?: string[];
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
    gender: string
    yearOfBirth: string
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

export interface generateToken {
    abhaNumber: number,
    abhaAddress: string,
    name: string,
    gender: string,
    yearOfBirth: number,
    // hipId: string,
    // xCmId: string
}

export interface LinkTokenRequest {
    abhaNumber: string;
    abhaAddress: string;
    patient: Patient[];
    // hipId: string;
    linkToken: string;
    // xCmId: string;
}

export interface Patient {
    referenceNumber: string;
    display: string;
    careContexts: CareContext[];
    hiType: string;
    count: number;
}

export interface CareContext {
    referenceNumber: string;
    display: string;
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
export interface VerifyResponse {
    accesstoken: string;
    isAddress: boolean;
}

export interface AbhaProfile {
    abhaNumber: string;
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

// export const CONSENT_ITEMS: string[] = [
//     // changed by raksha on 07/07/26
//     'I am voluntarily sharing my Aadhaar Number / Virtual ID issued by the Unique Identification Authority of India("<strong>UIDAI</strong>"), and my demographic information for the purpose of creating an Ayushman Bharat Health Account number ("<strong>ABHA number</strong>") and Ayushman Bharat Health Account address ("<strong>ABHA Address</strong>"). I authorize NHA to use my Aadhaar number / Virtual ID for performing Aadhaar based authentication with UIDAIas per the provisionsof th Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of "Yes" with NHA upon successful authentication.',
//     'I intend to create Ayushman Bharat Health Account Number ("<strong>ABHA number</strong>") and Ayushman Bharat Health Account address ("<strong>ABHA Address</strong>") using document other than Aadhaar.(Click here to proceed further).',
//     'I consent to usage of my ABHA address and ABHA number for linking of my legacy(part) health records and those which will be generated during this encounter.',
//     'I authorize the sharing of my health records with healthcare provider(s) for the purpose of providing healthcare services to me during this encounter.',
//     'I consent to the anonymization and subsequent use of my health records for public health purposes.',
//     'I, (name of healthcare worker- depending on the username used for logging in into the system), confirmed that I have duly informed and explained the beneficiary of the contents of consent for aforementioned purposes.',
//     'I, (beneficiary name), have been explained about the consent as stated above and hereby provide my consent for the aforementioned purposes.'
// ];

export interface ConsentItem {
    text: string;
    checked?: boolean;
    children?: ConsentItem[];
}

export const CONSENT_ITEMS: ConsentItem[] = [
    {
        text: 'I am voluntarily sharing my Aadhaar Number / Virtual ID issued by the Unique Identification Authority of India("<strong>UIDAI</strong>"), and my demographic information for the purpose of creating an Ayushman Bharat Health Account number ("<strong>ABHA number</strong>") and Ayushman Bharat Health Account address ("<strong>ABHA Address</strong>"). I authorize NHA to use my Aadhaar number / Virtual ID for performing Aadhaar based authentication with UIDAIas per the provisionsof th Aadhaar (Targeted Delivery of Financial and other Subsidies, Benefits and Services) Act, 2016 for the aforesaid purpose. I understand that UIDAI will share my e-KYC details, or response of "Yes" with NHA upon successful authentication.'
    },
    {
        text: 'I intend to create Ayushman Bharat Health Account Number ("<strong>ABHA number</strong>") and Ayushman Bharat Health Account address ("<strong>ABHA Address</strong>") using document other than Aadhaar.(Click here to proceed further).'
    },
    {
        text: 'I consent to usage of my ABHA address and ABHA number for linking of my legacy(part) health records and those which will be generated during this encounter.'
    },
    {
        text: 'I authorize the sharing of my health records with healthcare provider(s) for the purpose of providing healthcare services to me during this encounter.'
    },
    {
        text: 'I consent to the anonymization and subsequent use of my health records for public health purposes.',
        children: [
            {
                text: 'I, (name of healthcare worker- depending on the username used for logging in into the system), confirmed that I have duly informed and explained the beneficiary of the contents of consent for aforementioned purposes.'
            },
            {
                text: 'I, (beneficiary name), have been explained about the consent as stated above and hereby provide my consent for the aforementioned purposes.'
            }
        ]
    }
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