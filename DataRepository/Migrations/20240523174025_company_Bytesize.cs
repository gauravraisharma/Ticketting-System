using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataRepository.Migrations
{
    /// <inheritdoc />
    public partial class company_Bytesize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ByteSize",
                table: "Companys",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ByteSize",
                table: "Companys");
        }
    }
}
