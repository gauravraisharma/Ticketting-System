import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const SuperAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toaster = inject(ToastrService);
  console.log(state)
  //check if your is not superadmin than redirect to Dashboard
    if (sessionStorage.getItem('userType')!='SUPERADMIN') {
      router.navigate(['dashboard']);
      return false;
    } else {
      return true;
    }
};
