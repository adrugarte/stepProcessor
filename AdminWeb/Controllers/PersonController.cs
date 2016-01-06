using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BravoModel.Model;
using BravoRepository;
using System.Text.RegularExpressions;

namespace AdminWeb.Controllers
{
    
    [RoutePrefix("api/person")]
    public class PersonController : ApiController
    {
        SQLRepository Repo;
        public PersonController()
        {
            Repo = new SQLRepository();

        }
        // GET: api/Person
        public IHttpActionResult Get(string query, int top, int offset=0, string sort="" )
        {
            IQueryable<Person> PersonLisT = Repo.person.GetList();
            if (query != null)
            {
                string phone = "";
                DateTime queryDate;
                if (query.Contains("@"))
                {
                    PersonLisT = PersonLisT.Where(p => p.Contacts.Any(c=> c.Type== ContactType.email && c.value == query));
                }
                else if (IsPhoneNumber(query, out phone))
                    PersonLisT = PersonLisT.Where(p => p.Contacts.Any(c=> c.value == phone));
                else if (DateTime.TryParse(query, out queryDate)) 
                    PersonLisT = PersonLisT.Where(p => p.BirthDate == queryDate);
                else
                {
                    PersonLisT = PersonLisT.Where(p =>
                        p.Addresses.Any(a=> a.Address1.Contains(query) || a.Address2.Contains(query)) ||
                        p.FirstName.Contains(query) || p.LastName.Contains(query)
                        );
                }
                //PersonLisT = PersonLisT.Where(p => p.Addresses.Any(a => a.Address1.Contains(query.Address) || a.Address2.Contains(query.Address)));
            }
            var _counter = PersonLisT.Count();
            switch (sort)
            {
                case "email":
                    PersonLisT = PersonLisT.OrderBy(p => p.Email);
                    break;
                default:
                    PersonLisT = PersonLisT.OrderBy(p => p.LastName);
                    break;
            }
            if (offset > 0) PersonLisT = PersonLisT.Skip(offset);
            if (top > 0) PersonLisT = PersonLisT.Take(top);

            var persons = PersonLisT.Select(p => 
                new { 
                    Id = p.Id,
                    Name = p.LastName + ", " + p.FirstName, 
                    Address = p.Addresses.Where(c=>c.Type==AddressType.Home).Select(c => c.Address1 + (c.Address2!=null?" ":"") + c.Address2 + " " + c.City + (c.State!=null?", ":"") + c.State + (c.ZipCode!=null?" ":"") + c.ZipCode).FirstOrDefault() ,
                    Phone = p.Contacts.Where(c=>c.Type== ContactType.Phone).Select(c=>c.value).FirstOrDefault(),
                    Celular = p.Contacts.Where(c => c.Type == ContactType.Cellular).Select(c => c.value).FirstOrDefault(),
                    Email = p.Contacts.Where(c => c.Type == ContactType.email).Select(c => c.value).FirstOrDefault(),
                });

            return Ok(new { counter = _counter, Persons = persons.ToList() });
        }



        // GET: api/Person/5
        //[Route("person/{id}")]
        public IHttpActionResult GetPerson(int id)
        {
            return Ok(new { person = Repo.person.Get(id) });
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
        public IHttpActionResult Put(int id, [FromBody]Person person)
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
        private bool IsPhoneNumber(string Text, out string phone){
            Text = Text.Trim();
            Match m = Regex.Match(Text, @"\d+");
            string phoneNum = phone = m.Value;
            Regex regex = new Regex(@"^\d{10}$");
            Match match = regex.Match(phoneNum);
            return match.Success;
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
