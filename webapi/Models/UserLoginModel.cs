using System.ComponentModel.DataAnnotations;

namespace webapi.Models
{
    public class UserLoginModel
    {
        [Required(ErrorMessage ="Username is required")]
        public string Username { get; set; }  
        [Required(ErrorMessage ="Password is required")]
        public string Password { get; set; }
    }

    public class ApplicationUserModel
    {

        [Required(ErrorMessage = "First Name is required")]
        public string FirstName { get; set; }  
        [Required(ErrorMessage = "Last Name is required")]
        public string LastName { get; set; }
        [Required(ErrorMessage = "Username is required")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Enter correct email")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Phone number is required")]
        [RegularExpression("^(?!0+$)(\\+\\d{1,3}[- ]?)?(?!0+$)\\d{10,15}$", ErrorMessage = "Please enter valid phone no.")]
        public string PhoneNumber { get; set; }
        [Required(ErrorMessage = "UserType is required")] 
        public string UserType { get; set; }
        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
        public int? DepartmentId { get; set; }
        [Required(ErrorMessage = "Created by  is required")]
        public string CreatedBy { get; set; }
    }
}
