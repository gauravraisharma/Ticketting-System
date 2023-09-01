using DataRepository.EntityModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.IRepository
{
    public interface IDashboardRepository
    {
        ResponseStatus GetCompanyCount();
        Task<DashboardResponseStatus> GetUserAndTicketCount(string userId, int companyId);
        Task<List<PrioritChartResponse>> GetAllTicketsWithPriority(string userId, string userType, int companyId);
        Task<LinechartData> GetAllTicketCreated(string startDate , string endDate,string userId,int companyId);
        ChartResponse GetChartDataByDepartment(string userId, string userType, int companyId);
    }
}
