using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DataRepository.EntityModels
{
    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }
        [Column( TypeName="varchar(100)")]
        public string Priority { get; set; }
        [Column(TypeName = "varchar(500)")]
        public string Subject { get; set; }
        [Column(TypeName = "varchar(max)")]
        public string Description { get; set; }

        [Column(TypeName = "varchar(50)")]
        public string status { get; set; }


        [Column(TypeName = "nvarchar(450)")]
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        [Column(TypeName = "nvarchar(450)")]
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool IsDeleted { get; set; }
        public int? DepartmentId { get; set; }

    }
    public class TicketConversationTrack
    {
        [Key]
        public int ConversationTrackId { get; set; }
        public int TicketId { get; set; }
        [Column( TypeName = "varchar(max)")]
        public string Message { get; set; }
        [Column(TypeName = "nvarchar(450)")]
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        [Column(TypeName = "nvarchar(450)")]
        public string? ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public bool IsDeleted { get; set; }

    }
    public class Attachment
    {
        [Key]
        public int attachmentId { get; set; }
        public int referenceId { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string AttachmentType { get; set; }

        [Column(TypeName = "varchar(200)")]
        public string Name { get; set; }
        [Column(TypeName = "varchar(100)")]
        public string Type { get; set; }
        public long ByteSize { get; set; }
        public DateTime CreatedOn { get; set; }

        
    }

}
