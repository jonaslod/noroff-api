import { SwaggerOptions } from "@fastify/swagger"
import { jsonSchemaTransform } from "fastify-type-provider-zod"
import { version } from "../../package.json"

const swaggerOptions: SwaggerOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
  staticCSP: true,
  swagger: {
    info: {
      title: "Noroff API",
      description: "Noroff API to be used in assignments",
      version
    },
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      { name: "status", description: "Health check endpoint" },
      { name: "auth", description: "Auth related endpoints" },
      { name: "books", description: "Books related endpoints" },
      { name: "cat-facts", description: "Cat Facts related endpoints" },
      { name: "jokes", description: "Jokes related endpoints" },
      { name: "nba-teams", description: "NBA teams related endpoints" },
      { name: "old-games", description: "Old games related endpoints" },
      { name: "quotes", description: "Quotes related endpoints" },
      { name: "online-shop", description: "Online shop related endpoints" },
      { name: "social-auth", description: "Social auth related endpoints" },
      { name: "social-profiles", description: "Social profiles related endpoints" },
      { name: "social-posts", description: "Social posts related endpoints" },
      { name: "auction-auth", description: "Auction auth related endpoints" },
      { name: "auction-profiles", description: "Auction profiles related endpoints" },
      { name: "auction-listings", description: "Auction listings related endpoints" }
    ],
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description: 'Format "Bearer [token]"'
      }
    }
  },
  transform: jsonSchemaTransform
}

export default swaggerOptions
