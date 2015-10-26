using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    [Table("DamoclesProject")]
    public class ProjectModel
    {
        [Key]
        public string ID { get; set; }
        public string Name { get; set; }
        public ProjectStatusType Status { get; set; }
        public System.DateTime Start { get; set; }
        public System.DateTime End { get; set; }
        public bool Templatable { get; set; }

        public List<TaskModel> Tasks { get; set; }
    }

}