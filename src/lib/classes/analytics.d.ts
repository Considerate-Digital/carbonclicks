import type { Error } from "./audit";
import type { PreAuditUrl } from "./audit";

export type AccProp = {
  name: string;
  displayName: string;
};

export type Analytics = {
  bearer: string;
  sessionId: string;
  account: {
    id: string;
  };
  user: {
    email: string;
    id: string;
    code: string;
    connectedAnalytics: boolean;
  };
  admin: {
    accounts: AccProp[];
    properties: AccProp[];
    dates: {
      startDate: string; //replace
      endDate: string; //replace
    };
  };
  report: any; //unparsed data from google analytics
  auditUrls: PreAuditUrl[];
  errors: Error[];
};
