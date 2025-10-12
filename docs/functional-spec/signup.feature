Feature: GitHub OAuthによる新規アカウント作成
  As a 新規ユーザー
  I want GitHubアカウントでログインできる
  So that アカウントを自動作成して簡単にサービスを利用できる

  Scenario: GitHubアカウントがアプリに未登録の場合
    Given GitHub OAuth フロー中
    When アプリ側に該当GitHubアカウントが登録されていない
    Then 新規ユーザーとしてアカウントが自動作成される
      And トップページに遷移する
      And ウェルカムメッセージを表示する

  Scenario: GitHubアカウントを所持していなかった場合
    Given GitHub OAuth フロー中
    When GitHubアカウントを所持していなかった
    Then 「GitHubアカウントを所持していません」と表示され、サインアップできない

  Scenario: 新規ユーザー作成に失敗した場合（DBエラーなど）
    Given GitHub OAuth フロー中
    When 新規ユーザー作成に失敗した
    Then エラーメッセージを表示する
      And サインインページに戻す
