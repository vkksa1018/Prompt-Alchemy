// 範例輸出（exampleOutput）的形狀轉換。
//
// 表單裡的 block 形狀是 { type, data: { context, alt, caption } }，
// 送出後才補上 seq。這裡是「舊形狀 → 表單」與「表單 → 送出」的唯一出入口：
//  - toBlocks：載入表單前用。舊資料可能是純字串或 { outputText, outputImages }。
//  - toPayload：送出前用。依順序補 seq，並裁掉 text 不該有的 alt / caption。
export const BLOCK_TYPES = [
  { value: "text", label: "文字" },
  { value: "image", label: "圖片" },
  { value: "video", label: "影片" },
  { value: "html", label: "HTML" },
];

// text 只有 context；其餘型別才有 alt / caption。
const TYPES_WITH_META = ["image", "video", "html"];

export function hasMetaFields(type) {
  return TYPES_WITH_META.includes(type);
}

// 表單需要每個欄位都有初始值（否則 input 會從 uncontrolled 變 controlled），
// 所以這裡一律把 alt / caption 補成空字串，即使該型別用不到。
function makeBlock(type, context, alt = "", caption = "") {
  return { type, data: { context, alt, caption } };
}

export function createEmptyBlock() {
  return makeBlock("text", "");
}

export function toBlocks(exampleOutput) {
  if (typeof exampleOutput === "string") {
    return exampleOutput.trim() === "" ? [] : [makeBlock("text", exampleOutput)];
  }

  if (Array.isArray(exampleOutput)) {
    return exampleOutput.map((block) =>
      makeBlock(
        block?.type || "text",
        block?.data?.context || "",
        block?.data?.alt || "",
        block?.data?.caption || "",
      ),
    );
  }

  if (exampleOutput && typeof exampleOutput === "object") {
    const blocks = [];
    const outputText = exampleOutput.outputText || "";
    if (outputText.trim() !== "") {
      blocks.push(makeBlock("text", outputText));
    }
    const images = Array.isArray(exampleOutput.outputImages)
      ? exampleOutput.outputImages
      : [];
    images.forEach((image) => {
      // 舊資料常有一筆 url 為空的佔位圖，不該帶進表單。
      if (!image?.url) return;
      blocks.push(makeBlock("image", image.url, image.alt || "", image.caption || ""));
    });
    return blocks;
  }

  return [];
}

export function toPayload(blocks) {
  if (!Array.isArray(blocks)) return [];

  return blocks.map((block, index) => {
    const context = (block?.data?.context || "").trim();
    const data = hasMetaFields(block?.type)
      ? { context, alt: block?.data?.alt || "", caption: block?.data?.caption || "" }
      : { context };

    return { type: block?.type || "text", data, seq: index };
  });
}
