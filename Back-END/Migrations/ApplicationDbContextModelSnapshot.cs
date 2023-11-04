﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace ChatApp.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.5")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("ChatApp.Models.Conversation", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<int>("DestState")
                        .HasColumnType("int");

                    b.Property<string>("DestUsername")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<int>("OwnerState")
                        .HasColumnType("int");

                    b.Property<string>("OwnerUsername")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id");

                    b.HasIndex("DestUsername");

                    b.HasIndex("OwnerUsername");

                    b.ToTable("Conversations");
                });

            modelBuilder.Entity("ChatApp.Models.Message", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    b.Property<long>("ConversationId")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("DateTime")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("DestUsername")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Mess")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("OwnerUsername")
                        .IsRequired()
                        .HasColumnType("varchar(255)");

                    b.Property<string>("timeago")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Id");

                    b.HasIndex("ConversationId");

                    b.HasIndex("DestUsername");

                    b.HasIndex("OwnerUsername");

                    b.ToTable("Messages");
                });

            modelBuilder.Entity("ChatApp.Models.TokenVerfication", b =>
                {
                    b.Property<string>("username")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("token")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("username");

                    b.ToTable("tokenVerification");
                });

            modelBuilder.Entity("ChatApp.Models.User", b =>
                {
                    b.Property<string>("Username")
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<long>("Id")
                         .HasColumnType("bigint");

                    b.Property<string>("Job")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<int>("Phone")
                        .HasColumnType("int");

                    b.Property<string>("PhotoBytes")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Role")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.HasKey("Username");

                    b.HasIndex("Username")
                        .IsUnique();

                    b.ToTable("Users");
                });

            modelBuilder.Entity("ChatApp.Models.Conversation", b =>
                {
                    b.HasOne("ChatApp.Models.User", "Dest")
                        .WithMany()
                        .HasForeignKey("DestUsername")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ChatApp.Models.User", "Owner")
                        .WithMany("Conversations")
                        .HasForeignKey("OwnerUsername")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Dest");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("ChatApp.Models.Message", b =>
                {
                    b.HasOne("ChatApp.Models.Conversation", "Conversation")
                        .WithMany("Messages")
                        .HasForeignKey("ConversationId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ChatApp.Models.User", "Dest")
                        .WithMany()
                        .HasForeignKey("DestUsername")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ChatApp.Models.User", "Owner")
                        .WithMany()
                        .HasForeignKey("OwnerUsername")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Conversation");

                    b.Navigation("Dest");

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("ChatApp.Models.Conversation", b =>
                {
                    b.Navigation("Messages");
                });

            modelBuilder.Entity("ChatApp.Models.User", b =>
                {
                    b.Navigation("Conversations");
                });
#pragma warning restore 612, 618
        }
    }
}
