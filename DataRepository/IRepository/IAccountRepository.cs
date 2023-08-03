using DataRepository.EntityModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.IRepository
{
    public  interface IAccountRepository
    {
        Task<LoginStatus> UserLogin(UserLoginModel userModel);
        Task<ResponseStatus> CreateApplicationUser(ApplicationUserModel userModel);
        Task<ResponseStatus> UpdateApplicationUser(UpdateApplicationUserModel userModel);
        ResponseStatus GetRoleName(string roleId);
        Task<ResponseStatus> CreateNewRole(string roleName);
        DDListResponse GetDepartmentListDD();
        DDListResponse GetUserTypeListDD();
        IEnumerable<ResponseApplicationUserModel> GetUserList(int companyId);
        ResponseStatus DeleteUser(string userId);

        UserDataResponse GetUserDataById(string userId);
        Task<ResponseStatus> SwitchToCompanyAdmin(string userId);
        Task<ResponseStatus> SwitchToSuperadmin(string userId);
    }
}
