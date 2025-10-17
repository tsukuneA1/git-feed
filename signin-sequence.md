```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Frontend as Next.js
    participant GitHub as GitHub OAuth
    participant API as Rails API Server
    participant DB as データベース

    User ->> Frontend: 「GitHubでサインイン」クリック
    Frontend ->> Frontend: state, code_verifier生成
    Frontend ->> GitHub: Redirect (state, code_challenge付き)
    GitHub ->> User: 認可画面表示
    User ->> GitHub: 認可を許可
    GitHub ->> Frontend: Redirect with code,state
    Frontend ->> API: code, state, code_verifierを渡す
    API ->> API: state検証
    API ->> GitHub: code, client_secret, code_verifierを渡す
    GitHub -->> API: access_token
    API ->> GitHub: GET request with access_token
    GitHub -->> API: user_info (id, login, email) 
    API ->> DB: find_or_create_user(github_id, user_info)
    DB -->> API: user_record
    API ->> Frontend: JWT token + user info
    Frontend ->> User: ログイン完了画面へ遷移
```
