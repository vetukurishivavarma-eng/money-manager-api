declare namespace google {
  namespace accounts {
    namespace id {
      interface CredentialResponse {
        credential: string;
        select_by?: string;
      }

      interface IdConfiguration {
        client_id: string;
        callback: (response: CredentialResponse) => void;
        auto_select?: boolean;
        login_uri?: string;
      }

      function initialize(config: IdConfiguration): void;
      function prompt(): void;
      function renderButton(element: HTMLElement, config: any): void;
    }
  }
}