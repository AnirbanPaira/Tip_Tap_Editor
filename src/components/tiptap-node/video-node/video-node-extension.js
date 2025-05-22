import { Node } from '@tiptap/core';

export const VideoNode = Node.create({
  name: 'video',

  group: 'block',

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true, // Add controls by default
        parseHTML: element => element.hasAttribute('controls'),
      },
      // Add other video attributes if needed, e.g., width, height
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
        getAttrs: node => ({
          src: node.getAttribute('src'),
          controls: node.hasAttribute('controls'),
          // Parse other attributes
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    // Ensure controls attribute is included if true
    const attributes = { ...HTMLAttributes };
    if (attributes.controls === true) {
      attributes.controls = ''; // HTML boolean attributes are present or not
    } else {
      delete attributes.controls;
    }
    return ['video', attributes];
  },
});
