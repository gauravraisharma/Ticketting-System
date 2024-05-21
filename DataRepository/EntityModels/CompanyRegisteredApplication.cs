using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public class CompanyRegisteredApplication
    {
        [Key]
        public int Id { get; set; }
        [Column(TypeName = "varchar(500)")]
        public string? ApplicationName { get; set; }
        [Column(TypeName = "nvarchar(2048)")]
        public string? ApplicationURL{ get; set; }
        [Column(TypeName = "nvarchar(2048)")]
        public string? APIEndpoint { get; set; }
        [Column(TypeName = "varchar(500)")]
        public string? ClientSecretKey { get; set; }
            
        [Column(TypeName = "nvarchar(450)")]
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CompanyId { get; set; }
        [Column(TypeName = "nvarchar(450)")]
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool IsActive { get; set; }

        public bool IsDeleted { get; set; }
    }
}
