using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevKit.AspNet.Identity.Raven
{
    public class UserAppClient
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string ClientId { get; set; }
        public string RefreshToken { get; set; }
        public bool ClientIdRequired { get; set; }
        public DateTime IssuedUtc { get; set; }
        public DateTime ExpiresUtc { get; set; }
        public string Ticket { get; set; }
    }
}
