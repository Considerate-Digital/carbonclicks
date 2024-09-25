interface UserInterface {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_validated: boolean;
  signup_date: string;
  last_login: number;
  pw: string;
  pw_reset_token: string;
  pw_reset_token_expiry: number;
  session_token: string;
  session_expiry: number;
  recovery_email: string;
  level: string;
  permissions: string[];
  primary_accounts: string[];
  secondary_accounts: string[];
}

// used when creating a new user
export class User implements UserInterface {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_validated: boolean;
  signup_date: string;
  last_login: number;
  pw: string;
  pw_reset_token: string;
  pw_reset_token_expiry: number;
  session_token: string;
  session_expiry: number;
  recovery_email: string;
  level: string;
  permissions: string[];
  primary_accounts: string[];
  secondary_accounts: string[];

  constructor(email: string) {
    this.id = crypto.randomUUID();
    this.first_name = "";
    this.last_name = "";
    this.email = email;
    this.email_validated = false;
    this.signup_date = new Date().toISOString();
    this.last_login = new Date().valueOf();
    this.pw = "";
    this.pw_reset_token = "";
    this.pw_reset_token_expiry = 0;
    this.session_token = crypto.randomUUID();
    this.session_expiry = this.get_session_expiry();
    this.recovery_email = "";
    this.level = "";
    this.permissions = [];
    this.primary_accounts = [];
    this.secondary_accounts = [];
  }

  get_session_expiry(): number {
    let d = new Date();
    d.setHours(d.getHours() + 168); // adds a week to the date
    return d.valueOf();
  }
}
