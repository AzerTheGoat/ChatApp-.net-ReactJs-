using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ChatApp.Models;

    public class User
    {
        public long Id { get; set; }
        [Key]
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Job { get; set; }
        public int Phone { get; set; }
        public List<Conversation> Conversations { get; set; }
        public string PhotoBytes { get; set; }
    }