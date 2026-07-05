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
];

export default blogsFixtures;
