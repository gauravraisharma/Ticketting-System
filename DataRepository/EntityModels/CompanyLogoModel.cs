using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public class CompanyLogoModel
    {
        [Required(ErrorMessage = "Company Id is required")]
        public string CompanyId { get; set; }
        [Required(ErrorMessage = "Company Logo is required")]
        public IFormFileCollection CompanyLogo { get; set; }

    }
}
