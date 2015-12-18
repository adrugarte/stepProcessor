using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BravoModel;
using BravoRepository;

namespace AdminWeb.Controllers
{
    
    [RoutePrefix("api/person")]
    public class PersonController : ApiController
    {
        Repository Repo;
        public PersonController()
        {
            Repo = new Repository();

        }
        // GET: api/Person
        public IHttpActionResult Get(PersonCriteria query, int top, int offset=0 )
        {
            IQueryable<Person> PersonLisT = Repo.person.GetList();
            if (query != null)
            {
                //if (query.Address != null) PersonLisT = PersonLisT.Where(p => p.Addresses.Any(a => a.Address1.Contains(query.Address) || a.Address2.Contains(query.Address)));
                if (query.Name != null) PersonLisT = PersonLisT.Where(p => p.FirstName == query.Name ||  p.LastName == query.Name);
                //if (query.Email != null) PersonLisT = PersonLisT.Where(p => p.Contacts.Any(e => e.Type == ContactType.email && e.value == query.Email));
                if (query.BirhDate != null) PersonLisT = PersonLisT.Where(p => p.BirthDate == query.BirhDate);
            }
            if (offset > 0) PersonLisT = PersonLisT.Skip(offset);
            if (top > 0) PersonLisT = PersonLisT.Take(top);
            return Ok(PersonLisT.ToList());
        }

        // GET: api/Person/5
        [Route("person/{id}")]
        public IHttpActionResult GetPerson(string id)
        {
           
            return Ok(Repo.person.Get(id));
        }

        // POST: api/Person
        public IHttpActionResult PostPerson([FromBody]Person person)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }
            person = Repo.person.Create(person);
            return Ok(person);
        }

        // PUT: api/Person/5
        public IHttpActionResult Put(string id, [FromBody]Person person)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);

            }
            person = Repo.person.Update(id,person);
            return Ok(person);
        }

        // DELETE: api/Person/5
        public IHttpActionResult Delete(string id)
        {
            Repo.person.Delete(id);
            return Ok();
        }
    }


    public class PersonCriteria
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public DateTime BirhDate { get; set; }


    }
}
