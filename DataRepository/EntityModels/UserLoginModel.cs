using System.ComponentModel.DataAnnotations;

namespace DataRepository.EntityModels
{
    public class UserLoginModel
    {
        [Required(ErrorMessage ="Username is required")]
        public string Username { get; set; }  
        [Required(ErrorMessage ="Password is required")]
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }

    public class ApplicationUserModel
    {

        [Required(ErrorMessage = "First Name is required")]
        public string FirstName { get; set; }  
        public string LastName { get; set; }
        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Enter correct email")]
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "UserType is required")] 
        public string UserType { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        public int? DepartmentId { get; set; }
        [Required(ErrorMessage = "Created by  is required")]
        public string CreatedBy { get; set; }
        [Required(ErrorMessage = "Company id  is required")]
        public int CompanyId { get; set; }
    }
    public class UpdateApplicationUserModel
    {

        [Required(ErrorMessage = "UserId is required")]
        public string userId { get; set; } 
        [Required(ErrorMessage = "First Name is required")]
        public string FirstName { get; set; }  
        public string LastName { get; set; }
        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Enter correct email")]
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "UserType is required")] 
        public string UserType { get; set; }
        
        public string? Password { get; set; }
        public int? DepartmentId { get; set; }
        [Required(ErrorMessage = "Created by  is required")]
        public string ModifiedBy { get; set; }
    }
}
