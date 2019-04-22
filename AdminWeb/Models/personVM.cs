using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdminWeb.Models
{
    public class personPM
    {
        public int id { get; set;}
        public virtual string LastName { get; set; }
        public virtual string FirstName { get; set; }
        public virtual string MiddleName { get; set; }
        public virtual string BirthDate { get; set; }
        public virtual string BirthCity { get; set; }
        public virtual string BirthCountry { get; set; }
        public virtual string Gender { get; set; }
        public virtual string Cellular { get; set; }
        public virtual string Phone { get; set; }
        public virtual string Email { get; set; }
        public virtual string Address { get; set; }
        public virtual string City { get; set; }
        public virtual string State { get; set; }
        public virtual string ZipCode { get; set; }
        public virtual string Source { get; set; }

    }

    public class recipientVM
    {
        public int id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Celular { get; set; }
    }

}