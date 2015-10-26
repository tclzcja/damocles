using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Management.Instrumentation;
using System.Threading.Tasks;
using System.Web.Http;
using Api.Context;
using Api.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Net.Http;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Web.Http.Results;
using System.Security.Claims;

namespace Api.Controllers
{
    public class UserController : ApiController
    {
        private AppDbContext DB;

        [HttpPost]
        [Route("api/user/multiple")]
        public async Task<JsonResult<List<SimpleModel>>> Multiple()
        {
            DB = new AppDbContext();

            var result = await DB.UserSet.Select(p => new SimpleModel() { ID = p.ID.ToString(), Name = p.Name }).ToListAsync();

            return Json(result, new Newtonsoft.Json.JsonSerializerSettings() { ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore });
        }

        [HttpPost]
        [Route("api/user/single")]
        public async Task<JsonResult<UserModel>> Single([FromBody]UserModel value)
        {
            DB = new AppDbContext();

            var result = await DB.UserSet.Include(u => u.AspNetUser).SingleAsync(p => p.ID == value.ID);

            return Json(result, new Newtonsoft.Json.JsonSerializerSettings() { ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore });
        }

        [Authorize]
        [HttpPost]
        [Route("api/user/single/email")]
        public async Task<JsonResult<UserModel>> SingleByEmail([FromBody]UserModel value)
        {
            DB = new AppDbContext();
            var AUM = new AppUserManager(new UserStore<IdentityUser>(DB));

            var CL = User.Identity as ClaimsIdentity;

            if (CL.HasClaim("Email", value.Email))
            {
                var user = await AUM.FindByEmailAsync(value.Email);

                var result = await DB.UserSet.SingleAsync(u => u.ID == user.Id);

                return Json(result, new Newtonsoft.Json.JsonSerializerSettings() { ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore });
            }
            else
            {
                return null;
            }
        }

        [HttpPost]
        [Route("api/user/create")]
        public async Task<HttpResponseMessage> Create([FromBody]UserModel value)
        {
            DB = new AppDbContext();

            var U = new IdentityUser()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = value.Email,
                Email = value.Email,
                EmailConfirmed = true
            };

            var AUM = new AppUserManager(new UserStore<IdentityUser>(DB));

            var UE = await AUM.FindByEmailAsync(U.Email);

            if (UE == null)
            {
                await AUM.CreateAsync(U, value.Password);

                UserModel P = new UserModel()
                {
                    ID = U.Id,
                    Name = value.Name,
                    Email = value.Email,
                    Role = value.Role,
                    AspNetUser = U,
                    Password = "",
                    Password2 = ""
                };

                DB.UserSet.Add(P);

                await DB.SaveChangesAsync();

                await AUM.AddToRoleAsync(U.Id, value.Role);

                return new HttpResponseMessage(HttpStatusCode.OK);
            }
            else
            {
                return new HttpResponseMessage(HttpStatusCode.Conflict);
            }
        }

        [HttpPost]
        [Route("api/user/update")]
        public async Task<HttpResponseMessage> Update([FromBody]UserModel value)
        {
            DB = new AppDbContext();
            var AUM = new AppUserManager(new UserStore<IdentityUser>(DB));

            var U = await DB.UserSet.SingleAsync(u => u.ID == value.ID);

            if (U == null)
            {
                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }
            else
            {
                U.Name = value.Name;
                U.Email = value.Email;
                U.Role = value.Role;
                U.AspNetUser = await AUM.FindByEmailAsync(U.Email);
                U.AspNetUser.UserName = value.Email;
                U.AspNetUser.Email = value.Email;
                await AUM.RemoveFromRoleAsync(U.ID, U.Role);
                await AUM.AddToRoleAsync(U.ID, value.Role);
                await DB.SaveChangesAsync();
                return new HttpResponseMessage(HttpStatusCode.OK);
            }
        }

        [HttpPost]
        [Route("api/user/changepassword")]
        public async Task<HttpResponseMessage> ChangePassword([FromBody]UserModel value)
        {
            DB = new AppDbContext();
            var AUM = new AppUserManager(new UserStore<IdentityUser>(DB));

            await AUM.ChangePasswordAsync(value.ID, value.Password, value.Password2);
            return new HttpResponseMessage(HttpStatusCode.OK);
        }

    }
}