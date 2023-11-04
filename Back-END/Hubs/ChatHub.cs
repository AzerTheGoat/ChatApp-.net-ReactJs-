using System.Security.Claims;
using ChatApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

public class ChatHub : Hub
{
    private readonly string _botUser;
    private readonly IDictionary<string, string> _connections;
    private readonly ApplicationDbContext _context;

    public ChatHub(IDictionary<string, string> connections, ApplicationDbContext applicationDbContext)
    {
        _context = applicationDbContext;
        _connections = connections;
        _botUser = "MyChat Bot";
    }
    

    public async Task SendMessage(string message, string receiverUsername)
    {
        var senderUsername = _connections[Context.ConnectionId];
        var receiverConnectionId = _connections.FirstOrDefault(x => x.Value == receiverUsername.ToLower()).Key;

        var senderUser = _context.Users.FirstOrDefault(user => user.Username == senderUsername);
        var receiverUser = _context.Users.FirstOrDefault(user => user.Username == receiverUsername);
        
        // Vérifier si une conversation existe déjà entre les deux utilisateurs
        var conversation = _context.Conversations
            .Include(c => c.Messages)
            .FirstOrDefault(c => (c.OwnerUsername.ToLower() == senderUser.Username.ToLower() && c.DestUsername.ToLower() == receiverUser.Username.ToLower()) || (c.OwnerUsername.ToLower() == receiverUser.Username.ToLower() && c.DestUsername.ToLower() == senderUser.Username.ToLower()));

        if (conversation == null)
        {
            // Créer une nouvelle conversation entre les deux utilisateurs
            conversation = new Conversation
            {
                OwnerUsername = senderUsername,
                DestUsername = receiverUsername,
                Messages = new List<Message>(),
                OwnerState = 0,
                DestState = 0
            };
            _context.Conversations.Add(conversation);
        }

        if (receiverUsername != conversation.OwnerUsername)
        {
            conversation.OwnerState = 1;
        }
        else
        {
            conversation.DestState = 1;
        }

        // Créer un nouveau message et l'ajouter à la conversation
        var messagee = new Message
        {
            Mess = message,
            ConversationId = conversation.Id,
            OwnerUsername = senderUsername,
            DestUsername = receiverUsername,
            DateTime = DateTime.Now,
        };
        var timeAgo = messagee.GetTimeAgo();
        messagee.timeago = timeAgo;
        _context.Messages.Add(messagee);
        conversation.Messages.Add(messagee);
            
        // Enregistrer les modifications dans la base de données
        await _context.SaveChangesAsync();




        if (receiverConnectionId != null)
        {
            await Clients.Client(receiverConnectionId).SendAsync("ReceiveMessage", senderUsername, message);
            await Clients.Caller.SendAsync("ReceiveMessage", senderUsername, message);
        }
        else
        {
            await Clients.Caller.SendAsync("ReceiveMessage", senderUsername.ToLower(), message);
        }
    }
    
    public async Task JoinRoom(string username)
    {
        var user = _context.Users.FirstOrDefault(u => u.Username.ToLower() == username.ToLower());

        if (user != null)
        {
            if (!_connections.ContainsKey(Context.ConnectionId))
            {
                _connections[Context.ConnectionId] = username.ToLower();
                await Clients.All.SendAsync("ReceiveMessage", _botUser, $"{username} has joined the application.");
            }
        }
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        _connections.Remove(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }


}