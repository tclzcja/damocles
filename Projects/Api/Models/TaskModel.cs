using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    [Table("DamoclesTask")]
    public class TaskModel
    {
        [Key]
        public string ID { get; set; }
        public string Name { get; set; }
        public TaskStatusType Status { get; set; }
        public int Start { get; set; } // Start from Day 0
        public int End { get; set; }
        public int Index { get; set; }

        public string ProjectID { get; set; }
        [ForeignKey("ProjectID")]
        public ProjectModel Project { get; set; }

        public List<AttachmentModel> Attachments { get; set; }

        public List<UserModel> Users { get; set; }
    }
}