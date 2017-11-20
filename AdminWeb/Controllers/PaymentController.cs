using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using BravoModel.Model;
using BravoRepository;

namespace AdminWeb.Controllers
{
    public class PaymentController : ApiController
    {

        SQLRepository Repo;
        public PaymentController()
        {
            Repo = new SQLRepository();

        }

        public IHttpActionResult Get()
        {
            return Ok(Repo.payment.GetList().OrderByDescending(p=>p.CreateTime));
        }

        public IHttpActionResult post(Payment payment)
        {
            return Ok(Repo.payment.Add(payment));
        }


    }
}
