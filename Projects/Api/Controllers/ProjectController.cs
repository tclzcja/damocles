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
    [AllowAnonymous]
    public class ProjectController : ApiController
    {
        private AppDbContext DB;

        [HttpPost]
        [Route("api/project/multiple")]
        public async Task<JsonResult<List<SimpleModel>>> Multiple()
        {
            DB = new AppDbContext();

            var result = await DB.ProjectSet.Select(p => new SimpleModel() { ID = p.ID.ToString(), Name = p.Name }).OrderBy(p => p.Name).ToListAsync();

            return Json(result, new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        }

        [HttpPost]
        [Route("api/project/multiple/templatable")]
        public async Task<JsonResult<List<SimpleModel>>> MultipleThoseTemplatable()
        {
            DB = new AppDbContext();

            var result = await DB.ProjectSet.Where(p => p.Templatable == true).Select(p => new SimpleModel() { ID = p.ID.ToString(), Name = p.Name }).ToListAsync();

            return Json(result, new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        }

        [HttpPost]
        [Route("api/project/single")]
        public async Task<JsonResult<ProjectModel>> Single([FromBody]ProjectModel value)
        {
            DB = new AppDbContext();

            var result = await DB.ProjectSet.Include("Tasks.Attachments").Include("Tasks.Users").SingleAsync(p => p.ID == value.ID);

            result.Tasks.OrderBy(t => t.Index);

            return Json(result, new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        }

        [HttpPost]
        [Route("api/project/delete")]
        public async Task<HttpResponseMessage> Delete([FromBody]ProjectModel value)
        {

            DB = new AppDbContext();

            var P = await DB.ProjectSet.Include("Tasks").Include("Tasks.Attachments").SingleAsync(p => p.ID == value.ID);

            //Remove Current Tasks and Attachments, Tasks and Attachments already included above
            foreach (TaskModel T in P.Tasks)
            {
                DB.AttachmentSet.RemoveRange(T.Attachments);
            }
            DB.TaskSet.RemoveRange(P.Tasks);

            DB.ProjectSet.Remove(P);

            await DB.SaveChangesAsync();

            return new HttpResponseMessage(HttpStatusCode.OK);

        }

        [HttpPost]
        [Route("api/project/update")]
        public async Task<HttpResponseMessage> Update([FromBody]ProjectModel value)
        {

            DB = new AppDbContext();

            var P = await DB.ProjectSet.Include("Tasks").Include("Tasks.Attachments").SingleAsync(p => p.ID == value.ID);

            //P.ID = value.ID;
            P.Start = value.Start;
            P.End = value.End;
            P.Name = value.Name;
            P.Status = ProjectStatusType.Working;
            P.Templatable = value.Templatable;

            //Remove Current Tasks and Attachments, Tasks and Attachments already included above
            foreach (TaskModel T in P.Tasks)
            {
                DB.AttachmentSet.RemoveRange(T.Attachments);
            }
            DB.TaskSet.RemoveRange(P.Tasks);
            await DB.SaveChangesAsync();

            //Add new Tasks
            if (value.Tasks != null)
                foreach (TaskModel Tv in value.Tasks)
                {
                    var T = new TaskModel()
                    {
                        ID = Guid.NewGuid().ToString(),
                        Name = Tv.Name,
                        Start = Tv.Start,
                        End = Tv.End,
                        Index = Tv.Index,
                        Project = P,
                        ProjectID = P.ID,
                        Status = TaskStatusType.Incomplete,
                        Attachments = new List<AttachmentModel>(),
                        Users = new List<UserModel>()
                    };

                    DB.TaskSet.Add(T);

                    if (Tv.Users != null)
                        foreach (UserModel U in Tv.Users)
                        {
                            T.Users.Add(await DB.UserSet.SingleAsync(u => u.ID == U.ID));
                        }

                    if (Tv.Attachments != null)
                        foreach (AttachmentModel Av in Tv.Attachments)
                        {
                            var A = new AttachmentModel()
                            {
                                ID = Guid.NewGuid().ToString(),
                                Name = Av.Name,
                                Extension = "",
                                Status = AttachmentStatusType.Waiting,
                                Task = T,
                                TaskID = T.ID
                            };

                            DB.AttachmentSet.Add(A);
                        }

                }

            await DB.SaveChangesAsync();

            return new HttpResponseMessage(HttpStatusCode.OK);

        }

        [HttpPost]
        [Route("api/project/create")]
        public async Task<HttpResponseMessage> Create([FromBody]ProjectModel value)
        {
            DB = new AppDbContext();

            var P = new ProjectModel()
            {
                ID = Guid.NewGuid().ToString(),
                Start = value.Start,
                End = value.End,
                Name = value.Name,
                Status = ProjectStatusType.New,
                Templatable = value.Templatable,
                Tasks = new List<TaskModel>()
            };

            DB.ProjectSet.Add(P);

            if (value.Tasks != null)
                foreach (TaskModel Tv in value.Tasks)
                {
                    var T = new TaskModel()
                    {
                        ID = Guid.NewGuid().ToString(),
                        Name = Tv.Name,
                        Start = Tv.Start,
                        End = Tv.End,
                        Index = Tv.Index,
                        Project = P,
                        ProjectID = P.ID,
                        Status = TaskStatusType.Incomplete,
                        Attachments = new List<AttachmentModel>(),
                        Users = new List<UserModel>()
                    };

                    DB.TaskSet.Add(T);

                    if (Tv.Users != null)
                        foreach (UserModel U in Tv.Users)
                        {
                            T.Users.Add(await DB.UserSet.SingleAsync(u => u.ID == U.ID));
                        }

                    if (Tv.Attachments != null)
                        foreach (AttachmentModel Av in Tv.Attachments)
                        {
                            var A = new AttachmentModel()
                            {
                                ID = Guid.NewGuid().ToString(),
                                Name = Av.Name,
                                Extension = "",
                                Status = AttachmentStatusType.Waiting,
                                Task = T,
                                TaskID = T.ID
                            };

                            DB.AttachmentSet.Add(A);
                        }

                }

            await DB.SaveChangesAsync();

            return new HttpResponseMessage(HttpStatusCode.OK);
        }
    }
}
