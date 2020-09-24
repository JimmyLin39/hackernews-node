const { GraphQLServer } = require('graphql-yoga')
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]
let idCount = links.length;

const resolvers = {
  Query: {
    info: () => 'info',
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany()
    },
    link: (parent, args) => links.filter((link) => link.id === args.id)[0]
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description
        }
      });
      return newLink
    },
    updateLink: (parent, args) => {
      const { id, description, url } = args
      const link = {
        id,
        description,
        url
      }
      const updateLinkIndex = links.findIndex(link => link.id === id)
      links[updateLinkIndex] = link
      return link
    },
    deleteLink: (parent, args) => {
      const { id } = args
      links = links.filter(link => link.id !== id)
      return { id }
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: {
    prisma,
  }
});
server.start(() => console.log(`Server is running on http://localhost:4000`))