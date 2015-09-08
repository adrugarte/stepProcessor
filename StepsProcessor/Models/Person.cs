using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Raven.Client.UniqueConstraints;

namespace StepsProcessor.Models
{
    public class Person: BaseEntity
    {
        public Person()
        {
            this.CreateTime = DateTime.Now;
            this.ModifiedTime = this.CreateTime;
            this.Active = true;
        }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public DateTime BirthDate { get; set; }
        public Gender Gender { get; set; }
        public IEnumerable<Work> Works { get; set; }
        public IEnumerable<Contact> Contacts { get; set; }
        public IEnumerable<Address> Addresses { get; set; }
    }

    public class Contact
    {
        public ContactUse Use { get; set; }
        public ContactType Type { get; set; }
        public bool Prefered { get; set; }
        public string value { get; set; }
        public string Comment { get; set; }
    }

    public class Address: BaseEntity
    {
        public Address()
        {
            this.CreateTime = DateTime.Now;
            this.Active = true;
        }
        public AddressType Type { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public Int32 City { get; set; }
        public Int16 State { get; set; }
        public string ZipCode { get; set; }
    }

    public class Work
    {
        public string name { get; set; }
        public string number { get; set; }

    }


    public enum Gender: byte
    {
        male=1,
        female=2
    }

    public enum AddressType : byte { 
        Home =1,
        Work =2
       }
    public enum ContactUse : byte
    {
        Private = 1,
        Work = 2,
        Home =3,
        Other=4
    }

    public enum ContactType : byte
    {
        Phone = 1,
        Cellular = 2,
        email =3,
        Fax=4
    }

    public class BaseEntity{
        public string Id { get; set; }
        public DateTime CreateTime { get; set; }
        public string CreateUser { get; set; }
        public DateTime ModifiedTime { get; set; }
        public string Modifieduser { get; set; }
        public bool Active { get; set;}
    }
}