using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BravoModel.Model
{
    [Table("Addresses")]
    public class Address : BaseEntity
    {
        public Address()
        {
            this.CreateTime = DateTime.Now;
            this.ModifiedTime = this.CreateTime;
            this.Active = true;
        }
        public AddressType? Type { get; set; }
        [StringLength(500)]
        public string Address1 { get; set; }
        [StringLength(250)]
        public string Address2 { get; set; }
        [StringLength(250)]
        public string City { get; set; }
        [StringLength(250)]
        public string State { get; set; }
        [StringLength(50)]
        public string ZipCode { get; set; }

        public int personId { get; set; }
        //[ForeignKey("personId")]
        //public Person person { get; set; }
    }
}
