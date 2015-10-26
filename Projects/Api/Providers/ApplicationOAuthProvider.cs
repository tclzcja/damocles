using System;
using System.Data.Entity;
using System.Threading.Tasks;
using Api.Context;
using Microsoft.Owin.Security.OAuth;
using Api.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System.Security.Claims;
using Api;

namespace Api.Providers
{
    public class ApplicationAuthorizationServerProvider : OAuthAuthorizationServerProvider
    {
        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
            return base.ValidateClientAuthentication(context);
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

            var DB = new AppDbContext();
            var AUM = new AppUserManager(new UserStore<IdentityUser>(DB));
            var ARM = new AppRoleManager(new RoleStore<IdentityRole>(DB));

            var user = await AUM.FindAsync(context.UserName, context.Password);

            if (user == null)
            {
                context.SetError("invalid_grant", "The user name or password is incorrect.");
                return;
            }
            else
            {
                var identity = new ClaimsIdentity(context.Options.AuthenticationType);

                identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));

                identity.AddClaim(new Claim("ID", user.Id));
                identity.AddClaim(new Claim("Email", user.Email));

                context.Validated(identity);
            }

        }
    }
}