﻿using DataRepository.EntityModels;
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
        Task<RegisterCompanyApplicationResponse> RegisterCompanyApplication(RegisterCompanyApplicationModel registerCompanyAppModel);

        Task<List<GetCompanyResponse>> GetCompany();
        Task<List<GetCompanyRegisteredApplicationResponse>> GetCompanyRegisteredApplication(int companyId);
        Task<ResponseStatus> UpdateTimeZone(UpdateTimeZone updateTimeZoneModel);
        Task<CompanyLogoResponseStatus> UploadCompanyLogo(CompanyLogoModel companyLogoModel);
        Task<CompanyThemeColorResponseStatus> SaveThemeColors(ComapnyThemeColors comapnyThemeColor);

        Task<ResponseStatus> DeleteApplication(int id);

    }
}
