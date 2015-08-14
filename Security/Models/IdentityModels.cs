using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using AspNet.Identity.RavenDB.Entities;
using Microsoft.AspNet.Identity.Owin;
using Dade.Security.Models;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace Dade_ContentSecurity.Models
{
    
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : RavenUser
    {
        //public System.Collections.Generic.List<Role> Roles{ get; set;}
        //public string Email { get; set; }

        public ApplicationUser(string userName, string email):base(userName,email)
        {

        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {
            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }
    }

}