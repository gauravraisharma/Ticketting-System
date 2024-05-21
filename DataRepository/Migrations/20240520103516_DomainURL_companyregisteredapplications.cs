using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataRepository.Migrations
{
    /// <inheritdoc />
    public partial class DomainURL_companyregisteredapplications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ApplicationURL",
                table: "CompanyRegisteredApplications",
                type: "nvarchar(2048)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(500)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DomainURL",
                table: "CompanyRegisteredApplications",
                type: "nvarchar(2048)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DomainURL",
                table: "CompanyRegisteredApplications");

            migrationBuilder.AlterColumn<string>(
                name: "ApplicationURL",
                table: "CompanyRegisteredApplications",
                type: "varchar(500)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(2048)",
                oldNullable: true);
        }
    }
}
