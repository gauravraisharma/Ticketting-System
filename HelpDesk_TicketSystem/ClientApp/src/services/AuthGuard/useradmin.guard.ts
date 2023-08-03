import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
export const useradminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  if (sessionStorage.getItem('userType') == 'SUPERADMIN') {
    router.navigate(['dashboard']);
    return false;
  } else {
    return true;
  }
};
