using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public class CompanyRequestModel
    {
    }   
    public class RegisterCompanyModel
    {
        [Required(ErrorMessage = "First Name is required")]
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }
        
        [Required(ErrorMessage = "Company Name is required")]
        public string CompanyName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Enter correct email")]
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "UserType is required")]
        public string Password { get; set; }
    }
    public class UpdateTimeZone
    {
        [Required(ErrorMessage = "Company id  is required")]
        public int CompanyId { get; set; }
        [Required(ErrorMessage = "TimeZone is required")]
        public string TimeZone { get; set; }
    }
}
