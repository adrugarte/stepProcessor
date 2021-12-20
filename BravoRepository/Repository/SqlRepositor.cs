using BravoModel.Model;
using System.Linq;
using BravoRepository.DbContext;
using System.Collections.Generic;
using System.Linq.Expressions;
using System;
using System.Data.Entity;
namespace BravoRepository
{

    public class SQLRepository
    {
        private SpSqlDbContext dbCtx = new SpSqlDbContext();

        public SQLRepository()
        {

            person = new PersonCls(dbCtx);
            payment = new PaymentCls(dbCtx);

        }

        public PersonCls person { get; private set; }
        public PaymentCls payment { get; private set; } 

    }

    public class PersonCls 
    {
        private SpSqlDbContext _dbCtx; 
        public PersonCls(SpSqlDbContext dbCtx)
        {
            _dbCtx = dbCtx;
        }

        public IQueryable<Person> GetListNoServices()
        {
            return _dbCtx.Persons.Where(p => p.Active == true).AsQueryable<Person>();//.WhereEquals(p => p.Active, true).AsQueryable<Person>();
        }

        public IQueryable<Person> GetList()
        {
            return _dbCtx.Persons.Include(p=>p.Services).Where(p=> p.Active == true).AsQueryable<Person>();//.WhereEquals(p => p.Active, true).AsQueryable<Person>();
        }

        public Person Get(int PersonId)
        {
            //var person = _dbCtx.Persons.Find(PersonId);
            //person.Addresses = _dbCtx.Addresses.Where(a => a.personId == PersonId).ToList();
            //person.Contacts = _dbCtx.Contacts.Where(c => c.personId == PersonId).To;

            return _dbCtx.Persons.Include("Addresses").Include("Contacts").FirstOrDefault(p=>p.Id==PersonId);
        }

        public List<PersonService> GetServices(int PersonId)
        {
            //var person = _dbCtx.Persons.Find(PersonId);
            //person.Addresses = _dbCtx.Addresses.Where(a => a.personId == PersonId).ToList();
            //person.Contacts = _dbCtx.Contacts.Where(c => c.personId == PersonId).To;

            return _dbCtx.PersonServices.Where(p => p.PersonId == PersonId).ToList();
        }

        public Person Find(Expression<Func<Person, bool>> expression = null)
        {
            return _dbCtx.Persons.Include(p=>p.Contacts).FirstOrDefault(expression);
        }


        public IQueryable<Person> GetFiltered(Expression<Func<Person, bool>> expression = null)
        {
            return _dbCtx.Persons.Include(p => p.Contacts).Where(expression);
        }

        public Person Update(int PersonId, Person person)
        {
            if (person.Contacts != null) { 
                foreach (Contact ct in person.Contacts)
                {
                    ct.personId = PersonId;
                    if (ct.Id == 0) _dbCtx.Contacts.Add(ct); else _dbCtx.Entry(ct).State = System.Data.Entity.EntityState.Modified;
                }
            }
            if (person.Addresses != null)
            {
                foreach (Address ad in person.Addresses)
                {
                    ad.personId = PersonId;
                    if (ad.Id == 0) _dbCtx.Addresses.Add(ad); else _dbCtx.Entry(ad).State = System.Data.Entity.EntityState.Modified;
                }
            }
            _dbCtx.Entry(person).State = System.Data.Entity.EntityState.Modified;
            _dbCtx.SaveChanges();
            return person;
        }

        public Person Create(Person person)
        {
            _dbCtx.Persons.Add(person);
            _dbCtx.SaveChanges();
            return person;
        }

        public Person Delete(string personId)
        {
            var person = _dbCtx.Persons.Find(personId);
            person.Active = false;
            _dbCtx.SaveChanges();
            return person;
        }
    }

    public class PaymentCls{

        private SpSqlDbContext _dbCtx;
        public PaymentCls(SpSqlDbContext dbCtx)
        {
            _dbCtx = dbCtx;
        }

        public IQueryable<Payment> GetList()
        {
            return _dbCtx.Payments.Include(p=>p.PersonService).Where(p=> p.Active == true).AsQueryable<Payment>();//.WhereEquals(p => p.Active, true).AsQueryable<Person>();
        }

        public Payment  Add(Payment payment){
            PersonService ps = _dbCtx.PersonServices.Find(payment.ServiceId);
            ps.PaidAmount = ps.PaidAmount + (float)payment.PaidAmmount; 
            _dbCtx.Payments.Add(payment);
            _dbCtx.SaveChanges();
            return payment;
        }


    }
}
