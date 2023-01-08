import { TOMNode, DesignToken, Extension, Group, RootGroup } from '@udt/tom';
import { serializeValue } from './values/serialize-value';

function serializeCommonProps(node: TOMNode) {
  return {
    $type: node.getType(),
    $description: node.getDescription(),
  };
}

function serializeDesignToken(token: DesignToken) {
  let extensions: Record<string, Extension> | undefined;
  if (token.hasExtensions()) {
    extensions = {};
    for (const [key, extension] of token.extensions()) {
      extensions[key] = extension;
    }
  }


  return {
    ...serializeCommonProps(token),

    $value: serializeValue(token.getValue(), token.getResolvedType()),
    $extensions: extensions,
  };
}

function serializeGroup(group: Group) {
  const output: any = {
    ...serializeCommonProps(group),
  };

  for (const child of group) {
    if (child instanceof DesignToken) {
      output[child.getName()] = serializeDesignToken(child);
    }
    else {
      output[child.getName()] = serializeGroup(child);
    }
  }

  return output;
}


export function serializeDtcgFile(file: RootGroup) {
  return serializeGroup(file);
}
