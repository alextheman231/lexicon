import { Page } from "@alextheman/components";
import { createItemQueryBoundary } from "@alextheman/components/QueryBoundary";
import Alert from "@mui/material/Alert";

import useUserInfoQuery from "src/resources/Users/queries/useUserInfoQuery";

interface SignUpConfirmationProps {
  userId: string;
}

function CompleteSignUpMessagePage({ userId }: SignUpConfirmationProps) {
  const { data, isPending, error } = useUserInfoQuery(userId);
  const QueryBoundary = createItemQueryBoundary({ query: { data, isLoading: isPending, error } });

  return (
    <Page title="Complete Sign-up">
      <Alert severity="info">
        NOTE: Email delivery is temporarily unavailable while we await production access from our
        email provider. In the meantime, please contact AlexMan123456 on GitHub to request
        assistance completing your registration.
      </Alert>
      <QueryBoundary.Data>
        {(user) => {
          return `We have sent an email to ${user.email}. Please follow the instructions in the email to complete sign-up.`;
        }}
      </QueryBoundary.Data>
    </Page>
  );
}

export default CompleteSignUpMessagePage;
