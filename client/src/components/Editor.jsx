import React, { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";

const Editor = () => {
  useEffect(() => {
    async function init() {
      let view = new EditorView({
        extensions: [
          basicSetup,
          javascript(),
          EditorView.theme({
            ".cm-content": { color: "darkorange" },
            "&.cm-focused .cm-content": { color: "orange" },
          }),
        ],
        parent: document.getElementById("realtimeEditor"),
      });
    }
    init();
  }, []);

  return <div id="realtimeEditor"></div>;
};

export default Editor;
