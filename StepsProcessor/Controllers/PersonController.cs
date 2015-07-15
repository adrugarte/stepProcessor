using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using StepsProcessor.Models;
using System.Threading.Tasks;
using StepsProcessor.Helpers;

namespace StepsProcessor.Controllers
{
    [RoutePrefix("api/person")]
    public class PersonController : RavenDbController
    {
        //DocumentStore doc;
        //public PersonController()
        //{
        //    doc = (DocumentStore)RavenDbController.DocStore;
        //    //doc.Conventions.RegisterIdConvention<Person>((dbname, commands, person) => "person/");
        //    //doc.Conventions.RegisterAsyncIdConvention<Person>((dbname, commands, person) => new CompletedTask<string>("person/"));
        //}

        // GET: api/Person
        public IHttpActionResult Get()
        {
            return Ok(Session.Advanced.DocumentQuery<Person>().WhereEquals(p=>p.Active,true).ToList());
        }

        // GET: api/Person/5
        [Route("person/{id}")]
        public IHttpActionResult GetPerson(string  id)
        {
            Person person;
            person = Session.Load<Person>(Utils.FormatId("person",id));
            if (person == null) return NotFound();
            return Ok(person);
        }

        // POST: api/Person
        public IHttpActionResult PostPerson([FromBody]Person person)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }
            //person.Id = string.Empty;
            //await AsyncSession.StoreAsync(person); // stores person in session, assigning it to a collection `Employees`
            Session.Store(person);
            Session.SaveChanges();
            return Ok(person);
        }

        // PUT: api/Person/5
        public async Task<IHttpActionResult> Put(int id, [FromBody]Person person)
        {
            Session.Store(person);
            Session.SaveChanges();
            return Ok(person);
        }

        // DELETE: api/Person/5
        public IHttpActionResult Delete(string id)
        {
            var person = Session.Load<Person>(id);
            person.Active = false;
            Session.SaveChanges();
            return Ok();
        }
    }
 

}


