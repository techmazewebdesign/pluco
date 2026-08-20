# Google One Tap configuration

The site defaults to the existing Firebase web OAuth client for the
`pluco-group` project. `GOOGLE_ONE_TAP_CLIENT_ID` can override it without a code
change. The OAuth client must list these authorized JavaScript origins:

- `https://plucogroup.com`
- `https://www.plucogroup.com`
- `http://localhost:3000` for local testing

Google must remain enabled as a Firebase Authentication provider. The client ID
is a public browser identifier; never expose the OAuth client secret.
