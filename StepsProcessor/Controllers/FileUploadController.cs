using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Web;
//using Dade_ImageRepo_Data.Models;
using System.Net.Http.Headers;
using System.IO;
using System.Security.Cryptography;
using System.Drawing;
using System.Drawing.Imaging;
using System.Reflection;
using System.Text;
using StepsProcessor.Models;
using StepsProcessor.Helpers;
using StepsProcessor.Controllers;

namespace ImageWebController.Controllers
{

    public class fileController : RavenDbController
    {
        //        private dbDataContext db = new dbDataContext();
        private string resMessage = string.Empty;
        private Int64 maxImgFileLength = 20000;
        private string CloudUrl = "";

        // Post api/file
        [HttpPost, Route("api/file")]
        public async Task<IHttpActionResult> UploadFile()
        {
            IHttpActionResult response; 
            int maxFileLengthOut;
            string strmaxFileLength = System.Web.Configuration.WebConfigurationManager.AppSettings["maxFileLength"];
            if (strmaxFileLength != null && int.TryParse(strmaxFileLength, out maxFileLengthOut)) maxImgFileLength = maxFileLengthOut;

            HttpResponseMessage task = default(HttpResponseMessage);

            HttpRequestMessage request = this.Request;
            if (!request.Content.IsMimeMultipartContent()) throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            string providerPath = HttpContext.Current.Server.MapPath("~/TmpFiles");
            if (!Directory.Exists(providerPath)) Directory.CreateDirectory(providerPath);
            CustomMultipartFormDataStreamProvider provider = new CustomMultipartFormDataStreamProvider(providerPath);

            try
            {
                await Request.Content.ReadAsMultipartAsync(provider);
                //Document Doc = null;
                //List<Document> _fileList = new List<Document>();
                //string _url = null;
                //if (Settings.Cloud != null && Settings.Cloud == "AzureCloud")
                //{
                //    var AzConfig = Session.Load<AzureConfig>().FirstOrDefault();
                //    if (AzConfig != null) _url = AzConfig.CloudFrontUrl + "/" + AzConfig.container + "/";
                //    CloudUrl = AzConfig.EndPointProtocol + "://" + AzConfig.AzureEndPoint + "/" + AzConfig.container + "/";
                //}
                //else if (Settings.Cloud != null && Settings.Cloud == "AmazonCloud") 
                //    _url = Session.Load<AwsS3Credential>().FirstOrDefault().cloudfronturl;
                //else
                //    _url = @"C:\\Files";

                //if (_url == null)
                //{
                //    task = Request.CreateResponse(HttpStatusCode.InternalServerError);
                //    task.Content = new StringContent("Error uploading files. Cloud settings are missing");
                //    return task;
                //}
                // This illustrates how to get the file names.
                //  Retrieven files to folder and file data
                Document Doc = null ;
                foreach (MultipartFileData file in provider.FileData)
                {
                    string _fileHash="";
                    Doc = new Document();
                    Doc.Path = processFile(file.LocalFileName, ref _fileHash);
                    if (Doc.Path == null && resMessage.Length > 0)
                    {
                        response = Ok(new StringContent("Erro al enviar el archivo: " + '\n' + '\n' + resMessage));
                        return response;
                    }
                    Doc.FileHash = _fileHash;
                    Doc.Uploaded = DateTime.Now;
                    Doc.CustomerId = "0000001";
                    if (provider.FormData.AllKeys.AsParallel().Contains("OriginalName")) Doc.OriginalName = provider.FormData["OriginalName"];
                    if (provider.FormData.AllKeys.AsParallel().Contains("TypeId")) Doc.Type.Id = provider.FormData["TypeId"];
                    if (provider.FormData.AllKeys.AsParallel().Contains("TypeDesc")) Doc.Type.TypeDesc = provider.FormData["TypeDesc"];
                    if (provider.FormData.AllKeys.AsParallel().Contains("Label")) Doc.Label = provider.FormData["Label"];
                }
                if (Doc != null) new DocumentController().PostDocument(Doc);
                response = Ok(Doc);

                //task = Request.CreateResponse(HttpStatusCode.OK);
                //if (resMessage == "") task.Content = new StringContent("Uploading success"); else task.Content = new StringContent("Some issues ocurred during file uploading: " + '\n' + '\n' + resMessage);
            }
            catch (Exception e)
            {
                response = InternalServerError(e);
                //task = Request.CreateResponse(HttpStatusCode.RequestEntityTooLarge);
                //task.Content = new StringContent("Failed uploading file(s)" + "/" + e.Message + "/ " + e.InnerException.Message);
            }
            return response;
        }

        #region processFile method
        private string processFile(string file, ref string fileHash)
        {
            string fullPath=null;
            FileStream fileStream = File.Open(file, FileMode.Open);
            fileStream.Position = 0;
            //Calculate hash.
            RIPEMD160 myRIPEMD160 = RIPEMD160Managed.Create();
            var _hash = fileHash = Hash.GetMd5Hash(myRIPEMD160.ComputeHash(fileStream));
            fileStream.Dispose();
            //Check If exist already exist file in Database with the same hash
            var existFile = Session.Advanced.DocumentQuery<Document>().Any(p => p.FileHash == _hash && p.Canceled == null);
            if (!existFile)
            {
             fullPath= SaveFile(file);
            }
            else
            {
                var existingFileName = Session.Query<Document>().Where(d => d.FileHash == _hash && d.Canceled == null).FirstOrDefault().OriginalName;
                logMessage(string.Format("The file {0} already exist in the repository with name {1}", Path.GetFileName(file), existingFileName));
            }

            return fullPath;
        }

        private string SaveFile(string file) {
            string FilePath = HttpContext.Current.Server.MapPath("~") + Setting.FilePath + "\\" + Path.GetFileNameWithoutExtension(file).Substring(0, 1).ToUpper() + "\\";
            if (!Directory.Exists(FilePath)){
                Directory.CreateDirectory(FilePath);
            }
            File.Copy(file, FilePath + Path.GetFileName(file), true);
            return FilePath + Path.GetFileName(file);
        }

        private void logMessage(string text)
        {
            resMessage += resMessage != "" ? "" + '\n' : "";
            resMessage += text;
        }

        #endregion


    }

    #region CustomMultipartFormDataStreamProvider

    public class CustomMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
    {
        public CustomMultipartFormDataStreamProvider(string path) : base(path) { }

        public override string GetLocalFileName(HttpContentHeaders headers)
        {
            return headers.ContentDisposition.FileName.Replace("\"", string.Empty);
        }
    }

    #endregion


}
