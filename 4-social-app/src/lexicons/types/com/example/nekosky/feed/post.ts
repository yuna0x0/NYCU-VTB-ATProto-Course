import type {} from "@atcute/lexicons";
import * as v from "@atcute/lexicons/validations";
import type {} from "@atcute/lexicons/ambient";

const _mainSchema = /*#__PURE__*/ v.record(
  /*#__PURE__*/ v.tidString(),
  /*#__PURE__*/ v.object({
    $type: /*#__PURE__*/ v.literal("com.example.nekosky.feed.post"),
    /**
     * Timestamp of when the post was created.
     */
    createdAt: /*#__PURE__*/ v.datetimeString(),
    /**
     * Reply reference if this post is a reply.
     */
    get reply() {
      return /*#__PURE__*/ v.optional(replyRefSchema);
    },
    /**
     * The post text content.
     * @maxLength 3000
     * @maxGraphemes 300
     */
    text: /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
      /*#__PURE__*/ v.stringLength(0, 3000),
      /*#__PURE__*/ v.stringGraphemes(0, 300),
    ]),
  }),
);
const _replyRefSchema = /*#__PURE__*/ v.object({
  $type: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.literal("com.example.nekosky.feed.post#replyRef"),
  ),
  get parent() {
    return strongRefSchema;
  },
  get root() {
    return strongRefSchema;
  },
});
const _strongRefSchema = /*#__PURE__*/ v.object({
  $type: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.literal("com.example.nekosky.feed.post#strongRef"),
  ),
  cid: /*#__PURE__*/ v.cidString(),
  uri: /*#__PURE__*/ v.resourceUriString(),
});

type main$schematype = typeof _mainSchema;
type replyRef$schematype = typeof _replyRefSchema;
type strongRef$schematype = typeof _strongRefSchema;

export interface mainSchema extends main$schematype {}
export interface replyRefSchema extends replyRef$schematype {}
export interface strongRefSchema extends strongRef$schematype {}

export const mainSchema = _mainSchema as mainSchema;
export const replyRefSchema = _replyRefSchema as replyRefSchema;
export const strongRefSchema = _strongRefSchema as strongRefSchema;

export interface Main extends v.InferInput<typeof mainSchema> {}
export interface ReplyRef extends v.InferInput<typeof replyRefSchema> {}
export interface StrongRef extends v.InferInput<typeof strongRefSchema> {}

declare module "@atcute/lexicons/ambient" {
  interface Records {
    "com.example.nekosky.feed.post": mainSchema;
  }
}
