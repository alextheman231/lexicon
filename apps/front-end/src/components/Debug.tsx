import Box from "@mui/material/Box";

interface DebugProps {
  content?: any;
  disableJsonStringify?: boolean;
}

function Debug({ content, disableJsonStringify }: DebugProps) {
  return (
    <Box
      sx={{
        marginTop: 2,
        padding: 1,
        fontFamily: "monospace",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      {disableJsonStringify ? content : JSON.stringify(content, null, 2)}
    </Box>
  );
}

export default Debug;
