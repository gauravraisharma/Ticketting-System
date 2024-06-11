using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public class ComapnyThemeColors
    {
        [Required(ErrorMessage = "Company Id is required")]
        public int CompanyId { get; set; }
        public string PrimaryColor { get; set; }
        public string SecondaryColor { get; set;}

    }
}
