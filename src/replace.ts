import { replaceInFile } from "replace-in-file";

export async function replaceTokens(
  tokenPrefix: string,
  tokenSuffix: string,
  files: string[]
) {
  const fromRegEx = new RegExp(
    `${escapeDelimiter(tokenPrefix)}(.+?)${escapeDelimiter(tokenSuffix)}`,
    "gm"
  );
  const matchRegEx = new RegExp(
    `${escapeDelimiter(tokenPrefix)}(.+?)${escapeDelimiter(tokenSuffix)}`
  );

  const result = await replaceInFile({
    files,
    allowEmptyPaths: true,
    from: fromRegEx,
    to: (match: string) => {
      const m = match.match(matchRegEx);
      if (m) {
        const tokenName = m[1];
        if (tokenName && process.env[tokenName]) {
          return process.env[tokenName] || "";
        }
      }

      return match;
    }
  });

  return result.filter(r => r.hasChanged).map(r => r.file);
}

function escapeDelimiter(delimiter: string): string {
  return delimiter.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}
