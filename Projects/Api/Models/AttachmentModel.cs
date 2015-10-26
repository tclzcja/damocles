using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api.Models
{
    [Table("DamoclesAttachment")]
    public class AttachmentModel
    {
        [Key]
        public string ID { get; set; }
        public string Name { get; set; }
        public string Extension { get; set; }
        public AttachmentStatusType Status { get; set; }

        public string TaskID { get; set; }
        [ForeignKey("TaskID")]
        public TaskModel Task { get; set; }
    }

}