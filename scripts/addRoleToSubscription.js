#!/usr/bin/env node

/**
 * Script to add all members with a specific role to the HSC subscription
 * Usage: node scripts/addRoleToSubscription.js <guildId> <roleId>
 */

require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { connect } = require("mongoose");
const subscriptionService = require("../src/services/subscription.service");

// Connect to database
connect(process.env.DATABASE_URI, {
  connectTimeoutMS: 10000,
});

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

async function addRoleToHsc() {
  try {
    const args = process.argv.slice(2);

    if (args.length !== 2) {
      console.log(
        "Usage: node scripts/addRoleToSubscription.js <guildId> <roleId>",
      );
      console.log(
        "Example: node scripts/addRoleToSubscription.js 123456789 987654321",
      );
      process.exit(1);
    }

    const [guildId, roleId] = args;

    await client.login(process.env.DISCORD_TOKEN);
    console.log("Bot logged in successfully!");

    const guild = await client.guilds.fetch(guildId);
    if (!guild) {
      console.error("Guild not found!");
      process.exit(1);
    }

    const role = await guild.roles.fetch(roleId);
    if (!role) {
      console.error("Role not found!");
      process.exit(1);
    }

    console.log(`Found role: ${role.name} in guild: ${guild.name}`);
    console.log(`Role has ${role.members.size} members`);

    if (role.members.size === 0) {
      console.log("No members found with this role!");
      process.exit(0);
    }

    let successCount = 0;
    let existingCount = 0;
    let errorCount = 0;

    console.log("Starting to add members to HSC subscription...");

    for (const [memberId, member] of role.members) {
      try {
        // Check if already subscribed
        const existing = await subscriptionService.searchOne({
          userId: memberId,
          serviceName: "hsc",
        });

        if (existing?.isActive) {
          existingCount++;
          console.log(
            `✓ ${member.displayName} (${member.user.username}) - Already subscribed`,
          );
          continue;
        }

        // Subscribe the member
        await subscriptionService.subscribe({
          userId: memberId,
          userName: member.displayName || member.user.username,
          serviceName: "hsc",
        });

        successCount++;
        console.log(
          `✅ ${member.displayName} (${member.user.username}) - Subscribed successfully`,
        );
      } catch (error) {
        errorCount++;
        console.log(
          `❌ ${member.displayName} (${member.user.username}) - Error: ${error.message}`,
        );
      }
    }

    console.log("\n=== SUMMARY ===");
    console.log(
      `Total role members: ${successCount + existingCount + errorCount}`,
    );
    console.log(`Successfully subscribed: ${successCount}`);
    console.log(`Already subscribed: ${existingCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(
      `\nAll members with the "${role.name}" role have been processed!`,
    );
  } catch (error) {
    console.error("Script error:", error);
  } finally {
    await client.destroy();
    process.exit(0);
  }
}

// Handle process termination
process.on("SIGINT", async () => {
  console.log("\nReceived SIGINT. Cleaning up...");
  await client.destroy();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nReceived SIGTERM. Cleaning up...");
  await client.destroy();
  process.exit(0);
});

// Run the script
addRoleToHsc();
