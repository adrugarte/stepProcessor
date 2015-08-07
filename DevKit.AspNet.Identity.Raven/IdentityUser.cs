using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevKit.AspNet.Identity.Raven
{
    public class IdentityUser : ManagableUserInfo,  IUser
    {
       
        public virtual string PasswordHash { get; set; }
        public virtual string SecurityStamp { get; set; }

        public virtual string EmailVerificationCode { get; set; }
        public virtual DateTime EmailVerificationExpiration { get; set; }

        public virtual string PhoneVerificationCode { get; set; }
        public virtual DateTime PhoneVerficationExpiration { get; set; }

        public DateTime LockoutEndDateUtc { get; set; }

        public int FailedLoginAttempts { get; set; }

        public IdentityUser()
        {
            this.Claims = new List<IdentityUserClaim>();
            this.Roles = new List<string>();
            this.Logins = new List<UserLoginInfo>();
        }

        public IdentityUser(string userId, string userName)
            : this()
        {
            this.Id = userId;
            this.UserName = userName;
        }
    }

    public sealed class IdentityUserLogin
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string Provider { get; set; }
        public string ProviderKey { get; set; }
    }

    public class IdentityUserClaim
    {
        public virtual string ClaimType { get; set; }
        public virtual string ClaimValue { get; set; }
    }

}
