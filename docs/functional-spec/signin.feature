 Feature: GitHubサインイン機能
  As a ユーザー
  I want GitHubアカウントでサインインできるようにしたい
  So that サイトのページを閲覧できるようにする

  Scenario: サインインしていない状態でサインインボタンを押す
    Given サインインしていないとき
    When サインインボタンを押すと
    Then サインイン専用画面に遷移する

  Scenario: サインインが必須のページにアクセスする
    Given サインインしていないとき
    When サイトを閲覧しようとすると
    Then サインインページにリダイレクトする

  Scenario: サインイン専用画面でGitHubサインインに成功する
    Given サインイン専用画面に遷移している
    When 「GitHubでサインイン」と書かれたボタンを押す
    Then サインインが成功し、トップページに遷移する

  Scenario: サインイン専用画面でGitHubサインインに失敗する
    Given サインイン専用画面に遷移している
    When 「GitHubでサインイン」と書かれたボタンを押す
    Then サインインできず、エラーメッセージが表示される

  Scenario: アクセストークンの取得に失敗した場合
    Given GitHub OAuth フロー中
    When アクセストークンの取得に失敗した
    Then エラーメッセージを表示し、再試行できるようにする

  Scenario: 認可画面でユーザーが許可しなかった場合
    Given GitHub OAuth フロー中
    When ユーザーが認可画面で許可しなかった
    Then サインイン画面に戻し、キャンセルメッセージを表示し、再試行できるようにする

  Scenario: ネットワークやGitHub APIに障害が発生した場合
    Given GitHub OAuth フロー中
    When ネットワークまたはGitHub APIに障害が発生した
    Then 「後でもう一度試してください」と表示し、サインインページに遷移する

  Scenario: GitHubの認可画面で許可を押した場合
    When GitHubの認可画面で「許可」を押すと
    Then リダイレクトし、トップページに遷移する

  Scenario: すでにサインインしている状態でサインインページに行く
    Given サインインしているとき
    When サインインページに行くと
    Then トップページに遷移する

  Scenario: 同一アカウントで複数端末からサインインする
    Given 既に同じアカウントで端末Aでサインインしている
    When 端末Bで同じアカウントでサインインする
    Then 端末Bもサインインできる
      And 端末Aのセッションは維持される
