using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    public class ChatUser
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        [Column(TypeName = "varchar(500)")]
        public string Name { get; set; }
        [MaxLength(10)]
        public int PhoneNumber { get; set; }
        [Column(TypeName = "varchar(500)")]
        public string email { get; set; }
        public int DepartmentId { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class ChatData
    {

        [Key]
        public int Id { get; set; }
        [Column(TypeName = "varchar(max)")]
        public string Message { get; set; }
        public string UserType { get; set; } // ADMIN,CHATUSER
       
        [Column(TypeName = "nvarchar(450)")]
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        [Column(TypeName = "nvarchar(450)")]
        public bool IsDeleted { get; set; }
    }
}
