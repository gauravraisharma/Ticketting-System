using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public class CompanyLogoBLLModel
    {
        public int CompanyId { get; set; }
        public List<FileUploadResponse> CompanyLogoDetails { get; set; }
    }
}
