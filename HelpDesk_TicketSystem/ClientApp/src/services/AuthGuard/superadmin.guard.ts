import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const SuperAdminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const toaster = inject(ToastrService);
 
  const userRole = sessionStorage.getItem('userType'); // Assuming this method returns the user's role as a string

  // Check if the user's role allows access to the route
  if (route.data['allowedRoles'] && !route.data['allowedRoles'].includes(userRole)) {
    // If the user's role is not in the allowedRoles array, deny access and navigate to another route
    router.navigate(['dashboard']);
    return false;
  }

  // Allow access to the route
  return true;
};

