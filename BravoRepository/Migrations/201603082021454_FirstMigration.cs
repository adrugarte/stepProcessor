namespace BravoRepository.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class FirstMigration : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.PersonServices",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ServiceDesc = c.String(),
                        Form = c.String(),
                        Price = c.Single(nullable: false),
                        PaidAmount = c.Single(nullable: false),
                        Created = c.DateTime(nullable: false),
                        UserCreate = c.String(maxLength: 50),
                        Finished = c.DateTime(),
                        PersonId = c.Int(nullable: false),
                        ServiceId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.People", t => t.PersonId, cascadeDelete: true)
                .ForeignKey("dbo.Services", t => t.ServiceId, cascadeDelete: true)
                .Index(t => t.PersonId)
                .Index(t => t.ServiceId);
            
            CreateTable(
                "dbo.Services",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ServiceDesc = c.String(maxLength: 1000),
                        Form = c.String(),
                        Price = c.Single(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.PersonServices", "ServiceId", "dbo.Services");
            DropForeignKey("dbo.PersonServices", "PersonId", "dbo.People");
            DropIndex("dbo.PersonServices", new[] { "ServiceId" });
            DropIndex("dbo.PersonServices", new[] { "PersonId" });
            DropTable("dbo.Services");
            DropTable("dbo.PersonServices");
        }
    }
}
