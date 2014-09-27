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

        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _repository.SaveChanges(saveBundle);
        }
    }
}
