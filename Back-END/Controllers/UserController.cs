using System.Security.Claims;
using ChatApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;

namespace ChatApp.Controllers;


[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserController(ApplicationDbContext context)
    {
        _context = context;
    }


    [HttpPost ("AddUser")]
    [Authorize (Roles = "Admin")]
    public IActionResult AddUser([FromBody] User user)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Username.ToLower() == user.Username.ToLower());
        if (existingUser != null)
        {
            return BadRequest("Username already exists");
        }
        _context.Users.Add(user);
        _context.SaveChanges();

        return Ok("User was added succesfully");
    }

    [HttpDelete("DeleteUser/{username}")]
    [Authorize(Roles = "Admin")]
    public IActionResult DeleteUser(string username)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Username.ToLower() == username.ToLower());
        if (existingUser == null)
        {
            return BadRequest("Username doesn't exist");
        }
        
        _context.Users.Remove(existingUser);
        _context.SaveChanges();

        return Ok("User was removed succesfully");
    }

    public class userDelete
    {
        public string Username { get; set; }
    }
    
    [HttpPut("PutUserAdmin")]
    [Authorize (Roles = "Admin")]
    public IActionResult UpdateUserAdmin([FromBody] User user)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Username == user.Username);
        if (existingUser == null)
        {
            return BadRequest("User doesn't exist");
        }

        existingUser.Username = user.Username;
        existingUser.Email = user.Email;
        existingUser.Password = user.Password;
        existingUser.Role = user.Role;
        existingUser.Job = user.Job;
        existingUser.Phone = user.Phone;
        existingUser.PhotoBytes = user.PhotoBytes;

        _context.Users.Update(existingUser);
        _context.SaveChanges();

        return Ok("User was updated succesfully");
    }
    
    [Authorize]
    [HttpPut("PutCurrentUser")]
    public IActionResult UpdateUserCurrent([FromBody] User user)
    {
        if (GetCurretUser().Username == user.Username)
        {
            
            var existingUser = _context.Users.FirstOrDefault(u => u.Username == user.Username);
            if (existingUser == null)
            {
                return BadRequest("User doesn't exist");
            }

            existingUser.Username = user.Username;
            existingUser.Email = user.Email;
            existingUser.Password = user.Password;
            existingUser.Role = user.Role;
            existingUser.Job = user.Job;
            existingUser.Phone = user.Phone;
            existingUser.PhotoBytes = user.PhotoBytes;

            _context.Users.Update(existingUser);
            _context.SaveChanges();

            return Ok("User was updated succesfully");
        }

        return Forbid("You are not allowed");
    }

    [Authorize]
    [HttpGet("currentUser")]
    public IActionResult getCurrentUser()
    {
        User cu = GetCurretUser();
        return Ok(cu.Username + cu.Role);
    }
    
    
    [Authorize]
    [HttpGet("cu")]
    public IActionResult getCu()
    {
        var currentUser = GetCurretUser();
        var userdb = _context.Users.Where(user => user.Username == currentUser.Username).FirstOrDefault();
        return Ok(userdb);
    }

    [Authorize]
    [HttpGet("cuPhoto")]
    public IActionResult getCuPhoto()
    {
        var user = GetCurretUser();
        var userdb = _context.Users.Where(u => u.Username == user.Username).FirstOrDefault();
        return Ok(userdb.PhotoBytes);
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
                    Password = userClaims.FirstOrDefault(o => o.Type == "password")?.Value,
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

    [Authorize]
    [HttpGet("/getAllConv")]
    public IEnumerable<Conversation> getAllTheConvOfTheCurrentUser()
    {
        var currentUser = GetCurretUser();
        var conversations = _context.Conversations.Where(c => c.OwnerUsername == currentUser.Username);
        return conversations;
    }

    [Authorize]
    [HttpPost("getDetailsUser")]
    public IActionResult getUserDestinationDetails([FromBody]  ConversationController.UsernameRequest request)
    {
        var username = request.Username;
        var userDest = _context.Users.Where(user => user.Username == username).FirstOrDefault();
        UserDetails userDetails = new UserDetails
        {
            Username = userDest.Username,
            Email = userDest.Email,
            Job = userDest.Job,
            Phone = userDest.Phone,
            PhotoBytes = userDest.PhotoBytes
        };
        return Ok(userDetails);
    }

}