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
    [Authorize]
    public class fileController : RavenDbController
    {
//        private dbDataContext db = new dbDataContext();
        private string resMessage = string.Empty;
        private Int64 maxImgFileLength = 20000;
        private string CloudUrl = "";

        // Post api/file
        [HttpPost, Route("api/file")]
        public async Task<HttpResponseMessage> UploadFile()
        {
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
                Document Doc = null;
                List<Document> _fileList = new List<Document>();
                string _url = null;
                if (Settings.Cloud != null && Settings.Cloud == "AzureCloud")
                {
                    var AzConfig = Session.Load<AzureConfig>().FirstOrDefault();
                    if (AzConfig != null) _url = AzConfig.CloudFrontUrl + "/" + AzConfig.container + "/";
                    CloudUrl = AzConfig.EndPointProtocol + "://" + AzConfig.AzureEndPoint + "/" + AzConfig.container + "/";
                }
                else if (Settings.Cloud != null && Settings.Cloud == "AmazonCloud") 
                    _url = Session.Load<AwsS3Credential>().FirstOrDefault().cloudfronturl;
                else
                    _url = @"C:\\Files";

                if (_url == null)
                {
                    task = Request.CreateResponse(HttpStatusCode.InternalServerError);
                    task.Content = new StringContent("Error uploading files. Cloud settings are missing");
                    return task;
                }
                // This illustrates how to get the file names.
                //  Retrieven files to folder and file data
                foreach (MultipartFileData file in provider.FileData)
                {
                    Doc = null;
                    Doc = processFile(_url, file.LocalFileName);
                    if (Doc != null) _fileList.Add(Doc);
                }

                // If files already exists 
                if (_fileList != null)
                {
                    //Retrieving metadata
                    FormDataObject frmData = new FormDataObject();
                    frmData.MetaList = new List<ImageMetadata>();
                    processFormData(provider, ref frmData);
                    //Uploading file and storing file data and metadata in BD
                        for (var i = 0; i < _fileList.Count(); i++)
                        {
                            var file = _fileList[i];
                            fileUploadAndSave(frmData, imageCtr, ref file);
                            _fileList[i] = file;
                        }

                }
                task = Request.CreateResponse(HttpStatusCode.OK);
                if (resMessage == "") task.Content = new StringContent("Uploading success"); else task.Content = new StringContent("Some issues ocurred during file uploading: " + '\n' + '\n' + resMessage);
            }
            catch (Exception e)
            {
                task = Request.CreateResponse(HttpStatusCode.RequestEntityTooLarge);
                task.Content = new StringContent("Failed uploading file(s)" + "/" + e.Message + "/ " + e.InnerException.Message);
            }
            return task;
        }


        #region processFile method
        private ImageStorage processFile(string _url, string file)
        {
            bool IsImage = fileclass.FindOutImage(file);
            ImageStorage fileModel = new ImageStorage();

            //Cleaning Header File Info before calculate hash***
            //string TmpFilePath = Path.GetFullPath(file.LocalFileName) + "\\TMP\\";
            if (IsImage)
            {
                clsImage.resize(file);
                fileclass.FileMetaInfoStoreAndClean(file, ref fileModel);
            }
            //END *** Cleaning Header File Info before calculate hash***
            FileStream fileStream = File.Open(file, FileMode.Open);
            fileModel.Lenght = fileStream.Length;
            fileStream.Position = 0;
            //Calculate hash.
            RIPEMD160 myRIPEMD160 = RIPEMD160Managed.Create();
            var _originalName = file;
            var _hash = Hash.GetMd5Hash(myRIPEMD160.ComputeHash(fileStream));
            //Check If exist already exist file in Database with the same hash
            var existFile = db.Dade_ImageStorages.Where(c => c.Hash == _hash && c.Active == true);
            if (existFile.Count() == 0)
            {
                fileModel.Hash = _hash;
                fileModel.OriginalFilename = _originalName;
                fileModel.Extension = Path.GetExtension(file);
                fileModel.Type = "";
                fileModel.StorageUrl = IsImage ? _url : CloudUrl;
                fileModel.DateUpload = DateTime.Now.ToUniversalTime();
            }
            else
            {
                fileModel = null;
                var existingFileName = existFile.FirstOrDefault().CloudFilename;
                logMessage(string.Format("The file {0} already exist in the repository with name {1}", Path.GetFileName(_originalName), existingFileName));
            }
            fileStream.Dispose();
            return fileModel;
        }
        #endregion

        #region processBase64Data
        private void processBase64Data(string _url, string providerPath, CustomMultipartFormDataStreamProvider provider, ref List<ImageStorage> _fileList)
        {
            ImageStorage fileModel = null;
            string fileName;
            foreach (var key in provider.FormData.AllKeys)
            {
                if (key.Length >= 4 && key.Substring(0, 4) == "file")
                {
                    foreach (var val in provider.FormData.GetValues(key))
                    {
                        byte[] binaryFile;
                        fileName = "";
                        try
                        {
                            string extension = val.Substring(val.IndexOf("/") + 1, val.IndexOf(";") - (val.IndexOf("/") + 1));
                            string Base64Str = val.Substring(val.IndexOf("base64,") + 7);
                            binaryFile = System.Convert.FromBase64String(Base64Str);
                            fileName = providerPath + "\\" + key + "." + extension;
                            System.IO.File.WriteAllBytes(fileName, binaryFile);
                        }
                        catch (System.ArgumentNullException)
                        {
                            System.Console.WriteLine("Base 64 string is null.");
                            continue;
                        }
                        catch (Exception e)
                        {
                            System.Console.WriteLine(e.Message);
                            continue;
                        }
                        clsImage.resize(fileName);
                        fileModel = new ImageStorage();
                        fileclass.FileMetaInfoStoreAndClean(fileName, ref fileModel);
                        fileModel.OriginalFilename = fileName;
                        FileStream fileStream = File.Open(fileName, FileMode.Open);
                        fileModel.Lenght = fileStream.Length;
                        fileStream.Position = 0;
                        //Calculate hash.
                        RIPEMD160 myRIPEMD160 = RIPEMD160Managed.Create();
                        var _hash = Hash.GetMd5Hash(myRIPEMD160.ComputeHash(fileStream));
                        //Check If already exist file in Database with the same hash
                        var existfile = db.Dade_ImageStorages.Where(c => c.Hash == _hash && c.Active == true);
                        if (existfile.Count() == 0)
                        {
                            //fileModel = new ImageStorage();
                            //fileclass.FileMetaInfoStoreAndClean(fileName, ref fileModel);
                            //fileModel.OriginalFilename = fileName;
                            //fileModel.Lenght = fileStream.Length;
                            ////******************************
                            fileModel.Hash = _hash;
                            fileModel.Extension = Path.GetExtension(fileName);
                            fileModel.Type = "Base64Encode";
                            fileModel.StorageUrl = _url;
                            fileModel.DateUpload = DateTime.Now.ToUniversalTime();
                            _fileList.Add(fileModel);
                        }
                        else
                        {
                            var existingFileName = existfile.FirstOrDefault().CloudFilename;
                            logMessage(string.Format("The file {0} already exist in the repository with name {1}", Path.GetFileName(fileName), existingFileName));
                        }
                        fileStream.Dispose();
                    }
                }
            }

        }
        #endregion

        #region processFormData
        private void processFormData(CustomMultipartFormDataStreamProvider provider, ref FormDataObject frmData)//ref byte contentTypeId, ref long linkTypeId, ref object linker)
        {
            foreach (var key in provider.FormData.AllKeys)
            {
                if (key.Length >= 4 && key.Substring(0, 4) == "file") continue;

                foreach (var val in provider.FormData.GetValues(key))
                {
                    switch (key)
                    {
                        case "contenttypeid":
                            frmData.contentTypeId = byte.Parse(val);
                            break;
                        case "linktypeid":
                            frmData.linkTypeId = byte.Parse(val);
                            break;
                        case "linkItem":
                            frmData.linkItem = (string)val;
                            break;
                        case "linkType":
                            frmData.linkType = byte.Parse(val);
                            break;
                        default:
                            int result;
                            if (int.TryParse(key, out result))
                            {
                                meta = new ImageMetadata();
                                //meta.GetType().GetProperty(key).SetValue(meta, val);
                                meta.MetadataId = int.Parse(key);
                                meta.Value = val;
                                frmData.MetaList.Add(meta);
                                Trace.WriteLine(string.Format("{0}: {1}", key, val));
                            }
                            break;
                    }
                }
            }
        }

        #endregion

        #region fileUploadAndSave
        private void fileUploadAndSave(FormDataObject frmData, imageController imageCtr, ref ImageStorage f)
        {
            ImageMetadata imgMeta = default(ImageMetadata);
            var fileUtil = new fileutils();

            string fullFilePath = f.OriginalFilename;
            //Findig out if its image file************
            ContentType cType = db.Dade_ContentTypes.Where(c => c.Id == frmData.contentTypeId).SingleOrDefault();
            if (!fileclass.CheckExtension(f.Extension, cType))
            {
                logMessage("The \"" + Path.GetFileName(f.OriginalFilename) + "\" file extension is not supported by this content type.");
                //resMessage = resMessage != "" ? ". " : "" + resMessage + "The \"" + Path.GetFileName(f.OriginalFilename) + "\" file extension is not supported by this content type.";
                goto borrar;
            }
            var isImage = fileclass.FindOutImage(f.OriginalFilename);
            if (frmData.contentTypeId == 1 && !isImage)
            {
                logMessage("The file \"" + Path.GetFileName(f.OriginalFilename) + "\" is not an image.");
                //resMessage = resMessage != "" ? ". " : "" + resMessage + "The file \"" + Path.GetFileName(f.OriginalFilename) + "\" is not an image.";
                goto borrar;
            };
            //Findig out if its image file************
            try
            {
                var guid = Guid.NewGuid();
                string sas = "";
                var cloudFileName = guid + Path.GetExtension(fullFilePath);
                f.CloudFilename = cloudFileName;
                f.Cloud = Settings.Cloud;
                f.StorageUrl = f.StorageUrl + cloudFileName;
                f.Image = isImage ? fileUtil.GetThumb(fullFilePath, 160, 160) : null;//fileclass.GetThumbnail(fullFilePath); 
                f.OriginalFilename = Path.GetFileName(fullFilePath);
                f.ContentTypeId = frmData.contentTypeId;
                if (frmData.linkTypeId != null) f.ExpectedLinkTypeId = (long)frmData.linkTypeId;

                //Uploading the file to the Aws Cloud
                ///*******************************************   
                if (Settings.Cloud == "AmazonCloud") cloudAction.AmazonUploadObject(cloudFileName, fullFilePath);
                if (Settings.Cloud == "AzureCloud") sas = cloudAction.AzureUploadObject(cloudFileName, fullFilePath);
                if (sas.Length > 0) f.StorageUrl = f.StorageUrl + sas;
                //END Uploading the file to the Aws Cloud
                ///*******************************************   

                //Storing file  data in BD****************
                var res = imageCtr.PostImage(f);
                //END Storing file  data in BD****************

                var fileId = f.Id;
                ///Store original and Cloud filename in the searching dictionary ///
                ///
                foreach (string word in f.OriginalFilename.Split(' '))
                {
                    if (word.Trim().Length > 0)
                    {
                        ///Adding original word to dictionary
                        db.Dade_TextSearchIndexImage.Add(new TextSearchIndexImage { Field = "OriginalFilename", ImageId = fileId, Word = word });
                        ///Adding reverse word to dictionary
                        db.Dade_TextSearchIndexImage.Add(new TextSearchIndexImage { Field = "OriginalFilename", ImageId = fileId, Word = clsImage.ReverseString(word) });
                    }
                }
                foreach (string word in f.CloudFilename.Split(' '))
                {
                    if (word.Trim().Length > 0)
                    {
                        ///Adding original word to dictionary
                        db.Dade_TextSearchIndexImage.Add(new TextSearchIndexImage { Field = "CloudFilename", ImageId = fileId, Word = word });
                        ///Adding reverse word to dictionary
                        db.Dade_TextSearchIndexImage.Add(new TextSearchIndexImage { Field = "CloudFilename", ImageId = fileId, Word = clsImage.ReverseString(word) });
                    }
                }
                ///Storing sent from client metadata********** 
                foreach (ImageMetadata m in frmData.MetaList)
                {
                    imgMeta = new ImageMetadata()
                    {
                        MetadataId = m.MetadataId,
                        Value = m.Value,
                        ImageStorageId = f.Id
                    };
                    var rs = imageCtr.PostImageMetadata(imgMeta);
                    ///Store meta value and meta fiedl in searching dictionary///
                    if (!string.IsNullOrEmpty(imgMeta.Value))
                    {
                        foreach (string word in imgMeta.Value.Split(' '))
                        {
                            if (word.Trim().Length > 0)
                            {
                                ///Adding original word to dictionary
                                db.Dade_TextSearchIndexImage.Add(new TextSearchIndexImage { Field = "metavalue", ImageId = fileId, Word = word });
                                ///Adding reverse word to dictionary
                                db.Dade_TextSearchIndexImage.Add(new TextSearchIndexImage { Field = "metavalue", ImageId = fileId, Word = clsImage.ReverseString(word) });
                            }
                        }
                    }
                    //imgMeta.Value.Split(' ').Select(n => db.Dade_TextSearchIndexImage.Add(new TextSearchIndexImage { Field = "metavalue", ImageId = fileId, Word = n }));
                    //var metafield = db.Dade_MetadatDef.Where(me => me.Id == imgMeta.MetadataId).Select(me=> me.Name).FirstOrDefault();
                    //if (!string.IsNullOrEmpty(metafield)) db.Dade_TextSearchIndexImage.Add(new TextSearchIndexImage { Field = "metafield", ImageId = fileId, Word = metafield });
                }
                ///END ***Storing sent from client metadata**********
                ///
                db.SaveChanges();


                //If there exists item to link
                if (frmData.linkItem != null)
                {
                    string errMsg = Linking(frmData.linkItem, f.Id, (int)frmData.linkType);
                    if (errMsg.Length > 0) logMessage("Error linking file '" + f.OriginalFilename + "', " + errMsg);
                }
                //END ***If there exists item to link

                if (File.Exists(fullFilePath))
                {
                    string folderPath = HttpContext.Current.Server.MapPath("~") + "Files\\" + Path.GetFileNameWithoutExtension(fullFilePath).Substring(0, 1).ToUpper() + "/";
                    if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);
                    File.Copy(fullFilePath, folderPath + Path.GetFileName(fullFilePath), true);
                }
            }
            catch (Exception e)
            {
                if (f.Id != null)
                {
                    var imgStr = db.Dade_ImageStorages.Find(f.Id);
                    imgStr.Active = false;
                    db.SaveChanges();
                }
                logMessage("Error uploading file '" + f.OriginalFilename + "', " + e.Message);
            }
        borrar: if (string.IsNullOrEmpty(f.OriginalFilename)) logMessage("--"); //if (File.Exists(fullFilePath)) File.Delete(fullFilePath);
        }

        private string Linking(string ItemId, long ImageId, int linkTypeId)
        {
            long _itemId = default(long);
            if (linkTypeId == 1)
            {
                var product = db.Dade_ProductCatalog.Where(c => c.ProductId == ItemId).FirstOrDefault();
                if (product != null) _itemId = product.Id; else return string.Format("Product {0} doesn't exist", ItemId);
            }
            long i;
            if (_itemId == 0 && long.TryParse(ItemId, out i)) _itemId = i;
            try
            {
                ImageLinkController imgLink = new ImageLinkController();
                imgLink.Link(new ImageWebController.Controllers.link { imageId = ImageId, itemId = _itemId, linkTypeId = linkTypeId });
                imgLink.Dispose();
            }
            catch (Exception e)
            {
                return e.Message;
            }

            return "";
        }

        [HttpDelete, Route("api/file/{id:int}")]
        //[ResponseType(typeof(ImageStorage))]
        public IHttpActionResult DeleteFile(int id)
        {
            string errorDn = string.Empty;
            try
            {
                /// If file exists in database
                if (db.Dade_ImageStorages.Any(c => c.Id == id && c.Active == true))
                {
                    //Retrieve the cloudfilename and delete it from cloud
                    var img = db.Dade_ImageStorages.Where(c => c.Id == id).FirstOrDefault();
                    cloudAction.DeleteObject(img.Cloud, img.CloudFilename, ref errorDn);
                    if (errorDn != "")
                    {
                        return InternalServerError(new Exception(errorDn));
                    }
                    else
                    {
                        using (imageController imageCtr = new imageController())
                        {
                            string res = imageCtr.DeleteImage(id);
                            if (res != "" && res != null)
                            {
                                return InternalServerError(new Exception(res));
                            }
                        }
                    }
                }
                else return NotFound();
            }
            catch (Exception e)
            {
                return InternalServerError(e);
            }
            return Ok();

        }
        #endregion


        private void LinkToItem(BatchLine Line)
        {
            IHttpActionResult res;
            long itemId = 0;
            if (Line.LinkType == 1)
            {
                if (db.Dade_ProductCatalog.AsNoTracking().Count(p => p.ProductId == Line.productSKU) > 0) itemId = db.Dade_ProductCatalog.AsNoTracking().Where(p => p.ProductId == Line.productSKU).FirstOrDefault().Id;
            }
            else if (Line.LinkType == 2)
            {
                if (db.Dade_Manufacture.AsNoTracking().Count(p => p.UniqueId == Line.productSKU) > 0) itemId = db.Dade_Manufacture.AsNoTracking().Where(p => p.UniqueId == Line.productSKU).FirstOrDefault().Id;
            }
            var m = 0;
            if (itemId != 0 && Line.LinkType != 0)
            {
                ImageLinkController imgLink = new ImageLinkController();
                res = imgLink.Link(new ImageWebController.Controllers.link { imageId = Line.imgStorage.Id, itemId = itemId, linkTypeId = (byte)Line.LinkType });
                m += 1;
            }
            else logMessage(string.Format("The product SKU {0} does not exist", Line.productSKU));
        }


        private bool BatchImport(string file, string _url, ref List<BatchLine> UpFileList)
        {
            bool isImage = false;
            List<object> missFiles = new List<object>();

            ImageStorage imgStorage = null;
            string[] line;
            var fileList = File.ReadAllText(file).Split('\n');

            foreach (var f in fileList)
            {
                line = f.Split(',');
                isImage = false;
                if (File.Exists(line[0]))
                {
                    imgStorage = null;
                    imgStorage = processFile(_url, line[0]);
                    if (imgStorage != null)
                    {
                        byte n = 0;
                        UpFileList.Add(new BatchLine { imgStorage = imgStorage, productSKU = line[1], LinkType = byte.TryParse(line[2], out n) ? Convert.ToByte(n) : (byte)0 });
                    }
                }
                else logMessage(string.Format("File {0} does not exist", line[0]));
            }
            return true;
        }


        private void logMessage(string text)
        {
            resMessage += resMessage != "" ? "" + '\n' : "";
            resMessage += text;
        }
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


    #region fileclass class

    static class fileclass
    {

        static public void FileMetaInfoStoreAndClean(string pathFile, ref ImageStorage fileModel)
        {
            using (Image img = new Bitmap(pathFile))
            {
                fileModel.Width = img.Width;
                fileModel.Height = img.Height;

                #region --------comented code-----------


                //Comented code below reads all header file tags and stores them in database
                //System.Text.ASCIIEncoding encoding = new System.Text.ASCIIEncoding();

                //ArrayList Lista = new ArrayList();
                //PropertyItem[] propItems = Img.PropertyItems;
                //ImageTag ImgTag = default(ImageTag);
                //foreach (PropertyItem pItem in propItems) 
                //{
                //    var tagCode = string.Format("0x{0:X4}", pItem.Id);
                //    var TagDef = db.Dade_Image_Tag_Defs.Where(p => p.TagCode == tagCode).SingleOrDefault();
                //    if (TagDef == null)
                //    {
                //        TagDef = new ImageTagDef() { TagCode = tagCode, PropertyTag = "unknown" };
                //        db.Dade_Image_Tag_Defs.Add(TagDef);
                //        db.SaveChanges();
                //    }
                //    short PropId = TagDef.Id;
                //    string valuestr=null;
                //    Int64 valueint=default(long);
                //    double valuedbl=default(double);
                //    switch (pItem.Type)
                //    {
                //        case 1:
                //            Console.WriteLine("Case 1");
                //            break;
                //        case 2:
                //            valuestr = encoding.GetString(pItem.Value);
                //            break;
                //        case 3:
                //            valueint = BitConverter.ToInt16(pItem.Value, 0);
                //            break;
                //        case 4:
                //            valueint = BitConverter.ToInt32(pItem.Value, 0);
                //            break;
                //        case 5:
                //            int dividendo = BitConverter.ToInt32(pItem.Value, 0) ;
                //            int divisor = BitConverter.ToInt32(pItem.Value, 4) ;
                //            valuedbl = (double)dividendo/divisor ;
                //            break;
                //        case 9:
                //            valueint = BitConverter.ToInt64(pItem.Value, 0);
                //            break;
                //        case 10:
                //            valuedbl = (double)BitConverter.ToInt32(pItem.Value, 0) / (double)BitConverter.ToInt32(pItem.Value, 4);
                //            break;
                //        default:
                //            valuestr = "";
                //            break;
                //    }
                //    var valor = valuestr != null ? valuestr : valueint != 0 ? valueint.ToString() : valuedbl != 0.0 ? valuedbl.ToString() : "";
                //    //Trace.WriteLine("Code: " + tagCode + " / Desc:" + PropTag + " / Type: " + pItem.Type + " / Value: " + valor);
                //    if (valor != "") 
                //    { 
                //        ImgTag = new ImageTag() {ImageId = ImgStorageId, TagId = PropId, Value=valor};
                //        db.Dade_Image_Tags.Add(ImgTag);
                //    }
                //}
                //db.SaveChanges();

                ///Code below Remove all Header Info
                ///


                #endregion

                string CurrentTime = DateTime.Now.ToString("yyyy:MM:dd HH:mm:ss");
                int[] ListOfProp = img.PropertyIdList;
                foreach (int PropId in ListOfProp)
                {
                    var PI = img.GetPropertyItem(PropId);
                    switch (PropId)
                    {
                        case 30:
                        case 31:
                        case 50:
                        case 51:
                            break;
                        case 306:
                        case 36867:
                        case 36868:
                            SetPropItemValue(CurrentTime, ref PI);
                            break;
                        case 33434:
                            SetPropItemValue("", ref PI);
                            break;
                        default:
                            SetPropItemValue("", ref PI);
                            break;
                    }

                    img.SetPropertyItem(PI);
                }
                //Code below Set CopyRight Property tag to DadePaper
                if (!ListOfProp.Contains((int)33432))
                    img.SetPropertyItem(CreatePropItem("DadePaper", (byte)2, (int)33432));
                else
                {
                    var PI = img.GetPropertyItem((int)33432);
                    SetPropItemValue("DadePaper", ref PI);
                    img.SetPropertyItem(PI);
                }
                if (!ListOfProp.Contains((int)315))
                    img.SetPropertyItem(CreatePropItem("DadePaper;", (byte)2, (int)315));
                else
                {
                    var PI = img.GetPropertyItem((int)315);
                    SetPropItemValue("DadePaper;", ref PI);
                    img.SetPropertyItem(PI);
                }

                img.Save(pathFile + ".copy");
                img.Dispose();
                File.Delete(pathFile);
                File.Move(pathFile + ".copy", pathFile);
                File.Delete(pathFile + ".copy");
            }
        }


        static private PropertyItem CreatePropItem(object value, byte type, int Id)
        {
            PropertyItem pI = createPropertyItem();
            pI.Id = Id;
            pI.Type = type;
            pI.Value = Encoding.ASCII.GetBytes((string)value + char.MinValue);
            pI.Len = pI.Value.Length;
            return pI;
        }

        static private void SetPropItemValue(object _value, ref PropertyItem pI)
        {
            switch (pI.Type)
            {
                case 2:
                    pI.Value = Encoding.ASCII.GetBytes((string)_value + char.MinValue);//Add \0 to the end;
                    break;
                case 3:
                    int len = pI.Value.Length;
                    //PI.Value = new byte[len];
                    break;
                case 4:
                    pI.Value = new byte[4] { 0, 0, 0, 0 };
                    break;
                case 5:
                    pI.Value = new byte[8] { 0, 0, 0, 0, 0, 0, 0, 0 };
                    break;
                case 7:
                    pI.Value = new byte[4] { 0, 0, 0, 0 };
                    break;
                case 10:
                    pI.Value = new byte[8] { 0, 0, 0, 0, 0, 0, 0, 0 };
                    break;
                default:
                    pI.Value = new byte[0];
                    break;
            }
        }


        static private PropertyItem createPropertyItem()
        {
            var ci = typeof(PropertyItem);
            var o = ci.GetConstructor(BindingFlags.NonPublic | BindingFlags.Instance | BindingFlags.Public, null, new Type[] { }, null);

            return (PropertyItem)o.Invoke(null);
        }



        internal static bool FindOutImage(string filePath)
        {
            byte[] array = default(byte[]);
            string[] formats = { "ÿØÿ", "II*", "BM", "GIF", "‰PN" };
            string str = string.Empty;
            using (FileStream st = new FileStream(filePath, FileMode.Open))
            {
                int count = 3;
                int offset = 0;
                array = new byte[count];
                st.Read(array, offset, count);
                str = System.Text.Encoding.Default.GetString(array);
                st.Close();
                st.Dispose();
            };


            if (formats.Contains(str)) return true; else if (formats.Contains(str.Substring(0, 2))) return true; else return false;
        }

        internal static bool CheckExtension(string ext, ContentType cType)
        {
            if (cType != null)
            {
                string[] Extensions = cType.Extensions.Split(new char[] { ';' });
                return Extensions.Contains(ext);
            }
            return false;
        }
    }

    #endregion


    #region fileutils class

    public class fileutils
    {


        public bool ThumbnailCallback()
        {
            return false;
        }
        public byte[] GetThumb(string pathFile, int width, int heigth)
        {
            byte[] vector = default(byte[]);
            Image.GetThumbnailImageAbort myCallback =
            new Image.GetThumbnailImageAbort(ThumbnailCallback);
            Bitmap myBitmap = new Bitmap(pathFile);
            Image myThumbnail = myBitmap.GetThumbnailImage(width, heigth, myCallback, IntPtr.Zero);
            using (var ms = new MemoryStream())
            {
                myThumbnail.Save(ms, System.Drawing.Imaging.ImageFormat.Gif);
                vector = ms.ToArray();
                ms.Close();
                ms.Dispose();
            }
            myThumbnail.Dispose();
            myBitmap.Dispose();

            return vector;
        }


    }

    #endregion

    static class cloudAction
    {
        static clsCloudStore Amazoncloud;
        static clsAzureActions AzureCloud;
        internal static void AmazonUploadObject(string Keyname, string fullFilePath)
        {
            if (Settings.Cloud == "AmazonCloud")
            {
                Amazoncloud = new clsCloudStore();
                Amazoncloud.Keyname = Keyname;
                Amazoncloud.ObjectUpload(fullFilePath);
                Amazoncloud = null;
            };

        }

        internal static string AzureUploadObject(string cloudFileName, string fullFilePath)
        {
            string bloburi = "";
            if (Settings.Cloud == "AzureCloud")
            {
                AzureCloud = new clsAzureActions();
                bloburi = AzureCloud.ObjectUpload(cloudFileName, fullFilePath);
                AzureCloud = null;
            };

            return bloburi;
        }

        internal static void DeleteObject(string Cloud, string cloudFileName, ref string error)
        {
            if (Cloud == "AzureCloud")
            {
                AzureCloud = new clsAzureActions();
                AzureCloud.DeleteObject(cloudFileName, ref error);
                AzureCloud = null;
            };
            if (Cloud == "AmazonCloud")
            {
                Amazoncloud = new clsCloudStore();
                Amazoncloud.Keyname = cloudFileName;
                Amazoncloud.DeleteObject(ref error);
                Amazoncloud = null;
            };

        }


    }

    class BatchLine
    {
        public ImageStorage imgStorage { get; set; }
        public string productSKU { get; set; }
        public byte LinkType { get; set; }
    }

    class FormDataObject
    {
        internal List<ImageMetadata> MetaList { get; set; }
        internal byte contentTypeId { get; set; }
        internal long? linkTypeId { get; set; }
        internal int? linkType { get; set; }
        internal string linkItem { get; set; }
    }

    public enum linkType : byte
    {
        Product = 1,
        Category = 2,
        Manufacture = 3
    }
}

