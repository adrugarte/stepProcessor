using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevKit.AspNet.Identity.Raven
{
    public interface IUserAppStore<TUser> where TUser : IdentityUser
    {
        Task AddUserAppClientAsync(UserAppClient userAppClient);

        Task RemoveUserAppClientAsync(UserAppClient userAppClient);

        Task<UserAppClient> FindUserAppClientByTokenAsync(string refreshToken);

        Task<UserAppClient> FindUserAppClientByClientIdAndUserAsync(string clientId, string userId);

        Task< IEnumerable<UserAppClient>> GetUserAppClientsAsync(string userId);
    }
}
