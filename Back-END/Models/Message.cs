namespace ChatApp.Models;

public class Message
{
    public long Id { get; set; }
    public string Mess { get; set; }
    public Conversation Conversation { get; set; }
    public User Owner { get; set; }
    public User Dest { get; set; }
    public DateTime DateTime { get; set; }
    public long ConversationId { get; set; }
    public string OwnerUsername { get; set; }
    public string DestUsername { get; set; }
    public string timeago { get; set; }

        public string GetTimeAgo()
        {
            var timeSpan = DateTime.Now - this.DateTime;
            if (timeSpan.TotalMinutes < 5)
            {
                return "Just Now";
            }
            else if (timeSpan.TotalMinutes < 60)
            {
                return $"{timeSpan.Minutes} mins ago";
            }
            else if (timeSpan.TotalHours < 24)
            {
                return $"{timeSpan.Hours} hours ago";
            }
            else if (timeSpan.TotalDays < 365)
            {
                return $"{timeSpan.Days} days ago";
            }
            else
            {
                return $"{timeSpan.Days / 365} years ago";
            }
        }

}