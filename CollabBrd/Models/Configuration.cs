using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity.ModelConfiguration;
using System.Linq;
using System.Web;

namespace CollabBrd.Models
{
    public class ProjectConfiguration : EntityTypeConfiguration<Project>
    {
        public ProjectConfiguration()
        {
            HasRequired(p => p.Owner)
                .WithMany(o => o.Projects)
                .HasForeignKey(p => p.OwnerId);
        }
    }

    public class SceneConfiguration : EntityTypeConfiguration<Scene>
    {
        public SceneConfiguration()
        {
            HasRequired(s => s.Project)
                .WithMany(p => p.Scenes)
                .HasForeignKey(s => s.ProjectId);
        }
    }

    public class ApplicationUserConfiguration : EntityTypeConfiguration<ApplicationUser>
    {
        public ApplicationUserConfiguration()
        {
            HasKey(u => u.Id);
        }
    }

    public class IdentityUserLoginConfiguration : EntityTypeConfiguration<IdentityUserLogin>
    {
        public IdentityUserLoginConfiguration()
        {
            HasKey(u => u.UserId);
        }
    }

    public class IdentityUserRoleConfiguration : EntityTypeConfiguration<IdentityUserRole>
    {
        public IdentityUserRoleConfiguration()
        {
            HasKey(u => u.RoleId);
        }
    }


}