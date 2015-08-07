using DevKit.AspNet.Identity.Raven;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DevKit.AspNet.Identity.Raven
{
    public class ManagableUserInfo
    {
        public ManagableUserInfo()
        {
            Roles = new List<string>();
            Claims = new List<IdentityUserClaim>();
            Logins = new List<UserLoginInfo>();
        }

        public virtual string Id { get; set; }
        public virtual string UserName { get; set; }
        public virtual string DisplayName { get; set; }
        public virtual string Email { get; set; }
        public virtual bool EmailConfirmed { get; set; }
        public virtual string Phone { get; set; }
        public virtual bool PhoneConfirmed { get; set; }

        public bool LockoutEnabled { get; set; }

        public virtual List<string> Roles { get; set; }
        public virtual List<IdentityUserClaim> Claims { get; set; }
        public virtual List<UserLoginInfo> Logins { get; set; }

        public DateTime CreatedTime { get; set; }

        public bool Disabled { get; set; }

    }
}