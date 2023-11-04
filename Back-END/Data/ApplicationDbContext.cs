using ChatApp.Models;
using Microsoft.EntityFrameworkCore;
public class ApplicationDbContext : DbContext
{
    public DbSet<Conversation> Conversations { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<TokenVerfication> tokenVerification{ get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseMySQL("Server=localhost;Database=ChatAppDB;Uid=root;Pwd=new_password;");
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();
        
        modelBuilder.Entity<Message>()
            .HasKey(m => m.Id);

        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.Owner)
            .WithMany(u => u.Conversations)
            .HasForeignKey(c => c.OwnerUsername);

        modelBuilder.Entity<Conversation>()
            .HasOne(c => c.Dest)
            .WithMany()
            .HasForeignKey(c => c.DestUsername);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Conversation)
            .WithMany(c => c.Messages)
            .HasForeignKey(m => m.ConversationId);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.Owner)
            .WithMany()
            .HasForeignKey(m => m.OwnerUsername);
        modelBuilder.Entity<Message>()
            .HasOne(m => m.Dest)
            .WithMany()
            .HasForeignKey(m => m.DestUsername);
    }
}
