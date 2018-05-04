using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using BravoModel.Model;
using BravoRepository.DbContext;

namespace AdminWeb.Controllers
{
    public class PersonServicesController : ApiController
    {
        private SpSqlDbContext db = new SpSqlDbContext();

        // GET: api/PersonServices
        public IQueryable<PersonService> GetPersonServices(int PersonId)
        {
            return db.PersonServices.Where(s=>s.PersonId == PersonId);
        }

        // GET: api/PersonServices/5
        [ResponseType(typeof(PersonService))]
        public async Task<IHttpActionResult> GetPersonService(int id)
        {
            PersonService personService = await db.PersonServices.FindAsync(id);
            if (personService == null)
            {
                return NotFound();
            }

            return Ok(personService);
        }

        // PUT: api/PersonServices/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutPersonService(int id, PersonService personService)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != personService.Id)
            {
                return BadRequest();
            }

            db.Entry(personService).State = EntityState.Modified;

            try
            {
                await db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PersonServiceExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/PersonServices
        [ResponseType(typeof(PersonService))]
        public async Task<IHttpActionResult> PostPersonService(PersonService personService)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (personService.Id > 0)
                db.Entry<PersonService>(personService).State = EntityState.Modified;
            else
            { 
                Payment _payment = new Payment();
                db.PersonServices.Add(personService);
                _payment.ServiceId = personService.Id;
                _payment.PaidAmmount = (decimal)personService.PaidAmount;
                _payment.PaidBy = "sbravo";
                _payment.CreateTime = DateTime.Now;
                db.Payments.Add(_payment);
            }
                
                
            await db.SaveChangesAsync();

            return CreatedAtRoute("DefaultApi", new { id = personService.Id }, personService);
        }

        // DELETE: api/PersonServices/5
        [ResponseType(typeof(PersonService))]
        public async Task<IHttpActionResult> DeletePersonService(int id)
        {
            PersonService personService = await db.PersonServices.FindAsync(id);
            if (personService == null)
            {
                return NotFound();
            }

            db.PersonServices.Remove(personService);
            await db.SaveChangesAsync();

            return Ok(personService);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PersonServiceExists(int id)
        {
            return db.PersonServices.Count(e => e.Id == id) > 0;
        }
    }
}