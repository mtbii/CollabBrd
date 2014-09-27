using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.Identity;
using CollabBrd.Models;

namespace CollabBrd.Models
{
    public class CollabBrdRepository
    {
        private readonly EFContextProvider<ApplicationDbContext>
            _contextProvider = new EFContextProvider<ApplicationDbContext>();

        private ApplicationDbContext Context { get { return _contextProvider.Context; } }

        public string Metadata
        {
            get { return _contextProvider.Metadata(); }
        }

        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }

        public IQueryable<Project> Projects
        {
            get { return Context.Projects; }
        }

        public IQueryable<Scene> Scenes
        {
            get { return Context.Scenes; }
        }

        public IQueryable<Project> GetUserProjects()
        {
            string id = HttpContext.Current.User.Identity.GetUserId();

            if (string.IsNullOrEmpty(id))
            {
                throw new Exception("No user is logged in");
            }
            return Context.Projects.Where(p => p.OwnerId == id);
        }

        public IQueryable<Profile> Profiles
        {
            get { return Context.Users.Select(u => Profile.FromApplicationUser(u)); }
        }

        public Profile GetUserProfile()
        {
            string id = HttpContext.Current.User.Identity.GetUserId();
            return Profiles.FirstOrDefault(p => p.Id == id);
        }
    }
}