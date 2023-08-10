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
        public DbSet<Company> Companys { get; set; }
        public DbSet<ChatUser> ChatUsers { get; set; }
        public DbSet<ChatData> ChatDatas { get; set; }
        public DbSet<ChatRoom> ChatRooms { get; set; }
    }
}
