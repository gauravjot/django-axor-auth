export function blockquoteAlertWrapper(md) {
	const defaultBlockquoteRender = md.renderer.rules.blockquote_open || function(tokens, idx, options, env, self) {
	  return self.renderToken(tokens, idx, options);
	};

	md.renderer.rules.blockquote_open = function(tokens, idx, options, env, self) {

		// find inline in nested
	  let inline: any = null;
	  let i = idx;
	  while (tokens[i]['type'] !== 'blockquote_close') {
		if (tokens[i]['type'] === 'inline') {
			inline = tokens[i];
			break;
		} else {
			i++;
		}
	  }
    let is_alert = true;
    if (inline) {
      if (inline.children[0]['content'] === "[!NOTE]") {
        tokens[i].children[0]['content'] = "Note";
        tokens[idx]['attrs'] = [["class", "blockquote-alert note-alert"]];
      } else if (inline.children[0]['content'] === "[!TIP]") {
        tokens[i].children[0]['content'] = "Tip";
        tokens[idx]['attrs'] = [["class", "blockquote-alert tip-alert"]];
      } else if (inline.children[0]['content'] === "[!IMPORTANT]") {
        tokens[i].children[0]['content'] = "Important";
        tokens[idx]['attrs'] = [["class", "blockquote-alert imp-alert"]];
      } else if (inline.children[0]['content'] === "[!CAUTION]") {
        tokens[i].children[0]['content'] = "Caution";
        tokens[idx]['attrs'] = [["class", "blockquote-alert caution-alert"]];
      } else if (inline.children[0]['content'] === "[!WARNING]") {
        tokens[i].children[0]['content'] = "Warning";
        tokens[idx]['attrs'] = [["class", "blockquote-alert warn-alert"]];
      } else {
        is_alert = false;
      }
    } else {
      is_alert = false;
    }


	  if (is_alert) {
		let new_token = structuredClone(tokens[i].children[0]);
		new_token['type'] = 'inline';
		new_token['tag'] = 'span';
		new_token['nesting'] = 1;
		new_token['content'] = null;
		new_token['level'] = 1;
		new_token['attrs'] = [["class", "blockquote-alert-icon"]];
		new_token['children'] = null;
		let new_token_closing = structuredClone(new_token);
		new_token_closing['nesting'] = -1;
        let new_token_no_attrs = structuredClone(new_token);
		new_token_no_attrs['attrs'] = [["class", "blockquote-alert-text"]];
		let new_token_no_attrs_closing = structuredClone(new_token_no_attrs);
		new_token_no_attrs_closing['nesting'] = -1;
		tokens[i].children = [
			new_token,
			new_token_closing,
            new_token_no_attrs,
            tokens[i].children[0],
            new_token_no_attrs_closing,
			...tokens[i].children.splice(1)
		]
	  }

	  return defaultBlockquoteRender(tokens, idx, options, env, self);

	};
  }
