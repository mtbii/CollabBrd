using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace CollabBrd.Controllers.Hubs
{
    public class ChatHub : Hub
    {
        public void Send(string name, string message, string roomName)
        {
            if (string.IsNullOrEmpty(roomName))
            {
                Clients.Group("chat:World").addNewMessageToPage(name, message);
            }
            else
            {
                roomName = "chat:" + roomName;
                Clients.Group(roomName).addNewMessageToPage(name, message);
            }
        }

        public async Task JoinRoom(string roomName)
        {
            roomName = "chat:" + roomName;
            await Groups.Add(Context.ConnectionId, roomName);
            Clients.Group(roomName).addNewMessageToPage(roomName, Context.User.Identity.Name + " joined.");
        }

        public async Task LeaveRoom(string roomName)
        {
            roomName = "chat:" + roomName;
            await Groups.Remove(Context.ConnectionId, roomName);
            Clients.Group(roomName).addNewMessageToPage(roomName, Context.User.Identity.Name + " has left the room.");
        }
    }
}