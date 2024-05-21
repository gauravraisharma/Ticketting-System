using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public class RegisterCompanyApplicationBLLModel
    {
        public string ApplicationName { get; set; }
        public string ApplicationURL { get; set; }
        public string APIEndpoint {  get; set; }
        public string ClientSecretKey { get; set; }
        public int CompanyId { get; set; }
    }
}
