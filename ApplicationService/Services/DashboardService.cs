using ApplicationService.IServices;
using ApplicationService.Utilities;
using DataRepository.EntityModels;
using DataRepository.IRepository;
using DataRepository.Repositoryy;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.Services
{
    public class DashboardService:IDashboardService
    {
        private readonly IDashboardRepository _dashboardRepository;
        private readonly IConfiguration _config;
        public DashboardService(IDashboardRepository dashboardRepository,IConfiguration config)
        {
            _dashboardRepository = dashboardRepository;
            _config = config;
        }

        public ResponseStatus GetCompanyCount()
        {
           return _dashboardRepository.GetCompanyCount();
        }
        public Task<DashboardResponseStatus> GetUserAndTicketCount(string userId, int companyId)
        {
            return _dashboardRepository.GetUserAndTicketCount(userId, companyId);
        }

    }
}
