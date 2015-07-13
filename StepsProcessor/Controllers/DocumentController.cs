using System.Linq;
using System.Net.Http;
using System.Web.Http;
using StepsProcessor.Models;
using System.Security.Claims;
using Microsoft.AspNet.Identity;

namespace StepsProcessor.Controllers
{
    public class DocumentController : RavenDbController
    {
        // GET: api/OnlineService
        // GET: api/Person
        public IHttpActionResult Get()
        {
            ClaimsPrincipal principal = Request.GetRequestContext().Principal as ClaimsPrincipal;
            var Id = principal.Identity.GetUserId();
            return Ok(Session.Advanced.DocumentQuery<Document>().WhereEquals(d=>d.CustomerId,Id).ToList());
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
        public IHttpActionResult Post([FromBody]Document Doc)
        {


            return Ok();
        }

        // PUT: api/OnlineService/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/OnlineService/5
        public void Delete(string DocId)
        {


        }
    }
}
