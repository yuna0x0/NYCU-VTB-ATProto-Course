import type {} from "@atcute/lexicons";
import * as v from "@atcute/lexicons/validations";
import type {} from "@atcute/lexicons/ambient";

const _mainSchema = /*#__PURE__*/ v.record(
  /*#__PURE__*/ v.tidString(),
  /*#__PURE__*/ v.object({
    $type: /*#__PURE__*/ v.literal("com.example.linkinbio.link"),
    /**
     * Timestamp of when the link was created.
     */
    createdAt: /*#__PURE__*/ v.datetimeString(),
    /**
     * Optional emoji rendered next to the title.
     * @maxLength 8
     * @maxGraphemes 1
     */
    emoji: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 8),
        /*#__PURE__*/ v.stringGraphemes(0, 1),
      ]),
    ),
    /**
     * Display title for the link button.
     * @minLength 1
     * @maxLength 640
     * @maxGraphemes 64
     */
    title: /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
      /*#__PURE__*/ v.stringLength(1, 640),
      /*#__PURE__*/ v.stringGraphemes(0, 64),
    ]),
    /**
     * Destination URL for this link.
     * @maxLength 2048
     */
    url: /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.genericUriString(), [
      /*#__PURE__*/ v.stringLength(0, 2048),
    ]),
  }),
);

type main$schematype = typeof _mainSchema;

export interface mainSchema extends main$schematype {}

export const mainSchema = _mainSchema as mainSchema;

export interface Main extends v.InferInput<typeof mainSchema> {}

declare module "@atcute/lexicons/ambient" {
  interface Records {
    "com.example.linkinbio.link": mainSchema;
  }
}
