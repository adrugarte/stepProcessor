namespace BravoRepository.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Addresses",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Type = c.Byte(),
                        Address1 = c.String(maxLength: 500),
                        Address2 = c.String(maxLength: 250),
                        City = c.String(maxLength: 250),
                        State = c.String(maxLength: 250),
                        ZipCode = c.String(maxLength: 50),
                        personId = c.Int(nullable: false),
                        CreateTime = c.DateTime(nullable: false),
                        CreateUser = c.String(maxLength: 100),
                        ModifiedTime = c.DateTime(nullable: false),
                        Modifieduser = c.String(maxLength: 100),
                        Active = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.People", t => t.personId, cascadeDelete: true)
                .Index(t => t.personId);
            
            CreateTable(
                "dbo.Contacts",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Use = c.Byte(),
                        Type = c.Byte(),
                        Prefered = c.Boolean(nullable: false),
                        value = c.String(maxLength: 500),
                        Comment = c.String(maxLength: 2500),
                        personId = c.Int(nullable: false),
                        CreateTime = c.DateTime(nullable: false),
                        CreateUser = c.String(maxLength: 100),
                        ModifiedTime = c.DateTime(nullable: false),
                        Modifieduser = c.String(maxLength: 100),
                        Active = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.People", t => t.personId, cascadeDelete: true)
                .Index(t => t.personId);
            
            CreateTable(
                "dbo.People",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        LastName = c.String(maxLength: 500),
                        FirstName = c.String(maxLength: 250),
                        MiddleName = c.String(maxLength: 250),
                        BirthDate = c.DateTime(nullable: false),
                        Gender = c.Byte(nullable: false),
                        Email = c.String(maxLength: 500),
                        Source = c.String(maxLength: 250),
                        BirthCity = c.String(),
                        BirthCountry = c.String(),
                        CreateTime = c.DateTime(nullable: false),
                        CreateUser = c.String(maxLength: 100),
                        ModifiedTime = c.DateTime(nullable: false),
                        Modifieduser = c.String(maxLength: 100),
                        Active = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Contacts", "personId", "dbo.People");
            DropForeignKey("dbo.Addresses", "personId", "dbo.People");
            DropIndex("dbo.Contacts", new[] { "personId" });
            DropIndex("dbo.Addresses", new[] { "personId" });
            DropTable("dbo.People");
            DropTable("dbo.Contacts");
            DropTable("dbo.Addresses");
        }
    }
}
