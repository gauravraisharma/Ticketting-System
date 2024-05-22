using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public class CipherUserDataModel
    {
        public string UserId { get; set; }
        public string Email {  get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string UserType { get; set; }
        public string MobilePhne { get; set; }
        public string Exp {  get; set; }
    }
}
