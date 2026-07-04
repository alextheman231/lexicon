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
import Typography from "@mui/material/Typography";
import { MdHome, MdPerson } from "react-icons/md";

import { useAuth } from "src/AuthContextProvider";
import UserDropdown from "src/components/UserDropdown";
import createObjectQueryBoundary from "src/groups/QueryBoundary/creators/createObjectQueryBoundary";
import useMetadataQuery from "src/queries/useMetadataQuery";

interface NavigationBottomProps {
  children: ReactNode;
}

function NavigationBottom({ children }: NavigationBottomProps) {
  const { currentUser } = useAuth();

  const { data, isPending, error } = useMetadataQuery();
  const QueryBoundary = createObjectQueryBoundary({ query: { data, isLoading: isPending, error } });

  return (
    <Stack spacing={1}>
      <Card>
        <CardHeader
          title={
            <Button component={InternalLink} to="/">
              Lexicon
            </Button>
          }
          action={
            <Stack direction="row" spacing={2}>
              <QueryBoundary.Data>
                {(metadata) => {
                  return <Typography>Current SHA: {metadata.commitHash ?? "unknown"}</Typography>;
                }}
              </QueryBoundary.Data>
              <ThemeToggle />
              <UserDropdown />
            </Stack>
          }
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
