using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace CollabBrd.Models
{
    //Use Profile as ViewModel for ApplicationUser (hides sensitive data)
    public class Profile
    {
        public Profile()
        {
            CreateDate = DateTime.Now;
        }

        public Profile(ApplicationUser user)
        {
            if (user != null)
            {
                this.Id = user.Id;
                this.DisplayName = user.UserName;
                this.LastLogin = user.LastActivityDate;
                this.CreateDate = user.CreateDate;
                this.Projects = user.Projects;
            }
        }

        public string Id { get; set; }

        [Display(Name = "Display Name")]
        public string DisplayName { get; set; }

        public virtual ICollection<Project> Projects { get; set; }

        [Display(Name = "Last Active Date")]
        public DateTime LastLogin { get; set; }

        [Display(Name = "Created On")]
        public DateTime CreateDate { get; set; }

        public static Profile FromApplicationUser(ApplicationUser u)
        {
            return new Profile(u);
        }
    }
}