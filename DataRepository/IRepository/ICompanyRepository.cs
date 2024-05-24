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
        Task<RegisterCompanyApplicationResponse> RegisterCompanyApplication(RegisterCompanyApplicationBLLModel registerCompanyAppModel);

        Task<List<GetCompanyResponse>> GetCompany();
        Task<List<GetCompanyRegisteredApplicationResponse>> GetCompanyRegisteredApplication(int companyId);

        Task<ResponseStatus> UpdateTimeZone(UpdateTimeZone updateTimeZoneModel);
        Task<CompanyLogoResponseStatus> UploadCompanyLogo(CompanyLogoBLLModel companyLogoModel);
    }
}
