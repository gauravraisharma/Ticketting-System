using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace DataRepository.EntityModels
{
    
    public class CreateTicketModel
    {
        [Required(ErrorMessage="Priority is required")]
        public string Priority { get; set; }
        [Required(ErrorMessage = "Subject is required")]
        public string Subject { get; set; }
        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; }
        [Required(ErrorMessage = "CreatedBy is required")]
        public string CreatedBy { get; set; }
        [Required(ErrorMessage = "DepartmentId is required")]
        public int DepartmentId { get; set; }
    }
    public class RequestConversationMessage
    {
        [Required(ErrorMessage = "TicketId is required")]
        public int TicketId { get; set; }
        [Required(ErrorMessage = "Message is required")]
        public string Message { get; set; }
        [Required(ErrorMessage = "CreatedBy is required")]
        public string CreatedBy { get; set; }
    } 
    
}
