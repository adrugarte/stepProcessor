using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
//using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.OAuth;
using Dade.Security.Models;
using Dade_ContentSecurity.Helpers;
using Dade_ContentSecurity.Models;
using Newtonsoft.Json;
//using RavenDB.AspNet.Identity;

namespace Dade_ContentSecurity.Providers
{
    public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    {
        Dictionary<string, string> Properties = new Dictionary<string, string>();

        public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {

            string clientId = string.Empty;
            string clientSecret = string.Empty;
            Client client = null;

            if (!context.TryGetBasicCredentials(out clientId, out clientSecret))
            {
                context.TryGetFormCredentials(out clientId, out clientSecret);
            }

            if (context.ClientId == null)
            {
                //Remove the comments from the below line context.SetError, and invalidate context 
                //if you want to force sending clientId/secrects once obtain access tokens. 
                context.Validated();
                //context.SetError("invalid_clientId", "ClientId should be sent.");
                return Task.FromResult<object>(null);
            }

            using (AuthRepository _repo = new AuthRepository())
            {
                client = _repo.FindClient(context.ClientId);
            }

            if (client == null)
            {
                context.SetError("invalid_clientId", string.Format("Client '{0}' is not registered in the system.", context.ClientId));
                return Task.FromResult<object>(null);
            }

            if (client.ApplicationType == ApplicationTypes.NativeConfidential)
            {
                if (string.IsNullOrWhiteSpace(clientSecret))
                {
                    context.SetError("invalid_clientId", "Client secret should be sent.");
                    return Task.FromResult<object>(null);
                }
                else
                {
                    if (client.Secret != Helper.GetHash(clientSecret))
                    {
                        context.SetError("invalid_clientId", "Client secret is invalid.");
                        return Task.FromResult<object>(null);
                    }
                }
            }

            if (!client.Active)
            {
                context.SetError("invalid_clientId", "Client is inactive.");
                return Task.FromResult<object>(null);
            }

            context.OwinContext.Set<string>("as:clientAllowedOrigin", client.AllowedOrigin);
            context.OwinContext.Set<string>("as:clientRefreshTokenLifeTime", client.RefreshTokenLifeTime.ToString());
            var rt = "";
            if (context.Parameters["refresh_token"] != null) rt = Helper.GetHash(context.Parameters["refresh_token"]);
            context.Validated();
            return Task.FromResult<object>(null);
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            var allowedOrigin = context.OwinContext.Get<string>("as:clientAllowedOrigin");
            if (allowedOrigin == null) allowedOrigin = "*";
            context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { allowedOrigin });

            IEnumerable<Role> roles;
            ApplicationUser user;
            using (AuthRepository _repo = new AuthRepository())
            {
                user = await _repo.FindUser(context.UserName, context.Password);

                if (user == null)
                {
                    context.SetError("invalid_grant", "The user name or password is incorrect.");
                    return;
                }

                //User roles
                roles = (IEnumerable<Role>)_repo.GetRoles(user.Id);
            }

            //if (roles != null) setJson(roles);



            var identity = new ClaimsIdentity(context.Options.AuthenticationType);
            identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, user.Id));

            //Add user roles as Identity claim
            //foreach (Role role in user.Roles)
            //{
            //    identity.AddClaim(new Claim(ClaimTypes.Role, role.id));
            //};


            string jsonroles = JsonConvert.SerializeObject(roles, Formatting.None);

            var props = new AuthenticationProperties(new Dictionary<string, string> { });
            props.Dictionary.Add("as:client_id", (context.ClientId == null) ? string.Empty : context.ClientId);
            props.Dictionary.Add("userName", context.UserName);
            props.Dictionary.Add("roles", jsonroles);
            props.Dictionary.Add("userId", user.Id);

            var ticket = new AuthenticationTicket(identity, props);
            context.Validated(ticket);
        }


        public override Task GrantRefreshToken(OAuthGrantRefreshTokenContext context)
        {
            var originalClient = context.Ticket.Properties.Dictionary["as:client_id"];
            var currentClient = context.ClientId;
            IEnumerable<Role> roles;

            if (originalClient != currentClient)
            {
                context.SetError("invalid_clientId", "Refresh token is issued to a different clientId.");
                return Task.FromResult<object>(null);
            }

            using (AuthRepository _repo = new AuthRepository())
            {
                roles = (IEnumerable<Role>)_repo.GetRoles(context.Ticket.Properties.Dictionary["userId"]);
            }

            // Change auth ticket for refresh token requests
            var newIdentity = new ClaimsIdentity(context.Ticket.Identity);

            //Upgrade roles according to Database info
            AuthenticationProperties props = context.Ticket.Properties;
            if (props.Dictionary.ContainsKey("roles")) props.Dictionary.Remove("roles");
            string jsonroles = JsonConvert.SerializeObject(roles, Formatting.None);
            props.Dictionary.Add("roles", jsonroles);

            var newTicket = new AuthenticationTicket(newIdentity, props);
            context.Validated(newTicket);

            return Task.FromResult<object>(null);
        }



        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            try
            {
                foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
                {
                    context.AdditionalResponseParameters.Add(property.Key, property.Value);
                }
            }
            catch (Exception e)
            {
                var s = e.Message;
            }
            return Task.FromResult<object>(null);
        }


        private void setJson(IEnumerable<Role> roles)
        {
            string[] arrayRoles = new string[roles.Count()];
            var i = 0;
            foreach (var role in roles)
            {
                arrayRoles[i] = role.name;
                i++;
            }

        }

        public static AuthenticationProperties CreateProperties(string userName)
        {
            IDictionary<string, string> data = new Dictionary<string, string>
                {
                    { "userName", userName }
                };
            return new AuthenticationProperties(data);
        }


    }



    //public class ApplicationOAuthProvider : OAuthAuthorizationServerProvider
    //{
    //    private readonly string _publicClientId;

    //    public ApplicationOAuthProvider(string publicClientId)
    //    {
    //        if (publicClientId == null)
    //        {
    //            throw new ArgumentNullException("publicClientId");
    //        }

    //        _publicClientId = publicClientId;
    //    }

    //    public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
    //    {
    //        var userManager = context.OwinContext.GetUserManager<ApplicationUserManager>();

    //        ApplicationUser user = await userManager.FindAsync(context.UserName, context.Password);

    //        if (user == null)
    //        {
    //            context.SetError("invalid_grant", "The user name or password is incorrect.");
    //            return;
    //        }

    //        ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(userManager,
    //           OAuthDefaults.AuthenticationType);
    //        ClaimsIdentity cookiesIdentity = await user.GenerateUserIdentityAsync(userManager,
    //            CookieAuthenticationDefaults.AuthenticationType);

    //        AuthenticationProperties properties = CreateProperties(user.UserName);
    //        AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
    //        context.Validated(ticket);
    //        context.Request.Context.Authentication.SignIn(cookiesIdentity);
    //    }

    //    public override Task TokenEndpoint(OAuthTokenEndpointContext context)
    //    {
    //        foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
    //        {
    //            context.AdditionalResponseParameters.Add(property.Key, property.Value);
    //        }

    //        return Task.FromResult<object>(null);
    //    }

    //    public override Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
    //    {
    //        // Resource owner password credentials does not provide a client ID.
    //        if (context.ClientId == null)
    //        {
    //            context.Validated();
    //        }

    //        return Task.FromResult<object>(null);
    //    }

    //    public override Task ValidateClientRedirectUri(OAuthValidateClientRedirectUriContext context)
    //    {
    //        if (context.ClientId == _publicClientId)
    //        {
    //            Uri expectedRootUri = new Uri(context.Request.Uri, "/");

    //            if (expectedRootUri.AbsoluteUri == context.RedirectUri)
    //            {
    //                context.Validated();
    //            }
    //        }

    //        return Task.FromResult<object>(null);
    //    }

    //    public static AuthenticationProperties CreateProperties(string userName)
    //    {
    //        IDictionary<string, string> data = new Dictionary<string, string>
    //        {
    //            { "userName", userName }
    //        };
    //        return new AuthenticationProperties(data);
    //    }
    //}
}