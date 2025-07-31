using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryApi.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedByAndDeletedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "Product",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DeletedBy",
                table: "DeletedProducts",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "Product");

            migrationBuilder.DropColumn(
                name: "DeletedBy",
                table: "DeletedProducts");
        }
    }
}
