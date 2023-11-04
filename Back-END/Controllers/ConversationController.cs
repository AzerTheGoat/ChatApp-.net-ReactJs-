using System.Collections;
using System.Security.Claims;
using ChatApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ChatApp.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConversationController : ControllerBase
{
    
    private readonly ApplicationDbContext _context;

    public ConversationController(ApplicationDbContext context)
    {
        _context = context;
    }
    
    public class UsernameRequest
    {
        public string Username { get; set; }
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> GetAllMessagesBetweenCurrentUserAndDest([FromBody]  UsernameRequest request)
    {
        var currentUser = GetCurretUser();
        var username = request.Username;

        var conversation = _context.Conversations.FirstOrDefault(c =>
            (c.OwnerUsername.ToLower() == currentUser.Username.ToLower() && c.DestUsername.ToLower() == username.ToLower()) ||
            (c.OwnerUsername.ToLower() == username.ToLower() && c.DestUsername.ToLower() == currentUser.Username.ToLower()));

        if (conversation == null)
        {
            return NotFound("La conversation n'a pas été trouvée.");
        }

        if (request.Username == conversation.OwnerUsername)
        {
            conversation.OwnerState = 2;
        }
        else
        {
            conversation.DestState = 2;
        }

        await _context.SaveChangesAsync();

        var messages = _context.Messages
            .Where(m => m.ConversationId == conversation.Id)
            .ToList();
        
        foreach (var message in messages)
        {
            message.timeago = message.GetTimeAgo();
        }
        

        return Ok(messages);
    }

    
    [HttpPost("deleteconv")]
    [Authorize]
    public IActionResult DeleteConversation([FromBody] UsernameRequest request)
    {
        var currentUser = GetCurretUser();
        var destUsername = request.Username;

        var conversation = _context.Conversations.Where(conv =>(
            currentUser.Username == conv.OwnerUsername && destUsername == conv.DestUsername ) || (currentUser.Username == conv.DestUsername && destUsername == conv.OwnerUsername)).FirstOrDefault() ;

        if (conversation == null)
        {
            Console.Write("hnannananan------------");
            return NotFound();
        }

        _context.Conversations.Remove(conversation);
        _context.SaveChanges();

        return Ok();

    }
    
    
    [HttpGet("getfriends")]
    [Authorize]
    public IActionResult GetAllConversationsForCurrentUser()
    {
        var currentUser = GetCurretUser();

        var conversations = _context.Conversations
            .Include(c => c.Messages)
            .Include(c => c.Owner)
            .Include(c => c.Dest)
            .Where(c => c.OwnerUsername.ToLower() == currentUser.Username.ToLower() || c.DestUsername.ToLower() == currentUser.Username.ToLower());

        var result = new List<object>();
        foreach (var conversation in conversations)
        {
            var lastMessage = conversation.Messages.OrderByDescending(m => m.DateTime).FirstOrDefault();
            var username = conversation.OwnerUsername.ToLower() == currentUser.Username.ToLower() ? conversation.DestUsername : conversation.OwnerUsername;
            var time = lastMessage.GetTimeAgo();
            if (username == conversation.OwnerUsername)
            {
                var photo = conversation.Owner.PhotoBytes;
                result.Add(new
                {
                    username,
                    lastMessage = lastMessage?.Mess,
                    timelastmessage = time,
                    state = conversation.OwnerState,
                    photoy = photo
                });
            }
            else if (username == conversation.DestUsername)
            {

                var photo = conversation.Dest.PhotoBytes;
                result.Add(new
                {
                    username,
                    lastMessage = lastMessage?.Mess,
                    timelastmessage = time,
                    state = conversation.DestState,
                    photoy = photo
                });
            }
        }

        return Ok(result);
    }

    public class Pictures
    {
        public string CurrentUser { get; set; }
        public string OtherUser { get; set; }
    }

    [HttpPost("getPhotoConv")]
    [Authorize]
    public IActionResult GetPictures(Pictures pictures)
    {
        var currentUser = _context.Users.FirstOrDefault(u => u.Username.ToLower() == pictures.CurrentUser.ToLower());
        var otherUser = _context.Users.FirstOrDefault(u => u.Username.ToLower() == pictures.OtherUser.ToLower());

        var conversation = _context.Conversations.FirstOrDefault(c =>
            (c.OwnerUsername.ToLower() == currentUser.Username.ToLower() && c.DestUsername.ToLower() == otherUser.Username.ToLower()) ||
            (c.OwnerUsername.ToLower() == otherUser.Username.ToLower() && c.DestUsername.ToLower() == currentUser.Username.ToLower())
        );

        if (conversation != null)
        {
            if (currentUser != null && otherUser != null)
            {
                string currentUserPhoto = currentUser.PhotoBytes;
                string otherUserPhoto = otherUser.PhotoBytes;

                return Ok(new
                {
                    CurrentUserPhoto = currentUserPhoto,
                    OtherUserPhoto = otherUserPhoto,
                    OwnerState = conversation.OwnerState,
                    DestState = conversation.DestState,
                    OwnerUsername = conversation.OwnerUsername,
                    DestUsername = conversation.DestUsername
                });
            }
        }

        return NotFound();
    }


    [HttpGet("{id}")]
    [Authorize]
    public IActionResult GetConversation(long id)
    {
        // Obtenez l'utilisateur actuel
        var currentUser = GetCurretUser();

        // Recherchez la conversation avec l'ID spécifié
        var conversation = _context.Conversations
            .Include(c => c.Messages)
            .FirstOrDefault(c => c.Id == id);

        // Vérifiez si la conversation existe
        if (conversation == null)
        {
            return NotFound();
        }

        // Vérifiez si l'utilisateur actuel est le propriétaire de la conversation
        if (conversation.OwnerUsername != currentUser.Username || conversation.DestUsername != currentUser.Username )
        {
            return Forbid();
        }

        // Renvoyez la conversation
        return Ok(conversation.OwnerUsername);
    }
    
    [HttpGet("lastMessage/{id}")]
    [Authorize]
    public IActionResult GetLastMessage(long id)
    {
        // Obtenez l'utilisateur actuel
        var currentUser = GetCurretUser();
        
        // Recherchez la conversation avec l'ID spécifié
        var conversation = _context.Conversations
            .Include(c => c.Messages)
            .FirstOrDefault(c => c.Id == id);

        // Vérifiez si la conversation existe
        if (conversation == null)
        {
            return NotFound();
        }

        // Vérifiez si l'utilisateur actuel est le propriétaire de la conversation
        if (conversation.Owner.Id != currentUser.Id || conversation.DestUsername != currentUser.Username)
        {
            return Forbid();
        }

        // Renvoyez la conversation
        return Ok(conversation.Messages.Last());
    }
    
    
    [HttpGet("GetLastMessages")]
    [Authorize]
    public IActionResult GetLastMessages()
    {
        // Obtenez l'utilisateur actuel
        var currentUser = GetCurretUser();
    
        // Créez une liste pour stocker les résultats
        var result = new List<(Message, User)>();

        // Parcourez la liste des conversations de l'utilisateur
        foreach (var conversation in _context.Conversations
                     .Include(c => c.Messages)
                     .Include(c => c.Dest)
                     .Where(c => c.OwnerUsername == currentUser.Username || c.DestUsername == currentUser.Username))
        {
            // Obtenez le dernier message de la conversation
            var lastMessage = conversation.Messages.Last();

            // Obtenez le destinataire de la conversation
            var dest = conversation.Dest;

            // Ajoutez le dernier message et le destinataire à la liste des résultats
            result.Add((lastMessage, dest));
        }

        // Renvoyez les résultats
        return Ok(result);
    }
    
    [HttpGet("getInfoUser/{id}")]
    [Authorize]
    public IActionResult getInfoUser(long id)
    {
        var currentUser = GetCurretUser();
        
        // Recherchez la conversation avec l'ID spécifié
        var conversation = _context.Conversations
            .Include(c => c.DestUsername)
            .FirstOrDefault(c => c.Id == id);

        // Vérifiez si la conversation existe
        if (conversation == null)
        {
            return NotFound();
        }

        // Vérifiez si l'utilisateur actuel est le propriétaire de la conversation
        if (conversation.OwnerUsername != currentUser.Username || conversation.DestUsername != currentUser.Username)
        {
            return Forbid();
        }

        // Renvoyez la conversation
        return Ok(conversation.Dest);
    }
    
    [HttpPost("ChangePassword")]
    [Authorize]
    public IActionResult ChangePassword([FromBody] ChangePasswordRequest request)
    {
        // Obtenez l'utilisateur actuel
        var currentUser = GetCurretUser();

        // Vérifiez si l'utilisateur actuel est autorisé à effectuer cette opération
        if (currentUser.Username != request.Username && !User.IsInRole("Admin"))
        {
            return Forbid();
        }

        // Recherchez l'utilisateur avec le nom d'utilisateur spécifié
        var user = _context.Users.FirstOrDefault(u => u.Username == request.Username);

        // Vérifiez si l'utilisateur existe
        if (user == null)
        {
            return NotFound();
        }

        // Mettez à jour le mot de passe de l'utilisateur
        user.Password = request.Password;
        _context.SaveChanges();

        // Renvoyez une réponse de succès
        return Ok();
    }

    public class ChangePasswordRequest
    {
        public string Username { get; set; }
        public string Password { get; set; }
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