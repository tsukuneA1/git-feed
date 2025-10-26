```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Frontend as Next.js
    participant GitHub as GitHub OAuth
    participant API as Rails API Server
    participant DB as データベース

    User ->> Frontend: 「GitHubでサインイン」クリック
    Frontend ->> Frontend: state, code_verifier生成
    Frontend ->> GitHub: Redirect (state, code_challenge, code_challenge_method=S256付き)
    GitHub ->> User: 認可画面表示
    User ->> GitHub: 認可を許可
    GitHub ->> Frontend: Redirect with code,state
    Frontend ->> API_Auth: POST /auth/github/callback (code, state, code_verifier)
    API_Auth ->> API_Auth: state検証
    API_Auth ->> GitHub: POST /login/oauth/access_token (client_id, client_secret, code, redirect_uri)
    GitHub -->> API_Auth: access_token
    API_Auth ->> GitHub: GET /user with access_token
    GitHub -->> API_Auth: user_info (id, login)
    API_Auth ->> DB: find_user_by_github_id(github_id)
    alt 既存ユーザー（サインイン）
        DB -->> API_Auth: user_record
        API_Auth -->> Frontend: Set-Cookie: JWT (Secure, HttpOnly, SameSite=Lax)
        Frontend ->> User: Redirect to /timeline
    else 新規ユーザー（サインアップ）
        DB -->> API_Auth: null
        API_Auth ->>+ UserService: create_user_if_not_exists(github_id, login)
        UserService ->> DB: insert new user
        DB -->> UserService: user_record
        UserService -->>- API_Auth: user_record
        API_Auth -->> Frontend: Set-Cookie: JWT (Secure, HttpOnly, SameSite=Lax)
        Frontend ->> User: Redirect to /tag-settings
    end
```
