
export interface AuthenticationData {
  email: string;
  password: string;
}

export interface Authentication {
  auth (authenticationData: AuthenticationData): Promise<string>;
} 