using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Dade.Security.Models;
using Dade_ContentSecurity.Models;
using Raven.Client;
using Raven.Client.Document;
using AspNet.Identity.RavenDB.Stores;
using AspNet.Identity.RavenDB.Entities;
using Dade_ContentSecurity.Helpers;

namespace Dade_ContentSecurity.Providers
{
    public class AuthRepository : IDisposable
    {
        //private AuthenticationContext _ctx;
        private IDocumentStore documentStore;

        private UserManager<ApplicationUser> _userManager;

        public AuthRepository()
        {
            //documentStore = new DocumentStore
            //{
            //    ConnectionStringName = "RavenHQ"
            //    //Url = "http://localhost:8080",
            //    //DefaultDatabase = "AspNetIdentity"
            //}.Initialize();

            //using (IAsyncDocumentSession session = documentStore.OpenAsyncSession())
            //{
                RavenCnn.AsyncSession.Advanced.UseOptimisticConcurrency = true;
                RavenUserStore<ApplicationUser> ravenUserStore = new RavenUserStore<ApplicationUser>(RavenCnn.AsyncSession);
                _userManager = new UserManager<ApplicationUser>(ravenUserStore);
                // UserManager<RavenUser> is ready to use!
            //}
           
        }

        public async Task<IdentityResult> RegisterUser(UserIdentity userModel)
        {

            ApplicationUser user = new ApplicationUser(userModel.UserName, userModel.email);
            user.SetPasswordHash(userModel.Password);
            user.SetPhoneNumber(userModel.phone, userModel.phoneType);
            //user.AddRole("user");
            //user.SetEmail(userModel.email);
            //ApplicationUser user = new RavenUser(userModel.UserName);
            
            var result = await _userManager.CreateAsync(user);

            await _userManager.AddToRoleAsync(user.Id, "user");
            await _userManager.SetPhoneNumberAsync(user.Id, userModel.phone); 

            //var result = await _userManager.CreateAsync(user, userModel.Password);

            return result;
        }

        public async Task<ApplicationUser> FindUser(string userName, string password)
        {
            ApplicationUser user = await _userManager.FindAsync(userName, password);

            return user;
        }


        public async  Task<IdentityResult> ChangePassword(string userId, string oldPassword, string newPassword)
        {
            IdentityResult result = await _userManager.ChangePasswordAsync(userId, oldPassword, newPassword);
         
            return result ;
        }


        public List<UserRoles> GetRoles(string userId)
        {
            var Roles = RavenCnn.Session.Query<UserRoles>().Where(r => r.UserId==userId).ToList();

            //var Roles = (from m in _ctx.Roles.Where(c => c.Users.Any(p => p.UserId == userId))
            //             select new Role { id = m.Id, name = m.Name }).ToList();

            return Roles;
        }

        public Client FindClient(string clientId)
        {
            var client = RavenCnn.Session.Load<Client>(clientId);

            return client;
        }

        public async Task<bool> AddRefreshToken(RefreshToken token)
        {
            var existingToken = RavenCnn.Session.Query<RefreshToken>().Where(t => t.ClientId == token.ClientId && t.Subject == token.Subject).FirstOrDefault();

            //var existingToken = _ctx.RefreshTokens.Where(r => r.Subject == token.Subject && r.ClientId == token.ClientId).SingleOrDefault();

            if (existingToken != null)
            {
                var result = await RemoveRefreshToken(existingToken);
            }

            await RavenCnn.AsyncSession.StoreAsync(token);
            //_ctx.RefreshTokens.Add(token);
            await RavenCnn.AsyncSession.SaveChangesAsync();
            //return await _ctx.SaveChangesAsync() > 0;

            return true;
        }

        public async Task<bool> RemoveRefreshToken(string refreshTokenId)
        {
            var refreshToken = await RavenCnn.AsyncSession.LoadAsync<RefreshToken>(refreshTokenId) ;
            //var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

            if (refreshToken != null)
            {
                RavenCnn.AsyncSession.Delete(refreshToken);
                await RavenCnn.AsyncSession.SaveChangesAsync();
                //_ctx.RefreshTokens.Remove(refreshToken);
                return true;
            }

            return false;
        }

        public async Task<bool> RemoveRefreshToken(RefreshToken refreshToken)
        {
            //_ctx.RefreshTokens.Remove(refreshToken);
            //return await _ctx.SaveChangesAsync() > 0;
            RavenCnn.AsyncSession.Delete(refreshToken);
            await RavenCnn.AsyncSession.SaveChangesAsync();
            //_ctx.RefreshTokens.Remove(refreshToken);
            return true;
        }

        public async Task<RefreshToken> FindRefreshToken(string refreshTokenId)
        {
            //var refreshToken = await _ctx.RefreshTokens.FindAsync(refreshTokenId);

            //return refreshToken;

            return await RavenCnn.AsyncSession.LoadAsync<RefreshToken>(refreshTokenId);
        }

        public List<RefreshToken> GetAllRefreshTokens()
        {
            //return _ctx.RefreshTokens.ToList();
            return RavenCnn.Session.Query<RefreshToken>().ToList();
        }


        public void Dispose()
        {
            //_ctx.Dispose();
            _userManager.Dispose();

        }
    }
}