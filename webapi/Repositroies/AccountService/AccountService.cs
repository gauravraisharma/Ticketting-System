﻿using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using webapi.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace webapi.Repositroies.AccountService
{
    public class AccountService : IAccountService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _config;
        private readonly ApplicationDbContext _context;
        public AccountService(
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
            var userFound = await _userManager.FindByNameAsync(userModel.UserName);
            if (userFound != null)
            {
                return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = "Username already exist, Please choose another username"
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
                FirstName=userModel.FirstName,
                LastName=userModel.LastName,
                DepartmentId=userModel.DepartmentId,
                CreatedBy = userModel.CreatedBy,
                CreatedOn=DateTime.Now
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

        private async Task<string> GenerateToken(ApplicationUser user)
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

                var token = new JwtSecurityToken(claims: claims, expires: null, signingCredentials: credentials);
                return new JwtSecurityTokenHandler().WriteToken(token);
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<LoginStatus> UserLogin(UserLoginModel userModel)
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
                var token = await GenerateToken(user);
                return new LoginStatus
                {
                    Status = "SUCCEED",
                    Message = "Login Successfully",
                    Token = token,
                    UserType = userRoles[0],
                    UserId = user.Id
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
        public async Task<ResponseStatus> CreateNewRole(string roleName)
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
        public DDListResponse GetDepartmentListDD()
        {

            if (_context == null)
            {
                return new DDListResponse
                {
                    Status = "FAILED",
                    DdList = null
                };
            }
            try
            {
                var result = (from department in _context.Departments
                              select new DropDownModel
                              {
                                  id = department.DepartmentId,
                                  Label = department.Name
                              }
                              );
                return new DDListResponse()
                {
                    Status = "SUCCEED",
                    DdList = result
                };

            }
            catch ( Exception ex ) {
                return new DDListResponse
                {
                    Status = "FAILED",
                    DdList = null
                };
            }
        }
        
        public DDListResponse GetUserTypeListDD()
        {

            if (_context == null)
            {
                return new DDListResponse
                {
                    Status = "FAILED",
                    DdList = null
                };
            }
            try
            {
                var result = (from role in _context.Roles
                              select new DropDownModel
                              {
                                  id = role.Id,
                                  Label = role.Name
                              }
                              );
                return new DDListResponse()
                {
                    Status = "SUCCEED",
                    DdList = result
                };

            }
            catch ( Exception ex ) {
                return new DDListResponse
                {
                    Status = "FAILED",
                    DdList = null
                };
            }
        }
        public ResponseStatus GetRoleName(string roleId)
        {

            if (_context == null)
            {
                return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = "Db Context is null"
                };
            }
            try
            {
                var result = (from role in _context.Roles
                              where role.Id == roleId
                              select new 
                              {
                                 Name= role.Name
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

        public IEnumerable<ResponseApplicationUserModel> GetUserList()
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
                              join  department in _context.Departments on user.DepartmentId equals department.DepartmentId into userDepartmentGroup
                              from depart in userDepartmentGroup.DefaultIfEmpty()
                              orderby user.CreatedOn descending
                              select new ResponseApplicationUserModel
                              {
                                  Id = user.Id,
                                  FirstName=user.FirstName,
                                  LastName=user.LastName,
                                  UserName=user.UserName,
                                  UserType= role.Name,
                                  Department= depart.Name,
                                  CreatedBy= string.Concat(creator.FirstName,' ',creator.LastName),
                                  Email=user.Email,
                                  PhoneNumber = user.PhoneNumber
                              }
                              ).ToList();
                return result;

            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
