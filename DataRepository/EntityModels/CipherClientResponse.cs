using DataRepository.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public class CipherClientResponse
    {
        public ResponseCode Status { get; set; }
        public string Message { get; set; }
        public string UserIdentityToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
