using System;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using StepsProcessor.Models;
using System.Security.Claims;
using Microsoft.AspNet.Identity;
using StepsProcessor.Helpers;
using System.Collections.Generic;

namespace StepsProcessor.Controllers
{
    public class DocumentController : RavenDbController
    {
        // GET: api/OnlineService
        // GET: api/Person
        //public IHttpActionResult Get()
        //{
        //    ClaimsPrincipal principal = Request.GetRequestContext().Principal as ClaimsPrincipal;
        //    var UserId = principal.Identity.GetUserId();

        //    return Ok(Session.Query<Document>().Where(d=>d.CustomerId==UserId && d.Canceled == null).ToList());
        //    //return Ok(Session.Advanced.DocumentQuery<Document>().WhereEquals(d=>d.CustomerId,UserId).ToList());
        //}

    public IHttpActionResult Get()
    {
        List<Document> Documents = new List<Document>();
        Documents.Add(new Document { Id = "000001", CustomerId = "0001", Type = new DocType { Id = "type-1", TypeDesc = "Passport" }, Uploaded = new DateTime(2015, 7, 15), Label = "Pasaporte Alberto", Path = @"C:\\Files\00001.dbf", OriginalName = "00001.pdf" });
        Documents.Add(new Document { Id = "000002", CustomerId = "0001", Type = new DocType { Id = "type-2", TypeDesc = "Formulario" }, Uploaded = new DateTime(2015, 7, 15), Label = "Formualrio Alberto", Path = @"C:\\Files\00002.dbf", OriginalName = "00002.pdf" });
        Documents.Add(new Document { Id = "000003", CustomerId = "0001", Type = new DocType { Id = "type-3", TypeDesc = "Partida" }, Uploaded = new DateTime(2015, 7, 15), Label = "PArtida Alberto", Path = @"C:\\Files\00003.dbf", OriginalName = "00003.pdf" });
        return Ok(Documents);
    }

        // GET: api/OnlineService/5
        public IHttpActionResult Get(string id)
        {
            if (!Session.Advanced.DocumentQuery<Document>().Any(p => p.Id == id && p.Canceled == null))
            {
                return NotFound();
            }

            return Ok(Session.Advanced.DocumentQuery<Document>().WhereEquals(p => p.Id, id).FirstOrDefault()); ;
        }


        public IHttpActionResult Post(Document Doc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }
            //ClaimsPrincipal principal = Request.GetRequestContext().Principal as ClaimsPrincipal;
            //Doc.CustomerId = principal.Identity.GetUserId();
            Doc.CustomerId = "000001";
            //person.Id = string.Empty;
            //await AsyncSession.StoreAsync(person); // stores person in session, assigning it to a collection `Employees`
            Doc.Uploaded = DateTime.Now;
            Session.Store(Doc);
            Session.SaveChanges();
            return Ok(Doc);
        }

        // POST: api/OnlineService
        public Document PostDocument(Document Doc)
        {
            Doc.Uploaded = DateTime.Now;
            Session.Store(Doc);
            Session.SaveChanges();
            return Doc;
        }

        // PUT: api/OnlineService/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/OnlineService/5
        public IHttpActionResult Delete(string DocId)
        {
            var Doc = Session.Load<Document>(Utils.FormatId("document",DocId));
            Doc.Canceled = DateTime.Now;
            Session.SaveChanges();
            return Ok();
        }
    }
}
