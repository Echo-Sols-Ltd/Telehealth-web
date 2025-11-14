import { EmailVerificationState, EmailVerificationAction } from "../types/index";

export const initialEmailVerificationState: EmailVerificationState = {
  email: "",
  isVerified: false,
};

export function emailVerificationReducer(
  state: EmailVerificationState,
  action: EmailVerificationAction
): EmailVerificationState {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_VERIFIED":
      return { ...state, isVerified: action.payload };
    case "SET_VERIFICATION_CODE":
      return { ...state, verificationCode: action.payload };
    case "SET_EXPIRES_AT":
      return { ...state, expiresAt: action.payload };
    case "RESET":
      return initialEmailVerificationState;
    default:
      return state;
  }
}

