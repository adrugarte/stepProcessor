using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BravoModel.Model
{
    [Table("Contacts")]
    public class Contact : BaseEntity
    {
        public Contact()
        {
            this.ModifiedTime = DateTime.Now;
            this.CreateTime = this.ModifiedTime;
            this.Active = true;
        }
        public ContactUse? Use { get; set; }
        public ContactType? Type { get; set; }
        public bool Prefered { get; set; }
        [StringLength(500)]
        public string value { get; set; }
        [StringLength(2500)]
        public string Comment { get; set; }

        public int personId { get; set; }
        //[ForeignKey("personId")]
        //public Person person { get; set; }
    }

}
