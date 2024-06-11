using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataRepository.Migrations
{
    /// <inheritdoc />
    public partial class ThemeColor_company : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PrimaryColor",
                table: "Companys",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SecondaryColor",
                table: "Companys",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrimaryColor",
                table: "Companys");

            migrationBuilder.DropColumn(
                name: "SecondaryColor",
                table: "Companys");
        }
    }
}
