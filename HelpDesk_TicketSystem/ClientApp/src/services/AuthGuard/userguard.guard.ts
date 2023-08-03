import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const userguardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toaster = inject(ToastrService);
  if (sessionStorage.getItem('userType') != 'NORMALUSER') {
    router.navigate(['dashboard']);
    return false;
  } else {
    return true;
  }

};
