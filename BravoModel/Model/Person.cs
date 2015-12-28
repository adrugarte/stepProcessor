using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BravoModel.Model
{
    public class BasePerson : BaseEntity
    {
        
        public BasePerson()
        {
            this.CreateTime = DateTime.Now;
            this.ModifiedTime = this.CreateTime;
            this.Active = true;
        }
        
        public virtual string LastName { get; set; }
        public virtual string FirstName { get; set; }
        public virtual string MiddleName { get; set; }
        public virtual DateTime BirthDate { get; set; }
        public virtual Gender Gender { get; set; }
        public virtual string Email { get; set; }
        public virtual string Source { get; set; }

        //public IEnumerable<Work> Works { get; set; }
        //public IEnumerable<Contact> Contacts { get; set; }
        //public IEnumerable<Address> Addresses { get; set; }
    }


    [Table("People")]
    public class Person : BasePerson
    {
        public Person():base()
        {
        }
        [StringLength(500)]
        public override string LastName { get; set; }
        [StringLength(250)]
        public override string FirstName { get; set; }
        [StringLength(250)]
        public override string MiddleName { get; set; }
        public override DateTime BirthDate { get; set; }
        public override Gender Gender { get; set; }
        [StringLength(500)]
        public override string Email { get; set; }
        [StringLength(250)]
        public override string Source { get; set; }

        public List<Contact> Contacts { get; set; }
        public List<Address> Addresses { get; set; }
        //public IEnumerable<Work> Works { get; set; }
        //public IEnumerable<Contact> Contacts { get; set; }
        //public IEnumerable<Address> Addresses { get; set; }
    }





  
}
