import type { BlogView } from "@lexicon/models";
import type { DialogProps } from "@mui/material/Dialog";

import { createObjectQueryBoundary } from "@alextheman/components/QueryBoundary";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import useBlogQuery from "src/resources/Blogs/queries/useBlogQuery";

interface ArchiveBlogDialog extends Omit<DialogProps, "onClose" | "onSubmit"> {
  onClose: () => void | Promise<void>;
  onSubmit: (data: BlogView) => void | Promise<void>;
  blogId: string;
  disabled?: boolean;
}

function ArchiveBlogDialog({
  open,
  onClose,
  onSubmit,
  blogId,
  disabled,
  ...props
}: ArchiveBlogDialog) {
  const { data, isPending, error } = useBlogQuery(blogId);
  const QueryBoundaryBlog = createObjectQueryBoundary({
    query: { data, isLoading: isPending, error },
  });

  return (
    <Dialog open={open} onClose={onClose} {...props}>
      <DialogTitle>
        <QueryBoundaryBlog.Error />
        <QueryBoundaryBlog.Data>
          {(blog) => {
            return `Archive ${blog.title}`;
          }}
        </QueryBoundaryBlog.Data>
      </DialogTitle>
      <DialogContent>
        <QueryBoundaryBlog.Data>
          {(blog) => {
            return (
              <>
                <Typography>
                  Are you sure you want to archive "{blog.title}"?
                </Typography>
                <Typography>
                  It will be archived for 30 days, after which it will be properly deleted.
                </Typography>
              </>
          }}
        </QueryBoundaryBlog.Data>
      </DialogContent>
      <Divider />
      <DialogActions>
        <QueryBoundaryBlog.Data>
          {(blog) => {
            return (
              <>
                <Button onClick={onClose} disabled={disabled}>
                  No
                </Button>
                <Button
                  onClick={async () => {
                    await onSubmit(blog);
                  }}
                  variant="contained"
                  disabled={disabled}
                >
                  Yes
                </Button>
              </>
            );
          }}
        </QueryBoundaryBlog.Data>
      </DialogActions>
    </Dialog>
  );
}

export default ArchiveBlogDialog;
