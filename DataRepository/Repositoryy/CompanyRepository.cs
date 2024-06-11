using DataRepository.Constants;
using DataRepository.EntityModels;
using DataRepository.Enums;
using DataRepository.IRepository;
using DataRepository.Utils;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace DataRepository.Repositoryy
{
    public class CompanyRepository:ICompanyRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;

        public CompanyRepository(UserManager<ApplicationUser> userManager,
            ApplicationDbContext context, IConfiguration config
           )
        {
        _userManager = userManager;
            _context = context;
            _config = config;
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

        public async Task<List<GetCompanyRegisteredApplicationResponse>> GetCompanyRegisteredApplication(int companyId)
        {
            if (_context.CompanyRegisteredApplications == null)
            {
                return null;
            }
            try
            {
                var company = await _context.CompanyRegisteredApplications
                        .Where(application => application.CompanyId == companyId && !application.IsDeleted)
                        .Select(Application => new GetCompanyRegisteredApplicationResponse
                        {
                            Id = Application.Id,
                            ApplicationName = Application.ApplicationName,
                            ApplicationURL = Application.ApplicationURL,
                            APIEndpoint = Application.APIEndpoint,
                            ClientSecretKey = Application.ClientSecretKey,
                            CreatedOn = Application.CreatedOn,
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

        public async Task<RegisterCompanyApplicationResponse> RegisterCompanyApplication(RegisterCompanyApplicationBLLModel registerCompanyAppModel)
        {
            //Check Application Name is Unique 
            var sameCompanyNameCount = (from registerApplication in _context.CompanyRegisteredApplications
                                        where registerApplication.ApplicationName.ToLower() == registerCompanyAppModel.ApplicationName.ToLower()
                                        select registerApplication
                                     ).Count();

            if (sameCompanyNameCount > 0)
            {
                return new RegisterCompanyApplicationResponse
                {
                    Status = ResponseCode.Conflict,
                    Message = "Application Name already exists, Please choose another name."
                };

            }
            CompanyRegisteredApplication registeApplicationModel = new CompanyRegisteredApplication()
            {
                ApplicationName = registerCompanyAppModel.ApplicationName,
                ApplicationURL = registerCompanyAppModel.ApplicationURL,
                APIEndpoint = registerCompanyAppModel.APIEndpoint,
                ClientSecretKey = registerCompanyAppModel.ClientSecretKey,
                CreatedBy = Guid.Empty.ToString(),
                CreatedOn = DateTime.UtcNow,
                IsActive = true,
                CompanyId = registerCompanyAppModel.CompanyId
            };
            try
            {
                var registeredApplication = _context.CompanyRegisteredApplications.Add(registeApplicationModel);
                _context.SaveChanges();

                return new RegisterCompanyApplicationResponse
                {
                    ClientSecretKey = registerCompanyAppModel.ClientSecretKey,
                    Status = ResponseCode.Success,
                    Message = "Application registered successfully"
                };
            }
            catch (Exception ex)
            {
                return new RegisterCompanyApplicationResponse
                {
                    ClientSecretKey = null,
                    Status = ResponseCode.InternalServerError,
                    Message = "Something went wrong"
                };
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

        public async Task<CompanyLogoResponseStatus> UploadCompanyLogo(CompanyLogoBLLModel companyLogoModel)
        {
            if (_context.Companys == null)
            {
                return new CompanyLogoResponseStatus
                {
                    Status = ResponseCode.NotFound,
                    Message = "Database context is null"
                };
            }
            try
            {
                var company = await _context.Companys.FindAsync(companyLogoModel.CompanyId);
                if (company == null)
                {
                    return new CompanyLogoResponseStatus
                    {
                        Status = ResponseCode.NotFound,
                        Message = "Company not found"
                    };
                }
                if (companyLogoModel.CompanyLogoDetails != null && companyLogoModel.CompanyLogoDetails.Count > 0)
                {
                    var file = companyLogoModel.CompanyLogoDetails.First();
                    company.CompanyLogo = file.FileName;
                    company.ByteSize = file.ByteSize;

                    _context.Companys.Update(company);
                    await _context.SaveChangesAsync();

                    return new CompanyLogoResponseStatus
                    {
                        Status = ResponseCode.Success,
                        Message = "Logo saved successfully",
                        CompanyLogo =  AttachmentHelper.GetAssetLink(_config["AssetLink"], "\\" + ImageFolderConstants.CompanyLogo + "\\", company.CompanyLogo)
                    };
                }
                else
                {
                    return new CompanyLogoResponseStatus
                    {
                        Status = ResponseCode.BadRequest,
                        Message = "No file provided"
                    };
                }
            }
            catch (Exception ex)
            {
                return new CompanyLogoResponseStatus
                {
                    Status =    ResponseCode.InternalServerError,
                    Message = ex.Message
                };
            }
        }
        public async Task<ResponseStatus> DeleteApplication(int id)
        {
            try
            {
                var application = await _context.CompanyRegisteredApplications.FindAsync(id);
                if (application != null)
                {
                    application.IsDeleted = true;
                    await _context.SaveChangesAsync();

                    return new ResponseStatus()
                    {
                        Status = "SUCCEED",
                        Message = "Application deleted successfully"
                    };
                }
                else
                {
                    // APPLICATION not found
                    return new ResponseStatus()
                    {
                        Status = "FAILED",
                        Message = "Cannot find Application"
                    };
                }
            }
            catch (Exception ex)
            {
                return new ResponseStatus()
                {
                    Status = "FAILED",
                    Message = ex.Message
                };
            }
        }

        public async Task<CompanyThemeColorResponseStatus> SaveThemeColors(ComapnyThemeColors comapnyThemeColor)
        {
            if (_context.Companys == null)
            {
                return new CompanyThemeColorResponseStatus
                {
                    Status = ResponseCode.NotFound,
                    Message = "Database context is null"
                };
            }
            try
            {
                var companyDetail = await _context.Companys.FirstOrDefaultAsync(company => company.Id == comapnyThemeColor.CompanyId);
                if (companyDetail != null)
                {
                    companyDetail.PrimaryColor = comapnyThemeColor.PrimaryColor;
                    companyDetail.SecondaryColor = comapnyThemeColor.SecondaryColor;
                    _context.Companys.Update(companyDetail);
                    await _context.SaveChangesAsync();
                    return new CompanyThemeColorResponseStatus()
                    {
                        Status = ResponseCode.Success,
                        Message = "Theme colors saved successfully",
                        PrimaryColor = comapnyThemeColor.PrimaryColor,
                        SecondaryColor = comapnyThemeColor.SecondaryColor
                        
                    };
                }
                else
                {
                    // APPLICATION not found
                    return new CompanyThemeColorResponseStatus()
                    {
                        Status = ResponseCode.NotFound,
                        Message = "Cannot find Company"
                    };
                }
            }
            catch (Exception ex)
            {
                return new CompanyThemeColorResponseStatus()
                {
                    Status = ResponseCode.InternalServerError,
                    Message = ex.Message
                };
            }
        }
    }

}
