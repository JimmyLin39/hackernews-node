const { GraphQLServer } = require('graphql-yoga')

let links = [{
  id: 'link-0',
  url: 'www.howtographql.com',
  description: 'Fullstack tutorial for GraphQL'
}]
let idCount = links.length;

const resolvers = {
  Query: {
    info: () => 'info',
    feed: () => links,
    link: (parent, args) => links.filter((link) => link.id === args.id)[0]
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
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
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`))