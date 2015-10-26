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
using System.Web;
using System.Web.Http.Results;
using System.IO;

namespace Api.Controllers
{
    [AllowAnonymous]
    public class AttachmentController : ApiController
    {
        //private const string StoragePath = "C:\\Users\\Jingan Chen\\SkyDrive\\Projects\\Riot Games\\Damocles\\Projects\\Storage\\";
        private const string StoragePath = "G:\\PleskVhosts\\tale.land\\projects\\damocles.tale.land\\storage\\";
        private AppDbContext DB;

        [HttpPost]
        [Route("api/attachment/upload")]
        public async Task<JsonResult<AttachmentModel>> Upload()
        {
            try
            {
                DB = new AppDbContext();

                var File = HttpContext.Current.Request.Files[0];

                var ID = HttpContext.Current.Request.Form["ID"];

                var A = await DB.AttachmentSet.SingleAsync(a => a.ID == ID);

                A.Extension = File.FileName.Substring(File.FileName.LastIndexOf(".") + 1);
                A.Status = AttachmentStatusType.Uploaded;

                File.SaveAs(StoragePath + A.ID + "." + A.Extension);

                await DB.SaveChangesAsync();

                return Json(A, new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
            }
            catch (Exception e)
            {
                return Json(new AttachmentModel() { Name = e.Message });
            }
        }

        [HttpPost]
        [Route("api/attachment/multiple")]
        public async Task<JsonResult<List<AttachmentModel>>> Multiple([FromBody]AttachmentModel value)
        {
            DB = new AppDbContext();

            var UserID = value.Task.Users[0].ID;

            var result = await DB.AttachmentSet.Where(a => (UserID == "" || a.Task.Users.Any(u => u.ID == UserID)) && (value.Status == AttachmentStatusType.Any || a.Status == value.Status)).Include(a => a.Task).Include(a => a.Task.Project).ToListAsync();

            return Json(result, new JsonSerializerSettings() { ReferenceLoopHandling = ReferenceLoopHandling.Ignore });
        }

    }
}
