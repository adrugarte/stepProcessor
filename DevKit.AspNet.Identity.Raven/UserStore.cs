using Microsoft.AspNet.Identity;
using Raven.Client;
using Raven.Client.Document;
using Raven.Client.Indexes;
using Raven.Imports.Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace DevKit.AspNet.Identity.Raven
{
    public class UserStore<TUser> : IUserStore<TUser>, IUserLoginStore<TUser>, IUserClaimStore<TUser>, IUserRoleStore<TUser>,
       IUserPasswordStore<TUser>, IUserSecurityStampStore<TUser>, IUserEmailStore<TUser>, 
       IUserPhoneNumberStore<TUser>,IUserLockoutStore<TUser, string>, IQueryableUserStore<TUser>,
       IUserAppStore<TUser>
       where TUser : IdentityUser
    {
        private bool _disposed;
        private Func<IDocumentSession> getSessionFunc;
        private IDocumentSession _session;

        static DocumentStore docStore;

        public IDocumentSession Session
        {
            get
            {
                if (_session == null)
                {
                    _session = getSessionFunc();
                    _session.Advanced.DocumentStore.Conventions.RegisterIdConvention<IdentityUser>((dbname, commands, user) => "IdentityUsers/" + user.Id);
                    
                }
                return _session;
            }
        }


      
        public static void ConfigureUserStore( string connectionString, string dbName = "AspNetIdentity")
        {
          
            if (docStore == null)
            {
                string[] vs = connectionString.Split(new char[] { ';' });

                Dictionary<string, string> properties = new Dictionary<string, string>();
                foreach (var se in vs)
                {
                    var keyvalue = se.Split(new char[] { '=' });
                    properties.Add(keyvalue[0], keyvalue[1]);

                }
                string json = JsonConvert.SerializeObject(properties);
                docStore = JsonConvert.DeserializeObject<DocumentStore>(json);

                docStore.Initialize();
            }


            RegisterIndexes();

        }

        private static void RegisterIndexes()
        {
            docStore.ExecuteIndex(new Idx_UserByExternalLogin<TUser>());
            docStore.ExecuteIndex(new Idx_UserByUserName<TUser>());
            docStore.ExecuteIndex(new Idx_UserFreeTextSearch<TUser>());
        }

        public static UserStore<TUser> Create()
        {
            return new UserStore<TUser>();
        }

        private UserStore()
        {
            getSessionFunc = () => { 
                var session = docStore.OpenSession();
                session.Advanced.UseOptimisticConcurrency = true;
                return session;
            };
        }

        

        public Task CreateAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");
            if (string.IsNullOrEmpty(user.Id))
                user.Id = Guid.NewGuid().ToString("N");
            if (string.IsNullOrEmpty(user.Email))
                throw new InvalidOperationException("user.Email property must be specified before calling CreateAsync");

            user.CreatedTime = DateTime.UtcNow;
            
            this.Session.Store( (IdentityUser)  user);
            Session.SaveChanges();
            return Task.FromResult(true);
        }


        public Task DeleteAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            this.Session.Delete(user);
            Session.SaveChanges();
            return Task.FromResult(true);
        }

        public Task<TUser> FindByIdAsync(string userId)
        {
            var user = this.Session.Load<TUser>(userId);
            return Task.FromResult(user);
        }

        public Task<TUser> FindByNameAsync(string userName)
        {
            //var u = this.Session.Query<TUser, Idx_UserByUserName<TUser>>().FirstOrDefault(user => (user.UserName == userName || user.Email == userName || user.Phone == userName));
            var u = this.Session.Query<TUser>("Idx/UserByUserName" ).FirstOrDefault(user => (user.UserName == userName || user.Email == userName || user.Phone == userName));
            return Task.FromResult(u);
        }

        public Task UpdateAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            Session.SaveChanges();

            return Task.FromResult(true);
        }

        private void ThrowIfDisposed()
        {
            if (this._disposed)
                throw new ObjectDisposedException(this.GetType().Name);
        }

        public void Dispose()
        {
            this._disposed = true;
        }

        public Task AddLoginAsync(TUser user, UserLoginInfo login)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            if (!user.Logins.Any(x => x.LoginProvider == login.LoginProvider && x.ProviderKey == login.ProviderKey))
            {
                user.Logins.Add(login);
            }

            Session.SaveChanges();
            return Task.FromResult(true);
        }

        public Task<TUser> FindAsync(UserLoginInfo login)
        {
            var result = Session.Advanced.LuceneQuery<TUser, Idx_UserByExternalLogin<TUser>>()
                .WhereEquals(login.LoginProvider, login.ProviderKey).FirstOrDefault();

            return Task.FromResult(result);
        }

        public Task<IList<UserLoginInfo>> GetLoginsAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            return Task.FromResult(user.Logins.ToIList());
        }

        public Task RemoveLoginAsync(TUser user, UserLoginInfo login)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            user.Logins.RemoveAll(x => x.LoginProvider == login.LoginProvider && x.ProviderKey == login.ProviderKey);

            Session.SaveChanges();

            return Task.FromResult(0);
        }

        public Task AddClaimAsync(TUser user, Claim claim)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            if (!user.Claims.Any(x => x.ClaimType == claim.Type && x.ClaimValue == claim.Value))
            {
                user.Claims.Add(new IdentityUserClaim
                {
                    ClaimType = claim.Type,
                    ClaimValue = claim.Value
                });
            }
            Session.SaveChanges();
            return Task.FromResult(0);
        }

        public Task<IList<Claim>> GetClaimsAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");
            if (user.Claims == null)
            {
                return Task.FromResult<IList<Claim>>(new List<Claim>());
            }
            else
            {
                IList<Claim> result = user.Claims.Select(c => new Claim(c.ClaimType, c.ClaimValue)).ToList();
                return Task.FromResult(result);
            }
        }

        public Task RemoveClaimAsync(TUser user, Claim claim)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            user.Claims.RemoveAll(x => x.ClaimType == claim.Type && x.ClaimValue == claim.Value);
            Session.SaveChanges();
            return Task.FromResult(0);
        }

        public Task<string> GetPasswordHashAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            return Task.FromResult(user.PasswordHash);
        }

        public Task<bool> HasPasswordAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            return Task.FromResult<bool>(user.PasswordHash != null);
        }

        public Task SetPasswordHashAsync(TUser user, string passwordHash)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            user.PasswordHash = passwordHash;
            return Task.FromResult(0);
        }

        public Task<string> GetSecurityStampAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            return Task.FromResult(user.SecurityStamp);
        }

        public Task SetSecurityStampAsync(TUser user, string stamp)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            user.SecurityStamp = stamp;
            return Task.FromResult(0);
        }

        public Task AddToRoleAsync(TUser user, string role)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            if (!user.Roles.Contains(role, StringComparer.InvariantCultureIgnoreCase))
                user.Roles.Add(role);

            return Task.FromResult(0);
        }

        public Task<IList<string>> GetRolesAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            return Task.FromResult<IList<string>>(user.Roles);
        }

        public Task<bool> IsInRoleAsync(TUser user, string role)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            return Task.FromResult(user.Roles.Contains(role, StringComparer.InvariantCultureIgnoreCase));
        }

        public Task RemoveFromRoleAsync(TUser user, string role)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            user.Roles.RemoveAll(r => String.Equals(r, role, StringComparison.InvariantCultureIgnoreCase));

            return Task.FromResult(0);
        }

        public Task<TUser> FindByEmailAsync(string email)
        {   
            return Task.FromResult( Session.Query<TUser>().Where( u => u.Email == email).FirstOrDefault());
        }

        public Task<string> GetEmailAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");

            return Task.FromResult(user.Email);
        }

        public Task<bool> GetEmailConfirmedAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");
            return Task.FromResult(user.EmailConfirmed);
        }

        public Task SetEmailAsync(TUser user, string email)
        {
            var storeUser = Session.Load<TUser>(user.Id);
            storeUser.Email = user.Email;
            Session.SaveChanges();
            return Task.FromResult(0);
        }

        public Task SetEmailConfirmedAsync(TUser user, bool confirmed)
        {
            var storeUser = Session.Load<TUser>(user.Id);
            storeUser.EmailConfirmed = confirmed;
            Session.SaveChanges();
            return Task.FromResult(0);
        }

        public Task<string> GetPhoneNumberAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");
            return Task.FromResult(user.Phone);
        }

        public Task<bool> GetPhoneNumberConfirmedAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");
            return Task.FromResult(user.PhoneConfirmed);
        }

        public Task SetPhoneNumberAsync(TUser user, string phoneNumber)
        {
            var storeUser = Session.Load<TUser>(user.Id);
            storeUser.Phone = user.Phone;
            Session.SaveChanges();
            return Task.FromResult(0);
        }

        public Task SetPhoneNumberConfirmedAsync(TUser user, bool confirmed)
        {
            var storeUser = Session.Load<TUser>(user.Id);
            storeUser.PhoneConfirmed = confirmed;
            Session.SaveChanges();
            return Task.FromResult(0);
        }

        public Task<int> GetAccessFailedCountAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");
            return Task.FromResult( user.FailedLoginAttempts);
        }

        public Task<bool> GetLockoutEnabledAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");
            return Task.FromResult(user.LockoutEnabled);
        }

        public Task<DateTimeOffset> GetLockoutEndDateAsync(TUser user)
        {
            this.ThrowIfDisposed();
            if (user == null)
                throw new ArgumentNullException("user");
            return Task.FromResult( (DateTimeOffset) DateTime.SpecifyKind( user.LockoutEndDateUtc, DateTimeKind.Utc) );
        }

        public Task<int> IncrementAccessFailedCountAsync(TUser user)
        {
            var storeUser = Session.Load<TUser>(user.Id);
            storeUser.FailedLoginAttempts = storeUser.FailedLoginAttempts + 1;
            Session.SaveChanges();
            return Task.FromResult(storeUser.FailedLoginAttempts);
        }

        public Task ResetAccessFailedCountAsync(TUser user)
        {
            var storeUser = Session.Load<TUser>(user.Id);
            storeUser.FailedLoginAttempts = 0;
            Session.SaveChanges();
            return Task.FromResult(0);
        }

        public Task SetLockoutEnabledAsync(TUser user, bool enabled)
        {
            if (user.Id == null) // not saved yet.
            {
                user.LockoutEnabled = enabled;
                user.Disabled = false;
            }
            else
            {
                var storeUser = Session.Load<TUser>(user.Id);
                storeUser.LockoutEnabled = enabled;
                Session.SaveChanges();
            }
            return Task.FromResult(0);
        }

        public Task SetLockoutEndDateAsync(TUser user, DateTimeOffset lockoutEnd)
        {
            var storeUser = Session.Load<TUser>(user.Id);
            storeUser.LockoutEndDateUtc = lockoutEnd.UtcDateTime;
            Session.SaveChanges();
            return Task.FromResult(0);
        }

        public List<TUser> FindAll(string text = null)
        {
            

            if (text == null)
            {
                return Session.Query<TUser>().Take(1000).ToList();
            }
            else
            {
                return Session.Query<Idx_UserFreeTextSearch<TUser>.ReduceResult, Idx_UserFreeTextSearch<TUser>>()
                   .Where( r => r.Text == (object) text)
                   .As<TUser>().Take(1000).ToList();
            }
        }


        public IQueryable<TUser> Users
        {
            get { return Session.Query<TUser>().AsQueryable(); }
        }

        public Task AddUserAppClientAsync(UserAppClient userAppClient)
        {
            this.ThrowIfDisposed();
            if (userAppClient == null)
                throw new ArgumentNullException("user app");
            if (string.IsNullOrEmpty(userAppClient.Id))
                userAppClient.Id = Guid.NewGuid().ToString("N");

            userAppClient.IssuedUtc = DateTime.UtcNow;

            this.Session.Store(userAppClient);
            Session.SaveChanges();
            return Task.FromResult(true);
        }

        public Task RemoveUserAppClientAsync(UserAppClient userAppClient)
        {

            this.Session.Delete(userAppClient);
            return Task.FromResult(true);
        }


        public Task< IEnumerable<UserAppClient>> GetUserAppClientsAsync(string userId)
        {
            var result = this.Session.Query<UserAppClient>().Where(ua => ua.UserId == userId).ToList().AsEnumerable();
            return Task.FromResult(result);
        }


        public Task<UserAppClient> FindUserAppClientByTokenAsync(string refreshToken)
        {
            var result = this.Session.Query<UserAppClient>().Where( uac => uac.RefreshToken == refreshToken).FirstOrDefault();
            return Task.FromResult(result);
        }


        public Task<UserAppClient> FindUserAppClientByClientIdAndUserAsync(string clientId, string userId)
        {
            var result = this.Session.Query<UserAppClient>().Where(uac => uac.ClientId == clientId && uac.UserId == userId).FirstOrDefault();
            return Task.FromResult(result);
        }
    }
}
