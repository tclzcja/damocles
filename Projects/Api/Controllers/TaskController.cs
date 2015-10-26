using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Web.Http;
using Api.Context;
using Api.Models;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Web.Http.Results;

namespace Api.Controllers
{
    public class TaskController : ApiController
    {
        private AppDbContext DB;

        [HttpPost]
        [Route("api/task/multiple")]
        public async Task<JsonResult<List<TaskModel>>> Multiple([FromBody]TaskModel value)
        {
            DB = new AppDbContext();

            var UID = value.Users[0].ID;

            var result = await DB.TaskSet.Where(t => (UID == "" || t.Users.Any(u => u.ID == UID)) && (value.Status == TaskStatusType.Any || t.Status == value.Status)).Include(t => t.Project).Include(t => t.Attachments).ToListAsync();

            return Json(result, new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        }

        [HttpPost]
        [Route("api/task/complete")]
        public async Task<HttpResponseMessage> Complete([FromBody]TaskModel value)
        {
            DB = new AppDbContext();

            var result = await DB.TaskSet.SingleAsync(t => t.ID == value.ID);

            result.Status = TaskStatusType.Completed;

            await DB.SaveChangesAsync();

            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}
