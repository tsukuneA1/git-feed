# Domain ER Diagram (Draft)

サービス全体の主要エンティティを俯瞰するための仮置きER図です。今後のコンテキスト分割やAPI契約整理のベースとして利用します。

```mermaid
erDiagram
    USER ||--o{ AUTH_SESSION : "maintains"
    USER ||--o{ GITHUB_TOKEN : "authorizes"
    USER ||--o{ USER_TAG_SETTING : "configures"
    USER ||--o{ TIMELINE_SELECTION : "owns"
    USER ||--o{ USER_FEED_CURSOR : "tracks"

    TAG ||--o{ USER_TAG_SETTING : "selected by"
    TAG ||--o{ TIMELINE_SELECTION_TAG : "active in"
    TAG ||--o{ FEED_ITEM_TAG : "categorizes"

    TIMELINE_SELECTION ||--o{ TIMELINE_SELECTION_TAG : "includes"
    FEED_ITEM ||--o{ FEED_ITEM_TAG : "tagged with"

    USER {
      string id PK
      int github_user_id UK
      string display_name
      string avatar_url
      datetime onboarding_completed_at
      datetime created_at
      datetime updated_at
    }

    AUTH_SESSION {
      string id PK
      string user_id FK
      string provider
      datetime expires_at
      datetime created_at
    }

    GITHUB_TOKEN {
      string id PK
      string user_id FK
      string token_type
      string scope
      string access_token_encrypted
      string refresh_token_encrypted
      datetime expires_at
      datetime refreshed_at
    }

    TAG {
      string id PK
      string display_name
      string source_type
      string github_query
      int popularity_rank
      boolean is_active
      datetime created_at
      datetime updated_at
    }

    USER_TAG_SETTING {
      string id PK
      string user_id FK
      string tag_id FK
      string selection_origin
      datetime created_at
    }

    TIMELINE_SELECTION {
      string id PK
      string user_id FK
      string selection_mode
      datetime persisted_at
    }

    TIMELINE_SELECTION_TAG {
      string timeline_selection_id FK
      string tag_id FK
      int position
      PK { timeline_selection_id, tag_id }
    }

    FEED_ITEM {
      string id PK
      string github_pull_id UK
      string repo_full_name
      string title
      string summary
      int additions
      int deletions
      datetime merged_at
      int star_count
      string primary_language
      datetime fetched_at
    }

    FEED_ITEM_TAG {
      string feed_item_id FK
      string tag_id FK
      PK { feed_item_id, tag_id }
    }

    USER_FEED_CURSOR {
      string id PK
      string user_id FK
      datetime last_merged_at
      string last_pr_node_id
      datetime updated_at
    }
```

