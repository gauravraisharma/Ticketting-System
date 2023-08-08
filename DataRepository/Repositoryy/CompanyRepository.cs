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
    public class CompanyRepository:ICompanyRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        public CompanyRepository(UserManager<ApplicationUser> userManager,
            ApplicationDbContext context
           )
        {
        _userManager = userManager;
            _context = context;
        }

        public async Task<List<GetCompanyResponse>> GetCompany()
        {
            if (_context.Companys == null)
            {
                return null;
            }
            try
            {
            var company = await _context.Companys
                    .Select(Companys => new GetCompanyResponse
                    {
                        CompanyId=Companys.Id,
                        CompanyName = Companys.Name,
                        CreatedOn = Companys.CreatedOn,
                        UserCount = _context.Users.Count(user => user.CompanyId == Companys.Id && user.IsDeleted==false) 
                    })
                    .ToListAsync();

                return company;
            }
            catch (Exception ex)
            {
                // Handle any exception that might occur during the query.
                // You might want to log the exception for debugging purposes.
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        public async Task<ResponseStatus> RegisterCompany(RegisterCompanyModel registerCompanyModel)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {

                    var userFound = await _userManager.FindByNameAsync(registerCompanyModel.UserName);
                    if (userFound != null && !userFound.IsDeleted)
                    {
                        return new ResponseStatus
                        {
                            Status = "FAILED",
                            Message = "Username already exist, Please choose another username"
                        };
                    }

                    //Check for unique email 
                    var userFoundByEmail = await _userManager.FindByEmailAsync(registerCompanyModel.Email);
                    if (userFoundByEmail != null && !userFoundByEmail.IsDeleted)
                    {
                        return new ResponseStatus
                        {
                            Status = "FAILED",
                            Message = "Email already in use"
                        };
                    }

                    //Check companyName is Unique 
                    var sameCompanyNameCount = (from company in _context.Companys
                                               where company.Name.ToLower() == registerCompanyModel.CompanyName.ToLower()
                                               select company
                                             ).Count();

                    if (sameCompanyNameCount > 0)
                    {
                        return new ResponseStatus
                        {
                            Status = "FAILED",
                            Message = "Company Name already exists, Please choose another name."
                        };

                    }
                    //Create new Company
                    Company companyModel =new Company()
                    {
                        Name=registerCompanyModel.CompanyName,
                        CreatedBy=Guid.Empty.ToString(),
                        CreatedOn=DateTime.UtcNow,
                        IsDeleted=false
                    };

                  var companyCreated=  _context.Companys.Add(companyModel);
                    _context.SaveChanges();
                    ApplicationUser user = new ApplicationUser
                    {
                        UserName = registerCompanyModel.UserName,
                        Email = registerCompanyModel.Email,
                        PhoneNumber = registerCompanyModel.PhoneNumber,
                        FirstName = registerCompanyModel.FirstName,
                        LastName = registerCompanyModel.LastName,
                        DepartmentId = null,
                        CompanyId = companyModel.Id,
                        CreatedBy = Guid.Empty.ToString(),
                        CreatedOn = DateTime.UtcNow
                    };

                    IdentityResult identityResult = await _userManager.CreateAsync(user, registerCompanyModel.Password);

                    if (!identityResult.Succeeded)
                    {
                        transaction.Rollback();
                        var errors = string.Join(" and ", identityResult.Errors.Select(e => e.Description).ToArray());
                        return new ResponseStatus
                        {
                            Status = "FAILED",
                            Message = errors
                        };
                    }

                    await _userManager.AddToRoleAsync(user, "Admin");

                    transaction.Commit();
                    return new ResponseStatus
                    {
                        Status = "SUCCEED",
                        Message = "User successfully created"
                    };
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "Something went wrong "
                    };
                }
            }

        }

        public async Task<ResponseStatus> UpdateTimeZone(UpdateTimeZone updateTimeZoneModel)
        {
            if (_context.Companys == null)
            {
                return null;
            }
            try
            {
                var Comapany = await _context.Companys.FirstOrDefaultAsync(company => company.Id == updateTimeZoneModel.CompanyId);
                if (Comapany == null)
                {
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "Something went wrong "

                    };
                }
                Comapany.TimeZone = updateTimeZoneModel.TimeZone;
                _context.Companys.Update(Comapany);
                await _context.SaveChangesAsync();
                return new ResponseStatus
                {
                    Status = "SUCCEED",
                    Message = "TimeZone Updated Successfully "

                };
             }
            catch (Exception ex)
            {
                return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = "Something went wrong "

                };
            }
            }
        }
    
}
