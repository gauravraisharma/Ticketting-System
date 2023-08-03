import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authguardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toaster = inject(ToastrService);
  //check if your is already login than it should to able to access login page
  if (state.url.includes('user-authenticaton')) {
    if (sessionStorage.getItem('token') != null && sessionStorage.getItem('token') != undefined) {
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
  router.navigate(['user-authenticaton/login']);
  return false;
};
