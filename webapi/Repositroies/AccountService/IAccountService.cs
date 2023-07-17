using webapi.Models;

namespace webapi.Repositroies.AccountService
{
    public interface IAccountService
    {
        Task<LoginStatus> UserLogin(UserLoginModel userModel);
        Task<ResponseStatus> CreateApplicationUser(ApplicationUser userModel, string roleName);
        Task<ResponseStatus> CreateNewRole(string roleName);
    }
}
