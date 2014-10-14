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

        public async Task JoinRoom(string roomName, string userName)
        {
            if (string.IsNullOrEmpty(userName))
            {
                userName = Context.User.Identity.Name;
            }

            roomName = "chat:" + roomName;
            await Groups.Add(Context.ConnectionId, roomName);
            Clients.Group(roomName).addNewMessageToPage(roomName, userName + " joined.");
        }

        public async Task LeaveRoom(string roomName, string userName)
        {
            if (string.IsNullOrEmpty(userName))
            {
                userName = Context.User.Identity.Name;
            }

            roomName = "chat:" + roomName;
            await Groups.Remove(Context.ConnectionId, roomName);
            Clients.Group(roomName).addNewMessageToPage(roomName, userName + " has left the room.");
        }
    }
}