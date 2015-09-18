using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AdminWeb.Models;

namespace AdminWeb.Controllers
{
    public class AccountController : ApiController
    {
        // GET api/account
        public IHttpActionResult GetLogin(string userName, string password)
        {
            var user = Users.List.Select(u => u.userName == userName && u.password == password).FirstOrDefault();
            if (user == null) return NotFound();

            return Ok(user);
        }


    }
}
