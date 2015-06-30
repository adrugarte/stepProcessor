using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StepsProcessor.Models;

namespace StepsProcessor.Helpers
{
    public static class Utils
    {
        public static string FormatPersonId(string Id)
        {
            return "person/" + Id;
        }
    }
}