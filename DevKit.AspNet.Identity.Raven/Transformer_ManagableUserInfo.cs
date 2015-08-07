using Raven.Client.Indexes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevKit.AspNet.Identity.Raven
{
    public class Transformer_ManagableUserInfo<TUser> : AbstractTransformerCreationTask<Idx_UserFreeTextSearch<TUser>.ReduceResult>  where TUser: IdentityUser
    {
        public Transformer_ManagableUserInfo()
        {
            TransformResults = reducedUsers => from reducedUser in reducedUsers
                                                let identityUser = LoadDocument<TUser>( reducedUser.Id)
                                                select new 
                                                {
                                                    identityUser.Id,
                                                    identityUser.UserName,
                                                    identityUser.DisplayName,
                                                    identityUser.Email,
                                                    identityUser.EmailConfirmed,
                                                    identityUser.Phone,
                                                    identityUser.PhoneConfirmed,
                                                    identityUser.Roles,
                                                    identityUser.Claims,
                                                    identityUser.Logins,
                                                };
        }
    }
}

