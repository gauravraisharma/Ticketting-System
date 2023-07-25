using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataRepository.EntityModels
{
    public class ApplicationUser : IdentityUser
    {
        [Column(TypeName = "nvarchar(450)")]
        public string FirstName { get; set; }
        [Column(TypeName = "nvarchar(450)")]
        public string? LastName { get; set; }
        public int? DepartmentId { get; set; }
        [Column(TypeName = "nvarchar(450)")]
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        [Column(TypeName = "nvarchar(450)")]
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool IsDeleted { get; set; }
    }
}
