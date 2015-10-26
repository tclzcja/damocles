using Api.Models;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration;
using System.Data.Entity.Validation;
using System.Linq;
using System.Web;

namespace Api.Context
{
    public class AppDbContext : IdentityDbContext<IdentityUser>
    {
        public DbSet<ProjectModel> ProjectSet { get; set; }
        public DbSet<AttachmentModel> AttachmentSet { get; set; }
        public DbSet<TaskModel> TaskSet { get; set; }
        public DbSet<UserModel> UserSet { get; set; }

        public AppDbContext() : base("DamoclesConnection") { }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskModel>()
                 .HasMany(o => o.Users)
                 .WithMany(a => a.Tasks)
                 .Map(oa =>
                 {
                     oa.MapLeftKey("TaskID");
                     oa.MapRightKey("UserID");
                     oa.ToTable("DamoclesTaskUser");
                 });
            base.OnModelCreating(modelBuilder);
        }

        public override System.Threading.Tasks.Task<int> SaveChangesAsync()
        {
            try
            {
                return base.SaveChangesAsync();
            }
            catch (DbEntityValidationException ex)
            {
                // Retrieve the error messages as a list of strings.
                var errorMessages = ex.EntityValidationErrors
                        .SelectMany(x => x.ValidationErrors)
                        .Select(x => x.ErrorMessage);

                // Join the list to a single string.
                var fullErrorMessage = string.Join("; ", errorMessages);

                // Combine the original exception message with the new one.
                var exceptionMessage = string.Concat(ex.Message, " The validation errors are: ", fullErrorMessage);

                // Throw a new DbEntityValidationException with the improved exception message.
                throw new DbEntityValidationException(exceptionMessage, ex.EntityValidationErrors);
            }
        }
    }

}