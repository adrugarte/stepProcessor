using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BravoModel.Model
{
    public class BaseEntity
    {
            public int Id { get; set; }
            public DateTime CreateTime { get; set; }
            [StringLength(100)]
            public string CreateUser { get; set; }
            public DateTime ModifiedTime { get; set; }
            [StringLength(100)]
            public string Modifieduser { get; set; }
            public bool Active { get; set; }
    }
}
