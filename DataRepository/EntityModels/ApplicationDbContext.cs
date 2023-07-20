using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DataRepository.EntityModels
{
    public class ApplicationDbContext:IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions options):base(options)
        {
                
        }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketConversationTrack> TicketConversationTracks { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Department> Departments { get; set; }
    }
}
