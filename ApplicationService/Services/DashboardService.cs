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

        public Task<LinechartData> GetAllTicketCreated(string startDate, string endDate, string userId, int companyId)
        {
           return _dashboardRepository.GetAllTicketCreated(startDate, endDate,userId,companyId);
        }

        public Task<List<PrioritChartResponse>> GetAllTicketsWithPriority(string userId, string userType, int companyId)
        {
            return _dashboardRepository.GetAllTicketsWithPriority(userId,userType, companyId);
        }

        public ResponseStatus GetCompanyCount()
        {
           return _dashboardRepository.GetCompanyCount();
        }
        public Task<DashboardResponseStatus> GetUserAndTicketCount(string userId, int companyId)
        {
            return _dashboardRepository.GetUserAndTicketCount(userId, companyId);
        }
        public ChartResponse GetChartDataByDepartment(string userId, string userType, int companyId)
        {
            return _dashboardRepository.GetChartDataByDepartment(userId,userType ,companyId);
        }

    }
}
