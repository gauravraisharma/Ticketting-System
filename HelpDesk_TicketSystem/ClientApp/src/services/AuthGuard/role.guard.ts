import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userTypes: [] = route.data['userTypes'];
  //if userType i=found in user type access array
  if (userTypes == null || userTypes == undefined ) {
    router.navigate(['dashboard']);
    return false;
  }
  var foundUserType = userTypes.find(userType => userType == localStorage.getItem('userType'))

  if (foundUserType==null) {
    router.navigate(['dashboard']);
    return false;
  } else {
    return true;
  }

};
