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
  tokens:AbhaTokens;
  abhaProfile:AbhaProfile;
  isNew:boolean;
  message:string;
  mobileLinked: boolean;
  // if mobile differs from Aadhaar-linked, ABDM returns a flag → trigger mobile-OTP step
  newMobileOtpRequired?: boolean;
}

export interface MobileOtpVerifyRequest {
  txnId: string;
  otp: string;
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
  abhaStatus: string;
  abhaType: string;
  firstName: string;
  middleName?: string | null;
  lastName?: string | null;
  dob: string;
  gender: 'M' | 'F' | 'O';
  photo?: string; // base64 png
  mobile?: string | null;
  email?: string | null;
  phrAddress?: string[];
  addressLine1?: string;
  stateName?: string;
  districtName?: string;
  pinCode?: string;
}

export interface CreateAbhaResult {
  message: string;
  txnId: string;
  tokens: AbhaTokens;
  ABHAProfile: AbhaProfile;
}
