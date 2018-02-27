namespace BravoRepository.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Payments : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Payments",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        PaidBy = c.String(),
                        PaidAmmount = c.Decimal(nullable: false, precision: 18, scale: 2),
                        ServiceId = c.Int(nullable: false),
                        CreateTime = c.DateTime(nullable: false),
                        CreateUser = c.String(maxLength: 100),
                        ModifiedTime = c.DateTime(nullable: false),
                        Modifieduser = c.String(maxLength: 100),
                        Active = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.PersonServices", t => t.ServiceId, cascadeDelete: true)
                .Index(t => t.ServiceId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Payments", "ServiceId", "dbo.PersonServices");
            DropIndex("dbo.Payments", new[] { "ServiceId" });
            DropTable("dbo.Payments");
        }
    }
}
