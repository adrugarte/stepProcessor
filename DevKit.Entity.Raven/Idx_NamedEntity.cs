using Raven.Client.Indexes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevKit.Entity.Enhanced
{
    public class Idx_NamedEntity<T> : AbstractIndexCreationTask<T> where T : NamedEntity
    {
        public Idx_NamedEntity()
            {
                Map = entities => from entity in entities
                                  from name in entity.Name.Values
                                  select name;
            }

        public override string IndexName
        {
            get
            {
                return typeof(T).Name + "/Idx_Name";
            }
        }
        
    }
}
