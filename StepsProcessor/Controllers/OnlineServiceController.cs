using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using StepsProcessor.Models;
namespace StepsProcessor.Controllers
{
    public class OnlineServiceController : RavenDbController
    {
        // GET: api/OnlineService
        // GET: api/Person
        public IHttpActionResult Get()
        {
            return Ok(Session.Advanced.DocumentQuery<Onlineservice>().WhereEquals(p => p.languageid, 1).ToList());
        }

        // GET: api/OnlineService/5
        public IHttpActionResult Get(int id)
        {
            if (!Session.Advanced.DocumentQuery<Onlineservice>().Any(p => p.Id == id))
            {
                return NotFound();
            }

            return Ok(Session.Advanced.DocumentQuery<Onlineservice>().WhereEquals(p => p.Id, id).FirstOrDefault()); ;
        }

        // POST: api/OnlineService
        public IHttpActionResult Post([FromBody]Onlineservice Service)
        {


            return Ok();
        }

        // PUT: api/OnlineService/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/OnlineService/5
        public void Delete(int id)
        {
        }
    }
}
