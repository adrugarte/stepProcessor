using System;
using System.Text;
using System.IO;
using System.Runtime.InteropServices;


public static class Utils
{
    [DllImport(@"urlmon.dll", CharSet = CharSet.Auto)]
    private extern static System.UInt32 FindMimeFromData(
        System.UInt32 pBC,
        [MarshalAs(UnmanagedType.LPStr)] System.String pwzUrl,
        [MarshalAs(UnmanagedType.LPArray)] byte[] pBuffer,
        System.UInt32 cbSize,
        [MarshalAs(UnmanagedType.LPStr)] System.String pwzMimeProposed,
        System.UInt32 dwMimeFlags,
        out System.UInt32 ppwzMimeOut,
        System.UInt32 dwReserverd
    );


    internal static string getMimeFromFile(string filename)
    {
        if (!File.Exists(filename))
            throw new FileNotFoundException(filename + " not found");

        byte[] buffer = new byte[256];
        using (FileStream fs = new FileStream(filename, FileMode.Open))
        {
            if (fs.Length >= 256)
                fs.Read(buffer, 0, 256);
            else
                fs.Read(buffer, 0, (int)fs.Length);
        }
        try
        {
            System.UInt32 mimetype;
            FindMimeFromData(0, null, buffer, 256, null, 0, out mimetype, 0);
            System.IntPtr mimeTypePtr = new IntPtr(mimetype);
            string mime = Marshal.PtrToStringUni(mimeTypePtr);
            Marshal.FreeCoTaskMem(mimeTypePtr);
            return mime;
        }
        catch (Exception e)
        {
            return "unknown/unknown";
        }
    }


    public static Amazon.RegionEndpoint EndPointGet(string EndPoint)
    {

        return Amazon.RegionEndpoint.GetBySystemName(EndPoint);

    }

    public class Credentials : Amazon.Runtime.AWSCredentials
    {
        string _accessKeyId = "";
        string _secretKey = "";

        public Credentials(string AccessKeyId, string SecretKey)
        {
            _accessKeyId = AccessKeyId;
            _secretKey = SecretKey;

        }
        public override Amazon.Runtime.ImmutableCredentials GetCredentials()
        {
            return new Amazon.Runtime.ImmutableCredentials(_accessKeyId, _secretKey, null);
        }
    }

}
