using System.Collections.Generic;
using System.Net.Http;
using System.Web.Http;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using System.Web.Http.Description;
using Dade.Security.Models;
using System.Security.Claims;


namespace ImageWebController.Controllers
{

    [RoutePrefix("api/Account")]
    public class AccountController : ApiController
    {

        private Dade_ContentSecurity.Providers.AuthRepository _repo = null;
        private string userId = "";

        public AccountController()
        {
            _repo = new Dade_ContentSecurity.Providers.AuthRepository();

        }

        // POST api/Account/Register
        //[Authorize(Roles="1")]
        [Route("Register")]
        public async Task<IHttpActionResult> Register(UserIdentity userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result;
            if (!string.IsNullOrEmpty(userModel.OldPassword))
            {
                ClaimsPrincipal principal = Request.GetRequestContext().Principal as ClaimsPrincipal;
                result = await _repo.ChangePassword(principal.Identity.GetUserId(), userModel.OldPassword, userModel.Password);
            }
            else
            {
                result = await _repo.RegisterUser(userModel);
            }
            IHttpActionResult errorResult = GetErrorResult(result);
            if (errorResult != null)
            {
                return errorResult;
            }

            return Ok();
        }

        [Authorize]
        [HttpGet]
        [ResponseType(typeof(IEnumerable<Role>))]
        [Route("Roles")]
        public IHttpActionResult RolesGet()
        {
            ClaimsPrincipal principal = Request.GetRequestContext().Principal as ClaimsPrincipal;
            userId = principal.Identity.GetUserId();
            var roles = _repo.GetRoles(userId);
            if (roles == null)
            {
                return NotFound();
            }
            return Ok(roles);
        }



        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                _repo.Dispose();
            }

            base.Dispose(disposing);
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }
    }
}
