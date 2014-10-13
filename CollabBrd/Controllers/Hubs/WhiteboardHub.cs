using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace CollabBrd.Controllers.Hubs
{
    public class WhiteboardHub : Hub
    {
        public void SyncWhiteboard(string roomName, string name, string sceneJSON)
        {
            roomName = "whiteboard:" + roomName;
            Clients.OthersInGroup(roomName).syncWhiteboard(name, sceneJSON);
        }

        public Task JoinWhiteboard(string roomName)
        {
            roomName = "whiteboard:" + roomName;
            return Groups.Add(Context.ConnectionId, roomName);
        }

        public Task LeaveWhiteboard(string roomName)
        {
            roomName = "whiteboard:" + roomName;
            return Groups.Remove(Context.ConnectionId, roomName);
        }
    }
}