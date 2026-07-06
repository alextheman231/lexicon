import type { DialogProps } from "@mui/material/Dialog";

import { createListQueryBoundary } from "@alextheman/components/QueryBoundary";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import z from "zod";

import createObjectQueryBoundary from "src/groups/QueryBoundary/creators/createObjectQueryBoundary";
import useAppForm from "src/hooks/useAppForm";
import useBlogCollectionOptionsQuery from "src/resources/BlogCollections/queries/useBlogCollectionOptionsQuery";
import useBlogQuery from "src/resources/Blogs/queries/useBlogQuery";

const formSchema = z.object({
  blogCollectionIds: z.array(z.uuid()),
});

export type BlogCollectionsFormValidatedType = z.output<typeof formSchema>;

interface BlogCollectionsFormProps extends Omit<DialogProps, "onClose" | "onSubmit"> {
  onClose: () => void | Promise<void>;
  onSubmit?: (data: BlogCollectionsFormValidatedType) => void | Promise<void>;
  blogId: string;
}

function BlogCollectionsForm({
  open,
  onClose,
  blogId,
  onSubmit,
  ...props
}: BlogCollectionsFormProps) {
  const { data, isPending, error } = useBlogQuery(blogId);
  const {
    data: optionsData,
    isPending: isOptionsPending,
    error: optionsError,
  } = useBlogCollectionOptionsQuery({ selectedBlogId: blogId });
  const QueryBoundaryOptions = createListQueryBoundary({
    query: { data: optionsData, isLoading: isOptionsPending, error: optionsError },
  });
  const QueryBoundaryBlog = createObjectQueryBoundary({
    query: { data, isLoading: isPending, error },
  });

  const form = useAppForm({
    validators: {
      onSubmit: formSchema,
    },
    defaultValues: {
      blogCollectionIds: optionsData
        ? optionsData
            .filter((option) => {
              return option.selected;
            })
            .map((option) => {
              return option.id;
            })
        : [""],
    },
    onSubmit: ({ value }) => {
      onSubmit?.(value);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} {...props}>
      <DialogTitle>
        <QueryBoundaryBlog.Data>
          {(blog) => {
            return `Add "${blog.title}" to collection(s) (Feature not yet available)`;
          }}
        </QueryBoundaryBlog.Data>
      </DialogTitle>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await form.handleSubmit();
        }}
      >
        <DialogContent>
          <List>
            <form.AppField name="blogCollectionIds">
              {(field) => {
                return (
                  <QueryBoundaryOptions.DataMap>
                    {(option) => {
                      return (
                        <ListItem>
                          <FormControlLabel
                            label={option.name}
                            control={
                              <Checkbox
                                checked={field.state.value.includes(option.id)}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    field.handleChange([...field.state.value, option.id]);
                                  } else {
                                    field.handleChange(
                                      field.state.value.filter((id) => {
                                        return id !== option.id;
                                      }),
                                    );
                                  }
                                }}
                              />
                            }
                          />
                        </ListItem>
                      );
                    }}
                  </QueryBoundaryOptions.DataMap>
                );
              }}
            </form.AppField>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
          <form.AppForm>
            <form.SubmitButton disabled />
          </form.AppForm>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default BlogCollectionsForm;
