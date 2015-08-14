using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AspNet.Identity.RavenDB.Entities
{
    public class RavenUserRole
    {
        public RavenUserRole(string UserId, string RoleId) {
                userId = UserId;
                roleId = RoleId;
        }
        public string userId { get; private set; }
        public string roleId { get; private set; }
    }
}
