using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BravoModel.Model
{
    public class Payment:BaseEntity
    {
        public string PaidBy { get; set; }
        public decimal PaidAmmount { get; set; }
        public int ServiceId { get; set;}
        [ForeignKey("ServiceId")]
        public PersonService PersonService { get; set; }
    }
}
