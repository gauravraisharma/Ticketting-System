using DataRepository.EntityModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.IRepository
{
    public interface IExternalAuthorizationRepository
    {
        Task<ConnectWithClientResponse> ConnectWithClient(ConnectWithClientBLLModel clientRequest);
        Task<ApplicationUser> IsUserFound(string userEmail, string userName);
        Task<string> GetRoleId(string roleName);
        Task<LoginStatus> RegisterExternalUser(CipherUserDataModel cipherUserDataModel, string refreshToken, string applicationName);
        Task<LoginStatus> AuthenticateExternalUser(string email, string refreshToken, string applicationName);
    }
}
