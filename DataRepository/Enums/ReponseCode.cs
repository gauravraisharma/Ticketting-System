using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.Enums
{
    public enum ResponseCode
    {
        Success = 200,
        BadRequest = 400,
        Unauthorized= 401,
        Forbidden = 403,
        NotFound = 404,
        InternalServerError = 500,
        ServiceUnavailable = 503,
        RequestTimeout = 408,
        Conflict = 409,
    }

}
