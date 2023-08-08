using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataRepository.Migrations
{
    /// <inheritdoc />
    public partial class TimezoneAddedInCompnay : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "TimeZone",
                table: "Companys",
                type: "varchar(500)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TimeZone",
                table: "Companys");
        }
    }
}
