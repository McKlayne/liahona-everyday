# Liahona Everyday MCP Server

Model Context Protocol (MCP) server for the Liahona Everyday Book of Mormon study app. This allows Claude to help you create study topics and add relevant scripture sources.

## Features

The MCP server provides the following tools:

### 1. `suggest_topics`
Get topic suggestions based on your role and situation.

**Parameters:**
- `role` (required): personal, marriage, parenting, calling, or work
- `situation` (optional): Description of what you're struggling with
- `count` (optional): Number of suggestions (default: 3)

**Example:**
```json
{
  "role": "parenting",
  "situation": "My teenage son is struggling with faith",
  "count": 3
}
```

### 2. `search_scriptures`
Search for relevant Book of Mormon passages.

**Parameters:**
- `topic` (optional): faith, prayer, love, courage, adversity, service, etc.
- `keywords` (optional): Keywords to search in scripture text
- `limit` (optional): Max results (default: 5)

**Example:**
```json
{
  "topic": "faith",
  "limit": 3
}
```

### 3. `create_topic`
Create a new study topic with title and description.

**Parameters:**
- `title` (required): Topic title
- `description` (required): What you want to study
- `category` (required): personal, marriage, parenting, calling, or work
- `roleId` (optional): Specific role ID

**Example:**
```json
{
  "title": "Building Faith Through Trials",
  "description": "Learning to trust God during difficult times at work",
  "category": "work"
}
```

### 4. `add_sources_to_topic`
Add scripture sources to an existing topic.

**Parameters:**
- `topicId` (required): The topic ID
- `sources` (required): Array of sources with title, url, and type

**Example:**
```json
{
  "topicId": "1234567890",
  "sources": [
    {
      "title": "Alma 32 - Faith as a Seed",
      "url": "https://www.churchofjesuschrist.org/study/scriptures/bofm/alma/32",
      "type": "scripture"
    }
  ]
}
```

### 5. `get_topics`
Get all topics, optionally filtered by category or role.

**Parameters:**
- `category` (optional): Filter by category
- `roleId` (optional): Filter by role ID

## Installation

1. Install dependencies:
```bash
cd mcp-server
npm install
```

2. Make sure your Next.js app is running on `http://localhost:3000`

## Usage with Claude Desktop

Add this server to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "liahona-everyday": {
      "command": "node",
      "args": ["/Users/mcklaynemarshall/app_ideas/liahona-everyday/mcp-server/index.js"]
    }
  }
}
```

Replace the path with your actual path to the MCP server.

## Example Conversations with Claude

Once connected, you can ask Claude things like:

- "Suggest some topics I could study about strengthening my marriage"
- "Find me scriptures about courage that I can add to my study topic"
- "Create a new topic about teaching my children the gospel"
- "Add some Book of Mormon sources to my faith topic"
- "What topics do I have in my personal category?"

Claude will use these tools to help you build your study plan!

## Scripture Database

The server includes a curated database of Book of Mormon passages organized by topic:
- Faith
- Prayer
- Repentance
- Family
- Love
- Courage
- Work
- Adversity
- Service

Each passage includes the reference and key text.

## Development

To add more scripture topics or improve the database, edit the `SCRIPTURE_DATABASE` and `TOPIC_SUGGESTIONS` objects in `index.js`.
