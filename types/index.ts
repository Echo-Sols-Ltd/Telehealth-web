export interface FormData {
  fullName: string;
  nationalId: string;
  email: string;
  medicalCode: string;
  password: string;
  phoneNumber: string;
  repeatPassword: string;
  role: "patient" | "doctor";
}

export interface FormErrors {
  fullName?: string;
  nationalId?: string;
  email?: string;
  medicalCode?: string;
  password?: string;
  phoneNumber?: string;
  repeatPassword?: string;
}

export interface UserData {
  fullName: string;
  nationalId: string;
  email: string;
  medicalCode?: string;
  phoneNumber: string;
  role: "patient" | "doctor";
  createdAt: string;
}

export interface MockUser {
  email: string;
  password: string;
  role: "patient" | "doctor";
  userData: UserData;
}

export interface EmailVerificationState {
  email: string;
  isVerified: boolean;
  verificationCode?: string;
  expiresAt?: Date;
}

export type EmailVerificationAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_VERIFIED"; payload: boolean }
  | { type: "SET_VERIFICATION_CODE"; payload: string }
  | { type: "SET_EXPIRES_AT"; payload: Date }
  | { type: "RESET" };
