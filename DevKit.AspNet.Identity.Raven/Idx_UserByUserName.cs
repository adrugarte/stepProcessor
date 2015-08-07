using Raven.Client.Indexes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevKit.AspNet.Identity.Raven
{
    public class Idx_UserByUserName<TUser>: AbstractIndexCreationTask<TUser> where TUser: IdentityUser
    {
        public Idx_UserByUserName()
        {
            Map = users => users.Select(user => new { 
                user.UserName, 
                user.Phone, 
                user.Email 
            });
        }
    }
}
