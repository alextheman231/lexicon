import type { BlogCollectionFactoryDataBase } from "factory/blogCollections";

interface BlogCollectionItemFixture {
  id: string;
  blogId: string;
}

interface BlogCollectionFixture extends Omit<BlogCollectionFactoryDataBase, "id" | "createdAt"> {
  id: string;
  userId: string;
  items: Array<BlogCollectionItemFixture>;
}

const blogCollectionsFixtures: Array<BlogCollectionFixture> = [
  {
    id: "ecb2dbaf-900f-47b0-92c4-7fd5cf6559bf",
    name: "Favourites",
    description: "My favourite blogs",
    userId: "10e1996c-d3a2-4320-bbd2-c0614f7b839f",
    items: [
      {
        id: "21082b23-ef67-4c41-aa46-c99c269a912f",
        blogId: "9e877451-aa4d-4930-beba-ef01d89b3df7",
      },
    ],
  },
  {
    id: "201baf77-3d24-4150-9259-e08f924dc809",
    name: "Software Development",
    description: "Blogs related to software development.",
    userId: "10e1996c-d3a2-4320-bbd2-c0614f7b839f",
    items: [
      {
        id: "7cd1ebf2-22c6-405c-aae7-6e86ca3e1e2e",
        blogId: "b56dc926-dcde-439b-aa54-91f1a9af89cb",
      },
      {
        id: "05440b96-17a8-45f5-b7c3-8c907f12fc7f",
        blogId: "b3b95d93-f1da-4ca5-9961-62ce55094062",
      },
    ],
  },
];

export default blogCollectionsFixtures;
