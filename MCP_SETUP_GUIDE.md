# Liahona Everyday - MCP Server Setup Guide

This guide will help you connect Claude to your Liahona Everyday app using the Model Context Protocol (MCP).

## What You'll Be Able to Do

Once set up, you can chat with Claude and ask it to:

- **Suggest study topics** based on your life situations
- **Find relevant scriptures** from the Book of Mormon
- **Create study topics** directly in your app
- **Add scripture sources** to your existing topics
- **View and manage** your study topics

## Prerequisites

1. ✅ Claude Desktop app installed
2. ✅ Liahona Everyday app running on `http://localhost:3000`
3. ✅ Node.js installed on your computer

## Step 1: Start Your App

Make sure your Liahona Everyday app is running:

```bash
cd /Users/mcklaynemarshall/app_ideas/liahona-everyday
npm run dev
```

Keep this running in a terminal window.

## Step 2: Configure Claude Desktop

### macOS

1. Open this file in a text editor:
   ```
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```

2. Add the following configuration:
   ```json
   {
     "mcpServers": {
       "liahona-everyday": {
         "command": "node",
         "args": [
           "/Users/mcklaynemarshall/app_ideas/liahona-everyday/mcp-server/index.js"
         ]
       }
     }
   }
   ```

3. Save the file.

### Windows

1. Open this file in a text editor:
   ```
   %APPDATA%\Claude\claude_desktop_config.json
   ```

2. Add the following configuration (update the path to match your system):
   ```json
   {
     "mcpServers": {
       "liahona-everyday": {
         "command": "node",
         "args": [
           "C:\\Users\\YourUsername\\app_ideas\\liahona-everyday\\mcp-server\\index.js"
         ]
       }
     }
   }
   ```

3. Save the file.

## Step 3: Restart Claude Desktop

Close and reopen Claude Desktop completely for the changes to take effect.

## Step 4: Verify Connection

In Claude Desktop, look for a 🔌 icon or MCP indicator. You should see "liahona-everyday" listed as a connected server.

## Example Conversations

Now you can chat with Claude about your Book of Mormon study! Try these:

### Get Topic Suggestions
```
"I'm struggling as a parent. Can you suggest some study topics
from the Book of Mormon that might help me?"
```

### Create a Study Topic
```
"Create a new topic for me about building faith during trials.
Put it in the personal category."
```

### Find Scriptures
```
"Find me some Book of Mormon scriptures about prayer that
I can study."
```

### Add Sources to a Topic
```
"I have a topic about faith. Can you add some relevant
Book of Mormon passages to it?"
```

### View Your Topics
```
"Show me all my study topics in the parenting category."
```

## Available Tools

Claude has access to these tools:

1. **suggest_topics** - Get topic ideas based on your role and situation
2. **search_scriptures** - Search for relevant Book of Mormon passages
3. **create_topic** - Create new study topics
4. **add_sources_to_topic** - Add scripture references to topics
5. **get_topics** - View all your topics

## Scripture Topics Available

The MCP server has curated Book of Mormon passages for these topics:

- Faith
- Prayer
- Repentance
- Family
- Love
- Courage
- Work
- Adversity
- Service

## Troubleshooting

### Claude Can't Connect

1. Make sure your app is running on `http://localhost:3000`
2. Check that the file path in the config is correct
3. Restart Claude Desktop completely
4. Check the Claude Desktop logs for errors

### Topics Not Saving

1. Verify the API routes are working by visiting:
   - http://localhost:3000/api/topics
   - http://localhost:3000/api/roles
2. Check browser console for errors
3. Make sure you're logged into the app

### MCP Server Errors

Check the terminal where your app is running for any error messages.

## Advanced Usage

You can also run the MCP server standalone for testing:

```bash
cd mcp-server
node index.js
```

This will start the server in stdio mode, which is how Claude Desktop connects to it.

## Next Steps

Once you're comfortable with the basics:

1. Ask Claude to create a study plan for the week
2. Have Claude suggest topics for all your different roles
3. Build a comprehensive study library with Claude's help
4. Let Claude help you find connections between different topics

Enjoy your enhanced Book of Mormon study experience! 📖
