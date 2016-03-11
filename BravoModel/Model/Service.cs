using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BravoModel.Model
{
    public class PersonService
    {
        public PersonService(){
            Created = DateTime.Now;
        }
        public int Id { get; set; }
        public string ServiceDesc { get; set; }
        public string Form { get; set; }
        [DataType(DataType.Currency)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:c}")]
        public float Price { get; set; }
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:c}")]
        public float PaidAmount { get; set; }

        public DateTime Created { get; set; }
        [StringLength(50)]
        public string UserCreate { get; set; }
        public DateTime? Finished { get; set; }
        public int PersonId { get; set; }
        [ForeignKey("PersonId")]
        public Person Person { get; set; }

        public int ServiceId { get; set; }
       [ForeignKey("ServiceId")]
        public Service Service { get; set;}
        
    }

    public class Service
    {
        public int Id { get; set; }
        [StringLength(1000)]
        public string ServiceDesc { get; set; }
        [StringLength(500)]
        public string Form { get; set; }
        [DataType(DataType.Currency)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:c}")]
        public float? Price { get; set; }
    }

}
