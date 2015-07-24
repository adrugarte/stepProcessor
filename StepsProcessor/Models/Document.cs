using System;

namespace StepsProcessor.Models
{
    public class Document
    {
        public Document() {
            Type = new DocType();
        }
        public string Id { get; set;}
        public string Label { get; set; }
        public DocType Type { get; set; }
        public string Path { get; set; }
        public string OriginalName { get; set; }
        public DateTime Uploaded { get; set; }
        public DateTime Canceled { get; set; }
        public string CustomerId { get; set; }
        public string FileHash { get; set; }
    }

    public class DocType
    {
        public string Id { get; set; }
        public string TypeDesc { get; set; }



    }
}
