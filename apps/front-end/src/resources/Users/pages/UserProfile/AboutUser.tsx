import type { User } from "@lexicon/models";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";

interface AboutUserProps {
  user: User;
}

function AboutUser({ user }: AboutUserProps) {
  return (
    <Card>
      <CardHeader title="Description" />
      <Divider />
      <CardContent>{user.description}</CardContent>
    </Card>
  );
}

export default AboutUser;
