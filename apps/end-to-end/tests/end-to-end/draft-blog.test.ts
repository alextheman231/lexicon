import { normaliseIndents, UUID_PATTERN } from "@alextheman/utility";
import { expect } from "@playwright/test";

import test from "tests/fixtures";

test.describe("Draft blog", () => {
  test("Can save a blog to drafts and then publish it", async ({ authenticatedPage, baseURL }) => {
    await authenticatedPage.goto("/blogs/new");
    await authenticatedPage.getByLabel("Title").fill("HCP Terraform Plan Output");
    const editor = authenticatedPage.locator('[data-lexical-editor="true"]');

    const content = normaliseIndents`
            Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
            - destroy

            Terraform will perform the following actions:

            # module.services.module.lexicon_database.neon_project.default will be destroyed
            - resource "neon_project" "default" {
                - allowed_ips               = [] -> null
                - compute_provisioner       = "k8s-neonvm" -> null
                - connection_uri            = (sensitive value) -> null
                - connection_uri_pooler     = (sensitive value) -> null
                - database_host             = "ep-polished-night-akgrjxe2.c-3.us-west-2.aws.neon.tech" -> null
                - database_host_pooler      = "ep-polished-night-akgrjxe2-pooler.c-3.us-west-2.aws.neon.tech" -> null
                - database_name             = "lexicon-prod" -> null
                - database_password         = (sensitive value) -> null
                - database_user             = "lexicon-prod_owner" -> null
                - default_branch_id         = "br-cool-grass-akhc5ohk" -> null
                - default_endpoint_id       = "ep-polished-night-akgrjxe2" -> null
                - history_retention_seconds = 21600 -> null
                - id                        = "withered-mouse-11680714" -> null
                - name                      = "Lexicon" -> null
                - org_id                    = "org-calm-sky-47179957" -> null
                - pg_version                = 18 -> null
                - region_id                 = "aws-us-west-2" -> null
                - store_password            = "yes" -> null

                - branch {
                    - database_name = "lexicon-prod" -> null
                    - id            = "br-cool-grass-akhc5ohk" -> null
                    - name          = "main" -> null
                    - role_name     = "lexicon-prod_owner" -> null
                    }

                - default_endpoint_settings {
                    - autoscaling_limit_max_cu = 0.25 -> null
                    - autoscaling_limit_min_cu = 0.25 -> null
                    - id                       = "ep-polished-night-akgrjxe2" -> null
                    - suspend_timeout_seconds  = 0 -> null
                    }

                - maintenance_window {
                    - end_time   = "09:00" -> null
                    - start_time = "08:00" -> null
                    - weekdays   = [
                        - 5,
                        ] -> null
                    }

                - quota {}
                }

            Plan: 0 to add, 0 to change, 1 to destroy.
        `;

    await editor.fill(content);

    const draftButton = authenticatedPage.getByRole("button", { name: "Save as Draft" });
    await expect(draftButton).toBeEnabled();
    await draftButton.click();

    await authenticatedPage.waitForURL(RegExp(`^${baseURL}/blogs/${UUID_PATTERN}$`));
    await expect(authenticatedPage.getByText("Created by Test User")).toBeVisible();
    await expect(authenticatedPage.getByText("Unpublished (saved as draft)")).toBeVisible();

    await authenticatedPage.getByLabel("Blog options").click();

    const editItem = authenticatedPage.getByRole("menuitem", { name: "Edit" });
    await expect(editItem).toBeVisible();
    await editItem.click();
    await authenticatedPage.waitForURL(RegExp(`^${baseURL}/blogs/${UUID_PATTERN}/edit$`));

    const editedContent = normaliseIndents`
            Terraform used the selected providers to generate the following execution plan. Resource actions are indicated with the following symbols:
                + add

            Terraform will perform the following actions:

            # module.services.module.lexicon_database.neon_project.default will be created
            + resource "neon_project" "default" {
                + allowed_ips               = []
                + compute_provisioner       = "k8s-neonvm"
                + connection_uri            = (sensitive value) 
                + connection_uri_pooler     = (sensitive value) 
                + database_host             = "ep-polished-night-akgrjxe2.c-3.us-west-2.aws.neon.tech" 
                + database_host_pooler      = "ep-polished-night-akgrjxe2-pooler.c-3.us-west-2.aws.neon.tech" 
                + database_name             = "lexicon-prod" 
                + database_password         = (sensitive value) 
                + database_user             = "lexicon-prod_owner" 
                + default_branch_id         = "br-cool-grass-akhc5ohk" 
                + default_endpoint_id       = "ep-polished-night-akgrjxe2" 
                + history_retention_seconds = 21600 
                + id                        = "withered-mouse-11680714" 
                + name                      = "Lexicon" 
                + org_id                    = "org-calm-sky-47179957" 
                + pg_version                = 18 
                + region_id                 = "aws-us-west-2" 
                + store_password            = "yes" 

                + branch {
                    + database_name = "lexicon-prod" 
                    + id            = "br-cool-grass-akhc5ohk" 
                    + name          = "main" 
                    + role_name     = "lexicon-prod_owner" 
                    }

                + default_endpoint_settings {
                    + autoscaling_limit_max_cu = 0.25 
                    + autoscaling_limit_min_cu = 0.25 
                    + id                       = "ep-polished-night-akgrjxe2" 
                    + suspend_timeout_seconds  = 0 
                    }

                + maintenance_window {
                    + end_time   = "09:00" 
                    + start_time = "08:00" 
                    + weekdays   = [
                        + 5,
                        ] 
                    }

                + quota {}
                }

            Plan: 1 to add, 0 to change, 0 to destroy.
        `;

    const editPageEditor = authenticatedPage.locator('[data-lexical-editor="true"]');

    await editPageEditor.fill(editedContent);

    const submitButton = authenticatedPage.getByRole("button", { name: "Submit" });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    await authenticatedPage.waitForURL(RegExp(`^${baseURL}/blogs/${UUID_PATTERN}$`));
    expect(authenticatedPage.url()).toMatch(RegExp(`^${baseURL}/blogs/${UUID_PATTERN}$`));
    const newTitle = authenticatedPage.getByText("HCP Terraform Plan Output").first();
    await expect(newTitle).toBeVisible();
    await expect(authenticatedPage.getByText(editedContent)).toBeVisible();

    await expect(authenticatedPage.getByText("Published by Test User")).toBeVisible();
    await expect(authenticatedPage.getByText("Today at")).toBeVisible();
  });
});
