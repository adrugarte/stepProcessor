using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StepsProcessor.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.App = "Testing App";
            ViewBag.Foot = "All rigths reserved";
            return View();
        }
    }
}
