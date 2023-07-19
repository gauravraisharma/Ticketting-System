using webapi.Models;

namespace webapi.Repositroies.AccountService
{
    public interface IAccountService
    {
        Task<LoginStatus> UserLogin(UserLoginModel userModel);
        Task<ResponseStatus> CreateApplicationUser(ApplicationUserModel userModel);
        ResponseStatus GetRoleName(string roleId);
        Task<ResponseStatus> CreateNewRole(string roleName);
        DDListResponse GetDepartmentListDD();
        DDListResponse GetUserTypeListDD();
        IEnumerable<ResponseApplicationUserModel> GetUserList();
    }
}
