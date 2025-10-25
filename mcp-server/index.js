#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// Scripture database - Key Book of Mormon passages organized by topic
const SCRIPTURE_DATABASE = {
  faith: [
    { ref: "Alma 32:21", text: "Faith is not to have a perfect knowledge of things; therefore if ye have faith ye hope for things which are not seen, which are true." },
    { ref: "Ether 12:6", text: "Dispute not because ye see not, for ye receive no witness until after the trial of your faith." },
    { ref: "1 Nephi 7:12", text: "How is it that ye have forgotten that the Lord is able to do all things according to his will, for the children of men, if it so be that they exercise faith in him?" }
  ],
  prayer: [
    { ref: "Enos 1:4", text: "And my soul hungered; and I kneeled down before my Maker, and I cried unto him in mighty prayer and supplication for mine own soul." },
    { ref: "3 Nephi 18:20", text: "And whatsoever ye shall ask the Father in my name, which is right, believing that ye shall receive, behold it shall be given unto you." },
    { ref: "Alma 34:27", text: "Yea, and when you do not cry unto the Lord, let your hearts be full, drawn out in prayer unto him continually for your welfare." }
  ],
  repentance: [
    { ref: "Mosiah 4:10", text: "And again, believe that ye must repent of your sins and forsake them, and humble yourselves before God; and ask in sincerity of heart that he would forgive you." },
    { ref: "Alma 36:19", text: "And now, behold, when I thought this, I could remember my pains no more; yea, I was harrowed up by the memory of my sins no more." },
    { ref: "Helaman 5:11", text: "Remember that it is upon the rock of our Redeemer, who is Christ, the Son of God, that ye must build your foundation." }
  ],
  family: [
    { ref: "1 Nephi 8:12", text: "And as I partook of the fruit thereof it filled my soul with exceedingly great joy; wherefore, I began to be desirous that my family should partake of it also." },
    { ref: "Mosiah 4:14-15", text: "And ye will not suffer your children that they go hungry, or naked; neither will ye suffer that they transgress the laws of God, and fight and quarrel one with another." },
    { ref: "3 Nephi 22:13", text: "And all thy children shall be taught of the Lord; and great shall be the peace of thy children." }
  ],
  love: [
    { ref: "Moroni 7:47", text: "But charity is the pure love of Christ, and it endureth forever; and whoso is found possessed of it at the last day, it shall be well with him." },
    { ref: "2 Nephi 26:33", text: "For none of these iniquities come of the Lord; for he doeth that which is good among the children of men; and he doeth nothing save it be plain unto the children of men; and he inviteth them all to come unto him and partake of his goodness." },
    { ref: "Mosiah 4:26", text: "And now, for the sake of these things which I have spoken unto you—that is, for the sake of retaining a remission of your sins from day to day, that ye may walk guiltless before God—I would that ye should impart of your substance to the poor." }
  ],
  courage: [
    { ref: "Alma 56:45-47", text: "Now they never had fought, yet they did not fear death; and they did think more upon the liberty of their fathers than they did upon their lives; yea, they had been taught by their mothers, that if they did not doubt, God would deliver them." },
    { ref: "1 Nephi 3:7", text: "I will go and do the things which the Lord hath commanded, for I know that the Lord giveth no commandments unto the children of men, save he shall prepare a way for them that they may accomplish the thing which he commandeth them." },
    { ref: "Alma 43:45", text: "Nevertheless, the Nephites were inspired by a better cause, for they were not fighting for monarchy nor power but they were fighting for their homes and their liberties, their wives and their children, and their all, yea, for their rites of worship and their church." }
  ],
  work: [
    { ref: "2 Nephi 5:17", text: "And it came to pass that I, Nephi, did cause my people to be industrious, and to labor with their hands." },
    { ref: "Alma 38:12", text: "Use boldness, but not overbearance; and also see that ye bridle all your passions, that ye may be filled with love; see that ye refrain from idleness." },
    { ref: "Mosiah 4:27", text: "And see that all these things are done in wisdom and order; for it is not requisite that a man should run faster than he has strength." }
  ],
  adversity: [
    { ref: "Mosiah 24:14", text: "And I will also ease the burdens which are put upon your shoulders, that even you cannot feel them upon your backs, even while you are in bondage." },
    { ref: "2 Nephi 2:2", text: "Nevertheless, Jacob, my first-born in the wilderness, thou knowest the greatness of God; and he shall consecrate thine afflictions for thy gain." },
    { ref: "Ether 12:27", text: "And if men come unto me I will show unto them their weakness. I give unto men weakness that they may be humble; and my grace is sufficient for all men that humble themselves before me." }
  ],
  service: [
    { ref: "Mosiah 2:17", text: "And behold, I tell you these things that ye may learn wisdom; that ye may learn that when ye are in the service of your fellow beings ye are only in the service of your God." },
    { ref: "Alma 34:28", text: "And now behold, my beloved brethren, I say unto you, do not suppose that this is all; for after ye have done all these things, if ye turn away the needy, and the naked, and visit not the sick and afflicted, and impart of your substance, if ye have, to those who stand in need—I say unto you, if ye do not any of these things, behold, your prayer is vain." },
    { ref: "Mosiah 18:8-9", text: "Yea, and are willing to mourn with those that mourn; yea, and comfort those that stand in need of comfort, and to stand as witnesses of God at all times and in all things, and in all places." }
  ]
};

// Topic suggestions based on common life situations
const TOPIC_SUGGESTIONS = {
  personal: [
    { title: "Building Daily Faith", description: "How can I strengthen my faith through daily scripture study and prayer?" },
    { title: "Overcoming Discouragement", description: "Finding hope and strength during difficult times through the Book of Mormon." },
    { title: "Making Important Decisions", description: "Seeking divine guidance and wisdom for life's choices." },
    { title: "Developing Christlike Attributes", description: "Learning to be more patient, kind, and loving like the Savior." }
  ],
  marriage: [
    { title: "Strengthening Marriage Through Gospel Principles", description: "How can we apply Book of Mormon teachings to build a stronger marriage?" },
    { title: "Resolving Conflicts with Love", description: "Learning to handle disagreements with charity and understanding." },
    { title: "Unity in the Gospel", description: "Building spiritual unity as a couple through shared faith." },
    { title: "Supporting Each Other's Growth", description: "Helping each other progress spiritually and temporally." }
  ],
  parenting: [
    { title: "Teaching Children the Gospel", description: "How can I effectively teach my children about Jesus Christ using the Book of Mormon?" },
    { title: "Patience in Parenting", description: "Finding strength and patience when children are challenging." },
    { title: "Being a Righteous Example", description: "Living in a way that inspires children to follow Christ." },
    { title: "Balancing Discipline and Love", description: "Learning to correct with love while maintaining boundaries." }
  ],
  calling: [
    { title: "Magnifying Church Callings", description: "How can I better serve in my calling through Book of Mormon principles?" },
    { title: "Leading with Humility", description: "Learning servant leadership from Book of Mormon prophets." },
    { title: "Teaching with Power", description: "Helping others feel the Spirit through inspired teaching." },
    { title: "Ministering with Love", description: "Serving others as the Savior would." }
  ],
  work: [
    { title: "Integrity in the Workplace", description: "Maintaining honesty and righteousness in professional situations." },
    { title: "Finding Balance", description: "Balancing work demands with family and spiritual priorities." },
    { title: "Serving Others at Work", description: "Being a light and blessing to coworkers and colleagues." },
    { title: "Handling Work Stress", description: "Finding peace and perspective through gospel principles." }
  ]
};

class LiahonaEverydayServer {
  constructor() {
    this.server = new Server(
      {
        name: "liahona-everyday-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "suggest_topics",
          description: "Suggest study topics based on a role/category and optional description of the user's situation. Returns topic ideas with titles and descriptions.",
          inputSchema: {
            type: "object",
            properties: {
              role: {
                type: "string",
                description: "The role/category: personal, marriage, parenting, calling, or work",
                enum: ["personal", "marriage", "parenting", "calling", "work"]
              },
              situation: {
                type: "string",
                description: "Optional description of the user's situation or what they're struggling with"
              },
              count: {
                type: "number",
                description: "Number of suggestions to return (default 3)",
                default: 3
              }
            },
            required: ["role"]
          }
        },
        {
          name: "search_scriptures",
          description: "Search for relevant Book of Mormon scriptures based on a topic or keywords. Returns scripture references with text.",
          inputSchema: {
            type: "object",
            properties: {
              topic: {
                type: "string",
                description: "The topic to search for (e.g., faith, prayer, love, courage, adversity, service)"
              },
              keywords: {
                type: "string",
                description: "Keywords to search for in scripture text"
              },
              limit: {
                type: "number",
                description: "Maximum number of results to return (default 5)",
                default: 5
              }
            }
          }
        },
        {
          name: "create_topic",
          description: "Create a new study topic with suggested sources from the Book of Mormon. This will add the topic to the user's study list.",
          inputSchema: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "The title of the study topic"
              },
              description: {
                type: "string",
                description: "Detailed description of what the user wants to study or understand"
              },
              category: {
                type: "string",
                description: "The category: personal, marriage, parenting, calling, or work",
                enum: ["personal", "marriage", "parenting", "calling", "work"]
              },
              roleId: {
                type: "string",
                description: "Optional role ID if this should be associated with a specific role"
              }
            },
            required: ["title", "description", "category"]
          }
        },
        {
          name: "add_sources_to_topic",
          description: "Add scripture sources to an existing topic. Use this to enhance a topic with relevant Book of Mormon passages.",
          inputSchema: {
            type: "object",
            properties: {
              topicId: {
                type: "string",
                description: "The ID of the topic to add sources to"
              },
              sources: {
                type: "array",
                description: "Array of scripture sources to add",
                items: {
                  type: "object",
                  properties: {
                    title: {
                      type: "string",
                      description: "Title of the source (e.g., 'Alma 32 - Faith as a Seed')"
                    },
                    url: {
                      type: "string",
                      description: "URL to the scripture on churchofjesuschrist.org"
                    },
                    type: {
                      type: "string",
                      enum: ["scripture", "conference", "manual", "custom"]
                    }
                  },
                  required: ["title", "url", "type"]
                }
              }
            },
            required: ["topicId", "sources"]
          }
        },
        {
          name: "get_topics",
          description: "Get all study topics for the user, optionally filtered by role/category.",
          inputSchema: {
            type: "object",
            properties: {
              category: {
                type: "string",
                description: "Optional filter by category: personal, marriage, parenting, calling, or work"
              },
              roleId: {
                type: "string",
                description: "Optional filter by role ID"
              }
            }
          }
        }
      ]
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "suggest_topics":
            return await this.suggestTopics(args);

          case "search_scriptures":
            return await this.searchScriptures(args);

          case "create_topic":
            return await this.createTopic(args);

          case "add_sources_to_topic":
            return await this.addSourcesToTopic(args);

          case "get_topics":
            return await this.getTopics(args);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async suggestTopics(args) {
    const { role, situation, count = 3 } = args;

    let suggestions = TOPIC_SUGGESTIONS[role] || [];

    // If situation is provided, we could enhance suggestions with AI
    // For now, return the pre-defined suggestions
    const selectedSuggestions = suggestions.slice(0, count);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            role,
            situation: situation || "General topics",
            suggestions: selectedSuggestions
          }, null, 2)
        }
      ]
    };
  }

  async searchScriptures(args) {
    const { topic, keywords, limit = 5 } = args;

    let results = [];

    // Search by topic
    if (topic && SCRIPTURE_DATABASE[topic.toLowerCase()]) {
      results = SCRIPTURE_DATABASE[topic.toLowerCase()].slice(0, limit);
    }
    // Search by keywords
    else if (keywords) {
      const keywordLower = keywords.toLowerCase();
      for (const [topicKey, scriptures] of Object.entries(SCRIPTURE_DATABASE)) {
        for (const scripture of scriptures) {
          if (scripture.text.toLowerCase().includes(keywordLower) ||
              scripture.ref.toLowerCase().includes(keywordLower)) {
            results.push({ ...scripture, topic: topicKey });
            if (results.length >= limit) break;
          }
        }
        if (results.length >= limit) break;
      }
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            query: { topic, keywords },
            found: results.length,
            scriptures: results
          }, null, 2)
        }
      ]
    };
  }

  async createTopic(args) {
    const { title, description, category, roleId } = args;

    // Call the API to create the topic
    const response = await fetch('http://localhost:3000/api/topics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        category,
        roleId,
        sources: []
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create topic: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            message: "Topic created successfully!",
            topic: data.topic
          }, null, 2)
        }
      ]
    };
  }

  async addSourcesToTopic(args) {
    const { topicId, sources } = args;

    // First get the current topic
    const getResponse = await fetch(`http://localhost:3000/api/topics/${topicId}`);
    if (!getResponse.ok) {
      throw new Error(`Topic not found: ${topicId}`);
    }

    const { topic } = await getResponse.json();

    // Add new sources
    const updatedSources = [
      ...topic.sources,
      ...sources.map((src, idx) => ({
        id: `source-${Date.now()}-${idx}`,
        ...src
      }))
    ];

    // Update the topic
    const updateResponse = await fetch(`http://localhost:3000/api/topics/${topicId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sources: updatedSources
      })
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to update topic: ${updateResponse.statusText}`);
    }

    const data = await updateResponse.json();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            success: true,
            message: `Added ${sources.length} source(s) to topic "${topic.title}"`,
            topic: data.topic
          }, null, 2)
        }
      ]
    };
  }

  async getTopics(args) {
    const { category, roleId } = args;

    const response = await fetch('http://localhost:3000/api/topics');
    if (!response.ok) {
      throw new Error(`Failed to fetch topics: ${response.statusText}`);
    }

    const { topics } = await response.json();

    // Filter if requested
    let filteredTopics = topics;
    if (category) {
      filteredTopics = filteredTopics.filter(t => t.category === category);
    }
    if (roleId) {
      filteredTopics = filteredTopics.filter(t => t.roleId === roleId);
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            total: filteredTopics.length,
            filters: { category, roleId },
            topics: filteredTopics
          }, null, 2)
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Liahona Everyday MCP server running on stdio");
  }
}

const server = new LiahonaEverydayServer();
server.run().catch(console.error);
