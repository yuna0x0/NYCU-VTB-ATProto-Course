import type {} from "@atcute/lexicons";
import * as v from "@atcute/lexicons/validations";
import type {} from "@atcute/lexicons/ambient";

const _mainSchema = /*#__PURE__*/ v.record(
  /*#__PURE__*/ v.literal("self"),
  /*#__PURE__*/ v.object({
    $type: /*#__PURE__*/ v.literal("com.example.linkinbio.profile"),
    /**
     * Timestamp of when the profile was first created.
     */
    createdAt: /*#__PURE__*/ v.datetimeString(),
    /**
     * Short bio/description shown under the display name.
     * @maxLength 2560
     * @maxGraphemes 256
     */
    description: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 2560),
        /*#__PURE__*/ v.stringGraphemes(0, 256),
      ]),
    ),
    /**
     * The profile display name shown on the public page.
     * @maxLength 640
     * @maxGraphemes 64
     */
    displayName: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 640),
        /*#__PURE__*/ v.stringGraphemes(0, 64),
      ]),
    ),
    /**
     * Ordered list of link record rkeys (tids) that defines the display order on the public page.
     * @maxLength 200
     */
    linkOrder: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(
        /*#__PURE__*/ v.array(/*#__PURE__*/ v.tidString()),
        [/*#__PURE__*/ v.arrayLength(0, 200)],
      ),
    ),
    /**
     * Personalized color + mode for this profile.
     */
    get theme() {
      return /*#__PURE__*/ v.optional(themeSchema);
    },
    /**
     * Timestamp of the last profile update.
     */
    updatedAt: /*#__PURE__*/ v.optional(/*#__PURE__*/ v.datetimeString()),
  }),
);
const _themeSchema = /*#__PURE__*/ v.object({
  $type: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.literal("com.example.linkinbio.profile#theme"),
  ),
  /**
   * Accent color as a CSS hex string, e.g. #f291a5 or #f291a5cc.
   * @minLength 4
   * @maxLength 9
   */
  accent: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
      /*#__PURE__*/ v.stringLength(4, 9),
    ]),
  ),
  /**
   * Page background mode.
   */
  mode: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.literalEnum(["dark", "light"]),
  ),
});

type main$schematype = typeof _mainSchema;
type theme$schematype = typeof _themeSchema;

export interface mainSchema extends main$schematype {}
export interface themeSchema extends theme$schematype {}

export const mainSchema = _mainSchema as mainSchema;
export const themeSchema = _themeSchema as themeSchema;

export interface Main extends v.InferInput<typeof mainSchema> {}
export interface Theme extends v.InferInput<typeof themeSchema> {}

declare module "@atcute/lexicons/ambient" {
  interface Records {
    "com.example.linkinbio.profile": mainSchema;
  }
}
