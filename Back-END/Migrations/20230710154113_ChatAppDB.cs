using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace ChatApp.Migrations
{
    /// <inheritdoc />
    public partial class ChatAppDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "tokenVerification",
                columns: table => new
                {
                    username = table.Column<string>(type: "varchar(255)", nullable: false),
                    token = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_tokenVerification", x => x.username);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Username = table.Column<string>(type: "varchar(255)", nullable: false),
                    Id = table.Column<long>(type: "bigint", nullable: false),
                    Email = table.Column<string>(type: "longtext", nullable: false),
                    Password = table.Column<string>(type: "longtext", nullable: false),
                    Role = table.Column<string>(type: "longtext", nullable: false),
                    Job = table.Column<string>(type: "longtext", nullable: false),
                    Phone = table.Column<int>(type: "int", nullable: false),
                    PhotoBytes = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Username);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Conversations",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    OwnerState = table.Column<int>(type: "int", nullable: false),
                    DestState = table.Column<int>(type: "int", nullable: false),
                    OwnerUsername = table.Column<string>(type: "varchar(255)", nullable: false),
                    DestUsername = table.Column<string>(type: "varchar(255)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Conversations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Conversations_Users_DestUsername",
                        column: x => x.DestUsername,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Conversations_Users_OwnerUsername",
                        column: x => x.OwnerUsername,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    Mess = table.Column<string>(type: "longtext", nullable: false),
                    DateTime = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ConversationId = table.Column<long>(type: "bigint", nullable: false),
                    OwnerUsername = table.Column<string>(type: "varchar(255)", nullable: false),
                    DestUsername = table.Column<string>(type: "varchar(255)", nullable: false),
                    timeago = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_Conversations_ConversationId",
                        column: x => x.ConversationId,
                        principalTable: "Conversations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Messages_Users_DestUsername",
                        column: x => x.DestUsername,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Messages_Users_OwnerUsername",
                        column: x => x.OwnerUsername,
                        principalTable: "Users",
                        principalColumn: "Username",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_DestUsername",
                table: "Conversations",
                column: "DestUsername");

            migrationBuilder.CreateIndex(
                name: "IX_Conversations_OwnerUsername",
                table: "Conversations",
                column: "OwnerUsername");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ConversationId",
                table: "Messages",
                column: "ConversationId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_DestUsername",
                table: "Messages",
                column: "DestUsername");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_OwnerUsername",
                table: "Messages",
                column: "OwnerUsername");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "tokenVerification");

            migrationBuilder.DropTable(
                name: "Conversations");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
