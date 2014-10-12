using Breeze.ContextProvider;
using Breeze.WebApi2;
using CollabBrd.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace CollabBrd.Controllers
{
    [BreezeController]
    //[Authorize]
    public class CollabBrdController : ApiController
    {
        CollabBrdRepository _repository = new CollabBrdRepository();

        [HttpGet]
        public string Metadata()
        {
            return _repository.Metadata;
        }

        [HttpGet]
        public IQueryable<Project> Projects()
        {
            return _repository.Projects;
        }

        [HttpGet]
        public IQueryable<Scene> Scenes()
        {
            return _repository.Scenes;
        }

        [HttpGet]
        public Profile CurrentUser()
        {
            return _repository.GetUserProfile();
        }

        [HttpGet]
        public IQueryable<Profile> Profiles()
        {
            return Queryable.AsQueryable(_repository.Profiles);
        }
        [HttpGet]
        public IQueryable<Project> UserProjects()
        {
            return _repository.GetUserProjects();
        }

        [HttpGet]
        public IQueryable<Scene> UserScenes([FromUri] int id)
        {
            var project = _repository.GetUserProjects().FirstOrDefault(p => p.Id == id);
            if (project != null)
            {
                return project.Scenes.AsQueryable();
            }
            throw new Exception(String.Format("No Project with Id = {0} exists.", id));
        }

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _repository.SaveChanges(saveBundle);
        }
    }
}
