# Incident on 11/6/2026 - Auth Failure

**Severity**: Medium
**Incident Type**: Deployment Failure

This document details a serious incident related to `lexicon` which affected regular usage. Please read below for a description of what went wrong and the steps being taken to resolve it.

## Description of Incident

### Incident Summary

- When trying to sign into Lexicon, we were unable to because of a Client Not Found error.
- On top of that, inspecting the error further was made harder by the fact that at the time I was locked out of my HCP Terraform account, so I could not change the Terraform variables there directly.

### Cause(s) of Incident

- A trailing newline.
- A single Goddamn trailing new line! I literally cannot believe it.
- The `GOOGLE_CLIENT_ID` production environment variable contained a trailing newline character `\n`. As a result, Google received a different client ID than the one configured in Google Cloud, causing the OAuth flow to fail with 401 invalid_client.

### Consequences of Incident

- Users were locked out of Lexicon and could not access their blogs as usual.
- I could not debug production variables because I was locked out of HCP Terraform.

## Timeline

- I notice auth in Lexicon was not working when I tried logging in. At the time, I was away from home and had to debug from my phone.
- I then suspect the issue may be because of the recent back-end directory refactor, which changed the directory structure and was already known to mess with environment variable resolution a bit due to potential ordering changes.
- I push a refactor of the `COOKIES` constant (which uses an `ENV` variable parsed and derived from `process.env.NODE_ENV`) to be `loadCookies` instead, in the hope that it resolves the cookies on call of the function rather than at the module level.
- That did not work and I realise I tortured myself working with GitHub Codespaces on my phone for a solution that did not fix it.
- When I get home and have access to my laptop, I try logging into HCP Terraform to see what I can get from the production variables, but I could not access my account for some reason.
- I check the environment variables in Render directly and notice the Google Client Secret there does not match what I have backed up on my local machine.
- I change the secret to the backed-up secret but it did not fix it.
- I then realise that the secret in Render is correct and the Google Client ID is the actual issue.
- I realise `%0A` is a URL-encoded newline character.
- I notice the newline at the end of the ID and scream.
- I remove the newline.
- It works and my sanity is no longer intact.

## Action Plan

- Fear the newline character!
- Ok, on a serious note, I don't think there's really much I could've done too differently.
- I think, maybe the main one is to ensure that my local `.env` and HCP Terraform are as in-sync as possible so that I can always refer to that to see what the current production variables are. But even then, that probably wouldn't have caught the newline character thing, so... yeah.
- I think using HCP Terraform is still the right call, though - as otherwise we have to store the secrets in this repository itself for use in the configuration/GitHub Actions, which is problematic in its own way as you'd need to manage encrypting/decrypting it yourself, and the GitHub Actions would need to do so as well.
- We could potentially look into a nicer service to store the variables in, as HCP Terraform can be a bit difficult to enter values into at times, but given that I'm the only one who has access to the production variables as of now I'm not sure it's too worth it as I'm used to this.
- I guess, for me, just really double-check the values I enter there, and do keep that local backup in case we do end up losing access to HCP Terraform again. That way everything can still at least be recovered in the worst possible case, and we continue to have at least some frame of reference for what the variables should be.
- We should also validate the Google Client ID to ensure that it matches the expected shape.
    - I think for now, we just need to check that it ends with `.apps.googleusercontent.com`, without any trailing whitespace at the end. This will catch most invalid ID configurations already, including the one that caused all this.

## Additional Notes

- I was not in the luckiest of situations when it came to attempting a fix for this:
    - I couldn't access Terraform so I had limited access to the production variables
    - When I noticed the bug I didn't have my laptop on me, so I was left debugging on my phone for some time.
- However, there were still a few lucky moments that paid off:
    - I could at least still run the Terraform plan and apply new changes - I don't need HCP Terraform access for that as those happen in GitHub Actions.
        - HCP Terraform is only really needed for changing production environment variables - most other concerns are part of this repository itself or other means.
    - Render actually does give you direct access to the production environment variables, so I could see their actual values there and compare them against what they should be.
        - This does include secrets as of now, though, which in general is not ideal, but in this case it did kind of help me out a bit so I can see what the currently stored secret is and whether or not it differs from what it should be.
    - I kept a local copy of the environment variables so I had some point of reference for what they should be.
    - And let's be real, the fact that I actually did go and try to debug the issue in a GitHub Codespace on my phone is a pretty big power move!
