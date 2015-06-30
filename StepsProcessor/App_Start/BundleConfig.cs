using System.Web;
using System.Web.Optimization;

namespace StepsProcessor
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js",
                        "~/Scripts/jquery-ui-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/angularjs").Include(
                     "~/Scripts/angular.js",
                     "~/Scripts/angular-resource.js",
                     "~/Scripts/angular-route.js"));


            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new ScriptBundle("~/bundles/start").Include(
                      "~/App/ThirdPartComponent/datetimepicker.js",
                      "~/App/ThirdPartComponent/input_select.js",
                      "~/App/mainapp.js"));


            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/formgenerator.css",
                      "~/Content/site.css",
                      "~/Content/datetimepicker.css",
                      "~/Content/ag-input-select.css",
                      "~/Content/jquery-ui.css"));
        }
    }
}
