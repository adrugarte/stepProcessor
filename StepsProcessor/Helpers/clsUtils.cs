using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StepsProcessor.Models;

namespace StepsProcessor.Helpers
{
    public static class Utils
    {
        public static string FormatId(string Object, string Id)
        {
            return Object + "-" + Id;
        }

    }

    public static class Settings
    {
        static string _cloud;
        static Settings()
        {
            _cloud = System.Configuration.ConfigurationManager.AppSettings["Cloud"];
            if (_cloud == null) _cloud = "AmazonCloud";
        }

        public static string Cloud { get { return _cloud; } set { _cloud = "AmazonCloud"; } }

    }
}