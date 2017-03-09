using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdminWeb.Models
{
    public class personVM
    {
        public int id { get; set;}
        public virtual string LastName { get; set; }
        public virtual string FirstName { get; set; }
        public virtual string MiddleName { get; set; }
        public virtual DateTime? BirthDate { get; set; }
        public virtual string BirthCity { get; set; }
        public virtual string BirthCountry { get; set; }
        public virtual byte Gender { get; set; }
        public virtual string Email { get; set; }
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