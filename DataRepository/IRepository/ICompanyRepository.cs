using DataRepository.EntityModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.IRepository
{
    public interface ICompanyRepository
    {
        Task<ResponseStatus> RegisterCompany(RegisterCompanyModel registerCompanyModel);
        Task<List<GetCompanyResponse>> GetCompany();
        Task<ResponseStatus> UpdateTimeZone(UpdateTimeZone updateTimeZoneModel);
    }
}
