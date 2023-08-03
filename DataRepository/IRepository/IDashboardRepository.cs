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
    }
}
