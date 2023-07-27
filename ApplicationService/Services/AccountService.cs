using ApplicationService.IServices;
using DataRepository.EntityModels;
using DataRepository.IRepository;
namespace ApplicationService.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;
        public AccountService(IAccountRepository accountRepository)
        {

            _accountRepository = accountRepository;
        }

        public Task<ResponseStatus> CreateApplicationUser(ApplicationUserModel userModel)
        {
            return _accountRepository.CreateApplicationUser(userModel);  
        }
          public Task<ResponseStatus> UpdateApplicationUser(UpdateApplicationUserModel userModel)
        {
            return _accountRepository.UpdateApplicationUser(userModel);  
        }

        public Task<ResponseStatus> CreateNewRole(string roleName)
        {
           return _accountRepository.CreateNewRole(roleName);
        }

        public DDListResponse GetDepartmentListDD()
        {
            return _accountRepository.GetDepartmentListDD();
        }

        public ResponseStatus GetRoleName(string roleId)
        {
            return _accountRepository.GetRoleName(roleId);
        }

        public IEnumerable<ResponseApplicationUserModel> GetUserList()
        {
            return _accountRepository.GetUserList();
        }

        public DDListResponse GetUserTypeListDD()
        {
            return _accountRepository.GetUserTypeListDD();
        }

        public Task<LoginStatus> UserLogin(UserLoginModel userModel)
        {
            return _accountRepository.UserLogin(userModel);
        }
        public ResponseStatus DeleteUser(string userId)
        {
            return _accountRepository.DeleteUser(userId);
        }
        
        public UserDataResponse GetUserDataById(string userId)
        {
            return _accountRepository.GetUserDataById(userId);
        }
    }
}
