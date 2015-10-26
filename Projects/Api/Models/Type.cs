using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Api.Models
{
    public enum AttachmentStatusType
    {
        Any = 0,
        Waiting = 1,
        Uploaded = 2
    }

    public enum ProjectStatusType
    {
        New = 0,
        Working = 1,
        Overtime = 2,
        Completed = 3
    }

    public enum TaskStatusType
    {
        Any = 0,
        Incomplete = 1,
        Completed = 2
    }
}