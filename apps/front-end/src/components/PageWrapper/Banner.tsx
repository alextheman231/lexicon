import Alert from "@mui/material/Alert";

function Banner() {
  return (
    <Alert severity="warning">
      There is currently a known issue with Google authentication at the moment preventing users
      from signing in. We are currently looking into the issue and hope to get it resolved soon.
    </Alert>
  );
}

export default Banner;
