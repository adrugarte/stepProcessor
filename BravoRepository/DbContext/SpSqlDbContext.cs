namespace BravoRepository.DbContext
{
    using System;
    using System.Data.Entity;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Linq;
    using BravoModel.Model;

    public partial class SpSqlDbContext : DbContext
    {
        public SpSqlDbContext()
            : base("name=SpSqlDbContext")
        {
        }

        public SpSqlDbContext(string conn)
            : base(conn)
        {
        }
        public virtual DbSet<House> Houses { get; set; }
        public virtual DbSet<room> Rooms { get; set; }
        public virtual DbSet<Person> Persons { get; set; }
        public virtual DbSet<Address> Addresses { get; set; }
        public virtual DbSet<Contact> Contacts { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
        }
    }
}
