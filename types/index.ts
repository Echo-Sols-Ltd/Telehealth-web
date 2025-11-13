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
