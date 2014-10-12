using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace CollabBrd.Models
{
    public class Project
    {
        public Project()
        {
            CreateDate = DateTime.Now;
            ModifyDate = DateTime.Now;
        }

        [Key]
        public long Id { get; set; }
        public string Name { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime ModifyDate { get; set; }
        public virtual ICollection<Scene> Scenes { get; set; }

        [ForeignKey("Owner")]
        public string OwnerId { get; set; }
        public virtual Profile Owner { get; set; }
    }
}