﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public class ValidateTokenRequest
    {
        public string Token { get; set; }
        public string SecretKey { get; set; }
        public string Type { get; set; }
    }
}
