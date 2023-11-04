using System.ComponentModel.DataAnnotations;

namespace ChatApp.Models;

public class TokenVerfication
{
    [Key]
    public string username { get; set; }
    public string token { get; set; }
}