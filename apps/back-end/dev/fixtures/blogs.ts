import { BlogState } from "@lexicon/models";

interface BlogFixture {
  id: string;
  authorId: string;
  title: string;
  state: BlogState;
  content: string;
}

const blogsFixtures: Array<BlogFixture> = [
  {
    id: "9e877451-aa4d-4930-beba-ef01d89b3df7",
    authorId: "10e1996c-d3a2-4320-bbd2-c0614f7b839f",
    title: "Welcome to Lexicon!",
    state: BlogState.PUBLISHED,
    content: "Welcome to my blogging site. This is a blog generated from development data.",
  },
  {
    id: "b56dc926-dcde-439b-aa54-91f1a9af89cb",
    authorId: "10e1996c-d3a2-4320-bbd2-c0614f7b839f",
    title: "GitHub Actions is stupid",
    state: BlogState.PUBLISHED,
    content:
      "Have you ever tried referencing a composite action from a reusable workflow, then calling that reusable workflow from a different repository? Would not recommend...",
  },
  {
    id: "f6794018-132b-4ab5-a1de-ea4ac20752e2",
    authorId: "5e5cc620-2c37-4c20-b2d7-84e99bf3b8ed",
    title: "Blog from my alt account",
    state: BlogState.PUBLISHED,
    content: "This is a published blog from my alt account.",
  },
  {
    id: "b3b95d93-f1da-4ca5-9961-62ce55094062",
    authorId: "5e5cc620-2c37-4c20-b2d7-84e99bf3b8ed",
    title: "Cool blog about deployment",
    state: BlogState.PUBLISHED,
    content: "This is a story about how I deployed Lexicon with AWS and Terraform.",
  },
];

export default blogsFixtures;
