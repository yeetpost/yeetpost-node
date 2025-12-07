export type YeetpostResponse =
  | {
      status: 200;
      body:
        | {
            platform: "linkedin";
            link: string;
          }
        | {
            platform: "x";
            link: string;
          }
        | {
            platform: "sms";
            sent: true;
          }
        | {
            platform: "email";
            sent: true;
          };
    }
  | {
      status: 400;
      body: {
        error: "invalid_connection" | "invalid_request";
        message: string;
      };
    }
  | {
      status: 401;
      body: {
        error: "unauthorized";
      };
    }
  | {
      status: 403;
      body: {
        error: "limit_exceeded";
        message: string;
      };
    }
  | {
      status: 422;
      body: {
        error: "platform_rejected";
        message: string;
        reqId: string;
      };
    }
  | {
      status: 500;
      body: {
        error: "internal_server_error";
        message: string;
        reqId: string;
      };
    };
