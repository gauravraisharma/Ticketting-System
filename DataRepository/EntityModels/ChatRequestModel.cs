using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public  class ChatRequestModel
    {
    }
    public class ChatUserRegister
    {
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "PhoneNumber is required")]
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be exactly 10 digits.")]
        public int PhoneNumber { get; set; }
        [Required(ErrorMessage = "DepartmentId is required")]
        [Range(1000, 10000, ErrorMessage = "DepartmentId must be between 1000 and 10000.")]
        public int DepartmentId { get; set; }
        public bool isDeleted { get; set; }
    }
}
