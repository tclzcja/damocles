using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace Api.Models
{
    [Table("DamoclesUser")]
    public class UserModel
    {
        [Key]
        public string ID { get; set; }
        [ForeignKey("ID")]
        public IdentityUser AspNetUser { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Password { get; set; } // Transmitting Only!
        public string Password2 { get; set; } // Transmitting Only!

        public List<TaskModel> Tasks { get; set; }
    }
}