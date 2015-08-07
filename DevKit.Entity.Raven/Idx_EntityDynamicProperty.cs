using Raven.Client.Indexes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevKit.Entity.Enhanced
{
    public class Idx_EntityDynamicProperty<T> : AbstractIndexCreationTask<T> where T : IProperties
    {
        public Idx_EntityDynamicProperty()
            {
            
                Map = ts => from t in ts
                               select new
                               {
                                   _ = t.Properties
                                      .Select( p =>
                                          CreateField(p.Key, p.Value, false, true))
                               };
            }

        public override string IndexName
        {
            get
            {
                return typeof(T).Name + "/Idx_DynamicProperty";
            }
        }
        
    }
}
