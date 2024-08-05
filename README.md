## Clone the project repository
```sh
gh repo clone MillhioreBT/millhiore-tfs
```

## Screenshots
![image](https://github.com/user-attachments/assets/6667532a-b564-4946-b3d2-2df004a30c04)

## Open the terminal in the root folder of the project and run the following command
```sh
pnpm install
```

## Configure the `env.` file
```
TURSO_DATABASE_URL='libsql://example.turso.io'
TURSO_AUTH_TOKEN=''
ACCESS_TOKEN_KEY=''
ACCESS_TOKEN_EXPIRES_IN='1d'
REFRESH_TOKEN_KEY=''
REFRESH_TOKEN_EXPIRES_IN='7d'
REFRESH_TOKEN_MAX_USES=3
GITHUB_CLIENT_ID=''
GITHUB_CLIENT_SECRET=''
PERPLEXITY_API_KEY=''
NEW_ACCOUNT_TOKENS=3
```

## Now you can start the project in development mode locally
```sh
pnpm dev
```
