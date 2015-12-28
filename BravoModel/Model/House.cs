using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BravoModel.Model
{
    public class House
    {
        public int Id { get; set; }
        public string name { get; set; }
        public List<room> rooms { get; set; }
    }

    public class room
    {
        public int Id { get; set; }
        public string name { get; set; }
        public int houseId { get; set; }
        [ForeignKey("houseId")]
        public House house { get; set; }
    }
}
