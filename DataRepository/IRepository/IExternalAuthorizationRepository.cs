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
        Task<ApplicationUser> IsUserFound(string userEmail);
        Task<string> GetRoleId(string roleName);
        Task<ExternalLoginStatus> RegisterExternalUser(CipherUserDataModel cipherUserDataModel, string userIdentityToken, string refreshToken, string applicationName);
        Task<ExternalLoginStatus> AuthenticateExternalUser(string email, string applicationName);
        Task<ResponseStatus> SaveExternalTokens(string email, string applicationName, string userIdentityToken, string refreshToken);
    }
}
