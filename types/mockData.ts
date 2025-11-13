import { MockUser } from "./index";

export const mockUsers: MockUser[] = [
  {
    email: "jolieprincesseishimwe@gmail.com",
    password: "Jolie1234",
    role: "doctor",
    userData: {
      fullName: "Jolie Princesse Ishimwe",
      nationalId: "1234567890123",
      email: "jolieprincesseishimwe@gmail.com",
      medicalCode: "DOC001",
      phoneNumber: "+250788123456",
      role: "doctor",
      createdAt: new Date().toISOString(),
    },
  },
  {
    email: "hopendindabahizi@gmail.com",
    password: "Hope12345",
    role: "patient",
    userData: {
      fullName: "Hope Ndindabahizi",
      nationalId: "9876543210987",
      email: "hopendindabahizi@gmail.com",
      phoneNumber: "+250788654321",
      role: "patient",
      createdAt: new Date().toISOString(),
    },
  },
];

// Mock storage for development
export const mockStorage: Map<string, string> = new Map();

// Initialize mock storage with existing users
mockUsers.forEach((user) => {
  mockStorage.set(`user:${user.email}`, JSON.stringify(user.userData));
  mockStorage.set(`auth:${user.email}`, user.password);
});
