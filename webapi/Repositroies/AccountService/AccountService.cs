using Microsoft.AspNetCore.Identity;
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
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly IConfiguration _config;
        public AccountService(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<IdentityUser> signInManager, IConfiguration config)
        {

            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _config = config;
        }
        public async Task<ResponseStatus> CreateApplicationUser(ApplicationUser userModel, string roleName)
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

            IdentityUser user = new IdentityUser
            {
                UserName = userModel.UserName,
                Email = userModel.Email,
                PhoneNumber = userModel.PhoneNumber
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

            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                return new ResponseStatus
                {
                    Status = "FAILED",
                    Message = "User create but not role assign to him"
                };
            }
            else
            {
                await _userManager.AddToRoleAsync(user, roleName);
            }
            return new ResponseStatus
            {
                Status = "SUCCEED",
                Message = "User successfully created"
            };
        }

        private async Task<string> GenerateToken(IdentityUser user)
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

                var token = new JwtSecurityToken(claims: claims, expires: DateTime.Now.AddHours(12), signingCredentials: credentials);
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
    }
}
