import type { ReactNode } from "react";

import {
  NavigationBottom as AlexNavigationBottom,
  InternalLink,
} from "@alextheman/components/routing";
import { ThemeToggle } from "@alextheman/components/theme";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Stack from "@mui/material/Stack";
import { MdHome, MdPerson } from "react-icons/md";

import { useAuth } from "src/AuthContextProvider";

interface NavigationBottomProps {
  children: ReactNode;
}

function NavigationBottom({ children }: NavigationBottomProps) {
  const { currentUser } = useAuth();

  return (
    <Stack spacing={1}>
      <Card>
        <CardHeader
          title={
            <Button component={InternalLink} to="/">
              Lexicon
            </Button>
          }
          action={<ThemeToggle />}
        />
      </Card>
      <AlexNavigationBottom
        navItems={[
          {
            label: "Homepage",
            icon: <MdHome />,
            to: "/",
          },
          {
            label: "Profile",
            icon: <MdPerson />,
            to: currentUser === null ? "/sign-in" : `/users/${currentUser?.id}`,
          },
        ]}
      >
        {children}
      </AlexNavigationBottom>
    </Stack>
  );
}

export default NavigationBottom;
