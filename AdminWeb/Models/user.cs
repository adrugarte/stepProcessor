using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdminWeb.Models
{
    public static class Users
    {
        private static List<user> _list;

        public static List<user> List { 
            get {
                if (_list == null) _list = CreateList();
                return _list; 
            }
        }

        private static List<user> CreateList()
        {
            List<user> userList = new List<user>();
            userList.Add(new user { userName = "smartell", Id = "sm", Name = "Sonia Martell", password="1966" });
            userList.Add(new user { userName = "reinaldo", Id = "rm", Name = "Reinaldo", password="123456" });

            return userList;
        }

    }

    public class user
    {
        public string Id { get; set; }
        public string userName { get; set; }
        public string Name { get; set; }
        public string password { get; set; }
    }
}