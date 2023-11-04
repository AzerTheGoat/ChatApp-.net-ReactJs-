using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using ChatApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ChatApp.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UserLoginController : ControllerBase
{
    
    private string hey = "Heyhey12*";
    private IConfiguration _config;
    private readonly ApplicationDbContext _context;
    public User currentUser;

    public UserLoginController(IConfiguration config, ApplicationDbContext context)
    {
        _config = config;
        _context = context;
    }
    
    
    
    [AllowAnonymous]
    [HttpPost]
    public IActionResult Login([FromBody] UserLogin userLogin)
    {
        var user = Authentificate(userLogin);

        if (user != null)
        {
            if (user.Role == "Admin")
            {
                var token = Generate(user);
                currentUser = user;
                return Ok(new
                {
                    token = token,
                    role = "admin"
                });
            }
            else
            {
                var token = Generate(user);
                currentUser = user;
                return Ok(new
                {
                    token = token,
                    role = "user"
                });
            }
        }

        return NotFound("User Not Found");
    }

    [Authorize]
    [HttpGet("getAllUsers")]
    public IActionResult getAllUsers()
    {
        var users = _context.Users.Include(user => user.Conversations);
        return Ok(users);
    }
    
    
    
    [AllowAnonymous]
    [HttpPost("admin")]
    public IActionResult LoginAdmin([FromBody] UserLogin userLogin)
    {
        var user = Authentificate(userLogin);
        if (user != null)
        {
            if (user.Role == "Admin")
            {
                Console.Write("ce user est un admin " + userLogin.Username);


                var token = Generate(user);
                currentUser = user;
                return Ok(token);
            }
        }

        return NotFound("User is Not Admin");
    }
    

    [HttpGet]
    [Authorize]
    public IActionResult GetCurrentUser()
    {
        var user = GetCurretUser();
        if (user is not null)
        {
            return Ok(user);
        }
        else
        {
            return NotFound();
        }
    }

    private string Generate(User user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        
        //ce que l'on va garder du user
        var claims = new[]
        {
            new Claim (ClaimTypes.NameIdentifier, user.Username), 
            new Claim (ClaimTypes. Email, user. Email),
            new Claim (ClaimTypes. Role, user.Role),
            new Claim("Job", user.Job),
            new Claim("password", user.Password),
            new Claim("Phone", user.Phone.ToString())
        };
        
        var token = new JwtSecurityToken(_config["Jwt:Issuer"], 
            _config["Jwt:Audience"], 
            claims,
            expires: DateTime.Now.AddMinutes(15),
            signingCredentials: credentials);


        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private User Authentificate(UserLogin userLogin)
    {
        var currentUser = _context.Users.FirstOrDefault(o =>
            o.Username.ToLower() == userLogin.Username.ToLower() && o.Password == userLogin.Password);
        if (currentUser != null)
        {
            return currentUser;
        }

        return null;
    }
    
    [AllowAnonymous]
    [HttpPost("signup1")]
    public IActionResult SignUp1([FromBody] User user)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Username.ToLower() == user.Username.ToLower());
        if (existingUser != null)
        {
            return BadRequest("Username already exists");
        }
        
        var tokenVerif = _context.tokenVerification.Where(token => token.username == user.Username).FirstOrDefault();
        if (tokenVerif == null)
        {
            var MailToken = GenerateToken();
            TokenVerfication tokenVerfication = new TokenVerfication
            {
                username = user.Username,
                token = MailToken
            };
            _context.tokenVerification.Add(tokenVerfication);
            _context.SaveChanges();
            sendMail(user.Email, "Email confirmation", "Hello!!!!!!, \nMerci de confirmer ton adresse mail en insérant ce token dans la rubrique adéquate sur l'application : " + MailToken);
        }
        else
        {
            sendMail(user.Email, "Email confirmation",
                "Hello!!!!!!, \nMerci de confirmer ton adresse mail en insérant ce token dans la rubrique adéquate sur l'application : " +
                tokenVerif.token);
        }



        var token = Generate(user);
        return Ok(token);
    }

    public class goodToken
    {
        public string username { get; set; }
        public string token { get; set; }
    }
    
    [AllowAnonymous]
    [HttpPost("isgoodtoken")]
    public IActionResult isItTheGoodToken([FromBody] goodToken goodToken)
    {
        var username = goodToken.username;
        var token = goodToken.token;

        if (_context.tokenVerification.Where(t => t.username == username).FirstOrDefault().token == token)
        {
            Console.WriteLine("Je retroune le ok tkt");
            return Ok();
        }
        
        return StatusCode(500, "pas le bon token");
    }


    [AllowAnonymous]
    [HttpPost("signup2")]
    public IActionResult SignUp2([FromBody] User user)
    {
        var existingUser = _context.Users.FirstOrDefault(u => u.Username.ToLower() == user.Username.ToLower());
        if (existingUser != null)
        {
            return BadRequest("Username already exists");
        }

        _context.Users.Add(user);
        _context.SaveChanges();
        sendMail(user.Email, "Welcome to MyChat",
            "Hello!!!!!!, \nMerci d'avoir créé un compte a myChat application, amuse toi bien");

        var token = Generate(user);
        return Ok(token);
    
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
    
    
    
    public IActionResult sendMail(string recipients, string subject, string body)
    {
        try
        {
            var smtpClient = new SmtpClient("smtp-mail.outlook.com")
            {
                Port = 587,
                Credentials = new NetworkCredential("hamzaazeroual2024@outlook.com", hey),
                EnableSsl = true
            };
            smtpClient.Send("hamzaazeroual2024@outlook.com", recipients, subject, body);
            return Ok("Mail bien envoyé");
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return StatusCode(500, "Erreur lors de l'envoi du mail");
        }
    }


    public class formDatau
    {
        public string Username { get; set; }
        public string Photo { get; set; }
    }
    
    [HttpPost("upload")]
    public async Task<IActionResult> Upload([FromBody]formDatau foremData)
    {
        string photo = foremData.Photo;
        string username = foremData.Username;
        if (photo != null)
        {
            var ftpHost = "192.168.1.198";
            var ftpUser = "ftpuser";
            var ftpPassword = "demo";
            var ftpDirectory = "/files";

            var photoPath = Path.Combine(ftpDirectory, username);
            var ftpUri = new Uri($"ftp://{ftpHost}{photoPath}");
            Console.WriteLine(ftpUri);
            try
            {
                var request = (FtpWebRequest)WebRequest.Create(ftpUri);
                request.Method = WebRequestMethods.Ftp.UploadFile;
                request.Credentials = new NetworkCredential(ftpUser, ftpPassword);

                using (var requestStream = request.GetRequestStream())
                {
                    byte[] fileContents = Encoding.UTF8.GetBytes(photo);
                    await requestStream.WriteAsync(fileContents, 0, fileContents.Length);
                }

                using (var response = (FtpWebResponse)request.GetResponse())
                {
                    Console.WriteLine($"Upload complete, status: {response.StatusDescription}");
                }

                return Ok($"ftp://{ftpHost}{photoPath}");
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine(ex);
                return StatusCode(StatusCodes.Status500InternalServerError, "Error uploading photo to FTP server");
            }
        }
        else
        {        
            return Forbid("Photo null");
        }
    }
    
    [HttpGet("{fileName}")]
    public async Task<IActionResult> Get(string fileName)
    {
        var ftpHost = "192.168.1.198";
        var ftpUser = "ftpuser";
        var ftpPassword = "demo";
        var ftpDirectory = "/files";

        var filePath = Path.Combine(ftpDirectory, fileName);
        var ftpUri = new Uri($"ftp://{ftpHost}{filePath}");

        try
        {
            var request = (FtpWebRequest)WebRequest.Create(ftpUri);
            request.Method = WebRequestMethods.Ftp.DownloadFile;
            request.Credentials = new NetworkCredential(ftpUser, ftpPassword);

            using (var response = (FtpWebResponse)request.GetResponse())
            using (var responseStream = response.GetResponseStream())
            {
                Console.WriteLine($"Download complete, status: {response.StatusDescription}");

                // Read the response stream as text
                using (var reader = new StreamReader(responseStream))
                {
                    var text = await reader.ReadToEndAsync();
                    return Content(text, "text/plain");
                }
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(ex);
            return StatusCode(StatusCodes.Status500InternalServerError, "Error downloading file from FTP server");
        }
    }


    
    
    public static string GenerateToken()
    {
        int month = DateTime.Now.Month;
        int day = DateTime.Now.Day;
        int minute = DateTime.Now.Minute;
        int seconde = DateTime.Now.Second;
        int millisecond= DateTime.Now.Millisecond;
        string token = (((millisecond*3500)+day * 100 + month) * 700 + day * 13).ToString();
        return token;
    }
    
}