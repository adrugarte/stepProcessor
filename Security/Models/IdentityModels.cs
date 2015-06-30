using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using System.Data.Entity;
using Dade.Security.Models;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Dade_ContentSecurity.Models
{
    
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
    }

    public class AuthenticationContext : IdentityDbContext<ApplicationUser>
    {
        public AuthenticationContext()
            : base("AuthContext", throwIfV1Schema: false)
        {

            Database.SetInitializer<AuthenticationContext>(new AuthDBInitializer());
        }


        public DbSet<RefreshToken> RefreshTokens { get; set; }
        public DbSet<Client> Clients { get; set; }

        public static AuthenticationContext Create()
        {
            return new AuthenticationContext();
        }
    }

    public class AuthDBInitializer : DropCreateDatabaseIfModelChanges<AuthenticationContext>
    {
        private Client _client;
        private string jSonclient;
        public AuthDBInitializer()
        {
            jSonclient = System.Configuration.ConfigurationManager.AppSettings["Client"];
            try {
                _client = JsonConvert.DeserializeObject<Client>(@jSonclient);
                }
            catch (JsonException e){
                _client = null;
            }
            //_client = new Client {Id='', Name='', Active=true, ApplicationType=ApplicationTypes.JavaScript, RefreshTokenLifeTime=7200, AllowedOrigin="http://localhost:1386", Secret=""});
        }

        protected override void Seed(AuthenticationContext context)
        {
            base.Seed(context);

            context.Roles.Add(new IdentityRole { Id = "1", Name = "Admin" });
            context.Roles.Add(new IdentityRole { Id = "2", Name = "User" });
            if (_client != null) context.Clients.Add(_client);
        }
    }
}