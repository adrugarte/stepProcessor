using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BravoWeb.Models;
using BravoWeb.Utils;

namespace BravoWeb.Controllers
{
    public class ContactController : ApiController
    {
        // GET: api/Contact
        public IHttpActionResult Post([FromBody] Contact _contact)
        {
            mailing.send(_contact);
            return Ok();
        }

    }
}
