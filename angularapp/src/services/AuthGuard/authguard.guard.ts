import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authguardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toaster = inject(ToastrService);

  console.log('route', route.url[0].path)
  //check if your is already login than it should to able to access login page
  if (route.url[0].path == 'login') {
    if (sessionStorage.getItem('token') != null && sessionStorage.getItem('token') != undefined) {
      toaster.error("Please log out from application if you want to open loggin page");
      router.navigate(['dashboard']);
      return false;
    } else {
      return true;
    }
  }
  if (sessionStorage.getItem('token') != null && sessionStorage.getItem('token') != undefined) {
    return true;
  }

  toaster.error("You are not authorize to access this module");
  router.navigate(['login']);
  return false;
};
