declare global {
  type GoogleOneTapContext = 'signin' | 'signup' | 'use';

  interface GoogleCredentialResponse {
    credential?: string;
    select_by?: string;
  }

  interface GoogleOneTapIdApi {
    initialize(config: {
      client_id: string;
      callback: (response: GoogleCredentialResponse) => void;
      auto_select?: boolean;
      cancel_on_tap_outside?: boolean;
      context?: GoogleOneTapContext;
      itp_support?: boolean;
    }): void;
    prompt(): void;
    cancel(): void;
    disableAutoSelect(): void;
  }

  interface Window {
    google?: {
      accounts?: {
        id: GoogleOneTapIdApi;
      };
    };
  }
}

export {};
