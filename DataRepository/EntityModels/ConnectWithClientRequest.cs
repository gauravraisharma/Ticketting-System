using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public class ConnectWithClientRequest
    {
        public string? AccessToken { get; set; }
        public string? ApplicationName {  get; set; }
        public string? ClientHostURL { get; set; }
    }
}
