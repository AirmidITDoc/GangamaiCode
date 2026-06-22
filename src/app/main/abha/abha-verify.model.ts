import { AbhaProfile } from "./abha-model";

/** Login hint — tells ABDM which identifier the user is using */
export type LoginHint = 'abha-number' | 'mobile' | 'aadhaar' | 'abha-address';

/** OTP delivery system */
export type OtpSystem = 'aadhaar' | 'abdm';

/** Verification methods exposed to the user */
export type VerifyMethod =
  | 'abha-number-abha-otp'      // ABHA No → OTP on ABHA-linked mobile
  | 'abha-number-aadhaar-otp'   // ABHA No → OTP on Aadhaar-linked mobile
  | 'mobile-otp'                // Mobile No → OTP → pick account
  | 'aadhaar-otp';              // Aadhaar No → OTP

export interface VerifyMethodMeta {
  id: VerifyMethod;
  title: string;
  subtitle: string;
  icon: string;
  loginHint: LoginHint;
  otpSystem: OtpSystem;
  inputLabel: string;
  inputPlaceholder: string;
}

/** Request: POST /v3/profile/login/request/otp */
export interface RequestOtpPayload {
  scope: string[];
  loginHint: LoginHint;
  loginId: string;          // encrypted in real API; plain in mock
  otpSystem: OtpSystem;
}

/** Response: POST /v3/profile/login/request/otp */
export interface RequestOtpResponse {
  txnId: string;
  message: string;
}

/** Request: POST /v3/profile/login/verify */
export interface VerifyOtpPayload {
  scope: string[];
  authData: {
    authMethods: ['otp'];
    otp: {
      txnId: string;
      otpValue: string;       // encrypted in real API
    };
  };
}

/** Response when single account (ABHA/Aadhaar paths) */
export interface VerifyOtpResponse {
  txnId: string;
  authResult: 'success' | 'failed';
  message: string;
  token?: string;             // X-Token for subsequent calls
  /** Present when mobile flow returns multiple accounts to pick from */
  accounts?: LinkedAccount[];
  /** Present on single-account paths */
  profile?: AbhaProfile;
}

/** Linked account summary (mobile flow) */
export interface LinkedAccount {
  ABHANumber: string;
  name: string;
  preferredAbhaAddress: string;
  gender: string;
  yearOfBirth: string;
  status: string;
  profilePhoto?: string;
  kycVerified: boolean;
}

/** Request: POST /v3/profile/login/verify/user — mobile path only */
export interface VerifyUserPayload {
  ABHANumber: string;
  txnId: string;
}

export interface VerifyUserResponse {
  authResult: 'success' | 'failed';
  message: string;
  token: string;
  profile: AbhaProfile;
}

/** Catalogue of methods (consumed by picker UI) */
export const VERIFY_METHODS: VerifyMethodMeta[] = [
  {
    id: 'abha-number-abha-otp',
    title: 'ABHA Number',
    subtitle: 'OTP on ABHA-linked mobile number',
    icon: 'sms',
    loginHint: 'abha-number',
    otpSystem: 'abdm',
    inputLabel: 'ABHA Number',
    inputPlaceholder: '91-XXXX-XXXX-XXXX'
  },
  {
    id: 'abha-number-aadhaar-otp',
    title: 'ABHA Address',
    subtitle: 'OTP on Aadhaar-linked mobile (UIDAI)',
    icon: 'fingerprint',
    loginHint: 'abha-number',
    otpSystem: 'aadhaar',
    inputLabel: 'ABHA Number',
    inputPlaceholder: '91-XXXX-XXXX-XXXX'
  },
  {
    id: 'mobile-otp',
    title: 'Mobile Number',
    subtitle: 'OTP on registered mobile — select profile if multiple',
    icon: 'phone_iphone',
    loginHint: 'mobile',
    otpSystem: 'abdm',
    inputLabel: 'Mobile Number',
    inputPlaceholder: '10-digit mobile number'
  },
  {
    id: 'aadhaar-otp',
    title: 'Aadhaar Number',
    subtitle: 'OTP on Aadhaar-linked mobile',
    icon: 'fingerprint',
    loginHint: 'aadhaar',
    otpSystem: 'aadhaar',
    inputLabel: 'Aadhaar Number',
    inputPlaceholder: '12-digit Aadhaar number'
  }
];

export function getMethodMeta(id: VerifyMethod): VerifyMethodMeta {
  return VERIFY_METHODS.find((m) => m.id === id) || VERIFY_METHODS[0];
}
