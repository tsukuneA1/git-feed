import { addSeconds } from "date-fns";
import { MOCK_FEEDS, MOCK_RELOAD_FEEDS, MOCK_TAGS } from "@/mocks/data";
import type {
  MockAuthState,
  MockFeedItem,
  MockTag,
  TagPageResponse,
  TimelineResponse
} from "@/mocks/types";

const RESPONSE_DELAY = 250;
const PAGE_SIZE = 20;

class MockServerError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.code = code;
  }
}

let configuredTagIds = [
  "typescript",
  "javascript",
  "react",
  "nextjs",
  "tailwind",
  "testing",
  "go"
];
let selectedTagIds = [...configuredTagIds];
let firstSelectionInitialised = false;
let currentFeeds: MockFeedItem[] = [...MOCK_FEEDS];
let reloadCursor = 0;
let timelineUpdatedAt = new Date().toISOString();
let reloadAttempt = 0;

let authState: MockAuthState = {
  status: "signed-out"
};

function delay<T>(value: T, ms = RESPONSE_DELAY): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

function ensureTags(tagIds: string[]) {
  const tagSet = new Set(MOCK_TAGS.map((tag) => tag.id));
  tagIds.forEach((id) => {
    if (!tagSet.has(id)) {
      throw new MockServerError(`Unknown tag: ${id}`, "UNKNOWN_TAG");
    }
  });
}

function filterFeeds(tagIds: string[]) {
  return currentFeeds.filter((feed) => feed.tags.some((tag) => tagIds.includes(tag)));
}

export async function fetchTimeline(): Promise<TimelineResponse> {
  if (configuredTagIds.length === 0) {
    throw new MockServerError(
      "タグが一つも設定されていません。タグ設定画面に遷移してください。",
      "NO_TAGS_CONFIGURED"
    );
  }

  const activeTagIds = selectedTagIds.length > 0 ? selectedTagIds : configuredTagIds;
  const feeds = filterFeeds(activeTagIds);

  return delay({
    feeds,
    selectedTagIds: [...selectedTagIds],
    configuredTagIds: [...configuredTagIds],
    updatedAt: timelineUpdatedAt
  });
}

export async function reloadTimeline(): Promise<TimelineResponse> {
  reloadAttempt += 1;
  if (reloadAttempt % 3 === 0) {
    throw new MockServerError(
      "フィードの取得に失敗しました。ネットワーク状況を確認して再度リロードしてください。",
      "RELOAD_FAILED"
    );
  }

  if (reloadCursor >= MOCK_RELOAD_FEEDS.length) {
    timelineUpdatedAt = new Date().toISOString();
    return delay({
      feeds: filterFeeds(selectedTagIds.length > 0 ? selectedTagIds : configuredTagIds),
      selectedTagIds: [...selectedTagIds],
      configuredTagIds: [...configuredTagIds],
      updatedAt: timelineUpdatedAt
    });
  }

  const nextItem = MOCK_RELOAD_FEEDS[reloadCursor];
  reloadCursor += 1;
  currentFeeds = [nextItem, ...currentFeeds];
  timelineUpdatedAt = addSeconds(new Date(), reloadCursor).toISOString();

  return delay({
    feeds: filterFeeds(selectedTagIds.length > 0 ? selectedTagIds : configuredTagIds),
    selectedTagIds: [...selectedTagIds],
    configuredTagIds: [...configuredTagIds],
    updatedAt: timelineUpdatedAt
  });
}

export async function fetchTagPage(page = 1): Promise<TagPageResponse> {
  const totalPages = Math.ceil(MOCK_TAGS.length / PAGE_SIZE);
  const clampedPage = Math.max(1, Math.min(page, totalPages));
  const start = (clampedPage - 1) * PAGE_SIZE;
  const tags = MOCK_TAGS.slice(start, start + PAGE_SIZE);

  const defaults =
    selectedTagIds.length === 0 && !firstSelectionInitialised
      ? MOCK_TAGS.map((tag) => tag.id)
      : selectedTagIds;

  return delay({
    tags,
    page: clampedPage,
    totalPages,
    selectedTagIds: [...defaults]
  });
}

export async function fetchTagCatalogue(page = 1) {
  const totalPages = Math.ceil(MOCK_TAGS.length / PAGE_SIZE);
  const clampedPage = Math.max(1, Math.min(page, totalPages));
  const start = (clampedPage - 1) * PAGE_SIZE;
  const tags = MOCK_TAGS.slice(start, start + PAGE_SIZE);

  return delay({
    tags,
    page: clampedPage,
    totalPages
  });
}

export async function fetchConfiguredTags(): Promise<string[]> {
  return delay([...configuredTagIds]);
}

export async function saveSelectedTags(tagIds: string[]): Promise<string[]> {
  ensureTags(tagIds);
  selectedTagIds = [...tagIds];
  firstSelectionInitialised = true;
  timelineUpdatedAt = new Date().toISOString();
  return delay([...selectedTagIds]);
}

export async function saveConfiguredTags(tagIds: string[]): Promise<string[]> {
  ensureTags(tagIds);
  if (tagIds.length === 0) {
    throw new MockServerError("少なくとも1つはタグを選択してください。", "NO_TAG_SELECTED");
  }

  configuredTagIds = [...tagIds];
  if (selectedTagIds.length === 0) {
    selectedTagIds = [...configuredTagIds];
  } else {
    selectedTagIds = selectedTagIds.filter((id) => configuredTagIds.includes(id));
  }
  timelineUpdatedAt = new Date().toISOString();
  return delay([...configuredTagIds]);
}

export async function fetchAuth(): Promise<MockAuthState> {
  return delay({ ...authState });
}

type SignInMode = "success" | "network-error" | "denied" | "token-error";

export async function signIn(mode: SignInMode): Promise<MockAuthState> {
  switch (mode) {
    case "success":
      authState = {
        status: "signed-in",
        userName: "demo-user",
        lastSignedInAt: new Date().toISOString(),
        welcomeMessage: undefined
      };
      return delay({ ...authState });
    case "network-error":
      throw new MockServerError(
        "ネットワークエラーが発生しました。後でもう一度試してください。",
        "NETWORK_ERROR"
      );
    case "denied":
      throw new MockServerError("認可画面でキャンセルされました。", "DENIED");
    case "token-error":
      throw new MockServerError("アクセストークンの取得に失敗しました。", "TOKEN_ERROR");
    default:
      throw new MockServerError("不明なエラーが発生しました。", "UNKNOWN");
  }
}

type SignOutMode = "success" | "network-error";

export async function signOut(mode: SignOutMode = "success"): Promise<MockAuthState> {
  if (mode === "network-error") {
    throw new MockServerError("サインアウトに失敗しました。ネットワーク状況を確認し、再試行してください。", "SIGNOUT_NETWORK_ERROR");
  }

  authState = { status: "signed-out" };
  return delay({ ...authState });
}

type SignUpMode = "success" | "no-account" | "creation-error";

export async function signUp(mode: SignUpMode): Promise<MockAuthState> {
  switch (mode) {
    case "success":
      authState = {
        status: "signed-in",
        userName: "new-user",
        lastSignedInAt: new Date().toISOString(),
        welcomeMessage: "Git Feedへようこそ！興味のあるタグを設定してタイムラインをカスタマイズしましょう。"
      };
      return delay({ ...authState });
    case "no-account":
      throw new MockServerError("GitHubアカウントを所持していません。GitHubでアカウントを作成してから再試行してください。", "NO_ACCOUNT");
    case "creation-error":
      throw new MockServerError("ユーザー作成に失敗しました。時間をおいて再度お試しください。", "SIGNUP_FAILED");
    default:
      throw new MockServerError("不明なエラーが発生しました。", "UNKNOWN");
  }
}

export class MockServer {
  static isMockServerError(error: unknown, code?: string): error is MockServerError {
    return (
      error instanceof MockServerError && (code ? error.code === code : Boolean(error.code))
    );
  }
}
