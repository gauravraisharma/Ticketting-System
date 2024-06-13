// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';

// export const authguardGuard: CanActivateFn = (route, state) => {
//   const router = inject(Router);
//   const toaster = inject(ToastrService);
//   //check if your is already login than it should to able to access login page
//   return true;
//   if (state.url.includes('login') || state.url.includes('signup') ) {
//     if (localStorage.getItem('token') != null && localStorage.getItem('token') != undefined) {
//       router.navigate(['dashboard']);
//       return false;
//     } else {
//       return true;
//     }
//   }
//   if (localStorage.getItem('token') != null && localStorage.getItem('token') != undefined) {
//     return true;
//   }

//   toaster.error("You are not authorize to access this module");
//   router.navigate(['login']);
//   return false;
// };

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authguardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toaster = inject(ToastrService);
  const token = localStorage.getItem('token');
  if (state.url.includes('externalconnect')) {
    localStorage.clear();
    return true;
  }

  // Check if the user is already logged in and trying to access login or signup page
  if (state.url.includes('login') || state.url.includes('signup') || state.url === '/' || state.url.includes('developersGuide')) {
    if (token != null && token != undefined) {
      router.navigate(['dashboard']);
      return false;
    } else {
      return true;
    }
  }
  

  // Check if the user has a token for other routes
  if (token != null && token != undefined) {
    return true;
  }

  toaster.error("You are not authorized to access this module");
  router.navigate(['login']);
  return false;
};
