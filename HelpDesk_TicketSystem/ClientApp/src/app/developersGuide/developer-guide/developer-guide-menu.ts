import { NbMenuItem } from "@nebular/theme";

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Overview',
    icon: 'file-text-outline',
    children: [
      {
        title: 'Introduction',
        data: { elementId: 'introduction' } 
      },
      {
        title: 'Key Features',
        data: { elementId: 'key-features' } 
      },
      {
        title: 'Benefits',
        data: { elementId: 'benefits' } 
      },
      {
        title: 'Audience',
        data: { elementId: 'audience' } 
      }
    ],
  },
  {
    title: 'Prerequisites',
    icon: 'book-open-outline',
    data: { elementId: 'prerequisites' } 
  },
  {
    title: 'Get Started',
    icon: 'layers-outline',
    children: [
      {
        title: 'Register to Techdesk',
        data: { elementId: 'register' } 
      },
      {
        title: 'Using your Secret Key',
        data: { elementId: 'secret-key' } 
      },
    ],
  },
  {
    title: 'Creating a Token',
    icon: 'pantone-outline',
    children: [
      {
        title: 'JWT (JSON Web Token)',
        data: { elementId: 'jwt' } 
      },
      {
        title: 'Encryption Library',
        data: { elementId: 'jose' } 
      },
      {
        title: 'Generate Access Token',
        data: { elementId: 'generate-access-token' } 
      },
      {
        title: 'Why JWE?',
        data: { elementId: 'why-jwe' } 
      }
    ],
  },
  {
    title: 'User Verification',
    icon: 'award-outline',
    children: [
      {
        title: 'API Endpoint',
        data: { elementId: 'api-endpoint' } 
      },
      {
        title: 'Request Payload',
        data: { elementId: 'request-payload' } 
      },
      {
        title: 'Response to Techdesk',
        data: { elementId: 'response-to-techdesk' } 
      },
      {
        title: 'User Identity Token',
        data: { elementId: 'user-identity-token' } 
      },
      {
        title: 'Refresh Token',
        data: { elementId: 'refresh-token' } 
      }
    ],
  },
  {
    title: 'Error-Handling',
    icon: 'alert-circle-outline',
    children: [
      {
        title: 'Invalid Token',
        data: { elementId: 'invalid-token' } 
      },
      {
        title: 'Token Expired',
        data: { elementId: 'token-expired' } 
      },
      {
        title: 'Server Errors',
        data: { elementId: 'server-errors' } 
      }
    ]
  }
];
