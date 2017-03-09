using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AdminWeb.Models;
using AdminWeb.Helpers;

namespace AdminWeb.Controllers
{
    public class ComunicationController : ApiController
    {
        public IHttpActionResult PostComm([FromBody] messageVM msg)
        {
            Comunication commClass = new Comunication();
            foreach (recipientVM cust in msg.customers)
            {
                if (!string.IsNullOrEmpty(cust.Email)) { 
                    commClass = new Comunication();
                    //string message = string.Format("Estimado {0}", cust.Name) + Environment.NewLine + msg.text;
                    commClass.EmailSubject = msg.subject;
                    commClass.EmailTo[0] = cust.Email;
                    commClass.EmailBody = msg.text;
                    commClass.SendMail(commClass);
                }
            }
            commClass = null;
            return Ok();
        }


        
        // POST: api/Comunication
        //public IHttpActionResult PostComm([FromBody]string subject, string text, List<personVM> customers)
        //{
        //    Comunication commClass = new Comunication();
        //    foreach (personVM cust in customers) { 
        //        string message = string.Format("Estimado {0}",cust.LastName + ", " + cust.FirstName) + Environment.NewLine  + text ;
        //        commClass.email(cust.Email, subject, message);
        //    }
        //    commClass = null;

        //    return Ok();
        //}

    }
}

public class messageVM
{
    public string subject { get; set; }
    public string text { get; set; }
    public List<recipientVM> customers { get; set; }
}



