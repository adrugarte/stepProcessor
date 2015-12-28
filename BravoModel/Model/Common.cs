using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BravoModel.Model
{



    [Table("Works")]
    public class Work
    {
        public string name { get; set; }
        public string number { get; set; }

    }

    public enum Gender : byte
    {
        male = 1,
        female = 2
    }

    public enum AddressType : byte
    {
        Home = 1,
        Work = 2
    }
    public enum ContactUse : byte
    {
        Private = 1,
        Work = 2,
        Home = 3,
        Other = 4
    }

    public enum ContactType : byte
    {
        Phone = 1,
        Cellular = 2,
        email = 3,
        Fax = 4
    }



}
