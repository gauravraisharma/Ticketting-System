using DataRepository.EntityModels;
using DataRepository.IRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.Repositoryy
{
    public class DashboardRepository:IDashboardRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        public DashboardRepository(UserManager<ApplicationUser> userManager,
            ApplicationDbContext context
           )
        {
        _userManager = userManager;
            _context = context;
        }

        public  ResponseStatus GetCompanyCount()
        {
            if (_context.Companys == null)
            {
                return null;
            }
            try
            {
            var companyCount = (from company in _context.Companys
                           where company.IsDeleted == false
                           select company
                           )
                    .Count();

                return new ResponseStatus { 
                Status="SUCCED",
                Message=companyCount.ToString()
                };
            }
            catch (Exception ex)
            {
                  Console.WriteLine(ex.Message);
                return new ResponseStatus
                {
                    Status = "FAILED",
                    Message ="Something went wrong"
                }; ;
            }
        }


        public async Task<DashboardResponseStatus> GetUserAndTicketCount(string userId, int companyId)
        {
            if (_context.Tickets == null)
            {
                return null;
            }
            try
            {
                // get the role of the user 
                var user = await _userManager.FindByIdAsync(userId);
                var userRoles = await _userManager.GetRolesAsync(user);
                int ticketCount, userCount = 0;
                if (userRoles.FirstOrDefault().ToUpper() == "ADMIN")
                {
                    ticketCount = (from ticket in _context.Tickets
                                   join creator in _context.Users on ticket.CreatedBy equals creator.Id
                                   where creator.CompanyId == companyId && ticket.IsDeleted == false
                                   select ticket
                                  ).Count();

                    userCount = (from appuser in _context.Users
                                 where appuser.CompanyId == companyId && appuser.Id != userId && appuser.IsDeleted == false
                                 select appuser
                                  ).Count();
                }
                else
                {
                    ticketCount = _context.Tickets.Where(ticket => ticket.CreatedBy == userId).Count();
                }

                return new DashboardResponseStatus()
                {
                    ToatlTickets = ticketCount,
                    ToatlUsers = userCount,
                    Status = "SUCCEED",
                    Message = "Ticket Count got successfully",
                };
            }
            catch (Exception ex)
            {
                return new DashboardResponseStatus()
                {
                    Message = "Something went wrong",
                    Status = "FAILED"
                };
            }
            finally
            {
                // _context.Dispose();
            }
        }
    }
}
