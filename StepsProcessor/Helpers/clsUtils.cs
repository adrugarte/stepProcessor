using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StepsProcessor.Models;
using System.Security.Cryptography;
using System.Text;


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


    public static class Hash
    {
 
        public static string GetMd5Hash(byte[] file)
        {
             // Create a new Stringbuilder to collect the bytes 
             // and create a string.
             StringBuilder sBuilder = default(StringBuilder);

             using (MD5 md5Hash = MD5.Create())
            {
             // Convert the input string to a byte array and compute the hash. 
                //byte[] data = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(input));

                byte[] data = md5Hash.ComputeHash(file);

                sBuilder = new StringBuilder();

                 // Loop through each byte of the hashed data  
                // and format each one as a hexadecimal string. 
                for (int i = 0; i < data.Length; i++)
                {
                    sBuilder.Append(data[i].ToString("x2"));
                }

 
            }

            // Return the hexadecimal string. 
            return sBuilder != null? sBuilder.ToString(): string.Empty;
        }

 
    }

}