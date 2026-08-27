import type { UserProfile } from "@lexicon/models";

import { Page } from "@alextheman/components";
import { FileInput } from "@alextheman/components/file";
import { InternalLink } from "@alextheman/components/routing";
import { useSnackbarContext } from "@alextheman/components/snackbar";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useState } from "react";

import useLocation from "src/hooks/useLocation";
import useUploadProfilePictureMutation from "src/resources/Users/queries/useUploadProfilePictureMutation";
import formatError from "src/utility/errors/formatError";
import getDataUrlFromFile from "src/utility/getDataUrlFromFile";

interface UploadProfilePictureProps {
  currentUser: UserProfile;
}

function UploadProfilePicture({ currentUser }: UploadProfilePictureProps) {
  const [file, setFile] = useState<File | null>(null);
  const [display, setDisplay] = useState<string>(currentUser.profilePictureUrl ?? "");
  const { mutateAsync: upload } = useUploadProfilePictureMutation();
  const { addSnackbar } = useSnackbarContext();
  const [_, setLocation] = useLocation();

  async function handleSubmit() {
    try {
      if (file === null) {
        addSnackbar("No file chosen. Please choose a file to upload.", { severity: "info" });
        return;
      }
      await upload(file);
      setLocation(`/users/${currentUser.id}`);
      addSnackbar("Profile picture uploaded", { severity: "success" });
    } catch (error) {
      addSnackbar(formatError(error), { severity: "error" });
    }
  }

  return (
    <Page title="Upload Profile Picture" disablePadding>
      <CardContent>
        <Stack spacing={2}>
          <Avatar src={display} />
          <FileInput
            useDropzone
            multiple={false}
            onFileInput={async (files) => {
              setFile(files[0]);
              setDisplay(await getDataUrlFromFile(files[0]));
            }}
          />
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
        <Button component={InternalLink} to={`/users/${currentUser.id}`}>
          Back
        </Button>
      </CardActions>
    </Page>
  );
}

export default UploadProfilePicture;
