export interface Email {
  subject: string;
  toName: string;
  toAddress: string;
  fromName: string; // do not set unless necessary
  fromAddress: string; // do not set unless necessary
  contactForm: boolean;
  message: string;
}
