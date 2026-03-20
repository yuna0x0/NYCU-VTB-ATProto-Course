import type {} from "@atcute/lexicons";
import * as v from "@atcute/lexicons/validations";
import type {} from "@atcute/lexicons/ambient";

const _authorViewSchema = /*#__PURE__*/ v.object({
  $type: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.literal("com.example.nekosky.feed.getTimeline#authorView"),
  ),
  avatar: /*#__PURE__*/ v.optional(/*#__PURE__*/ v.genericUriString()),
  did: /*#__PURE__*/ v.didString(),
  displayName: /*#__PURE__*/ v.optional(/*#__PURE__*/ v.string()),
  handle: /*#__PURE__*/ v.handleString(),
});
const _feedItemSchema = /*#__PURE__*/ v.object({
  $type: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.literal("com.example.nekosky.feed.getTimeline#feedItem"),
  ),
  get post() {
    return postViewSchema;
  },
});
const _mainSchema = /*#__PURE__*/ v.query(
  "com.example.nekosky.feed.getTimeline",
  {
    params: /*#__PURE__*/ v.object({
      /**
       * Pagination cursor.
       */
      cursor: /*#__PURE__*/ v.optional(/*#__PURE__*/ v.string()),
      /**
       * Number of posts to return.
       * @minimum 1
       * @maximum 100
       * @default 50
       */
      limit: /*#__PURE__*/ v.optional(
        /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.integer(), [
          /*#__PURE__*/ v.integerRange(1, 100),
        ]),
        50,
      ),
    }),
    output: {
      type: "lex",
      schema: /*#__PURE__*/ v.object({
        cursor: /*#__PURE__*/ v.optional(/*#__PURE__*/ v.string()),
        get feed() {
          return /*#__PURE__*/ v.array(feedItemSchema);
        },
      }),
    },
  },
);
const _postViewSchema = /*#__PURE__*/ v.object({
  $type: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.literal("com.example.nekosky.feed.getTimeline#postView"),
  ),
  get author() {
    return authorViewSchema;
  },
  cid: /*#__PURE__*/ v.cidString(),
  indexedAt: /*#__PURE__*/ v.datetimeString(),
  record: /*#__PURE__*/ v.unknown(),
  uri: /*#__PURE__*/ v.resourceUriString(),
});

type authorView$schematype = typeof _authorViewSchema;
type feedItem$schematype = typeof _feedItemSchema;
type main$schematype = typeof _mainSchema;
type postView$schematype = typeof _postViewSchema;

export interface authorViewSchema extends authorView$schematype {}
export interface feedItemSchema extends feedItem$schematype {}
export interface mainSchema extends main$schematype {}
export interface postViewSchema extends postView$schematype {}

export const authorViewSchema = _authorViewSchema as authorViewSchema;
export const feedItemSchema = _feedItemSchema as feedItemSchema;
export const mainSchema = _mainSchema as mainSchema;
export const postViewSchema = _postViewSchema as postViewSchema;

export interface AuthorView extends v.InferInput<typeof authorViewSchema> {}
export interface FeedItem extends v.InferInput<typeof feedItemSchema> {}
export interface PostView extends v.InferInput<typeof postViewSchema> {}

export interface $params extends v.InferInput<mainSchema["params"]> {}
export interface $output extends v.InferXRPCBodyInput<mainSchema["output"]> {}

declare module "@atcute/lexicons/ambient" {
  interface XRPCQueries {
    "com.example.nekosky.feed.getTimeline": mainSchema;
  }
}
