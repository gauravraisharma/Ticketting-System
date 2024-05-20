using DataRepository.EntityModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.IServices
{
    public interface IExternalAuthorizationService
    {
        Task<LoginStatus> ConnectWithClient(ConnectWithClientRequest clientRequest);
    }
}
