using DataRepository.EntityModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.IServices
{
    public interface ICompanyService
    {
        Task<ResponseStatus> RegisterCompany(RegisterCompanyModel registerCompanyModel);
        Task<List<GetCompanyResponse>> GetCompany();
        Task<ResponseStatus> UpdateTimeZone(UpdateTimeZone updateTimeZoneModel);
    }
}
