namespace ChatApp.Models;

public class Conversation
{
    public long Id { get; set; }
    public List<Message> Messages { get; set; }
    public User Owner { get; set; }
        public User Dest { get; set; }
        public int OwnerState  { get; set; } // 1 = delivred, 2 = SEEN
        public int DestState  { get; set; } // 1 = delivred, 2 = SEEN
    public string OwnerUsername { get; set; }
    public string DestUsername { get; set; }
    

}