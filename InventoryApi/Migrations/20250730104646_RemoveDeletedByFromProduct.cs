using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryApi.Migrations
{
    /// <inheritdoc />
    public partial class RemoveDeletedByFromProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "Product");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "DeletedProducts",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "DeletedProducts");

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "Product",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
