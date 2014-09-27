using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace CollabBrd.Models
{
    public class Scene
    {
        public Scene()
        {
            CreateDate = DateTime.Now;
            ModifyDate = DateTime.Now;
        }

        [Key]
        public long Id { get; set; }
        public string Name { get; set; }

        public DateTime CreateDate { get; set; }
        public DateTime ModifyDate { get; set; }

        [ForeignKey("Project")]
        public long ProjectId { get; set; }
        public virtual Project Project { get; set; }

        public string SceneJSON { get; set; }
    }
}