using Raven.Client.Indexes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevKit.AspNet.Identity.Raven
{
    public class Idx_UserByExternalLogin<TUser> : AbstractIndexCreationTask<TUser> where TUser: IdentityUser
    {
        public Idx_UserByExternalLogin()
        {
            Map = users => from u in users
                           select new
                                      {
                                          _ = u.Logins
                                             .Select(login =>
                                                 CreateField(login.LoginProvider, login.ProviderKey, false, true))
                                      };
        }

    }
}
