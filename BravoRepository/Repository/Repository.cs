using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BravoRepository.Controllers;
using BravoModel;
namespace BravoRepository
{
    public class Repository
    {
        public Repository()
        {

            person = new PersonCls();

        }

        public PersonCls person { get;private set; }


    }

    public class PersonCls : RavenDbController
    {
        public IQueryable<Person> GetList()
        {
            return Session.Advanced.DocumentQuery<Person>().AsQueryable<Person>();//.WhereEquals(p => p.Active, true).AsQueryable<Person>();
        }

        public Person Get(string PersonId)
        {
            return Session.Load<Person>(PersonId);
        }

        public Person Update(string PersonId, Person person)
        {
            Session.Store(person);
            Session.SaveChanges();
            return person;
        }

        public Person Create(Person person)
        {
            Session.Store(person);
            Session.SaveChanges();
            return person;
        }

        public Person Delete(string personId){
            var person = Session.Load<Person>(personId);
            person.Active = false;
            Session.SaveChanges();
            return person;
        }
    }
}
