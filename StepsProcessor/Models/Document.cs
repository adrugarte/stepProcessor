using System;

namespace StepsProcessor.Models
{
    public class Document
    {
        public string Id { get; set;}
        public string Label { get; set; }
        public string Type { get; set; }
        public string Path { get; set; }
        public string OriginalName { get; set; }
        public DateTime Uploaded { get; set; }
        public DateTime Canceled { get; set; }
        public string CustomerId { get; set; }
    }
}
