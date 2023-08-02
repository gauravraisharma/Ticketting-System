import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const adminguardGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toaster = inject(ToastrService);
  console.log(state)
  //check if your is already login than it should to able to access login page
  
    if (sessionStorage.getItem('token') != null && sessionStorage.getItem('token') != undefined && sessionStorage.getItem('userType')=='NormalUser') {
      router.navigate(['dashboard']);
      return false;
    } else {
      return true;
    }
};
