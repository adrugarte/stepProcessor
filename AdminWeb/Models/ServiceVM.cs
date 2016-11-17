using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using BravoModel.Model;
using System.ComponentModel.DataAnnotations;

namespace AdminWeb.Models
{
    public class ServiceVM 
    {

            public int Id { get; set; }
            public string ServiceDesc { get; set; }
            public string Form { get; set; }
            [DataType(DataType.Currency)]
            [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:c}")]
            public float Price { get; set; }
            [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:c}")]
            public float PaidAmount { get; set; }
            public DateTime Created { get; set; }
            public DateTime? Finished { get; set; }
            public int PersonId { get; set; }
            public int ServiceId { get; set; }

        
    }
}