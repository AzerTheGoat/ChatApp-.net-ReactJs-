using System.Security.Claims;
using ChatApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR.Client;

namespace ChatApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    
    private readonly ApplicationDbContext _context;
    private HubConnection _connection;

    public ChatController(ApplicationDbContext applicationDbContext)
    {
        _context = applicationDbContext;
        try
        {
            _connection = new HubConnectionBuilder()
                .WithUrl("http://localhost:5159/chathub")
                .WithAutomaticReconnect()
                .Build();

            _connection.StartAsync();
               
            _connection.On<Message>("ReceiveMessage", ReceiveMessage);
            Console.WriteLine("Connection Succeed");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Connection failed: {ex.Message}");
        }
    }
    
    public void ReceiveMessage(Message message)
    {
        var currentUser = GetCurretUser();
        if (message.DestUsername == currentUser.Username)
        {
            Console.WriteLine("Message reçu : " + message.Mess);
        }
    }


    [HttpPost("sendMessage")]
    public async Task<IActionResult> sendMessage([FromBody] sendMessageJson sendMessageJson)
    {
        var cu = GetCurretUser();
        Console.WriteLine(cu.Username);
        await _connection.SendAsync("SendMessage", cu.Username, sendMessageJson.Username, sendMessageJson.Message);
        return Ok(sendMessageJson.Message);
    }


    public class sendMessageJson
    {
        public string Username { get; set; }
        public string Message { get; set; }
    }
    
    private User GetCurretUser()
    {
        if (HttpContext.User.Identity.IsAuthenticated)
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if (identity != null)
            {
                var userClaims = identity.Claims;
                return new User
                {
                    Username = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.NameIdentifier)?.Value,
                    Email = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Email)?.Value,
                    Role = userClaims.FirstOrDefault(o => o.Type == ClaimTypes.Role)?.Value,
                    Job = userClaims.FirstOrDefault(o => o.Type == "Job")?.Value,
                    Phone = int.Parse(userClaims.FirstOrDefault(o => o.Type == "Phone")?.Value)
                };

            }
        }
        else
        {
            Console.Write("No user authentificate");
        }

        return null;
    }

}