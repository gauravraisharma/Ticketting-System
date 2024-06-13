import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Overview',
    icon: 'file-text-outline',
    selected: true,
    children: [
      {
        title: 'Introduction',
        selected: false,
        data: { elementId: 'introduction' } 
      },
      {
        title: 'Key Features',
        selected: false,
        data: { elementId: 'key-features' } 
      },
      {
        title: 'Benefits',
        selected: false,
        data: { elementId: 'benefits' } 
      },
      {
        title: 'Audience',
        selected: false,
        data: { elementId: 'audience' } 
      }
    ],
  },
  {
    title: 'Prerequisites',
    icon: 'book-open-outline',
    selected: false,
    data: { elementId: 'prerequisites' } 
  },
  {
    title: 'Get Started',
    icon: 'layers-outline',
    selected: false,
    children: [
      {
        title: 'Register to Techdesk',
        selected: false,
        data: { elementId: 'register' } 
      },
      {
        title: 'Using your Secret Key',
        selected: false,
        data: { elementId: 'secret-key' } 
      },
    ],
  },
  {
    title: 'Creating a Token',
    icon: 'pantone-outline',
    selected: false,
    children: [
      {
        title: 'JWT (JSON Web Token)',
        selected: false,
        data: { elementId: 'jwt' } 
      },
      {
        title: 'Generate Access Token',
        selected: false,
        data: { elementId: 'generate-access-token' } 
      },
      {
        title: 'Encryption Library',
        selected: false,
        data: { elementId: 'jose' } 
      },
      {
        title: 'Why JWE?',
        selected: false,
        data: { elementId: 'why-jwe' } 
      }
    ],
  },
  {
    title: 'User Verification',
    icon: 'award-outline',
    selected: false,
    children: [
      {
        title: 'API Endpoint',
        selected: false,
        data: { elementId: 'api-endpoint' } 
      },
      {
        title: 'Request Payload',
        selected: false,
        data: { elementId: 'request-payload' } 
      },
      {
        title: 'Response to Techdesk',
        selected: false,
        data: { elementId: 'response-to-techdesk' } 
      },
      {
        title: 'User Identity Token',
        selected: false,
        data: { elementId: 'user-identity-token' } 
      },
      {
        title: 'Refresh Token',
        selected: false,
        data: { elementId: 'refresh-token' } 
      }
    ],
  },
  {
    title: 'Token Validation',
    icon: 'shield-outline',
    selected: false,
    data: { elementId: 'token-validation' },
    children: [
      {
        title: 'Validate Token Request',
        selected: false,
        data: { elementId: 'validate-token-request' } 
      },
      {
        title: 'Validate Access Token',
        selected: false,
        data: { elementId: 'validate-access-token' } 
      },
      {
        title: 'Validate User Identity Token',
        selected: false,
        data: { elementId: 'validate-user-identity-token' } 
      }
    ]
  },
  {
    title: 'Error-Handling',
    icon: 'alert-circle-outline',
    selected: false,
    children: [
      {
        title: 'Invalid Token',
        selected: false,
        data: { elementId: 'invalid-token' } 
      },
      {
        title: 'Token Expired',
        selected: false,
        data: { elementId: 'token-expired' } 
      },
      {
        title: 'Server Errors',
        selected: false,
        data: { elementId: 'server-errors' } 
      }
    ]
  }
];
