using Azure.Core;
using DataRepository.EntityModels;
using DataRepository.IRepository;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DataRepository.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;
        public AccountRepository(
            UserManager<ApplicationUser> userManager,
            ApplicationDbContext context,
            RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration config)
        {

            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _config = config;
            _context = context;
        }
        public async Task<ResponseStatus> CreateApplicationUser(ApplicationUserModel userModel)
        {
            try
            {
                var userFound = await _userManager.FindByNameAsync(userModel.UserName);
                if (userFound != null && !userFound.IsDeleted)
                {
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "Username already exist, Please choose another username"
                    };
                }

                //Check for unique email 
                var userFoundByEmail = await _userManager.FindByEmailAsync(userModel.Email);
                if (userFoundByEmail != null && !userFoundByEmail.IsDeleted)
                {
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "Email already in use"
                    };
                }


                var roleResponse = GetRoleName(userModel.UserType);
                if (roleResponse.Status == "FAILED")
                {
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "Invalid UserType"
                    };
                }

                ApplicationUser user = new ApplicationUser
                {
                    UserName = userModel.UserName,
                    Email = userModel.Email,
                    PhoneNumber = userModel.PhoneNumber,
                    FirstName = userModel.FirstName,
                    LastName = userModel.LastName,
                    DepartmentId = userModel.DepartmentId,
                    CompanyId=userModel.CompanyId,
                    CreatedBy = userModel.CreatedBy,
                    CreatedOn = DateTime.UtcNow
                };

                IdentityResult identityResult = await _userManager.CreateAsync(user, userModel.Password);



                if (!identityResult.Succeeded)
                {
                    var errors = string.Join(" and ", identityResult.Errors.Select(e => e.Description).ToArray());
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = errors
                    };
                }

                if (!await _roleManager.RoleExistsAsync(roleResponse.Message))
                {
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "User create but not role assign to him"
                    };
                }
                else
                {
                    await _userManager.AddToRoleAsync(user, roleResponse.Message);
                }
                return new ResponseStatus
                {
                    Status = "SUCCEED",
                    Message = "User successfully created"
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
            finally
            {
                _context.Dispose();
            }
        }

        public async Task<ResponseStatus> UpdateApplicationUser(UpdateApplicationUserModel userModel)
        {
            try
            {
                var userFound = await _userManager.FindByNameAsync(userModel.UserName);
                if (userFound == null && userFound.IsDeleted)
                {
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "Username not found"
                    };
                }

                //If Email is changed 
                if (userFound.Email != userModel.Email)
                {
                    var userFoundByEmail = await _userManager.FindByEmailAsync(userModel.Email);
                    if (userFoundByEmail != null && !userFoundByEmail.IsDeleted)
                    {
                        return new ResponseStatus
                        {
                            Status = "FAILED",
                            Message = "Email already in use"
                        };
                    }
                }

                //Update the user role 
                var currentRoles = await _userManager.GetRolesAsync(userFound);
                var roleFound = await _roleManager.FindByIdAsync(userModel.UserType);
                if (roleFound != null)
                {
                    var IsRoleAlreadyPresent = false;
                    foreach (var userRole in currentRoles)
                    {
                        if (roleFound.Name != userRole)
                        {
                           await _userManager.RemoveFromRoleAsync(userFound, userRole);
                        }
                        if(roleFound.Name == userRole)
                        {
                            IsRoleAlreadyPresent = true;
                        }
                    }
                  if(!IsRoleAlreadyPresent)  await _userManager.AddToRoleAsync(userFound, roleFound.Name);
                }

                //Update User data 

                userFound.Email = userModel.Email;
                userFound.PhoneNumber = userModel.PhoneNumber;
                userFound.FirstName = userModel.FirstName;
                userFound.LastName = userModel.LastName;
                userFound.DepartmentId =(roleFound.Name.ToUpper()=="ADMIN")? userModel.DepartmentId : null;
                userFound.ModifiedBy = userModel.ModifiedBy;
                userFound.ModifiedOn = DateTime.UtcNow;


                IdentityResult identityResult = await _userManager.UpdateAsync(userFound);

                if (!identityResult.Succeeded)
                {
                    var errors = string.Join(" and ", identityResult.Errors.Select(e => e.Description).ToArray());
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = errors
                    };
                }
                if (!string.IsNullOrEmpty( userModel.Password))
                {
                    var token = await _userManager.GeneratePasswordResetTokenAsync(userFound);
                    var resetPasswordResult = await _userManager.ResetPasswordAsync(userFound, token, userModel.Password);
                    var errors = string.Join(" and ", resetPasswordResult.Errors.Select(e => e.Description).ToArray());
                    if (!resetPasswordResult.Succeeded)
                        return new ResponseStatus
                        {
                            Status = "FAILED",
                            Message = errors
                        };
                }



                return new ResponseStatus
                {
                    Status = "SUCCEED",
                    Message = "User successfully updated"
                };
            }
            catch (Exception ex)
            {
                return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = "Something went Wrong"
                };
            }
            finally
            {
                _context.Dispose();
            }
        }

        private async Task<string> GenerateToken(ApplicationUser user,bool rememberMe)
        {
            try
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                //Find UserRole 
                var userRoles = await _userManager.GetRolesAsync(user);

                List<Claim> claims = new List<Claim> {
                    new Claim(ClaimTypes.Name,user.UserName),
                    new Claim(ClaimTypes.Role,userRoles.FirstOrDefault().ToUpper())
                };

                var token = new JwtSecurityToken(claims: claims, expires:(rememberMe)? DateTime.Now.AddDays(30): DateTime.Now.AddHours(12), signingCredentials: credentials);
                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<LoginStatus> UserLogin(UserLoginModel userModel)
        {
            try
            {
                var user = await _userManager.FindByNameAsync(userModel.Username);
                if (user == null)
                {
                    return new LoginStatus
                    {
                        Status = "FAILED",
                        Message = "User doesn't exist"
                    };
                }
                if (!await _userManager.CheckPasswordAsync(user, userModel.Password))
                {
                    return new LoginStatus
                    {
                        Status = "FAILED",
                        Message = "Invalid Password"
                    };
                }

                var signInResult = await _signInManager.PasswordSignInAsync(user, userModel.Password, false, true);
                if (signInResult.Succeeded)
                {
                    var userRoles = await _userManager.GetRolesAsync(user);
                    var authClaims = new List<Claim> { new Claim(ClaimTypes.Name, user.UserName) };

                    foreach (var userRole in userRoles)
                    {
                        authClaims.Add(new Claim(ClaimTypes.Role, userRole));
                    };
                    var token = await GenerateToken(user, userModel.RememberMe);

                    var CompanyTimeZone = (from Company in _context.Companys
                                    where Company.Id == user.CompanyId
                                    select new
                                    {
                                        TimeZone = Company.TimeZone
                                    }
                                   ).FirstOrDefault();

                    return new LoginStatus
                    {
                        Status = "SUCCEED",
                        Message = "Login Successfully",
                        Token = token,
                        UserType = userRoles[0],
                        UserId = user.Id,
                        CompanyId=user.CompanyId,
                        TimeZone= (userRoles[0].ToUpper()=="SUPERADMIN")?null:CompanyTimeZone.TimeZone
                    };

                }
                else if (signInResult.IsLockedOut)
                {
                    return new LoginStatus
                    {
                        Status = "FAILED",
                        Message = "User Locked out."
                    };
                }
                else
                {
                    return new LoginStatus
                    {
                        Status = "FAILED",
                        Message = "Please login with correct username and password."
                    };
                }
            }
            catch (Exception ex)
            {
                return new LoginStatus
                {
                    Status = "FAILED",
                    Message = ex.Message + " Something went wrong."
                };
            }
            finally
            {
                _context.Dispose();
            }
        }
        public async Task<ResponseStatus> CreateNewRole(string roleName)
        {
            try
            {
                if (string.IsNullOrEmpty(roleName))
                {
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "Role name is required"
                    };
                }
                var result = await _roleManager.CreateAsync(new IdentityRole(roleName));
                if (result.Succeeded)
                {
                    return new ResponseStatus()
                    {
                        Status = "SUCCEED",
                        Message = "Role created successfully"
                    };
                }
                else
                {
                    var errors = string.Join(" and ", result.Errors.Select(item => item.Description).ToArray());
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = errors
                    };
                }
            }
            catch (Exception ex)
            {
                return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = "Something went wrong."
                };
            }
            finally
            {
                _context.Dispose();
            }
        }
        public DDListResponse GetDepartmentListDD()
        {
            try
            {
                if (_context == null)
                {
                    return new DDListResponse
                    {
                        Status = "FAILED",
                        DdList = null
                    };
                }
                var result = (from department in _context.Departments
                              select new DropDownModel
                              {
                                  id = department.DepartmentId,
                                  Label = department.Name
                              }
                              ).ToList();
                return new DDListResponse()
                {
                    Status = "SUCCEED",
                    DdList = result
                };

            }
            catch (Exception ex)
            {
                return new DDListResponse
                {
                    Status = "FAILED",
                    DdList = null
                };
            }
            finally
            {
                _context.Dispose();
            }

        }

        public DDListResponse GetUserTypeListDD()
        {
            try
            {
                if (_context == null)
                {
                    return new DDListResponse
                    {
                        Status = "FAILED",
                        DdList = null
                    };
                }
                var result = (from role in _context.Roles
                              select new DropDownModel
                              {
                                  id = role.Id,
                                  Label = role.Name
                              }
                              ).ToList();
                return new DDListResponse()
                {
                    Status = "SUCCEED",
                    DdList = result
                };

            }
            catch (Exception ex)
            {
                return new DDListResponse
                {
                    Status = "FAILED",
                    DdList = null
                };
            }
            finally
            {
                _context.Dispose();
            }

        }
        public ResponseStatus GetRoleName(string roleId)
        {
            try
            {
                if (_context == null)
                {
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "Db Context is null"
                    };
                }
                var result = (from role in _context.Roles
                              where role.Id == roleId
                              select new
                              {
                                  Name = role.Name
                              }
                              );

                return new ResponseStatus
                {
                    Status = "SUCCEED",
                    Message = result.FirstOrDefault().Name
                };

            }
            catch (Exception ex)
            {
                return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = "Something went wrong"
                };
            }


        }

        public IEnumerable<ResponseApplicationUserModel> GetUserList(int companyId)
        {

            if (_context == null)
            {
                return null;
            }
            try
            {
                var result = (from user in _context.Users
                              join userrole in _context.UserRoles on user.Id equals userrole.UserId
                              join role in _context.Roles on userrole.RoleId equals role.Id
                              join creator in _context.Users on user.CreatedBy equals creator.Id
                              //left join 
                              join department in _context.Departments on user.DepartmentId equals department.DepartmentId into userDepartmentGroup
                              from depart in userDepartmentGroup.DefaultIfEmpty()
                              where user.IsDeleted == false && user.CompanyId==companyId
                              orderby user.CreatedOn descending
                              select new ResponseApplicationUserModel
                              {
                                  Id = user.Id,
                                  FirstName = user.FirstName,
                                  LastName = user.LastName,
                                  UserName = user.UserName,
                                  UserType = role.Name,
                                  Department = depart.Name,
                                  CreatedBy = string.Concat(creator.FirstName, ' ', creator.LastName),
                                  Email = user.Email,
                                  PhoneNumber = user.PhoneNumber
                              }
                              ).ToList();
                return result;

            }
            catch (Exception ex)
            {
                return null;
            }
            finally
            {
                _context.Dispose();
            }

        }
        public ResponseStatus DeleteUser(string userId)
        {
            try
            {
                if (_context == null)
                {
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "Db Context is null"
                    };
                }
                 (from user in _context.Users
                  where user.Id == userId
                  select user
                              ).ToList().ForEach(user => user.IsDeleted = true);

                _context.SaveChanges();
                return new ResponseStatus
                {
                    Status = "SUCCEED",
                    Message = "User record deleted successfully"
                };

            }
            catch (Exception ex)
            {
                return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = "Something went wrong"
                };
            }


        }
        public UserDataResponse GetUserDataById(string userId)
        {
            try
            {
                if (_context == null)
                {
                    return new UserDataResponse
                    {
                        Status = "FAILED",
                        Message = "Db Context is null"
                    };
                }
                var userData = (from user in _context.Users
                                join userRole in _context.UserRoles on user.Id equals userRole.UserId
                                join role in _context.Roles on userRole.RoleId equals role.Id
                                where user.Id == userId
                                select new UserDetailModel
                                {
                                    Username = user.UserName,
                                    FirstName = user.FirstName,
                                    LastName = user.LastName,
                                    Email = user.Email,
                                    PhoneNumber = user.PhoneNumber,
                                    UserType = userRole.RoleId,
                                    Department = user.DepartmentId,
                                    Password = user.PasswordHash,
                                    IsAdmin = (role.Name.ToUpper() == "ADMIN") ? true : false
                                }

                              ).FirstOrDefault();

                return new UserDataResponse
                {
                    Status = "SUCCEED",
                    Message = "User record found",
                    userDetail = userData
                };

            }
            catch (Exception ex)
            {
                return new UserDataResponse
                {
                    Status = "FAILED",
                    Message = "Something went wrong"
                };
            }


        }
        private async Task<string> GenerateTokenToSwitchAdmin(ApplicationUser user)
        {
            try
            {
                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

                //Find UserRole 
                var userRoles = await _userManager.GetRolesAsync(user);

                List<Claim> claims = new List<Claim> {
                    new Claim(ClaimTypes.Name,user.UserName),
                    new Claim(ClaimTypes.Role,"SUPERADMIN"),
                    new Claim(ClaimTypes.Role,"ADMIN")
                };

                var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddDays(1), signingCredentials: credentials);
                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        public async Task<ResponseStatus> SwitchToCompanyAdmin(string userId)
        {
            try
            {
                if (_context == null)
                {
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "Db Context is null"
                    };
                }

                // get user role
                var user=await _userManager.FindByIdAsync(userId);
                var userRoles = await _userManager.GetRolesAsync(user);

                //If passwed user is a superadmin than proceed else not 
                if(userRoles.FirstOrDefault().ToUpper()!="SUPERADMIN")
                {

                   return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "User is not valid for this functionality"
                    };
                }
               
                var token = await GenerateTokenToSwitchAdmin(user);


                return new ResponseStatus
                {
                    Status = "SUCCEED",
                    Message = token
                };

            }
            catch (Exception ex)
            {
               return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = "Something went wrong"
                };
            }


        }


        public async Task<ResponseStatus> SwitchToSuperadmin(string userId)
        {
            try
            {
                if (_context == null)
                {
                    return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "Db Context is null"
                    };
                }

                // get user role
                var user=await _userManager.FindByIdAsync(userId);
                var userRoles = await _userManager.GetRolesAsync(user);

                //If user is a superadmin than proceed else not 
                if(userRoles.FirstOrDefault().ToUpper()!="SUPERADMIN")
                {

                   return new ResponseStatus
                    {
                        Status = "FAILED",
                        Message = "User is not valid for this functionality"
                    };
                }
               
                var token = await GenerateToken(user,false);

                return new ResponseStatus
                {
                    Status = "SUCCEED",
                    Message = token
                };

            }
            catch (Exception ex)
            {
               return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = "Something went wrong"
                };
            }


        }

    }
}
