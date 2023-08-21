using DataRepository.EntityModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationService.IServices
{
    public interface IDashboardService
    {
        ResponseStatus GetCompanyCount();
        Task<DashboardResponseStatus> GetUserAndTicketCount(string userId, int companyId);
        Task<List<PrioritChartResponse>> GetAllTicketsWithPriority(string userId, int companyId);
    }
}
