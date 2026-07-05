import { AuthProvider } from "@lexicon/models";

interface AuthProvidersFixtures {
  provider: AuthProvider;
  providerUserId: string;
}

interface UserFixture {
  id: string;
  username: string;
  displayName: string;
  description: string;
  email: string;
  dateOfBirth: Date;
  authProviders: Array<AuthProvidersFixtures>;
}

const usersFixtures: Array<UserFixture> = [
  {
    id: "10e1996c-d3a2-4320-bbd2-c0614f7b839f",
    username: "alex_man",
    displayName: "Alex Man",
    description: "I am the owner of Lexicon",
    email: "alex.man03888@gmail.com",
    dateOfBirth: new Date("2003-07-16T00:00:00.000Z"),
    authProviders: [
      {
        provider: AuthProvider.GOOGLE,
        providerUserId: "110146671422678973171",
      },
    ],
  },
  {
    id: "5e5cc620-2c37-4c20-b2d7-84e99bf3b8ed",
    username: "alextheman231231",
    displayName: "Alex's Second Account",
    description: "My alt account for testing.",
    email: "alextheman231231@gmail.com",
    dateOfBirth: new Date("2003-07-16T00:00:00.000Z"),
    authProviders: [
      {
        provider: AuthProvider.GOOGLE,
        providerUserId: "103479103835235904013",
      },
    ],
  },
  {
    id: "0f30b34c-326e-491e-b921-fb6d4d9722d2",
    username: "end_to_end_chromium_user",
    displayName: "Test User",
    description: "I have standards, you'd better have some too!",
    email: "test-chromium@lexiconblogs.com",
    dateOfBirth: new Date("2003-07-16T00:00:00.000Z"),
    authProviders: [
      {
        provider: AuthProvider.END_TO_END,
        providerUserId: "f6588594-f71b-4566-89fb-7928e3bae05e",
      },
    ],
  },
  {
    id: "9202fbde-490d-4219-a856-4440c20978a6",
    username: "end_to_end_webkit_user",
    displayName: "Test User",
    description: "Testing from Safari because Chrome is not the only browser that exists.",
    email: "test-webkit@lexiconblogs.com",
    dateOfBirth: new Date("2003-07-16T00:00:00.000Z"),
    authProviders: [
      {
        provider: AuthProvider.END_TO_END,
        providerUserId: "8f30b55d-c950-4f49-9cf3-77910b66b1e1",
      },
    ],
  },
  {
    id: "c1baa011-30dd-4dc6-b830-e24cd2241c69",
    username: "end_to_end_mobile_chrome_user",
    displayName: "Test User",
    description: "Testing from my mobile to ensure you're not being too desktop-centric.",
    email: "test-mobile-chrome@lexiconblogs.com",
    dateOfBirth: new Date("2003-07-16T00:00:00.000Z"),
    authProviders: [
      {
        provider: AuthProvider.END_TO_END,
        providerUserId: "f4bd7341e-de9a-42ba-acda-7c96f18fa3eb",
      },
    ],
  },
];

export default usersFixtures;
